"use client";

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { RichText } from '@/components/sanity/RichText';
import { SanityImage } from '@/components/sanity/SanityImage';
import { yearsSince } from '@/lib/dates';
import type { Profile } from '@/sanity/types';
import styles from '@/styles/About.module.css';

/**
 * The years figure is computed from `careerStartDate`, so it increments on its
 * own instead of being a hardcoded "5+" that silently rots.
 *
 * The two facts beside the bio are languages and work preferences rather than
 * abstract mottos: they are what a recruiter actually needs to know to decide
 * whether to make contact.
 */
export default function About({ profile }: { profile: Profile }) {
  const t = useTranslations('About');
  const tAvail = useTranslations('Availability');

  const years = yearsSince(profile.careerStartDate);

  const languages = profile.spokenLanguages
    ?.map((l) => `${l.name} (${l.level})`)
    .join(' · ');

  const workModes = profile.availability?.workModes
    ?.map((mode) => tAvail(`workMode.${mode}`))
    .join(' · ');

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
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className={styles.bioProse}
              >
                <RichText value={profile.bio} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className={styles.miniGrid}
              >
                {languages ? (
                  <div>
                    <h4 className={styles.subLabel}>{t('languagesLabel')}</h4>
                    <p className={styles.subText}>{languages}</p>
                  </div>
                ) : null}

                {workModes ? (
                  <div>
                    <h4 className={styles.subLabel}>{t('workModeLabel')}</h4>
                    <p className={styles.subText}>{workModes}</p>
                  </div>
                ) : null}

                {profile.location?.city ? (
                  <div>
                    <h4 className={styles.subLabel}>{t('locationLabel')}</h4>
                    <p className={styles.subText}>
                      {[profile.location.city, profile.location.country]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                ) : null}

                {profile.availability?.preferredRoles?.length ? (
                  <div>
                    <h4 className={styles.subLabel}>{t('targetRolesLabel')}</h4>
                    <p className={styles.subText}>
                      {profile.availability.preferredRoles.join(' · ')}
                    </p>
                  </div>
                ) : null}
              </motion.div>
            </div>

            <div className={styles.visualColumn}>
              {profile.photo?.url ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className={styles.photoWrap}
                >
                  <SanityImage
                    value={profile.photo}
                    className={styles.photo}
                    sizes="(max-width: 768px) 60vw, 20rem"
                  />
                </motion.div>
              ) : null}

              {years !== null ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className={styles.experienceBox}
                >
                  <div className={styles.boxDecoration}></div>
                  <div className={styles.boxContent}>
                    <span className={styles.expNumber}>{years}+</span>
                    <p className={styles.expLabel}>{t('experienceLabel')}</p>
                  </div>
                </motion.div>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
