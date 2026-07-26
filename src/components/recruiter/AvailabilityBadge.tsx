import { useTranslations } from 'next-intl';
import type { AvailabilityStatus } from '@/sanity/types';
import styles from '@/styles/AvailabilityBadge.module.css';

/**
 * Answers "are they even looking?" at a glance.
 *
 * Renders nothing when the status is `closed`: a portfolio that announces
 * unavailability invites the reader to leave. Silence is better.
 */
export function AvailabilityBadge({
  status,
  note,
}: {
  status: AvailabilityStatus | null | undefined;
  note?: string | null;
}) {
  const t = useTranslations('Availability');

  if (!status || status === 'closed') return null;

  return (
    <div className={`${styles.badge} ${status === 'open' ? styles.open : styles.selective}`}>
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.label}>{t(`status.${status}`)}</span>
      {note ? <span className={styles.note}>{note}</span> : null}
    </div>
  );
}
