"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import styles from '@/styles/Header.module.css';

const NAV_ITEMS = [
  { label: 'Inicio', path: '/' },
  { label: 'Proyectos Personales', path: '/proyectos-personales' },
  { label: 'Certificaciones', path: '/certificaciones' },
  { label: 'Proyectos Profesionales', path: '/proyectos-profesionales' },
];

export default function Header() {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}>
      <div className="container-custom">
        <div className={styles.wrapper}>
          {/* Logo */}
          <Link href="/" className={styles.logo} onClick={closeMenu}>
            <div className={styles.logoMark}>
              <span>P.</span>
            </div>
            <span className={styles.logoText}>PORTFOLIO</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav}>
            <div className={styles.links}>
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`${styles.navLink} ${isActive(item.path) ? styles.navLinkActive : ''}`}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="nav-underline"
                      className={styles.navUnderline}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            <div className={styles.divider} />

            <div className={styles.actions}>
              <button
                onClick={toggleTheme}
                className={styles.themeBtn}
                aria-label="Cambiar tema"
              >
                {isDark ? <Moon size={16} /> : <Sun size={16} />}
              </button>

              <a href="/cv.pdf" download className={styles.loginBtn}>
                <Download size={14} />
                Descargar CV
              </a>
            </div>
          </nav>

          {/* Mobile Toggle */}
          <div className={styles.mobileToggle}>
            <button onClick={toggleTheme} className={styles.mobileIconBtn} aria-label="Cambiar tema">
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              className={styles.menuBtn}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={styles.mobileMenu}
          >
            <div className={styles.mobileMenuInner}>
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={closeMenu}
                  className={`${styles.mobileLink} ${isActive(item.path) ? styles.mobileLinkActive : ''}`}
                >
                  {item.label}
                </Link>
              ))}

              <div className={styles.mobileSeparator} />

              <a
                href="/cv.pdf"
                download
                onClick={closeMenu}
                className={styles.mobileLoginBtn}
              >
                Descargar CV
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
