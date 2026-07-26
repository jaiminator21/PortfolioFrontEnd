import { defineLive } from 'next-sanity/live';

import { readToken } from '../env';
import { client } from './client';

/**
 * Live Content API: handles fetching, caching and invalidation, so publishing in
 * the Studio shows up without a redeploy or a webhook.
 *
 * `<SanityLive />` must be rendered in the layout for the subscription to run.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: readToken,
  browserToken: readToken,
});
