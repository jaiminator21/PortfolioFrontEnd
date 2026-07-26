import { DocumentIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

/**
 * Editorial wrapper for the fixed routes: the heading, the intro paragraph and
 * the SEO overrides. The listings themselves come from their own document types.
 *
 * These are singletons keyed by route, created with fixed IDs (`page-home`,
 * `page-about`, …) from the Studio structure.
 */
export const pageType = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'key',
      title: 'Route',
      type: 'string',
      readOnly: true,
      options: {
        list: [
          { title: 'Home', value: 'home' },
          { title: 'About', value: 'about' },
          { title: 'Projects', value: 'projects' },
          { title: 'Certifications', value: 'certifications' },
          { title: 'Contact', value: 'contact' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Page heading',
      description:
        'Wrap a word in *asterisks* to give it the accent colour, e.g. "Building the *digital* future."',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lead',
      title: 'Intro paragraph',
      description: 'The first thing a visitor reads on the page. One or two sentences.',
      type: 'internationalizedArrayText',
    }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  preview: {
    select: { title: 'title.0.value', key: 'key' },
    prepare: ({ title, key }) => ({
      title: title ?? key,
      subtitle: `/${key === 'home' ? '' : key}`,
    }),
  },
});
