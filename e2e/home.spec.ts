import { expect, test } from '@playwright/test';
import { expectTop, PHONE, scrollThrough } from './helpers';

const EMAILJS = '**/api.emailjs.com/**';

test.describe('navigation', () => {
  test('header links jump to their section, just under the fixed header, and mark it as current', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    for (const [label, id] of [
      ['Services', 'services'],
      ['Projects', 'projects'],
      ['Contact', 'contact'],
      ['About', 'about'],
    ]) {
      await nav.getByRole('link', { name: label, exact: true }).click();
      await expectTop(page, `#${id}`);
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(nav.getByRole('link', { name: label, exact: true })).toHaveAttribute('aria-current', 'true');
    }
  });

  test('a deep link opens with the section under the header', async ({ page }) => {
    await page.goto('/#contact');
    await expectTop(page, '#contact');
  });

  test('from another page, a header link lands on the home-page section', async ({ page }) => {
    await page.goto('/privacy');
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Services', exact: true }).click();
    await expect(page).toHaveURL(/\/#services$/);
    await expectTop(page, '#services');
  });

  test('the phone menu opens, keeps focus out of the page behind it, and closes with Escape', async ({ page }) => {
    await page.setViewportSize(PHONE);
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Open navigation menu' });
    await toggle.click();
    await expect(page.locator('#mobile-menu')).toBeVisible();
    await expect(page.locator('main')).toHaveAttribute('inert', '');
    await expect(page.locator('#mobile-menu').getByRole('link', { name: 'Book a Discovery Call' })).toBeVisible();

    // Tab through more stops than the menu has: focus must never reach the page behind.
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => Boolean(document.activeElement?.closest('main, footer')))).toBe(false);
    }

    await page.keyboard.press('Escape');
    await expect(page.locator('#mobile-menu')).toHaveCount(0);
    await expect(page.locator('main')).not.toHaveAttribute('inert', '');
  });

  test('the first Tab stop is a skip link, and focus is always visible', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toHaveText('Skip to content');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const outline = await page
      .locator(':focus')
      .evaluate((element) => getComputedStyle(element).outlineStyle + ' ' + getComputedStyle(element).outlineWidth);
    expect(outline).toBe('solid 2px');
  });
});

