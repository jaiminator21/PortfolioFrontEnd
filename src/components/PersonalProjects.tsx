"use client";

import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Metrics } from '@/components/recruiter/Metrics';
import type { ProjectCard } from '@/sanity/types';
import styles from '@/styles/PersonalProjects.module.css';

/**
 * Side projects. Demo and repo links only render when a real URL exists — a
 * button that goes nowhere reads worse than no button, and it is the first thing
 * a technical reviewer clicks.
 */
export default function PersonalProjects({ projects }: { projects: ProjectCard[] }) {
  const t = useTranslations('PersonalProjects');

  if (!projects.length) {
    return (
      <section className={styles.section}>
        <div className="container-custom">
          <p className={styles.emptyState}>{t('empty')}</p>
        </div>
      </section>
    );
  }

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
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className={styles.card}
              >
                <h3 className={styles.cardTitle}>{project.title}</h3>
                <p className={styles.cardDescription}>{project.summary}</p>

                <Metrics metrics={project.metrics} />

                {project.techStack?.length ? (
                  <div>
                    <p className={styles.stackLabel}>{t('stackLabel')}</p>
                    <div className={styles.stackList}>
                      {project.techStack.map((skill) => (
                        <span key={skill._id} className={styles.stackTag}>
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {project.demoUrl || project.repoUrl ? (
                  <div className={styles.actions}>
                    {project.demoUrl ? (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.actionLink}
                      >
                        <ExternalLink size={16} />
                        {t('demo')}
                      </a>
                    ) : null}
                    {project.repoUrl ? (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.actionLink}
                      >
                        <Github size={16} />
                        {t('code')}
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
