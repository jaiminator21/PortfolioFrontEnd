/**
 * Seeds a portfolio dataset from scratch.
 *
 * Split deliberately in two:
 *  - PUBLISHED: content that is genuinely the user's (name, contact, stack,
 *    page copy).
 *  - DRAFTS: content carried over from the original template (invented
 *    employers, unverified metrics, placeholder certifications). It lands in the
 *    Studio ready to edit but never renders publicly until published, so the
 *    live site never claims something that cannot be backed up.
 *
 * Idempotent: uses createOrReplace, so re-running overwrites rather than
 * duplicating. That also means it will discard Studio edits to these documents —
 * intended for seeding a new/empty dataset, not for syncing an existing one.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=sk... node scripts/seed.mjs
 *
 * Config via env (falls back to sanity.cli.ts values):
 *   SANITY_PROJECT_ID   default: NEXT_PUBLIC_SANITY_PROJECT_ID from .env
 *   SANITY_DATASET      default: NEXT_PUBLIC_SANITY_DATASET, else production
 *   SANITY_WRITE_TOKEN  required — needs Editor rights
 */

import { createClient } from '@sanity/client';

const projectId =
  process.env.SANITY_PROJECT_ID ?? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_DATASET ?? process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) {
  console.error(
    'No Sanity project configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID in .env, or pass SANITY_PROJECT_ID.'
  );
  process.exit(1);
}

if (!token) {
  console.error(
    'SANITY_WRITE_TOKEN is not set.\n' +
      `Create one with Editor rights at https://sanity.io/manage/project/${projectId}/api\n` +
      'then re-run:  SANITY_WRITE_TOKEN=sk... node scripts/seed.mjs'
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-02-01',
  token,
  useCdn: false,
});

let keyCounter = 0;
const key = () => `k${(++keyCounter).toString(36)}${Date.now().toString(36)}`;

/** Localized string/text: [{_key: 'es', value}, {_key: 'en', value}] */
const i18n = (kind, es, en) => {
  const type = `internationalizedArray${kind}Value`;
  const out = [];
  if (es != null) out.push({ _type: type, _key: 'es', value: es });
  if (en != null) out.push({ _type: type, _key: 'en', value: en });
  return out;
};
const str = (es, en) => i18n('String', es, en);
const text = (es, en) => i18n('Text', es, en);

/** Portable Text paragraphs from plain strings. */
const blocks = (paragraphs) =>
  paragraphs.map((p) => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text: p, marks: [] }],
  }));

/** Portable Text bullet list from plain strings. */
const bullets = (items) =>
  items.map((p) => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text: p, marks: [] }],
  }));

const richText = (es, en) => [
  { _type: 'internationalizedArraySimpleBlockContentValue', _key: 'es', value: es },
  { _type: 'internationalizedArraySimpleBlockContentValue', _key: 'en', value: en },
];

/**
 * A metric that came from template copy. `verified: false` keeps it out of the
 * rendered site until the user can stand behind the number.
 */
const metric = (labelEs, labelEn, value) => ({
  _type: 'metric',
  _key: key(),
  label: str(labelEs, labelEn),
  value,
  direction: 'improvement',
  verified: false,
});

const ref = (id) => ({ _type: 'reference', _ref: id });
/** Weak reference — allowed to point at a document that is not published yet. */
const weakRef = (id) => ({ _type: 'reference', _ref: id, _weak: true });

