/**
 * Seeds the portfolio dataset from Jaime Sebastián's CV.
 *
 * Everything here comes from the CV — no invented employers, metrics or
 * credentials. Where the CV is silent (project outcomes, screenshots, the OTTO
 * case study) the field is left empty rather than filled with plausible-sounding
 * text, because those are exactly the details an interviewer probes.
 *
 * Idempotent: uses createOrReplace, so re-running overwrites these documents.
 * Meant for seeding a fresh dataset, not for syncing one you have edited in the
 * Studio.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=sk... npm run seed
 *
 * Config via env:
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
      'then re-run:  SANITY_WRITE_TOKEN=sk... npm run seed'
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
const key = () => `k${(++keyCounter).toString(36)}`;

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

const blocks = (paragraphs) =>
  paragraphs.map((p) => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text: p, marks: [] }],
  }));

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

const ref = (id) => ({ _type: 'reference', _ref: id });
const weakRef = (id) => ({ _type: 'reference', _ref: id, _weak: true });
const s = (id) => ref(`skill-${id}`);

/**
 * A quantified outcome. Only mark `verified` for numbers the CV actually states —
 * the frontend renders nothing that is not verified.
 */
const metric = (labelEs, labelEn, value, verified = false) => ({
  _type: 'metric',
  _key: key(),
  label: str(labelEs, labelEn),
  value,
  direction: 'neutral',
  verified,
});

