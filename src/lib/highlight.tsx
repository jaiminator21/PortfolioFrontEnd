import type { ReactNode } from 'react';

/**
 * Splits a headline on `*asterisks*` and wraps those segments in `className`.
 *
 * This keeps the accent styling in the editor's hands: writing
 * "Building the *digital* future." highlights one word, without the content
 * model having to know anything about gradients or spans.
 */
export function withHighlight(
  value: string | null | undefined,
  className: string
): ReactNode {
  if (!value) return null;

  // With one capture group, split() alternates: text, captured, text, captured…
  const segments = value.split(/\*([^*]+)\*/g);

  return segments.map((segment, i) =>
    i % 2 === 1 ? (
      // The segment text plus its position is a stable identity here: the list
      // is derived from one string and never reorders.
      <span key={`hl-${i}-${segment}`} className={className}>
        {segment}
      </span>
    ) : (
      segment
    )
  );
}
