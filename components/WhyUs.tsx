import { Braces, Handshake, RefreshCw, Target, TrendingUp, type LucideIcon } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/cn';
import { reasons, type Reason } from '@/lib/data';

const ICONS: Record<Reason['icon'], LucideIcon> = {
  target: Target,
  braces: Braces,
  trending: TrendingUp,
  refresh: RefreshCw,
  handshake: Handshake,
};

/**
 * Column spans for a 6-column desktop grid: rows of three, and a final row of two shared equally.
 * On tablets (2 columns) a trailing odd card takes the full row.
 */
function spanFor(index: number, total: number): string {
  const inLastRowOfTwo = total % 3 === 2 && index >= total - 2;
  const loneOnTablet = total % 2 === 1 && index === total - 1;
  return cn(inLastRowOfTwo ? 'lg:col-span-3' : 'lg:col-span-2', loneOnTablet && 'sm:col-span-2');
}

export function WhyUs() {
  return (
    <section id="why-us" aria-labelledby="why-us-title" className="relative py-16 sm:py-20 lg:py-24">
      <div className="container-page">
        <Reveal>
          <SectionHeading id="why-us-title" eyebrow="Why Sabiora" title="Technical depth, with a business-first mindset." align="center">
            Five reasons teams choose to build — and keep building — with us.
          </SectionHeading>
        </Reveal>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-6">
          {reasons.map((reason, index) => {
            const Icon = ICONS[reason.icon];
            return (
              <li key={reason.id} className={spanFor(index, reasons.length)}>
                <Reveal delay={(index % 3) * 0.06} className="h-full">
                  <article data-spotlight className="card flex h-full flex-col p-6 sm:p-7">
                    <div className="flex items-center justify-between">
                      <span className="flex size-11 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="font-mono text-sm text-faint" aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg leading-snug font-semibold tracking-tight">{reason.title}</h3>
                    <p className="mt-2.5 text-[0.95rem] leading-relaxed text-muted">{reason.body}</p>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
