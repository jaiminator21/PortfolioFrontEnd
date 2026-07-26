/**
 * Reusable GROQ projection fragments.
 *
 * Localization is resolved in the query, not the component: every localized
 * field comes back as a plain string already falling back to the default locale,
 * so components never touch `[{_key, value}]` arrays.
 */

/**
 * Project an internationalized array down to a single value for `$locale`,
 * falling back to `$defaultLocale`.
 */
export function localized(path: string, alias?: string): string {
  const key = alias ?? path.split('.').pop() ?? path;
  return `"${key}": coalesce(${path}[_key == $locale][0].value, ${path}[_key == $defaultLocale][0].value)`;
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
      seo.title[_key == $locale][0].value,
      seo.title[_key == $defaultLocale][0].value,
      ${titleFallback},
      ""
    ),
    "description": coalesce(
      seo.description[_key == $locale][0].value,
      seo.description[_key == $defaultLocale][0].value,
      ${descriptionFallback},
      ""
    ),
    ${image('seo.image', 'image')},
    "noIndex": seo.noIndex == true
  }`;
}
