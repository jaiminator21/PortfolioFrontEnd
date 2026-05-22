import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Skills from '@/components/Skills';
import styles from '@/styles/SecondaryPage.module.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.aboutPage' });

  const canonical = getPathname({ href: '/sobre-mi', locale: locale as 'es' | 'en' });
  const languages = Object.fromEntries(
    routing.locales.map((loc) => [loc, getPathname({ href: '/sobre-mi', locale: loc })])
  );

  return {
    title: t('title'),
    description: t('description'),
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
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title: t('ogTitle'),
      description: t('ogDescription'),
    },
    robots: { index: true, follow: true },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'About' });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    inLanguage: locale,
    mainEntity: {
      '@type': 'Person',
      name: 'Jaime Sebastián',
      jobTitle: locale === 'es' ? 'Desarrollador Front-End' : 'Front-End Developer',
      description:
        locale === 'es'
          ? 'Arquitecto de experiencias digitales con sede en España, especializado en React, Next.js y TypeScript.'
          : 'Digital experience architect based in Spain, specialized in React, Next.js and TypeScript.',
      url: 'https://github.com/jaiminator21',
      email: 'jaiminator21@gmail.com',
      knowsAbout: [
        'React',
        'Next.js',
        'TypeScript',
        'Node.js',
        'Web Performance',
        'UI/UX',
      ],
      sameAs: [
        'https://github.com/jaiminator21',
        'https://www.linkedin.com/in/jaime-sebasti%C3%A1n-9b4426205/',
        'https://www.instagram.com/jaiminator21/',
      ],
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
          <h1 className={styles.pageHeroTitle}>{t('pageTitle')}</h1>
          <p className={styles.pageHeroLead}>{t('pageLead')}</p>
        </div>
      </section>

      <About />
      <Experience />
      <Skills />
    </div>
  );
}
