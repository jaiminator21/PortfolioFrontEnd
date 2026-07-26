import { LinkIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

/**
 * Platform values map to icons and to the `sameAs` array of the Person
 * JSON-LD — that array is how Google links this site to your LinkedIn and
 * GitHub profiles, so keep the URLs canonical.
 */
export const socialLinkType = defineType({
  name: 'socialLink',
  title: 'Social link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'platform',
      type: 'string',
      options: {
        list: [
          { title: 'LinkedIn', value: 'linkedin' },
          { title: 'GitHub', value: 'github' },
          { title: 'X / Twitter', value: 'x' },
          { title: 'Email', value: 'email' },
          { title: 'Website', value: 'website' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      type: 'url',
      validation: (rule) =>
        rule.uri({ scheme: ['http', 'https', 'mailto'] }).required(),
    }),
    defineField({
      name: 'label',
      type: 'string',
      description: 'Optional display text. Defaults to the handle in the URL.',
    }),
  ],
  preview: {
    select: { title: 'platform', subtitle: 'url' },
  },
});
