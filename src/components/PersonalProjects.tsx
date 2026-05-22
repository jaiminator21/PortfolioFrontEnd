"use client";

import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import styles from '@/styles/PersonalProjects.module.css';

type ProjectKey = 'devmetrics' | 'taskmaster' | 'perfmonitor' | 'componentlib' | 'ratelimiter' | 'snippets';

interface PersonalProject {
  key: ProjectKey;
  stack: string[];
  demoUrl?: string;
  repoUrl: string;
}

const projects: PersonalProject[] = [
  { key: 'devmetrics', stack: ['React', 'Chart.js', 'GitHub API', 'Tailwind CSS'], demoUrl: '#', repoUrl: '#' },
  { key: 'taskmaster', stack: ['Next.js', 'IndexedDB', 'React DnD', 'TypeScript'], demoUrl: '#', repoUrl: '#' },
  { key: 'perfmonitor', stack: ['Node.js', 'Puppeteer', 'Lighthouse', 'Commander.js'], repoUrl: '#' },
  { key: 'componentlib', stack: ['React', 'Storybook', 'CSS Modules', 'TypeScript'], demoUrl: '#', repoUrl: '#' },
  { key: 'ratelimiter', stack: ['Express', 'Redis', 'Jest', 'TypeScript'], repoUrl: '#' },
  { key: 'snippets', stack: ['Vue 3', 'Pinia', 'Prism.js', 'Vite'], demoUrl: '#', repoUrl: '#' },
];

export default function PersonalProjects() {
  const t = useTranslations('PersonalProjects');

  return (
    <section className={styles.section}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.grid}>
            {projects.map((project, index) => (
              <motion.div
                key={project.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className={styles.card}
              >
                <h3 className={styles.cardTitle}>{t(`items.${project.key}.name`)}</h3>
                <p className={styles.cardDescription}>{t(`items.${project.key}.description`)}</p>

                <div>
                  <p className={styles.stackLabel}>{t('stackLabel')}</p>
                  <div className={styles.stackList}>
                    {project.stack.map((tech, i) => (
                      <span key={i} className={styles.stackTag}>{tech}</span>
                    ))}
                  </div>
                </div>

                <div className={styles.actions}>
                  {project.demoUrl && (
                    <a href={project.demoUrl} className={styles.actionLink}>
                      <ExternalLink size={16} />
                      {t('demo')}
                    </a>
                  )}
                  <a href={project.repoUrl} className={styles.actionLink}>
                    <Github size={16} />
                    {t('code')}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
