"use client";

import { motion } from 'framer-motion';
import {
  Award,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Star,
  Trophy,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { formatMonthYear, isExpired } from '@/lib/dates';
import type { Certification, CertificationLevel, CertificationStats } from '@/sanity/types';
import styles from '@/styles/Certifications.module.css';

const levelClass: Record<CertificationLevel, string | undefined> = {
  foundational: undefined,
  associate: undefined,
  professional: styles.levelProfessional,
  expert: styles.levelExpert,
  specialist: styles.levelSpecialist,
};

/**
 * A certification is only worth what a recruiter can verify, so the verification
 * link is the card's primary action and expired credentials are labelled rather
 * than quietly presented as current.
 */
export default function Certifications({
  certifications,
  stats,
}: {
  certifications: Certification[];
  stats: CertificationStats;
}) {
  const t = useTranslations('Certifications');
  const locale = useLocale();

  if (!certifications.length) {
    return (
      <section className={styles.section}>
        <div className={`container-custom ${styles.inner}`}>
          <p className={styles.emptyState}>{t('empty')}</p>
        </div>
      </section>
    );
  }

  const statTiles = [
    { label: t('statsLabels.certifications'), value: stats.total, icon: Award },
    { label: t('statsLabels.verifiable'), value: stats.verifiable, icon: BadgeCheck },
    { label: t('statsLabels.providers'), value: stats.issuers, icon: Trophy },
    { label: t('statsLabels.skills'), value: stats.skills, icon: Sparkles },
    // Study hours only appear when actually tracked.
    ...(stats.studyHours
      ? [{ label: t('statsLabels.hours'), value: stats.studyHours, icon: Star }]
      : []),
  ];

  return (
    <section className={styles.section}>
      <div className={styles.blobPurple} />
      <div className={styles.blobBlue} />
      <div className={styles.gridPattern} />

      <div className={`container-custom ${styles.inner}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.header}>
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, type: 'spring' }}
              className={styles.iconBadgeWrap}
            >
              <div className={styles.iconBadgeGlow} />
              <div className={styles.iconBadge}>
                <Trophy size={48} />
              </div>
            </motion.div>

            <h2 className={styles.title}>
              <span className={styles.titleHighlight}>{t('title')}</span>
            </h2>

            <div className={styles.titleAccent}>
              <div className={styles.titleAccentGlow} />
            </div>

            <p className={styles.lead}>{t('subtitle')}</p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className={styles.countRow}
            >
              <CheckCircle2 size={20} className={styles.check} />
              <span className={styles.countText}>
                {t('count', { count: certifications.length })}
              </span>
            </motion.div>
          </div>

          {/* Grid */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            className={styles.grid}
          >
            {certifications.map((cert) => {
              const expired = isExpired(cert.expiryDate);
              return (
                <motion.div
                  key={cert._id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ y: -8 }}
                  className={styles.card}
                >
                  <div
                    className={`${styles.cardBgGradient} ${
                      (cert.level && levelClass[cert.level]) ?? ''
                    }`}
                  />

                  {cert.level ? (
                    <div
                      className={`${styles.levelBadge} ${
                        levelClass[cert.level] ?? ''
                      }`}
                    >
                      {t(`levels.${cert.level}`)}
                    </div>
                  ) : null}

                  <div className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                      <div className={styles.cardIconBox}>
                        <Award size={24} />
                      </div>
                    </div>

                    <div>
                      <h3 className={styles.cardTitle}>{cert.title}</h3>
                      <p className={styles.cardIssuer}>
                        {cert.issuerUrl ? (
                          <a
                            href={cert.issuerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {cert.issuer}
                          </a>
                        ) : (
                          cert.issuer
                        )}
                      </p>
                      <div className={styles.cardDate}>
                        <Calendar size={14} />
                        <span>{formatMonthYear(cert.issueDate, locale)}</span>
                        {expired ? (
                          <span className={styles.expiredTag}>{t('expired')}</span>
                        ) : null}
                      </div>
                    </div>

                    {cert.skills?.length ? (
                      <div className={styles.skillsList}>
                        {cert.skills.map((skill) => (
                          <span key={skill._id} className={styles.skillTag}>
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {cert.credentialId || cert.verifyUrl ? (
                      <div className={styles.credentialBlock}>
                        {cert.credentialId ? (
                          <div className={styles.credentialId}>
                            {t('credentialId')}: {cert.credentialId}
                          </div>
                        ) : null}
                        {cert.verifyUrl ? (
                          <a
                            href={cert.verifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.verifyLink}
                          >
                            <span>{t('verify')}</span>
                            <ExternalLink size={14} />
                          </a>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Stats Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className={styles.statsFooter}
          >
            {statTiles.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={styles.statTile}
                >
                  <div className={styles.statIconWrap}>
                    <div className={styles.statIcon}>
                      <Icon size={20} />
                    </div>
                  </div>
                  <div className={styles.statValue}>{stat.value}</div>
                  <div className={styles.statLabel}>{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
