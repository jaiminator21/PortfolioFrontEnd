import { defineCliConfig } from 'sanity/cli';

/**
 * Only used by the `sanity` CLI (schema extract, typegen, dataset commands).
 * The Studio itself is served by Next at /studio, so there is no `sanity deploy`
 * step — it ships with the site.
 */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
});
