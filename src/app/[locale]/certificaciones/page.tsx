import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Certifications from '@/components/Certifications';
import Education from '@/components/Education';
import { buildMetadata } from '@/lib/metadata';
import {
  getCertificationStats,
  getCertifications,
  getEducation,
  getPage,
  getPageForMetadata,
  getProfileForMetadata,
} from '@/sanity/fetch';
import styles from '@/styles/SecondaryPage.module.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [page, profile] = await Promise.all([
    getPageForMetadata(locale, 'certifications'),
    getProfileForMetadata(locale),
  ]);

  return buildMetadata({
    seo: page?.seo,
    locale,
    href: '/certificaciones',
    siteName: profile?.fullName ?? '',
  });
}

export default async function CertificationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [page, education, certifications, stats] = await Promise.all([
    getPage(locale, 'certifications'),
    getEducation(locale),
    getCertifications(locale),
    getCertificationStats(),
  ]);

  return (
    <div className={styles.wrapper}>
      <section className={styles.pageHero}>
        <div className="container-custom">
          <h1 className={styles.pageHeroTitle}>{page?.title}</h1>
          {page?.lead ? <p className={styles.pageHeroLead}>{page.lead}</p> : null}
        </div>
      </section>

      <Education items={education} />
      <Certifications certifications={certifications} stats={stats} />
    </div>
  );
}
