import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { aboutFacts } from '@/lib/data';

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative py-16 sm:py-20 lg:py-24">
      <div className="container-page grid items-start gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <Reveal>
          <SectionHeading id="about-title" eyebrow="About Sabiora" title="One Kathmandu team that owns the whole stack." />
          <div className="mt-6 max-w-xl space-y-5 text-base leading-relaxed text-muted sm:text-lg">
            <p>
              <strong className="font-semibold text-fg">Sabiora Technologies</strong> is a software development company
              based in Kathmandu, Nepal. We turn business requirements into reliable, scalable digital products for
              startups and organizations.
            </p>
            <p>
              Backend, frontend and data layer are built by the same people — with{' '}
              <strong className="font-semibold text-fg">production-grade architecture from day one</strong>, not just
              prototypes.
            </p>
          </div>
        </Reveal>

        {/* Spec sheet: the facts a technical buyer scans for, without the paragraphs. */}
        <Reveal delay={0.1}>
          <div data-spotlight className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-line/80 px-5 py-3 font-mono text-xs text-faint">
              <span>at-a-glance</span>
              <span className="flex items-center gap-1.5 text-ok">
                <span className="size-1.5 rounded-full bg-ok" aria-hidden="true" />
                full-stack
              </span>
            </div>
            <dl className="divide-y divide-line/70">
              {aboutFacts.map((fact) => (
                <div key={fact.label} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 px-5 py-3.5 sm:grid-cols-[7.5rem_minmax(0,1fr)]">
                  <dt className="font-mono text-xs leading-6 tracking-wide text-faint uppercase">{fact.label}</dt>
                  <dd className="text-[0.95rem] leading-6 font-medium text-fg">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
