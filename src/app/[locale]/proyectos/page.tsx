import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import ProjectsHub from '@/components/ProjectsHub';
import styles from '@/styles/SecondaryPage.module.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata.projectsPage' });

  const canonical = getPathname({ href: '/proyectos', locale: locale as 'es' | 'en' });
  const languages = Object.fromEntries(
    routing.locales.map((loc) => [loc, getPathname({ href: '/proyectos', locale: loc })])
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

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'Projects' });

  return (
    <div className={styles.wrapper}>
      <section className={styles.pageHero}>
        <div className="container-custom">
          <h1 className={styles.pageHeroTitle}>{t('pageTitle')}</h1>
          <p className={styles.pageHeroLead}>{t('pageLead')}</p>
        </div>
      </section>

      <ProjectsHub />
    </div>
  );
}
