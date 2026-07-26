"use client";

import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
  WEB3FORMS_ENDPOINT,
  buildContactPayload,
  validateContact,
  type ContactFieldErrors,
  type ContactValues,
} from '@/lib/contactForm';
import styles from '@/styles/Contact.module.css';

/**
 * Web3Forms contact form.
 *
 * Submits client-side because Web3Forms rejects server-side POSTs on the free
 * plan (403: "Use our API in client side"). That makes the access key public by
 * design — which Web3Forms explicitly supports; the key only grants the ability
 * to send to the address it was issued for.
 *
 * The <form> keeps a real `action`/`method`, so with JavaScript disabled the
 * browser posts natively and the message still arrives. With JavaScript, the
 * submit is intercepted for inline validation and proper status states.
 */

const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ?? '';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? '';

const EMPTY: ContactValues = { name: '', email: '', message: '' };

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm({
  fallbackEmail,
  locale,
}: {
  fallbackEmail: string;
  locale: string;
}) {
  const t = useTranslations('Contact');

  const [values, setValues] = useState<ContactValues>(EMPTY);
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [errorKey, setErrorKey] = useState<string | null>(null);

  /**
   * Where Web3Forms sends the browser after a no-JS submit. Web3Forms requires
   * an absolute https URL, so it is omitted on http (i.e. local development).
   */
  const redirectUrl = SITE_URL.startsWith('https://')
    ? `${SITE_URL}/${locale}/${locale === 'en' ? 'contact' : 'contacto'}?sent=1`
    : undefined;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear this field's error as soon as the visitor starts fixing it.
    setFieldErrors((prev) => (prev[name as keyof ContactValues] ? { ...prev, [name]: undefined } : prev));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validateContact(values);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus('error');
      setErrorKey('validationFailed');
      return;
    }

    if (!ACCESS_KEY) {
      console.error(
        'NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY is not set — the contact form cannot deliver messages. Get a key at https://web3forms.com'
      );
      setStatus('error');
      setErrorKey('notConfigured');
      return;
    }

    setFieldErrors({});
    setStatus('submitting');
    setErrorKey(null);

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(buildContactPayload({ values, accessKey: ACCESS_KEY })),
        // Never let a hanging third party leave the button spinning forever.
        signal: AbortSignal.timeout(15_000),
      });

      const result = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string }
        | null;

      if (!response.ok || result?.success === false) {
        console.error('Web3Forms rejected the submission', {
          httpStatus: response.status,
          message: result?.message,
        });
        setStatus('error');
        setErrorKey('sendFailed');
        return;
      }

      setValues(EMPTY);
      setStatus('success');
    } catch (error) {
      const timedOut = error instanceof Error && error.name === 'TimeoutError';
      console.error('Web3Forms request failed', error);
      setStatus('error');
      setErrorKey(timedOut ? 'timeout' : 'sendFailed');
    }
  };

  if (status === 'success') {
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

  const submitting = status === 'submitting';
  const errorFor = (field: keyof ContactValues) =>
    fieldErrors[field] ? t(`errors.${fieldErrors[field]}`) : null;

  const nameError = errorFor('name');
  const emailError = errorFor('email');
  const messageError = errorFor('message');

  return (
    <div className={styles.formSide}>
      <form
        // Real action/method: the no-JavaScript path posts straight to Web3Forms.
        action={WEB3FORMS_ENDPOINT}
        method="POST"
        onSubmit={handleSubmit}
        className={styles.form}
        noValidate
      >
        <input type="hidden" name="access_key" value={ACCESS_KEY} />
        <input type="hidden" name="from_name" value="Portfolio" />
        <input type="hidden" name="subject" value="Portfolio — new message" />
        {redirectUrl ? (
          <input type="hidden" name="redirect" value={redirectUrl} />
        ) : null}

        {/* Honeypot: hidden from people, irresistible to bots. */}
        <input
          type="checkbox"
          name="botcheck"
          className={styles.honeypot}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        {status === 'error' && errorKey ? (
          <div className={styles.errorBanner} role="alert">
            <AlertCircle size={18} aria-hidden="true" />
            <span>
              {t(`status.${errorKey}`)}{' '}
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
            value={values.name}
            onChange={handleChange}
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
            value={values.email}
            onChange={handleChange}
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
            value={values.message}
            onChange={handleChange}
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

        <Button
          type="submit"
          size="lg"
          className={styles.submitBtn}
          disabled={submitting}
          aria-disabled={submitting}
        >
          <span>{submitting ? t('form.sending') : t('form.submit')}</span>
          {submitting ? (
            <Loader2 className={styles.spinner} size={16} aria-hidden="true" />
          ) : (
            <Send className={styles.sendIcon} size={16} aria-hidden="true" />
          )}
        </Button>
      </form>
    </div>
  );
}
