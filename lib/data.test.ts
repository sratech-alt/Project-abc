import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { metrics, projects, reasons, services, socials, stack, team, testimonials } from './data';
import { navLinks, site } from './site';

const root = path.resolve(__dirname, '..');
const publicFile = (src: string) => path.join(root, 'public', src);

/** Every .tsx file under app/ and components/. */
function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    return full.endsWith('.tsx') ? [full] : [];
  });
}
const sources = [...sourceFiles(path.join(root, 'app')), ...sourceFiles(path.join(root, 'components'))].map((file) => ({
  file: path.relative(root, file),
  code: readFileSync(file, 'utf8'),
}));
const allCode = sources.map((source) => source.code).join('\n');

describe('source scan', () => {
  it('actually finds the component files it is meant to guard', () => {
    expect(sources.length).toBeGreaterThan(10);
  });
});

const unique = (values: string[]) => new Set(values).size === values.length;
const isHttps = (url: string) => /^https:\/\/[^\s]+$/.test(url);

describe('content arrays', () => {
  it('have unique ids', () => {
    expect(unique(projects.map((item) => item.id))).toBe(true);
    expect(unique(services.map((item) => item.id))).toBe(true);
    expect(unique(reasons.map((item) => item.id))).toBe(true);
    expect(unique(testimonials.map((item) => item.id))).toBe(true);
    expect(unique(team.map((item) => item.id))).toBe(true);
    expect(unique(stack.flatMap((category) => category.techs.map((tech) => tech.name)))).toBe(true);
  });

  it('have no empty entries', () => {
    expect(metrics.length).toBeGreaterThan(0);
    for (const project of projects) {
      expect(project.title && project.description && project.highlight).toBeTruthy();
      expect(project.highlights.length).toBeGreaterThan(0);
      expect(project.tags.length).toBeGreaterThan(0);
    }
    for (const service of services) {
      expect(service.title && service.blurb).toBeTruthy();
      expect(service.features.length).toBeGreaterThan(0);
    }
  });
});

describe('projects', () => {
  it('reference images that exist, with their real dimensions recorded', () => {
    for (const project of projects) {
      expect(existsSync(publicFile(project.image.src)), `${project.image.src} is missing — run "npm run images"`).toBe(true);
      expect(project.image.width).toBeGreaterThan(0);
      expect(project.image.height).toBeGreaterThan(0);
    }
  });

  it('show mobile projects as portrait images and web projects as landscape', () => {
    for (const project of projects) {
      const portrait = project.image.height > project.image.width;
      expect(portrait, project.id).toBe(project.platform === 'mobile');
    }
  });

  it('only link out to real https destinations', () => {
    for (const link of projects.flatMap((project) => project.links ?? [])) {
      expect(isHttps(link.url), link.url).toBe(true);
    }
  });

  it('have at least one featured project', () => {
    expect(projects.some((project) => project.featured)).toBe(true);
  });
});

describe('services bento grid', () => {
  it('fills the 3-column desktop grid with no holes', () => {
    let column = 0;
    for (const service of services) {
      expect(column + service.span, `"${service.title}" does not fit in its row`).toBeLessThanOrEqual(3);
      column = (column + service.span) % 3;
    }
    expect(column, 'the last row is not full').toBe(0);
  });
});

describe('testimonials', () => {
  it('only publish quotes that are complete', () => {
    for (const quote of testimonials.filter((item) => item.verified)) {
      expect(quote.quote.length).toBeGreaterThan(20);
      expect(quote.author && quote.title && quote.company).toBeTruthy();
    }
  });
});

describe('team', () => {
  it('reference images that exist', () => {
    for (const member of team) expect(existsSync(publicFile(member.image)), member.image).toBe(true);
  });
});

describe('links', () => {
  it('social profiles are https URLs', () => {
    for (const social of socials) expect(isHttps(social.url), social.url).toBe(true);
  });

  it('every navigation link points at a section that exists on the page', () => {
    for (const link of navLinks) {
      expect(allCode.includes(`id="${link.id}"`), `no <section id="${link.id}">`).toBe(true);
    }
  });

  it('there are no dead "#" links anywhere in the markup', () => {
    for (const source of sources) {
      expect(/href=["']#["']/.test(source.code), `${source.file} contains href="#"`).toBe(false);
    }
  });

  it('the phone number is international, and the link form matches what is displayed', () => {
    expect(site.phone.e164).toMatch(/^\+\d{8,15}$/);
    expect(site.phone.display.replace(/[^+\d]/g, '')).toBe(site.phone.e164);
  });

  it('the page title fits in a search result', () => {
    expect(site.title.length).toBeLessThanOrEqual(60);
  });

  it('contact addresses look like email addresses', () => {
    for (const address of Object.values(site.emails)) expect(address).toMatch(/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/);
  });
});

describe('theming convention', () => {
  it('components use design tokens, never raw hex colours', () => {
    for (const source of sources) {
      const match = source.code.match(/#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/);
      expect(match?.[0], `${source.file} contains a raw hex colour`).toBeUndefined();
    }
  });

  it('components do not use Tailwind default palette classes', () => {
    const palette =
      /\b(?:bg|text|border|from|via|to|ring|fill|stroke|shadow)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/;
    for (const source of sources) {
      expect(source.code.match(palette)?.[0], `${source.file} uses a default palette class`).toBeUndefined();
    }
  });
});
