import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getProjects, getServices, getStack, SERVICE_VISUALS, toLinks, toProject, toService, toStack } from './catalog';
import { projects as defaultProjects, services as defaultServices, stack as defaultStack } from './data';
import { normalizeSpans } from './layout';
import { setTransport } from './supabase';

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

afterEach(() => setTransport());

const serviceRow = { id: 'data-engineering', title: ' Data Engineering ', blurb: 'Pipelines.', features: ['ETL', ' '], details: ['Warehousing'], body_md: '', visual: 'api', span: 2 };

const projectRow = {
  slug: 'new-project',
  title: 'New Project',
  category: 'Web Application',
  platform: 'web',
  industry: ['Retail'],
  description: 'A project.',
  highlight: 'Live',
  highlights: ['One', 'Two'],
  body_md: '## Background',
  image_url: 'https://cdn.example.com/shot.webp',
  image_width: 1200,
  image_height: 700,
  tags: ['React'],
  client: 'Acme',
  year: '2026',
  featured: true,
  links: [{ label: 'Site', url: 'https://example.com' }],
};

describe('normalizeSpans', () => {
  const spans = (list: { span: number }[]) => list.map((item) => item.span);
  const tiles = (list: { span: number }[], columns = 3) => {
    let used = 0;
    for (const item of list) {
      if (used + item.span > columns) return false;
      used = (used + item.span) % columns;
    }
    return used === 0;
  };

  it('leaves a list that already tiles untouched', () => {
    expect(spans(normalizeSpans(defaultServices))).toEqual(defaultServices.map((service) => service.span));
  });

  it.each([
    [[1], [3]],
    [[1, 1], [1, 2]],
    [[2, 2], [3, 3]],
    [[1, 3], [3, 3]],
    [[1, 1, 2, 1], [1, 2, 2, 1]],
    [[2, 1, 1], [2, 1, 3]],
    [[9, 0], [3, 3]],
  ])('repairs %j into %j', (input, expected) => {
    const result = normalizeSpans(input.map((span) => ({ span })));
    expect(spans(result)).toEqual(expected);
    expect(tiles(result)).toBe(true);
  });

  it('always produces full rows, whatever it is given', () => {
    for (let seed = 1; seed <= 200; seed++) {
      const list = Array.from({ length: (seed % 9) + 1 }, (_, index) => ({ span: ((seed * (index + 3)) % 3) + 1 }));
      expect(tiles(normalizeSpans(list)), JSON.stringify(list)).toBe(true);
    }
  });

  it('does not modify its input', () => {
    const input = [{ span: 1 }, { span: 1 }];
    normalizeSpans(input);
    expect(input).toEqual([{ span: 1 }, { span: 1 }]);
  });
});

describe('toService', () => {
  it('maps a row, tidying text and empty list entries', () => {
    expect(toService(serviceRow)).toEqual({ id: 'data-engineering', title: 'Data Engineering', blurb: 'Pipelines.', features: ['ETL'], details: ['Warehousing'], body: undefined, visual: 'api', span: 2 });
  });

  it('falls back to safe values for an unknown illustration or span', () => {
    const service = toService({ ...serviceRow, visual: 'hologram', span: 7, features: null, details: null, blurb: null });
    expect(service.visual).toBe('dashboard');
    expect(service.span).toBe(1);
    expect(service.features).toEqual([]);
  });

  it('knows every illustration the default services use', () => {
    for (const service of defaultServices) expect(SERVICE_VISUALS).toContain(service.visual);
  });
});

describe('toLinks', () => {
  it('keeps well-formed https links and drops everything else', () => {
    expect(toLinks([{ label: ' App Store ', url: 'https://apps.apple.com/x' }, { label: 'Bad', url: 'javascript:alert(1)' }, { label: '', url: 'https://x.y' }, { url: 'https://x.y' }, 'nope', null])).toEqual([
      { label: 'App Store', url: 'https://apps.apple.com/x' },
    ]);
    expect(toLinks('not an array')).toEqual([]);
    expect(toLinks(null)).toEqual([]);
  });
});

