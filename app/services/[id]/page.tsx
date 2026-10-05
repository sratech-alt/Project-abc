import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Prose } from '@/components/Prose';
import { ServiceIllustration } from '@/components/services/visuals';
import { SiteShell } from '@/components/SiteShell';
import { getServices } from '@/lib/catalog';
import { site } from '@/lib/site';

type Params = { id: string };

// One page per service, generated at build time. Unknown addresses get the 404 page.
export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  return (await getServices()).map((service) => ({ id: service.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const service = (await getServices()).find((entry) => entry.id === id);
  if (!service) return { title: `Page not found — ${site.name}`, robots: { index: false } };

  const url = `/services/${service.id}`;
  const title = `${service.title} in ${site.country} — ${site.name}`;
  return {
    title,
    description: service.blurb,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title, description: service.blurb, images: ['/og.png'] },
  };
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const services = await getServices();
  const service = services.find((entry) => entry.id === id);
  if (!service) notFound();

  const included = service.details.length > 0 ? service.details : service.features;
  const others = services.filter((entry) => entry.id !== service.id);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.blurb,
    serviceType: service.title,
    provider: { '@type': 'ProfessionalService', name: site.name, url: site.url },
    areaServed: 'Worldwide',
    url: `${site.url}/services/${service.id}`,
  };

  return (
    <SiteShell>
      <article id="top" className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-20 lg:pb-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem]">
          <div className="bg-dots absolute inset-0 [mask-image:radial-gradient(ellipse_85%_90%_at_50%_0%,black_20%,transparent_78%)]" />
          <div className="glow -top-56 -left-40 size-[42rem] [--glow-opacity:0.12]" />
          <div className="glow -top-40 -right-56 size-[44rem] [--glow-color:var(--color-iris)] [--glow-opacity:0.14]" />
        </div>

        <div className="container-page">
          <a href="/#services" className="flex w-fit items-center gap-2 py-1.5 text-sm font-medium text-muted transition-colors hover:text-accent">
            <ArrowLeft className="size-4" aria-hidden="true" />
            All services
          </a>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
            <div>
              <p className="eyebrow flex">Service</p>
              <h1 className="mt-5 text-[clamp(2rem,8vw,2.6rem)] leading-[1.08] font-extrabold tracking-[-0.03em] sm:text-5xl lg:text-[3.25rem]">
                {service.title}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">{service.blurb}</p>
              <a href="/#contact" className="btn btn-primary mt-8 h-13 px-7 text-base">
                Start Your Project
                <ArrowRight className="size-5" aria-hidden="true" />
              </a>
            </div>
            {/* `group` lets the illustration's hover motion respond to the pointer. */}
            <div className="group">
              <ServiceIllustration kind={service.visual} className={service.visual === 'uptime' ? undefined : 'h-64 sm:h-72'} />
            </div>
          </div>

          <section aria-labelledby="included-title" className="mt-16 sm:mt-20">
            <h2 id="included-title" className="text-2xl font-bold tracking-tight sm:text-3xl">
              What’s included
            </h2>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {included.map((item) => (
                <li key={item} className="card flex items-start gap-3 p-4">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                  <span className="text-[0.95rem] leading-snug font-medium text-fg">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {service.body ? <Prose markdown={service.body} className="mt-14 max-w-3xl" /> : null}

          <section aria-labelledby="other-services-title" className="mt-16 sm:mt-20">
            <h2 id="other-services-title" className="text-2xl font-bold tracking-tight sm:text-3xl">
              Other services
            </h2>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {others.map((other) => (
                <li key={other.id}>
                  <a
                    href={`/services/${other.id}`}
                    data-spotlight
                    className="card group flex h-full items-center justify-between gap-3 p-4 text-[0.95rem] font-semibold text-fg transition-colors hover:text-accent"
                  >
                    {other.title}
                    <ArrowUpRight className="size-4 shrink-0 text-faint transition-colors group-hover:text-accent" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </SiteShell>
  );
}
