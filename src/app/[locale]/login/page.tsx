"use client";

import { useState } from 'react';
import { Lock, Mail, User, Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import styles from '@/styles/Login.module.css';

export default function LoginPage() {
  const t = useTranslations('Login');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(t('notImplementedError'));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {isSignUp ? t('signUp') : t('signIn')}
          </h1>
          <p className={styles.subtitle}>
            {isSignUp ? t('signUpSubtitle') : t('signInSubtitle')}
          </p>
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {isSignUp && (
            <div className={styles.field}>
              <label htmlFor="name" className={styles.label}>{t('name')}</label>
              <div className={styles.inputWrap}>
                <User size={20} className={styles.inputIcon} />
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isSignUp}
                  className={styles.input}
                  placeholder={t('namePlaceholder')}
                />
              </div>
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>{t('email')}</label>
            <div className={styles.inputWrap}>
              <Mail size={20} className={styles.inputIcon} />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
                placeholder={t('emailPlaceholder')}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>{t('password')}</label>
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
                aria-label={showPassword ? t('hidePassword') : t('showPassword')}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {isSignUp && <p className={styles.hint}>{t('passwordHint')}</p>}
          </div>

          <button type="submit" className={styles.submitBtn}>
            {isSignUp ? t('signUp') : t('signIn')}
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
            {isSignUp ? t('toggleToSignIn') : t('toggleToSignUp')}
          </button>
        </div>

        <div className={styles.disclaimer}>
          <p className={styles.disclaimerText}>{t('disclaimer')}</p>
        </div>
      </div>
    </div>
  );
}
