'use client';

import { NextStudio } from 'next-sanity/studio';

import config from '../../../../sanity.config';

/**
 * The client boundary is load-bearing, not stylistic: `sanity` pulls in `swr`,
 * whose `react-server` build has no default export, so importing the config from
 * a Server Component breaks the build. Keeping it behind 'use client' keeps the
 * Studio out of the RSC module graph entirely.
 */
export default function Studio() {
  return <NextStudio config={config} />;
}
