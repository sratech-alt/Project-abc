import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type SectionHeadingProps = {
  /** id for the <h2>, referenced by the section's aria-labelledby. */
  id: string;
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHeading({ id, eyebrow, title, children, align = 'left', className }: SectionHeadingProps) {
  return (
    <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="mt-4 text-3xl leading-[1.12] font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      {children ? <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{children}</p> : null}
    </div>
  );
}
