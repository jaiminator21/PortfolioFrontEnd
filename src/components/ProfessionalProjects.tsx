"use client";

import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ClientLogo } from '@/components/projects/ClientLogo';
import { Metrics } from '@/components/recruiter/Metrics';
import { SanityImage } from '@/components/sanity/SanityImage';
import type { ProjectCard } from '@/sanity/types';
import styles from '@/styles/ProfessionalProjects.module.css';

/**
 * Case-study cards. Ordered so the scannable parts come first: title, stack,
 * verified metrics, then prose.
 */
export default function ProfessionalProjects({ projects }: { projects: ProjectCard[] }) {
  const t = useTranslations('ProfessionalProjects');

  if (!projects.length) {
    return (
      <section className={styles.section} id="proyectos-profesionales">
        <div className="container-custom">
          <p className={styles.emptyState}>{t('empty')}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section} id="proyectos-profesionales">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.list}>
            {projects.map((project, index) => (
              <motion.article
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={styles.card}
              >
                <div className={styles.cardGrid}>
                  <div className={styles.imageWrap}>
                    {project.coverImage?.url ? (
                      <SanityImage
                        value={project.coverImage}
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, 40vw"
                      />
                    ) : (
                      <div className={styles.imageFallback}>
                        {project.client?.logo?.url ? (
                          <ClientLogo client={project.client} size="lg" />
                        ) : (
                          <ExternalLink size={48} />
                        )}
                      </div>
                    )}
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.titleRow}>
                      {project.coverImage?.url ? (
                        <ClientLogo client={project.client} size="md" />
                      ) : null}
                      <h2 className={styles.cardTitle}>{project.title}</h2>
                    </div>

                    {project.client || project.employer || project.confidential ? (
                      <p className={styles.employer}>
                        {project.client ? (
                          <span>
                            {t('builtFor')}{' '}
                            {project.client.url ? (
                              <a
                                href={project.client.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {project.client.name}
                              </a>
                            ) : (
                              project.client.name
                            )}
                          </span>
                        ) : null}
                        {project.employer ? (
                          <span>
                            {t('builtAt')}{' '}
                            {project.employer.companyUrl ? (
                              <a
                                href={project.employer.companyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {project.employer.company}
                              </a>
                            ) : (
                              project.employer.company
                            )}
                          </span>
                        ) : project.confidential ? (
                          <span>
                            <Lock size={13} aria-hidden="true" /> {t('confidential')}
                          </span>
                        ) : null}
                      </p>
                    ) : null}

                    {project.techStack?.length ? (
                      <div className={styles.tagRow}>
                        {project.techStack.map((skill) => (
                          <span key={skill._id} className={styles.tag}>
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <Metrics metrics={project.metrics} />

                    {project.summary ? (
                      <div className={styles.metaBlocks}>
                        <div>
                          <p className={styles.metaLabel}>{t('labels.context')}</p>
                          <p className={styles.metaText}>{project.summary}</p>
                        </div>
                      </div>
                    ) : null}

                    {project.hasCaseStudy ? (
                      <Link
                        href={{
                          pathname: '/proyecto/[id]',
                          params: { id: project.slug },
                        }}
                        className={styles.cta}
                      >
                        {t('caseStudyCta')}
                        <ArrowRight size={20} />
                      </Link>
                    ) : project.hasPreview ? (
                      <Link
                        href={{
                          pathname: '/proyecto/[id]',
                          params: { id: project.slug },
                        }}
                        className={styles.cta}
                      >
                        {t('viewProject')}
                        <ArrowRight size={20} />
                      </Link>
                    ) : null}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
