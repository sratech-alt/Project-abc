'use client';

import { ArrowUpRight, CircleAlert, CircleCheck, LoaderCircle, Mail, MapPin, Phone, Send, type LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/cn';
import { emailjsConfig, site } from '@/lib/site';
import { validateContact, type ContactField } from '@/lib/validation';

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'success' } | { kind: 'error'; message: string };

const FALLBACK = `Please try again, or email us directly at ${site.emails.sales}.`;

const inputClass =
  'w-full rounded-xl border border-line-strong/80 bg-canvas/70 px-4 py-3 text-base text-fg placeholder:text-faint transition-colors duration-200 hover:border-line-strong focus:border-accent aria-invalid:border-err';

/** An address that, if it has to wrap on a narrow phone, wraps after the @ instead of mid-word. */
function Email({ address }: { address: string }) {
  const [user, domain] = address.split('@');
  return (
    <>
      {user}@<wbr />
      {domain}
    </>
  );
}

function ContactRow({ icon: Icon, label, href, children }: { icon: LucideIcon; label: string; href?: string; children: ReactNode }) {
  const body = (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent sm:size-11">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-xs tracking-wider text-faint uppercase">{label}</span>
        <span className="block text-[clamp(0.78rem,3.6vw,0.95rem)] leading-snug font-semibold [overflow-wrap:anywhere] text-fg">
          {children}
        </span>
      </span>
      {href ? (
        <ArrowUpRight className="hidden size-4 shrink-0 text-faint transition-colors group-hover:text-accent sm:block" aria-hidden="true" />
      ) : null}
    </>
  );
  const rowClass = 'flex items-center gap-3 rounded-2xl border border-line-strong/70 bg-canvas/50 p-3 sm:gap-4 sm:p-3.5';

  return (
    <li>
      {href ? (
        <a href={href} className={cn(rowClass, 'group transition-colors hover:border-accent/60')}>
          {body}
        </a>
      ) : (
        <div className={rowClass}>{body}</div>
      )}
    </li>
  );
}

