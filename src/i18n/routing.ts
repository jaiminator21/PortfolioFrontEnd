import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'always',
  localeDetection: true,
  pathnames: {
    '/': '/',
    '/sobre-mi': {
      es: '/sobre-mi',
      en: '/about',
    },
    '/proyectos': {
      es: '/proyectos',
      en: '/projects',
    },
    '/proyecto/[id]': {
      es: '/proyecto/[id]',
      en: '/project/[id]',
    },
    '/certificaciones': {
      es: '/certificaciones',
      en: '/certifications',
    },
    '/contacto': {
      es: '/contacto',
      en: '/contact',
    },
    '/buscaminas': {
      es: '/buscaminas',
      en: '/minesweeper',
    },
  },
});

export type Locale = (typeof routing.locales)[number];
