import type { WithContext, Person, ItemList, CreativeWork, BreadcrumbList } from 'schema-dts';

import { toPlainText } from '@/components/sanity/RichText';
import type {
  Certification,
  Experience,
  Profile,
  ProjectCard,
  ProjectDetail,
  Skill,
} from '@/sanity/types';

/**
 * Structured data. This is what lets Google show a knowledge panel for a name,
 * and what links this site to the LinkedIn and GitHub profiles in `sameAs`.
 *
 * Everything here is built from published Sanity content only, so nothing
 * unverified can leak into machine-readable claims.
 */

/** Person — the core entity. Every page references it. */
export function personSchema({
  profile,
  experience,
  skills,
  certifications,
  siteUrl,
}: {
  profile: Profile;
  experience: Experience[];
  skills: Skill[];
  certifications: Certification[];
  siteUrl: string;
}): WithContext<Person> {
  const currentRole = experience.find((e) => !e.endDate);

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteUrl}/#person`,
    name: profile.fullName,
    url: siteUrl,
    ...(profile.headline ? { jobTitle: profile.headline } : {}),
    ...(profile.shortBio || profile.bio
      ? { description: profile.shortBio ?? toPlainText(profile.bio) }
      : {}),
    ...(profile.photo?.url ? { image: profile.photo.url } : {}),
    ...(profile.email ? { email: `mailto:${profile.email}` } : {}),
    ...(profile.phone ? { telephone: profile.phone } : {}),
    ...(profile.location?.city || profile.location?.country
      ? {
          address: {
            '@type': 'PostalAddress',
            ...(profile.location.city ? { addressLocality: profile.location.city } : {}),
            ...(profile.location.countryCode
              ? { addressCountry: profile.location.countryCode }
              : {}),
          },
        }
      : {}),
    // sameAs is how a search engine reconciles this site with the social
    // profiles that carry the same identity.
    ...(profile.socials?.length
      ? { sameAs: profile.socials.map((s) => s.url) }
      : {}),
    ...(currentRole
      ? {
          worksFor: {
            '@type': 'Organization',
            name: currentRole.company,
            ...(currentRole.companyUrl ? { url: currentRole.companyUrl } : {}),
          },
        }
      : {}),
    ...(skills.length ? { knowsAbout: skills.map((s) => s.name) } : {}),
    ...(profile.spokenLanguages?.length
      ? {
          knowsLanguage: profile.spokenLanguages
            .map((l) => l.name)
            .filter((n): n is string => Boolean(n)),
        }
      : {}),
    ...verifiableCredentials(certifications),
  };
}

/**
 * Only certifications with a verification URL are asserted as credentials — an
 * unverifiable claim in structured data is a liability, not an asset.
 *
 * The URL is narrowed by flatMap rather than a non-null assertion, so the
 * "verified" guarantee is enforced by the type checker.
 */
function verifiableCredentials(certifications: Certification[]) {
  const credentials = certifications.flatMap((c) =>
    c.verifyUrl
      ? [
          {
            '@type': 'EducationalOccupationalCredential' as const,
            name: c.title,
            url: c.verifyUrl,
            ...(c.credentialId ? { identifier: c.credentialId } : {}),
            recognizedBy: {
              '@type': 'Organization' as const,
              name: c.issuer,
              ...(c.issuerUrl ? { url: c.issuerUrl } : {}),
            },
          },
        ]
      : []
  );

  return credentials.length ? { hasCredential: credentials } : {};
}

/** A project as a CreativeWork, for the case-study pages. */
export function projectSchema({
  project,
  profile,
  siteUrl,
  url,
}: {
  project: ProjectDetail;
  profile: Profile;
  siteUrl: string;
  url: string;
}): WithContext<CreativeWork> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title ?? '',
    url,
    ...(project.summary ? { abstract: project.summary } : {}),
    ...(project.coverImage?.url ? { image: project.coverImage.url } : {}),
    ...(project.startDate ? { dateCreated: project.startDate } : {}),
    author: { '@id': `${siteUrl}/#person` },
    creator: { '@id': `${siteUrl}/#person` },
    ...(profile.fullName ? { copyrightHolder: { '@id': `${siteUrl}/#person` } } : {}),
    ...(project.techStack?.length
      ? { keywords: project.techStack.map((t) => t.name).join(', ') }
      : {}),
  };
}

/** Ordered list of projects, for the projects index. */
export function projectListSchema({
  projects,
  siteUrl,
  locale,
}: {
  projects: ProjectCard[];
  siteUrl: string;
  locale: string;
}): WithContext<ItemList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: projects.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.title ?? '',
      url: `${siteUrl}/${locale}/${locale === 'en' ? 'project' : 'proyecto'}/${p.slug}`,
    })),
  };
}

/** Breadcrumbs, so search results show the path rather than a bare URL. */
export function breadcrumbSchema(
  items: { name: string; url: string }[]
): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Serialise for injection. `<` is escaped so a stray character in content can
 * never break out of the script tag.
 */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
