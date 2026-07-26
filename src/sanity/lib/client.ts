import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId } from '../env';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // The CDN is the right default for runtime reads; the few places that need
  // guaranteed freshness override it with `.withConfig({ useCdn: false })`.
  useCdn: true,
  perspective: 'published',
});
