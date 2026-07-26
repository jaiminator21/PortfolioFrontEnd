import { UserIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * Singleton describing the person. Drives the hero, the about page, the footer,
 * the Person JSON-LD and the availability banner.
 *
 * `careerStartDate` is stored instead of a "years of experience" number so the
 * figure never goes stale — the frontend derives it at render time.
 */
export const profileType = defineType({
  name: 'profile',
  title: 'Profile',
  type: 'document',
  icon: UserIcon,
  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'hiring', title: 'Hiring' },
    { name: 'contact', title: 'Contact' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'fullName',
      title: 'Full name',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      description:
        'Your one-line professional identity, e.g. "Full-stack developer · React, Next.js, TypeScript". This is the single most-read string on the site.',
      type: 'internationalizedArrayString',
      group: 'identity',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortBio',
      title: 'Short bio',
      description:
        'Two or three sentences for the hero and social previews. Lead with what you build and the impact, not adjectives.',
      type: 'internationalizedArrayText',
      group: 'identity',
    }),
    defineField({
      name: 'bio',
      title: 'Full bio',
      description: 'The longer story for the about page.',
      type: 'internationalizedArraySimpleBlockContent',
      group: 'identity',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      description:
        'A real, current photo of your face. Portfolios with one measurably outperform those without.',
      type: 'image',
      options: { hotspot: true },
      group: 'identity',
      fields: [
        defineField({ name: 'alt', type: 'internationalizedArrayString', title: 'Alternative text' }),
      ],
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'object',
      group: 'identity',
      options: { columns: 2 },
      fields: [
        defineField({ name: 'city', type: 'string' }),
        defineField({ name: 'country', type: 'string' }),
        defineField({
          name: 'countryCode',
          title: 'Country code',
          description: 'ISO 3166-1 alpha-2, e.g. "ES". Used in structured data.',
          type: 'string',
          validation: (rule) => rule.max(2).uppercase(),
        }),
        defineField({
          name: 'timezone',
          description: 'IANA zone, e.g. "Europe/Madrid". Helps remote recruiters judge overlap.',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'careerStartDate',
      title: 'Career start date',
      description:
        'When your professional experience began. Years of experience is calculated from this, so it never goes out of date.',
      type: 'date',
      options: { dateFormat: 'YYYY-MM' },
      group: 'identity',
    }),

    // ---- Hiring -------------------------------------------------------------
    defineField({
      name: 'availability',
      title: 'Availability',
      description:
        'Answers the recruiter\'s first question before they have to ask it. Keep the status current — a stale "open to work" wastes everyone\'s time.',
      type: 'object',
      group: 'hiring',
      fields: [
        defineField({
          name: 'status',
          type: 'string',
          options: {
            list: [
              { title: 'Open to opportunities', value: 'open' },
              { title: 'Open to the right role only', value: 'selective' },
              { title: 'Not looking right now', value: 'closed' },
            ],
            layout: 'radio',
          },
          initialValue: 'open',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'headline',
          title: 'Availability note',
          description: 'Optional detail: "Available from September", "3-month notice period".',
          type: 'internationalizedArrayString',
        }),
        defineField({
          name: 'workModes',
          title: 'Work modes',
          type: 'array',
          of: [defineArrayMember({ type: 'string' })],
          options: {
            list: [
              { title: 'Remote', value: 'remote' },
              { title: 'Hybrid', value: 'hybrid' },
              { title: 'On-site', value: 'onsite' },
            ],
            layout: 'grid',
          },
        }),
        defineField({
          name: 'contractTypes',
          title: 'Open to',
          type: 'array',
          of: [defineArrayMember({ type: 'string' })],
          options: {
            list: [
              { title: 'Full-time employment', value: 'fulltime' },
              { title: 'Part-time', value: 'parttime' },
              { title: 'Contract / freelance', value: 'freelance' },
            ],
            layout: 'grid',
          },
        }),
        defineField({
          name: 'preferredRoles',
          title: 'Target roles',
          description:
            'The exact titles you want to be contacted about, e.g. "Senior Frontend Engineer". Recruiters search by title.',
          type: 'array',
          of: [defineArrayMember({ type: 'string' })],
        }),
        defineField({
          name: 'openToRelocation',
          title: 'Open to relocation',
          type: 'boolean',
          initialValue: false,
        }),
      ],
    }),
    defineField({
      name: 'cv',
      title: 'CV / résumé',
      description:
        'Upload one PDF per language. A recruiter who cannot download a CV in one click will often move on.',
      type: 'array',
      group: 'hiring',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'cvDocument',
          fields: [
            defineField({
              name: 'language',
              type: 'string',
              description: 'Language tag matching a locale, e.g. "es" or "en".',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'file',
              type: 'file',
              options: { accept: '.pdf' },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'updatedAt',
              title: 'Last updated',
              type: 'date',
            }),
          ],
          preview: {
            select: { title: 'language', subtitle: 'updatedAt' },
          },
        }),
      ],
    }),
    defineField({
      name: 'spokenLanguages',
      title: 'Spoken languages',
      type: 'array',
      group: 'hiring',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'spokenLanguage',
          fields: [
            defineField({
              name: 'name',
              type: 'internationalizedArrayString',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'level',
              type: 'string',
              description: 'CEFR level, or "Native".',
              options: {
                list: ['Native', 'C2', 'C1', 'B2', 'B1', 'A2', 'A1'],
              },
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'name.0.value', subtitle: 'level' },
          },
        }),
      ],
    }),

    // ---- Contact ------------------------------------------------------------
    defineField({
      name: 'email',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.email().required(),
    }),
    defineField({
      name: 'phone',
      type: 'string',
      description: 'Optional. Include the country code if you add one.',
      group: 'contact',
    }),
    defineField({
      name: 'schedulingUrl',
      title: 'Scheduling link',
      description:
        'Calendly, Cal.com or similar. Removes the back-and-forth of finding a slot — one of the highest-leverage things on a portfolio.',
      type: 'url',
      group: 'contact',
      validation: (rule) => rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'socials',
      title: 'Social profiles',
      type: 'array',
      group: 'contact',
      of: [defineArrayMember({ type: 'socialLink' })],
    }),

    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
  ],
  preview: {
    select: { title: 'fullName', subtitle: 'headline.0.value', media: 'photo' },
  },
});