// ---------------------------------------------------------------------------
// Skills — the user's actual stack, taken from the existing components.
// ---------------------------------------------------------------------------
const SKILLS = [
  ['react', 'React', 'frontend', 'expert', true, 10],
  ['nextjs', 'Next.js', 'frontend', 'expert', true, 20],
  ['typescript', 'TypeScript', 'frontend', 'proficient', true, 30],
  ['tailwind', 'Tailwind CSS', 'frontend', 'proficient', true, 40],
  ['javascript', 'JavaScript', 'frontend', 'expert', false, 50],
  ['htmlcss', 'HTML / CSS', 'frontend', 'expert', false, 60],
  ['nodejs', 'Node.js', 'backend', 'proficient', true, 10],
  ['express', 'Express', 'backend', 'proficient', true, 20],
  ['mongodb', 'MongoDB', 'databases', 'proficient', true, 10],
  ['mysql', 'MySQL', 'databases', 'proficient', true, 20],
  ['postgresql', 'PostgreSQL', 'databases', 'working', false, 30],
  ['redis', 'Redis', 'databases', 'working', false, 40],
  ['docker', 'Docker', 'cloud', 'working', true, 10],
  ['githubactions', 'GitHub Actions', 'cloud', 'proficient', true, 20],
  ['vercel', 'Vercel', 'cloud', 'proficient', true, 30],
  ['aws', 'AWS', 'cloud', 'working', true, 40],
  ['jest', 'Jest', 'testing', 'proficient', false, 10],
  ['cypress', 'Cypress', 'testing', 'working', false, 20],
  ['git', 'Git', 'tooling', 'expert', true, 10],
  ['vite', 'Vite', 'tooling', 'proficient', true, 20],
  ['webpack', 'Webpack', 'tooling', 'working', false, 30],

  // Concept-level skills that the certifications validate. Not featured: they
  // belong on the credential cards and in the Person JSON-LD `knowsAbout`,
  // not in the homepage stack.
  ['cloudarchitecture', 'Cloud Architecture', 'cloud', 'working', false, 50],
  ['infrastructure', 'Infrastructure', 'cloud', 'working', false, 60],
  ['security', 'Security', 'cloud', 'working', false, 70],
  ['gcp', 'Google Cloud Platform', 'cloud', 'working', false, 80],
  ['kubernetes', 'Kubernetes', 'cloud', 'learning', false, 90],
  ['terraform', 'Terraform', 'cloud', 'learning', false, 100],
  ['devops', 'DevOps', 'cloud', 'working', false, 110],
  ['systemdesign', 'System Design', 'backend', 'working', false, 30],
  ['microservices', 'Microservices', 'backend', 'working', false, 40],
  ['scalability', 'Scalability', 'backend', 'working', false, 50],
  ['e2etesting', 'E2E Testing', 'testing', 'proficient', false, 30],
  ['testautomation', 'Test Automation', 'testing', 'proficient', false, 40],
  ['performance', 'Web Performance', 'frontend', 'proficient', false, 70],
  ['designpatterns', 'Design Patterns', 'frontend', 'proficient', false, 80],
  ['uiux', 'UI/UX', 'design', 'working', false, 10],
];

const skillDocs = SKILLS.map(([id, name, category, proficiency, featured, order]) => ({
  _id: `skill-${id}`,
  _type: 'skill',
  name,
  category,
  proficiency,
  featured,
  order,
}));

const s = (id) => ref(`skill-${id}`);

// ---------------------------------------------------------------------------
// PUBLISHED — profile
// ---------------------------------------------------------------------------
const profile = {
  _id: 'profile',
  _type: 'profile',
  fullName: 'Jaime Sebastián',
  headline: str(
    'Desarrollador Web Full Stack — React, Next.js y TypeScript',
    'Full Stack Web Developer — React, Next.js and TypeScript'
  ),
  shortBio: text(
    'Construyo aplicaciones web escalables con un enfoque implacable en el rendimiento y la experiencia de usuario. Especializado en el ecosistema React / Next.js / TypeScript.',
    'I build scalable web applications with a relentless focus on performance and user experience. Specialized in the React / Next.js / TypeScript ecosystem.'
  ),
  bio: richText(
    blocks([
      'Soy un arquitecto de experiencias digitales con sede en España, dedicado a fusionar la estética técnica con un rendimiento impecable.',
      'Mi enfoque va más allá del código: entiendo que cada línea debe servir a un propósito de negocio y mejorar la vida del usuario. Me especializo en el ecosistema React / Next.js / TypeScript.',
    ]),
    blocks([
      'I am a digital experience architect based in Spain, focused on merging technical craft with impeccable performance.',
      'My approach goes beyond code: every line should serve a business purpose and improve the user’s life. I specialize in the React / Next.js / TypeScript ecosystem.',
    ])
  ),
  location: {
    _type: 'object',
    city: 'Madrid',
    country: 'España',
    countryCode: 'ES',
    timezone: 'Europe/Madrid',
  },
  careerStartDate: '2020-01-01',
  availability: {
    _type: 'object',
    status: 'open',
    headline: str(
      'Disponible para nuevas oportunidades — respondo en menos de 24 h',
      'Available for new opportunities — I reply within 24 hours'
    ),
    workModes: ['remote', 'hybrid'],
    contractTypes: ['fulltime', 'freelance'],
    preferredRoles: ['Frontend Developer', 'Full Stack Developer', 'React Developer'],
    openToRelocation: false,
  },
  spokenLanguages: [
    { _type: 'spokenLanguage', _key: key(), name: str('Español', 'Spanish'), level: 'Native' },
    { _type: 'spokenLanguage', _key: key(), name: str('Inglés', 'English'), level: 'B2' },
  ],
  email: 'jaiminator21@gmail.com',
  socials: [
    {
      _type: 'socialLink',
      _key: key(),
      platform: 'github',
      url: 'https://github.com/jaiminator21',
      label: 'jaiminator21',
    },
    {
      _type: 'socialLink',
      _key: key(),
      platform: 'linkedin',
      url: 'https://www.linkedin.com/in/jaime-sebasti%C3%A1n-9b4426205/',
      label: 'Jaime Sebastián',
    },
    {
      _type: 'socialLink',
      _key: key(),
      platform: 'other',
      url: 'https://www.instagram.com/jaiminator21/',
      label: 'Instagram',
    },
  ],
};

