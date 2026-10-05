import { ArrowUpRight, Zap } from 'lucide-react';
import Image from 'next/image';
import { hashtag, ProjectPreview, StoreLinks } from '@/components/ProjectPreview';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/cn';
import type { Project } from '@/lib/data';

const FEATURED_COUNT = 3;

/** `tabletWide`: the card spans both tablet columns, so it lays out sideways there instead of becoming one huge image. */
function ProjectCard({ project, tabletWide = false }: { project: Project; tabletWide?: boolean }) {
  return (
    <article data-spotlight className={cn('card group flex h-full flex-col overflow-hidden', tabletWide && 'md:max-lg:flex-row')}>
      <ProjectPreview project={project} className={cn(tabletWide && 'md:max-lg:aspect-auto md:max-lg:w-[46%] md:max-lg:shrink-0')} />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="flex items-center justify-between gap-3 font-mono text-xs tracking-wider text-faint uppercase">
          <span>{project.category}</span>
          <span>{project.year}</span>
        </p>
        <h3 className="mt-2.5 text-xl leading-snug font-semibold tracking-tight">{project.title}</h3>

        <ul className="mt-3.5 flex flex-wrap gap-2">
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

        <p className="mt-4 line-clamp-3 text-[0.95rem] leading-relaxed text-muted">{project.description}</p>

        <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-iris-soft" aria-label="Tech stack">
          {project.tags.map((tag) => (
            <li key={tag}>{hashtag(tag)}</li>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          {/* The ::after overlay makes the whole card a link to the case study. */}
          <a
            href={`/projects/${project.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-fg transition-colors after:absolute after:inset-0 after:rounded-2xl hover:text-accent group-hover:text-accent"
            aria-label={`View case study: ${project.title}`}
          >
            View case study
            <ArrowUpRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </article>
  );
}

/** The first three featured projects get full cards; the rest are listed under "Also shipped". */
export function Projects({ projects }: { projects: Project[] }) {
  const featured = projects.filter((project) => project.featured).slice(0, FEATURED_COUNT);
  const others = projects.filter((project) => !featured.includes(project));

  return (
    <section id="projects" aria-labelledby="projects-title" className="relative py-16 sm:py-20 lg:py-24">
      <div className="container-page">
        <Reveal>
          <SectionHeading id="projects-title" eyebrow="Selected Work" title="Products we’ve designed, engineered and shipped.">
            Web platforms, business software and mobile apps — open any card for the case study.
          </SectionHeading>
        </Reveal>

        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, index) => {
            // An odd card at the end would leave a hole in the two-column tablet grid.
            const tabletWide = featured.length % 2 === 1 && index === featured.length - 1;
            return (
              <li key={project.id} className={cn(tabletWide && 'md:col-span-2 lg:col-span-1')}>
                <Reveal delay={index * 0.07} className="h-full">
                  <ProjectCard project={project} tabletWide={tabletWide} />
                </Reveal>
              </li>
            );
          })}
        </ul>

        {others.length > 0 ? (
          <Reveal className="mt-5">
            <h3 className="sr-only">Also shipped</h3>
            <ul className="grid gap-5 lg:grid-cols-2">
              {others.map((project) => (
                <li
                  key={project.id}
                  data-spotlight
                  className={cn('card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5', others.length === 1 && 'lg:col-span-2')}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <Image
                      src={project.image.src}
                      alt=""
                      width={project.image.width}
                      height={project.image.height}
                      sizes="56px"
                      className="size-14 shrink-0 rounded-xl border border-line-strong object-cover object-top"
                    />
                    <div className="min-w-0">
                      <p className="font-mono text-xs tracking-wider text-faint uppercase">Also shipped · {project.category}</p>
                      <p className="mt-1 text-base leading-snug font-semibold text-fg">{project.title}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StoreLinks project={project} />
                    <a href={`/projects/${project.id}`} className="btn btn-glass h-10 px-4 text-sm" aria-label={`View case study: ${project.title}`}>
                      View case study
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
