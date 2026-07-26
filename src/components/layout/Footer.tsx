"use client";

import { useTranslations } from 'next-intl';
import { Github, Globe, InstagramIcon, Linkedin, Mail, Twitter } from 'lucide-react';
import type { ComponentType } from 'react';
import { Link } from '@/i18n/navigation';
import type { Profile } from '@/sanity/types';
import styles from '@/styles/Footer.module.css';

const PLATFORM_ICONS: Record<string, ComponentType<{ size?: number }>> = {
  github: Github,
  linkedin: Linkedin,
  x: Twitter,
  email: Mail,
  website: Globe,
  other: InstagramIcon,
};

export default function Footer({ profile }: { profile: Profile | null }) {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container-custom">
        <div className={styles.grid}>
          <div>
            <h3 className={styles.title}>{t('Footer.navigation')}</h3>
            <nav className={styles.navStack}>
              <Link href="/sobre-mi" className="footer-link">
                {t('Nav.about')}
              </Link>
              <Link href="/proyectos" className="footer-link">
                {t('Nav.projects')}
              </Link>
              <Link href="/certificaciones" className="footer-link">
                {t('Nav.certifications')}
              </Link>
              <Link href="/contacto" className="footer-link">
                {t('Nav.contact')}
              </Link>
            </nav>
          </div>

          <div>
            <h3 className={styles.title}>{t('Footer.contact')}</h3>
            <div className={styles.navStack}>
              {profile?.email ? (
                <a href={`mailto:${profile.email}`} className="footer-link">
                  {profile.email}
                </a>
              ) : null}
              {profile?.schedulingUrl ? (
                <a
                  href={profile.schedulingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  {t('Contact.scheduleCall')}
                </a>
              ) : null}
            </div>
          </div>

          {profile?.socials?.length ? (
            <div>
              <h3 className={styles.title}>{t('Footer.follow')}</h3>
              <div className={styles.socialFlex}>
                {profile.socials.map((social) => {
                  const Icon = PLATFORM_ICONS[social.platform] ?? Globe;
                  return (
                    <a
                      key={social._key}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon"
                      aria-label={social.label ?? social.platform}
                    >
                      <Icon size={20} />
                    </a>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.copy}>
            {t('Footer.copy', { year: currentYear, name: profile?.fullName ?? '' })}
          </p>
        </div>
      </div>
    </footer>
  );
}
