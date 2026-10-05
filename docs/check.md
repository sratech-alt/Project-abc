# check.md — Pattern & Standards Check

Run through this before marking any change complete. This checks _conformance_ to the standards in `scope.md`, `architecture.md`, and `develop.md` — it does not test functionality (see `test.md`) or write the change log (see `document.md`).

## Scope conformance

- [ ] Does this change fall within `scope.md`? If not, was it added to scope via an `audit.md` entry first?
- [ ] Does it avoid introducing anything explicitly listed as out-of-scope (request-time rendering, admin UI, database writes from the site, multi-language, pricing page, light theme)?
- [ ] Does it add a dependency? If so, is there an `audit.md` entry for it?

## Architecture conformance

- [ ] Does the file live in the correct location per `architecture.md`'s file structure?
- [ ] If it's repeatable content, is it driven from an array in `lib/data.ts` rather than hardcoded in a component?
- [ ] Is the component a server component unless it genuinely needs `'use client'`?
- [ ] Are all colours design tokens — zero raw hex values and zero default-palette classes in components?
- [ ] Is the responsive approach mobile-first (base classes = phone, breakpoints layer up)?
- [ ] Does the site still export statically (`npm run build` produces `out/` with no errors)?
- [ ] Is the database touched only at build time, only through `lib/content.ts` / `lib/catalog.ts`, only for reading, and never with `fetch`?
- [ ] If the defaults in `lib/data.ts` changed, was `npm run seed:generate` run?
- [ ] If what the site collects or shares changed, was `app/privacy/page.tsx` updated?
- [ ] Is any database change in `supabase/schema.sql`, with Row Level Security on and a published-rows-only read policy?
- [ ] No secret key, database password or `.env` file committed?

## Content conformance

- [ ] Is everything on the page true? No invented quotes, metrics, client names or logos.
- [ ] Are testimonials shown only when `verified: true`?
- [ ] Does every link, button and hover cue lead somewhere real (no `href="#"`)? Are section links written `/#section`?
- [ ] Are external links (socials, store pages) confirmed to load?

## Code style conformance

- [ ] TypeScript strict, no `any`; one component per file; pure logic in `lib/`.
- [ ] Are naming conventions consistent with existing code (see `develop.md`)?
- [ ] Are Tailwind utilities used instead of new custom CSS, unless justified and documented?

## Animation conformance

- [ ] Scroll reveals use `<Reveal>`, not a new observer?
- [ ] Framer Motion used via `m.*` only; above-the-fold motion is CSS, not JS?
- [ ] Does every looping animation change only `transform`/`opacity`?
- [ ] Does it still look right with reduced motion on, and with JavaScript off?

## Accessibility conformance

- [ ] Heading levels in order; every interactive element reachable by keyboard with a visible focus ring?
- [ ] Text contrast at least WCAG AA; tap targets at least 24×24px?
- [ ] Images have meaningful `alt` (or `alt=""`/`aria-hidden` if decorative)?

## Regression check

- [ ] Does this change break any existing section's layout, spacing, or responsiveness?
- [ ] No horizontal scroll at 320, 375, 768, 1024 and 1280px?
- [ ] `npm run typecheck`, `npm test` and `npm run build` all pass?

## Outcome

- If everything above passes → proceed to `test.md`.
- If anything fails → fix it, or if the failure reveals the standard itself needs to change, log that in `audit.md` and update the relevant doc(s) before proceeding.
