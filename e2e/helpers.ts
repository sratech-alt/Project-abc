import { expect, type Page } from '@playwright/test';

export const PHONE = { width: 375, height: 812 };
export const WIDTHS = [320, 375, 768, 1024, 1280];

/** Scrolls down the page in steps, like a reader, so scroll-triggered content gets to appear; then returns to the top. */
export async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.7);
    for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await page.waitForTimeout(700);
}

/** How many pixels wider the page is than the window. 0 means no sideways scrolling. */
export const horizontalOverflow = (page: Page) =>
  page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));

/** Where a section must land after a jump: the height reserved for the fixed header (scroll-padding-top, 5.5rem). */
export const UNDER_HEADER = 88;

/**
 * Waits until an element has scrolled to `expected` pixels from the top of the window. Smooth
 * scrolling takes a second or two, so this retries until it arrives rather than measuring once.
 */
export async function expectTop(page: Page, selector: string, expected = UNDER_HEADER) {
  await expect
    .poll(() => page.locator(selector).evaluate((element) => Math.round(element.getBoundingClientRect().top)), {
      message: `${selector} should come to rest ${expected}px from the top`,
      timeout: 10_000,
    })
    .toBe(expected);
}

/** Collects console errors and uncaught exceptions for the life of the page. */
export function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

/** Internal links found on a page — used to discover the content pages that currently exist. */
export const linksMatching = (page: Page, pattern: RegExp) =>
  page.evaluate(
    (source) => [
      ...new Set(
        [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href') ?? '').filter((href) => new RegExp(source).test(href)),
      ),
    ],
    pattern.source,
  );
