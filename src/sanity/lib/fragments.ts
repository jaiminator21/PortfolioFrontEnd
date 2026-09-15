/**
 * Reusable GROQ projection fragments.
 *
 * Localization is resolved in the query, not the component: every localized
 * field comes back as a plain string already falling back to the default locale,
 * so components never touch `[{language, value}]` arrays.
 */

/**
 * The value of an internationalized array for one language.
 *
 * Plugin v5 stores the language in `language`; v4 data stored it in `_key`.
 * Matching both keeps content rendering on either side of the data migration.
 * Once every document has `language`, the `_key` half can go.
 */
export function valueIn(path: string, locale = '$locale'): string {
  return `${path}[language == ${locale} || _key == ${locale}][0].value`;
}

/**
 * Project an internationalized array down to a single value for `$locale`,
 * falling back to `$defaultLocale`.
 */
export function localized(path: string, alias?: string): string {
  const key = alias ?? path.split('.').pop() ?? path;
  return `"${key}": coalesce(${valueIn(path)}, ${valueIn(path, '$defaultLocale')})`;
}

/**
 * Image projection including the LQIP placeholder and intrinsic dimensions, so
 * next/image can reserve space and blur-up without a second request.
 *
 * The single `asset->` spread keeps this to one subquery rather than four.
 */
export function image(path: string, alias?: string, altIsLocalized = true): string {
  const key = alias ?? path.split('.').pop() ?? path;
  const alt = altIsLocalized ? localized('alt') : '"alt": alt';
  return `"${key}": ${path}{
    ...(asset->{
      "url": url,
      "lqip": metadata.lqip,
      "width": metadata.dimensions.width,
      "height": metadata.dimensions.height
    }),
    ${alt}
  }`;
}

/** Tech stack, projected from skill references. */
export const techStack = `"techStack": techStack[]->{
  _id,
  name,
  category,
  proficiency
}`;

/**
 * Only metrics explicitly marked as verified reach the frontend. Unverified
 * numbers stay in the Studio as drafts-in-spirit and never render publicly.
 */
export const verifiedMetrics = `"metrics": metrics[verified == true]{
  _key,
  ${localized('label')},
  value,
  direction,
  ${localized('context')}
}`;

/**
 * SEO with fallbacks resolved in GROQ, so `seo.title` is never null — it holds
 * the override, the document title, or an empty string.
 */
export function seo(titleFallback: string, descriptionFallback: string): string {
  return `"seo": {
    "title": coalesce(
      ${valueIn('seo.title')},
      ${valueIn('seo.title', '$defaultLocale')},
      ${titleFallback},
      ""
    ),
    "description": coalesce(
      ${valueIn('seo.description')},
      ${valueIn('seo.description', '$defaultLocale')},
      ${descriptionFallback},
      ""
    ),
    ${image('seo.image', 'image')},
    "noIndex": seo.noIndex == true
  }`;
}
