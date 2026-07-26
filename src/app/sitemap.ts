import type { MetadataRoute } from 'next';

import { getPathname } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { SITE_URL, type TypedHref } from '@/lib/metadata';
import { client } from '@/sanity/lib/client';
import { SITEMAP_QUERY } from '@/sanity/lib/queries';

/**
 * Every route in every locale, with `alternates.languages` so search engines
 * treat the Spanish and English versions as translations rather than duplicates.
 *
 * Bypasses the CDN and drafts: a sitemap that advertises an unpublished URL earns
 * a crawl error.
 */
const STATIC_ROUTES = [
  { href: '/', priority: 1 },
  { href: '/sobre-mi', priority: 0.9 },
  { href: '/proyectos', priority: 0.9 },
  { href: '/certificaciones', priority: 0.7 },
  { href: '/contacto', priority: 0.8 },
] as const;

function alternatesFor(href: TypedHref): Record<string, string> {
  return Object.fromEntries(
    routing.locales.map((loc) => [
      loc,
      `${SITE_URL}${getPathname({ href, locale: loc as Locale })}`,
    ])
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const route of STATIC_ROUTES) {
    const languages = alternatesFor(route.href);
    for (const locale of routing.locales) {
      entries.push({
        url: languages[locale],
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: route.priority,
        alternates: { languages },
      });
    }
  }

  try {
    const projects = await client
      .withConfig({ useCdn: false, perspective: 'published' })
      .fetch(SITEMAP_QUERY);

    for (const project of projects ?? []) {
      const languages = alternatesFor({
        pathname: '/proyecto/[id]',
        params: { id: project.slug },
      });
      for (const locale of routing.locales) {
        entries.push({
          url: languages[locale],
          lastModified: new Date(project._updatedAt),
          changeFrequency: 'monthly',
          priority: 0.8,
          alternates: { languages },
        });
      }
    }
  } catch (error) {
    // A Sanity outage should degrade the sitemap, not fail the whole build.
    console.error('Sitemap: failed to fetch projects from Sanity', error);
  }

  return entries;
}
