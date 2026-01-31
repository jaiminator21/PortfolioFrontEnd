"use client";

import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import styles from '@/styles/Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Video Background */}
      <div className={styles.videoContainer}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className={styles.video}
        >
          <source
            src="https://cdn.pixabay.com/video/2021/04/12/70851-536896208_large.mp4"
            type="video/mp4"
          />
        </video>
        <div className={styles.videoOverlay} />
      </div>

      {/* Grid & Noise Patterns */}
      <div className={styles.noiseOverlay} />
      <div className={styles.gridPattern} />

      <div className="container-custom" style={{ position: 'relative', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={styles.content}
        >
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={styles.kicker}
          >
            <span className={styles.kickerLine}></span>
            Desarrollador Web Full Stack
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className={styles.title}
          >
            Building the <span className={styles.titleGradient}>digital</span> future.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className={styles.description}
          >
            Especializado en aplicaciones escalables con un enfoque implacable en el 
            <span className={styles.highlight}> rendimiento</span> y la experiencia de usuario.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className={styles.buttonGroup}
          >
            <Button asChild size="lg" className={styles.mainBtn}>
              <Link href="/proyectos-profesionales">
                Ver proyectos profesionales
                <ArrowRight className={styles.arrow} />
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" asChild className={styles.secondaryBtn}>
              <Link href="/proyectos-personales">
                Proyectos personales
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className={styles.scrollIndicator}
      >
        <span className={styles.scrollText}>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}