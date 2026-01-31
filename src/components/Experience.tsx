"use client";

import { motion } from 'framer-motion';
import { Calendar, Briefcase } from 'lucide-react';
import styles from '@/styles/Experience.module.css';

interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  description: string;
  responsibilities: string[];
}

const experiences: ExperienceItem[] = [
  {
    company: 'Tech Solutions Inc.',
    role: 'Senior Frontend Developer',
    period: '2022 - Presente',
    description: 'Liderazgo técnico en el desarrollo de plataformas SaaS B2B enfocadas en la gestión de proyectos de gran escala.',
    responsibilities: [
      'Arquitectura y desarrollo del nuevo dashboard con React y TypeScript',
      'Implementación de sistema de diseño compartido entre productos',
      'Liderazgo técnico de un equipo de 4 desarrolladores frontend',
      'Optimización de rendimiento y mejora de Core Web Vitals',
    ],
  },
  {
    company: 'Digital Ventures',
    role: 'Full Stack Developer',
    period: '2020 - 2022',
    description: 'Desarrollo integral de soluciones e-commerce de alto tráfico para retail multicanal.',
    responsibilities: [
      'Desarrollo full stack con Next.js y Node.js',
      'Integración con APIs de terceros (pasarelas de pago, CRM)',
      'Implementación de testing automatizado (Jest, Cypress)',
      'Colaboración directa con UX/UI en iteraciones de producto',
    ],
  },
  // Añade más aquí...
];

export default function Experience() {
  return (
    <section className={styles.experience} id="experiencia">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <header className={styles.header}>
            <h2 className={styles.title}>Experiencia</h2>
            <p className={styles.subtitle}>Trayectoria profesional enfocada en la excelencia técnica.</p>
          </header>
          
          <div className={styles.timeline}>
            {experiences.map((exp, index) => {
              const isCurrent = exp.period.toLowerCase().includes('presente');
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={styles.card}
                >
                  <div className={styles.sidebar}>
                    <div className={styles.jobInfo}>
                      <h3 className={styles.company}>{exp.company}</h3>
                      <p className={styles.role}>{exp.role}</p>
                    </div>
                    <div className={styles.periodBox}>
                      <Calendar size={14} className={styles.icon} />
                      <span>{exp.period}</span>
                    </div>
                    {isCurrent && <span className={styles.badge}>Actual</span>}
                  </div>

                  <div className={styles.mainContent}>
           

                    <p className={styles.description}>{exp.description}</p>

                    <ul className={styles.list}>
                      {exp.responsibilities.map((resp, i) => (
                        <li key={i} className={styles.listItem}>
                          <span className={styles.dot}></span>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}