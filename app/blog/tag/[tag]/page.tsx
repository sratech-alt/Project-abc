import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { PostGrid, TagNav } from '@/components/PostList';
import { SiteShell } from '@/components/SiteShell';
import { collectTags, postsWithTag } from '@/lib/blog';
import { getPosts } from '@/lib/content';
import { withPlaceholder } from '@/lib/static-params';
import { site } from '@/lib/site';

type Params = { tag: string };

// One page per topic in use, generated at build time.
export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  return withPlaceholder(
    collectTags(await getPosts()).map((tag) => ({ tag: tag.slug })),
    'tag',
  );
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { tag: slug } = await params;
  const tag = collectTags(await getPosts()).find((entry) => entry.slug === slug);
  if (!tag) return { title: `Page not found — ${site.name}`, robots: { index: false } };
  return {
    title: `${tag.label} — Blog — ${site.name}`,
    description: `Articles about ${tag.label} from ${site.name}.`,
    alternates: { canonical: `/blog/tag/${tag.slug}`, types: { 'application/rss+xml': '/blog/feed.xml' } },
  };
}

export default async function TagPage({ params }: { params: Promise<Params> }) {
  const { tag: slug } = await params;
  const posts = await getPosts();
  const tags = collectTags(posts);
  const tag = tags.find((entry) => entry.slug === slug);
  if (!tag) notFound();

  return (
    <SiteShell>
      <PageHeader eyebrow="Blog · topic" title={tag.label}>
        {tag.count === 1 ? 'One article' : `${tag.count} articles`} on this topic.
      </PageHeader>
      <section aria-label="Articles" className="pb-16 sm:pb-20 lg:pb-24">
        <div className="container-page">
          <TagNav tags={tags} activeSlug={tag.slug} />
          <PostGrid posts={postsWithTag(posts, tag.slug)} />
        </div>
      </section>
    </SiteShell>
  );
}
