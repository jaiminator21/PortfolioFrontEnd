import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Profile } from '@/sanity/types';
import styles from '@/styles/CvDownload.module.css';

/**
 * Picks the CV matching the active locale, falling back to whatever was
 * uploaded. Renders nothing when no CV exists — a dead download button is worse
 * than no button.
 */
export function CvDownload({
  cv,
  locale,
  fullName,
  className,
}: {
  cv: Profile['cv'];
  locale: string;
  fullName: string;
  className?: string;
}) {
  const t = useTranslations('Common');

  const match = cv?.find((doc) => doc.language === locale) ?? cv?.[0];
  if (!match?.url) return null;

  // `download` gives the file a meaningful name instead of a Sanity asset hash.
  const filename = `${fullName.replace(/\s+/g, '-')}-CV-${match.language}.pdf`;

  return (
    <a
      href={`${match.url}?dl=${encodeURIComponent(filename)}`}
      className={`${styles.link} ${className ?? ''}`}
      download={filename}
    >
      <Download size={16} aria-hidden="true" />
      <span>{t('downloadCV')}</span>
    </a>
  );
}
