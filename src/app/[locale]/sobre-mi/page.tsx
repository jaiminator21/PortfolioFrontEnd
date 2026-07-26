import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Skills from '@/components/Skills';
import { JsonLd } from '@/components/sanity/JsonLd';
import { SITE_URL, buildMetadata } from '@/lib/metadata';
import {
  getExperience,
  getPage,
  getPageForMetadata,
  getProfile,
  getProfileForMetadata,
  getSkills,
} from '@/sanity/fetch';
import styles from '@/styles/SecondaryPage.module.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [page, profile] = await Promise.all([
    getPageForMetadata(locale, 'about'),
    getProfileForMetadata(locale),
  ]);

  return buildMetadata({
    seo: page?.seo ?? profile?.seo,
    locale,
    href: '/sobre-mi',
    siteName: profile?.fullName ?? '',
    type: 'profile',
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [profile, page, experience, skills] = await Promise.all([
    getProfile(locale),
    getPage(locale, 'about'),
    getExperience(locale),
    getSkills(locale),
  ]);

  if (!profile) return null;

  return (
    <div className={styles.wrapper}>
      {/*
        AboutPage points at the Person defined once in the layout via @id, rather
        than restating the identity and risking two conflicting descriptions.
      */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          inLanguage: locale,
          mainEntity: { '@id': `${SITE_URL}/#person` },
        }}
      />

      <section className={styles.pageHero}>
        <div className="container-custom">
          <h1 className={styles.pageHeroTitle}>{page?.title}</h1>
          {page?.lead ? <p className={styles.pageHeroLead}>{page.lead}</p> : null}
        </div>
      </section>

      <About profile={profile} />
      <Experience items={experience} />
      <Skills skills={skills} />
    </div>
  );
}
