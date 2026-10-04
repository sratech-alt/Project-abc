import { describe, expect, it } from 'vitest';
import { DEFAULT_SUBJECT, MIN_FILL_TIME_MS, validateContact, type ContactInput } from './validation';

const valid: ContactInput = {
  name: 'Sarah Jenkins',
  email: 'sarah@company.com',
  subject: 'Mobile app',
  message: 'We need a booking app for our clinics.',
  website: '',
  elapsedMs: 10_000,
};

describe('validateContact', () => {
  it('accepts a complete submission and returns trimmed data', () => {
    const result = validateContact({ ...valid, name: '  Sarah Jenkins ', email: ' sarah@company.com ' });
    expect(result).toEqual({
      ok: true,
      data: { name: 'Sarah Jenkins', email: 'sarah@company.com', subject: 'Mobile app', message: valid.message },
    });
  });

  it('falls back to the default subject when none is given', () => {
    for (const subject of [undefined, '', '   ']) {
      const result = validateContact({ ...valid, subject });
      expect(result.ok && result.data.subject).toBe(DEFAULT_SUBJECT);
    }
  });

  it('blocks an empty submission and points at the first missing field', () => {
    const result = validateContact({ name: '', email: '', message: '' });
    expect(result).toMatchObject({ ok: false, reason: 'invalid', field: 'name' });
  });

  it('requires an email address', () => {
    expect(validateContact({ ...valid, email: '   ' })).toMatchObject({ ok: false, field: 'email' });
  });

  it.each(['not-an-email', 'a@b', 'a b@c.com', '@company.com', 'sarah@', 'sarah@company.c'])('rejects the malformed email %s', (email) => {
    expect(validateContact({ ...valid, email })).toMatchObject({ ok: false, reason: 'invalid', field: 'email' });
  });

  it.each(['sarah@company.com', 'first.last+tag@sub.example.co.uk', 'x@y.io'])('accepts the email %s', (email) => {
    expect(validateContact({ ...valid, email }).ok).toBe(true);
  });

  it('requires a message with some substance', () => {
    expect(validateContact({ ...valid, message: '' })).toMatchObject({ ok: false, field: 'message' });
    expect(validateContact({ ...valid, message: '   hi   ' })).toMatchObject({ ok: false, field: 'message' });
  });

  it('treats a filled honeypot as spam, even if everything else is valid', () => {
    expect(validateContact({ ...valid, website: 'http://spam.example' })).toEqual({ ok: false, reason: 'spam' });
  });

  it('treats an implausibly fast submission as spam', () => {
    expect(validateContact({ ...valid, elapsedMs: MIN_FILL_TIME_MS - 1 })).toEqual({ ok: false, reason: 'spam' });
    expect(validateContact({ ...valid, elapsedMs: MIN_FILL_TIME_MS }).ok).toBe(true);
  });

  it('skips the timing check when no timing is supplied', () => {
    expect(validateContact({ ...valid, elapsedMs: undefined }).ok).toBe(true);
  });
});
