import { routing } from '@/i18n/routing';

import { sanityFetch } from './lib/live';
import {
  CERTIFICATION_STATS_QUERY,
  CERTIFICATIONS_QUERY,
  EDUCATION_QUERY,
  EXPERIENCE_QUERY,
  FEATURED_PROJECTS_QUERY,
  PAGE_QUERY,
  PROFILE_QUERY,
  PROJECT_BY_SLUG_QUERY,
  PROJECTS_BY_KIND_QUERY,
  SKILLS_QUERY,
} from './lib/queries';
import type {
  Certification,
  CertificationStats,
  Education,
  Experience,
  Page,
  PageKey,
  Profile,
  ProjectCard,
  ProjectDetail,
  ProjectKind,
  Skill,
} from './types';

/**
 * App-facing data access. Each helper injects `$locale` and `$defaultLocale` so
 * callers never have to remember the fallback params, and every localized field
 * arrives as a plain string.
 *
 * `stega: false` is set on the metadata-only reads: Visual Editing's invisible
 * marker characters must never reach a <title> or a meta description.
 */

const defaultLocale = routing.defaultLocale;

function localeParams(locale: string) {
  return { locale, defaultLocale };
}

export async function getProfile(locale: string): Promise<Profile | null> {
  const { data } = await sanityFetch({
    query: PROFILE_QUERY,
    params: localeParams(locale),
  });
  return (data as Profile | null) ?? null;
}

/** Profile without stega characters, for metadata and JSON-LD. */
export async function getProfileForMetadata(locale: string): Promise<Profile | null> {
  const { data } = await sanityFetch({
    query: PROFILE_QUERY,
    params: localeParams(locale),
    stega: false,
  });
  return (data as Profile | null) ?? null;
}

export async function getPage(locale: string, key: PageKey): Promise<Page | null> {
  const { data } = await sanityFetch({
    query: PAGE_QUERY,
    params: { ...localeParams(locale), key },
  });
  return (data as Page | null) ?? null;
}

export async function getPageForMetadata(
  locale: string,
  key: PageKey
): Promise<Page | null> {
  const { data } = await sanityFetch({
    query: PAGE_QUERY,
    params: { ...localeParams(locale), key },
    stega: false,
  });
  return (data as Page | null) ?? null;
}

export async function getExperience(locale: string): Promise<Experience[]> {
  const { data } = await sanityFetch({
    query: EXPERIENCE_QUERY,
    params: localeParams(locale),
  });
  return (data as Experience[] | null) ?? [];
}

export async function getEducation(locale: string): Promise<Education[]> {
  const { data } = await sanityFetch({
    query: EDUCATION_QUERY,
    params: localeParams(locale),
  });
  return (data as Education[] | null) ?? [];
}

export async function getSkills(locale: string): Promise<Skill[]> {
  const { data } = await sanityFetch({
    query: SKILLS_QUERY,
    params: localeParams(locale),
  });
  return (data as Skill[] | null) ?? [];
}

export async function getProjectsByKind(
  locale: string,
  kind: ProjectKind
): Promise<ProjectCard[]> {
  const { data } = await sanityFetch({
    query: PROJECTS_BY_KIND_QUERY,
    params: { ...localeParams(locale), kind },
  });
  return (data as ProjectCard[] | null) ?? [];
}

export async function getFeaturedProjects(locale: string): Promise<ProjectCard[]> {
  const { data } = await sanityFetch({
    query: FEATURED_PROJECTS_QUERY,
    params: localeParams(locale),
  });
  return (data as ProjectCard[] | null) ?? [];
}

export async function getProject(
  locale: string,
  slug: string
): Promise<ProjectDetail | null> {
  const { data } = await sanityFetch({
    query: PROJECT_BY_SLUG_QUERY,
    params: { ...localeParams(locale), slug },
  });
  return (data as ProjectDetail | null) ?? null;
}

export async function getProjectForMetadata(
  locale: string,
  slug: string
): Promise<ProjectDetail | null> {
  const { data } = await sanityFetch({
    query: PROJECT_BY_SLUG_QUERY,
    params: { ...localeParams(locale), slug },
    stega: false,
  });
  return (data as ProjectDetail | null) ?? null;
}

export async function getCertifications(locale: string): Promise<Certification[]> {
  const { data } = await sanityFetch({
    query: CERTIFICATIONS_QUERY,
    params: localeParams(locale),
  });
  return (data as Certification[] | null) ?? [];
}

export async function getCertificationStats(): Promise<CertificationStats> {
  const { data } = await sanityFetch({
    query: CERTIFICATION_STATS_QUERY,
    stega: false,
  });
  return (
    (data as CertificationStats | null) ?? {
      total: 0,
      verifiable: 0,
      issuers: 0,
      skills: 0,
      studyHours: 0,
    }
  );
}
