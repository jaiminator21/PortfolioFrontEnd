"use client";

import { Github, Linkedin, InstagramIcon } from 'lucide-react';
import styles from '@/styles/Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className={styles.footer}>
      <div className="container-custom">
        <div className={styles.grid}>
          {/* Navegación */}
          <div>
            <h3 className={styles.title}>Navegación</h3>
            <nav className={styles.navStack}>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="footer-link"
              >
                Inicio
              </button>
              <button 
                onClick={() => scrollToSection('proyectos-profesionales')}
                className="footer-link"
              >
                Proyectos
              </button>
              <button 
                onClick={() => scrollToSection('contacto')}
                className="footer-link"
              >
                Contacto
              </button>
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