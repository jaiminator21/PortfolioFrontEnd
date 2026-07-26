import type { SchemaTypeDefinition } from 'sanity';

import { certificationType } from './documents/certification';
import { experienceType } from './documents/experience';
import { localeType } from './documents/locale';
import { pageType } from './documents/page';
import { profileType } from './documents/profile';
import { projectType } from './documents/project';
import { skillType } from './documents/skill';
import { metricType } from './objects/metric';
import { seoType } from './objects/seo';
import { simpleBlockContentType } from './objects/simpleBlockContent';
import { socialLinkType } from './objects/socialLink';

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  profileType,
  experienceType,
  projectType,
  certificationType,
  skillType,
  pageType,
  localeType,
  // Objects
  seoType,
  metricType,
  socialLinkType,
  simpleBlockContentType,
];
