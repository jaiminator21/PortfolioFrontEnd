"use client";

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import styles from '@/styles/Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={styles.content}
        >
          <p className="text-kicker">Desarrollador Web</p>
          
          <h1 className={styles.title}>
            Frontend / Full Stack Developer
          </h1>
          
          <p className="text-lead">
            Especializado en aplicaciones web escalables, rendimiento y experiencia de usuario.
          </p>
          
          <p className={styles.description}>
            Transformo requisitos complejos en interfaces intuitivas y eficientes que impulsan el crecimiento del producto.
          </p>
          
          <div className={styles.buttonGroup}>
            <Link href="/proyectos-profesionales" className="btn-primary" style={{ padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Ver proyectos profesionales
              <ArrowRight size={18} className={styles.arrow} />
            </Link>
            
            <Link href="/proyectos-personales" className="btn-outline">
              Proyectos personales
            </Link>
          </div>
          
        </motion.div>
      </div>
    </section>
  );
}