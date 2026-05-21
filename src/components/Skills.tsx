"use client";

import { motion } from 'framer-motion';
import { Code2, Database, Wrench } from 'lucide-react';
import { useTranslations } from 'next-intl';
import styles from '@/styles/Skills.module.css';

const skillCategories = [
  {
    key: 'frontend' as const,
    icon: <Code2 size={24} />,
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    key: 'backend' as const,
    icon: <Database size={24} />,
    skills: ['Node.js', 'Express', 'MongoDB', 'MySQL'],
  },
  {
    key: 'tooling' as const,
    icon: <Wrench size={24} />,
    skills: ['Git', 'Docker', 'GitHub Actions', 'Vercel', 'AWS', 'Vite'],
  },
];

export default function Skills() {
  const t = useTranslations('Skills');

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
            {skillCategories.map((category, index) => (
              <motion.div
                key={category.key}
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.iconBox}>{category.icon}</div>
                  <span className={styles.cardNumber}>0{index + 1}</span>
                </div>

                <h3 className={styles.categoryTitle}>{t(`categories.${category.key}`)}</h3>

                <motion.div
                  className={styles.tagCloud}
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  {category.skills.map((skill, i) => (
                    <motion.span key={i} className={styles.tag} variants={itemVariants}>
                      {skill}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
