import { PortableText, type PortableTextComponents } from 'next-sanity';
import type { PortableTextBlock } from 'next-sanity';

/**
 * Renders the `simpleBlockContent` type. External links get `rel="noopener"`
 * and open in a new tab; internal ones do not.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = (value?.href as string | undefined) ?? '#';
      const isExternal = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      );
    },
    code: ({ children }) => <code>{children}</code>,
  },
};

export function RichText({
  value,
  className,
}: {
  value: PortableTextBlock[] | null | undefined;
  className?: string;
}) {
  if (!value?.length) return null;
  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  );
}

/** Flatten Portable Text to a plain string, for meta tags and JSON-LD. */
export function toPlainText(value: PortableTextBlock[] | null | undefined): string {
  if (!value?.length) return '';
  return value
    .map((block) => {
      if (block._type !== 'block' || !Array.isArray(block.children)) return '';
      return block.children.map((child) => (child as { text?: string }).text ?? '').join('');
    })
    .filter(Boolean)
    .join('\n\n');
}
