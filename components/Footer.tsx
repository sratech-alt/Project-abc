import { ArrowUp, Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import { FooterWave } from '@/components/FooterWave';
import { SocialIcon } from '@/components/ui/SocialIcon';
import type { PageLink } from '@/lib/content';
import { socials } from '@/lib/data';
import { navLinks, site } from '@/lib/site';

const headingClass = 'font-mono text-xs font-medium tracking-[0.18em] text-fg uppercase';
const linkClass = 'py-1.5 text-[0.95rem] text-muted transition-colors hover:text-accent';

/** `pageLinks`: content pages (Blog, Careers) that currently have something to show. */
export function Footer({ pageLinks = [] }: { pageLinks?: PageLink[] }) {
  const year = new Date().getFullYear();

  return (
    <>
      <FooterWave />
    <footer className="relative bg-raised">
      <div className="container-page py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_1.3fr_0.9fr] lg:gap-12">
          {/* Company */}
          <div>
            <a href="/#top" className="inline-block" aria-label={`${site.name} — home`}>
              <Image src="/images/logo-full.webp" alt={`${site.name} logo`} width={560} height={142} className="h-auto w-48" />
            </a>
            <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-muted">
              A software development company based in Kathmandu, Nepal, helping businesses, startups and organizations
              turn ideas into reliable, scalable digital products.
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer">
            <h2 className={headingClass}>Quick links</h2>
            <ul className="mt-3.5">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a href={`/#${link.id}`} className={`${linkClass} inline-block`}>
                    {link.label}
                  </a>
                </li>
              ))}
              {pageLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={`${linkClass} inline-block`}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h2 className={headingClass}>Contact</h2>
            <ul className="mt-3.5">
              <li>
                <a href={`mailto:${site.emails.sales}`} className={`${linkClass} flex items-start gap-2.5 break-all`}>
                  <Mail className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true" />
                  <span>
                    <span className="sr-only">Sales: </span>
                    {site.emails.sales}
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${site.emails.general}`} className={`${linkClass} flex items-start gap-2.5 break-all`}>
                  <Mail className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true" />
                  <span>
                    <span className="sr-only">General: </span>
                    {site.emails.general}
                  </span>
                </a>
              </li>
              <li>
                <a href={`tel:${site.phone.e164}`} className={`${linkClass} flex items-start gap-2.5`}>
                  <Phone className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true" />
                  <span>
                    <span className="sr-only">Phone: </span>
                    {site.phone.display}
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-2.5 py-1.5 text-[0.95rem] text-muted">
                <MapPin className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true" />
                {site.address}
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h2 className={headingClass}>Connect</h2>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {socials.map((social) => (
                <li key={social.url}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${site.shortName} on ${social.name} (opens in a new tab)`}
                    className="flex size-11 items-center justify-center rounded-full border border-line-strong/80 bg-panel/60 text-muted transition-colors hover:border-accent/60 hover:text-accent"
                  >
                    <SocialIcon icon={social.icon} className="size-[1.05rem]" />
                  </a>
                </li>
              ))}
            </ul>
            <a href="#top" className={`${linkClass} mt-4 inline-flex items-center gap-2`}>
              <ArrowUp className="size-4" aria-hidden="true" />
              Back to top
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line/70 pt-6 text-sm text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="font-mono text-xs">Designed &amp; engineered in {site.address.replace(/\s\d+$/, '')}</p>
        </div>
      </div>
    </footer>
    </>
  );
}
