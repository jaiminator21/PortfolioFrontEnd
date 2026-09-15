import { RocketIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * Covers both professional case studies and personal projects. `kind` drives
 * which fields matter: the context/problem/solution/result narrative only shows
 * for professional work, and `category` only for personal work.
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
      name: 'category',
      title: 'Category',
      description: 'Groups personal projects into filters on the projects page.',
      type: 'string',
      group: 'overview',
      options: {
        list: [
          { title: 'Website', value: 'website' },
          { title: 'Script', value: 'script' },
          { title: 'Side project', value: 'sideProject' },
          { title: 'Mobile app', value: 'mobileApp' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'radio',
      },
      hidden: ({ document }) => document?.kind !== 'personal',
      validation: (rule) =>
        rule.custom((value, { document }) =>
          document?.kind === 'personal' && !value ? 'Pick a category' : true
        ),
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
          const title = doc.title as
            | { _key: string; language?: string; value: string }[]
            | undefined;
          const english = title?.find((t) => (t.language ?? t._key) === 'en');
          return english?.value ?? title?.[0]?.value ?? '';
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
      name: 'client',
      title: 'Client',
      description:
        'The company the work was built for. Its logo shows on the card and the project page. Hidden publicly when the project is under NDA.',
      type: 'object',
      group: 'overview',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'name', type: 'string' }),
        defineField({
          name: 'logo',
          type: 'image',
          description: 'SVG or a transparent PNG reads best on both light and dark themes.',
          fields: [defineField({ name: 'alt', type: 'string', title: 'Alternative text' })],
        }),
        defineField({
          name: 'url',
          title: 'Website',
          type: 'url',
          validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
        }),
      ],
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
      name: 'embedDemo',
      title: 'Show a live preview',
      description:
        'Embeds the live demo in an iframe on the project page. Many sites forbid being framed — the page checks this and falls back to the cover image and a link when they do.',
      type: 'boolean',
      group: 'media',
      initialValue: false,
      hidden: ({ document }) => !document?.demoUrl,
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
      category: 'category',
      client: 'client.name',
      featured: 'featured',
      media: 'coverImage',
      logo: 'client.logo',
    },
    prepare: ({ title, kind, category, client, featured, media, logo }) => ({
      title: title ?? 'Untitled project',
      subtitle: [kind, kind === 'personal' ? category : client, featured ? 'featured' : null]
        .filter(Boolean)
        .join(' · '),
      media: media ?? logo,
    }),
  },
});
