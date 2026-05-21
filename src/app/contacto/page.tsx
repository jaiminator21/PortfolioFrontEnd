import type { Metadata } from 'next';
import Contact from '@/components/Contact';
import styles from '@/styles/SecondaryPage.module.css';

export const metadata: Metadata = {
  title: 'Contacto | Jaime Sebastián — Desarrollador Front-End',
  description:
    'Contacta con Jaime Sebastián, desarrollador front-end especializado en React, Next.js y TypeScript. Disponible para nuevas oportunidades, colaboraciones y proyectos freelance.',
  keywords: [
    'contacto desarrollador',
    'Jaime Sebastián',
    'frontend developer España',
    'React developer',
    'Next.js developer',
    'TypeScript developer',
    'contratar desarrollador frontend',
  ],
  alternates: {
    canonical: '/contacto',
  },
  openGraph: {
    title: 'Contacto — Jaime Sebastián',
    description:
      'Hablemos. Disponible para nuevas oportunidades, colaboraciones y proyectos freelance.',
    url: '/contacto',
    siteName: 'Portfolio — Jaime Sebastián',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contacto — Jaime Sebastián',
    description:
      'Hablemos. Disponible para nuevas oportunidades y colaboraciones.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contacto — Jaime Sebastián',
  description:
    'Página de contacto de Jaime Sebastián, desarrollador front-end especializado en React, Next.js y TypeScript.',
  mainEntity: {
    '@type': 'Person',
    name: 'Jaime Sebastián',
    jobTitle: 'Desarrollador Front-End',
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

export default function ContactPage() {
  return (
    <div className={styles.wrapper}>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className={styles.pageHero}>
        <div className="container-custom">
          <h1 className={styles.pageHeroTitle}>Contacto</h1>
          <p className={styles.pageHeroLead}>
            Disponible para nuevas oportunidades, colaboraciones y proyectos freelance.
            Escríbeme por el formulario o directamente al email — respondo en menos de 24 horas.
          </p>
        </div>
      </section>

      <Contact />
    </div>
  );
}
