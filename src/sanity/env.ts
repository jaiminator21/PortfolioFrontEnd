/**
 * Sanity connection settings, validated once at import time so a missing
 * variable fails loudly at startup instead of as an opaque 401 at request time.
 */

function required(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env.local and fill it in.`
    );
  }
  return value;
}

export const projectId = required(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'NEXT_PUBLIC_SANITY_PROJECT_ID'
);

export const dataset = required(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'NEXT_PUBLIC_SANITY_DATASET'
);

/**
 * Dated API version. Pinning it means Sanity's behaviour never shifts under us
 * on a redeploy.
 */
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2026-02-01';

/**
 * Server-only read token. Optional: the dataset is public, so published content
 * is readable without it. It is required for draft previews.
 */
export const readToken = process.env.SANITY_API_READ_TOKEN;