test.describe('home page sections', () => {
  test('the code window switches files by click and by arrow key', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('tab', { name: 'Deploy.yml' }).click();
    await expect(page.getByRole('tab', { name: 'Deploy.yml' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel')).toContainText('runs-on: ubuntu-latest');
    await page.keyboard.press('ArrowLeft');
    await expect(page.getByRole('tab', { name: 'SpringBootService.java' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel')).toContainText('@KafkaListener');
  });

  test('the tech stack filter lights up one layer at a time', async ({ page }) => {
    await page.goto('/#stack');
    const filters = page.getByRole('group', { name: 'Filter technologies by layer' });
    await filters.getByRole('button', { name: 'DevOps' }).click();
    await expect(filters.getByRole('button', { name: 'DevOps' })).toHaveAttribute('aria-pressed', 'true');
    await expect(filters.locator('[aria-pressed="true"]')).toHaveCount(1);
  });

  test('each service card opens its own page, which links back', async ({ page }) => {
    await page.goto('/');
    await page.locator('#service-cloud').getByRole('link').click();
    await expect(page).toHaveURL(/\/services\/cloud$/);
    await expect(page.locator('h1')).toHaveText('Cloud & DevOps');
    await expect(page.getByRole('heading', { name: 'What’s included' })).toBeVisible();
    await page.getByRole('link', { name: 'All services' }).click();
    await expect(page).toHaveURL(/\/#services$/);
  });

  test('each project card opens its case study, which links back', async ({ page }) => {
    await page.goto('/');
    const card = page.locator('#projects article').first();
    const title = (await card.locator('h3').textContent())!.trim();
    await card.getByRole('link', { name: /view case study/i }).click();
    await expect(page).toHaveURL(/\/projects\/[a-z0-9-]+$/);
    await expect(page.locator('h1')).toHaveText(title);
    await page.getByRole('link', { name: 'All projects' }).click();
    await expect(page).toHaveURL(/\/#projects$/);
  });

  test('everything appears with reduced motion, and the ticker stops', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await scrollThrough(page);
    // The fade itself still plays (only movement is removed), so wait for it to finish.
    // Anything still hidden is brought on screen again, so a reveal missed by fast scrolling gets its chance.
    await expect
      .poll(() =>
        page.evaluate(() => {
          const hidden = [...document.querySelectorAll('[data-reveal]')].filter((element) => getComputedStyle(element).opacity !== '1');
          hidden[0]?.scrollIntoView({ block: 'center', behavior: 'instant' });
          return hidden.length;
        }),
      )
      .toBe(0);
    expect(await page.locator('.marquee-track').evaluate((element) => getComputedStyle(element).animationName)).toBe('none');
  });

  test('no looping animation runs on the main thread', async ({ page }) => {
    await page.goto('/');
    await scrollThrough(page);
    const animated = await page.evaluate(() => [
      ...new Set(
        document
          .getAnimations()
          .filter((animation) => animation.effect?.getComputedTiming().iterations === Infinity)
          .flatMap((animation) => (animation.effect as KeyframeEffect).getKeyframes().flatMap((frame) => Object.keys(frame)))
          .filter((property) => !['offset', 'easing', 'composite', 'computedOffset', 'transform', 'opacity'].includes(property)),
      ),
    ]);
    expect(animated).toEqual([]);
  });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('the content is still there to read', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#services h2')).toBeVisible();
    await expect(page.locator('#contact form')).toBeVisible();
  });
});

test.describe('contact form', () => {
  // A real submission must never leave a test run: every request to EmailJS is answered here.

  // The form refuses automated browsers (EmailJS `blockHeadless`). These tests are about what a
  // person sees, so the page is told it is an ordinary browser; the refusal has its own test below.
  const asOrdinaryBrowser = () => Object.defineProperty(navigator, 'webdriver', { get: () => false });

  test('refuses to send from an automated browser', async ({ page }) => {
    let sent = 0;
    await page.route(EMAILJS, (route) => {
      sent += 1;
      return route.abort();
    });
    await page.goto('/#contact');
    await page.waitForTimeout(2600);
    const form = page.getByRole('form', { name: 'Project enquiry' });
    await form.getByLabel(/your name/i).fill('Robot');
    await form.getByLabel(/email address/i).fill('robot@example.com');
    await form.getByLabel(/project overview/i).fill('This should be refused before any request is made.');
    await form.getByRole('button', { name: 'Send Message' }).click();
    await expect(form.getByRole('status')).toContainText('didn’t go through');
    expect(sent).toBe(0);
  });

  test('blocks an empty or malformed submission, pointing at the field', async ({ page }) => {
    let sent = 0;
    await page.route(EMAILJS, (route) => {
      sent += 1;
      return route.abort();
    });
    await page.goto('/#contact');
    const form = page.getByRole('form', { name: 'Project enquiry' });

    await form.getByRole('button', { name: 'Send Message' }).click();
    await expect(form.getByText('Please tell us your name.')).toBeVisible();
    await expect(form.getByLabel(/your name/i)).toBeFocused();

    await form.getByLabel(/your name/i).fill('Test Person');
    await form.getByLabel(/email address/i).fill('not-an-email');
    await form.getByRole('button', { name: 'Send Message' }).click();
    await expect(form.getByText('That email address doesn’t look right.')).toBeVisible();
    expect(sent).toBe(0);
  });

  test('sends the right fields and confirms right under the button', async ({ page }) => {
    await page.setViewportSize(PHONE);
    await page.addInitScript(asOrdinaryBrowser);
    let payload: Record<string, unknown> = {};
    await page.route(EMAILJS, async (route) => {
      if (route.request().method() === 'POST') payload = route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: 'OK',
        headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' },
      });
    });
    await page.goto('/#contact');
    await page.waitForTimeout(2600); // the form ignores submissions made faster than a person could type
    const form = page.getByRole('form', { name: 'Project enquiry' });
    await form.getByLabel(/your name/i).fill('Test Person');
    await form.getByLabel(/email address/i).fill('test@example.com');
    await form.getByLabel(/project type/i).fill('Automated test');
    await form.getByLabel(/project overview/i).fill('This message is intercepted by the test and never sent.');
    const button = form.getByRole('button', { name: 'Send Message' });
    await button.click();

    const status = form.getByRole('status');
    await expect(status).toContainText('your message has been sent');
    expect(Object.keys((payload.template_params as object) ?? {}).sort()).toEqual(['email', 'message', 'name', 'time', 'title']);
    await expect(form.getByLabel(/your name/i)).toHaveValue('');

    // The confirmation must be next to the button and on screen, not somewhere above the form.
    const [buttonBox, statusBox] = [await button.boundingBox(), await status.boundingBox()];
    expect(statusBox!.y - (buttonBox!.y + buttonBox!.height)).toBeLessThan(40);
    await expect(status).toBeInViewport();
  });

  test('says so when the message cannot be sent, and offers the email address', async ({ page }) => {
    await page.addInitScript(asOrdinaryBrowser);
    let attempts = 0;
    await page.route(EMAILJS, (route) => {
      attempts += 1;
      return route.abort();
    });
    await page.goto('/#contact');
    await page.waitForTimeout(2600);
    const form = page.getByRole('form', { name: 'Project enquiry' });
    await form.getByLabel(/your name/i).fill('Test Person');
    await form.getByLabel(/email address/i).fill('test@example.com');
    await form.getByLabel(/project overview/i).fill('This message is blocked by the test and never sent.');
    await form.getByRole('button', { name: 'Send Message' }).click();
    await expect(form.getByRole('status')).toContainText('sales@sabioratechnologies.com');
    expect(attempts).toBeGreaterThan(0); // it really tried, and the failure was the network's
  });
});
