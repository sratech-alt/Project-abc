import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { Pagination, PostGrid, TagNav } from '@/components/PostList';
import { SiteShell } from '@/components/SiteShell';
import { collectTags, pageCount, pageHref, postsOnPage } from '@/lib/blog';
import { getPosts } from '@/lib/content';
import { withPlaceholder } from '@/lib/static-params';
import { site } from '@/lib/site';

type Params = { page: string };

// Page 1 is /blog. Pages 2 and up are generated here, one per full page of posts.
export const dynamicParams = false;

export async function generateStaticParams(): Promise<Params[]> {
  const pages = pageCount(await getPosts());
  return withPlaceholder(
    Array.from({ length: pages - 1 }, (_, index) => ({ page: String(index + 2) })),
    'page',
  );
}

const pageNumber = (value: string) => (/^[1-9]\d*$/.test(value) ? Number(value) : 0);

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const page = pageNumber((await params).page);
  if (page < 2 || postsOnPage(await getPosts(), page).length === 0)
    return { title: `Page not found — ${site.name}`, robots: { index: false } };
  return {
    title: `Blog, page ${page} — ${site.name}`,
    description: `More engineering notes from ${site.name} (page ${page}).`,
    alternates: { canonical: pageHref(page), types: { 'application/rss+xml': '/blog/feed.xml' } },
  };
}

export default async function BlogListPage({ params }: { params: Promise<Params> }) {
  const page = pageNumber((await params).page);
  const posts = await getPosts();
  const onPage = page >= 2 ? postsOnPage(posts, page) : [];
  if (onPage.length === 0) notFound();

  return (
    <SiteShell>
      <PageHeader eyebrow={`Blog · page ${page}`} title="Notes from the people building it.">
        How we design, build and run software — written by the engineers doing the work.
      </PageHeader>
      <section aria-label="Articles" className="pb-16 sm:pb-20 lg:pb-24">
        <div className="container-page">
          <TagNav tags={collectTags(posts)} />
          <PostGrid posts={onPage} />
          <Pagination page={page} pages={pageCount(posts)} />
        </div>
      </section>
    </SiteShell>
  );
}
