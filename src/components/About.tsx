"use client";

import { motion } from 'framer-motion';
import styles from '@/styles/About.module.css';

export default function About() {
  return (
    <section className={styles.about} id="sobre-mi">
      {/* Texto decorativo de fondo */}
      <div className={styles.sideText}>ABOUT ME</div>

      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Cabecera con línea decorativa */}
          <div className={styles.header}>
            <h2 className={styles.title}>Sobre mí</h2>
            <div className={styles.headerLine}></div>
          </div>
          
          <div className={styles.grid}>
            {/* Columna de texto (7 fracciones en desktop) */}
            <div className={styles.textColumn}>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className={styles.leadParagraph}
              >
                Soy un <span className={styles.highContrast}>arquitecto de experiencias digitales</span> con sede en España, dedicado a fusionar la estética técnica con un rendimiento impecable.
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Mi enfoque va más allá del código; entiendo que cada línea debe servir a un propósito de negocio y mejorar la vida del usuario. Me especializo en el ecosistema <span className={styles.techSpan}>React / Next.js / TypeScript</span>.
              </motion.p>

              {/* Mini Grid de Filosofía */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className={styles.miniGrid}
              >
                <div>
                  <h4 className={styles.subLabel}>Filosofía</h4>
                  <p className={styles.subText}>Menos es más, pero mejor.</p>
                </div>
                <div>
                  <h4 className={styles.subLabel}>Enfoque</h4>
                  <p className={styles.subText}>Producto-céntrico y modular.</p>
                </div>
              </motion.div>
            </div>

            {/* Columna de Imagen/Badge (5 fracciones en desktop) */}
            <div className={styles.visualColumn}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className={styles.experienceBox}
              >
                <div className={styles.boxDecoration}></div>
                <div className={styles.boxContent}>
                  <span className={styles.expNumber}>5+</span>
                  <p className={styles.expLabel}>Años de experiencia construyendo productos</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}