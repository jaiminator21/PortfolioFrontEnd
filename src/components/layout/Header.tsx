"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon, CircleUserIcon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import styles from '@/styles/Header.module.css';
import { Button } from '../ui/Button';

export default function Header() {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  // Función para cerrar el menú al hacer click en un enlace (móvil)
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className={styles.navbar}>
      <div className="container-custom">
        <div className={styles.wrapper}>
          {/* Logo */}
          <Link href="/" className={styles.logo} onClick={closeMenu}>
            Portfolio
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav}>
            <div className={styles.links}>
              <Link 
                href="/" 
                className={`nav-link-base ${isActive('/') ? 'active' : ''}`}
              >
                Inicio
              </Link>
              <Link 
                href="/proyectos-personales" 
                className={`nav-link-base ${isActive('/proyectos-personales') ? 'active' : ''}`}
              >
                Proyectos Personales
              </Link>
            </div>

            <div className={styles.actions}>
              <button 
                onClick={toggleTheme} 
                className="btn-icon" 
                aria-label="Cambiar tema"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Button variant="default" size="sm" asChild>
              <Link href="/login" >
              <CircleUserIcon />
                Iniciar sesión
              </Link>
              </Button>
            </div>
          </nav>

          {/* Mobile Toggle Buttons */}
          <div className={styles.mobileToggle}>
            <button onClick={toggleTheme} className="btn-icon">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              className="btn-icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Content */}
        {mobileMenuOpen && (
          <nav className={styles.mobileMenu}>
            <Link 
              href="/" 
              onClick={closeMenu} 
              className={`nav-link-base ${isActive('/') ? 'active' : ''}`}
            >
              Inicio
            </Link>
            <Link 
              href="/proyectos-personales" 
              onClick={closeMenu} 
              className={`nav-link-base ${isActive('/proyectos-personales') ? 'active' : ''}`}
            >
              Proyectos Personales
            </Link>
            <Link 
              href="/login" 
              onClick={closeMenu} 
              className="btn-primary"
            >
              Iniciar sesión
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}