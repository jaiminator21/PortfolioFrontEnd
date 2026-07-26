"use client";

import { motion } from 'framer-motion';
import { Award, ArrowRight, Trophy, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { CertificationStats } from '@/sanity/types';
import styles from '@/styles/CertificationsCTA.module.css';

/**
 * Homepage teaser for the certifications page. The counts come from GROQ
 * aggregates over the actual documents, so they cannot overstate the collection.
 */
export default function CertificationsCTA({ stats }: { stats: CertificationStats }) {
  const t = useTranslations('CertificationsCTA');

  // Nothing to tease when there are no published certifications.
  if (!stats.total) return null;

  const tiles = [
    {
      icon: Award,
      value: stats.total,
      label: t('stats.certifications'),
      grad: styles.gradBlueCyan,
    },
    {
      icon: Trophy,
      value: stats.issuers,
      label: t('stats.providers'),
      grad: styles.gradPurplePink,
    },
    {
      icon: Award,
      value: stats.skills,
      label: t('stats.skills'),
      grad: styles.gradGreenEmerald,
    },
    // Study hours are only shown when the user has actually tracked them.
    ...(stats.studyHours
      ? [
          {
            icon: Star,
            value: stats.studyHours,
            label: t('stats.hours'),
            grad: styles.gradAmberOrange,
          },
        ]
      : []),
  ];

  return (
    <section className={styles.section}>
      <div className={styles.blobPurple} />
      <div className={styles.blobBlue} />

      <div className={styles.particles}>
        <motion.div
          animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className={styles.particle1}
        />
        <motion.div
          animate={{ rotate: [360, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className={styles.particle2}
        />
      </div>

      <div className={`container-custom ${styles.inner}`}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.card}>
            <div className={styles.cardGrid}>
              <div className={styles.content}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={styles.badgeRow}
                >
                  <div className={styles.iconWrap}>
                    <div className={styles.iconGlow} />
                    <div className={styles.iconBadge}>
                      <Trophy size={32} />
                    </div>
                  </div>
                  <span className={styles.kicker}>{t('kicker')}</span>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  className={styles.title}
                >
                  {t('titlePart1')}{' '}
                  <span className={styles.titleHighlight}>{t('titleHighlight')}</span>
                  {t('titlePart2') ? <> {t('titlePart2')}</> : null}
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className={styles.description}
                >
                  {t('description')}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <Link href="/certificaciones" className={styles.ctaButton}>
                    <span>{t('cta')}</span>
                    <ArrowRight size={16} className={styles.ctaArrow} />
                    <span className={styles.ctaShine} />
                  </Link>
                </motion.div>
              </div>

              <div className={styles.statsGrid}>
                {tiles.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                      className={styles.statCard}
                    >
                      <div className={`${styles.statBgGradient} ${stat.grad}`} />
                      <div className={styles.statContent}>
                        <div className={`${styles.statIconBox} ${stat.grad}`}>
                          <Icon size={24} />
                        </div>
                        <div className={styles.statValue}>{stat.value}</div>
                        <div className={styles.statLabel}>{stat.label}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
