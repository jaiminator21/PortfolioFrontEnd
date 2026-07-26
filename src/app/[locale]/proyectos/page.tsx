import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import ProjectsHub from '@/components/ProjectsHub';
import { JsonLd } from '@/components/sanity/JsonLd';
import { projectListSchema } from '@/lib/jsonld';
import { SITE_URL, buildMetadata } from '@/lib/metadata';
import {
  getPage,
  getPageForMetadata,
  getProfileForMetadata,
  getProjectsByKind,
} from '@/sanity/fetch';
import styles from '@/styles/SecondaryPage.module.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [page, profile] = await Promise.all([
    getPageForMetadata(locale, 'projects'),
    getProfileForMetadata(locale),
  ]);

  return buildMetadata({
    seo: page?.seo,
    locale,
    href: '/proyectos',
    siteName: profile?.fullName ?? '',
  });
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [page, professional, personal] = await Promise.all([
    getPage(locale, 'projects'),
    getProjectsByKind(locale, 'professional'),
    getProjectsByKind(locale, 'personal'),
  ]);

  return (
    <div className={styles.wrapper}>
      <section className={styles.pageHero}>
        <div className="container-custom">
          <h1 className={styles.pageHeroTitle}>{page?.title}</h1>
          {page?.lead ? <p className={styles.pageHeroLead}>{page.lead}</p> : null}
        </div>
      </section>

      <ProjectsHub professional={professional} personal={personal} />

      {professional.length ? (
        <JsonLd
          data={projectListSchema({ projects: professional, siteUrl: SITE_URL, locale })}
        />
      ) : null}
    </div>
  );
}
