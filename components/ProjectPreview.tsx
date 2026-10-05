import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/cn';
import type { Project } from '@/lib/data';

export const hashtag = (tag: string) => `#${tag.replace(/[^A-Za-z0-9]+/g, '')}`;

export const projectImageAlt = (project: Project) =>
  project.platform === 'mobile' ? `${project.title} — app store artwork` : `${project.title} — screenshot of the application`;

/**
 * A project's image in a frame. Web projects sit in a browser window; mobile projects are portrait
 * posters, so they are shown as a poster (top-aligned, fading out) instead of being cropped into a
 * landscape box. Put it inside an element with the `group` class to get the hover lift.
 */
export function ProjectPreview({ project, className, priority = false }: { project: Project; className?: string; priority?: boolean }) {
  const { image } = project;
  return (
    <div className={cn('relative aspect-[16/11] overflow-hidden bg-raised', className)}>
      <div
        aria-hidden="true"
        className={cn(
          'glow top-1/2 left-1/2 size-[120%] -translate-x-1/2 -translate-y-1/2',
          project.platform === 'mobile' ? '[--glow-color:var(--color-iris)] [--glow-opacity:0.3]' : '[--glow-opacity:0.16]',
        )}
      />
      {project.platform === 'mobile' ? (
        <div className="absolute top-6 left-1/2 w-[46%] -translate-x-1/2 overflow-hidden rounded-2xl border border-line-strong shadow-[0_30px_60px_-30px_var(--color-black)] transition-transform duration-500 ease-out group-hover:-translate-y-4">
          <Image
            src={image.src}
            alt={projectImageAlt(project)}
            width={image.width}
            height={image.height}
            priority={priority}
            sizes="(min-width: 1024px) 260px, 46vw"
            className="h-auto w-full"
          />
        </div>
      ) : (
        <div className="absolute inset-x-5 top-6 bottom-0 overflow-hidden rounded-t-xl border border-b-0 border-line-strong bg-canvas shadow-[0_30px_60px_-30px_var(--color-black)] transition-transform duration-500 ease-out group-hover:-translate-y-2">
          <div className="flex h-6 items-center gap-1.5 border-b border-line px-3" aria-hidden="true">
            <span className="size-1.5 rounded-full bg-line-strong" />
            <span className="size-1.5 rounded-full bg-line-strong" />
            <span className="size-1.5 rounded-full bg-line-strong" />
          </div>
          <Image
            src={image.src}
            alt={projectImageAlt(project)}
            width={image.width}
            height={image.height}
            priority={priority}
            sizes="(min-width: 1024px) 560px, 90vw"
            className="h-auto w-full"
          />
        </div>
      )}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-14 bg-linear-to-t from-raised to-transparent" />
    </div>
  );
}

/** Buttons to the project's store pages. Renders nothing when the project has none. */
export function StoreLinks({ project, className }: { project: Project; className?: string }) {
  if (!project.links?.length) return null;
  return (
    <ul className={cn('flex flex-wrap gap-2', className)}>
      {project.links.map((link) => (
        <li key={link.url}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-glass relative z-10 h-10 px-4 text-sm"
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
