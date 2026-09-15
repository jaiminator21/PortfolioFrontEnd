"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Github } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ClientLogo } from '@/components/projects/ClientLogo';
import { Metrics } from '@/components/recruiter/Metrics';
import { Link } from '@/i18n/navigation';
import type { ProjectCard, ProjectCategory } from '@/sanity/types';
import styles from '@/styles/PersonalProjects.module.css';

const CATEGORIES: ProjectCategory[] = ['website', 'script', 'sideProject', 'mobileApp', 'other'];

type Filter = ProjectCategory | 'all';

/**
 * Side projects, filterable by category. Demo and repo links only render when a
 * real URL exists — a button that goes nowhere reads worse than no button, and
 * it is the first thing a technical reviewer clicks.
 */
export default function PersonalProjects({ projects }: { projects: ProjectCard[] }) {
  const t = useTranslations('PersonalProjects');
  const [filter, setFilter] = useState<Filter>('all');

  if (!projects.length) {
    return (
      <section className={styles.section}>
        <div className="container-custom">
          <p className={styles.emptyState}>{t('empty')}</p>
        </div>
      </section>
    );
  }

  const categoryOf = (project: ProjectCard): ProjectCategory => project.category ?? 'other';

  const counts = new Map<ProjectCategory, number>();
  for (const project of projects) {
    counts.set(categoryOf(project), (counts.get(categoryOf(project)) ?? 0) + 1);
  }
  // Only offer filters that match something, and none at all for a single group.
  const available = CATEGORIES.filter((category) => counts.has(category));
  const visible =
    filter === 'all' ? projects : projects.filter((project) => categoryOf(project) === filter);

  return (
    <section className={styles.section}>
      <div className="container-custom">
        {available.length > 1 ? (
          <fieldset className={styles.filters} aria-label={t('filterLabel')}>
            {(['all', ...available] as Filter[]).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={filter === option}
                onClick={() => setFilter(option)}
                className={styles.filter}
              >
                {option === 'all' ? t('all') : t(`categories.${option}`)}
                <span className={styles.filterCount}>
                  {option === 'all' ? projects.length : counts.get(option)}
                </span>
              </button>
            ))}
          </fieldset>
        ) : null}

        <div className={styles.grid}>
          {visible.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={styles.card}
            >
              <div className={styles.cardTop}>
                <span className={styles.category}>{t(`categories.${categoryOf(project)}`)}</span>
                <ClientLogo client={project.client} size="sm" />
              </div>

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

              <div className={styles.actions}>
                <Link
                  href={{ pathname: '/proyecto/[id]', params: { id: project.slug } }}
                  className={`${styles.actionLink} ${styles.actionPrimary}`}
                >
                  {t('viewProject')}
                  <ArrowRight size={16} />
                </Link>
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
