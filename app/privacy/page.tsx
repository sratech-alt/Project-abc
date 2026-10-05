import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { SiteShell } from '@/components/SiteShell';
import { site } from '@/lib/site';

/** Change this date whenever the text below changes. */
const LAST_UPDATED = '5 October 2026';

const description = `What ${site.name} does with the information you send through this website.`;

export const metadata: Metadata = {
  title: `Privacy — ${site.name}`,
  description,
  alternates: { canonical: '/privacy' },
};

const mailto = (address: string) => <a href={`mailto:${address}`}>{address}</a>;

/*
 * This page describes what the site actually does — keep it true. If a change to the site alters
 * what is collected, stored or shared (analytics, a new form, uploads, a new provider), update this
 * text and LAST_UPDATED in the same change.
 */
export default function PrivacyPage() {
  return (
    <SiteShell>
      <PageHeader eyebrow="Privacy" title="What we do with your information.">
        A plain account of what this website collects and why. Last updated {LAST_UPDATED}.
      </PageHeader>

      <section aria-label="Privacy notice" className="pb-16 sm:pb-20 lg:pb-24">
        <div className="container-page">
          <div className="prose max-w-3xl">
            <h2>Who we are</h2>
            <p>
              This website is run by {site.name}, a software development company based in {site.city}, {site.country}. For anything on this
              page, write to {mailto(site.emails.general)}.
            </p>

            <h2>What we collect</h2>
            <p>We only receive information that you choose to send us.</p>
            <ul>
              <li>
                <strong>The contact form.</strong> Your name, your email address, the project type if you give one, and your message. We use
                them to reply to your enquiry and for nothing else.
              </li>
              <li>
                <strong>Job applications.</strong> Roles on our careers page are applied for by email. We receive whatever you send —
                typically your CV and a note — and use it only to consider you for the role.
              </li>
              <li>
                <strong>Emails and calls.</strong> If you contact us directly, we have what you tell us.
              </li>
            </ul>

            <h2>What we don’t do</h2>
            <ul>
              <li>We don’t use analytics, advertising trackers or tracking cookies on this website.</li>
              <li>We don’t sell or rent your information, or pass it to anyone for marketing.</li>
              <li>We don’t ask you to create an account.</li>
            </ul>

            <h2>Services that handle your information for us</h2>
            <ul>
              <li>
                <strong>EmailJS</strong> delivers contact form messages to our inbox. When you press send, the details you typed are
                transmitted to EmailJS for that purpose.
              </li>
              <li>
                <strong>Netlify</strong> hosts this website. Like any web host, it processes technical details of each request, such as your
                IP address, in order to deliver the pages.
              </li>
            </ul>
            <p>
              After you send the contact form, your browser keeps one small item in its own storage so the form can’t be submitted again
              within a few seconds. It stays on your device and is not used to identify you.
            </p>

            <h2>Links to other sites</h2>
            <p>
              Our pages link to other websites, such as app stores and our social media profiles. Those sites have their own privacy
              practices, which we don’t control.
            </p>

            <h2>Your choices</h2>
            <p>
              You can ask us what information we hold about you, ask us to correct it, or ask us to delete it. Write to{' '}
              {mailto(site.emails.general)} and we will act on it.
            </p>

            <h2>Changes to this page</h2>
            <p>If what we do changes, we will update this page and the date at the top.</p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
