'use client';

import { GitBranch } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/cn';
import { codeSamples } from '@/lib/code-samples';
import { highlight, type TokenType } from '@/lib/highlight';

const TOKEN_CLASS: Record<TokenType, string> = {
  plain: 'text-syn-plain',
  punct: 'text-syn-punct',
  comment: 'text-syn-comment italic',
  keyword: 'text-syn-keyword',
  string: 'text-syn-string',
  type: 'text-syn-type',
  func: 'text-syn-func',
  anno: 'text-syn-anno',
  number: 'text-syn-number',
  key: 'text-syn-key',
};

const AUTO_ADVANCE_MS = 7000;
// The window is as tall as the longest sample, so switching tabs never changes its height.
const MAX_LINES = Math.max(...codeSamples.map((sample) => sample.code.split('\n').length));
const LINE_HEIGHT_EM = 1.7;

/** The hero's code window: three tabbed, syntax-highlighted files that show the stack end to end. */
export function CodeTerminal() {
  const [activeId, setActiveId] = useState(codeSamples[0].id);
  // Tabs rotate on their own until the visitor touches the window.
  const [autoplay, setAutoplay] = useState(true);

  const active = codeSamples.find((sample) => sample.id === activeId) ?? codeSamples[0];
  const lines = useMemo(() => highlight(active.code, active.lang), [active]);

  useEffect(() => {
    if (!autoplay) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      setActiveId((current) => {
        const index = codeSamples.findIndex((sample) => sample.id === current);
        return codeSamples[(index + 1) % codeSamples.length].id;
      });
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [autoplay]);

  const select = (id: string) => {
    setAutoplay(false);
    setActiveId(id);
  };

  const onTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const step = event.key === 'ArrowRight' ? 1 : -1;
    const next = codeSamples[(index + step + codeSamples.length) % codeSamples.length];
    select(next.id);
    document.getElementById(`code-tab-${next.id}`)?.focus();
  };

  return (
    <div
      className="relative"
      // Anyone reading or operating the window stops the rotation for good.
      onPointerEnter={() => setAutoplay(false)}
      onPointerDown={() => setAutoplay(false)}
      onFocusCapture={() => setAutoplay(false)}
    >
      {/* Ambient glow behind the window */}
      <div
        aria-hidden="true"
        className="glow -inset-x-10 -top-10 -bottom-16 [--glow-color:var(--color-iris)] [--glow-opacity:0.22]"
      />

      <div className="relative overflow-hidden rounded-2xl border border-line-strong/70 bg-raised/90 shadow-[0_30px_90px_-40px_var(--color-accent)]">
        {/* Title bar */}
        <div className="flex items-center gap-3 border-b border-line/80 px-4 py-3">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="size-3 rounded-full bg-dot-red" />
            <span className="size-3 rounded-full bg-dot-yellow" />
            <span className="size-3 rounded-full bg-dot-green" />
          </div>
          <p className="min-w-0 flex-1 truncate text-center font-mono text-xs text-faint">sabiora/platform — {active.file}</p>
          <span className="w-12" aria-hidden="true" />
        </div>

        {/* Tabs */}
        <div role="tablist" aria-label="Example files" className="flex overflow-x-auto border-b border-line/80 bg-canvas/40">
          {codeSamples.map((sample, index) => {
            const selected = sample.id === active.id;
            return (
              <button
                key={sample.id}
                id={`code-tab-${sample.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="code-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => select(sample.id)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
                className={cn(
                  'relative shrink-0 border-r border-line/80 px-4 py-2.5 font-mono text-xs transition-colors',
                  selected ? 'bg-raised text-fg' : 'text-faint hover:text-muted',
                )}
              >
                {sample.file}
                {selected ? <span className="absolute inset-x-0 top-0 h-px bg-accent" aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>

        {/* Code */}
        <div
          id="code-panel"
          role="tabpanel"
          aria-labelledby={`code-tab-${active.id}`}
          tabIndex={0}
          className="overflow-x-auto py-4"
        >
          <pre
            className="w-max min-w-full font-mono text-[0.78rem] sm:text-[0.8125rem]"
            style={{ lineHeight: LINE_HEIGHT_EM, minHeight: `${MAX_LINES * LINE_HEIGHT_EM}em` }}
          >
            <code key={active.id}>
              {lines.map((tokens, lineIndex) => (
                <span
                  key={lineIndex}
                  className="flex animate-code-in pr-5"
                  style={{ animationDelay: `${Math.min(lineIndex * 22, 400)}ms` }}
                >
                  <span className="w-11 shrink-0 pr-4 text-right text-faint/60 select-none" aria-hidden="true">
                    {lineIndex + 1}
                  </span>
                  <span className="whitespace-pre">
                    {tokens.length === 0
                      ? ' '
                      : tokens.map((token, tokenIndex) => (
                          <span key={tokenIndex} className={TOKEN_CLASS[token.type]}>
                            {token.text}
                          </span>
                        ))}
                    {lineIndex === lines.length - 1 ? (
                      <span className="ml-0.5 inline-block h-[1.05em] w-[0.5em] translate-y-[0.2em] animate-blink bg-accent" aria-hidden="true" />
                    ) : null}
                  </span>
                </span>
              ))}
            </code>
          </pre>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between gap-4 border-t border-line/80 bg-canvas/40 px-4 py-2 font-mono text-xs text-faint">
          <span className="flex items-center gap-1.5">
            <GitBranch className="size-3.5" aria-hidden="true" />
            main
          </span>
          <span className="flex items-center gap-4">
            <span className="hidden sm:inline">UTF-8</span>
            <span>{active.language}</span>
            <span className="flex items-center gap-1.5 text-ok">
              <span className="size-1.5 rounded-full bg-ok" aria-hidden="true" />
              ready
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
