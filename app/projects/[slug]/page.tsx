import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Zap } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProjectPreview, StoreLinks } from '@/components/ProjectPreview';
import { Prose } from '@/components/Prose';
import { SiteShell } from '@/components/SiteShell';
import { getProjects } from '@/lib/catalog';
import { site } from '@/lib/site';

type Params = { slug: string };

// One page per project, generated at build time. Unknown addresses get the 404 page.
export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  return (await getProjects()).map((project) => ({ slug: project.id }));
}

const absolute = (src: string) => (src.startsWith('/') ? `${site.url}${src}` : src);

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = (await getProjects()).find((entry) => entry.id === slug);
  if (!project) return { title: `Page not found — ${site.name}`, robots: { index: false } };

  const url = `/projects/${project.id}`;
  const title = `${project.title} — Case study by ${site.name}`;
  return {
    title,
    description: project.description,
    alternates: { canonical: url },
    openGraph: { type: 'article', url, title, description: project.description, images: ['/og.png'] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const projects = await getProjects();
  const project = projects.find((entry) => entry.id === slug);
  if (!project) notFound();

  const others = projects.filter((entry) => entry.id !== project.id);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    image: absolute(project.image.src),
    creator: { '@type': 'Organization', name: site.name, url: site.url },
    keywords: project.tags.join(', '),
    url: `${site.url}/projects/${project.id}`,
    ...(project.year ? { dateCreated: project.year } : {}),
  };

  return (
    <SiteShell>
      <article id="top" className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-20 lg:pb-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem]">
          <div className="bg-dots absolute inset-0 [mask-image:radial-gradient(ellipse_85%_90%_at_50%_0%,black_20%,transparent_78%)]" />
          <div className="glow -top-48 left-1/2 size-[48rem] -translate-x-1/2 [--glow-color:var(--color-iris)] [--glow-opacity:0.14]" />
        </div>

        <div className="container-page">
          <a
            href="/#projects"
            className="flex w-fit items-center gap-2 py-1.5 text-sm font-medium text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All projects
          </a>

          <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
            <div>
              <p className="font-mono text-xs tracking-wider text-faint uppercase">
                {[project.category, project.year].filter(Boolean).join(' · ')}
              </p>
              <h1 className="mt-4 text-[clamp(1.9rem,7.5vw,2.5rem)] leading-[1.1] font-extrabold tracking-[-0.03em] sm:text-5xl">
                {project.title}
              </h1>

              <ul className="mt-6 flex flex-wrap gap-2">
                {project.highlight ? (
                  <li className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                    <Zap className="size-3.5" aria-hidden="true" />
                    {project.highlight}
                  </li>
                ) : null}
                {project.industry.map((tag) => (
                  <li key={tag} className="chip">
                    {tag}
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">{project.description}</p>

              {project.highlights.length > 0 ? (
                <>
                  <h2 className="mt-9 font-mono text-xs tracking-[0.18em] text-accent uppercase">What we built</h2>
                  <ul className="mt-4 space-y-3">
                    {project.highlights.map((item) => (
                      <li key={item} className="flex gap-3 text-base leading-snug text-fg">
                        <Check className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              {project.tags.length > 0 ? (
                <>
                  <h2 className="mt-9 font-mono text-xs tracking-[0.18em] text-accent uppercase">Stack</h2>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <li key={tag} className="chip">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              <div className="mt-9 flex flex-wrap gap-2">
                <StoreLinks project={project} />
                <a href="/#contact" className="btn btn-primary h-10 px-4 text-sm">
                  Build something like this
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-line-strong/70 lg:sticky lg:top-28">
              <ProjectPreview
                project={project}
                priority
                className={project.platform === 'mobile' ? 'aspect-[4/5] sm:aspect-[16/14]' : undefined}
              />
            </div>
          </div>

          {project.body ? <Prose markdown={project.body} className="mt-14 max-w-3xl" /> : null}

          {others.length > 0 ? (
            <section aria-labelledby="more-work-title" className="mt-16 sm:mt-20">
              <h2 id="more-work-title" className="text-2xl font-bold tracking-tight sm:text-3xl">
                More work
              </h2>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {others.map((other) => (
                  <li key={other.id}>
                    <a
                      href={`/projects/${other.id}`}
                      data-spotlight
                      className="card group flex h-full items-center justify-between gap-3 p-4 transition-colors"
                    >
                      <span className="min-w-0">
                        <span className="block font-mono text-xs tracking-wider text-faint uppercase">{other.category}</span>
                        <span className="mt-1 block text-[0.95rem] leading-snug font-semibold text-fg transition-colors group-hover:text-accent">
                          {other.title}
                        </span>
                      </span>
                      <ArrowUpRight className="size-4 shrink-0 text-faint transition-colors group-hover:text-accent" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </SiteShell>
  );
}