// ---------------------------------------------------------------------------
// PUBLISHED — pages
// ---------------------------------------------------------------------------
const pages = [
  {
    _id: 'page-home',
    _type: 'page',
    key: 'home',
    title: str('Building the digital future.', 'Building the digital future.'),
    lead: text(
      'Especializado en aplicaciones escalables con un enfoque implacable en el rendimiento y la experiencia de usuario.',
      'Specialized in scalable applications with a relentless focus on performance and user experience.'
    ),
  },
  {
    _id: 'page-about',
    _type: 'page',
    key: 'about',
    title: str('Sobre mí', 'About me'),
    lead: text(
      'Desarrollador front-end construyendo productos digitales. Aquí cuento quién soy, qué hago y cómo trabajo.',
      'Front-end developer building digital products. Here is who I am, what I do and how I work.'
    ),
  },
  {
    _id: 'page-projects',
    _type: 'page',
    key: 'projects',
    title: str('Proyectos', 'Projects'),
    lead: text(
      'Una selección de proyectos profesionales con impacto medible en negocio y proyectos personales de exploración técnica.',
      'A selection of professional projects with measurable business impact, plus personal projects exploring new technology.'
    ),
  },
  {
    _id: 'page-certifications',
    _type: 'page',
    key: 'certifications',
    title: str('Cursos & Certificaciones', 'Courses & Certifications'),
    lead: text(
      'Aprendizaje continuo y validación de habilidades técnicas por organizaciones líderes de la industria.',
      'Continuous learning and technical skills validated by leading industry organisations.'
    ),
  },
  {
    _id: 'page-contact',
    _type: 'page',
    key: 'contact',
    title: str('Contacto', 'Contact'),
    lead: text(
      'Disponible para nuevas oportunidades, colaboraciones y proyectos freelance. Escríbeme por el formulario o directamente al email — respondo en menos de 24 horas.',
      'Available for new opportunities, collaborations and freelance work. Use the form or email me directly — I reply within 24 hours.'
    ),
  },
];

// ---------------------------------------------------------------------------
// DRAFTS — template content the user must replace with their real history
// ---------------------------------------------------------------------------
const experiences = [
  {
    _id: 'experience-tech-solutions',
    _type: 'experience',
    company: 'Tech Solutions Inc.',
    role: str('Senior Frontend Developer', 'Senior Frontend Developer'),
    startDate: '2022-01-01',
    employmentType: 'fulltime',
    workMode: 'hybrid',
    location: 'Madrid, España',
    teamSize: 4,
    summary: text(
      'Liderazgo técnico en el desarrollo de plataformas SaaS B2B enfocadas en la gestión de proyectos de gran escala.',
      'Technical leadership on B2B SaaS platforms for large-scale project management.'
    ),
    highlights: richText(
      bullets([
        'Arquitectura y desarrollo del nuevo dashboard con React y TypeScript',
        'Implementación de sistema de diseño compartido entre productos',
        'Liderazgo técnico de un equipo de 4 desarrolladores frontend',
        'Optimización de rendimiento y mejora de Core Web Vitals',
      ]),
      bullets([
        'Architected and built the new dashboard with React and TypeScript',
        'Shipped a design system shared across products',
        'Technical lead for a team of 4 frontend developers',
        'Performance work and Core Web Vitals improvements',
      ])
    ),
    techStack: [s('react'), s('typescript'), s('nextjs'), s('git')],
  },
  {
    _id: 'experience-digital-ventures',
    _type: 'experience',
    company: 'Digital Ventures',
    role: str('Full Stack Developer', 'Full Stack Developer'),
    startDate: '2020-01-01',
    endDate: '2022-01-01',
    employmentType: 'fulltime',
    workMode: 'onsite',
    location: 'Madrid, España',
    summary: text(
      'Desarrollo integral de soluciones e-commerce de alto tráfico para retail multicanal.',
      'End-to-end development of high-traffic e-commerce solutions for multichannel retail.'
    ),
    highlights: richText(
      bullets([
        'Desarrollo full stack con Next.js y Node.js',
        'Integración con APIs de terceros (pasarelas de pago, CRM)',
        'Implementación de testing automatizado (Jest, Cypress)',
        'Colaboración directa con UX/UI en iteraciones de producto',
      ]),
      bullets([
        'Full stack development with Next.js and Node.js',
        'Third-party API integrations (payment gateways, CRM)',
        'Automated testing with Jest and Cypress',
        'Worked directly with UX/UI through product iterations',
      ])
    ),
    techStack: [s('nextjs'), s('nodejs'), s('express'), s('jest'), s('cypress')],
  },
];

