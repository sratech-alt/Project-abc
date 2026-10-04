# test.md — Testing Standards

This is a static marketing site, so "testing" means small automated checks for the logic and data that can silently break, plus a manual checklist for everything visual — not a full end-to-end suite unless the project's complexity grows to justify one.

## What needs a test vs. what needs a manual check

| Type                                                            | Approach                                                                             |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Contact form validation and spam rules (`lib/validation.ts`)    | Automated: valid/invalid input cases                                                 |
| Content data integrity (`lib/data.ts`, `lib/site.ts`)           | Automated: unique ids, images exist, links are real, nav targets exist, grid tiles   |
| Conventions that are easy to break (dead `#` links, raw colours) | Automated: source scan in `lib/data.test.ts`                                         |
| Syntax highlighter (`lib/highlight.ts`)                         | Automated: lossless tokenizing, token types                                          |
| Database reader (`lib/supabase.ts`)                             | Automated with a fake `fetch`: missing table, retries, persistent failure, bad key   |
| Content mapping and page links (`lib/content.ts`)               | Automated: row → post/job, slug rules, dates, which nav links appear                 |
| Markdown rendering (`lib/markdown.ts`)                          | Automated: raw HTML escaped, unsafe links/images dropped, headings, code, tables     |
| Blog and careers pages with real content                        | Manual, after publishing a row                                                       |
| EmailJS delivery itself                                         | Manual (needs the live service; never send test messages from automated runs)        |
| Layout, responsiveness, visual spacing                          | Manual, cross-device/browser                                                         |
| Animation, reduced motion, no-JavaScript fallback               | Manual                                                                               |
| Accessibility (contrast, alt text, keyboard nav)                | Manual checklist, plus a Lighthouse/axe pass                                         |

## Automated testing setup

- Runner: Vitest. Run with `npm test`. Config: `vitest.config.mts`.
- Test files live alongside their source: `lib/validation.test.ts` next to `lib/validation.ts`, etc.
- Logic that needs testing belongs in `lib/` as pure functions, so tests need no browser or DOM.
- `npm run typecheck` and `npm run build` are part of "the tests passing".

## Current automated coverage

- `lib/validation.test.ts` — accepted submission, trimming, default subject, each missing field, malformed emails, short message, honeypot, too-fast submission.
- `lib/data.test.ts` — unique ids; no empty entries; project/team images exist in `public/`; mobile projects are portrait and web projects landscape; outbound links are https; at least one featured project; services tile the 3-column grid with no holes; verified testimonials are complete; every nav link has a matching section id; no `href="#"`; no raw hex colours or default-palette classes in components.
- `lib/highlight.test.ts` — tokenizing is lossless for every code sample; token types for Java, TypeScript and YAML.
- `lib/supabase.test.ts` — sends the public key and query; a missing table means "no content"; momentary 5xx and network failures are retried; persistent ones and 4xx fail the build; the configured key is never a secret key.
- `lib/content.test.ts` — slug rules, reading time, UTC date formatting, row-to-post and row-to-job mapping with fallbacks, bad-slug rows skipped, only published rows requested, page links appear only with content, placeholder route for empty tables.
- `lib/markdown.test.ts` — raw HTML shown as text, `javascript:`/`data:` links and non-https images dropped, external links open safely, `#` becomes `<h2>`, code blocks and tables are keyboard-scrollable.

## Manual test checklist (run before any release/handoff)

- [ ] All sections render with current data: Hero, About, Services, Tech Stack, Projects, Why Us, Contact, Footer (and Testimonials, if any are verified)
- [ ] Adding a new entry to each array (`projects`, `services`, `stack`, `reasons`, `testimonials`, `socials`) renders correctly with no markup edits
- [ ] Header: links scroll to the right section, the current section is highlighted, the mobile menu opens/closes (button, link click, Escape)
- [ ] Deep links (`/#contact`, `/#projects`) land with the section just under the header, on phone and desktop
- [ ] Mobile menu open: Tab stays within the header and menu, never reaching the page behind
- [ ] An address that doesn't exist shows the branded 404 page with a working link home
- [ ] Hero code window: tabs switch by click and arrow keys; long lines scroll inside the window, not the page
- [ ] Tech stack: each category button highlights its technologies; on phones only the selected category is listed
- [ ] Projects: "View case study" opens the dialog; Escape, the close button and a backdrop click all close it; focus returns to the card; store links open the right store page
- [ ] Blog: publish a row in Supabase, rebuild, and confirm it appears on `/blog`, opens at `/blog/<slug>`, and that "Blog" appears in the header, footer and `sitemap.xml`; unpublish it and confirm all of that disappears
- [ ] Careers: the same for a `jobs` row; "Apply by email" opens an email with the role in the subject; a role past its `closes_at` is gone after a rebuild
- [ ] A post with a code block, a table and a long link reads correctly at 320px with no page-level horizontal scroll
- [ ] From `/blog` or `/careers`, each header link lands on the right home-page section
- [ ] Contact form: empty submit is blocked with a message on the first missing field, and focus moves to it
- [ ] Contact form: a real submission arrives in the inbox, and the success message appears directly under the button
- [ ] Contact form: with the network offline, the error message appears under the button and includes the sales email address
- [ ] Phone (320px and 375px), tablet (768px), desktop (1024px, 1280px+): no horizontal scroll, nothing clipped or overlapping
- [ ] Keyboard only: Tab reaches the skip link first, then every control, each with a visible focus ring
- [ ] Reduced motion (OS setting on): content appears without sliding; the ticker is static
- [ ] JavaScript disabled: all content is still visible
- [ ] All images have `alt` text; text contrast is at least WCAG AA on the dark surfaces
- [ ] Every external link (socials, App Store, Google Play) loads a real page
- [ ] No console errors on load or interaction
- [ ] Lighthouse (mobile): Accessibility, Best Practices and SEO at 100, layout shift 0, no "non-composited animations" reported; axe reports no violations

## When a bug is found

- Don't just patch it — follow `debug.md` to find the root cause, then write a test here that would have caught it, so it can't silently regress.

## Definition of "tested"

A feature isn't done until it passes the automated tests, the build, and every relevant line of the manual checklist above.
