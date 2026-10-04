/**
 * content.ts — Blog posts and job listings, read from Supabase when the site is built.
 * Pages import from here and never touch the database layer directly.
 */
import { plainText } from './markdown';
import { site } from './site';
import { selectRows } from './supabase';

/* ------------------------------------------------------------------ shared helpers */

/**
 * Remembers a loader's result for the life of the process, so a production build asks Supabase once
 * per table rather than once per page. Not used in development, where edits should show on refresh.
 */
function oncePerBuild<T>(load: () => Promise<T>): () => Promise<T> {
  let pending: Promise<T> | undefined;
  return () => {
    if (process.env.NODE_ENV !== 'production') return load();
    return (pending ??= load());
  };
}

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** A slug becomes a file name and a URL, so anything unexpected is skipped rather than published. */
export const isValidSlug = (slug: unknown): slug is string => typeof slug === 'string' && SLUG_PATTERN.test(slug);

const WORDS_PER_MINUTE = 220;

export function readingMinutes(markdown: string): number {
  const words = plainText(markdown).split(' ').filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** "4 October 2026". Formatted in UTC so the build machine's timezone can't shift the day. */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso));
}

function skipInvalid<Row extends { slug?: unknown }>(table: string, rows: Row[]): Row[] {
  return rows.filter((row) => {
    if (isValidSlug(row.slug)) return true;
    console.warn(`[content] Skipping a row in "${table}" with an unusable slug: ${JSON.stringify(row.slug)}`);
    return false;
  });
}

/* ------------------------------------------------------------------ blog posts */

type PostRow = {
  slug: string;
  title: string;
  excerpt: string | null;
  content_md: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  author_name: string | null;
  tags: string[] | null;
  published_at: string;
  updated_at: string | null;
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: { src: string; alt: string } | null;
  author: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
};

export function toPost(row: PostRow): Post {
  const content = row.content_md ?? '';
  const excerpt = (row.excerpt ?? '').trim() || `${plainText(content).slice(0, 157).trimEnd()}…`;
  return {
    slug: row.slug,
    title: row.title.trim(),
    excerpt,
    content,
    coverImage: row.cover_image_url ? { src: row.cover_image_url, alt: row.cover_image_alt ?? '' } : null,
    author: (row.author_name ?? '').trim() || site.name,
    tags: (row.tags ?? []).map((tag) => tag.trim()).filter(Boolean),
    publishedAt: row.published_at,
    updatedAt: row.updated_at ?? row.published_at,
    readingMinutes: readingMinutes(content),
  };
}

/** Published posts, newest first. */
export const getPosts = oncePerBuild(async (): Promise<Post[]> => {
  const rows = await selectRows<PostRow>('posts', {
    select: 'slug,title,excerpt,content_md,cover_image_url,cover_image_alt,author_name,tags,published_at,updated_at',
    published: 'eq.true',
    order: 'published_at.desc',
  });
  return skipInvalid('posts', rows).map(toPost);
});

export async function getPost(slug: string): Promise<Post | undefined> {
  return (await getPosts()).find((post) => post.slug === slug);
}

/* ------------------------------------------------------------------ jobs */

export const EMPLOYMENT_TYPES = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACTOR: 'Contract',
  INTERN: 'Internship',
} as const;

export type EmploymentType = keyof typeof EMPLOYMENT_TYPES;

type JobRow = {
  slug: string;
  title: string;
  department: string | null;
  location: string | null;
  remote: boolean | null;
  employment_type: string | null;
  summary: string | null;
  description_md: string | null;
  apply_email: string | null;
  posted_at: string;
  closes_at: string | null;
};

export type Job = {
  slug: string;
  title: string;
  department: string;
  location: string;
  remote: boolean;
  employmentType: EmploymentType;
  summary: string;
  description: string;
  applyEmail: string;
  postedAt: string;
  closesAt: string | null;
};

export function toJob(row: JobRow): Job {
  const description = row.description_md ?? '';
  const type = row.employment_type as EmploymentType;
  return {
    slug: row.slug,
    title: row.title.trim(),
    department: (row.department ?? '').trim(),
    location: (row.location ?? '').trim() || `${site.city}, ${site.country}`,
    remote: row.remote ?? false,
    employmentType: type in EMPLOYMENT_TYPES ? type : 'FULL_TIME',
    summary: (row.summary ?? '').trim() || `${plainText(description).slice(0, 157).trimEnd()}…`,
    description,
    applyEmail: (row.apply_email ?? '').trim() || site.emails.general,
    postedAt: row.posted_at,
    closesAt: row.closes_at,
  };
}

/** Open roles, newest first. */
export const getJobs = oncePerBuild(async (): Promise<Job[]> => {
  const rows = await selectRows<JobRow>('jobs', {
    select: 'slug,title,department,location,remote,employment_type,summary,description_md,apply_email,posted_at,closes_at',
    published: 'eq.true',
    order: 'posted_at.desc',
  });
  return skipInvalid('jobs', rows).map(toJob);
});

export async function getJob(slug: string): Promise<Job | undefined> {
  return (await getJobs()).find((job) => job.slug === slug);
}

/** A mailto: link that opens an application email with the role in the subject line. */
export function applyHref(job: Job): string {
  return `mailto:${job.applyEmail}?subject=${encodeURIComponent(`Application: ${job.title}`)}`;
}

/* ------------------------------------------------------------------ navigation */

export type PageLink = { href: string; label: string };

/** Links to the content pages — each appears only once it has something to show. */
export async function getPageLinks(): Promise<PageLink[]> {
  const [posts, jobs] = await Promise.all([getPosts(), getJobs()]);
  const links: PageLink[] = [];
  if (posts.length > 0) links.push({ href: '/blog', label: 'Blog' });
  if (jobs.length > 0) links.push({ href: '/careers', label: 'Careers' });
  return links;
}
