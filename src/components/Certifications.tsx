"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Trophy,
  Star,
  Sparkles,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import styles from '@/styles/Certifications.module.css';

type CertCategory = 'frontend' | 'backend' | 'cloud' | 'architecture' | 'testing' | 'general';
type CertLevel = 'professional' | 'expert' | 'specialist';

interface Certification {
  id: string;
  credentialId?: string;
  verifyUrl?: string;
  category: CertCategory;
  skills: string[];
  level: CertLevel;
}

const certifications: Certification[] = [
  { id: '1', credentialId: 'AWS-PSA-2025-12345', verifyUrl: '#', category: 'cloud', skills: ['AWS', 'Cloud Architecture', 'Infrastructure', 'Security'], level: 'professional' },
  { id: '2', credentialId: 'META-FE-2025-67890', verifyUrl: '#', category: 'frontend', skills: ['React', 'JavaScript', 'HTML/CSS', 'UI/UX'], level: 'professional' },
  { id: '3', credentialId: 'GCP-PCA-2024-11223', verifyUrl: '#', category: 'cloud', skills: ['GCP', 'Kubernetes', 'Terraform', 'DevOps'], level: 'professional' },
  { id: '4', category: 'frontend', skills: ['React', 'Performance', 'Design Patterns', 'Optimization'], level: 'expert' },
  { id: '5', credentialId: 'COURSERA-SDA-2024-44556', verifyUrl: '#', category: 'architecture', skills: ['System Design', 'Microservices', 'Scalability', 'Databases'], level: 'specialist' },
  { id: '6', category: 'testing', skills: ['Cypress', 'E2E Testing', 'Test Automation', 'CI/CD'], level: 'professional' },
];

const FILTER_KEYS: ReadonlyArray<{ value: 'all' | CertCategory; icon: typeof Sparkles }> = [
  { value: 'all', icon: Sparkles },
  { value: 'frontend', icon: Award },
  { value: 'cloud', icon: Trophy },
  { value: 'architecture', icon: Star },
  { value: 'testing', icon: CheckCircle2 },
];

const levelClass: Record<CertLevel, string> = {
  professional: styles.levelProfessional,
  expert: styles.levelExpert,
  specialist: styles.levelSpecialist,
};

export default function Certifications() {
  const t = useTranslations('Certifications');
  const [activeFilter, setActiveFilter] = useState<'all' | CertCategory>('all');

  const filtered = activeFilter === 'all'
    ? certifications
    : certifications.filter(c => c.category === activeFilter);

  const uniqueIssuers = new Set(
    certifications.map((c) => t(`items.${c.id}.issuer`))
  ).size;
  const uniqueSkills = new Set(certifications.flatMap((c) => c.skills)).size;

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

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={styles.filters}
          >
            {FILTER_KEYS.map((category, index) => {
              const Icon = category.icon;
              const isActive = activeFilter === category.value;
              return (
                <motion.button
                  key={category.value}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setActiveFilter(category.value)}
                  className={`${styles.filterBtn} ${isActive ? styles.filterBtnActive : ''}`}
                >
                  <span className={styles.filterContent}>
                    <Icon size={16} />
                    {t(`filters.${category.value}`)}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeFilter"
                      className={styles.filterUnderline}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.div>

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
            {filtered.map((cert) => (
              <motion.div
                key={cert.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -8 }}
                className={styles.card}
              >
                <div className={`${styles.cardBgGradient} ${levelClass[cert.level]}`} />

                <div className={`${styles.levelBadge} ${levelClass[cert.level]}`}>
                  {t(`levels.${cert.level}`)}
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIconBox}>
                      <Award size={24} />
                    </div>
                  </div>

                  <div>
                    <h3 className={styles.cardTitle}>{t(`items.${cert.id}.title`)}</h3>
                    <p className={styles.cardIssuer}>{t(`items.${cert.id}.issuer`)}</p>
                    <div className={styles.cardDate}>
                      <Calendar size={14} />
                      <span>{t(`items.${cert.id}.date`)}</span>
                    </div>
                  </div>

                  <div className={styles.skillsList}>
                    {cert.skills.map((skill, i) => (
                      <span key={i} className={styles.skillTag}>{skill}</span>
                    ))}
                  </div>

                  {cert.credentialId && (
                    <div className={styles.credentialBlock}>
                      <div className={styles.credentialId}>{t('credentialId')}: {cert.credentialId}</div>
                      {cert.verifyUrl && (
                        <a
                          href={cert.verifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.verifyLink}
                        >
                          <span>{t('verify')}</span>
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className={styles.statsFooter}
          >
            {[
              { label: t('statsLabels.certifications'), value: certifications.length, icon: Award },
              { label: t('statsLabels.providers'), value: uniqueIssuers, icon: Trophy },
              { label: t('statsLabels.hours'), value: '500+', icon: Star },
              { label: t('statsLabels.skills'), value: uniqueSkills, icon: Sparkles },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
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
