import { ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';
import { Pagination, PostGrid, TagNav } from '@/components/PostList';
import { SiteShell } from '@/components/SiteShell';
import { collectTags, pageCount, postsOnPage } from '@/lib/blog';
import { getPosts } from '@/lib/content';
import { site } from '@/lib/site';

const description = `Engineering notes from ${site.name}: how we design, build and run web, mobile and custom software.`;

// The page is only offered to search engines once there is something on it.
export async function generateMetadata(): Promise<Metadata> {
  const hasPosts = (await getPosts()).length > 0;
  return {
    title: `Blog — ${site.name}`,
    description,
    alternates: { canonical: '/blog', types: { 'application/rss+xml': '/blog/feed.xml' } },
    robots: { index: hasPosts, follow: true },
    openGraph: { type: 'website', url: '/blog', title: `Blog — ${site.name}`, description, images: ['/og.png'] },
  };
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
            <>
              <TagNav tags={collectTags(posts)} />
              <PostGrid posts={postsOnPage(posts, 1)} />
              <Pagination page={1} pages={pageCount(posts)} />
            </>
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
