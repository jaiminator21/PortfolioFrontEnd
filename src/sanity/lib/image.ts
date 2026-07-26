import createImageUrlBuilder from '@sanity/image-url';
import type { Image } from 'sanity';

import { dataset, projectId } from '../env';

const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * Build a transformed URL for a Sanity image reference.
 * Callers chain the dimensions they need: `urlFor(img).width(1200).height(630).url()`.
 */
export function urlFor(source: Image) {
  return builder.image(source).auto('format').fit('max');
}

/**
 * The tiny base64 preview Sanity stores alongside every image, ready to hand to
 * next/image as `blurDataURL`.
 */
export type ImageWithMetadata = {
  url: string | null;
  alt: string | null;
  lqip: string | null;
  width: number | null;
  height: number | null;
};