describe('toProject', () => {
  it('maps a row to a project', () => {
    expect(toProject(projectRow)).toEqual({
      id: 'new-project',
      title: 'New Project',
      category: 'Web Application',
      platform: 'web',
      industry: ['Retail'],
      description: 'A project.',
      highlight: 'Live',
      highlights: ['One', 'Two'],
      body: '## Background',
      image: { src: 'https://cdn.example.com/shot.webp', width: 1200, height: 700 },
      tags: ['React'],
      client: 'Acme',
      year: '2026',
      featured: true,
      links: [{ label: 'Site', url: 'https://example.com' }],
    });
  });

  it('copes with missing optional columns', () => {
    const project = toProject({ ...projectRow, platform: 'tablet', image_width: null, image_height: null, links: null, featured: null, body_md: null, tags: null });
    expect(project.platform).toBe('web');
    expect(project.image.width).toBeGreaterThan(0);
    expect(project.image.height).toBeGreaterThan(0);
    expect(project.links).toBeUndefined();
    expect(project.featured).toBe(false);
    expect(project.body).toBeUndefined();
  });
});

describe('toStack', () => {
  it('groups technologies under their category and drops empty categories', () => {
    const result = toStack(
      [
        { id: 'backend', label: 'Backend', summary: 'Services.' },
        { id: 'empty', label: 'Empty', summary: null },
      ],
      [
        { name: 'Go', abbr: 'Go', purpose: 'APIs', category_id: 'backend' },
        { name: 'Rust', abbr: null, purpose: null, category_id: 'backend' },
        { name: 'Orphan', abbr: 'Or', purpose: '', category_id: 'missing' },
      ],
    );
    expect(result).toEqual([
      { id: 'backend', label: 'Backend', summary: 'Services.', techs: [{ name: 'Go', abbr: 'Go', use: 'APIs' }, { name: 'Rust', abbr: 'Ru', use: '' }] },
    ]);
  });
});

describe('loading the catalog', () => {
  it('uses the defaults in lib/data.ts while the tables do not exist', async () => {
    stubDatabase({});
    expect(await getServices()).toEqual(defaultServices);
    expect(await getProjects()).toEqual(defaultProjects);
    expect(await getStack()).toEqual(defaultStack);
  });

  it('uses the defaults while the tables exist but are empty', async () => {
    stubDatabase({ services: [], projects: [], tech_categories: [], technologies: [] });
    expect(await getServices()).toEqual(defaultServices);
    expect(await getProjects()).toEqual(defaultProjects);
    expect(await getStack()).toEqual(defaultStack);
  });

  it('uses the database once it has rows, repairing the grid and skipping unusable rows', async () => {
    stubDatabase({
      services: [serviceRow, { ...serviceRow, id: 'Bad Id' }],
      projects: [projectRow, { ...projectRow, slug: 'no-image', image_url: 'ftp://x' }],
      tech_categories: [{ id: 'backend', label: 'Backend', summary: '' }],
      technologies: [{ name: 'Go', abbr: 'Go', purpose: 'APIs', category_id: 'backend' }],
    });
    const services = await getServices();
    expect(services.map((service) => service.id)).toEqual(['data-engineering']);
    expect(services[0].span).toBe(3); // a lone two-column card is widened to fill its row
    expect((await getProjects()).map((project) => project.id)).toEqual(['new-project']);
    expect((await getStack()).map((category) => category.id)).toEqual(['backend']);
  });

  it('asks only for published services and projects, in their set order', async () => {
    stubDatabase({ services: [], projects: [], tech_categories: [], technologies: [] });
    await getServices();
    await getProjects();
    const calls = lastTransport.mock.calls.map(([input]) => new URL(String(input)));
    for (const url of calls) {
      expect(url.searchParams.get('published')).toBe('eq.true');
      expect(url.searchParams.get('order')).toMatch(/^sort_order\.asc/);
    }
  });
});

describe('supabase/seed.sql', () => {
  const seed = readFileSync(path.resolve(__dirname, '..', 'supabase', 'seed.sql'), 'utf8');

  it('is in step with the defaults in lib/data.ts (run "npm run seed:generate" if this fails)', () => {
    for (const service of defaultServices) expect(seed, service.id).toContain(`values ('${service.id}', '${service.title.replace(/'/g, "''")}'`);
    for (const project of defaultProjects) expect(seed, project.id).toContain(`values ('${project.id}', '${project.title.replace(/'/g, "''")}'`);
    for (const category of defaultStack) {
      for (const tech of category.techs) expect(seed, tech.name).toContain(`values ('${tech.name}', '${tech.abbr}'`);
    }
  });

  it('never overwrites rows that already exist', () => {
    const inserts = seed.match(/^insert into/gm) ?? [];
    const guards = seed.match(/^on conflict \([a-z_]+\) do nothing;/gm) ?? [];
    expect(inserts.length).toBeGreaterThan(0);
    expect(guards.length).toBe(inserts.length);
  });
});