// ---------------------------------------------------------------------------
// Skills — exactly the stack the CV lists.
// ---------------------------------------------------------------------------
const SKILLS = [
  // [id, name, category, proficiency, featured, order]
  ['react', 'React.js', 'frontend', 'expert', true, 10],
  ['nextjs', 'Next.js', 'frontend', 'expert', true, 20],
  ['typescript', 'TypeScript', 'frontend', 'proficient', true, 30],
  ['javascript', 'JavaScript', 'frontend', 'expert', true, 40],
  ['html', 'HTML', 'frontend', 'expert', false, 50],
  ['css', 'CSS', 'frontend', 'expert', false, 60],
  ['angular', 'Angular', 'frontend', 'working', false, 70],
  ['uiux', 'UI/UX', 'design', 'proficient', false, 10],

  ['nodejs', 'Node.js', 'backend', 'expert', true, 10],
  ['express', 'Express', 'backend', 'proficient', true, 20],
  ['php', 'PHP', 'backend', 'working', false, 30],
  ['websocket', 'WebSocket', 'backend', 'proficient', false, 40],
  ['nodemailer', 'NodeMailer', 'backend', 'proficient', false, 50],
  ['restapi', 'REST APIs', 'backend', 'proficient', false, 60],

  ['mongodb', 'MongoDB', 'databases', 'proficient', true, 10],
  ['mysql', 'MySQL', 'databases', 'proficient', true, 20],

  // Platform work is a large part of the day job, so it gets its own category.
  ['shopify', 'Shopify', 'platforms', 'expert', true, 10],
  ['liquid', 'Shopify Liquid', 'platforms', 'proficient', true, 20],
  ['wordpress', 'WordPress', 'platforms', 'proficient', true, 30],
  ['elementor', 'Elementor', 'platforms', 'proficient', false, 40],

  ['docker', 'Docker', 'cloud', 'working', true, 10],
  ['githubactions', 'GitHub Actions', 'cloud', 'proficient', true, 20],
  ['gitlabci', 'GitLab CI', 'cloud', 'working', false, 30],
  ['nginx', 'Nginx', 'cloud', 'working', false, 40],

  ['openai', 'OpenAI API', 'ai', 'proficient', true, 10],
  ['aiagents', 'AI Agents', 'ai', 'working', true, 20],

  ['git', 'Git', 'tooling', 'expert', true, 10],
  ['jira', 'Jira', 'tooling', 'proficient', false, 20],
  ['scrum', 'Scrum', 'tooling', 'proficient', false, 30],
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

// ---------------------------------------------------------------------------
// Locales — the i18n plugin reads its language tabs from these.
// ---------------------------------------------------------------------------
const locales = [
  { _id: 'locale-es', _type: 'locale', name: 'Español', tag: 'es', isDefault: true },
  { _id: 'locale-en', _type: 'locale', name: 'English', tag: 'en', isDefault: false },
];

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------
const profile = {
  _id: 'profile',
  _type: 'profile',
  fullName: 'Jaime Sebastián',
  headline: str(
    'Full Stack Developer — React / Next.js / Node.js',
    'Full Stack Developer — React / Next.js / Node.js'
  ),
  shortBio: text(
    'Desarrollador con perfil frontend y experiencia construyendo productos web modernos con JavaScript/TypeScript, React y Node.js. Me manejo de principio a fin: implementación de UI/UX, diseño de APIs, integraciones, testing y despliegue.',
    'Frontend-leaning developer with strong experience building modern web products using JavaScript/TypeScript, React and Node.js. Comfortable owning features end-to-end: UI/UX implementation, API design, integrations, testing and deployment.'
  ),
  bio: richText(
    blocks([
      'Desarrollador con perfil frontend y experiencia construyendo productos web modernos con JavaScript/TypeScript, React y Node.js.',
      'Asumo funcionalidades de principio a fin: implementación de UI/UX, diseño de APIs, integraciones, testing y despliegue. Trabajo con foco en arquitectura limpia, bases de código mantenibles y entregar funcionalidad fiable en equipos que se mueven rápido.',
      'En el día a día alterno entre stacks según lo que necesite cada cliente: desde aplicaciones en React y Next.js con backend en Node.js hasta eCommerce a medida sobre Shopify y desarrollos en WordPress.',
    ]),
    blocks([
      'Frontend-leaning developer with strong experience building modern web products using JavaScript/TypeScript, React and Node.js.',
      'Comfortable owning features end-to-end: UI/UX implementation, API design, integrations, testing and deployment. Focused on clean architecture, maintainable codebases and shipping reliable features in fast-moving teams.',
      'Day to day I move between stacks depending on what each client needs — from React and Next.js applications with Node.js backends to fully custom Shopify eCommerce and WordPress builds.',
    ])
  ),
  location: {
    _type: 'object',
    city: 'Madrid',
    country: 'España',
    countryCode: 'ES',
    timezone: 'Europe/Madrid',
  },
  // First professional developer role: ATTOMO Digital, September 2024.
  careerStartDate: '2024-09-01',
  availability: {
    _type: 'object',
    status: 'open',
    headline: str(
      'Abierto a nuevas oportunidades — respondo en menos de 24 h',
      'Open to new opportunities — I reply within 24 hours'
    ),
    workModes: ['remote', 'hybrid'],
    contractTypes: ['fulltime'],
    preferredRoles: [
      'Full Stack Developer',
      'Frontend Developer',
      'React Developer',
      'Next.js Developer',
    ],
    openToRelocation: false,
  },
  spokenLanguages: [
    { _type: 'spokenLanguage', _key: key(), name: str('Español', 'Spanish'), level: 'Native' },
    { _type: 'spokenLanguage', _key: key(), name: str('Inglés', 'English'), level: 'C1' },
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
  ],
};

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------
const pages = [
  {
    _id: 'page-home',
    _type: 'page',
    key: 'home',
    title: str('Building the *digital* future.', 'Building the *digital* future.'),
    lead: text(
      'Productos web modernos con React, Next.js y Node.js — de la interfaz al despliegue.',
      'Modern web products with React, Next.js and Node.js — from interface to deployment.'
    ),
  },
  {
    _id: 'page-about',
    _type: 'page',
    key: 'about',
    title: str('Sobre mí', 'About me'),
    lead: text(
      'Desarrollador full stack con perfil frontend. Aquí cuento en qué trabajo, con qué stack y cómo me organizo.',
      'Full stack developer with a frontend lean. Here is what I work on, the stack I use and how I work.'
    ),
  },
  {
    _id: 'page-projects',
    _type: 'page',
    key: 'projects',
    title: str('Proyectos', 'Projects'),
    lead: text(
      'Proyectos de cliente desarrollados en ATTOMO Digital — CRMs inmobiliarios, eCommerce a medida e integraciones — junto a proyectos personales.',
      'Client work built at ATTOMO Digital — real estate CRMs, custom eCommerce and integrations — alongside personal projects.'
    ),
  },
  {
    _id: 'page-certifications',
    _type: 'page',
    key: 'certifications',
    title: str('Formación', 'Education'),
    lead: text(
      'Máster en producción de videojuegos, bootcamp full stack y grado en diseño y desarrollo de videojuegos.',
      "Master's in videogame production, a full stack bootcamp and a degree in videogame design and development."
    ),
  },
  {
    _id: 'page-contact',
    _type: 'page',
    key: 'contact',
    title: str('Contacto', 'Contact'),
    lead: text(
      'Abierto a nuevas oportunidades y colaboraciones. Escríbeme por el formulario o directamente al email — respondo en menos de 24 horas.',
      'Open to new opportunities and collaborations. Use the form or email me directly — I reply within 24 hours.'
    ),
  },
];

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------
const experiences = [
  {
    _id: 'experience-attomo',
    _type: 'experience',
    company: 'ATTOMO Digital',
    companyUrl: 'https://attomo.digital',
    role: str('Full Stack Developer', 'Full Stack Developer'),
    startDate: '2024-09-01',
    employmentType: 'fulltime',
    location: 'Madrid, España',
    summary: text(
      'Transformación digital: aplicaciones web y eCommerce. Desarrollo y mantengo componentes de frontend y flujos de usuario para plataformas web y de comercio electrónico.',
      'Digital transformation: web apps and eCommerce. I build and maintain frontend components and user flows for web and eCommerce platforms.'
    ),
    highlights: richText(
      bullets([
        'Desarrollo y mantenimiento de componentes frontend y flujos de usuario para plataformas web y eCommerce, traduciendo requisitos en interfaces limpias y escalables',
        'Entrega de funcionalidades completas, incluyendo integraciones de API, tratamiento de datos y tareas de backend cuando hace falta',
        'Implementación y mantenimiento de integraciones de pago, lógica de promociones y campañas, y personalizaciones de plataforma',
        'Fiabilidad mediante testing, depuración y mantenimiento continuo, mejorando la estabilidad y reduciendo incidencias en producción',
        'Trabajo sobre múltiples stacks según las necesidades de cada cliente',
      ]),
      bullets([
        'Build and maintain frontend components and user flows for web and eCommerce platforms, translating requirements into clean, scalable UI',
        'Deliver features end-to-end, including API integrations, data handling and backend-related tasks where needed',
        'Implement and maintain payment integrations, promotions/campaign logic and platform customisations',
        'Ensure reliability through testing, debugging and continuous maintenance, improving stability and reducing production issues',
        'Work across multiple stacks depending on client needs',
      ])
    ),
    techStack: [
      s('react'),
      s('nodejs'),
      s('nextjs'),
      s('typescript'),
      s('shopify'),
      s('liquid'),
      s('php'),
    ],
  },
  {
    _id: 'experience-flamingdogs',
    _type: 'experience',
    company: 'Flaming Dogs Studio',
    role: str('Game Producer', 'Game Producer'),
    startDate: '2024-09-01',
    endDate: '2025-12-01',
    employmentType: 'fulltime',
    location: 'Madrid, España',
    teamSize: 18,
    summary: text(
      'Coordinación y seguimiento de un equipo multidisciplinar de 18 personas entre programación, arte y diseño.',
      'Coordinated and tracked a multidisciplinary team of 18 across programming, art and design.'
    ),
    highlights: richText(
      bullets([
        'Coordinación y seguimiento de un equipo multidisciplinar de 18 personas (programadores, artistas y diseñadores)',
        'Gestión de prioridades, asignación de tareas y entrega de hitos',
      ]),
      bullets([
        'Coordinated and tracked a multidisciplinary team of 18 (programmers, artists and designers)',
        'Managed priorities, task allocation and milestone delivery',
      ])
    ),
    metrics: [
      // Straight from the CV, so safe to publish.
      metric('Equipo coordinado', 'Team coordinated', '18', true),
    ],
    techStack: [s('jira'), s('scrum')],
  },
  {
    _id: 'experience-lmfa',
    _type: 'experience',
    company: 'LMFA — Liga Madrileña de Fútbol Americano',
    role: str('Árbitro de fútbol americano', 'American Football Referee'),
    startDate: '2021-01-01',
    endDate: '2022-12-01',
    employmentType: 'parttime',
    location: 'Madrid, España',
    summary: text(
      'Arbitraje de fútbol americano en modalidades tackle y flag.',
      'American football refereeing, both tackle and flag.'
    ),
  },
];

// ---------------------------------------------------------------------------
// Education
// ---------------------------------------------------------------------------
const education = [
  {
    _id: 'education-master-videogames',
    _type: 'education',
    degree:
      "Master's Degree in Marketing, Communication and Videogame Production (PlayStation Talents)",
    institution: 'Voxel School — Universidad de Deusto',
    institutionNote: str(
      'Universidad de artes digitales adscrita a la Universidad de Deusto.',
      'Digital arts university affiliated with Deusto University.'
    ),
    level: 'masters',
    startDate: '2024-09-01',
    endDate: '2025-06-01',
    location: 'Madrid, España',
    skills: [s('jira'), s('scrum')],
  },
  {
    _id: 'education-bootcamp-fullstack',
    _type: 'education',
    degree: 'Full Stack Development Bootcamp',
    institution: 'Upgrade Hub',
    level: 'bootcamp',
    startDate: '2023-09-01',
    endDate: '2024-06-01',
    location: 'Madrid, España',
    summary: text(
      'Contenidos: HTML, JavaScript, CSS, Node.js, PHP, MySQL, MongoDB, React y Angular.',
      'Covered: HTML, JavaScript, CSS, Node.js, PHP, MySQL, MongoDB, React and Angular.'
    ),
    skills: [
      s('html'),
      s('javascript'),
      s('css'),
      s('nodejs'),
      s('php'),
      s('mysql'),
      s('mongodb'),
      s('react'),
      s('angular'),
    ],
  },
  {
    _id: 'education-degree-videogames',
    _type: 'education',
    degree: 'Grado en Diseño y Desarrollo de Videojuegos (DDV)',
    institution: 'UDIT — ESNE',
    institutionNote: str(
      'Escuela Universitaria de Diseño, Innovación y Tecnología.',
      'University School of Design, Innovation and Technology.'
    ),
    level: 'degree',
    startDate: '2019-09-01',
    endDate: '2024-06-01',
    location: 'Madrid, España',
    finalProject: str(
      'Análisis del impacto de la elección de color del avatar en el rendimiento en videojuegos.',
      'Analysis of the impact of avatar colour choice on video game performance.'
    ),
  },
  {
    _id: 'education-school',
    _type: 'education',
    degree: 'Educación secundaria y bachillerato',
    institution: "Saint Anne's School",
    institutionNote: str(
      'Colegio británico en Madrid; escolarización íntegramente en inglés.',
      'British school in Madrid; schooling conducted entirely in English.'
    ),
    level: 'school',
    startDate: '2018-09-01',
    endDate: '2019-06-01',
    location: 'Madrid, España',
  },
];

// ---------------------------------------------------------------------------
// Client work at ATTOMO Digital
// ---------------------------------------------------------------------------
const professionalProjects = [
  {
    id: 'otto',
    title: 'OTTO',
    slug: 'otto',
    // Only what is known so far. The case-study fields stay empty rather than
    // being filled with guesses about a project that is still being described.
    summaryEs: 'Agente de IA para podcasts.',
    summaryEn: 'An AI agent for podcasts.',
    stack: ['aiagents', 'openai', 'nodejs', 'typescript'],
    featured: true,
    order: 5,
    startDate: '2026-01-01',
  },
  {
    id: 'salesprop',
    title: 'SalesProp',
    slug: 'salesprop',
    summaryEs:
      'CRM inmobiliario con integración del Catastro, login con Microsoft y Google, calendario, automatización de emails y generación de expedientes en PDF.',
    summaryEn:
      'A real estate CRM with Spanish Land Registry (Cadastre) integration, Microsoft/Google login, calendar, email automation and PDF records.',
    stack: ['react', 'nodejs', 'restapi', 'nodemailer'],
    featured: true,
    order: 10,
    startDate: '2024-09-01',
  },
  {
    id: 'gvre',
    title: 'GVRE',
    slug: 'gvre',
    summaryEs: 'Web inmobiliaria y CRM desarrollados en Next.js, React.js y Node.js.',
    summaryEn: 'Real estate website and CRM built with Next.js, React.js and Node.js.',
    stack: ['nextjs', 'react', 'nodejs'],
    demoUrl: 'https://gvre.es/',
    featured: true,
    order: 20,
    startDate: '2024-10-01',
  },
  {
    id: 'carmen-navarro',
    title: 'Carmen Navarro',
    slug: 'carmen-navarro',
    summaryEs:
      'eCommerce completamente personalizado, con integración entre SADPE 3000 y Shopify y un backend propio en Node.js con NodeMailer e integración de la API de ChatGPT.',
    summaryEn:
      'Fully customised eCommerce with an integration between SADPE 3000 and Shopify, plus a custom Node.js backend using NodeMailer and the ChatGPT API.',
    stack: ['shopify', 'liquid', 'nodejs', 'nodemailer', 'openai'],
    demoUrl: 'https://carmennavarro.com/',
    order: 30,
    startDate: '2024-11-01',
  },
  {
    id: 'spherika',
    title: 'Spherika',
    slug: 'spherika',
    summaryEs:
      'Mantenimiento web y desarrollo de nuevas funcionalidades, más un eCommerce B2B simulado con backend propio en Node.js.',
    summaryEn:
      'Website maintenance and new feature development, plus a simulated B2B eCommerce with a custom Node.js backend.',
    stack: ['nodejs', 'javascript', 'shopify'],
    demoUrl: 'https://caviarspherika.com/',
    order: 40,
    startDate: '2025-01-01',
  },
  {
    id: 'estetic-medic-garvin',
    title: 'Estetic Medic Garvin',
    slug: 'estetic-medic-garvin',
    summaryEs: 'eCommerce completamente personalizado con backend propio en Node.js.',
    summaryEn: 'Fully customised eCommerce with a custom Node.js backend.',
    stack: ['shopify', 'liquid', 'nodejs'],
    demoUrl: 'https://www.esteticmedicgarvin.com/',
    order: 50,
    startDate: '2025-03-01',
  },
  {
    id: 'your-optimum',
    title: 'Your Optimum',
    slug: 'your-optimum',
    summaryEs: 'Rediseño completo del sitio web.',
    summaryEn: 'Complete website redesign.',
    stack: ['shopify', 'liquid', 'css'],
    demoUrl: 'https://youroptimum.com/',
    order: 60,
    startDate: '2025-10-01',
    endDate: '2025-10-01',
  },
  {
    id: 'hifas-da-terra',
    title: 'Hifas da Terra',
    slug: 'hifas-da-terra',
    summaryEs:
      'Mantenimiento del eCommerce y desarrollo de nuevas funcionalidades para las tiendas B2C y B2B.',
    summaryEn:
      'eCommerce maintenance and new functionality for both the B2C and B2B stores.',
    stack: ['shopify', 'liquid', 'nodejs'],
    demoUrl: 'https://hifasdaterra.com/',
    order: 70,
    startDate: '2025-02-01',
  },
  {
    id: 'imereti-dkf',
    title: 'Imereti · Clínica DKF',
    slug: 'imereti-clinica-dkf',
    summaryEs:
      'Desarrollo a medida en WordPress con Elementor y su mantenimiento posterior.',
    summaryEn: 'Custom WordPress development using Elementor, and ongoing maintenance.',
    stack: ['wordpress', 'elementor', 'php', 'css'],
    demoUrl: 'https://imereti.es/',
    order: 80,
    startDate: '2025-05-01',
  },
].map((p) => ({
  _id: `project-${p.id}`,
  _type: 'project',
  kind: 'professional',
  title: str(p.title, p.title),
  slug: { _type: 'slug', current: p.slug },
  summary: text(p.summaryEs, p.summaryEn),
  employer: weakRef('experience-attomo'),
  techStack: p.stack.map(s),
  featured: p.featured ?? false,
  order: p.order,
  ...(p.startDate ? { startDate: p.startDate } : {}),
  ...(p.endDate ? { endDate: p.endDate } : {}),
  ...(p.demoUrl ? { demoUrl: p.demoUrl } : {}),
}));

// ---------------------------------------------------------------------------
// Other projects
// ---------------------------------------------------------------------------
const otherProjects = [
  {
    _id: 'project-lilith',
    _type: 'project',
    kind: 'professional',
    title: str('Lilith: Rise of the Fallen', 'Lilith: Rise of the Fallen'),
    slug: { _type: 'slug', current: 'lilith-rise-of-the-fallen' },
    summary: text(
      'Videojuego desarrollado en equipo. Mi papel fue de Project Manager.',
      'Team-built video game. I worked as Project Manager.'
    ),
    role: str('Project Manager', 'Project Manager'),
    employer: weakRef('experience-flamingdogs'),
    techStack: [s('jira'), s('scrum')],
    featured: false,
    order: 90,
    startDate: '2025-01-01',
  },
  {
    _id: 'project-byd-fitness',
    _type: 'project',
    kind: 'personal',
    title: str('BYD Fitness App', 'BYD Fitness App'),
    slug: { _type: 'slug', current: 'byd-fitness-app' },
    summary: text(
      'Proyecto personal: aplicación de fitness desarrollada en Angular.',
      'Personal project: a fitness application built with Angular.'
    ),
    techStack: [s('angular'), s('typescript')],
    featured: false,
    order: 100,
    startDate: '2024-01-01',
  },
];

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------
/**
 * Removes documents from an earlier run of THIS script that the current content
 * no longer includes.
 *
 * Scoped by ID prefix on purpose: every document this script writes uses a
 * deterministic id (`skill-*`, `project-*`, …), while anything created in the
 * Studio gets a random UUID. That means hand-authored content can never be
 * caught by the sweep, no matter what is in the dataset.
 */
const OWNED_ID = /^(skill|project|experience|education|page|locale)-|^profile$/;

async function cleanupStale(keepIds) {
  const existing = await client.fetch('*[!(_id in path("system.**"))]._id');

  const stale = existing.filter((id) => {
    const published = id.replace(/^drafts\./, '');
    return OWNED_ID.test(published) && !keepIds.has(published);
  });

  if (!stale.length) return [];

  const tx = client.transaction();
  for (const id of stale) tx.delete(id);
  await tx.commit();
  return stale;
}

async function run() {
  console.log(`Seeding ${projectId}/${dataset}\n`);

  const docs = [
    ...locales,
    ...skillDocs,
    profile,
    ...pages,
    ...experiences,
    ...education,
    ...professionalProjects,
    ...otherProjects,
  ];

  const tx = client.transaction();
  for (const doc of docs) tx.createOrReplace(doc);
  await tx.commit();

  const removed = await cleanupStale(new Set(docs.map((d) => d._id)));
  if (removed.length) {
    console.log(`Removed ${removed.length} stale documents from a previous seed.\n`);
  }

  console.log(`Published ${docs.length} documents:`);
  console.log(`  ${locales.length} locales`);
  console.log(`  ${skillDocs.length} skills`);
  console.log('  1 profile');
  console.log(`  ${pages.length} pages`);
  console.log(`  ${experiences.length} experience`);
  console.log(`  ${education.length} education`);
  console.log(
    `  ${professionalProjects.length + otherProjects.length} projects` +
      ` (${professionalProjects.length + 1} professional, 1 personal)`
  );
  console.log('\nStill to add by hand in the Studio:');
  console.log('  - CV PDF (es/en) and a profile photo');
  console.log('  - OTTO: only a one-line summary so far');
  console.log('  - Project cover images and screenshots');
  console.log('  - Scheduling link (Calendly / Cal.com)');
}

run().catch((err) => {
  console.error(`\nSeeding failed: ${err.message}`);
  process.exit(1);
});
