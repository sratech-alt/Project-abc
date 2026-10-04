'use client';

import { AnimatePresence, m } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import { navLinks, site } from '@/lib/site';

function StatusDot() {
  return (
    <span className="relative flex size-2 shrink-0" aria-hidden="true">
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
      <span className="relative inline-flex size-2 rounded-full bg-accent" />
    </span>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');

  // Solid backing once the page has moved.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy: whichever section crosses the middle of the viewport is "current".
  // The hero (#top) is observed too, so scrolling back up clears the highlight.
  useEffect(() => {
    const ids = ['top', ...navLinks.map((link) => link.id)];
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Mobile menu: lock page scroll, close on Escape and when the layout switches to desktop.
  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia('(min-width: 1024px)');
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
  }, [open]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300',
        scrolled || open ? 'border-line/70 bg-canvas/80 backdrop-blur-xl' : 'border-transparent',
      )}
    >
      <div className="container-page flex h-16 items-center gap-4 lg:h-[4.5rem]">
        {/* Left: logo + availability */}
        <div className="flex shrink-0 items-center lg:flex-1">
          <a href="#top" className="flex items-center gap-3" aria-label={`${site.name} — back to top`}>
            <Image src="/images/logo-mark.webp" alt="" width={126} height={160} priority className="h-9 w-auto" />
            <span className="flex flex-col leading-tight">
              <span className="text-[1.05rem] font-bold tracking-tight whitespace-nowrap">
                Sabiora <span className="font-semibold text-muted">Technologies</span>
              </span>
              {site.availability ? (
                <span className="mt-0.5 hidden items-center gap-1.5 font-mono text-xs whitespace-nowrap text-muted xl:flex">
                  <StatusDot />
                  {site.availability}
                </span>
              ) : null}
            </span>
          </a>
        </div>

        {/* Centre: floating pill */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-0.5 rounded-full border border-line/80 bg-panel/60 p-1 backdrop-blur-md">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={active === link.id ? 'true' : undefined}
                  className={cn(
                    'block rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200',
                    active === link.id ? 'bg-fg/10 text-fg' : 'text-muted hover:text-fg',
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right: CTA + mobile toggle */}
        <div className="flex flex-1 items-center justify-end gap-2">
          <a href="#contact" className="btn btn-primary hidden h-10 px-4 text-sm sm:inline-flex">
            Book a Discovery Call
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-line-strong/70 bg-panel/60 text-fg lg:hidden"
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
            className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line/70 bg-canvas/90 lg:hidden"
          >
            <nav
              aria-label="Mobile"
              className="container-page flex flex-col pt-2 pb-8"
            >
              <ul>
                {navLinks.map((link) => (
                  <li key={link.id} className="border-b border-line/60">
                    <a
                      href={`#${link.id}`}
                      onClick={() => setOpen(false)}
                      aria-current={active === link.id ? 'true' : undefined}
                      className={cn(
                        'flex items-center justify-between py-4 text-lg font-semibold',
                        active === link.id ? 'text-accent' : 'text-fg',
                      )}
                    >
                      {link.label}
                      <ArrowUpRight className="size-4 text-faint" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
              {site.availability ? (
                <p className="mt-5 flex items-center gap-2 font-mono text-xs text-muted">
                  <StatusDot />
                  {site.availability}
                </p>
              ) : null}
              <a href="#contact" onClick={() => setOpen(false)} className="btn btn-primary mt-5 h-12 px-6 text-base">
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
