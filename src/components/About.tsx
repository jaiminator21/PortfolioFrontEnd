"use client";

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import styles from '@/styles/About.module.css';

export default function About() {
  const t = useTranslations('About');

  return (
    <section className={styles.about} id="sobre-mi">
      <div className={styles.sideText}>{t('sideText')}</div>

      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className={styles.header}>
            <h2 className={styles.title}>{t('title')}</h2>
            <div className={styles.headerLine}></div>
          </div>

          <div className={styles.grid}>
            <div className={styles.textColumn}>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className={styles.leadParagraph}
              >
                {t('lead1Pre')}{' '}
                <span className={styles.highContrast}>{t('lead1Highlight')}</span>{' '}
                {t('lead1Post')}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {t('lead2Pre')}{' '}
                <span className={styles.techSpan}>{t('lead2Tech')}</span>.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className={styles.miniGrid}
              >
                <div>
                  <h4 className={styles.subLabel}>{t('philosophyLabel')}</h4>
                  <p className={styles.subText}>{t('philosophyText')}</p>
                </div>
                <div>
                  <h4 className={styles.subLabel}>{t('focusLabel')}</h4>
                  <p className={styles.subText}>{t('focusText')}</p>
                </div>
              </motion.div>
            </div>

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
                  <span className={styles.expNumber}>{t('experienceNumber')}</span>
                  <p className={styles.expLabel}>{t('experienceLabel')}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
