"use client";

import { motion } from 'framer-motion';
import { ExternalLink, GraduationCap, MapPin } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { formatPeriod } from '@/lib/dates';
import type { Education as EducationDoc } from '@/sanity/types';
import styles from '@/styles/Education.module.css';

/**
 * Academic background. For a developer early in their career this carries more
 * weight than it would later on, so it gets a real section rather than a
 * footnote — and the bootcamp sits alongside the degrees instead of below them,
 * because it is the most directly relevant of the three.
 */
export default function Education({ items }: { items: EducationDoc[] }) {
  const t = useTranslations('Education');
  const locale = useLocale();

  if (!items.length) return null;

  return (
    <section className={styles.section} id="formacion">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <header className={styles.header}>
            <div className={styles.iconBadge}>
              <GraduationCap size={28} />
            </div>
            <h2 className={styles.title}>{t('title')}</h2>
            <p className={styles.subtitle}>{t('subtitle')}</p>
          </header>

          <div className={styles.list}>
            {items.map((item, index) => (
              <motion.article
                key={item._id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className={styles.card}
              >
                <div className={styles.cardAside}>
                  <span className={styles.period}>
                    {formatPeriod(item.startDate, item.endDate, locale, t('ongoing'))}
                  </span>
                  <span className={styles.levelBadge}>{t(`levels.${item.level}`)}</span>
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.degree}>{item.degree}</h3>

                  <p className={styles.institution}>
                    {item.institutionUrl ? (
                      <a
                        href={item.institutionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.institutionLink}
                      >
                        {item.institution}
                        <ExternalLink size={13} aria-hidden="true" />
                      </a>
                    ) : (
                      item.institution
                    )}
                  </p>

                  {item.institutionNote ? (
                    <p className={styles.institutionNote}>{item.institutionNote}</p>
                  ) : null}

                  {item.location ? (
                    <p className={styles.location}>
                      <MapPin size={13} aria-hidden="true" />
                      {item.location}
                    </p>
                  ) : null}

                  {item.summary ? <p className={styles.summary}>{item.summary}</p> : null}

                  {item.finalProject ? (
                    <p className={styles.finalProject}>
                      <span className={styles.finalProjectLabel}>
                        {t('finalProject')}
                      </span>{' '}
                      {item.finalProject}
                    </p>
                  ) : null}

                  {item.skills?.length ? (
                    <div className={styles.skillRow}>
                      {item.skills.map((skill) => (
                        <span key={skill._id} className={styles.skillTag}>
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
