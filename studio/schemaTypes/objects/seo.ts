import { SearchIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

/**
 * Reusable SEO overrides. Every field is optional on purpose: queries fall back
 * to the document's own content with coalesce(), so an empty SEO object still
 * produces good metadata.
 */
export const seoType = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: SearchIcon,
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'title',
      title: 'Title override',
      description:
        'Overrides the page title in search results. Leave empty to use the document title. Aim for 50–60 characters.',
      type: 'internationalizedArrayString',
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      description:
        'Shown under the title in Google. 140–160 characters. This is often the first thing a recruiter reads about you.',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'image',
      title: 'Social share image',
      description: 'Used by LinkedIn, X and WhatsApp previews. 1200x630 recommended.',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'internationalizedArrayString',
          title: 'Alternative text',
        }),
      ],
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      description: 'Excludes this page from the sitemap and adds a noindex directive.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
});
