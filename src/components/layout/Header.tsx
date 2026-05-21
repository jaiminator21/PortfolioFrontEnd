"use client";

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon, Download, Github, Linkedin, InstagramIcon } from 'lucide-react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import styles from '@/styles/Header.module.css';

const NAV_ITEMS = [
  { label: 'Inicio', path: '/' },
  { label: 'Proyectos Personales', path: '/proyectos-personales' },
  { label: 'Certificaciones', path: '/certificaciones' },
  { label: 'Proyectos Profesionales', path: '/proyectos-profesionales' },
  { label: 'Contacto', path: '/contacto' },
];

const SOCIAL_LINKS = [
  { Icon: Github, href: 'https://github.com/jaiminator21', label: 'GitHub' },
  { Icon: Linkedin, href: 'https://www.linkedin.com/in/jaime-sebasti%C3%A1n-9b4426205/', label: 'LinkedIn' },
  { Icon: InstagramIcon, href: 'https://www.instagram.com/jaiminator21/', label: 'Instagram' },
];

const menuContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.25,
      ease: 'easeOut',
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

const menuItemVariants: Variants = {
  hidden: { opacity: 0, x: -40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Header() {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const linksRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [underline, setUnderline] = useState<{ left: number; width: number; visible: boolean }>({
    left: 0,
    width: 0,
    visible: false,
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previous;
      };
    }
  }, [mobileMenuOpen]);

  // Close menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const measure = () => {
    const active = itemRefs.current[pathname];
    const container = linksRef.current;
    if (!active || !container) {
      setUnderline((u) => ({ ...u, visible: false }));
      return;
    }
    const aRect = active.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();
    setUnderline({
      left: aRect.left - cRect.left,
      width: aRect.width,
      visible: true,
    });
  };

  useLayoutEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const isActive = (path: string) => pathname === path;
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className={`${styles.navbar} ${scrolled || mobileMenuOpen ? styles.navbarScrolled : ''}`}>
      <div className={`container-custom ${styles.topRow}`}>
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
            <div ref={linksRef} className={styles.links}>
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  ref={(el) => {
                    itemRefs.current[item.path] = el;
                  }}
                  className={`${styles.navLink} ${isActive(item.path) ? styles.navLinkActive : ''}`}
                >
                  {item.label}
                </Link>
              ))}
              <span
                aria-hidden
                className={styles.navUnderline}
                style={{
                  transform: `translateX(${underline.left}px)`,
                  width: underline.width,
                  opacity: underline.visible ? 1 : 0,
                }}
              />
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
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            className={styles.mobileMenu}
            variants={menuContainerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <nav className={styles.mobileMenuInner}>
              {NAV_ITEMS.map((item) => (
                <motion.div key={item.path} variants={menuItemVariants}>
                  <Link
                    href={item.path}
                    onClick={closeMenu}
                    className={`${styles.mobileLink} ${isActive(item.path) ? styles.mobileLinkActive : ''}`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div variants={menuItemVariants} className={styles.mobileSeparator} />

              <motion.a
                variants={menuItemVariants}
                href="/cv.pdf"
                download
                onClick={closeMenu}
                className={styles.mobileLoginBtn}
              >
                <Download size={16} />
                Descargar CV
              </motion.a>

              <motion.div variants={menuItemVariants} className={styles.mobileSocial}>
                {SOCIAL_LINKS.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={styles.mobileSocialIcon}
                  >
                    <Icon size={22} />
                  </a>
                ))}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
