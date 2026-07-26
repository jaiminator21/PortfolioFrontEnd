/**
 * Shapes returned by the GROQ queries in `lib/queries.ts`.
 *
 * Hand-written rather than generated: `sanity typegen` needs a CLI login and a
 * deployed schema, so until `sanity login` has been run these are the contract.
 * Keep them in step with the projections.
 */

import type { PortableTextBlock } from 'next-sanity';

export type SanityImage = {
  url: string | null;
  alt: string | null;
  lqip: string | null;
  width: number | null;
  height: number | null;
} | null;

export type SkillCategory =
  | 'frontend'
  | 'backend'
  | 'databases'
  | 'cloud'
  | 'platforms'
  | 'ai'
  | 'testing'
  | 'tooling'
  | 'design';

export type EducationLevel = 'masters' | 'degree' | 'bootcamp' | 'school';

export type Education = {
  _id: string;
  degree: string;
  institution: string;
  institutionNote: string | null;
  institutionUrl: string | null;
  level: EducationLevel;
  startDate: string;
  endDate: string | null;
  location: string | null;
  summary: string | null;
  finalProject: string | null;
  skills: Pick<Skill, '_id' | 'name' | 'category'>[] | null;
};

export type Proficiency = 'learning' | 'working' | 'proficient' | 'expert';

export type Skill = {
  _id: string;
  name: string;
  category: SkillCategory;
  proficiency: Proficiency | null;
  yearsOfExperience?: number | null;
  featured?: boolean | null;
};

export type Metric = {
  _key: string;
  label: string | null;
  value: string;
  direction: 'improvement' | 'neutral' | null;
  context: string | null;
};

export type Seo = {
  title: string;
  description: string;
  image: SanityImage;
  noIndex: boolean;
};

export type AvailabilityStatus = 'open' | 'selective' | 'closed';

export type Profile = {
  _id: string;
  fullName: string;
  headline: string | null;
  shortBio: string | null;
  bio: PortableTextBlock[] | null;
  photo: SanityImage;
  location: {
    city: string | null;
    country: string | null;
    countryCode: string | null;
    timezone: string | null;
  } | null;
  careerStartDate: string | null;
  availability: {
    status: AvailabilityStatus | null;
    headline: string | null;
    workModes: string[] | null;
    contractTypes: string[] | null;
    preferredRoles: string[] | null;
    openToRelocation: boolean | null;
  } | null;
  cv: {
    _key: string;
    language: string;
    updatedAt: string | null;
    url: string | null;
    size: number | null;
  }[] | null;
  spokenLanguages: { _key: string; name: string | null; level: string }[] | null;
  email: string;
  phone: string | null;
  schedulingUrl: string | null;
  socials: { _key: string; platform: string; url: string; label: string | null }[] | null;
  seo: Seo;
};

export type PageKey = 'home' | 'about' | 'projects' | 'certifications' | 'contact';

export type Page = {
  _id: string;
  key: PageKey;
  title: string | null;
  lead: string | null;
  seo: Seo;
};

export type Experience = {
  _id: string;
  company: string;
  companyUrl: string | null;
  companyLogo: SanityImage;
  role: string | null;
  startDate: string;
  endDate: string | null;
  employmentType: string | null;
  workMode: string | null;
  location: string | null;
  teamSize: number | null;
  summary: string | null;
  highlights: PortableTextBlock[] | null;
  metrics: Metric[] | null;
  techStack: Skill[] | null;
};

export type ProjectKind = 'professional' | 'personal';

export type ProjectCard = {
  _id: string;
  kind: ProjectKind;
  slug: string;
  title: string | null;
  summary: string | null;
  role?: string | null;
  featured?: boolean | null;
  confidential?: boolean | null;
  startDate?: string | null;
  endDate?: string | null;
  demoUrl?: string | null;
  repoUrl?: string | null;
  coverImage: SanityImage;
  metrics: Metric[] | null;
  techStack: Skill[] | null;
  employer?: { company: string; companyUrl: string | null } | null;
  hasCaseStudy?: boolean;
};

export type ProjectDetail = {
  _id: string;
  kind: ProjectKind;
  slug: string;
  title: string | null;
  summary: string | null;
  role: string | null;
  context: string | null;
  problem: string | null;
  solution: PortableTextBlock[] | null;
  result: string | null;
  confidential: boolean | null;
  startDate: string | null;
  endDate: string | null;
  demoUrl: string | null;
  repoUrl: string | null;
  coverImage: SanityImage;
  gallery:
    | {
        _key: string;
        url: string | null;
        lqip: string | null;
        width: number | null;
        height: number | null;
        alt: string | null;
        caption: string | null;
      }[]
    | null;
  metrics: Metric[] | null;
  techStack: Skill[] | null;
  employer: { company: string; companyUrl: string | null; role: string | null } | null;
  seo: Seo;
  related:
    | {
        _id: string;
        slug: string;
        title: string | null;
        summary: string | null;
        coverImage: SanityImage;
      }[]
    | null;
};

export type CertificationLevel =
  | 'foundational'
  | 'associate'
  | 'professional'
  | 'expert'
  | 'specialist';

export type Certification = {
  _id: string;
  title: string;
  issuer: string;
  issuerUrl: string | null;
  issuerLogo: SanityImage;
  issueDate: string;
  expiryDate: string | null;
  credentialId: string | null;
  verifyUrl: string | null;
  level: CertificationLevel | null;
  studyHours: number | null;
  featured: boolean | null;
  skills: Pick<Skill, '_id' | 'name' | 'category'>[] | null;
};

export type CertificationStats = {
  total: number;
  verifiable: number;
  issuers: number;
  skills: number;
  studyHours: number | null;
};
