/**
 * One-off fix for the production dataset (the one Vercel uses).
 *
 *  1. Brings the professional projects in line with the client list: client
 *     name and site, live demo URLs, updated summaries, Imereti and Clínica DKF
 *     as separate projects, and Random College.
 *  2. Migrates every internationalized array value to the v5 shape of
 *     sanity-plugin-internationalized-array by adding `language`. `_key` is left
 *     as it is, so a deploy that still filters on `_key` keeps rendering.
 *
 * Published documents and any open drafts of them are both patched, so the
 * Studio shows the result straight away. Fields written by hand in the Studio
 * (the Carmen Navarro and NMHDTL summaries) are not touched.
 *
 *   npx sanity login
 *   npx sanity exec scripts/fix-sanity.mjs --with-user-token -- --dry   # print the plan
 *   npx sanity exec scripts/fix-sanity.mjs --with-user-token            # apply it
 */

import { randomUUID } from 'node:crypto';
import { getCliClient } from 'sanity/cli';

const PROJECT_ID = 'eplgy6nk';
const DATASET = 'production';
const DRY = process.argv.includes('--dry');

const client = getCliClient({ apiVersion: '2026-02-01' }).withConfig({
  projectId: PROJECT_ID,
  dataset: DATASET,
  useCdn: false,
  perspective: 'raw',
});

const I18N_TYPES = ['profile', 'page', 'experience', 'project', 'certification', 'education', 'skill'];

const key = () => randomUUID().replace(/-/g, '').slice(0, 12);
const i18n = (kind, es, en) => [
  { _type: `internationalizedArray${kind}Value`, _key: key(), language: 'es', value: es },
  { _type: `internationalizedArray${kind}Value`, _key: key(), language: 'en', value: en },
];
const str = (es, en) => i18n('String', es, en);
const text = (es, en) => i18n('Text', es, en);
const clientOf = (name, url) => ({ _type: 'object', name, url });
const skills = (ids) => ids.map((id) => ({ _type: 'reference', _ref: id, _key: key() }));
const attomo = { _type: 'reference', _ref: 'experience-attomo', _weak: true };

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const UPDATES = {
  'project-otto': {
    demoUrl: 'https://otto-dev.netlify.app/',
    client: clientOf('OTTO', 'https://otto-dev.netlify.app/'),
    summary: text('SaaS para podcasts basado en agentes de IA.', 'A SaaS for podcasts powered by AI agents.'),
  },
  'project-salesprop': {
    demoUrl: 'https://salespropweb.netlify.app/',
    client: clientOf('SalesProp', 'https://salespropweb.netlify.app/'),
  },
  '55c1d6b8-ac6d-4b1d-b645-01d2159d2ff7': {
    client: clientOf('No me hables de tu libro', 'https://nomehablesdetulibro.com/'),
  },
  'project-gvre': {
    client: clientOf('GVRE', 'https://gvre.es/'),
  },
  'project-carmen-navarro': {
    client: clientOf('Carmen Navarro', 'https://carmennavarro.com/'),
  },
  'project-spherika': {
    client: clientOf('Spherika', 'https://caviarspherika.com/'),
    summary: text(
      'Mantenimiento web y desarrollos ad hoc, incluido un eCommerce B2B simulado con backend propio en Node.js.',
      'Website maintenance and bespoke development, including a simulated B2B eCommerce with a custom Node.js backend.'
    ),
  },
  'project-estetic-medic-garvin': {
    client: clientOf('Estetic Medic Garvin', 'https://www.esteticmedicgarvin.com/'),
  },
  'project-your-optimum': {
    client: clientOf('Your Optimum', 'https://youroptimum.com/'),
  },
  'project-hifas-da-terra': {
    client: clientOf('Hifas da Terra', 'https://hifasdaterra.com/'),
    summary: text(
      'Mantenimiento del eCommerce y desarrollos ad hoc para las tiendas B2C y B2B.',
      'eCommerce maintenance and bespoke development for both the B2C and B2B stores.'
    ),
  },
  // Was "Imereti · Clínica DKF" — two different sites, now two projects.
  'project-imereti-dkf': {
    title: str('Imereti', 'Imereti'),
    slug: { _type: 'slug', current: 'imereti' },
    client: clientOf('Imereti', 'https://imereti.es/'),
  },
};

/** Skills to add to an existing project, if it does not already list them. */
const ADD_SKILLS = {
  'project-carmen-navarro': ['skill-wordpress'],
};

