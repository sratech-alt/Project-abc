import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Prose } from '@/components/Prose';
import { SiteShell } from '@/components/SiteShell';
import { tagSlug } from '@/lib/blog';
import { formatDate, getPost, getPosts } from '@/lib/content';
import { EMPTY_ROUTE, withPlaceholder } from '@/lib/static-params';
import { site } from '@/lib/site';

type Params = { slug: string };

// One page per published post, generated at build time. Unknown addresses get the 404 page.
export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  return withPlaceholder((await getPosts()).map((post) => ({ slug: post.slug })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return { title: `Page not found — ${site.name}`, robots: { index: false } };

  const url = `/blog/${post.slug}`;
  const images = [post.coverImage?.src ?? '/og.png'];
  return {
    title: `${post.title} — ${site.name}`,
    description: post.excerpt,
    alternates: { canonical: url, types: { 'application/rss+xml': '/blog/feed.xml' } },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
      images,
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.excerpt, images },
  };
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = slug === EMPTY_ROUTE ? undefined : await getPost(slug);
  if (!post) notFound();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { '@type': 'Organization', name: post.author },
    publisher: { '@type': 'Organization', name: site.name, url: site.url },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
    image: post.coverImage?.src ?? `${site.url}/og.png`,
    keywords: post.tags.join(', '),
  };

  return (
    <SiteShell>
      <article id="top" className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-20 lg:pb-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem]">
          <div className="bg-dots absolute inset-0 [mask-image:radial-gradient(ellipse_85%_90%_at_50%_0%,black_20%,transparent_78%)]" />
          <div className="glow -top-48 left-1/2 size-[46rem] -translate-x-1/2 [--glow-color:var(--color-iris)] [--glow-opacity:0.14]" />
        </div>

        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            <a
              href="/blog"
              className="flex w-fit items-center gap-2 py-1.5 text-sm font-medium text-muted transition-colors hover:text-accent"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              All articles
            </a>

            {post.tags.length > 0 ? (
              <ul className="mt-7 flex flex-wrap gap-2" aria-label="Topics">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <a href={`/blog/tag/${tagSlug(tag)}`} className="chip transition-colors hover:border-accent/60 hover:text-fg">
                      {tag}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}

            <h1 className="mt-5 text-[clamp(1.9rem,7vw,2.5rem)] leading-[1.1] font-extrabold tracking-[-0.03em] sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-5 font-mono text-xs tracking-wider text-faint uppercase">
              {post.author} · <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> · {post.readingMinutes} min read
            </p>
          </div>

          {post.coverImage ? (
            <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-line-strong/70 bg-raised">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.coverImage.src} alt={post.coverImage.alt} decoding="async" className="aspect-[16/9] w-full object-cover" />
            </div>
          ) : null}

          <Prose markdown={post.content} className="mx-auto mt-10 max-w-3xl" />

          <div className="card mx-auto mt-14 flex max-w-3xl flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Have a project in mind?</h2>
              <p className="mt-1.5 text-[0.95rem] text-muted">Tell us what you’re building and we’ll talk through how to get it shipped.</p>
            </div>
            <a href="/#contact" className="btn btn-primary h-12 shrink-0 px-6 text-base">
              Start Your Project
              <ArrowRight className="size-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </SiteShell>
  );
}
