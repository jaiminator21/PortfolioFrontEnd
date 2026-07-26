"use client";

import { motion } from 'framer-motion';
import { Calendar, ExternalLink, Users } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Metrics } from '@/components/recruiter/Metrics';
import { RichText } from '@/components/sanity/RichText';
import { formatPeriod, isCurrent } from '@/lib/dates';
import type { Experience as ExperienceDoc } from '@/sanity/types';
import styles from '@/styles/Experience.module.css';

/**
 * Career timeline. The "current" badge and the period label are derived from the
 * stored dates rather than from hand-written strings, so they cannot go stale.
 */
export default function Experience({ items }: { items: ExperienceDoc[] }) {
  const t = useTranslations('Experience');
  const locale = useLocale();

  if (!items.length) return null;

  return (
    <section className={styles.experience} id="experiencia">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <header className={styles.header}>
            <h2 className={styles.title}>{t('title')}</h2>
            <p className={styles.subtitle}>{t('subtitle')}</p>
          </header>

          <div className={styles.timeline}>
            {items.map((exp, index) => (
              <motion.div
                key={exp._id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={styles.card}
              >
                <div className={styles.sidebar}>
                  <div className={styles.jobInfo}>
                    <h3 className={styles.company}>
                      {exp.companyUrl ? (
                        <a
                          href={exp.companyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.companyLink}
                        >
                          {exp.company}
                          <ExternalLink size={13} aria-hidden="true" />
                        </a>
                      ) : (
                        exp.company
                      )}
                    </h3>
                    <p className={styles.role}>{exp.role}</p>
                  </div>

                  <div className={styles.periodBox}>
                    <Calendar size={14} className={styles.icon} />
                    <span>
                      {formatPeriod(exp.startDate, exp.endDate, locale, t('presentLabel'))}
                    </span>
                  </div>

                  {exp.location ? (
                    <p className={styles.locationText}>
                      {exp.location}
                      {exp.workMode ? ` · ${t(`workMode.${exp.workMode}`)}` : ''}
                    </p>
                  ) : null}

                  {exp.teamSize ? (
                    <p className={styles.teamText}>
                      <Users size={13} aria-hidden="true" />
                      {t('teamSize', { count: exp.teamSize })}
                    </p>
                  ) : null}

                  {isCurrent(exp.endDate) && (
                    <span className={styles.badge}>{t('currentBadge')}</span>
                  )}
                </div>

                <div className={styles.mainContent}>
                  {exp.summary ? <p className={styles.description}>{exp.summary}</p> : null}

                  <RichText value={exp.highlights} className={styles.list} />

                  <Metrics metrics={exp.metrics} />

                  {exp.techStack?.length ? (
                    <div className={styles.stackRow}>
                      {exp.techStack.map((skill) => (
                        <span key={skill._id} className={styles.stackTag}>
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
