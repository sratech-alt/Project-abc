import { describe, expect, it } from 'vitest';
import { buildFeed, collectTags, pageCount, pageHref, POSTS_PER_PAGE, postsOnPage, postsWithTag, tagSlug } from './blog';
import type { Post } from './content';
import { availabilityLabel, site } from './site';
import { EMPTY_ROUTE, withPlaceholder } from './static-params';

const post = (slug: string, tags: string[] = [], publishedAt = '2026-10-01T09:00:00Z'): Post => ({
  slug,
  title: `Title of ${slug}`,
  excerpt: `Excerpt of ${slug}`,
  content: 'Body.',
  coverImage: null,
  author: site.name,
  tags,
  publishedAt,
  updatedAt: publishedAt,
  readingMinutes: 1,
});

const many = (count: number) => Array.from({ length: count }, (_, index) => post(`post-${index + 1}`));

describe('tagSlug', () => {
  it.each([
    ['Process', 'process'],
    ['Event-Driven Systems', 'event-driven-systems'],
    ['  CI/CD  ', 'ci-cd'],
    ['C# & .NET', 'c-net'],
    ['Résumé', 'resume'],
    ['!!!', ''],
  ])('%s → %s', (input, expected) => expect(tagSlug(input)).toBe(expected));
});

describe('collectTags / postsWithTag', () => {
  const posts = [post('a', ['Process', 'Quality']), post('b', ['process']), post('c', ['Architecture', '!!!']), post('d')];

  it('counts each topic, merging spellings that differ only in case, and puts the most used first', () => {
    expect(collectTags(posts)).toEqual([
      { slug: 'process', label: 'Process', count: 2 },
      { slug: 'architecture', label: 'Architecture', count: 1 },
      { slug: 'quality', label: 'Quality', count: 1 },
    ]);
  });

  it('finds the posts for a topic', () => {
    expect(postsWithTag(posts, 'process').map((entry) => entry.slug)).toEqual(['a', 'b']);
    expect(postsWithTag(posts, 'nothing')).toEqual([]);
  });

  it('has no topics when there are no posts', () => {
    expect(collectTags([])).toEqual([]);
  });
});

describe('pagination', () => {
  it('needs one page until the first page is full', () => {
    expect(pageCount([])).toBe(1);
    expect(pageCount(many(POSTS_PER_PAGE))).toBe(1);
    expect(pageCount(many(POSTS_PER_PAGE + 1))).toBe(2);
    expect(pageCount(many(POSTS_PER_PAGE * 3))).toBe(3);
  });

  it('splits posts across pages with none lost or repeated', () => {
    const posts = many(POSTS_PER_PAGE * 2 + 2);
    const pages = [1, 2, 3].map((page) => postsOnPage(posts, page));
    expect(pages.map((entries) => entries.length)).toEqual([POSTS_PER_PAGE, POSTS_PER_PAGE, 2]);
    expect(pages.flat().map((entry) => entry.slug)).toEqual(posts.map((entry) => entry.slug));
  });

  it('gives nothing for a page that does not exist', () => {
    for (const page of [0, -1, 1.5, 99, Number.NaN]) expect(postsOnPage(many(5), page)).toEqual([]);
  });

  it('puts page 1 at /blog and later pages at /blog/page/n', () => {
    expect(pageHref(1)).toBe('/blog');
    expect(pageHref(2)).toBe('/blog/page/2');
  });
});

describe('buildFeed', () => {
  it('lists posts with absolute links and escapes markup in titles', () => {
    const feed = buildFeed([{ ...post('a', ['R&D']), title: 'Fish & <Chips>', excerpt: 'Say "hi"' }]);
    expect(feed.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(feed).toContain(`<link>${site.url}/blog/a</link>`);
    expect(feed).toContain('<title>Fish &amp; &lt;Chips&gt;</title>');
    expect(feed).toContain('<description>Say &quot;hi&quot;</description>');
    expect(feed).toContain('<category>R&amp;D</category>');
    expect(feed).toContain('<pubDate>Thu, 01 Oct 2026 09:00:00 GMT</pubDate>');
    expect(feed).not.toMatch(/<(title|description)>[^<]*<(?!\/)/);
  });

  it('is still a valid, empty feed when there are no posts', () => {
    const feed = buildFeed([]);
    expect(feed).toContain('<channel>');
    expect(feed).not.toContain('<item>');
    expect(feed).not.toContain('lastBuildDate');
  });

  it('includes at most the newest posts up to the limit', () => {
    expect(buildFeed(many(50), 30).match(/<item>/g)).toHaveLength(30);
  });
});

describe('availabilityLabel', () => {
  it.each([
    ['2026-01-01T00:00:00Z', 'Q1'],
    ['2026-03-31T23:59:59Z', 'Q1'],
    ['2026-04-01T00:00:00Z', 'Q2'],
    ['2026-09-30T12:00:00Z', 'Q3'],
    ['2026-10-05T12:00:00Z', 'Q4'],
    ['2026-12-31T23:59:59Z', 'Q4'],
  ])('on %s it says %s', (date, quarter) => {
    expect(availabilityLabel(new Date(date))).toBe(`Available for ${quarter} projects`);
  });
});

describe('withPlaceholder', () => {
  it('pads an empty route list under the given parameter name', () => {
    expect(withPlaceholder([], 'page')).toEqual([{ page: EMPTY_ROUTE }]);
    expect(withPlaceholder([], 'tag')).toEqual([{ tag: EMPTY_ROUTE }]);
    expect(withPlaceholder([{ tag: 'process' }], 'tag')).toEqual([{ tag: 'process' }]);
  });
});
