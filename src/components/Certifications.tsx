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
import styles from '@/styles/Certifications.module.css';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  verifyUrl?: string;
  category: 'frontend' | 'backend' | 'cloud' | 'architecture' | 'testing' | 'general';
  skills: string[];
  level: 'professional' | 'expert' | 'specialist';
}

const certifications: Certification[] = [
  {
    id: '1',
    title: 'AWS Certified Solutions Architect – Professional',
    issuer: 'Amazon Web Services',
    date: 'Marzo 2025',
    credentialId: 'AWS-PSA-2025-12345',
    verifyUrl: '#',
    category: 'cloud',
    skills: ['AWS', 'Cloud Architecture', 'Infrastructure', 'Security'],
    level: 'professional',
  },
  {
    id: '2',
    title: 'Meta Front-End Developer Professional Certificate',
    issuer: 'Meta (Facebook)',
    date: 'Enero 2025',
    credentialId: 'META-FE-2025-67890',
    verifyUrl: '#',
    category: 'frontend',
    skills: ['React', 'JavaScript', 'HTML/CSS', 'UI/UX'],
    level: 'professional',
  },
  {
    id: '3',
    title: 'Google Cloud Professional Cloud Architect',
    issuer: 'Google Cloud',
    date: 'Noviembre 2024',
    credentialId: 'GCP-PCA-2024-11223',
    verifyUrl: '#',
    category: 'cloud',
    skills: ['GCP', 'Kubernetes', 'Terraform', 'DevOps'],
    level: 'professional',
  },
  {
    id: '4',
    title: 'Advanced React Patterns & Performance',
    issuer: 'Frontend Masters',
    date: 'Septiembre 2024',
    category: 'frontend',
    skills: ['React', 'Performance', 'Design Patterns', 'Optimization'],
    level: 'expert',
  },
  {
    id: '5',
    title: 'System Design & Architecture Specialization',
    issuer: 'Coursera',
    date: 'Julio 2024',
    credentialId: 'COURSERA-SDA-2024-44556',
    verifyUrl: '#',
    category: 'architecture',
    skills: ['System Design', 'Microservices', 'Scalability', 'Databases'],
    level: 'specialist',
  },
  {
    id: '6',
    title: 'Cypress End-to-End Testing Certification',
    issuer: 'Cypress.io',
    date: 'Mayo 2024',
    category: 'testing',
    skills: ['Cypress', 'E2E Testing', 'Test Automation', 'CI/CD'],
    level: 'professional',
  },
];

const categories = [
  { value: 'all', label: 'Todas', icon: Sparkles },
  { value: 'frontend', label: 'Frontend', icon: Award },
  { value: 'cloud', label: 'Cloud', icon: Trophy },
  { value: 'architecture', label: 'Arquitectura', icon: Star },
  { value: 'testing', label: 'Testing', icon: CheckCircle2 },
];

const levelClass: Record<Certification['level'], string> = {
  professional: styles.levelProfessional,
  expert: styles.levelExpert,
  specialist: styles.levelSpecialist,
};

const levelLabels: Record<Certification['level'], string> = {
  professional: 'Profesional',
  expert: 'Experto',
  specialist: 'Especialista',
};

export default function Certifications() {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filtered = activeFilter === 'all'
    ? certifications
    : certifications.filter(c => c.category === activeFilter);

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
          {/* Header */}
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
              <span className={styles.titleHighlight}>Cursos &amp; Certificaciones</span>
            </h2>

            <div className={styles.titleAccent}>
              <div className={styles.titleAccentGlow} />
            </div>

            <p className={styles.lead}>
              Aprendizaje continuo y validación de habilidades técnicas por organizaciones líderes de la industria.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className={styles.countRow}
            >
              <CheckCircle2 size={20} className={styles.check} />
              <span className={styles.countText}>
                {certifications.length} Certificaciones Profesionales
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
            {categories.map((category, index) => {
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
                    {category.label}
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
                  {levelLabels[cert.level]}
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIconBox}>
                      <Award size={24} />
                    </div>
                  </div>

                  <div>
                    <h3 className={styles.cardTitle}>{cert.title}</h3>
                    <p className={styles.cardIssuer}>{cert.issuer}</p>
                    <div className={styles.cardDate}>
                      <Calendar size={14} />
                      <span>{cert.date}</span>
                    </div>
                  </div>

                  <div className={styles.skillsList}>
                    {cert.skills.map((skill, i) => (
                      <span key={i} className={styles.skillTag}>{skill}</span>
                    ))}
                  </div>

                  {cert.credentialId && (
                    <div className={styles.credentialBlock}>
                      <div className={styles.credentialId}>ID: {cert.credentialId}</div>
                      {cert.verifyUrl && (
                        <a
                          href={cert.verifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.verifyLink}
                        >
                          <span>Verificar Credencial</span>
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
              { label: 'Certificaciones', value: certifications.length, icon: Award },
              { label: 'Proveedores', value: new Set(certifications.map(c => c.issuer)).size, icon: Trophy },
              { label: 'Horas de Estudio', value: '500+', icon: Star },
              { label: 'Skills Validadas', value: new Set(certifications.flatMap(c => c.skills)).size, icon: Sparkles },
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
