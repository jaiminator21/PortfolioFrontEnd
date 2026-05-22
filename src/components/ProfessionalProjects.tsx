"use client";

import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { professionalProjects } from '@/data/professionalProjects';
import styles from '@/styles/ProfessionalProjects.module.css';

export default function ProfessionalProjects() {
  const t = useTranslations('ProfessionalProjects');

  return (
    <section className={styles.section} id="proyectos-profesionales">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.list}>
            {professionalProjects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={styles.card}
              >
                <div className={styles.cardGrid}>
                  <div className={styles.imageWrap}>
                    {project.imageUrl ? (
                      <ImageWithFallback
                        src={project.imageUrl}
                        alt={t(`items.${project.id}.title`)}
                        className={styles.image}
                      />
                    ) : (
                      <div className={styles.imageFallback}>
                        <ExternalLink size={48} />
                      </div>
                    )}
                  </div>

                  <div className={styles.cardBody}>
                    <h2 className={styles.cardTitle}>{t(`items.${project.id}.title`)}</h2>

                    <div className={styles.tagRow}>
                      {project.tags.map((tag, i) => (
                        <span key={i} className={styles.tag}>{tag}</span>
                      ))}
                    </div>

                    <div className={styles.metaBlocks}>
                      <div>
                        <p className={styles.metaLabel}>{t('labels.context')}</p>
                        <p className={styles.metaText}>{t(`items.${project.id}.context`)}</p>
                      </div>

                      <div>
                        <p className={styles.metaLabel}>{t('labels.result')}</p>
                        <p className={styles.metaResult}>{t(`items.${project.id}.result`)}</p>
                      </div>
                    </div>

                    <Link href={{ pathname: '/proyecto/[id]', params: { id: project.id } }} className={styles.cta}>
                      {t('caseStudyCta')}
                      <ArrowRight size={20} />
                    </Link>
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
