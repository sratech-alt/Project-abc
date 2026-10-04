import {
  Boxes,
  Check,
  Cloud,
  Container,
  CreditCard,
  FlaskConical,
  GitCommitHorizontal,
  MousePointer2,
  PackageCheck,
  ShoppingCart,
  type LucideIcon,
} from 'lucide-react';
import { Fragment, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import type { ServiceVisual } from '@/lib/data';

/*
 * Decorative illustrations for the services bento grid. They are drawn with markup and CSS
 * (no image files) and are hidden from assistive tech — the card text carries the meaning.
 * Every colour comes from a design token.
 */

/* ---------------------------------------------------------------- shared pieces */

function Node({ icon: Icon, label, active = false }: { icon: LucideIcon; label: string; active?: boolean }) {
  return (
    <div className="relative shrink-0">
      <div
        className={cn(
          'flex size-10 items-center justify-center rounded-xl border bg-panel',
          active
            ? 'border-accent/60 text-accent shadow-[0_0_22px_-6px_var(--color-accent)]'
            : 'border-line-strong text-muted',
        )}
      >
        <Icon className="size-[1.1rem]" />
      </div>
      <span className="absolute top-full left-1/2 mt-1.5 -translate-x-1/2 font-mono text-[0.6875rem] whitespace-nowrap text-faint">
        {label}
      </span>
    </div>
  );
}

function Bar({ className }: { className?: string }) {
  return <span className={cn('block h-1 rounded-full', className)} />;
}

/* ---------------------------------------------------------------- mobile */

function Phone({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        'absolute w-[7.25rem] rounded-[1.35rem] border border-line-strong bg-panel p-1.5 shadow-[0_24px_50px_-24px_var(--color-black)] transition-transform duration-500 ease-out',
        className,
      )}
    >
      <div className="relative h-[13.5rem] overflow-hidden rounded-[1rem] bg-canvas px-2 pb-2">
        <div className="mx-auto mt-1.5 mb-2.5 h-1 w-8 rounded-full bg-line-strong" />
        {children}
      </div>
    </div>
  );
}

