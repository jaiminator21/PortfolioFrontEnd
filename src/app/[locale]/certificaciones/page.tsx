import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Certifications from '@/components/Certifications';
import { buildMetadata } from '@/lib/metadata';
import {
  getCertificationStats,
  getCertifications,
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

  const [certifications, stats] = await Promise.all([
    getCertifications(locale),
    getCertificationStats(),
  ]);

  return (
    <div className={styles.wrapper}>
      <Certifications certifications={certifications} stats={stats} />
    </div>
  );
}
