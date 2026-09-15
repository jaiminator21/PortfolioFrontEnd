"use client";

import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Lock } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ClientLogo } from '@/components/projects/ClientLogo';
import { LivePreview } from '@/components/projects/LivePreview';
import { Metrics } from '@/components/recruiter/Metrics';
import { RichText } from '@/components/sanity/RichText';
import { SanityImage } from '@/components/sanity/SanityImage';
import { formatPeriod } from '@/lib/dates';
import type { ProjectDetail } from '@/sanity/types';
import styles from '@/styles/ProjectDetail.module.css';

/**
 * The case study. Sections render only when they have content, so a
 * half-finished project degrades to a shorter page rather than a page of
 * empty headings.
 */
export default function ProjectDetailView({
  project,
  canPreview,
}: {
  project: ProjectDetail;
  canPreview: boolean;
}) {
  const t = useTranslations('ProfessionalProjects');
  const tPersonal = useTranslations('PersonalProjects');
  const locale = useLocale();
  const showPreview = canPreview && Boolean(project.demoUrl);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/proyectos" className={styles.backLink}>
            <ArrowLeft size={16} />
            {t('backToProjects')}
          </Link>

          {/* The live site replaces the cover when it can be framed. */}
          {!showPreview && project.coverImage?.url && (
            <div className={styles.heroImage}>
              <SanityImage value={project.coverImage} priority sizes="100vw" />
            </div>
          )}

          <div className={styles.header}>
            <ClientLogo client={project.client} size="lg" />

            <h1 className={styles.title}>{project.title}</h1>

            {!project.context && project.summary ? (
              <p className={styles.lead}>{project.summary}</p>
            ) : null}

            <div className={styles.metaRow}>
              {project.kind === 'personal' && project.category ? (
                <span>{tPersonal(`categories.${project.category}`)}</span>
              ) : null}

              {project.client ? (
                <span>
                  {t('builtFor')}{' '}
                  {project.client.url ? (
                    <a href={project.client.url} target="_blank" rel="noopener noreferrer">
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
                <span className={styles.confidential}>
                  <Lock size={13} aria-hidden="true" /> {t('confidential')}
                </span>
              ) : null}

              {project.startDate ? (
                <span>
                  {formatPeriod(
                    project.startDate,
                    project.endDate,
                    locale,
                    t('ongoing')
                  )}
                </span>
              ) : null}
            </div>

            {project.techStack?.length ? (
              <div className={styles.tagRow}>
                {project.techStack.map((skill) => (
                  <span key={skill._id} className={styles.tag}>
                    {skill.name}
                  </span>
                ))}
              </div>
            ) : null}

            {project.demoUrl || project.repoUrl ? (
              <div className={styles.linkRow}>
                {project.demoUrl ? (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.projectLink}
                  >
                    <ExternalLink size={16} />
                    {t('viewLive')}
                  </a>
                ) : null}
                {project.repoUrl ? (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.projectLink}
                  >
                    <Github size={16} />
                    {t('viewCode')}
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>

          {showPreview && project.demoUrl ? (
            <LivePreview url={project.demoUrl} title={project.title ?? project.slug} />
          ) : null}

          {/* Verified outcomes sit above the narrative — they get read first. */}
          {project.metrics?.length ? (
            <div className={styles.metricsBlock}>
              <h2 className={styles.sectionTitle}>{t('detail.resultHeading')}</h2>
              <Metrics metrics={project.metrics} variant="grid" />
            </div>
          ) : null}

          <div className={styles.sections}>
            {project.context ? (
              <section>
                <h2 className={styles.sectionTitle}>{t('detail.contextHeading')}</h2>
                <p className={styles.sectionText}>{project.context}</p>
              </section>
            ) : null}

            {project.problem ? (
              <section>
                <h2 className={styles.sectionTitle}>{t('detail.problemHeading')}</h2>
                <p className={styles.sectionText}>{project.problem}</p>
              </section>
            ) : null}

            {project.role ? (
              <section>
                <h2 className={styles.sectionTitle}>{t('detail.roleHeading')}</h2>
                <p className={styles.sectionText}>{project.role}</p>
              </section>
            ) : null}

            {project.solution?.length ? (
              <section>
                <h2 className={styles.sectionTitle}>{t('detail.solutionHeading')}</h2>
                <RichText value={project.solution} className={styles.sectionText} />
              </section>
            ) : null}

            {project.result ? (
              <section className={styles.resultBlock}>
                <h2 className={styles.sectionTitle}>{t('detail.resultHeading')}</h2>
                <p className={styles.resultText}>{project.result}</p>
              </section>
            ) : null}
          </div>

          {project.gallery?.length ? (
            <div className={styles.gallery}>
              {project.gallery.map((item) => (
                <figure key={item._key} className={styles.galleryItem}>
                  <SanityImage
                    value={item}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {item.caption ? <figcaption>{item.caption}</figcaption> : null}
                </figure>
              ))}
            </div>
          ) : null}

          {project.related?.length ? (
            <div className={styles.related}>
              <h2 className={styles.sectionTitle}>{t('moreProjects')}</h2>
              <div className={styles.relatedGrid}>
                {project.related.map((item) => (
                  <Link
                    key={item._id}
                    href={{ pathname: '/proyecto/[id]', params: { id: item.slug } }}
                    className={styles.relatedCard}
                  >
                    <h3>{item.title}</h3>
                    {item.summary ? <p>{item.summary}</p> : null}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          <div className={styles.footer}>
            <Link href="/proyectos" className={styles.footerCta}>
              {t('moreProjects')}
              <ExternalLink size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
