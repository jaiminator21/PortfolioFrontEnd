"use client";

import { motion } from 'framer-motion';
import {
  Cloud,
  Code2,
  Database,
  FlaskConical,
  Palette,
  Server,
  ShoppingBag,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ComponentType } from 'react';
import type { Skill, SkillCategory } from '@/sanity/types';
import styles from '@/styles/Skills.module.css';

/**
 * Categories are declared here in display order rather than read from the data:
 * the order is a presentation choice, and an empty category simply drops out.
 */
const CATEGORY_ORDER: SkillCategory[] = [
  'frontend',
  'backend',
  'databases',
  'platforms',
  'cloud',
  'ai',
  'testing',
  'tooling',
  'design',
];

const CATEGORY_ICONS: Record<SkillCategory, ComponentType<{ size?: number }>> = {
  frontend: Code2,
  backend: Server,
  databases: Database,
  cloud: Cloud,
  platforms: ShoppingBag,
  ai: Sparkles,
  testing: FlaskConical,
  tooling: Wrench,
  design: Palette,
};

export default function Skills({ skills }: { skills: Skill[] }) {
  const t = useTranslations('Skills');

  // Only the featured stack goes on the homepage; the rest stays on the CV.
  const featured = skills.filter((s) => s.featured);
  const pool = featured.length ? featured : skills;

  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    skills: pool.filter((s) => s.category === category),
  })).filter((group) => group.skills.length > 0);

  if (!grouped.length) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className={styles.skills} id="skills">
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

          <div className={styles.grid}>
            {grouped.map((group, index) => {
              const Icon = CATEGORY_ICONS[group.category];
              return (
                <motion.div
                  key={group.category}
                  className={styles.card}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.iconBox}>
                      <Icon size={24} />
                    </div>
                    <span className={styles.cardNumber}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className={styles.categoryTitle}>
                    {t(`categories.${group.category}`)}
                  </h3>

                  <motion.div
                    className={styles.tagCloud}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                  >
                    {group.skills.map((skill) => (
                      <motion.span
                        key={skill._id}
                        className={styles.tag}
                        variants={itemVariants}
                        title={
                          skill.proficiency
                            ? t(`proficiency.${skill.proficiency}`)
                            : undefined
                        }
                      >
                        {skill.name}
                      </motion.span>
                    ))}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
