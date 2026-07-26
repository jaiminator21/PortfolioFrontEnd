"use client";

import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { AvailabilityBadge } from '@/components/recruiter/AvailabilityBadge';
import { CvDownload } from '@/components/recruiter/CvDownload';
import { Link } from '@/i18n/navigation';
import { withHighlight } from '@/lib/highlight';
import type { Page, Profile } from '@/sanity/types';
import styles from '@/styles/Hero.module.css';

/**
 * The one screen every visitor sees. It has to answer, in order: who is this,
 * what do they do, are they available, and how do I get their CV.
 */
export default function Hero({
  profile,
  page,
  locale,
}: {
  profile: Profile;
  page: Page | null;
  locale: string;
}) {
  const t = useTranslations('Hero');
  const tCommon = useTranslations('Common');

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

      <div className={styles.noiseOverlay} />
      <div className={styles.gridPattern} />

      <div className="container-custom" style={{ position: 'relative', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={styles.content}
        >
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={styles.kicker}
          >
            <span className={styles.kickerLine}></span>
            {profile.headline}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className={styles.title}
          >
            {withHighlight(page?.title, styles.titleGradient)}
          </motion.h1>

          {profile.shortBio ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className={styles.description}
            >
              {profile.shortBio}
            </motion.p>
          ) : null}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className={styles.availabilityRow}
          >
            <AvailabilityBadge
              status={profile.availability?.status}
              note={profile.availability?.headline}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className={styles.buttonGroup}
          >
            <Button asChild size="lg" className={styles.mainBtn}>
              <Link href="/proyectos">
                {t('ctaProjects')}
                <ArrowRight className={styles.arrow} />
              </Link>
            </Button>

            <Button variant="outline" size="lg" asChild className={styles.secondaryBtn}>
              <Link href="/sobre-mi">
                {t('ctaAbout')}
              </Link>
            </Button>

            <CvDownload cv={profile.cv} locale={locale} fullName={profile.fullName} />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className={styles.scrollIndicator}
      >
        <span className={styles.scrollText}>{tCommon('scroll')}</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}
