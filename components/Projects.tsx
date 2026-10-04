'use client';

import { ArrowUpRight, Check, ExternalLink, X, Zap } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/cn';
import { projects, type Project } from '@/lib/data';

const FEATURED_COUNT = 3;

const hashtag = (tag: string) => `#${tag.replace(/[^A-Za-z0-9]+/g, '')}`;

const imageAlt = (project: Project) =>
  project.platform === 'mobile' ? `${project.title} — app store artwork` : `${project.title} — screenshot of the application`;

/**
 * Card preview. Web projects sit in a browser frame; mobile projects are portrait posters, so they
 * are shown as a poster (top-aligned, fading out) instead of being cropped into a landscape box.
 */
function Preview({ project, className }: { project: Project; className?: string }) {
  const { image } = project;
  return (
    <div className={cn('relative aspect-[16/11] overflow-hidden bg-raised', className)}>
      <div
        aria-hidden="true"
        className={cn(
          'glow top-1/2 left-1/2 size-[120%] -translate-x-1/2 -translate-y-1/2',
          project.platform === 'mobile'
            ? '[--glow-color:var(--color-iris)] [--glow-opacity:0.3]'
            : '[--glow-opacity:0.16]',
        )}
      />
      {project.platform === 'mobile' ? (
        <div className="absolute top-6 left-1/2 w-[46%] -translate-x-1/2 overflow-hidden rounded-2xl border border-line-strong shadow-[0_30px_60px_-30px_var(--color-black)] transition-transform duration-500 ease-out group-hover:-translate-y-4">
          <Image src={image.src} alt={imageAlt(project)} width={image.width} height={image.height} sizes="(min-width: 1024px) 190px, 46vw" className="h-auto w-full" />
        </div>
      ) : (
        <div className="absolute inset-x-5 top-6 bottom-0 overflow-hidden rounded-t-xl border border-b-0 border-line-strong bg-canvas shadow-[0_30px_60px_-30px_var(--color-black)] transition-transform duration-500 ease-out group-hover:-translate-y-2">
          <div className="flex h-6 items-center gap-1.5 border-b border-line px-3" aria-hidden="true">
            <span className="size-1.5 rounded-full bg-line-strong" />
            <span className="size-1.5 rounded-full bg-line-strong" />
            <span className="size-1.5 rounded-full bg-line-strong" />
          </div>
          <Image src={image.src} alt={imageAlt(project)} width={image.width} height={image.height} sizes="(min-width: 1024px) 380px, 90vw" className="h-auto w-full" />
        </div>
      )}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-14 bg-linear-to-t from-raised to-transparent" />
    </div>
  );
}

