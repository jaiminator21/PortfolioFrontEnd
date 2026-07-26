import { StarIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * `title` and `issuer` are plain strings, not localized: certification names are
 * proper nouns and must match the issuer's wording exactly so a recruiter can
 * verify them.
 *
 * `credentialId` + `verifyUrl` are the fields that matter most here. A cert a
 * recruiter cannot verify counts for nothing, and one that fails verification
 * counts against you.
 */
export const certificationType = defineType({
  name: 'certification',
  title: 'Certification',
  type: 'document',
  icon: StarIcon,
  fieldsets: [
    { name: 'credential', title: 'Credential & verification', options: { columns: 2 } },
    { name: 'dates', title: 'Dates', options: { columns: 2 } },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Certification name',
      description: 'Exactly as the issuer writes it, e.g. "AWS Certified Solutions Architect – Associate".',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'issuer',
      title: 'Issuing organisation',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'issuerUrl',
      title: 'Issuer website',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'issuerLogo',
      title: 'Issuer logo',
      type: 'image',
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alternative text' })],
    }),
    defineField({
      name: 'issueDate',
      type: 'date',
      fieldset: 'dates',
      options: { dateFormat: 'YYYY-MM' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'expiryDate',
      type: 'date',
      description: 'Leave empty if the credential does not expire.',
      fieldset: 'dates',
      options: { dateFormat: 'YYYY-MM' },
      validation: (rule) =>
        rule.custom((expiryDate, context) => {
          const issueDate = context.document?.issueDate as string | undefined;
          if (issueDate && expiryDate && new Date(expiryDate) < new Date(issueDate)) {
            return 'Expiry date must be after the issue date';
          }
          return true;
        }),
    }),
    defineField({
      name: 'credentialId',
      title: 'Credential ID',
      description: 'Copy it from the real credential. Leave empty rather than guessing.',
      type: 'string',
      fieldset: 'credential',
    }),
    defineField({
      name: 'verifyUrl',
      title: 'Verification URL',
      description:
        'The issuer\'s public verification page (Credly, AWS, Coursera…). Must resolve to your credential — not the issuer\'s homepage.',
      type: 'url',
      fieldset: 'credential',
      validation: (rule) => rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'level',
      type: 'string',
      options: {
        list: [
          { title: 'Foundational', value: 'foundational' },
          { title: 'Associate', value: 'associate' },
          { title: 'Professional', value: 'professional' },
          { title: 'Expert', value: 'expert' },
          { title: 'Specialist', value: 'specialist' },
        ],
      },
      initialValue: 'professional',
    }),
    defineField({
      name: 'skills',
      title: 'Skills validated',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'skill' }] })],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'studyHours',
      title: 'Study hours',
      description: 'Optional. Only add it if you actually tracked the time.',
      type: 'number',
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: 'featured',
      title: 'Feature on the homepage',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: 'Most recent first',
      name: 'issueDateDesc',
      by: [{ field: 'issueDate', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      issuer: 'issuer',
      issueDate: 'issueDate',
      verifyUrl: 'verifyUrl',
      media: 'issuerLogo',
    },
    prepare: ({ title, issuer, issueDate, verifyUrl, media }) => ({
      title,
      subtitle: [
        issuer,
        issueDate?.slice(0, 7),
        verifyUrl ? 'verifiable' : 'no verification link',
      ]
        .filter(Boolean)
        .join(' · '),
      media,
    }),
  },
});
