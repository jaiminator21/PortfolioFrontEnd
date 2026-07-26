import { CodeBlockIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

/**
 * One document per technology, referenced from experience, projects and
 * certifications.
 *
 * `name` is intentionally NOT localized: "TypeScript" is "TypeScript" in every
 * language, and translating tech names would break keyword matching — recruiters
 * and ATS filters search for the exact string.
 */
export const skillType = defineType({
  name: 'skill',
  title: 'Skill',
  type: 'document',
  icon: CodeBlockIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      description: 'Exactly as the industry writes it: "Next.js", "PostgreSQL", "CI/CD".',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      options: {
        list: [
          { title: 'Frontend', value: 'frontend' },
          { title: 'Backend', value: 'backend' },
          { title: 'Databases', value: 'databases' },
          { title: 'Cloud & DevOps', value: 'cloud' },
          { title: 'Testing', value: 'testing' },
          { title: 'Tooling', value: 'tooling' },
          { title: 'Design', value: 'design' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'proficiency',
      title: 'Proficiency',
      description:
        'Be honest here. Claiming expert on something you used once is the fastest way to fail a technical screen.',
      type: 'string',
      options: {
        list: [
          { title: 'Learning', value: 'learning' },
          { title: 'Working knowledge', value: 'working' },
          { title: 'Proficient', value: 'proficient' },
          { title: 'Expert', value: 'expert' },
        ],
        layout: 'radio',
      },
      initialValue: 'proficient',
    }),
    defineField({
      name: 'yearsOfExperience',
      title: 'Years of experience',
      type: 'number',
      validation: (rule) => rule.min(0).max(50).precision(1),
    }),
    defineField({
      name: 'featured',
      title: 'Show in the main stack',
      description: 'Featured skills appear on the homepage. Keep this to your strongest 10–14.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      type: 'number',
      initialValue: 100,
    }),
  ],
  orderings: [
    {
      title: 'Category, then order',
      name: 'categoryOrder',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: { title: 'name', category: 'category', featured: 'featured' },
    prepare: ({ title, category, featured }) => ({
      title,
      subtitle: [category, featured ? 'featured' : null].filter(Boolean).join(' · '),
    }),
  },
});
