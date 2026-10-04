import { cn } from '@/lib/cn';
import { renderMarkdown } from '@/lib/markdown';

/** Renders Markdown from the database. The HTML comes from lib/markdown.ts, which escapes raw HTML and vets links. */
export function Prose({ markdown, className }: { markdown: string; className?: string }) {
  return <div className={cn('prose', className)} dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }} />;
}