function StoreLinks({ project, className }: { project: Project; className?: string }) {
  if (!project.links?.length) return null;
  return (
    <ul className={cn('flex flex-wrap gap-2', className)}>
      {project.links.map((link) => (
        <li key={link.url}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-glass h-10 px-4 text-sm"
            aria-label={`${project.title} on the ${link.label} (opens in a new tab)`}
          >
            {link.label}
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}

/** `tabletWide`: the card spans both tablet columns, so it lays out sideways there instead of becoming one huge image. */
function ProjectCard({ project, onOpen, tabletWide = false }: { project: Project; onOpen: (project: Project) => void; tabletWide?: boolean }) {
  return (
    <article data-spotlight className={cn('card group flex h-full flex-col overflow-hidden', tabletWide && 'md:max-lg:flex-row')}>
      <Preview project={project} className={cn(tabletWide && 'md:max-lg:aspect-auto md:max-lg:w-[46%] md:max-lg:shrink-0')} />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="flex items-center justify-between gap-3 font-mono text-xs tracking-wider text-faint uppercase">
          <span>{project.category}</span>
          <span>{project.year}</span>
        </p>
        <h3 className="mt-2.5 text-xl leading-snug font-semibold tracking-tight">{project.title}</h3>

        <ul className="mt-3.5 flex flex-wrap gap-2">
          <li className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
            <Zap className="size-3.5" aria-hidden="true" />
            {project.highlight}
          </li>
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
          {/* The ::after overlay makes the whole card open the case study. */}
          <button
            type="button"
            onClick={() => onOpen(project)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-fg transition-colors after:absolute after:inset-0 after:rounded-2xl hover:text-accent group-hover:text-accent"
          >
            View case study
            <ArrowUpRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </article>
  );
}

function CaseStudy({ project, onClose }: { project: Project; onClose: () => void }) {
  const { image } = project;
  return (
    <div className="max-h-[min(100dvh-1.5rem,46rem)] overflow-y-auto overscroll-contain">
      <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div className="relative flex items-center justify-center overflow-hidden bg-canvas p-5 sm:p-8">
          <div aria-hidden="true" className="glow top-1/2 left-1/2 size-[110%] -translate-x-1/2 -translate-y-1/2 [--glow-color:var(--color-iris)] [--glow-opacity:0.22]" />
          <Image
            src={image.src}
            alt={imageAlt(project)}
            width={image.width}
            height={image.height}
            sizes="(min-width: 768px) 420px, 90vw"
            className={cn(
              'relative h-auto rounded-xl border border-line-strong',
              project.platform === 'mobile' ? 'max-h-[26rem] w-auto md:max-h-[34rem]' : 'w-full',
            )}
          />
        </div>

        <div className="p-6 sm:p-8">
          <p className="pr-10 font-mono text-xs tracking-wider text-faint uppercase">
            {project.category} · {project.year}
          </p>
          <h3 id="case-study-title" className="mt-2.5 text-2xl leading-tight font-bold tracking-tight">
            {project.title}
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.industry.map((tag) => (
              <li key={tag} className="chip">
                {tag}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[0.95rem] leading-relaxed text-muted">{project.description}</p>

          <h4 className="mt-7 font-mono text-xs tracking-[0.18em] text-accent uppercase">What we built</h4>
          <ul className="mt-3 space-y-2.5">
            {project.highlights.map((item) => (
              <li key={item} className="flex gap-2.5 text-[0.95rem] leading-snug text-fg">
                <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>

          <h4 className="mt-7 font-mono text-xs tracking-[0.18em] text-accent uppercase">Stack</h4>
          <ul className="mt-3 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li key={tag} className="chip">
                {tag}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-2">
            <StoreLinks project={project} />
            <a href="#contact" onClick={onClose} className="btn btn-primary h-10 px-4 text-sm">
              Build something like this
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Projects() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<Project | null>(null);

  const featured = projects.filter((project) => project.featured).slice(0, FEATURED_COUNT);
  const others = projects.filter((project) => !featured.includes(project));

  // The native <dialog> gives us the focus trap, Escape to close and focus return for free.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!selected || !dialog) return;
    if (!dialog.open) dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [selected]);

  const close = () => dialogRef.current?.close();

  return (
    <section id="projects" aria-labelledby="projects-title" className="relative py-16 sm:py-20 lg:py-24">
      <div className="container-page">
        <Reveal>
          <SectionHeading id="projects-title" eyebrow="Selected Work" title="Products we’ve designed, engineered and shipped.">
            Web platforms, business software and mobile apps — open any card for the details.
          </SectionHeading>
        </Reveal>

        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, index) => {
            // An odd card at the end would leave a hole in the two-column tablet grid.
            const tabletWide = featured.length % 2 === 1 && index === featured.length - 1;
            return (
            <li key={project.id} className={cn(tabletWide && 'md:col-span-2 lg:col-span-1')}>
              <Reveal delay={index * 0.07} className="h-full">
                <ProjectCard project={project} onOpen={setSelected} tabletWide={tabletWide} />
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
                    <button type="button" onClick={() => setSelected(project)} className="btn btn-glass h-10 px-4 text-sm">
                      View case study
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="case-study-title"
        onClose={() => setSelected(null)}
        onClick={(event) => {
          // A click that lands on the <dialog> itself is a click on the backdrop.
          if (event.target === event.currentTarget) close();
        }}
        className="m-auto w-[min(100%-1.5rem,60rem)] overflow-hidden rounded-2xl border border-line-strong bg-raised p-0 text-fg shadow-[0_40px_120px_-30px_var(--color-black)] backdrop:bg-canvas/80 backdrop:backdrop-blur-sm open:animate-dialog-in"
      >
        {selected ? (
          <>
            <button
              type="button"
              onClick={close}
              aria-label="Close case study"
              className="absolute top-3 right-3 z-10 inline-flex size-10 items-center justify-center rounded-full border border-line-strong bg-canvas/80 text-fg backdrop-blur-md transition-colors hover:border-accent/60 hover:text-accent"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
            <CaseStudy project={selected} onClose={close} />
          </>
        ) : null}
      </dialog>
    </section>
  );
}
