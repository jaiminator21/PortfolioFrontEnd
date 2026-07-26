import type { StructureResolver } from 'sanity/structure';
import {
  BookIcon,
  CaseIcon,
  CodeBlockIcon,
  CogIcon,
  DocumentIcon,
  RocketIcon,
  StarIcon,
  TranslateIcon,
  UserIcon,
} from '@sanity/icons';

/**
 * Ordered by how often it gets edited, not alphabetically: profile and projects
 * first, locales last.
 *
 * Singletons (profile, the five pages) are pinned to fixed document IDs so there
 * can only ever be one of each.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Profile')
        .icon(UserIcon)
        .child(S.document().schemaType('profile').documentId('profile').title('Profile')),

      S.divider(),

      S.documentTypeListItem('project').title('Projects').icon(RocketIcon),
      S.documentTypeListItem('experience').title('Experience').icon(CaseIcon),
      S.documentTypeListItem('education').title('Education').icon(BookIcon),
      S.documentTypeListItem('certification').title('Certifications').icon(StarIcon),
      S.documentTypeListItem('skill').title('Skills').icon(CodeBlockIcon),

      S.divider(),

      S.listItem()
        .title('Pages')
        .icon(DocumentIcon)
        .child(
          S.list()
            .title('Pages')
            .items(
              (
                [
                  ['home', 'Home'],
                  ['about', 'About'],
                  ['projects', 'Projects'],
                  ['certifications', 'Certifications'],
                  ['contact', 'Contact'],
                ] as const
              ).map(([key, title]) =>
                S.listItem()
                  .id(key)
                  .title(title)
                  .icon(DocumentIcon)
                  .child(
                    S.document()
                      .schemaType('page')
                      .documentId(`page-${key}`)
                      .title(title)
                  )
              )
            )
        ),

      S.divider(),

      S.listItem()
        .title('Settings')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Settings')
            .items([S.documentTypeListItem('locale').title('Locales').icon(TranslateIcon)])
        ),
    ]);
