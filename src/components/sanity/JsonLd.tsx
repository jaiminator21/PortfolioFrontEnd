import { jsonLdScript } from '@/lib/jsonld';

/**
 * Injects a JSON-LD block. Server-rendered so crawlers see it without running JS.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: a script body cannot be set via children in React. The payload is JSON.stringify'd with `<` escaped in jsonLdScript, so it cannot close the tag or inject markup.
      dangerouslySetInnerHTML={{ __html: jsonLdScript(data) }}
    />
  );
}
