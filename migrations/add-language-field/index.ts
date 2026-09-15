import { defineMigration, set } from 'sanity/migrate';

/**
 * Moves internationalized-array values to the v5 shape of
 * sanity-plugin-internationalized-array, where the language lives in a
 * dedicated `language` field instead of `_key`.
 *
 * Unlike the plugin's own `migrateToLanguageField`, this keeps `_key` as it is.
 * 'es' and 'en' stay unique within each array, and keeping them means a deploy
 * still filtering on `_key` keeps rendering content while the new queries roll
 * out.
 *
 *   npx sanity migration run add-language-field               # dry run
 *   npx sanity migration run add-language-field --no-dry-run
 */
export default defineMigration({
  title: 'Add a language field to internationalized array values',
  documentTypes: ['profile', 'page', 'experience', 'project', 'certification', 'education', 'skill'],
  migrate: {
    object(node) {
      const { _type: type, _key: key, language } = node as {
        _type?: unknown;
        _key?: unknown;
        language?: unknown;
      };

      const isValue =
        typeof type === 'string' &&
        type.startsWith('internationalizedArray') &&
        type.endsWith('Value');
      if (!isValue || (typeof language === 'string' && language)) return;
      if (typeof key !== 'string' || !key) return;

      return set({ ...node, language: key });
    },
  },
});
