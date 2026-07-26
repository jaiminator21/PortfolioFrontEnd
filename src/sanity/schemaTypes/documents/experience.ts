import { CaseIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * One document per role. Ordered by startDate on the frontend, so there is no
 * manual "order" field to keep in sync.
 *
 * `endDate` empty means "current" — deriving it beats a separate boolean that
 * can contradict the dates.
 */
export const experienceType = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  icon: CaseIcon,
  fieldsets: [{ name: 'dates', title: 'Dates', options: { columns: 2 } }],
  fields: [
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'companyUrl',
      title: 'Company website',
      description: 'Lets a recruiter verify the employer in one click.',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'companyLogo',
      title: 'Company logo',
      type: 'image',
      options: { hotspot: false },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alternative text' }),
      ],
    }),
    defineField({
      name: 'role',
      title: 'Job title',
      description:
        'Use the title recruiters search for, not an internal one. "Senior Frontend Engineer" over "Frontend Ninja II".',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'startDate',
      type: 'date',
      fieldset: 'dates',
      options: { dateFormat: 'YYYY-MM' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      type: 'date',
      description: 'Leave empty if this is your current role.',
      fieldset: 'dates',
      options: { dateFormat: 'YYYY-MM' },
      validation: (rule) =>
        rule.custom((endDate, context) => {
          const startDate = context.document?.startDate as string | undefined;
          if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
            return 'End date must be after the start date';
          }
          return true;
        }),
    }),
    defineField({
      name: 'employmentType',
      type: 'string',
      options: {
        list: [
          { title: 'Full-time', value: 'fulltime' },
          { title: 'Part-time', value: 'parttime' },
          { title: 'Contract', value: 'contract' },
          { title: 'Freelance', value: 'freelance' },
          { title: 'Internship', value: 'internship' },
        ],
      },
      initialValue: 'fulltime',
    }),
    defineField({
      name: 'workMode',
      type: 'string',
      options: {
        list: [
          { title: 'Remote', value: 'remote' },
          { title: 'Hybrid', value: 'hybrid' },
          { title: 'On-site', value: 'onsite' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'location',
      type: 'string',
      description: 'City and country, or "Remote".',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      description: 'One or two sentences on the scope: product, scale, team size.',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'highlights',
      title: 'Key contributions',
      description:
        'Start each with a verb and name the outcome. "Led the design system migration across 4 products" beats "Responsible for the design system".',
      type: 'internationalizedArraySimpleBlockContent',
    }),
    defineField({
      name: 'metrics',
      title: 'Impact metrics',
      type: 'array',
      of: [defineArrayMember({ type: 'metric' })],
    }),
    defineField({
      name: 'techStack',
      title: 'Tech stack',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'skill' }] })],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'teamSize',
      title: 'Team size',
      description: 'Optional. Signals the scale you are used to operating at.',
      type: 'number',
      validation: (rule) => rule.min(1).integer(),
    }),
  ],
  orderings: [
    {
      title: 'Most recent first',
      name: 'startDateDesc',
      by: [{ field: 'startDate', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      role: 'role.0.value',
      company: 'company',
      startDate: 'startDate',
      endDate: 'endDate',
      media: 'companyLogo',
    },
    prepare: ({ role, company, startDate, endDate, media }) => ({
      title: `${role ?? 'Untitled role'} · ${company ?? ''}`,
      subtitle: `${startDate?.slice(0, 7) ?? '?'} – ${endDate?.slice(0, 7) ?? 'present'}`,
      media,
    }),
  },
});
