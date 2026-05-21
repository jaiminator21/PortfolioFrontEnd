"use client";

import { motion } from 'framer-motion';
import PersonalProjects from '@/components/PersonalProjects';
import styles from '@/styles/SecondaryPage.module.css';

export default function PersonalProjectsPage() {
  return (
    <div className={styles.wrapper}>
      <section className={styles.pageHero}>
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className={styles.pageHeroTitle}>Proyectos Personales</h1>
            <p className={styles.pageHeroLead}>
              Exploración técnica y experimentación con nuevas tecnologías fuera del entorno corporativo.
              Estos proyectos demuestran curiosidad, aprendizaje continuo y pasión por el desarrollo.
            </p>
          </motion.div>
        </div>
      </section>
      <PersonalProjects />
    </div>
  );
}