const professionalProjects = [
  {
    _id: 'project-analytics-tiempo-real',
    _type: 'project',
    kind: 'professional',
    title: str('Sistema de Analíticas en Tiempo Real', 'Real-Time Analytics System'),
    slug: { _type: 'slug', current: 'analytics-tiempo-real' },
    summary: text(
      'Dashboard de analíticas en tiempo real para una plataforma SaaS B2B con más de 10.000 usuarios empresariales.',
      'Real-time analytics dashboard for a B2B SaaS platform with over 10,000 enterprise users.'
    ),
    employer: weakRef('experience-tech-solutions'),
    role: str(
      'Tech Lead Frontend — coordinación con backend y diseño de arquitectura cliente',
      'Frontend Tech Lead — backend coordination and client architecture design'
    ),
    context: text(
      'Plataforma SaaS B2B con más de 10.000 usuarios empresariales que necesitaba mejorar su sistema de reporting.',
      'A B2B SaaS platform with 10,000+ enterprise users that needed to improve its reporting system.'
    ),
    problem: text(
      'Los usuarios tardaban hasta 5 minutos en obtener reports actualizados, generando fricción y abandono de la feature.',
      'Users waited up to 5 minutes for updated reports, causing friction and feature abandonment.'
    ),
    solution: richText(
      blocks([
        'Implementación de un dashboard con actualizaciones en tiempo real usando WebSockets, optimización de queries y virtualización de listas grandes.',
      ]),
      blocks([
        'Built a dashboard with real-time updates over WebSockets, optimised queries and virtualised large lists.',
      ])
    ),
    result: text(
      'Tiempo de carga reducido y mayor engagement con la feature.',
      'Reduced load time and higher engagement with the feature.'
    ),
    metrics: [
      metric('Tiempo de carga', 'Load time', '<2s'),
      metric('Engagement con la feature', 'Feature engagement', '+180%'),
      metric('Datapoints procesados', 'Datapoints processed', '100k'),
    ],
    techStack: [s('react'), s('typescript'), s('redis')],
    featured: true,
    order: 10,
    startDate: '2023-01-01',
  },
  {
    _id: 'project-checkout-redesign',
    _type: 'project',
    kind: 'professional',
    title: str('Rediseño del Checkout Flow', 'Checkout Flow Redesign'),
    slug: { _type: 'slug', current: 'checkout-redesign' },
    summary: text(
      'Rediseño completo del proceso de compra de un e-commerce de retail, de 7 pasos a 3.',
      'Full redesign of a retail e-commerce checkout, from 7 steps down to 3.'
    ),
    employer: weakRef('experience-digital-ventures'),
    role: str(
      'Full Stack Developer — desarrollo end-to-end del nuevo flujo',
      'Full Stack Developer — end-to-end development of the new flow'
    ),
    context: text(
      'E-commerce de retail con un 68% de abandono en el proceso de compra.',
      'Retail e-commerce with 68% cart abandonment during checkout.'
    ),
    problem: text(
      'Flujo de pago complejo con 7 pasos, múltiples validaciones lentas y UX confusa en mobile.',
      'A complex 7-step payment flow with slow validations and confusing mobile UX.'
    ),
    solution: richText(
      blocks([
        'Simplificación a 3 pasos, validaciones asíncronas optimizadas, persistencia de datos en sesión, diseño mobile-first e integración con Stripe.',
      ]),
      blocks([
        'Simplified to 3 steps with optimised async validation, session persistence, a mobile-first design and Stripe integration.',
      ])
    ),
    result: text(
      'Menor abandono y mayor conversión en el embudo de compra.',
      'Lower abandonment and higher conversion through the purchase funnel.'
    ),
    metrics: [
      metric('Abandono de carrito', 'Cart abandonment', '68% → 32%'),
      metric('Conversión', 'Conversion rate', '+45%'),
      metric('Tiempo medio de compra', 'Average checkout time', '8min → 3min'),
    ],
    techStack: [s('nextjs'), s('nodejs'), s('postgresql'), s('tailwind')],
    featured: true,
    order: 20,
    startDate: '2021-01-01',
  },
  {
    _id: 'project-monolito-microfrontends',
    _type: 'project',
    kind: 'professional',
    title: str('Migración de Monolito a Microfrontends', 'Monolith to Microfrontends Migration'),
    slug: { _type: 'slug', current: 'monolito-microfrontends' },
    summary: text(
      'Migración incremental de una aplicación legacy de más de 200.000 líneas a una arquitectura de microfrontends, sin downtime.',
      'Incremental migration of a 200k+ line legacy application to a microfrontend architecture, with zero downtime.'
    ),
    employer: weakRef('experience-tech-solutions'),
    role: str(
      'Senior Developer — arquitectura y migración incremental',
      'Senior Developer — architecture and incremental migration'
    ),
    context: text(
      'Aplicación legacy de 5 años con un codebase de más de 200.000 líneas difícil de mantener.',
      'A 5-year-old legacy application with a 200k+ line codebase that was hard to maintain.'
    ),
    problem: text(
      'Deploys arriesgados, equipos bloqueados entre sí, testing lento y onboarding de nuevos desarrolladores de más de 3 semanas.',
      'Risky deploys, teams blocking each other, slow testing and 3+ weeks to onboard a new developer.'
    ),
    solution: richText(
      blocks([
        'Implementación de Module Federation con Webpack 5, CI/CD independiente por módulo y migración progresiva sin downtime.',
      ]),
      blocks([
        'Module Federation with Webpack 5, independent CI/CD per module and a progressive migration with no downtime.',
      ])
    ),
    result: text(
      'Deploys más rápidos, mayor velocidad de entrega y onboarding más corto.',
      'Faster deploys, higher delivery velocity and shorter onboarding.'
    ),
    metrics: [
      metric('Tiempo de deploy', 'Deploy time', '2h → 15min'),
      metric('Velocidad de features', 'Feature velocity', '+60%'),
      metric('Onboarding', 'Onboarding time', '3 semanas → 1 semana'),
    ],
    techStack: [s('react'), s('webpack'), s('docker'), s('githubactions')],
    featured: false,
    order: 30,
    startDate: '2022-06-01',
  },
];

