import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { JsonLd } from '@/components/sanity/JsonLd';
import { routing } from '@/i18n/routing';
import { breadcrumbSchema, projectSchema } from '@/lib/jsonld';
import { SITE_URL, buildMetadata } from '@/lib/metadata';
import {
  getProfile,
  getProfileForMetadata,
  getProject,
  getProjectForMetadata,
} from '@/sanity/fetch';
import { client } from '@/sanity/lib/client';
import { PROJECT_SLUGS_QUERY } from '@/sanity/lib/queries';
import ProjectDetailView from './ProjectDetailView';

/**
 * Pre-render every project in both locales.
 *
 * `useCdn: false` and the published perspective: static params must come from
 * live, draft-free data, or a build can bake in a slug that does not exist
 * publicly.
 */
export async function generateStaticParams() {
  const slugs = await client
    .withConfig({ useCdn: false, perspective: 'published' })
    .fetch(PROJECT_SLUGS_QUERY);

  return routing.locales.flatMap((locale) =>
    (slugs ?? []).map(({ slug }: { slug: string }) => ({ locale, id: slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const [project, profile] = await Promise.all([
    getProjectForMetadata(locale, id),
    getProfileForMetadata(locale),
  ]);

  if (!project) return {};

  return buildMetadata({
    seo: project.seo,
    locale,
    href: { pathname: '/proyecto/[id]', params: { id } },
    siteName: profile?.fullName ?? '',
    type: 'article',
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const [project, profile] = await Promise.all([
    getProject(locale, id),
    getProfile(locale),
  ]);

  if (!project) {
    notFound();
  }

  const projectsPath = locale === 'en' ? 'projects' : 'proyectos';
  const projectPath = locale === 'en' ? 'project' : 'proyecto';
  const url = `${SITE_URL}/${locale}/${projectPath}/${project.slug}`;

  return (
    <>
      <ProjectDetailView project={project} />

      {profile ? (
        <JsonLd data={projectSchema({ project, profile, siteUrl: SITE_URL, url })} />
      ) : null}

      <JsonLd
        data={breadcrumbSchema([
          { name: profile?.fullName ?? 'Portfolio', url: `${SITE_URL}/${locale}` },
          { name: 'Projects', url: `${SITE_URL}/${locale}/${projectsPath}` },
          { name: project.title ?? project.slug, url },
        ])}
      />
    </>
  );
}
