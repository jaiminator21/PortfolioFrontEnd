import { BookIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * Formal education: degrees, master's programmes, bootcamps.
 *
 * Separate from `certification` because they are different claims. A degree is
 * awarded by an institution after a programme of study; a certification is a
 * credential you can hand a recruiter a verification link for. Collapsing them
 * would make both harder to read.
 *
 * `institution` and `degree` are plain strings — an institution's name and an
 * official qualification are proper nouns, and translating them would stop a
 * recruiter matching them against what they know.
 */
export const educationType = defineType({
  name: 'education',
  title: 'Education',
  type: 'document',
  icon: BookIcon,
  fieldsets: [{ name: 'dates', title: 'Dates', options: { columns: 2 } }],
  fields: [
    defineField({
      name: 'degree',
      title: 'Qualification',
      description:
        'The official title, e.g. "Full Stack Development Bootcamp" or "Master\'s Degree in Marketing, Communication and Videogame Production".',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'institution',
      title: 'Institution',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'institutionNote',
      title: 'Institution detail',
      description:
        'Optional context a recruiter outside Spain would not know, e.g. "Digital arts university affiliated with Deusto University".',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'institutionUrl',
      title: 'Institution website',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'level',
      title: 'Level',
      description: 'Drives grouping and ordering on the page.',
      type: 'string',
      options: {
        list: [
          { title: "Master's degree", value: 'masters' },
          { title: 'Degree', value: 'degree' },
          { title: 'Bootcamp', value: 'bootcamp' },
          { title: 'Secondary / High school', value: 'school' },
        ],
        layout: 'radio',
      },
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
      description: 'Leave empty if still in progress.',
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
      name: 'location',
      type: 'string',
      description: 'City and country.',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      description: 'What the programme covered, or the standout piece of work.',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'finalProject',
      title: 'Final project',
      description: 'Thesis or capstone title, if there was one worth naming.',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'skills',
      title: 'Skills covered',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'skill' }] })],
      validation: (rule) => rule.unique(),
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
      degree: 'degree',
      institution: 'institution',
      startDate: 'startDate',
      endDate: 'endDate',
    },
    prepare: ({ degree, institution, startDate, endDate }) => ({
      title: degree,
      subtitle: `${institution ?? ''} · ${startDate?.slice(0, 4) ?? '?'}–${
        endDate?.slice(0, 4) ?? 'present'
      }`,
    }),
  },
});
