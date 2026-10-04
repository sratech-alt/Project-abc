import { ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { SiteShell } from '@/components/SiteShell';
import { formatDate, getPosts, type Post } from '@/lib/content';
import { site } from '@/lib/site';

const description = `Engineering notes from ${site.name}: how we design, build and run web, mobile and custom software.`;

// The page is only offered to search engines once there is something on it.
export async function generateMetadata(): Promise<Metadata> {
  const hasPosts = (await getPosts()).length > 0;
  return {
    title: `Blog — ${site.name}`,
    description,
    alternates: { canonical: '/blog' },
    robots: { index: hasPosts, follow: true },
    openGraph: { type: 'website', url: '/blog', title: `Blog — ${site.name}`, description, images: ['/og.png'] },
  };
}

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
            <span className="absolute bottom-4 left-5 font-mono text-xs tracking-[0.18em] text-faint uppercase">{post.tags[0] ?? 'Article'}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="font-mono text-xs tracking-wider text-faint uppercase">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> · {post.readingMinutes} min read
        </p>
        <h2 className="mt-2.5 text-xl leading-snug font-semibold tracking-tight">
          {/* The ::after overlay makes the whole card the link. */}
          <a href={`/blog/${post.slug}`} className="transition-colors after:absolute after:inset-0 after:rounded-2xl group-hover:text-accent">
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
        <p className="mt-auto flex items-center gap-1.5 pt-6 text-sm font-semibold text-fg transition-colors group-hover:text-accent" aria-hidden="true">
          Read article
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </p>
      </div>
    </article>
  );
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <SiteShell>
      <PageHeader eyebrow="Blog" title="Notes from the people building it.">
        How we design, build and run software — written by the engineers doing the work.
      </PageHeader>

      <section aria-label="Articles" className="pb-16 sm:pb-20 lg:pb-24">
        <div className="container-page">
          {posts.length > 0 ? (
            <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <li key={post.slug}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="card max-w-2xl p-6 sm:p-8">
              <h2 className="text-xl font-semibold tracking-tight">No articles yet.</h2>
              <p className="mt-2.5 text-[0.95rem] leading-relaxed text-muted">
                We haven’t published anything here so far. In the meantime, the work speaks for itself.
              </p>
              <a href="/#projects" className="btn btn-glass mt-6 h-11 px-5 text-sm">
                See our projects
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
