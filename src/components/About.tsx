"use client";

import { motion } from 'framer-motion';
import styles from '@/styles/About.module.css';
import { Button } from './ui/Button';
// 1. Importamos el Link de Next.js
import Link from 'next/link'; 
// 2. Renombramos el icono para evitar conflicto (ej. FileDown para un CV)
import { FileDown } from 'lucide-react'; 

export default function About() {
  return (
    <section className={styles.about} id="sobre-mi">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>Sobre mí</h2>
          <div className={styles.grid}>
            <div className={styles.column}>
              <p>
                Desarrollador web con enfoque en crear productos digitales de alto rendimiento y escalables.
              </p>
              <p>
                Me especializo en optimizar la experiencia de usuario trabajando de forma colaborativa.
              </p>
            </div>
            <div className={styles.column}>
              <p>
                Aporto una mentalidad orientada a resultados, combinando best practices de desarrollo.
              </p>
              <p>
                Constantemente actualizado para entregar soluciones modernas y mantenibles.
              </p>
            </div>
          </div>
        </motion.div>

        {/* 3. Usamos asChild y el Link de Next.js correcto */}
        <div style={{ marginTop: '2rem' }}>
          <Button variant="default" size="lg" asChild>
            <Link href="/cv-tu-nombre.pdf" target="_blank">
              <FileDown size={18} style={{ marginRight: '8px' }} />
              Descargar CV
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}