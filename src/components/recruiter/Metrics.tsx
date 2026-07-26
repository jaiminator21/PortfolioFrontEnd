import { TrendingUp } from 'lucide-react';
import type { Metric } from '@/sanity/types';
import styles from '@/styles/Metrics.module.css';

/**
 * The quantified-outcome row. Recruiters scan numbers before prose, so these sit
 * high in the card.
 *
 * The query already filtered out unverified metrics — nothing here can render a
 * number the user has not vouched for.
 */
export function Metrics({
  metrics,
  variant = 'row',
}: {
  metrics: Metric[] | null | undefined;
  variant?: 'row' | 'grid';
}) {
  if (!metrics?.length) return null;

  return (
    <dl className={`${styles.list} ${variant === 'grid' ? styles.grid : styles.row}`}>
      {metrics.map((m) => (
        <div key={m._key} className={styles.item}>
          <dt className={styles.label}>{m.label}</dt>
          <dd className={styles.value}>
            {m.direction === 'improvement' ? (
              <TrendingUp size={16} className={styles.icon} aria-hidden="true" />
            ) : null}
            <span>{m.value}</span>
          </dd>
          {m.context ? <p className={styles.context}>{m.context}</p> : null}
        </div>
      ))}
    </dl>
  );
}
