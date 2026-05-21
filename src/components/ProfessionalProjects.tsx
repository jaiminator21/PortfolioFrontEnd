"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { professionalProjects } from '@/data/professionalProjects';
import styles from '@/styles/ProfessionalProjects.module.css';

export default function ProfessionalProjects() {
  return (
    <section className={styles.section} id="proyectos-profesionales">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.intro}>
            <h1 className={styles.title}>Proyectos Profesionales</h1>
            <p className={styles.subtitle}>
              Casos de estudio de proyectos desarrollados en entorno corporativo con impacto medible en negocio.
              Esta sección contiene información detallada de proyectos reales.
            </p>
          </div>

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
                        alt={project.title}
                        className={styles.image}
                      />
                    ) : (
                      <div className={styles.imageFallback}>
                        <ExternalLink size={48} />
                      </div>
                    )}
                  </div>

                  <div className={styles.cardBody}>
                    <h2 className={styles.cardTitle}>{project.title}</h2>

                    <div className={styles.tagRow}>
                      {project.tags.map((tag, i) => (
                        <span key={i} className={styles.tag}>{tag}</span>
                      ))}
                    </div>

                    <div className={styles.metaBlocks}>
                      <div>
                        <p className={styles.metaLabel}>Contexto</p>
                        <p className={styles.metaText}>{project.context}</p>
                      </div>

                      <div>
                        <p className={styles.metaLabel}>Resultado</p>
                        <p className={styles.metaResult}>{project.result}</p>
                      </div>
                    </div>

                    <Link href={`/proyecto/${project.id}`} className={styles.cta}>
                      Ver caso de estudio completo
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
