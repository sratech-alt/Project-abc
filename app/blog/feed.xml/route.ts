import { buildFeed } from '@/lib/blog';
import { getPosts } from '@/lib/content';

// Written once at build time as a plain file: /blog/feed.xml
export const dynamic = 'force-static';

export async function GET() {
  return new Response(buildFeed(await getPosts()), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
