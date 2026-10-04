import { ArrowRight, MapPin } from 'lucide-react';
import { CodeTerminal } from '@/components/CodeTerminal';
import { metrics } from '@/lib/data';

/**
 * Hero. The entrance uses CSS keyframes rather than Framer Motion so it never waits on JavaScript.
 * The headline and intro only slide (`animate-rise`); they are never invisible, so the main content
 * is on screen at first paint.
 */
export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden pt-28 pb-10 sm:pt-36 lg:pt-40 lg:pb-12">
      {/* Background: dot grid fading out, plus two ambient glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-dots absolute inset-0 [mask-image:radial-gradient(ellipse_85%_75%_at_50%_0%,black_25%,transparent_78%)]" />
        <div className="glow -top-56 -left-40 size-[44rem] [--glow-opacity:0.13]" />
        <div className="glow -top-24 -right-56 size-[48rem] [--glow-color:var(--color-iris)] [--glow-opacity:0.16]" />
      </div>

      <div className="container-page grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)] lg:gap-10 xl:gap-16">
        <div className="max-w-2xl">
          <p className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-accent/30 bg-accent/10 py-1.5 pr-4 pl-3 text-xs font-medium text-accent shadow-[0_0_28px_-10px_var(--color-accent)] sm:text-sm">
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            <span className="sm:hidden">Software Studio in Kathmandu, Nepal</span>
            <span className="hidden sm:inline">Software Development Studio in Kathmandu, Nepal</span>
          </p>

          <h1
            id="hero-title"
            className="mt-6 animate-rise text-[clamp(2rem,9.4vw,2.6rem)] leading-[1.06] font-extrabold tracking-[-0.035em] [animation-delay:80ms] sm:text-6xl lg:text-[3.1rem] xl:text-[4rem]"
          >
            Engineering <span className="whitespace-nowrap">High-Performance</span> Digital Products <span className="text-gradient">That Scale.</span>
          </h1>

          <p className="mt-6 max-w-xl animate-rise text-base leading-relaxed text-muted [animation-delay:80ms] sm:text-lg">
            We design, build and run full-stack web apps, mobile apps and custom software — one team covering system
            architecture, UI/UX, production deployment and scaling.
          </p>

          <div className="mt-9 flex animate-fade-up flex-col gap-3 [animation-delay:240ms] sm:flex-row">
            <a href="#contact" className="btn btn-primary h-13 px-7 text-base">
              Start Your Project
              <ArrowRight className="size-5" aria-hidden="true" />
            </a>
            <a href="#stack" className="btn btn-glass h-13 px-7 text-base">
              View Our Stack &amp; Work
            </a>
          </div>
        </div>

        <div className="min-w-0 animate-fade-up [animation-delay:320ms]">
          <CodeTerminal />
        </div>
      </div>

      {/* Metrics bar: the 1px grid gap over a line-coloured background draws the dividers. */}
      <div className="container-page mt-14 animate-fade-up [animation-delay:400ms] lg:mt-20">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line/90 bg-line/90 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="flex min-w-0 flex-col-reverse bg-raised/90 px-4 py-5 sm:px-6 sm:py-6">
              <dt className="mt-1.5 text-sm leading-snug text-muted">{metric.label}</dt>
              <dd className="text-xl font-bold tracking-tight sm:text-2xl lg:text-[1.75rem]">{metric.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
