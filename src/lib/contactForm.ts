/**
 * Validation and payload shaping for the Web3Forms contact form.
 *
 * Kept out of the component so the rules live in one place, and plain (no
 * 'use server') because Web3Forms rejects server-side submissions on the free
 * plan — the POST has to come from the browser.
 */

export const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

export type ContactField = 'name' | 'email' | 'message';

export type ContactValues = Record<ContactField, string>;

/** Keys under the `Contact.errors` translation namespace. */
export type ContactFieldErrors = Partial<Record<ContactField, string>>;

/** Deliberately permissive: real addresses fail strict regexes more often than fakes pass. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  message: { min: 10, max: 5000 },
};

export function validateContact(values: ContactValues): ContactFieldErrors {
  const errors: ContactFieldErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (!name) errors.name = 'nameRequired';
  else if (name.length < LIMITS.name.min) errors.name = 'nameTooShort';
  else if (name.length > LIMITS.name.max) errors.name = 'nameTooLong';

  if (!email) errors.email = 'emailRequired';
  else if (email.length > LIMITS.email.max || !EMAIL_PATTERN.test(email)) {
    errors.email = 'emailInvalid';
  }

  if (!message) errors.message = 'messageRequired';
  else if (message.length < LIMITS.message.min) errors.message = 'messageTooShort';
  else if (message.length > LIMITS.message.max) errors.message = 'messageTooLong';

  return errors;
}

/**
 * `replyto` is the field that matters: without it, hitting reply in the inbox
 * goes nowhere useful instead of back to the person who wrote in.
 */
export function buildContactPayload({
  values,
  accessKey,
  redirectUrl,
}: {
  values: ContactValues;
  accessKey: string;
  redirectUrl?: string;
}) {
  return {
    access_key: accessKey,
    replyto: values.email.trim(),
    from_name: 'Portfolio',
    subject: `Portfolio — new message from ${values.name.trim()}`,
    name: values.name.trim(),
    email: values.email.trim(),
    message: values.message.trim(),
    ...(redirectUrl ? { redirect: redirectUrl } : {}),
  };
}
