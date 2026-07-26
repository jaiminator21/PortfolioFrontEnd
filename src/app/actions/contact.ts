'use server';

/**
 * Contact form submission via Web3Forms.
 *
 * Runs as a Server Action rather than a client-side fetch, which buys three
 * things: the form still works with JavaScript disabled, the access key stays
 * off the client, and failures surface as real state instead of an alert().
 *
 * The action returns translation *keys*, not sentences — it has no idea which
 * language the visitor is reading, so the client renders the message.
 */

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

type FieldName = 'name' | 'email' | 'message';

export type ContactState = {
  status: 'idle' | 'success' | 'error';
  /** Key under the `Contact.status` namespace. */
  messageKey?: string;
  /** Keys under the `Contact.errors` namespace, per field. */
  fieldErrors?: Partial<Record<FieldName, string>>;
  /** Echoed back so a failed submit does not wipe what the visitor typed. */
  values?: Record<FieldName, string>;
};

export const initialContactState: ContactState = { status: 'idle' };

/** Deliberately permissive: real addresses fail strict regexes more often than fakes pass. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  message: { min: 10, max: 5000 },
};

export async function submitContactForm(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = (formData.get('name') as string | null)?.trim() ?? '';
  const email = (formData.get('email') as string | null)?.trim() ?? '';
  const message = (formData.get('message') as string | null)?.trim() ?? '';
  const botcheck = formData.get('botcheck');

  const values: Record<FieldName, string> = { name, email, message };

  // Honeypot: hidden from humans, so anything in it means a bot. Report success
  // rather than an error — telling a scraper it was caught invites a retry.
  if (botcheck) {
    return { status: 'success', messageKey: 'success' };
  }

  const fieldErrors: Partial<Record<FieldName, string>> = {};

  if (!name) fieldErrors.name = 'nameRequired';
  else if (name.length < LIMITS.name.min) fieldErrors.name = 'nameTooShort';
  else if (name.length > LIMITS.name.max) fieldErrors.name = 'nameTooLong';

  if (!email) fieldErrors.email = 'emailRequired';
  else if (email.length > LIMITS.email.max || !EMAIL_PATTERN.test(email)) {
    fieldErrors.email = 'emailInvalid';
  }

  if (!message) fieldErrors.message = 'messageRequired';
  else if (message.length < LIMITS.message.min) fieldErrors.message = 'messageTooShort';
  else if (message.length > LIMITS.message.max) fieldErrors.message = 'messageTooLong';

  if (Object.keys(fieldErrors).length > 0) {
    return { status: 'error', messageKey: 'validationFailed', fieldErrors, values };
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    // Misconfiguration, not the visitor's fault. Log loudly and tell them to
    // email directly rather than silently swallowing the message.
    console.error(
      'WEB3FORMS_ACCESS_KEY is not set — the contact form cannot deliver messages. Get a key at https://web3forms.com'
    );
    return { status: 'error', messageKey: 'notConfigured', values };
  }

  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: accessKey,
        // `replyto` makes hitting reply in the inbox go straight to the sender —
        // without it, replying goes nowhere useful.
        replyto: email,
        from_name: 'Portfolio',
        subject: `Portfolio — new message from ${name}`,
        name,
        email,
        message,
      }),
      // Never let a hanging third party hold the request open.
      signal: AbortSignal.timeout(10_000),
    });

    const result = (await response.json().catch(() => null)) as
      | { success?: boolean; status?: number; message?: string }
      | null;

    // Trust the HTTP status first; `success` is only checked when explicitly false.
    if (!response.ok || result?.success === false) {
      console.error('Web3Forms rejected the submission', {
        httpStatus: response.status,
        message: result?.message,
      });
      return { status: 'error', messageKey: 'sendFailed', values };
    }

    return { status: 'success', messageKey: 'success' };
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'TimeoutError';
    console.error('Web3Forms request failed', error);
    return {
      status: 'error',
      messageKey: timedOut ? 'timeout' : 'sendFailed',
      values,
    };
  }
}
