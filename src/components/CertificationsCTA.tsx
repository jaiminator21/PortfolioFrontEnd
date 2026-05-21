"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Award, ArrowRight, Trophy, Star } from 'lucide-react';
import styles from '@/styles/CertificationsCTA.module.css';

const stats = [
  { icon: Award, value: '6+', label: 'Certificaciones', grad: styles.gradBlueCyan },
  { icon: Trophy, value: '4', label: 'Proveedores', grad: styles.gradPurplePink },
  { icon: Star, value: '500+', label: 'Horas', grad: styles.gradAmberOrange },
  { icon: Award, value: '20+', label: 'Skills', grad: styles.gradGreenEmerald },
];

export default function CertificationsCTA() {
  return (
    <section className={styles.section}>
      <div className={styles.blobPurple} />
      <div className={styles.blobBlue} />

      <div className={styles.particles}>
        <motion.div
          animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className={styles.particle1}
        />
        <motion.div
          animate={{ rotate: [360, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className={styles.particle2}
        />
      </div>

      <div className={`container-custom ${styles.inner}`}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.card}>
            <div className={styles.cardGrid}>
              {/* Left: content */}
              <div className={styles.content}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={styles.badgeRow}
                >
                  <div className={styles.iconWrap}>
                    <div className={styles.iconGlow} />
                    <div className={styles.iconBadge}>
                      <Trophy size={32} />
                    </div>
                  </div>
                  <span className={styles.kicker}>Certificaciones</span>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  className={styles.title}
                >
                  Validado por los{' '}
                  <span className={styles.titleHighlight}>líderes</span>{' '}
                  de la industria
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className={styles.description}
                >
                  Explora mi colección de certificaciones profesionales de AWS, Google Cloud, Meta y más — evidencia de aprendizaje continuo y dominio técnico.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <Link href="/certificaciones" className={styles.ctaButton}>
                    <span>Ver todas las certificaciones</span>
                    <ArrowRight size={16} className={styles.ctaArrow} />
                    <span className={styles.ctaShine} />
                  </Link>
                </motion.div>
              </div>

              {/* Right: stats */}
              <div className={styles.statsGrid}>
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                      className={styles.statCard}
                    >
                      <div className={`${styles.statBgGradient} ${stat.grad}`} />
                      <div className={styles.statContent}>
                        <div className={`${styles.statIconBox} ${stat.grad}`}>
                          <Icon size={24} />
                        </div>
                        <div className={styles.statValue}>{stat.value}</div>
                        <div className={styles.statLabel}>{stat.label}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
