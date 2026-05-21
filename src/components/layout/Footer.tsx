"use client";

import Link from 'next/link';
import { Github, Linkedin, InstagramIcon } from 'lucide-react';
import styles from '@/styles/Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container-custom">
        <div className={styles.grid}>
          {/* Navegación */}
          <div>
            <h3 className={styles.title}>Navegación</h3>
            <nav className={styles.navStack}>
              <Link href="/" className="footer-link">
                Inicio
              </Link>
              <Link href="/proyectos-personales" className="footer-link">
                Proyectos Personales
              </Link>
              <Link href="/proyectos-profesionales" className="footer-link">
                Proyectos Profesionales
              </Link>
              <Link href="/certificaciones" className="footer-link">
                Certificaciones
              </Link>
              <Link href="/contacto" className="footer-link">
                Contacto
              </Link>
            </nav>
          </div>

          {/* Contacto */}
          <div>
            <h3 className={styles.title}>Contacto</h3>
            <div className={styles.navStack}>
              <a href="mailto:jaiminator21@gmail.com" className="footer-link">
                jaiminator21@gmail.com
              </a>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className={styles.title}>Sígueme</h3>
            <div className={styles.socialFlex}>
              <a href="https://github.com/jaiminator21" target="_blank" rel="noopener" className="social-icon">
                <Github size={20} />
              </a>
              <a href="https://www.linkedin.com/in/jaime-sebasti%C3%A1n-9b4426205/" target="_blank" rel="noopener" className="social-icon">
                <Linkedin size={20} />
              </a>
              <a href="https://www.instagram.com/jaiminator21/" target="_blank" rel="noopener" className="social-icon">
                <InstagramIcon size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copy}>
            © {currentYear} Jaime Sebastián
          </p>
        </div>
      </div>
    </footer>
  );
}
