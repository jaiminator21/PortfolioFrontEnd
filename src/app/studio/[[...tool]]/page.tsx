import type { Metadata, Viewport } from 'next';

import Studio from './Studio';

/**
 * The Studio is a client-side app: rendering it statically means Next serves a
 * shell instantly and Sanity takes over in the browser. `[[...tool]]` catches
 * every nested Studio route (/studio/structure, /studio/vision, ...).
 */
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Studio',
  // The admin panel has no business in search results.
  robots: { index: false, follow: false },
};

/** Sanity's own viewport: the Studio manages its own scrolling and safe areas. */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
};

export default function StudioPage() {
  return <Studio />;
}
