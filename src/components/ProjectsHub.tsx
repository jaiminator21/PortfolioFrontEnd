"use client";

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import PersonalProjects from '@/components/PersonalProjects';
import ProfessionalProjects from '@/components/ProfessionalProjects';
import type { ProjectCard } from '@/sanity/types';
import styles from '@/styles/ProjectsHub.module.css';

type Tab = 'professional' | 'personal';

const TABS: Tab[] = ['professional', 'personal'];

export default function ProjectsHub({
  professional,
  personal,
}: {
  professional: ProjectCard[];
  personal: ProjectCard[];
}) {
  const t = useTranslations('Projects');
  const [active, setActive] = useState<Tab>('professional');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash.replace('#', '');
    if (hash === 'personal' || hash === 'personales') {
      setActive('personal');
    }
  }, []);

  const counts: Record<Tab, number> = {
    professional: professional.length,
    personal: personal.length,
  };

  return (
    <>
      <div className="container-custom">
        <div className={styles.tabsBar} role="tablist">
          {TABS.map((tab) => {
            const isActive = active === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setActive(tab);
                  if (typeof window !== 'undefined') {
                    history.replaceState(null, '', `#${tab}`);
                  }
                }}
                className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
              >
                {t(`tabs.${tab}`)}
                {counts[tab] > 0 ? (
                  <span className={styles.tabCount}>{counts[tab]}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.panel}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {active === 'professional' ? (
              <ProfessionalProjects projects={professional} />
            ) : (
              <PersonalProjects projects={personal} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
