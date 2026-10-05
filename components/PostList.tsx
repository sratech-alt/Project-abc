import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { pageHref, type Tag } from '@/lib/blog';
import { cn } from '@/lib/cn';
import { formatDate, type Post } from '@/lib/content';

function PostCard({ post }: { post: Post }) {
  return (
    <article data-spotlight className="card group flex h-full flex-col overflow-hidden">
      {/* Cover: the article's own image, or a quiet on-brand panel when it has none. */}
      <div className="relative aspect-[16/9] overflow-hidden bg-raised">
        {post.coverImage ? (
          // A plain <img>: covers live on Supabase Storage and their dimensions aren't known at build time.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage.src}
            alt={post.coverImage.alt}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div aria-hidden="true" className="absolute inset-0">
            <div className="bg-dots absolute inset-0 opacity-60" />
            <div className="glow top-1/2 left-1/2 size-[130%] -translate-x-1/2 -translate-y-1/2 [--glow-color:var(--color-iris)] [--glow-opacity:0.28]" />
            <span className="absolute bottom-4 left-5 font-mono text-xs tracking-[0.18em] text-faint uppercase">
              {post.tags[0] ?? 'Article'}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="font-mono text-xs tracking-wider text-faint uppercase">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> · {post.readingMinutes} min read
        </p>
        <h2 className="mt-2.5 text-xl leading-snug font-semibold tracking-tight">
          {/* The ::after overlay makes the whole card the link. */}
          <a
            href={`/blog/${post.slug}`}
            className="transition-colors after:absolute after:inset-0 after:rounded-2xl group-hover:text-accent"
          >
            {post.title}
          </a>
        </h2>
        <p className="mt-3 line-clamp-3 text-[0.95rem] leading-relaxed text-muted">{post.excerpt}</p>
        {post.tags.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Topics">
            {post.tags.map((tag) => (
              <li key={tag} className="chip">
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
        <p
          className="mt-auto flex items-center gap-1.5 pt-6 text-sm font-semibold text-fg transition-colors group-hover:text-accent"
          aria-hidden="true"
        >
          Read article
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </p>
      </div>
    </article>
  );
}

/** Links to every topic; `activeSlug` marks the one being viewed. */
export function TagNav({ tags, activeSlug }: { tags: Tag[]; activeSlug?: string }) {
  if (tags.length === 0) return null;
  const chip = 'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors';
  const idle = 'border-line-strong/70 text-muted hover:border-accent/60 hover:text-fg';
  const active = 'border-accent/60 bg-accent/10 text-accent';
  return (
    <nav aria-label="Topics" className="mb-8">
      <ul className="flex flex-wrap gap-2">
        <li>
          <a href="/blog" aria-current={activeSlug ? undefined : 'page'} className={cn(chip, activeSlug ? idle : active)}>
            All articles
          </a>
        </li>
        {tags.map((tag) => (
          <li key={tag.slug}>
            <a
              href={`/blog/tag/${tag.slug}`}
              aria-current={tag.slug === activeSlug ? 'page' : undefined}
              className={cn(chip, tag.slug === activeSlug ? active : idle)}
            >
              {tag.label}
              <span className="font-mono text-xs text-faint">{tag.count}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Previous / next links between list pages. Renders nothing when everything fits on one page. */
export function Pagination({ page, pages }: { page: number; pages: number }) {
  if (pages <= 1) return null;
  const link = 'btn btn-glass h-11 px-5 text-sm';
  return (
    <nav aria-label="Pages" className="mt-10 flex items-center justify-between gap-4">
      {page > 1 ? (
        <a href={pageHref(page - 1)} className={link} rel="prev">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Newer
        </a>
      ) : (
        <span />
      )}
      <p className="font-mono text-xs tracking-wider text-faint uppercase">
        Page {page} of {pages}
      </p>
      {page < pages ? (
        <a href={pageHref(page + 1)} className={link} rel="next">
          Older
          <ArrowRight className="size-4" aria-hidden="true" />
        </a>
      ) : (
        <span />
      )}
    </nav>
  );
}

export function PostGrid({ posts }: { posts: Post[] }) {
  return (
    <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <li key={post.slug}>
          <PostCard post={post} />
        </li>
      ))}
    </ul>
  );
}
