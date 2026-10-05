import {
  Activity,
  ArrowUpRight,
  Cloud,
  Globe,
  LayoutDashboard,
  Palette,
  ShoppingCart,
  Smartphone,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import { ServiceIllustration } from '@/components/services/visuals';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/cn';
import type { Service, ServiceVisual } from '@/lib/data';

const ICONS: Record<ServiceVisual, LucideIcon> = {
  phones: Smartphone,
  browser: Globe,
  checkout: ShoppingCart,
  pipeline: Cloud,
  canvas: Palette,
  api: Workflow,
  dashboard: LayoutDashboard,
  uptime: Activity,
};

/**
 * On tablets the grid has two columns. A single-column card with no single-column neighbour
 * would leave a hole, so it is stretched to the full row. Works for any order of `services`.
 */
function tabletFullWidth(list: Service[]): boolean[] {
  let column = 0;
  return list.map((service, index) => {
    if (service.span > 1) {
      column = 0;
      return true;
    }
    const next = list[index + 1];
    if (column === 0 && (!next || next.span > 1)) return true;
    column = (column + 1) % 2;
    return false;
  });
}

function ServiceCard({ service }: { service: Service }) {
  const Icon = ICONS[service.visual];
  const wide = service.span === 2;
  const full = service.span === 3;

  return (
    <article
      id={`service-${service.id}`}
      data-spotlight
      className={cn(
        'card group flex h-full scroll-mt-28 flex-col gap-5 overflow-hidden p-4 sm:p-5',
        wide && 'sm:grid sm:grid-cols-2 sm:gap-6',
        full && 'lg:grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-8',
      )}
    >
      <ServiceIllustration
        kind={service.visual}
        className={cn(service.span === 1 && 'h-44', wide && 'h-56 sm:order-2 sm:h-auto sm:min-h-60', full && 'lg:order-2')}
      />

      <div className={cn('flex flex-col px-1 pb-1', (wide || full) && 'sm:justify-center sm:py-2 sm:pl-2')}>
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-accent/25 bg-accent/10 text-accent">
            <Icon className="size-[1.15rem]" aria-hidden="true" />
          </span>
          <h3 className="text-lg leading-snug font-semibold tracking-tight">{service.title}</h3>
        </div>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{service.blurb}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {service.features.map((feature) => (
            <li key={feature} className="chip">
              {feature}
            </li>
          ))}
        </ul>
        {/* The ::after overlay makes the whole card a link to the service page. */}
        <a
          href={`/services/${service.id}`}
          className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-fg transition-colors after:absolute after:inset-0 after:rounded-2xl hover:text-accent group-hover:text-accent"
          aria-label={`${service.title}: what's included`}
        >
          What’s included
          <ArrowUpRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </a>
      </div>
    </article>
  );
}

export function Services({ services }: { services: Service[] }) {
  const fullOnTablet = tabletFullWidth(services);

  return (
    <section id="services" aria-labelledby="services-title" className="relative py-16 sm:py-20 lg:py-24">
      <div aria-hidden="true" className="glow top-24 left-1/2 h-[36rem] w-[min(70rem,100%)] -translate-x-1/2 [--glow-opacity:0.07]" />
      <div className="container-page relative">
        <Reveal>
          <SectionHeading id="services-title" eyebrow="Services" title="Everything a digital product needs, under one roof.">
            From first concept and UI/UX design to development, deployment and ongoing support — technology that solves real business
            problems.
          </SectionHeading>
        </Reveal>

        {/* Bento grid: 1 column on phones, 2 on tablets, 3 on desktop. */}
        <div className="mt-12 grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal
              key={service.id}
              delay={(index % 3) * 0.06}
              className={cn(
                fullOnTablet[index] && 'md:col-span-2',
                service.span === 1 && 'lg:col-span-1',
                service.span === 2 && 'lg:col-span-2',
                service.span === 3 && 'lg:col-span-3',
              )}
            >
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
