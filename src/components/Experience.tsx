"use client";

import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';
import styles from '@/styles/Experience.module.css';

interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  description: string;
  responsibilities: string[];
}

export default function Experience() {
  const t = useTranslations('Experience');
  const experiences = t.raw('items') as ExperienceItem[];
  const presentLabel = t('presentLabel').toLowerCase();

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
            {experiences.map((exp, index) => {
              const isCurrent = exp.period.toLowerCase().includes(presentLabel);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={styles.card}
                >
                  <div className={styles.sidebar}>
                    <div className={styles.jobInfo}>
                      <h3 className={styles.company}>{exp.company}</h3>
                      <p className={styles.role}>{exp.role}</p>
                    </div>
                    <div className={styles.periodBox}>
                      <Calendar size={14} className={styles.icon} />
                      <span>{exp.period}</span>
                    </div>
                    {isCurrent && <span className={styles.badge}>{t('currentBadge')}</span>}
                  </div>

                  <div className={styles.mainContent}>
                    <p className={styles.description}>{exp.description}</p>

                    <ul className={styles.list}>
                      {exp.responsibilities.map((resp, i) => (
                        <li key={i} className={styles.listItem}>
                          <span className={styles.dot}></span>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
