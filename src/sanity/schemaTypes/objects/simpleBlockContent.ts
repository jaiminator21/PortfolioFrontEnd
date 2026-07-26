import { defineArrayMember, defineType } from 'sanity';

/**
 * Deliberately minimal rich text: paragraphs, emphasis and links.
 * No headings or images — bio and case-study prose should not carry layout.
 */
export const simpleBlockContentType = defineType({
  name: 'simpleBlockContent',
  title: 'Rich text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{ title: 'Normal', value: 'normal' }],
      lists: [{ title: 'Bullet', value: 'bullet' }],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Code', value: 'code' },
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (rule) =>
                  rule.uri({ scheme: ['http', 'https', 'mailto'] }).required(),
              },
            ],
          }),
        ],
      },
    }),
  ],
});
