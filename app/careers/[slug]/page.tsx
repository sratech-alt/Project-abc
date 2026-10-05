import { ArrowLeft, ArrowUpRight, Briefcase, CalendarCheck, Clock, MapPin } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Prose } from '@/components/Prose';
import { SiteShell } from '@/components/SiteShell';
import { applyHref, EMPLOYMENT_TYPES, formatDate, getJob, getJobs } from '@/lib/content';
import { plainText, renderMarkdown } from '@/lib/markdown';
import { EMPTY_ROUTE, withPlaceholder } from '@/lib/static-params';
import { site } from '@/lib/site';

type Params = { slug: string };

// One page per open role, generated at build time. Unknown addresses get the 404 page.
export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  return withPlaceholder((await getJobs()).map((job) => ({ slug: job.slug })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const job = await getJob((await params).slug);
  if (!job) return { title: `Page not found — ${site.name}`, robots: { index: false } };

  const url = `/careers/${job.slug}`;
  const title = `${job.title} — Careers at ${site.name}`;
  return {
    title,
    description: job.summary,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title, description: job.summary, images: ['/og.png'] },
  };
}

export default async function JobPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const job = slug === EMPTY_ROUTE ? undefined : await getJob(slug);
  if (!job) notFound();

  const facts = [
    { icon: MapPin, label: 'Location', value: job.remote ? `${job.location} · remote possible` : job.location },
    { icon: Briefcase, label: 'Type', value: EMPLOYMENT_TYPES[job.employmentType] },
    { icon: Clock, label: 'Posted', value: formatDate(job.postedAt) },
    ...(job.closesAt ? [{ icon: CalendarCheck, label: 'Apply by', value: formatDate(job.closesAt) }] : []),
  ];

  // Lets Google list the role in its jobs search.
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: renderMarkdown(job.description) || plainText(job.summary),
    datePosted: job.postedAt,
    ...(job.closesAt ? { validThrough: job.closesAt } : {}),
    employmentType: job.employmentType,
    hiringOrganization: { '@type': 'Organization', name: site.name, sameAs: site.url },
    jobLocation: {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressLocality: site.city, postalCode: site.postalCode, addressCountry: site.countryCode },
    },
    ...(job.remote ? { jobLocationType: 'TELECOMMUTE', applicantLocationRequirements: { '@type': 'Country', name: site.country } } : {}),
    directApply: false,
  };

  return (
    <SiteShell>
      <article id="top" className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-20 lg:pb-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem]">
          <div className="bg-dots absolute inset-0 [mask-image:radial-gradient(ellipse_85%_90%_at_50%_0%,black_20%,transparent_78%)]" />
          <div className="glow -top-48 left-1/2 size-[46rem] -translate-x-1/2 [--glow-opacity:0.12]" />
        </div>

        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <a
              href="/careers"
              className="flex w-fit items-center gap-2 py-1.5 text-sm font-medium text-muted transition-colors hover:text-accent"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              All open roles
            </a>

            {job.department ? <p className="eyebrow mt-7 flex">{job.department}</p> : null}
            <h1 className="mt-4 text-[clamp(1.9rem,7vw,2.5rem)] leading-[1.1] font-extrabold tracking-[-0.03em] sm:text-5xl">
              {job.title}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{job.summary}</p>

            <ul
              className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line/90 bg-line/90 sm:grid-cols-2"
              aria-label="Role details"
            >
              {facts.map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex items-center gap-3.5 bg-raised/90 px-4 py-4 sm:px-5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-xs tracking-wider text-faint uppercase">{label}</span>
                    <span className="block text-[0.95rem] font-semibold text-fg">{value}</span>
                  </span>
                </li>
              ))}
            </ul>

            <a href={applyHref(job)} className="btn btn-primary mt-8 h-13 px-7 text-base">
              Apply by email
              <ArrowUpRight className="size-5" aria-hidden="true" />
            </a>
          </div>

          <Prose markdown={job.description} className="mx-auto mt-12 max-w-3xl" />

          <div className="card mx-auto mt-14 max-w-3xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold tracking-tight">How to apply</h2>
            <p className="mt-2 text-[0.95rem] leading-relaxed [overflow-wrap:anywhere] text-muted">
              Email your CV and a few lines about work you’re proud of to{' '}
              <a
                href={applyHref(job)}
                className="font-semibold text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
              >
                {job.applyEmail}
              </a>
              . We read every application.
            </p>
          </div>
        </div>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </SiteShell>
  );
}
