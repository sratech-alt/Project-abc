'use client';

import { AnimatePresence, m } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/cn';
import type { PageLink } from '@/lib/content';
import { navLinks, site } from '@/lib/site';

function StatusDot() {
  return (
    <span className="relative flex size-2 shrink-0" aria-hidden="true">
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
      <span className="relative inline-flex size-2 rounded-full bg-accent" />
    </span>
  );
}

type NavItem = { key: string; href: string; label: string; sectionId?: string };

/**
 * `pageLinks` are the content pages that currently have something to show (Blog, Careers).
 * `availability` is the status line beside the logo (empty hides it).
 * Section links are written as `/#section` so they work from every page; on the home page the
 * browser treats them as an ordinary in-page jump.
 */
export function Navbar({ pageLinks = [], availability = '' }: { pageLinks?: PageLink[]; availability?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Sections first, then content pages, with Contact kept last.
  const items = useMemo<NavItem[]>(() => {
    const sections = navLinks.map((link) => ({ key: link.id, href: `/#${link.id}`, label: link.label, sectionId: link.id }));
    const pages = pageLinks.map((link) => ({ key: link.href, href: link.href, label: link.label }));
    const contact = sections.filter((item) => item.sectionId === 'contact');
    return [...sections.filter((item) => item.sectionId !== 'contact'), ...pages, ...contact];
  }, [pageLinks]);

  // With the extra page links the pill needs more room, so the desktop layout starts later.
  const wide = pageLinks.length > 0;
  const desktopQuery = wide ? '(min-width: 1280px)' : '(min-width: 1024px)';

  const isActive = (item: NavItem) =>
    item.sectionId ? pathname === '/' && activeSection === item.sectionId : pathname === item.href || pathname.startsWith(`${item.href}/`);

  // Solid backing once the page has moved.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy (home page): whichever section crosses the middle of the viewport is "current".
  // The hero (#top) is observed too, so scrolling back up clears the highlight.
  useEffect(() => {
    const ids = ['top', ...navLinks.map((link) => link.id)];
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  // Mobile menu: lock page scroll, close on Escape and when the layout switches to desktop.
  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia(desktopQuery);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const onDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    // The page behind the menu is covered, so keep keyboard focus and screen readers out of it.
    const background = [document.getElementById('main'), document.querySelector('footer')];
    background.forEach((element) => element?.setAttribute('inert', ''));
    document.documentElement.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    desktop.addEventListener('change', onDesktop);
    return () => {
      background.forEach((element) => element?.removeAttribute('inert'));
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      desktop.removeEventListener('change', onDesktop);
    };
  }, [open, desktopQuery]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300',
        scrolled || open ? 'border-line/70 bg-canvas/80 backdrop-blur-xl' : 'border-transparent',
      )}
    >
      <div className="container-page flex h-16 items-center gap-4 lg:h-[4.5rem]">
        {/* Left: logo + availability */}
        <div className={cn('flex shrink-0 items-center', wide ? 'xl:flex-1' : 'lg:flex-1')}>
          <a href="/#top" className="flex items-center gap-3" aria-label={`${site.name} — home`}>
            <Image src="/images/logo-mark.webp" alt="" width={126} height={160} priority className="h-9 w-auto" />
            <span className="flex flex-col leading-tight">
              <span className="text-[1.05rem] font-bold tracking-tight whitespace-nowrap">
                Sabiora <span className="font-semibold text-muted">Technologies</span>
              </span>
              {availability ? (
                <span
                  className={cn(
                    'mt-0.5 hidden items-center gap-1.5 font-mono text-xs whitespace-nowrap text-muted',
                    wide ? 'min-[1440px]:flex' : 'xl:flex',
                  )}
                >
                  <StatusDot />
                  {availability}
                </span>
              ) : null}
            </span>
          </a>
        </div>

        {/* Centre: floating pill */}
        <nav aria-label="Primary" className={cn('hidden', wide ? 'xl:block' : 'lg:block')}>
          <ul className="flex items-center gap-0.5 rounded-full border border-line/80 bg-panel/60 p-1 backdrop-blur-md">
            {items.map((item) => (
              <li key={item.key}>
                <a
                  href={item.href}
                  aria-current={isActive(item) ? (item.sectionId ? 'true' : 'page') : undefined}
                  className={cn(
                    'block rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors duration-200',
                    isActive(item) ? 'bg-fg/10 text-fg' : 'text-muted hover:text-fg',
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right: CTA + mobile toggle */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <a href="/#contact" className="btn btn-primary hidden h-10 px-4 text-sm sm:inline-flex">
            Book a Discovery Call
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
          <button
            type="button"
            className={cn(
              'inline-flex size-10 items-center justify-center rounded-full border border-line-strong/70 bg-panel/60 text-fg',
              wide ? 'xl:hidden' : 'lg:hidden',
            )}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <m.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line/70 bg-canvas/90',
              wide ? 'xl:hidden' : 'lg:hidden',
            )}
          >
            <nav aria-label="Mobile" className="container-page flex flex-col pt-2 pb-8">
              <ul>
                {items.map((item) => (
                  <li key={item.key} className="border-b border-line/60">
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive(item) ? (item.sectionId ? 'true' : 'page') : undefined}
                      className={cn(
                        'flex items-center justify-between py-4 text-lg font-semibold',
                        isActive(item) ? 'text-accent' : 'text-fg',
                      )}
                    >
                      {item.label}
                      <ArrowUpRight className="size-4 text-faint" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
              {availability ? (
                <p className="mt-5 flex items-center gap-2 font-mono text-xs text-muted">
                  <StatusDot />
                  {availability}
                </p>
              ) : null}
              <a href="/#contact" onClick={() => setOpen(false)} className="btn btn-primary mt-5 h-12 px-6 text-base">
                Book a Discovery Call
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </nav>
          </m.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
