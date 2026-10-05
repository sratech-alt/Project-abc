/**
 * catalog.ts — Services, projects and the tech stack, read from Supabase when the site is built.
 *
 * Unlike the blog, these sections must never be empty. So each loader falls back to the arrays in
 * lib/data.ts when its table is missing or has no published rows. Once a table has rows, the
 * database is the source of truth and lib/data.ts is only the safety net.
 */
import { isValidSlug, oncePerBuild } from './content';
import {
  projects as defaultProjects,
  services as defaultServices,
  stack as defaultStack,
  type Project,
  type ProjectLink,
  type Service,
  type ServiceVisual,
  type StackCategory,
} from './data';
import { normalizeSpans } from './layout';
import { selectRows } from './supabase';

/* ------------------------------------------------------------------ services */

export const SERVICE_VISUALS: ServiceVisual[] = ['phones', 'browser', 'checkout', 'pipeline', 'canvas', 'api', 'dashboard', 'uptime'];

type ServiceRow = {
  id: string;
  title: string;
  blurb: string | null;
  features: string[] | null;
  details: string[] | null;
  body_md: string | null;
  visual: string | null;
  span: number | null;
};

const cleanList = (list: string[] | null) => (list ?? []).map((item) => item.trim()).filter(Boolean);

export function toService(row: ServiceRow): Service {
  const visual = SERVICE_VISUALS.includes(row.visual as ServiceVisual) ? (row.visual as ServiceVisual) : 'dashboard';
  const span = row.span === 2 || row.span === 3 ? row.span : 1;
  return {
    id: row.id,
    title: row.title.trim(),
    blurb: (row.blurb ?? '').trim(),
    features: cleanList(row.features),
    details: cleanList(row.details),
    body: (row.body_md ?? '').trim() || undefined,
    visual,
    span,
  };
}

/** Services in display order, with spans adjusted so the three-column grid has no holes. */
export const getServices = oncePerBuild(async (): Promise<Service[]> => {
  const rows = await selectRows<ServiceRow>('services', {
    select: 'id,title,blurb,features,details,body_md,visual,span',
    published: 'eq.true',
    order: 'sort_order.asc,title.asc',
  });
  const fromDatabase = rows.filter((row) => isValidSlug(row.id)).map(toService);
  return normalizeSpans(fromDatabase.length > 0 ? fromDatabase : defaultServices) as Service[];
});

/* ------------------------------------------------------------------ projects */

type ProjectRow = {
  slug: string;
  title: string;
  category: string | null;
  platform: string | null;
  industry: string[] | null;
  description: string | null;
  highlight: string | null;
  highlights: string[] | null;
  body_md: string | null;
  image_url: string;
  image_width: number | null;
  image_height: number | null;
  tags: string[] | null;
  client: string | null;
  year: string | null;
  featured: boolean | null;
  links: unknown;
};

/** Keeps only well-formed `{ label, url }` entries with an https address. */
export function toLinks(value: unknown): ProjectLink[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    const label = typeof entry?.label === 'string' ? entry.label.trim() : '';
    const url = typeof entry?.url === 'string' ? entry.url.trim() : '';
    return label && /^https:\/\/\S+$/.test(url) ? [{ label, url }] : [];
  });
}

export function toProject(row: ProjectRow): Project {
  const links = toLinks(row.links);
  return {
    id: row.slug,
    title: row.title.trim(),
    category: (row.category ?? '').trim(),
    platform: row.platform === 'mobile' ? 'mobile' : 'web',
    industry: cleanList(row.industry),
    description: (row.description ?? '').trim(),
    highlight: (row.highlight ?? '').trim(),
    highlights: cleanList(row.highlights),
    body: (row.body_md ?? '').trim() || undefined,
    // Without real dimensions the browser can't reserve space; these keep the layout stable.
    image: { src: row.image_url, width: row.image_width ?? 1280, height: row.image_height ?? (row.platform === 'mobile' ? 2782 : 775) },
    tags: cleanList(row.tags),
    client: (row.client ?? '').trim(),
    year: (row.year ?? '').trim(),
    featured: row.featured ?? false,
    ...(links.length > 0 ? { links } : {}),
  };
}

/** Projects in display order. */
export const getProjects = oncePerBuild(async (): Promise<Project[]> => {
  const rows = await selectRows<ProjectRow>('projects', {
    select: 'slug,title,category,platform,industry,description,highlight,highlights,body_md,image_url,image_width,image_height,tags,client,year,featured,links',
    published: 'eq.true',
    order: 'sort_order.asc,title.asc',
  });
  const fromDatabase = rows.filter((row) => isValidSlug(row.slug) && /^(https:\/\/|\/)/.test(row.image_url ?? '')).map(toProject);
  return fromDatabase.length > 0 ? fromDatabase : defaultProjects;
});

/* ------------------------------------------------------------------ tech stack */

type CategoryRow = { id: string; label: string; summary: string | null };
type TechnologyRow = { name: string; abbr: string | null; purpose: string | null; category_id: string };

/** Groups technologies under their category, dropping categories that end up with none. */
export function toStack(categories: CategoryRow[], technologies: TechnologyRow[]): StackCategory[] {
  return categories
    .map((category) => ({
      id: category.id,
      label: category.label.trim(),
      summary: (category.summary ?? '').trim(),
      techs: technologies
        .filter((tech) => tech.category_id === category.id)
        .map((tech) => ({ name: tech.name.trim(), abbr: (tech.abbr ?? '').trim() || tech.name.trim().slice(0, 2), use: (tech.purpose ?? '').trim() })),
    }))
    .filter((category) => category.techs.length > 0);
}

/** Tech stack categories in display order, each with its technologies. */
export const getStack = oncePerBuild(async (): Promise<StackCategory[]> => {
  const [categories, technologies] = await Promise.all([
    selectRows<CategoryRow>('tech_categories', { select: 'id,label,summary', order: 'sort_order.asc,label.asc' }),
    selectRows<TechnologyRow>('technologies', { select: 'name,abbr,purpose,category_id', order: 'sort_order.asc,name.asc' }),
  ]);
  const fromDatabase = toStack(categories.filter((category) => isValidSlug(category.id)), technologies);
  return fromDatabase.length > 0 ? fromDatabase : defaultStack;
});