const personalProjects = [
  [
    'devmetrics',
    'DevMetrics Dashboard',
    'Dashboard para visualizar métricas de GitHub: commits, PRs e issues. Integración con la GitHub API y gráficas interactivas.',
    'Dashboard for GitHub metrics: commits, PRs and issues. GitHub API integration with interactive charts.',
    ['react', 'typescript'],
  ],
  [
    'taskmaster',
    'Task Master Pro',
    'Gestor de tareas con drag & drop, categorías personalizadas, filtros avanzados y modo offline-first con sincronización.',
    'Task manager with drag & drop, custom categories, advanced filters and offline-first sync.',
    ['react', 'mongodb', 'nodejs'],
  ],
  [
    'perfmonitor',
    'Performance Monitor',
    'Herramienta CLI para analizar el rendimiento de aplicaciones web. Genera reports detallados de Core Web Vitals.',
    'CLI tool for analysing web application performance. Generates detailed Core Web Vitals reports.',
    ['nodejs', 'typescript'],
  ],
  [
    'componentlib',
    'Component Library',
    'Sistema de diseño personal con componentes reutilizables, documentación interactiva y theming personalizable.',
    'Personal design system with reusable components, interactive docs and customisable theming.',
    ['react', 'typescript', 'vite'],
  ],
  [
    'ratelimiter',
    'API Rate Limiter',
    'Middleware configurable de rate limiting para APIs, con distintas estrategias (token bucket, sliding window).',
    'Configurable rate-limiting middleware for APIs, with several strategies (token bucket, sliding window).',
    ['nodejs', 'express', 'redis'],
  ],
  [
    'snippets',
    'Code Snippet Manager',
    'Aplicación para guardar, organizar y buscar snippets de código con syntax highlighting y etiquetas.',
    'App to save, organise and search code snippets with syntax highlighting and tags.',
    ['nextjs', 'postgresql'],
  ],
].map(([id, name, sumEs, sumEn, stack], i) => ({
  _id: `project-${id}`,
  _type: 'project',
  kind: 'personal',
  title: str(name, name),
  slug: { _type: 'slug', current: id },
  summary: text(sumEs, sumEn),
  techStack: stack.map(s),
  featured: false,
  order: 100 + i * 10,
}));

