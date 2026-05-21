"use client";

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import PersonalProjects from '@/components/PersonalProjects';
import styles from '@/styles/SecondaryPage.module.css';

export default function PersonalProjectsPage() {
  const t = useTranslations('PersonalProjects');

  return (
    <div className={styles.wrapper}>
      <section className={styles.pageHero}>
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className={styles.pageHeroTitle}>{t('pageTitle')}</h1>
            <p className={styles.pageHeroLead}>{t('pageLead')}</p>
          </motion.div>
        </div>
      </section>
      <PersonalProjects />
    </div>
  );
}
