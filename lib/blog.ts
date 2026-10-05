/**
 * blog.ts — Tags, pagination and the RSS feed for the blog. Pure functions over a list of posts,
 * so they can be tested without a database.
 */
import type { Post } from './content';
import { site } from './site';

export const POSTS_PER_PAGE = 9;

/* ------------------------------------------------------------------ tags */

/** "Event-Driven Systems" → "event-driven-systems". Used in the address /blog/tag/<slug>. */
export function tagSlug(tag: string): string {
  return (
    tag
      .toLowerCase()
      // Split accented letters into letter + accent, then drop the accents: "é" → "e".
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  );
}

export type Tag = { slug: string; label: string; count: number };

/** Every tag in use, most used first. Tags that differ only in case or punctuation are merged. */
export function collectTags(posts: Post[]): Tag[] {
  const tags = new Map<string, Tag>();
  for (const post of posts) {
    for (const label of post.tags) {
      const slug = tagSlug(label);
      if (!slug) continue;
      const existing = tags.get(slug);
      if (existing) existing.count += 1;
      else tags.set(slug, { slug, label, count: 1 });
    }
  }
  return [...tags.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function postsWithTag(posts: Post[], slug: string): Post[] {
  return posts.filter((post) => post.tags.some((tag) => tagSlug(tag) === slug));
}

/* ------------------------------------------------------------------ pagination */

export function pageCount(posts: Post[], perPage = POSTS_PER_PAGE): number {
  return Math.max(1, Math.ceil(posts.length / perPage));
}

/** The posts on a 1-based page. An out-of-range page is empty. */
export function postsOnPage(posts: Post[], page: number, perPage = POSTS_PER_PAGE): Post[] {
  if (!Number.isInteger(page) || page < 1) return [];
  return posts.slice((page - 1) * perPage, page * perPage);
}

/** Page 1 lives at /blog; later pages at /blog/page/<n>. */
export const pageHref = (page: number) => (page <= 1 ? '/blog' : `/blog/page/${page}`);

/* ------------------------------------------------------------------ RSS */

const escapeXml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

/** An RSS 2.0 feed of the newest posts. */
export function buildFeed(posts: Post[], limit = 30): string {
  const items = posts
    .slice(0, limit)
    .map((post) => {
      const url = `${site.url}/blog/${post.slug}`;
      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>`,
        `      <description>${escapeXml(post.excerpt)}</description>`,
        ...post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(`${site.name} — Blog`)}</title>`,
    `    <link>${site.url}/blog</link>`,
    `    <description>${escapeXml(`Engineering notes from ${site.name}.`)}</description>`,
    '    <language>en</language>',
    `    <atom:link href="${site.url}/blog/feed.xml" rel="self" type="application/rss+xml" />`,
    ...(posts.length > 0 ? [`    <lastBuildDate>${new Date(posts[0].publishedAt).toUTCString()}</lastBuildDate>`] : []),
    ...(items ? [items] : []),
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}
