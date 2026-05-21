import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'always',
  localeDetection: true,
  pathnames: {
    '/': '/',
    '/proyectos-personales': {
      es: '/proyectos-personales',
      en: '/personal-projects',
    },
    '/proyectos-profesionales': {
      es: '/proyectos-profesionales',
      en: '/professional-projects',
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
    '/login': '/login',
    '/buscaminas': {
      es: '/buscaminas',
      en: '/minesweeper',
    },
  },
});

export type Locale = (typeof routing.locales)[number];
