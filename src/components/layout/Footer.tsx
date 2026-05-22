"use client";

import { useTranslations } from 'next-intl';
import { Github, Linkedin, InstagramIcon } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import styles from '@/styles/Footer.module.css';

export default function Footer() {
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
              <a href="mailto:jaiminator21@gmail.com" className="footer-link">
                jaiminator21@gmail.com
              </a>
            </div>
          </div>

          <div>
            <h3 className={styles.title}>{t('Footer.follow')}</h3>
            <div className={styles.socialFlex}>
              <a href="https://github.com/jaiminator21" target="_blank" rel="noopener" className="social-icon" aria-label="GitHub">
                <Github size={20} />
              </a>
              <a href="https://www.linkedin.com/in/jaime-sebasti%C3%A1n-9b4426205/" target="_blank" rel="noopener" className="social-icon" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="https://www.instagram.com/jaiminator21/" target="_blank" rel="noopener" className="social-icon" aria-label="Instagram">
                <InstagramIcon size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.copy}>{t('Footer.copy', { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  );
}