/**
 * Certifications keep their titles and issuers but NOT the credential IDs or
 * verification URLs from the template — those were placeholders, and a
 * credential a recruiter cannot verify is worse than one you never claimed.
 */
const certifications = [
  [
    'aws-solutions-architect',
    'AWS Certified Solutions Architect – Professional',
    'Amazon Web Services',
    'https://aws.amazon.com/certification/',
    '2025-03-01',
    'professional',
    ['aws', 'cloudarchitecture', 'infrastructure', 'security'],
  ],
  [
    'meta-frontend',
    'Meta Front-End Developer Professional Certificate',
    'Meta',
    'https://www.coursera.org/professional-certificates/meta-front-end-developer',
    '2025-01-01',
    'professional',
    ['react', 'javascript', 'htmlcss', 'uiux'],
  ],
  [
    'gcp-cloud-architect',
    'Google Cloud Professional Cloud Architect',
    'Google Cloud',
    'https://cloud.google.com/learn/certification/cloud-architect',
    '2024-11-01',
    'professional',
    ['gcp', 'kubernetes', 'terraform', 'devops'],
  ],
  [
    'advanced-react',
    'Advanced React Patterns & Performance',
    'Frontend Masters',
    'https://frontendmasters.com/',
    '2024-09-01',
    'expert',
    ['react', 'performance', 'designpatterns'],
  ],
  [
    'system-design',
    'System Design & Architecture Specialization',
    'Coursera',
    'https://www.coursera.org/',
    '2024-07-01',
    'specialist',
    ['systemdesign', 'microservices', 'scalability', 'postgresql'],
  ],
  [
    'cypress-e2e',
    'Cypress End-to-End Testing Certification',
    'Cypress.io',
    'https://www.cypress.io/',
    '2024-05-01',
    'professional',
    ['cypress', 'e2etesting', 'testautomation', 'githubactions'],
  ],
].map(([id, title, issuer, issuerUrl, issueDate, level, skills]) => ({
  _id: `certification-${id}`,
  _type: 'certification',
  title,
  issuer,
  issuerUrl,
  issueDate,
  level,
  skills: skills.map(s),
  featured: false,
}));

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------
async function run() {
  console.log(`Seeding ${projectId}/${dataset}\n`);

  const published = [...skillDocs, profile, ...pages];
  const drafts = [
    ...experiences,
    ...professionalProjects,
    ...personalProjects,
    ...certifications,
  ];

  const tx = client.transaction();
  for (const doc of published) tx.createOrReplace(doc);
  // Drafts carry the `drafts.` prefix, so they exist in the Studio but are not
  // part of the published dataset the site reads.
  for (const doc of drafts) {
    tx.createOrReplace({ ...doc, _id: `drafts.${doc._id}` });
  }

  await tx.commit();

  console.log(`published: ${published.length} documents`);
  console.log(`  - ${skillDocs.length} skills`);
  console.log(`  - 1 profile`);
  console.log(`  - ${pages.length} pages`);
  console.log(`drafts (need real data before publishing): ${drafts.length} documents`);
  console.log(`  - ${experiences.length} experience`);
  console.log(`  - ${professionalProjects.length} professional projects`);
  console.log(`  - ${personalProjects.length} personal projects`);
  console.log(`  - ${certifications.length} certifications`);
}

run().catch((err) => {
  console.error(`\nSeeding failed: ${err.message}`);
  process.exit(1);
});
