import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { internationalizedArray } from 'sanity-plugin-internationalized-array';

import { schemaTypes } from './schemaTypes';
import { structure } from './structure';

const projectId = 'eplgy6nk';
const dataset = 'production';

/** Singletons must not be creatable or deletable from the Studio. */
const SINGLETON_TYPES = new Set(['profile', 'page']);

export default defineConfig({
  name: 'default',
  title: 'Portfolio — Jaime Sebastián',
  projectId,
  dataset,

  plugins: [
    structureTool({ structure }),
    /**
     * Field-level localization. Sanity's guidance is field-level for structured
     * content (people, projects, credentials) and document-level for pages —
     * everything here is structured, and the field-level tabs keep both
     * languages side by side while shared data (dates, tech stack, URLs) stays
     * single-sourced.
     *
     * Locales are read from `locale` documents, so adding a language is a
     * content change, not a code change.
     */
    internationalizedArray({
      languages: (client) =>
        client.fetch<{ id: string; title: string }[]>(
          `*[_type == "locale"]|order(isDefault desc, tag asc){"id": tag, "title": name}`
        ),
      defaultLanguages: ['es'],
      fieldTypes: ['string', 'text', 'simpleBlockContent'],
    }),
    visionTool({ defaultApiVersion: '2026-02-01' }),
  ],

  schema: {
    types: schemaTypes,
    // Hide singletons from the global "create new" menu.
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETON_TYPES.has(schemaType)),
  },

  document: {
    actions: (input, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? input.filter(
            ({ action }) =>
              action && ['publish', 'discardChanges', 'restore'].includes(action)
          )
        : input,
  },
});
