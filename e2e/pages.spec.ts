import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { collectErrors, horizontalOverflow, linksMatching, PHONE, scrollThrough, WIDTHS } from './helpers';

/** Pages that always exist. Blog posts and jobs are discovered at run time, since they depend on the database. */
const PAGES = [
  '/',
  '/services/mobile-app',
  '/services/maintenance',
  '/projects/fashion-rental-platform',
  '/projects/aora-receipts-expenses',
  '/blog',
  '/careers',
  '/privacy',
];

for (const path of PAGES) {
  test.describe(`page ${path}`, () => {
    test('has no sideways scrolling at any supported width', async ({ page }) => {
      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: 800 });
        await page.goto(path);
        // No scrolling needed: the page's width is fixed by its layout, not by what has faded in.
        expect(await horizontalOverflow(page), `${path} at ${width}px`).toBe(0);
      }
    });

    for (const [name, viewport] of [
      ['desktop', { width: 1280, height: 800 }],
      ['phone', PHONE],
    ] as const) {
      test(`passes the accessibility checks on ${name}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(path);
        await scrollThrough(page);
        const { violations } = await new AxeBuilder({ page }).analyze();
        expect(violations.map((violation) => `${violation.id}: ${violation.nodes[0]?.target.join(' ')}`)).toEqual([]);
      });
    }

    test('has one main heading, a title and a description, and logs no errors', async ({ page }) => {
      const errors = collectErrors(page);
      await page.goto(path);
      await scrollThrough(page);
      await expect(page.locator('h1')).toHaveCount(1);
      expect((await page.title()).length).toBeGreaterThan(10);
      expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
      expect(errors).toEqual([]);
    });

    test('has no image without alt text or dimensions, and no dead "#" link', async ({ page }) => {
      await page.goto(path);
      const problems = await page.evaluate(() => ({
        noAlt: [...document.images].filter((image) => !image.hasAttribute('alt')).length,
        noSize: [...document.images].filter(
          (image) => !image.closest('.prose') && (!image.getAttribute('width') || !image.getAttribute('height')),
        ).length,
        deadLinks: [...document.querySelectorAll('a')].filter((a) => a.getAttribute('href') === '#').length,
        missingTargets: [...document.querySelectorAll('a[href^="#"]')]
          .map((a) => a.getAttribute('href')!.slice(1))
          .filter((id) => id && !document.getElementById(id)),
      }));
      expect(problems).toEqual({ noAlt: 0, noSize: 0, deadLinks: 0, missingTargets: [] });
    });
  });
}

test('every internal link on the home page leads to a page that exists', async ({ page, request }) => {
  await page.goto('/');
  const links = await linksMatching(page, /^\/(?!#)[a-z]/);
  expect(links.length).toBeGreaterThan(8);
  for (const href of links) {
    expect((await request.get(href)).status(), href).toBe(200);
  }
});

test('published jobs and posts each have a working page', async ({ page, request }) => {
  for (const [listing, pattern] of [
    ['/careers', /^\/careers\/[a-z0-9-]+$/],
    ['/blog', /^\/blog\/(?!tag\/|page\/|feed)[a-z0-9-]+$/],
  ] as const) {
    await page.goto(listing);
    for (const href of await linksMatching(page, pattern)) {
      expect((await request.get(href)).status(), href).toBe(200);
      await page.goto(href);
      await expect(page.locator('h1')).toHaveCount(1);
      expect(await horizontalOverflow(page), href).toBe(0);
      await page.goto(listing);
    }
  }
});

test('an address that does not exist shows the branded 404 page with a way home', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText('doesn’t exist');
  await page.getByRole('link', { name: /back to the homepage/i }).click();
  await expect(page).toHaveURL(/\/$/);
});

test('the search-engine files are served', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain('Sitemap: https://sabioratechnologies.com/sitemap.xml');

  const sitemap = await (await request.get('/sitemap.xml')).text();
  for (const path of ['/services/mobile-app', '/projects/fashion-rental-platform', '/privacy']) {
    expect(sitemap).toContain(`<loc>https://sabioratechnologies.com${path}</loc>`);
  }

  const feed = await request.get('/blog/feed.xml');
  expect(feed.status()).toBe(200);
  expect(await feed.text()).toContain('<rss version="2.0"');
});
