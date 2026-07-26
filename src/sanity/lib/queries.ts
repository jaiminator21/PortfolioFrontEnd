import { defineQuery } from 'next-sanity';

import { image, localized, seo, techStack, verifiedMetrics } from './fragments';

/**
 * Every query takes `$locale` and `$defaultLocale`. Use the helpers in
 * `src/sanity/queries.ts` rather than calling these directly — they inject both
 * params for you.
 */

export const PROFILE_QUERY = defineQuery(/* groq */ `
  *[_type == "profile" && _id == "profile"][0]{
    _id,
    fullName,
    ${localized('headline')},
    ${localized('shortBio')},
    ${localized('bio')},
    ${image('photo')},
    location{ city, country, countryCode, timezone },
    careerStartDate,
    availability{
      status,
      ${localized('headline')},
      workModes,
      contractTypes,
      preferredRoles,
      openToRelocation
    },
    "cv": cv[]{
      _key,
      language,
      updatedAt,
      "url": file.asset->url,
      "size": file.asset->size
    },
    "spokenLanguages": spokenLanguages[]{
      _key,
      ${localized('name')},
      level
    },
    email,
    phone,
    schedulingUrl,
    "socials": socials[]{ _key, platform, url, label },
    ${seo('fullName', 'coalesce(shortBio[_key == $locale][0].value, shortBio[_key == $defaultLocale][0].value)')}
  }
`);

export const PAGE_QUERY = defineQuery(/* groq */ `
  *[_type == "page" && key == $key][0]{
    _id,
    key,
    ${localized('title')},
    ${localized('lead')},
    ${seo('title[_key == $locale][0].value', 'lead[_key == $locale][0].value')}
  }
`);

export const EXPERIENCE_QUERY = defineQuery(/* groq */ `
  *[_type == "experience"] | order(startDate desc){
    _id,
    company,
    companyUrl,
    ${image('companyLogo', 'companyLogo', false)},
    ${localized('role')},
    startDate,
    endDate,
    employmentType,
    workMode,
    location,
    teamSize,
    ${localized('summary')},
    ${localized('highlights')},
    ${verifiedMetrics},
    ${techStack}
  }
`);

export const SKILLS_QUERY = defineQuery(/* groq */ `
  *[_type == "skill"] | order(category asc, order asc){
    _id,
    name,
    category,
    proficiency,
    yearsOfExperience,
    featured
  }
`);

/** Project cards. `$kind` filters professional vs personal. */
export const PROJECTS_BY_KIND_QUERY = defineQuery(/* groq */ `
  *[_type == "project" && kind == $kind] | order(featured desc, order asc, startDate desc){
    _id,
    kind,
    "slug": slug.current,
    ${localized('title')},
    ${localized('summary')},
    ${localized('role')},
    featured,
    confidential,
    startDate,
    endDate,
    demoUrl,
    repoUrl,
    ${image('coverImage')},
    ${verifiedMetrics},
    ${techStack},
    "employer": select(
      confidential != true => employer->{ company, companyUrl },
      null
    ),
    "hasCaseStudy": kind == "professional" && (
      defined(context) || defined(problem) || defined(solution) || defined(result)
    )
  }
`);

/** Featured work for the homepage, across both kinds. */
export const FEATURED_PROJECTS_QUERY = defineQuery(/* groq */ `
  *[_type == "project" && featured == true] | order(order asc, startDate desc)[0...6]{
    _id,
    kind,
    "slug": slug.current,
    ${localized('title')},
    ${localized('summary')},
    ${image('coverImage')},
    ${verifiedMetrics},
    ${techStack}
  }
`);

export const PROJECT_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    kind,
    "slug": slug.current,
    ${localized('title')},
    ${localized('summary')},
    ${localized('role')},
    ${localized('context')},
    ${localized('problem')},
    ${localized('solution')},
    ${localized('result')},
    confidential,
    startDate,
    endDate,
    demoUrl,
    repoUrl,
    ${image('coverImage')},
    "gallery": gallery[]{
      _key,
      ...(asset->{
        "url": url,
        "lqip": metadata.lqip,
        "width": metadata.dimensions.width,
        "height": metadata.dimensions.height
      }),
      ${localized('alt')},
      ${localized('caption')}
    },
    ${verifiedMetrics},
    ${techStack},
    "employer": select(
      confidential != true => employer->{ company, companyUrl, ${localized('role')} },
      null
    ),
    ${seo('title[_key == $locale][0].value', 'summary[_key == $locale][0].value')},
    "related": *[_type == "project" && _id != ^._id && kind == ^.kind]
      | order(featured desc, order asc)[0...3]{
        _id,
        "slug": slug.current,
        ${localized('title')},
        ${localized('summary')},
        ${image('coverImage')}
      }
  }
`);

/** Slugs for generateStaticParams. */
export const PROJECT_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "project" && defined(slug.current)]{ "slug": slug.current }
`);

export const EDUCATION_QUERY = defineQuery(/* groq */ `
  *[_type == "education"] | order(startDate desc){
    _id,
    degree,
    institution,
    ${localized('institutionNote')},
    institutionUrl,
    level,
    startDate,
    endDate,
    location,
    ${localized('summary')},
    ${localized('finalProject')},
    "skills": skills[]->{ _id, name, category }
  }
`);

export const CERTIFICATIONS_QUERY = defineQuery(/* groq */ `
  *[_type == "certification"] | order(issueDate desc){
    _id,
    title,
    issuer,
    issuerUrl,
    ${image('issuerLogo', 'issuerLogo', false)},
    issueDate,
    expiryDate,
    credentialId,
    verifyUrl,
    level,
    studyHours,
    featured,
    "skills": skills[]->{ _id, name, category }
  }
`);

/**
 * Aggregates for the certifications stat row. Computed in GROQ so the numbers
 * cannot drift from the documents behind them.
 */
export const CERTIFICATION_STATS_QUERY = defineQuery(/* groq */ `
  {
    "total": count(*[_type == "certification"]),
    "verifiable": count(*[_type == "certification" && defined(verifyUrl)]),
    "issuers": count(array::unique(*[_type == "certification"].issuer)),
    "skills": count(array::unique(*[_type == "certification"].skills[]._ref)),
    "studyHours": math::sum(*[_type == "certification"].studyHours)
  }
`);

/** Everything indexable, for sitemap.ts. */
export const SITEMAP_QUERY = defineQuery(/* groq */ `
  *[_type == "project" && defined(slug.current) && seo.noIndex != true]{
    "slug": slug.current,
    _updatedAt
  }
`);
