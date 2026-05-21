"use client";

import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import type { ProfessionalProjectId } from '@/data/professionalProjects';
import styles from '@/styles/ProjectDetail.module.css';

interface Props {
  projectId: ProfessionalProjectId;
  tags: string[];
  imageUrl?: string;
}

export default function ProjectDetailView({ projectId, tags, imageUrl }: Props) {
  const t = useTranslations('ProfessionalProjects');
  const item = (field: string) => t(`items.${projectId}.${field}`);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/proyectos-profesionales" className={styles.backLink}>
            <ArrowLeft size={16} />
            {t('backToProjects')}
          </Link>

          {imageUrl && (
            <div className={styles.heroImage}>
              <ImageWithFallback src={imageUrl} alt={item('title')} />
            </div>
          )}

          <div className={styles.header}>
            <h1 className={styles.title}>{item('title')}</h1>
            <div className={styles.tagRow}>
              {tags.map((tag, i) => (
                <span key={i} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>

          <div className={styles.sections}>
            <section>
              <h2 className={styles.sectionTitle}>{t('detail.contextHeading')}</h2>
              <p className={styles.sectionText}>{item('context')}</p>
            </section>

            <section>
              <h2 className={styles.sectionTitle}>{t('detail.problemHeading')}</h2>
              <p className={styles.sectionText}>{item('problem')}</p>
            </section>

            <section>
              <h2 className={styles.sectionTitle}>{t('detail.roleHeading')}</h2>
              <p className={styles.sectionText}>{item('role')}</p>
            </section>

            <section>
              <h2 className={styles.sectionTitle}>{t('detail.solutionHeading')}</h2>
              <p className={styles.sectionText}>{item('solution')}</p>
            </section>

            <section className={styles.resultBlock}>
              <h2 className={styles.sectionTitle}>{t('detail.resultHeading')}</h2>
              <p className={styles.resultText}>{item('result')}</p>
            </section>
          </div>

          <div className={styles.footer}>
            <Link href="/proyectos-profesionales" className={styles.footerCta}>
              {t('moreProjects')}
              <ExternalLink size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
