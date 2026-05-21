import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import Contact from '@/components/Contact';
import styles from '@/styles/SecondaryPage.module.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.contactPage' });

  const canonical = getPathname({ href: '/contacto', locale: locale as 'es' | 'en' });
  const languages = Object.fromEntries(
    routing.locales.map((loc) => [
      loc,
      getPathname({ href: '/contacto', locale: loc }),
    ])
  );

  return {
    title: t('title'),
    description: t('description'),
    keywords:
      locale === 'es'
        ? [
            'contacto desarrollador',
            'Jaime Sebastián',
            'frontend developer España',
            'React developer',
            'Next.js developer',
            'TypeScript developer',
            'contratar desarrollador frontend',
          ]
        : [
            'hire developer',
            'Jaime Sebastián',
            'frontend developer Spain',
            'React developer',
            'Next.js developer',
            'TypeScript developer',
          ],
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: canonical,
      siteName: 'Portfolio — Jaime Sebastián',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: t('ogTitle'),
      description: t('ogDescription'),
    },
    robots: { index: true, follow: true },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Contact' });
  const tMeta = await getTranslations({ locale, namespace: 'Metadata.contactPage' });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: tMeta('ogTitle'),
    description: tMeta('description'),
    inLanguage: locale,
    mainEntity: {
      '@type': 'Person',
      name: 'Jaime Sebastián',
      jobTitle: locale === 'es' ? 'Desarrollador Front-End' : 'Front-End Developer',
      email: 'jaiminator21@gmail.com',
      url: 'https://github.com/jaiminator21',
      sameAs: [
        'https://github.com/jaiminator21',
        'https://www.linkedin.com/in/jaime-sebasti%C3%A1n-9b4426205/',
        'https://www.instagram.com/jaiminator21/',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'professional',
        email: 'jaiminator21@gmail.com',
        availableLanguage: ['Spanish', 'English'],
      },
    },
  };

  return (
    <div className={styles.wrapper}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className={styles.pageHero}>
        <div className="container-custom">
          <h1 className={styles.pageHeroTitle}>{t('heroTitle')}</h1>
          <p className={styles.pageHeroLead}>{t('heroLead')}</p>
        </div>
      </section>

      <Contact />
    </div>
  );
}
