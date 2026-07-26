import { TranslateIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

/**
 * Locales live in content rather than code so the Studio's language tabs and
 * the frontend's routing read from one source. Adding a locale here makes it
 * appear on every localized field.
 */
export const localeType = defineType({
  name: 'locale',
  title: 'Locale',
  type: 'document',
  icon: TranslateIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Display name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tag',
      title: 'IETF language tag',
      description: 'Lowercase, e.g. "es" or "en". Must match the locale in the URL.',
      type: 'string',
      validation: (rule) =>
        rule.required().custom((value) =>
          value && /^[a-z]{2}(-[A-Za-z0-9]{2,8})*$/.test(value)
            ? true
            : 'Use a valid tag such as "es", "en" or "en-US"'
        ),
    }),
    defineField({
      name: 'isDefault',
      title: 'Default locale',
      description: 'Exactly one locale should be the default. Used for content fallbacks.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'name', tag: 'tag', isDefault: 'isDefault' },
    prepare: ({ title, tag, isDefault }) => ({
      title,
      subtitle: isDefault ? `${tag} · default` : tag,
    }),
  },
});
