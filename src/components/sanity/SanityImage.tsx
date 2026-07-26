import Image from 'next/image';
import type { SanityImage as SanityImageValue } from '@/sanity/types';

/**
 * next/image wrapper for Sanity assets.
 *
 * Uses the LQIP that Sanity stores with every asset as the blur placeholder, and
 * the intrinsic dimensions to reserve space — so images do not contribute to
 * layout shift, which is a Core Web Vitals cost on the first page a recruiter
 * loads.
 */
export function SanityImage({
  value,
  sizes,
  className,
  priority = false,
  fill = false,
}: {
  value: SanityImageValue;
  sizes?: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
}) {
  if (!value?.url) return null;

  const alt = value.alt ?? '';

  const blur = value.lqip
    ? ({ placeholder: 'blur', blurDataURL: value.lqip } as const)
    : {};

  if (fill) {
    return (
      <Image
        src={value.url}
        alt={alt}
        fill
        sizes={sizes ?? '100vw'}
        className={className}
        priority={priority}
        {...blur}
      />
    );
  }

  return (
    <Image
      src={value.url}
      alt={alt}
      width={value.width ?? 1200}
      height={value.height ?? 630}
      sizes={sizes}
      className={className}
      priority={priority}
      {...blur}
    />
  );
}
