import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Contact from '@/components/Contact';
import { JsonLd } from '@/components/sanity/JsonLd';
import { SITE_URL, buildMetadata } from '@/lib/metadata';
import {
  getPage,
  getPageForMetadata,
  getProfile,
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
    getPageForMetadata(locale, 'contact'),
    getProfileForMetadata(locale),
  ]);

  return buildMetadata({
    seo: page?.seo,
    locale,
    href: '/contacto',
    siteName: profile?.fullName ?? '',
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [profile, page] = await Promise.all([
    getProfile(locale),
    getPage(locale, 'contact'),
  ]);

  if (!profile) return null;

  return (
    <div className={styles.wrapper}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: page?.seo?.title ?? page?.title ?? '',
          description: page?.seo?.description ?? page?.lead ?? '',
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

      <Contact profile={profile} locale={locale} />
    </div>
  );
}