function PhonesVisual() {
  return (
    <>
      <div className="glow top-1/2 left-1/2 size-72 -translate-x-1/2 -translate-y-1/2 [--glow-opacity:0.16]" />
      <Phone className="top-6 left-[calc(50%-7.75rem)] -rotate-6 group-hover:-translate-y-1.5 group-hover:-rotate-3">
        <Bar className="h-1.5 w-12 bg-fg/80" />
        <div className="mt-2.5 space-y-1.5">
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex items-center gap-1.5 rounded-md border border-line bg-panel p-1.5">
              <span className="size-4 shrink-0 rounded bg-accent/25" />
              <span className="flex-1 space-y-1">
                <Bar className="w-10 bg-muted/60" />
                <Bar className="w-6 bg-line-strong" />
              </span>
              <span className={cn('h-2 w-4 rounded-full', row === 0 ? 'bg-accent' : 'bg-line-strong')} />
            </div>
          ))}
        </div>
        <div className="mt-2.5 h-5 rounded-md bg-accent" />
      </Phone>
      <Phone className="top-12 left-[calc(50%+0.5rem)] rotate-6 group-hover:-translate-y-2.5 group-hover:rotate-3">
        <Bar className="w-8 bg-line-strong" />
        <Bar className="mt-1.5 h-2.5 w-14 bg-fg/80" />
        <div className="mt-3 flex h-16 items-end gap-1 rounded-md border border-line bg-panel p-1.5">
          {[38, 62, 48, 80, 58, 96, 70].map((height, index) => (
            <span
              key={index}
              className={cn('flex-1 rounded-sm', index === 5 ? 'bg-accent' : 'bg-accent/35')}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <div className="mt-1.5 grid grid-cols-2 gap-1.5">
          <div className="space-y-1 rounded-md border border-line bg-panel p-1.5">
            <Bar className="w-5 bg-line-strong" />
            <Bar className="h-1.5 w-8 bg-ok/80" />
          </div>
          <div className="space-y-1 rounded-md border border-line bg-panel p-1.5">
            <Bar className="w-5 bg-line-strong" />
            <Bar className="h-1.5 w-7 bg-iris-soft/80" />
          </div>
        </div>
      </Phone>
    </>
  );
}

/* ---------------------------------------------------------------- website */

function BrowserVisual() {
  return (
    <>
      <div className="absolute inset-x-4 top-4 bottom-0 overflow-hidden rounded-t-lg border border-b-0 border-line-strong bg-panel transition-transform duration-500 ease-out group-hover:-translate-y-1">
        <div className="flex items-center gap-1 border-b border-line px-2.5 py-2">
          <span className="size-1.5 rounded-full bg-line-strong" />
          <span className="size-1.5 rounded-full bg-line-strong" />
          <span className="size-1.5 rounded-full bg-line-strong" />
          <span className="ml-2 h-3 flex-1 rounded-full bg-canvas" />
        </div>
        <div className="p-3.5">
          <Bar className="h-2 w-2/3 bg-fg/85" />
          <Bar className="mt-1.5 h-2 w-1/2 bg-fg/85" />
          <Bar className="mt-3 w-3/4 bg-line-strong" />
          <Bar className="mt-1.5 w-3/5 bg-line-strong" />
          <div className="mt-3.5 flex gap-1.5">
            <span className="h-4 w-14 rounded-full bg-accent" />
            <span className="h-4 w-14 rounded-full border border-line-strong" />
          </div>
        </div>
      </div>
      {/* The same page on a phone — responsive by default. */}
      <div className="absolute right-7 bottom-0 h-24 w-12 rounded-t-xl border border-b-0 border-accent/60 bg-canvas p-1.5 shadow-[0_0_24px_-8px_var(--color-accent)] transition-transform duration-500 ease-out group-hover:-translate-y-2">
        <Bar className="mx-auto mb-2 w-4 bg-line-strong" />
        <Bar className="w-full bg-fg/80" />
        <Bar className="mt-1 w-2/3 bg-fg/80" />
        <Bar className="mt-2 w-full bg-line-strong" />
        <span className="mt-2 block h-2.5 w-full rounded-full bg-accent" />
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- e-commerce */

function CheckoutVisual() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-9 px-6">
      <div className="flex w-full max-w-xs items-center">
        <Node icon={ShoppingCart} label="Cart" />
        <span className="flow-line flex-1" />
        <Node icon={CreditCard} label="Gateway" active />
        <span className="flow-line flex-1" />
        <Node icon={PackageCheck} label="Order" />
      </div>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-ok/30 bg-ok/10 px-2.5 py-1 font-mono text-xs text-ok">
        <Check className="size-3.5" />
        Payment approved
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------- cloud & devops */

const PIPELINE: { icon: LucideIcon; label: string; active?: boolean }[] = [
  { icon: GitCommitHorizontal, label: 'Commit' },
  { icon: Container, label: 'Docker', active: true },
  { icon: FlaskConical, label: 'Test' },
  { icon: Boxes, label: 'Kubernetes', active: true },
  { icon: Cloud, label: 'Cloud' },
];

function PipelineVisual() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-6">
      <div className="relative flex items-center">
        {PIPELINE.map((step, index) => (
          <Fragment key={step.label}>
            {index > 0 ? <span className="flow-line flex-1" /> : null}
            <Node icon={step.icon} label={step.label} active={step.active} />
          </Fragment>
        ))}
        {/* A release travelling down the pipeline */}
        <span className="pointer-events-none absolute inset-x-5 top-1/2 h-0 animate-travel">
          <span className="absolute top-0 left-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-strong shadow-[0_0_12px_2px_var(--color-accent-strong)]" />
        </span>
      </div>
      <p className="mt-11 flex flex-wrap gap-x-4 gap-y-1 rounded-lg border border-line bg-canvas/80 px-3 py-2 font-mono text-xs text-muted">
        {['tests passed', 'image built', 'rolled out'].map((step) => (
          <span key={step} className="flex items-center gap-1.5">
            <Check className="size-3.5 text-ok" />
            {step}
          </span>
        ))}
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- ui/ux */

function CanvasVisual() {
  return (
    <>
      <div className="absolute top-4 left-4 flex flex-col gap-2 rounded-lg border border-line bg-panel p-1.5">
        <span className="size-3 rounded-full bg-accent" />
        <span className="size-3 rounded-full bg-iris" />
        <span className="size-3 rounded-full bg-ok" />
        <span className="size-3 rounded-full bg-fg" />
      </div>
      <div className="absolute top-4 right-4 bottom-4 left-14 rounded-lg border border-line bg-panel/70 p-3">
        <Bar className="h-1.5 w-1/3 bg-fg/80" />
        <Bar className="mt-1.5 w-1/2 bg-line-strong" />
        {/* The selected frame */}
        <div className="relative mt-4 h-14 rounded-md bg-canvas transition-transform duration-500 ease-out group-hover:translate-x-1.5 group-hover:-translate-y-1">
          <div className="absolute -inset-1 rounded-md border border-accent">
            <span className="absolute -top-1 -left-1 size-1.5 bg-accent" />
            <span className="absolute -top-1 -right-1 size-1.5 bg-accent" />
            <span className="absolute -bottom-1 -left-1 size-1.5 bg-accent" />
            <span className="absolute -right-1 -bottom-1 size-1.5 bg-accent" />
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 rounded bg-accent px-1 font-mono text-[0.625rem] leading-4 font-semibold text-canvas">
              320 × 56
            </span>
          </div>
          <div className="flex h-full items-center gap-2 px-2.5">
            <span className="size-7 rounded-md bg-iris/50" />
            <span className="flex-1 space-y-1.5">
              <Bar className="w-2/3 bg-fg/70" />
              <Bar className="w-1/3 bg-line-strong" />
            </span>
          </div>
        </div>
      </div>
      <div className="absolute right-9 bottom-7 flex items-start transition-transform duration-500 ease-out group-hover:-translate-x-5 group-hover:-translate-y-3">
        <MousePointer2 className="size-4 fill-iris-soft text-iris-soft" />
        <span className="mt-3 rounded-md bg-iris-soft px-1.5 font-mono text-[0.625rem] leading-4 font-semibold text-canvas">
          Designer
        </span>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- api */

const API_NODES = [
  { label: 'REST', x: 19, y: 21 },
  { label: 'GraphQL', x: 81, y: 21 },
  { label: 'Auth', x: 19, y: 79 },
  { label: 'Webhooks', x: 81, y: 79 },
];

function ApiVisual() {
  return (
    <>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
        {API_NODES.map((node) => (
          <line
            key={node.label}
            x1="50"
            y1="50"
            x2={node.x}
            y2={node.y}
            stroke="var(--color-accent)"
            strokeOpacity="0.55"
            strokeWidth="1"
            strokeDasharray="4 4"
            vectorEffect="non-scaling-stroke"
            className="group-hover:animate-dash"
          />
        ))}
      </svg>
      <span className="absolute top-1/2 left-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-accent/60 bg-panel font-mono text-sm font-semibold text-accent shadow-[0_0_30px_-6px_var(--color-accent)] transition-transform duration-500 ease-out group-hover:scale-110">
        API
      </span>
      {API_NODES.map((node) => (
        <span
          key={node.label}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-line-strong bg-panel px-2.5 py-1 font-mono text-[0.6875rem] text-muted"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          {node.label}
        </span>
      ))}
    </>
  );
}

/* ---------------------------------------------------------------- custom software */

function DashboardVisual() {
  return (
    <div className="absolute inset-x-4 top-4 bottom-0 flex overflow-hidden rounded-t-lg border border-b-0 border-line-strong bg-panel transition-transform duration-500 ease-out group-hover:-translate-y-1">
      <div className="flex w-9 flex-col items-center gap-2 border-r border-line py-2.5">
        <span className="size-3.5 rounded bg-accent" />
        <span className="mt-1 size-3.5 rounded bg-accent/25" />
        <span className="size-3.5 rounded bg-line" />
        <span className="size-3.5 rounded bg-line" />
        <span className="size-3.5 rounded bg-line" />
      </div>
      <div className="min-w-0 flex-1 p-2.5">
        <div className="grid grid-cols-3 gap-1.5">
          {['bg-fg/80', 'bg-ok/80', 'bg-iris-soft/80'].map((tone) => (
            <div key={tone} className="space-y-1.5 rounded border border-line bg-canvas p-1.5">
              <Bar className="w-2/3 bg-line-strong" />
              <Bar className={cn('h-1.5 w-1/2', tone)} />
            </div>
          ))}
        </div>
        <div className="mt-2 flex h-16 items-end gap-1 rounded border border-line bg-canvas p-1.5">
          {[42, 66, 50, 78, 60, 92, 72, 86, 64, 98].map((height, index) => (
            <span
              key={index}
              className={cn('flex-1 rounded-sm', index === 9 ? 'bg-accent' : 'bg-accent/35')}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- maintenance */

const MONITORS = [
  { name: 'API', warnAt: 23 },
  { name: 'Web app', warnAt: -1 },
  { name: 'Database', warnAt: -1 },
];
const TICKS = 40;

function UptimeVisual() {
  return (
    <div className="relative p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-2 font-mono text-xs text-faint">
          status.your-product.com
          <span className="rounded border border-line-strong px-1.5 py-0.5 text-[0.6875rem] tracking-wide uppercase">Example</span>
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-ok/30 bg-ok/10 px-2.5 py-1 text-xs font-medium text-ok">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-ok opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-ok" />
          </span>
          All systems operational
        </span>
      </div>
      <div className="mt-5 flex items-end gap-3">
        <span className="text-4xl leading-none font-bold tracking-tight sm:text-5xl">
          99.99<span className="text-accent">%</span>
        </span>
        <span className="pb-0.5 text-sm text-muted">Uptime · last 90 days</span>
      </div>
      <div className="mt-5 space-y-2.5">
        {MONITORS.map((monitor) => (
          <div key={monitor.name} className="flex items-center gap-3">
            <span className="w-[4.5rem] shrink-0 font-mono text-xs text-muted">{monitor.name}</span>
            <span className="flex h-5 min-w-0 flex-1 gap-[3px]">
              {Array.from({ length: TICKS }, (_, tick) => (
                <span
                  key={tick}
                  className={cn('min-w-0 flex-1 rounded-full', tick === monitor.warnAt ? 'bg-warn' : 'bg-ok/75')}
                />
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- entry point */

const VISUALS: Record<ServiceVisual, () => ReactNode> = {
  phones: PhonesVisual,
  browser: BrowserVisual,
  checkout: CheckoutVisual,
  pipeline: PipelineVisual,
  canvas: CanvasVisual,
  api: ApiVisual,
  dashboard: DashboardVisual,
  uptime: UptimeVisual,
};

export function ServiceIllustration({ kind, className }: { kind: ServiceVisual; className?: string }) {
  const Visual = VISUALS[kind];
  return (
    <div
      aria-hidden="true"
      className={cn('relative overflow-hidden rounded-xl border border-line/80 bg-canvas/70', className)}
    >
      <div className="bg-dots absolute inset-0 opacity-40" />
      <Visual />
    </div>
  );
}