const NEW_PROJECTS = [
  {
    _id: 'project-clinica-dkf',
    _type: 'project',
    kind: 'professional',
    title: str('Clínica DKF', 'Clínica DKF'),
    slug: { _type: 'slug', current: 'clinica-dkf' },
    summary: text(
      'Desarrollo a medida en WordPress con Elementor y su mantenimiento posterior.',
      'Custom WordPress development using Elementor, and ongoing maintenance.'
    ),
    employer: attomo,
    client: clientOf('Clínica DKF', 'https://clinicadkf.com/'),
    techStack: skills(['skill-wordpress', 'skill-elementor', 'skill-php', 'skill-css']),
    demoUrl: 'https://clinicadkf.com/',
    featured: false,
    order: 85,
  },
  {
    _id: 'project-random-college',
    _type: 'project',
    kind: 'professional',
    title: str('Random College', 'Random College'),
    slug: { _type: 'slug', current: 'random-college' },
    summary: text('Plataforma de cursos online.', 'An online course platform.'),
    client: clientOf('Random College', 'https://www.random-college.com/'),
    demoUrl: 'https://www.random-college.com/',
    featured: false,
    order: 95,
  },
];

// ---------------------------------------------------------------------------
// v5 migration
// ---------------------------------------------------------------------------

const isI18nValue = (node) =>
  node &&
  typeof node._type === 'string' &&
  node._type.startsWith('internationalizedArray') &&
  node._type.endsWith('Value');

/** `{ 'title[_key=="es"].language': 'es', … }` for every value missing `language`. */
function languagePatch(doc) {
  const set = {};
  const walk = (node, path) => {
    if (Array.isArray(node)) {
      node.forEach((item, i) => {
        const selector = typeof item?._key === 'string' ? `_key==${JSON.stringify(item._key)}` : i;
        walk(item, `${path}[${selector}]`);
      });
      return;
    }
    if (!node || typeof node !== 'object') return;
    if (isI18nValue(node) && !node.language && typeof node._key === 'string' && node._key) {
      set[`${path}.language`] = node._key;
    }
    for (const [field, value] of Object.entries(node)) {
      if (!field.startsWith('_') && value && typeof value === 'object') {
        walk(value, path ? `${path}.${field}` : field);
      }
    }
  };
  walk(doc, '');
  return set;
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

async function run() {
  console.log(`${DRY ? '[dry run] ' : ''}${PROJECT_ID}/${DATASET}\n`);

  const targetIds = [...Object.keys(UPDATES), ...Object.keys(ADD_SKILLS)];
  const existing = await client.fetch('*[_id in $ids]{_id, "skills": techStack[]._ref}', {
    ids: [...new Set(targetIds.flatMap((id) => [id, `drafts.${id}`]))],
  });
  const versionsOf = (id) => existing.filter((doc) => doc._id === id || doc._id === `drafts.${id}`);

  const content = client.transaction();
  let contentOps = 0;

  for (const [id, fields] of Object.entries(UPDATES)) {
    const versions = versionsOf(id);
    if (!versions.length) console.warn(`  ! ${id} not found — skipped`);
    for (const { _id } of versions) {
      content.patch(_id, (p) => p.set(fields));
      contentOps++;
      console.log(`  update ${_id}: ${Object.keys(fields).join(', ')}`);
    }
  }

  for (const [id, wanted] of Object.entries(ADD_SKILLS)) {
    for (const { _id, skills: current } of versionsOf(id)) {
      const missing = wanted.filter((skill) => !(current ?? []).includes(skill));
      if (!missing.length) continue;
      content.patch(_id, (p) =>
        p.setIfMissing({ techStack: [] }).append('techStack', skills(missing))
      );
      contentOps++;
      console.log(`  add skills to ${_id}: ${missing.join(', ')}`);
    }
  }

  for (const doc of NEW_PROJECTS) {
    content.createIfNotExists(doc);
    contentOps++;
    console.log(`  create (if missing) ${doc._id}`);
  }

  if (!DRY && contentOps) await content.commit();

  // Migrate after the content step, so it also covers anything written above.
  const docs = await client.fetch('*[_type in $types]', { types: I18N_TYPES });
  const migration = client.transaction();
  let migrated = 0;
  let values = 0;

  for (const doc of docs) {
    const set = languagePatch(doc);
    const count = Object.keys(set).length;
    if (!count) continue;
    migration.patch(doc._id, (p) => p.set(set));
    migrated++;
    values += count;
  }

  if (!DRY && migrated) await migration.commit();

  console.log(`\n  v5 migration: ${values} values in ${migrated} documents (of ${docs.length} checked)`);
  console.log(DRY ? '\nNothing written. Run again without --dry to apply.' : '\nDone.');
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
