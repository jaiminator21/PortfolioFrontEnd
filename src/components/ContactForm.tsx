"use client";

import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/Button';
import {
  initialContactState,
  submitContactForm,
} from '@/app/actions/contact';
import styles from '@/styles/Contact.module.css';

/**
 * Split out of Contact so the submit button can read `useFormStatus`, which only
 * reports the pending state of the form it is rendered inside.
 */
function SubmitButton() {
  const t = useTranslations('Contact');
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="lg"
      className={styles.submitBtn}
      disabled={pending}
      aria-disabled={pending}
    >
      <span>{pending ? t('form.sending') : t('form.submit')}</span>
      {pending ? (
        <Loader2 className={styles.spinner} size={16} aria-hidden="true" />
      ) : (
        <Send className={styles.sendIcon} size={16} aria-hidden="true" />
      )}
    </Button>
  );
}

/**
 * Posts to Web3Forms through a Server Action, so it works without JavaScript and
 * the access key never reaches the browser.
 *
 * On failure the visitor is given the direct email address — a recruiter who
 * cannot reach you is the one outcome this form must never produce silently.
 */
export function ContactForm({ fallbackEmail }: { fallbackEmail: string }) {
  const t = useTranslations('Contact');
  const [state, formAction] = useActionState(submitContactForm, initialContactState);

  if (state.status === 'success') {
    return (
      <div className={styles.formSide}>
        {/* <output> carries an implicit role="status" live region. */}
        <output className={styles.successPanel}>
          <CheckCircle2 size={40} className={styles.successIcon} aria-hidden="true" />
          <h3 className={styles.successTitle}>{t('status.successTitle')}</h3>
          <p className={styles.successText}>{t('status.success')}</p>
        </output>
      </div>
    );
  }

  const fieldError = (field: 'name' | 'email' | 'message') =>
    state.fieldErrors?.[field] ? t(`errors.${state.fieldErrors[field]}`) : null;

  const nameError = fieldError('name');
  const emailError = fieldError('email');
  const messageError = fieldError('message');

  return (
    <div className={styles.formSide}>
      <form action={formAction} className={styles.form} noValidate>
        {/* Honeypot: hidden from people, irresistible to bots. */}
        <input
          type="checkbox"
          name="botcheck"
          className={styles.honeypot}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        {state.status === 'error' && state.messageKey ? (
          <div className={styles.errorBanner} role="alert">
            <AlertCircle size={18} aria-hidden="true" />
            <span>
              {t(`status.${state.messageKey}`)}{' '}
              <a href={`mailto:${fallbackEmail}`} className={styles.errorLink}>
                {fallbackEmail}
              </a>
            </span>
          </div>
        ) : null}

        <div className={styles.inputGroup}>
          <input
            type="text"
            id="name"
            name="name"
            placeholder=" "
            className={styles.input}
            defaultValue={state.values?.name}
            autoComplete="name"
            required
            aria-invalid={nameError ? true : undefined}
            aria-describedby={nameError ? 'name-error' : undefined}
          />
          <label htmlFor="name" className={styles.label}>
            {t('form.name')}
          </label>
          {nameError ? (
            <p id="name-error" className={styles.fieldError}>
              {nameError}
            </p>
          ) : null}
        </div>

        <div className={styles.inputGroup}>
          <input
            type="email"
            id="email"
            name="email"
            placeholder=" "
            className={styles.input}
            defaultValue={state.values?.email}
            autoComplete="email"
            required
            aria-invalid={emailError ? true : undefined}
            aria-describedby={emailError ? 'email-error' : undefined}
          />
          <label htmlFor="email" className={styles.label}>
            {t('form.email')}
          </label>
          {emailError ? (
            <p id="email-error" className={styles.fieldError}>
              {emailError}
            </p>
          ) : null}
        </div>

        <div className={styles.inputGroup}>
          <textarea
            id="message"
            name="message"
            placeholder=" "
            className={styles.input}
            defaultValue={state.values?.message}
            required
            rows={4}
            aria-invalid={messageError ? true : undefined}
            aria-describedby={messageError ? 'message-error' : undefined}
          />
          <label htmlFor="message" className={styles.label}>
            {t('form.message')}
          </label>
          {messageError ? (
            <p id="message-error" className={styles.fieldError}>
              {messageError}
            </p>
          ) : null}
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
