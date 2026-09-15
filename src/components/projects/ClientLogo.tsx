import { SanityImage } from '@/components/sanity/SanityImage';
import type { ProjectClient } from '@/sanity/types';
import styles from '@/styles/ClientLogo.module.css';

/**
 * The client's logo on a fixed light tile, so dark logos stay legible on the
 * dark theme. SVGs skip next/image, which refuses them without
 * `dangerouslyAllowSVG` and has nothing to optimise anyway.
 */
export function ClientLogo({
  client,
  size = 'md',
}: {
  client: ProjectClient | undefined;
  size?: 'sm' | 'md' | 'lg';
}) {
  const logo = client?.logo;
  if (!client || !logo?.url) return null;

  const alt = logo.alt || client.name;

  return (
    <span className={`${styles.tile} ${styles[size]}`}>
      {logo.url.endsWith('.svg') ? (
        // biome-ignore lint/performance/noImgElement: next/image does not serve SVGs
        <img src={logo.url} alt={alt} className={styles.image} />
      ) : (
        <SanityImage value={{ ...logo, alt }} className={styles.image} sizes="160px" />
      )}
    </span>
  );
}
