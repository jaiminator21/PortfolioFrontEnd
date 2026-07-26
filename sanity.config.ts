import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { internationalizedArray } from 'sanity-plugin-internationalized-array';

import { apiVersion, dataset, projectId } from './src/sanity/env';
import { schemaTypes } from './src/sanity/schemaTypes';
import { structure } from './src/sanity/structure';

/** Singletons must not be creatable or deletable from the Studio. */
const SINGLETON_TYPES = new Set(['profile', 'page']);

export default defineConfig({
  name: 'default',
  title: 'Portfolio — Jaime Sebastián',

  /**
   * The Studio is mounted inside the Next app at /studio, so it shares the
   * project's env vars and ships in the same deploy as the site.
   */
  basePath: '/studio',

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
    visionTool({ defaultApiVersion: apiVersion }),
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
