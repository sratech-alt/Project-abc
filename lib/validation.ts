/**
 * validation.ts — Contact form rules, kept free of React and the DOM so they can be unit-tested.
 */

export type ContactField = 'name' | 'email' | 'message';

export type ContactInput = {
  name: string;
  email: string;
  subject?: string;
  message: string;
  /** Honeypot. Hidden from people, so any value means a bot filled the form. */
  website?: string;
  /** Milliseconds between the form appearing and being submitted. */
  elapsedMs?: number;
};

export type ContactData = { name: string; email: string; subject: string; message: string };

export type ContactResult =
  | { ok: true; data: ContactData }
  | { ok: false; reason: 'invalid'; field: ContactField; message: string }
  | { ok: false; reason: 'spam' };

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const MIN_FILL_TIME_MS = 2500;
export const MIN_MESSAGE_LENGTH = 10;
export const DEFAULT_SUBJECT = 'General Inquiry';

export function validateContact(input: ContactInput): ContactResult {
  if ((input.website ?? '').trim() !== '') return { ok: false, reason: 'spam' };
  if (input.elapsedMs !== undefined && input.elapsedMs < MIN_FILL_TIME_MS) return { ok: false, reason: 'spam' };

  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  if (!name) return { ok: false, reason: 'invalid', field: 'name', message: 'Please tell us your name.' };
  if (!email) return { ok: false, reason: 'invalid', field: 'email', message: 'Please enter your email address.' };
  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, reason: 'invalid', field: 'email', message: 'That email address doesn’t look right.' };
  }
  if (message.length < MIN_MESSAGE_LENGTH) {
    return { ok: false, reason: 'invalid', field: 'message', message: 'Please add a few words about your project.' };
  }

  return { ok: true, data: { name, email, subject: (input.subject ?? '').trim() || DEFAULT_SUBJECT, message } };
}
