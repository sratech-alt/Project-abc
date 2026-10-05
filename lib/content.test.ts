import { afterEach, describe, expect, it, vi } from 'vitest';
import { applyHref, formatDate, getJobs, getPageLinks, getPosts, isValidSlug, readingMinutes, toJob, toPost } from './content';
import { site } from './site';
import { EMPTY_ROUTE, withPlaceholder } from './static-params';
import { setTransport } from './supabase';

const postRow = {
  slug: 'release-checklist',
  title: '  The release checklist  ',
  excerpt: 'A short summary.',
  content_md: '## Why\n\nBecause **checklists** work.',
  cover_image_url: 'https://cdn.example.com/cover.png',
  cover_image_alt: 'A checklist',
  author_name: 'Engineering Team',
  tags: [' Process ', '', 'Quality'],
  published_at: '2026-10-01T09:00:00Z',
  updated_at: '2026-10-02T09:00:00Z',
};

const jobRow = {
  slug: 'backend-engineer',
  title: 'Backend Engineer',
  department: 'Engineering',
  location: 'Kathmandu, Nepal',
  remote: true,
  employment_type: 'FULL_TIME',
  summary: 'Build services.',
  description_md: '## Role\n\nBuild things.',
  apply_email: null,
  posted_at: '2026-09-28T09:00:00Z',
  closes_at: null,
};

let lastTransport = vi.fn();

/** Makes the Supabase client answer like Supabase's Data API for the given tables; anything else "doesn't exist yet". */
function stubDatabase(tables: Record<string, unknown[]>) {
  lastTransport = vi.fn(async (input: URL | string) => {
    const table = new URL(String(input)).pathname.split('/').pop() ?? '';
    return table in tables
      ? new Response(JSON.stringify(tables[table]), { status: 200 })
      : new Response(JSON.stringify({ code: 'PGRST205', message: 'missing' }), { status: 404 });
  });
  setTransport(lastTransport as unknown as typeof fetch);
}

afterEach(() => {
  setTransport();
  vi.restoreAllMocks();
});

describe('isValidSlug', () => {
  it.each(['a', 'release-checklist', 'kafka-101', '2026-in-review'])('accepts %s', (slug) => expect(isValidSlug(slug)).toBe(true));
  it.each(['', 'Bad Slug!', 'UPPER', 'trailing-', '-leading', 'double--hyphen', 'under_score', '../etc', 'a/b', EMPTY_ROUTE, null, 42])(
    'rejects %s',
    (slug) => expect(isValidSlug(slug)).toBe(false),
  );
});

describe('readingMinutes', () => {
  it('is never less than one minute and grows with length', () => {
    expect(readingMinutes('')).toBe(1);
    expect(readingMinutes('word '.repeat(220))).toBe(1);
    expect(readingMinutes('word '.repeat(660))).toBe(3);
  });
});

describe('formatDate', () => {
  it('formats in UTC, so the build machine’s timezone cannot shift the day', () => {
    expect(formatDate('2026-10-04T00:30:00Z')).toBe('4 October 2026');
    expect(formatDate('2026-10-04T23:30:00Z')).toBe('4 October 2026');
  });
});

describe('toPost', () => {
  it('maps a database row to a post, tidying whitespace and empty tags', () => {
    expect(toPost(postRow)).toEqual({
      slug: 'release-checklist',
      title: 'The release checklist',
      excerpt: 'A short summary.',
      content: postRow.content_md,
      coverImage: { src: 'https://cdn.example.com/cover.png', alt: 'A checklist' },
      author: 'Engineering Team',
      tags: ['Process', 'Quality'],
      publishedAt: '2026-10-01T09:00:00Z',
      updatedAt: '2026-10-02T09:00:00Z',
      readingMinutes: 1,
    });
  });

  it('fills the gaps when optional columns are empty', () => {
    const post = toPost({
      ...postRow,
      excerpt: '  ',
      cover_image_url: null,
      author_name: null,
      tags: null,
      updated_at: null,
      content_md: 'x '.repeat(200),
    });
    expect(post.excerpt.endsWith('…')).toBe(true);
    expect(post.excerpt.length).toBeLessThanOrEqual(158);
    expect(post.coverImage).toBeNull();
    expect(post.author).toBe(site.name);
    expect(post.tags).toEqual([]);
    expect(post.updatedAt).toBe(post.publishedAt);
  });
});

describe('toJob', () => {
  it('maps a database row to a job and falls back to the general contact address', () => {
    const job = toJob(jobRow);
    expect(job).toMatchObject({
      slug: 'backend-engineer',
      employmentType: 'FULL_TIME',
      remote: true,
      applyEmail: site.emails.general,
      closesAt: null,
    });
    expect(applyHref(job)).toBe(`mailto:${site.emails.general}?subject=Application%3A%20Backend%20Engineer`);
  });

  it('uses the row’s own apply address when it has one, and safe defaults for odd values', () => {
    const job = toJob({
      ...jobRow,
      apply_email: 'jobs@example.com',
      employment_type: 'NOT_A_TYPE',
      location: null,
      summary: null,
      remote: null,
    });
    expect(job.applyEmail).toBe('jobs@example.com');
    expect(job.employmentType).toBe('FULL_TIME');
    expect(job.location).toBe(`${site.city}, ${site.country}`);
    expect(job.remote).toBe(false);
    expect(job.summary.length).toBeGreaterThan(0);
  });
});

describe('loading content', () => {
  it('returns posts and jobs, skipping rows whose slug cannot become a URL', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    stubDatabase({ posts: [postRow, { ...postRow, slug: 'Bad Slug!' }], jobs: [jobRow] });

    expect((await getPosts()).map((post) => post.slug)).toEqual(['release-checklist']);
    expect((await getJobs()).map((job) => job.slug)).toEqual(['backend-engineer']);
    expect(warn).toHaveBeenCalledOnce();
  });

  it('asks only for published rows, newest first', async () => {
    stubDatabase({ posts: [], jobs: [] });
    await getPosts();
    const url = new URL(String(lastTransport.mock.calls[0][0]));
    expect(url.searchParams.get('published')).toBe('eq.true');
    expect(url.searchParams.get('order')).toBe('published_at.desc');
  });
});

describe('getPageLinks', () => {
  it('links to nothing while there is no content (or the tables do not exist yet)', async () => {
    stubDatabase({});
    expect(await getPageLinks()).toEqual([]);
  });

  it('links to each content page once it has something to show', async () => {
    stubDatabase({ posts: [postRow], jobs: [] });
    expect(await getPageLinks()).toEqual([{ href: '/blog', label: 'Blog' }]);

    stubDatabase({ posts: [postRow], jobs: [jobRow] });
    expect(await getPageLinks()).toEqual([
      { href: '/blog', label: 'Blog' },
      { href: '/careers', label: 'Careers' },
    ]);
  });
});

describe('withPlaceholder', () => {
  it('leaves real routes alone and pads an empty list with a slug no content can use', () => {
    expect(withPlaceholder([{ slug: 'a' }])).toEqual([{ slug: 'a' }]);
    expect(withPlaceholder([])).toEqual([{ slug: EMPTY_ROUTE }]);
  });
});
