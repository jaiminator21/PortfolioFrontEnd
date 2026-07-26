import type { Metadata } from 'next';

import { getPathname } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import type { Seo } from '@/sanity/types';

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
).replace(/\/$/, '');

const OG_LOCALES: Record<string, string> = { es: 'es_ES', en: 'en_US' };

/**
 * The href union next-intl's typed routing accepts — either a bare pathname or
 * `{ pathname, params }` for dynamic routes.
 */
export type TypedHref = Parameters<typeof getPathname>[0]['href'];

/**
 * Builds Next.js metadata from a Sanity SEO object.
 *
 * `hreflang` alternates are generated for every locale from the typed pathnames,
 * so the Spanish and English versions of a page are declared as translations of
 * each other rather than competing as duplicate content.
 */
export function buildMetadata({
  seo,
  locale,
  href,
  siteName,
  type = 'website',
}: {
  seo: Seo | null | undefined;
  locale: string;
  href: TypedHref;
  siteName: string;
  type?: 'website' | 'profile' | 'article';
}): Metadata {
  const pathFor = (loc: Locale) => getPathname({ href, locale: loc });

  const canonical = `${SITE_URL}${pathFor(locale as Locale)}`;

  const languages = Object.fromEntries(
    routing.locales.map((loc) => [loc, `${SITE_URL}${pathFor(loc)}`])
  );

  // Strip the *highlight* markers: they style a heading on the page, but would
  // show up as literal asterisks in a search result or a LinkedIn preview.
  const title = (seo?.title || siteName).replace(/\*/g, '');
  const description = seo?.description?.replace(/\*/g, '') || undefined;
  const imageUrl = seo?.image?.url ?? null;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        ...languages,
        // Tells search engines which version to serve when no language matches.
        'x-default': `${SITE_URL}${pathFor(routing.defaultLocale)}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      locale: OG_LOCALES[locale] ?? locale,
      type,
      ...(imageUrl
        ? {
            images: [
              {
                url: `${imageUrl}?w=1200&h=630&fit=crop&auto=format`,
                width: 1200,
                height: 630,
                alt: seo?.image?.alt ?? title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(imageUrl ? { images: [`${imageUrl}?w=1200&h=630&fit=crop&auto=format`] } : {}),
    },
    robots: seo?.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
