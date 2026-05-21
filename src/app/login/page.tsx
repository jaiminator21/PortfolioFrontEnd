"use client";

import { useState } from 'react';
import { Lock, Mail, User, Eye, EyeOff } from 'lucide-react';
import styles from '@/styles/Login.module.css';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('La autenticación aún no está conectada.');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
          </h1>
          <p className={styles.subtitle}>
            {isSignUp
              ? 'Regístrate para acceder a los proyectos profesionales'
              : 'Accede a contenido exclusivo de proyectos profesionales'}
          </p>
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {isSignUp && (
            <div className={styles.field}>
              <label htmlFor="name" className={styles.label}>
                Nombre completo
              </label>
              <div className={styles.inputWrap}>
                <User size={20} className={styles.inputIcon} />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isSignUp}
                  className={styles.input}
                  placeholder="Tu nombre"
                />
              </div>
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <div className={styles.inputWrap}>
              <Mail size={20} className={styles.inputIcon} />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Contraseña</label>
            <div className={styles.inputWrap}>
              <Lock size={20} className={styles.inputIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className={`${styles.input} ${styles.inputWithToggle}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.toggleBtn}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {isSignUp && <p className={styles.hint}>Mínimo 6 caracteres</p>}
          </div>

          <button type="submit" className={styles.submitBtn}>
            {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
          </button>
        </form>

        <div className={styles.toggleMode}>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className={styles.toggleModeBtn}
          >
            {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>

        <div className={styles.disclaimer}>
          <p className={styles.disclaimerText}>
            Los proyectos profesionales contienen información sensible y requieren autenticación para su visualización.
          </p>
        </div>
      </div>
    </div>
  );
}
