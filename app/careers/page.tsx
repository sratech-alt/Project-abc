import { ArrowUpRight, MapPin } from 'lucide-react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { SiteShell } from '@/components/SiteShell';
import { EMPLOYMENT_TYPES, getJobs, type Job } from '@/lib/content';
import { site } from '@/lib/site';

const description = `Open roles at ${site.name}, a software development company in ${site.city}, ${site.country}.`;

// The page is only offered to search engines once there is an open role on it.
export async function generateMetadata(): Promise<Metadata> {
  const hasJobs = (await getJobs()).length > 0;
  return {
    title: `Careers — ${site.name}`,
    description,
    alternates: { canonical: '/careers' },
    robots: { index: hasJobs, follow: true },
    openGraph: { type: 'website', url: '/careers', title: `Careers — ${site.name}`, description, images: ['/og.png'] },
  };
}

function JobRow({ job }: { job: Job }) {
  return (
    <article data-spotlight className="card group flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-8 sm:p-6">
      <div className="min-w-0 flex-1">
        {job.department ? <p className="font-mono text-xs tracking-wider text-faint uppercase">{job.department}</p> : null}
        <h2 className="mt-1.5 text-xl leading-snug font-semibold tracking-tight">
          {/* The ::after overlay makes the whole row the link. */}
          <a
            href={`/careers/${job.slug}`}
            className="transition-colors after:absolute after:inset-0 after:rounded-2xl group-hover:text-accent"
          >
            {job.title}
          </a>
        </h2>
        <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-muted">{job.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          <li className="chip">
            <MapPin className="size-3.5" aria-hidden="true" />
            {job.location}
          </li>
          <li className="chip">{EMPLOYMENT_TYPES[job.employmentType]}</li>
          {job.remote ? <li className="chip">Remote possible</li> : null}
        </ul>
      </div>
      <p
        className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-fg transition-colors group-hover:text-accent"
        aria-hidden="true"
      >
        View role
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </p>
    </article>
  );
}

export default async function CareersPage() {
  const jobs = await getJobs();

  return (
    <SiteShell>
      <PageHeader eyebrow="Careers" title={`Build software that ships, from ${site.city}.`}>
        We’re a small team that owns products end to end — backend, frontend, data and delivery.
      </PageHeader>

      <section aria-label="Open roles" className="pb-16 sm:pb-20 lg:pb-24">
        <div className="container-page">
          {jobs.length > 0 ? (
            <ul className="grid gap-4 sm:gap-5">
              {jobs.map((job) => (
                <li key={job.slug}>
                  <JobRow job={job} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="card max-w-2xl p-6 sm:p-8">
              <h2 className="text-xl font-semibold tracking-tight">No open roles right now.</h2>
              <p className="mt-2.5 text-[0.95rem] leading-relaxed text-muted">
                We don’t have a position advertised at the moment. If you think you’d be a good fit anyway, write to us and tell us what
                you’d like to work on.
              </p>
              <a
                href={`mailto:${site.emails.general}?subject=${encodeURIComponent('Working at Sabiora')}`}
                className="btn btn-glass mt-6 h-11 px-5 text-sm"
              >
                {site.emails.general}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
