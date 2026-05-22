"use client";

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X, Sun, Moon, Download, Github, Linkedin, InstagramIcon, ChevronDown, Check } from 'lucide-react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import styles from '@/styles/Header.module.css';

type NavPath =
  | '/sobre-mi'
  | '/proyectos'
  | '/certificaciones'
  | '/contacto';

// `widthHolder` reserves the layout width of the longest locale variant
// (always Spanish in our case) so the nav doesn't reflow when switching language.
const NAV_ITEMS: { key: string; path: NavPath; widthHolder: string }[] = [
  { key: 'about', path: '/sobre-mi', widthHolder: 'Sobre mí' },
  { key: 'projects', path: '/proyectos', widthHolder: 'Proyectos' },
  { key: 'certifications', path: '/certificaciones', widthHolder: 'Certificaciones' },
  { key: 'contact', path: '/contacto', widthHolder: 'Contacto' },
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
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const linksRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLSpanElement | null>>({});
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

  useEffect(() => {
    if (mobileMenuOpen) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previous;
      };
    }
  }, [mobileMenuOpen]);

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
  }, [pathname, locale]);

  const isActive = (path: string) => pathname === path;
  const closeMenu = () => setMobileMenuOpen(false);

  const switchLocale = (nextLocale: string) => {
    if (nextLocale === locale) return;
    // Strip the locale param since the router adds it back via the options arg.
    const { locale: _localeParam, ...rest } = params as Record<string, string | string[]>;
    router.replace(
      // @ts-expect-error -- pathname matches one of the declared route patterns at runtime
      { pathname, params: rest },
      { locale: nextLocale as 'es' | 'en' }
    );
  };

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
                  className={`${styles.navLink} ${isActive(item.path) ? styles.navLinkActive : ''}`}
                >
                  <span
                    ref={(el) => {
                      itemRefs.current[item.path] = el;
                    }}
                    className={styles.navLinkLabel}
                  >
                    {t(`Nav.${item.key}`)}
                  </span>
                  <span aria-hidden className={styles.navLinkGhost}>
                    {item.widthHolder}
                  </span>
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
              <LanguageSwitcher locale={locale} onChange={switchLocale} />

              <button
                onClick={toggleTheme}
                className={styles.themeBtn}
                aria-label={t('Common.toggleTheme')}
              >
                {isDark ? <Moon size={16} /> : <Sun size={16} />}
              </button>

              <a href="/cv.pdf" download className={styles.loginBtn}>
                <Download size={14} />
                <span className={styles.cvLong}>{t('Common.downloadCV')}</span>
                <span className={styles.cvShort} aria-hidden>CV</span>
              </a>
            </div>
          </nav>

          {/* Mobile Toggle */}
          <div className={styles.mobileToggle}>
            <button onClick={toggleTheme} className={styles.mobileIconBtn} aria-label={t('Common.toggleTheme')}>
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              className={styles.menuBtn}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? t('Common.closeMenu') : t('Common.openMenu')}
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
                    {t(`Nav.${item.key}`)}
                  </Link>
                </motion.div>
              ))}

              <motion.div variants={menuItemVariants} className={styles.mobileSeparator} />

              <motion.div variants={menuItemVariants} className={styles.mobileLangSwitcher}>
                <LanguageSwitcher locale={locale} onChange={switchLocale} variant="buttons" />
              </motion.div>

              <motion.a
                variants={menuItemVariants}
                href="/cv.pdf"
                download
                onClick={closeMenu}
                className={styles.mobileLoginBtn}
              >
                <Download size={16} />
                {t('Common.downloadCV')}
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

function LanguageSwitcher({
  locale,
  onChange,
  variant = 'dropdown',
}: {
  locale: string;
  onChange: (next: string) => void;
  variant?: 'dropdown' | 'buttons';
}) {
  const t = useTranslations('LanguageSwitcher');
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  if (variant === 'buttons') {
    return (
      <div className={styles.langSwitcher} role="group" aria-label={t('label')}>
        {routing.locales.map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => onChange(loc)}
            className={`${styles.langBtn} ${loc === locale ? styles.langBtnActive : ''}`}
            aria-pressed={loc === locale}
          >
            {loc.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={styles.langDropdown}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={styles.langTrigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('label')}
      >
        <span>{locale.toUpperCase()}</span>
        <ChevronDown
          size={14}
          className={`${styles.langChevron} ${open ? styles.langChevronOpen : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className={styles.langMenu}
            role="listbox"
          >
            {routing.locales.map((loc) => (
              <li key={loc} role="option" aria-selected={loc === locale}>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onChange(loc);
                  }}
                  className={`${styles.langMenuItem} ${loc === locale ? styles.langMenuItemActive : ''}`}
                >
                  <span className={styles.langMenuCode}>{loc.toUpperCase()}</span>
                  <span className={styles.langMenuName}>{t(loc as 'es' | 'en')}</span>
                  {loc === locale && <Check size={14} className={styles.langMenuCheck} />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
