import type { ReactNode } from 'react';

type PageHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
};

/** The top of a content page (blog, careers): the same grid-and-glow backdrop as the home hero, at a smaller scale. */
export function PageHeader({ eyebrow, title, children }: PageHeaderProps) {
  return (
    <header id="top" className="relative isolate overflow-hidden pt-32 pb-12 sm:pt-40 sm:pb-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-dots absolute inset-0 [mask-image:radial-gradient(ellipse_85%_90%_at_50%_0%,black_20%,transparent_78%)]" />
        <div className="glow -top-64 -left-40 size-[40rem] [--glow-opacity:0.12]" />
        <div className="glow -top-48 -right-56 size-[44rem] [--glow-color:var(--color-iris)] [--glow-opacity:0.15]" />
      </div>
      <div className="container-page">
        <p className="eyebrow animate-fade-up">{eyebrow}</p>
        <h1 className="mt-5 max-w-3xl animate-rise text-4xl leading-[1.08] font-extrabold tracking-[-0.03em] sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {children ? (
          <p className="mt-5 max-w-2xl animate-rise text-base leading-relaxed text-muted [animation-delay:80ms] sm:text-lg">{children}</p>
        ) : null}
      </div>
    </header>
  );
}