function Field({
  id,
  label,
  required = false,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-fg">
        {label}
        {required ? (
          <span className="text-accent" aria-hidden="true">
            {' '}
            *
          </span>
        ) : (
          <span className="font-normal text-faint"> (optional)</span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-2 flex items-center gap-1.5 text-sm text-err">
          <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function Contact() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [fieldError, setFieldError] = useState<{ field: ContactField; message: string } | null>(null);
  const shownAt = useRef(0);

  useEffect(() => {
    shownAt.current = Date.now();
  }, []);

  const errorFor = (field: ContactField) => (fieldError?.field === field ? fieldError.message : undefined);
  const invalidProps = (field: ContactField, id: string) =>
    fieldError?.field === field ? { 'aria-invalid': true as const, 'aria-describedby': `${id}-error` } : {};

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const text = (name: string) => String(values.get(name) ?? '');

    const result = validateContact({
      name: text('name'),
      email: text('email'),
      subject: text('subject'),
      message: text('message'),
      website: text('company_site'),
      elapsedMs: Date.now() - shownAt.current,
    });

    if (!result.ok) {
      if (result.reason === 'spam') {
        // Never fail silently: a real person caught by a spam check still gets a way through.
        setFieldError(null);
        setStatus({ kind: 'error', message: `We couldn’t send that. ${FALLBACK}` });
        return;
      }
      setStatus({ kind: 'idle' });
      setFieldError({ field: result.field, message: result.message });
      form.querySelector<HTMLElement>(`[name="${result.field}"]`)?.focus();
      return;
    }

    setFieldError(null);
    setStatus({ kind: 'sending' });

    try {
      // Loaded on demand so the SDK isn't part of the initial page download.
      const { default: emailjs } = await import('@emailjs/browser');
      await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        {
          name: result.data.name,
          email: result.data.email,
          title: result.data.subject,
          message: result.data.message,
          time: new Date().toLocaleString(),
        },
        {
          publicKey: emailjsConfig.publicKey,
          blockHeadless: true,
          limitRate: { id: 'contact-form', throttle: 10_000 },
        },
      );
      form.reset();
      shownAt.current = Date.now();
      setStatus({ kind: 'success' });
    } catch (error) {
      console.error('EmailJS error:', error);
      setStatus({ kind: 'error', message: `Your message didn’t go through. ${FALLBACK}` });
    }
  }

  const sending = status.kind === 'sending';

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative pt-16 pb-10 sm:pt-20 sm:pb-12 lg:pt-24 lg:pb-14">
      <div className="container-page">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-3xl border border-line-strong/70 bg-linear-to-br from-panel via-raised to-canvas p-4 sm:p-10 lg:p-14">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
              <div className="bg-dots absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_70%_80%_at_0%_0%,black,transparent_70%)]" />
              <div className="glow -top-48 -left-40 size-[40rem] [--glow-opacity:0.16]" />
              <div className="glow -right-48 -bottom-56 size-[44rem] [--glow-color:var(--color-iris)] [--glow-opacity:0.2]" />
            </div>

            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
              {/* CTA */}
              <div className="px-1 pt-3 sm:p-0 lg:py-4">
                <p className="eyebrow">Get in touch</p>
                <h2 id="contact-title" className="mt-4 text-3xl leading-[1.1] font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  Ready to Build Something <span className="text-gradient">Extraordinary?</span>
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg">
                  Have an idea, a business problem, or an existing system that needs improving? Tell us about it and let’s talk about how
                  technology can help your business grow.
                </p>

                <ul className="mt-8 space-y-3">
                  <ContactRow icon={Mail} label="Sales inquiries" href={`mailto:${site.emails.sales}`}>
                    <Email address={site.emails.sales} />
                  </ContactRow>
                  <ContactRow icon={Mail} label="General contact" href={`mailto:${site.emails.general}`}>
                    <Email address={site.emails.general} />
                  </ContactRow>
                  <ContactRow icon={Phone} label="Phone" href={`tel:${site.phone.e164}`}>
                    {site.phone.display}
                  </ContactRow>
                  <ContactRow icon={MapPin} label="Office">
                    {site.address}
                  </ContactRow>
                </ul>
              </div>

              {/* Form */}
              <form
                onSubmit={onSubmit}
                noValidate
                aria-label="Project enquiry"
                className="rounded-2xl border border-line-strong/70 bg-canvas/70 p-4 sm:p-7"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="contact-name" label="Your name" required error={errorFor('name')}>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      className={inputClass}
                      {...invalidProps('name', 'contact-name')}
                    />
                  </Field>
                  <Field id="contact-email" label="Email address" required error={errorFor('email')}>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      required
                      placeholder="sarah@company.com"
                      className={inputClass}
                      {...invalidProps('email', 'contact-email')}
                    />
                  </Field>
                </div>

                <div className="mt-5">
                  <Field id="contact-subject" label="Project type">
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      autoComplete="off"
                      placeholder="e.g. Mobile app, web app"
                      className={inputClass}
                    />
                  </Field>
                </div>

                <div className="mt-5">
                  <Field id="contact-message" label="Project overview" required error={errorFor('message')}>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      required
                      placeholder="Tell us about your idea, business problem, or existing system…"
                      className={cn(inputClass, 'min-h-32 resize-y')}
                      {...invalidProps('message', 'contact-message')}
                    />
                  </Field>
                </div>

                {/* Honeypot: invisible to people and skipped by the keyboard, tempting to bots. */}
                <div className="absolute -left-[9999px] size-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="contact-company-site">Leave this field empty</label>
                  <input id="contact-company-site" name="company_site" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="btn btn-primary mt-6 h-13 w-full px-7 text-base disabled:cursor-wait disabled:opacity-70"
                >
                  {sending ? (
                    <>
                      <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="size-4" aria-hidden="true" />
                    </>
                  )}
                </button>

                {/* Result message: right under the button, and announced to screen readers. */}
                <div role="status" aria-live="polite">
                  {status.kind === 'success' ? (
                    <p className="mt-4 flex items-start gap-2.5 rounded-xl border border-ok/30 bg-ok/10 p-3.5 text-sm leading-relaxed text-ok">
                      <CircleCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                      Thank you — your message has been sent. We’ll get back to you shortly.
                    </p>
                  ) : null}
                  {status.kind === 'error' ? (
                    <p className="mt-4 flex items-start gap-2.5 rounded-xl border border-err/30 bg-err/10 p-3.5 text-sm leading-relaxed text-err">
                      <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                      {status.message}
                    </p>
                  ) : null}
                </div>

                <p className="mt-4 text-sm leading-relaxed text-faint">
                  We use these details only to reply to your enquiry. See our{' '}
                  <a
                    href="/privacy"
                    className="font-medium text-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent"
                  >
                    privacy page
                  </a>
                  .
                </p>
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
