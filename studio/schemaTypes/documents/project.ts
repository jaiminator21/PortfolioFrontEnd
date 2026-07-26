import { RocketIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * Covers both professional case studies and personal projects. `kind` drives
 * which fields matter: the context/problem/solution/result narrative only shows
 * for professional work, and demo/repo links only for personal work.
 */
export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: RocketIcon,
  groups: [
    { name: 'overview', title: 'Overview', default: true },
    { name: 'caseStudy', title: 'Case study' },
    { name: 'media', title: 'Media & links' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'kind',
      title: 'Type of project',
      type: 'string',
      group: 'overview',
      options: {
        list: [
          { title: 'Professional (case study)', value: 'professional' },
          { title: 'Personal (side project)', value: 'personal' },
        ],
        layout: 'radio',
      },
      initialValue: 'professional',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      type: 'internationalizedArrayString',
      group: 'overview',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      description:
        'The URL segment. Keep it stable once published — changing it breaks any link a recruiter already has.',
      type: 'slug',
      group: 'overview',
      options: {
        source: (doc: Record<string, unknown>) => {
          const title = doc.title as { _key: string; value: string }[] | undefined;
          return title?.find((t) => t._key === 'en')?.value ?? title?.[0]?.value ?? '';
        },
        maxLength: 70,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      description:
        'The card blurb and the meta description. Say what it does and who it was for in under 200 characters.',
      type: 'internationalizedArrayText',
      group: 'overview',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'employer',
      title: 'Built at',
      description:
        'Links the project to a role, so a recruiter can see where the work happened.',
      type: 'reference',
      to: [{ type: 'experience' }],
      // Weak so the case study survives its employer document being removed,
      // and so an unpublished role can still be linked while you draft.
      weak: true,
      group: 'overview',
      hidden: ({ document }) => document?.kind !== 'professional',
    }),
    defineField({
      name: 'techStack',
      title: 'Tech stack',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'skill' }] })],
      group: 'overview',
      validation: (rule) => rule.unique().min(1),
    }),
    defineField({
      name: 'startDate',
      type: 'date',
      group: 'overview',
      options: { dateFormat: 'YYYY-MM' },
    }),
    defineField({
      name: 'endDate',
      type: 'date',
      description: 'Leave empty if the work is ongoing.',
      group: 'overview',
      options: { dateFormat: 'YYYY-MM' },
    }),
    defineField({
      name: 'featured',
      title: 'Feature on the homepage',
      description: 'Pick your two or three strongest. Featuring everything features nothing.',
      type: 'boolean',
      group: 'overview',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      group: 'overview',
      initialValue: 100,
    }),

    // ---- Case study ---------------------------------------------------------
    defineField({
      name: 'role',
      title: 'Your role',
      description: 'Be precise about what was yours. "Tech lead, frontend — 4 engineers".',
      type: 'internationalizedArrayString',
      group: 'caseStudy',
      hidden: ({ document }) => document?.kind !== 'professional',
    }),
    defineField({
      name: 'context',
      title: 'Context',
      description: 'The business and the scale. Where was the company when this started?',
      type: 'internationalizedArrayText',
      group: 'caseStudy',
      hidden: ({ document }) => document?.kind !== 'professional',
    }),
    defineField({
      name: 'problem',
      title: 'Problem',
      description: 'What was broken, and what was it costing?',
      type: 'internationalizedArrayText',
      group: 'caseStudy',
      hidden: ({ document }) => document?.kind !== 'professional',
    }),
    defineField({
      name: 'solution',
      title: 'Solution',
      description:
        'What you built and the trade-offs you chose. Interviewers probe here — name the decisions, not just the tools.',
      type: 'internationalizedArraySimpleBlockContent',
      group: 'caseStudy',
      hidden: ({ document }) => document?.kind !== 'professional',
    }),
    defineField({
      name: 'result',
      title: 'Result',
      description: 'The outcome in prose. Put the numbers in Impact metrics below.',
      type: 'internationalizedArrayText',
      group: 'caseStudy',
      hidden: ({ document }) => document?.kind !== 'professional',
    }),
    defineField({
      name: 'metrics',
      title: 'Impact metrics',
      description: 'Only verified metrics are rendered publicly.',
      type: 'array',
      of: [defineArrayMember({ type: 'metric' })],
      group: 'caseStudy',
    }),
    defineField({
      name: 'confidential',
      title: 'Under NDA',
      description:
        'Marks the project as confidential and hides the employer name on the public site. The case study itself stays visible.',
      type: 'boolean',
      group: 'caseStudy',
      initialValue: false,
      hidden: ({ document }) => document?.kind !== 'professional',
    }),

    // ---- Media & links ------------------------------------------------------
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: { hotspot: true },
      group: 'media',
      fields: [
        defineField({ name: 'alt', type: 'internationalizedArrayString', title: 'Alternative text' }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      description: 'Screenshots of the real thing. Concrete beats abstract every time.',
      type: 'array',
      group: 'media',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'internationalizedArrayString', title: 'Alternative text' }),
            defineField({ name: 'caption', type: 'internationalizedArrayString' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'demoUrl',
      title: 'Live demo',
      description: 'A working link is worth more than any description. Check it still resolves.',
      type: 'url',
      group: 'media',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'repoUrl',
      title: 'Source code',
      type: 'url',
      group: 'media',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),

    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
  ],
  orderings: [
    {
      title: 'Featured, then order',
      name: 'featuredOrder',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'order', direction: 'asc' },
      ],
    },
    {
      title: 'Most recent first',
      name: 'recent',
      by: [{ field: 'startDate', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title.0.value',
      kind: 'kind',
      featured: 'featured',
      media: 'coverImage',
    },
    prepare: ({ title, kind, featured, media }) => ({
      title: title ?? 'Untitled project',
      subtitle: [kind, featured ? 'featured' : null].filter(Boolean).join(' · '),
      media,
    }),
  },
});
