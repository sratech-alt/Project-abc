'use client';

import { m } from 'framer-motion';
import type { ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before animating — use for staggering siblings. */
  delay?: number;
};

/**
 * Scroll reveal: fades and lifts its children in once, the first time they enter the viewport.
 * `data-reveal` lets the <noscript> rule in app/layout.tsx show the content when JS is off.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <m.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -72px 0px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </m.div>
  );
}
