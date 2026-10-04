'use client';

import { useEffect } from 'react';

/**
 * One document-level listener that feeds the cursor position to whichever `[data-spotlight]`
 * card is under the pointer (read by `.card::before` in globals.css). Mounted once in the layout,
 * so the cards themselves can stay server components.
 */
export function SpotlightTracker() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const onMove = (event: PointerEvent) => {
      const card = (event.target as Element | null)?.closest<HTMLElement>('[data-spotlight]');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    return () => document.removeEventListener('pointermove', onMove);
  }, []);

  return null;
}
