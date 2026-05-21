"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import type { ProfessionalProject } from '@/data/professionalProjects';
import styles from '@/styles/ProjectDetail.module.css';

export default function ProjectDetailView({ project }: { project: ProfessionalProject }) {
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
            Volver a proyectos
          </Link>

          {project.imageUrl && (
            <div className={styles.heroImage}>
              <ImageWithFallback src={project.imageUrl} alt={project.title} />
            </div>
          )}

          <div className={styles.header}>
            <h1 className={styles.title}>{project.title}</h1>
            <div className={styles.tagRow}>
              {project.tags.map((tag, i) => (
                <span key={i} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>

          <div className={styles.sections}>
            <section>
              <h2 className={styles.sectionTitle}>Contexto del Proyecto</h2>
              <p className={styles.sectionText}>{project.context}</p>
            </section>

            <section>
              <h2 className={styles.sectionTitle}>Problema</h2>
              <p className={styles.sectionText}>{project.problem}</p>
            </section>

            <section>
              <h2 className={styles.sectionTitle}>Mi Rol</h2>
              <p className={styles.sectionText}>{project.role}</p>
            </section>

            <section>
              <h2 className={styles.sectionTitle}>Solución Implementada</h2>
              <p className={styles.sectionText}>{project.solution}</p>
            </section>

            <section className={styles.resultBlock}>
              <h2 className={styles.sectionTitle}>Resultados e Impacto</h2>
              <p className={styles.resultText}>{project.result}</p>
            </section>
          </div>

          <div className={styles.footer}>
            <Link href="/proyectos-profesionales" className={styles.footerCta}>
              Ver más proyectos
              <ExternalLink size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
