"use client";

import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import styles from '@/styles/PersonalProjects.module.css';

interface PersonalProject {
  name: string;
  description: string;
  stack: string[];
  demoUrl?: string;
  repoUrl: string;
}

const projects: PersonalProject[] = [
  {
    name: 'DevMetrics Dashboard',
    description:
      'Dashboard para visualizar métricas de GitHub: commits, PRs, issues. Integración con GitHub API y gráficas interactivas.',
    stack: ['React', 'Chart.js', 'GitHub API', 'Tailwind CSS'],
    demoUrl: '#',
    repoUrl: '#',
  },
  {
    name: 'Task Master Pro',
    description:
      'Gestor de tareas con drag & drop, categorías personalizadas, filtros avanzados y modo offline-first con sync.',
    stack: ['Next.js', 'IndexedDB', 'React DnD', 'TypeScript'],
    demoUrl: '#',
    repoUrl: '#',
  },
  {
    name: 'Performance Monitor',
    description:
      'Herramienta CLI para analizar performance de aplicaciones web. Genera reports detallados de Core Web Vitals.',
    stack: ['Node.js', 'Puppeteer', 'Lighthouse', 'Commander.js'],
    repoUrl: '#',
  },
  {
    name: 'Component Library',
    description:
      'Sistema de diseño personal con componentes reutilizables, documentación interactiva y theming customizable.',
    stack: ['React', 'Storybook', 'CSS Modules', 'TypeScript'],
    demoUrl: '#',
    repoUrl: '#',
  },
  {
    name: 'API Rate Limiter',
    description:
      'Middleware configurable de rate limiting para APIs con diferentes estrategias (token bucket, sliding window).',
    stack: ['Express', 'Redis', 'Jest', 'TypeScript'],
    repoUrl: '#',
  },
  {
    name: 'Code Snippet Manager',
    description:
      'Aplicación para guardar, organizar y buscar snippets de código con syntax highlighting y etiquetas.',
    stack: ['Vue 3', 'Pinia', 'Prism.js', 'Vite'],
    demoUrl: '#',
    repoUrl: '#',
  },
];

export default function PersonalProjects() {
  return (
    <section className={styles.section}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.intro}>
            <h2 className={styles.title}>Proyectos Personales</h2>
            <p className={styles.subtitle}>
              Experimentación y exploración técnica fuera del entorno corporativo
            </p>
          </div>

          <div className={styles.grid}>
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className={styles.card}
              >
                <h3 className={styles.cardTitle}>{project.name}</h3>
                <p className={styles.cardDescription}>{project.description}</p>

                <div>
                  <p className={styles.stackLabel}>Stack</p>
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
                      Demo
                    </a>
                  )}
                  <a href={project.repoUrl} className={styles.actionLink}>
                    <Github size={16} />
                    Código
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
