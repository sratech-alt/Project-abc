'use client';

import { useMemo, useState } from 'react';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/cn';
import type { StackCategory } from '@/lib/data';

function Monogram({ abbr, active = true }: { abbr: string; active?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex size-9 shrink-0 items-center justify-center rounded-lg border font-mono text-xs font-semibold transition-colors duration-300',
        active ? 'border-accent/40 bg-accent/10 text-accent' : 'border-line-strong/70 bg-canvas/60 text-faint',
      )}
    >
      {abbr}
    </span>
  );
}

export function TechStack({ stack }: { stack: StackCategory[] }) {
  const allTechs = useMemo(() => stack.flatMap((category) => category.techs.map((tech) => ({ ...tech, categoryId: category.id }))), [stack]);
  const [activeId, setActiveId] = useState(stack[0].id);
  const active = stack.find((category) => category.id === activeId) ?? stack[0];

  return (
    <section id="stack" aria-labelledby="stack-title" className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="container-page">
        <Reveal>
          <SectionHeading id="stack-title" eyebrow="Tech Stack" title="Chosen for production, not for demos." align="center">
            The tools we reach for across backend, frontend, data and delivery.
          </SectionHeading>
        </Reveal>
      </div>

      {/* Infinite ticker. The list is rendered twice so the loop is seamless; the copy is hidden from screen readers. */}
      <div className="marquee-mask mt-12 overflow-hidden">
        <ul className="marquee-track flex w-max animate-marquee hover:[animation-play-state:paused]" aria-label="Technologies we work with">
          {[0, 1].map((copy) =>
            allTechs.map((tech) => (
              <li
                key={`${copy}-${tech.name}`}
                aria-hidden={copy === 1 ? 'true' : undefined}
                className="mr-3 flex items-center gap-2.5 rounded-full border border-line/90 bg-panel/60 py-1.5 pr-4 pl-1.5 text-sm font-medium whitespace-nowrap text-fg"
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-accent/10 font-mono text-[0.6875rem] font-semibold text-accent" aria-hidden="true">
                  {tech.abbr}
                </span>
                {tech.name}
              </li>
            )),
          )}
        </ul>
      </div>

      <div className="container-page mt-12">
        <Reveal>
          <div data-spotlight className="card p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              {/* Category selector */}
              <div role="group" aria-label="Filter technologies by layer" className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
                {stack.map((category) => {
                  const selected = category.id === active.id;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setActiveId(category.id)}
                      className={cn(
                        'shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200',
                        selected
                          ? 'border-accent/60 bg-accent/10 text-accent shadow-[0_0_24px_-10px_var(--color-accent)]'
                          : 'border-line-strong/70 text-muted hover:border-line-strong hover:text-fg',
                      )}
                    >
                      {category.label}
                    </button>
                  );
                })}
              </div>
              <p aria-live="polite" className="max-w-md text-[0.95rem] leading-relaxed text-muted lg:text-right">
                {active.summary}
              </p>
            </div>

            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {allTechs.map((tech) => {
                const lit = tech.categoryId === active.id;
                return (
                  <li
                    key={tech.name}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border p-3 transition-[border-color,background-color,box-shadow] duration-300',
                      // Phones show only the selected layer; larger screens show everything and light it up.
                      lit
                        ? 'border-accent/45 bg-accent/[0.06] shadow-[0_14px_40px_-24px_var(--color-accent)]'
                        : 'border-line/80 bg-canvas/40 max-sm:hidden',
                    )}
                  >
                    <Monogram abbr={tech.abbr} active={lit} />
                    <span className="min-w-0">
                      <span className={cn('block text-sm leading-snug font-semibold transition-colors duration-300', lit ? 'text-fg' : 'text-muted')}>
                        {tech.name}
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-faint">{tech.use}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
