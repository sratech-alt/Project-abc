# audit.md — Requirements & Quality Audit Log

Running log of every change to requirements, scope, coding style, or quality standards. This is the historical record — `scope.md` and `architecture.md` describe the _current_ state; this file explains _how it got there and why_.

## How to use this file

- Add a new dated entry every time a requirement, standard, or convention changes — not every time code changes (that belongs in `document.md`).
- Never delete or rewrite past entries. If a decision is reversed, add a new entry that supersedes it and link back.
- Each entry: what changed, why, what it replaces (if anything), who/what decided it.

## Entry format

```
### YYYY-MM-DD — Short title
**Changed:** what specifically changed
**Reason:** why it changed
**Supersedes:** link/reference to prior entry, or "N/A"
**Impact:** which files/sections/docs need to be updated as a result
```

## Log

### 2026-08-23 — Initial scope and doc structure established

**Changed:** Defined project scope (single-page, plain HTML/Tailwind/JS), section list (Hero, About, Services, Portfolio, Process/Why Us, Team, Testimonials, Contact), and the governance file set (scope, audit, architecture, develop, check, test, document, sync, debug, agents).
**Reason:** Requirements gathered from client discovery; needed a durable process so future changes don't erode consistency.
**Supersedes:** N/A
**Impact:** All docs in this set.

### 2026-08-23 — Content model set to array-driven

**Changed:** Projects, Team, Testimonials, and Socials are all rendered from JS arrays rather than hardcoded markup.
**Reason:** Client will add real project links, team members, and testimonials later; editing array values is lower-risk than editing markup.
**Supersedes:** N/A
**Impact:** `architecture.md`, `develop.md` data-file conventions.

### 2026-08-23 — Color system deferred to CSS variables

**Changed:** Beige confirmed as primary color; accent color left undecided, to be controlled via CSS custom properties in `index.css` rather than hardcoded Tailwind classes.
**Reason:** Client hasn't finalized accent color; variables let the whole site re-theme from one file later.
**Supersedes:** N/A
**Impact:** `architecture.md` theming section, `develop.md` styling conventions.

### 2026-09-01 — Light/dark theme toggle added to scope

**Changed:** Added a user-toggleable light/dark theme (persisted via localStorage, defaulting to OS preference on first visit) as an in-scope feature. All colors continue to route through the CSS custom properties in `index.css`; dark mode is implemented purely as an `html[data-theme="dark"]` override block, no per-element `dark:` utility classes needed.
**Reason:** Client request. Also surfaced during this pass: the light palette wasn't visibly blue-tinted despite the brand being blue, and two leftover off-brand colors existed (a beige scrollbar thumb, terracotta-tinted button hover shadows) from an earlier design iteration — both fixed to derive from the brand blue.
**Supersedes:** N/A
**Impact:** `index.css` (full palette rewrite + dark block), `index.html` (theme toggle buttons, anti-flash inline script, tailwind config brand colors de-hardcoded), `js/animations.js` (toggle click handling). `scope.md` and `architecture.md` updated to reflect theming now includes a dark variant.

### 2026-10-04 — Scope revised: full redesign on Next.js (React + TypeScript), dark-only theme

**Changed:** The site is rebuilt as a Next.js (App Router) + React + TypeScript project, statically exported (`output: 'export'`) so it is still a backend-free static site. This revises four core constraints at once:

1. _Framework / build step:_ "Plain HTML/CSS/JS — no framework, no required build step" is replaced by "Next.js static export; `npm run build` is required and produces `out/`".
2. _Animation library:_ Framer Motion is now an allowed dependency (loaded through `LazyMotion` + `domAnimation` to keep the bundle small). CSS keyframes are still preferred for anything that must work before JS loads (hero entrance, marquee, pipeline pulses).
3. _Icons:_ `lucide-react` replaces the unpinned Lucide CDN script. Lucide no longer ships brand icons, so social icons are inline SVGs in `components/ui/SocialIcon.tsx`.
4. _Theme:_ the site is dark-only. The light/dark toggle added on 2026-09-01 is removed.

Unchanged: single page with scroll navigation (no routing), mobile-first, no backend, repeatable content is array-driven, all colours go through CSS custom properties (now enforced — see below), EmailJS for the contact form, no blog / multi-language / pricing page.

New standards introduced alongside the redesign:

- **Colour tokens are enforced by tooling.** `app/globals.css` resets Tailwind's default palette (`--color-*: initial`) and defines the project tokens in `@theme`. A class like `bg-zinc-900` or a raw hex in a component simply produces no CSS. New colours are added as tokens first.
- **Testimonials must be real to be shown.** Each entry in `testimonials[]` has a `verified` flag; only `verified: true` entries render, and the section hides itself when there are none. The three entries inherited from the original template are `verified: false`.
- **No invented metrics.** Project cards carry a factual `highlight` (taken from what the project actually does or where it is published), never a made-up performance number.
- **No affordance without a destination.** A "View case study" control must open something real (the case-study dialog); store buttons only render when the project has a store URL.
- **EmailJS IDs are live values, not placeholders.** The previous wording ("placeholders until the client's account is connected") no longer matched the code. They live in `lib/site.ts`; EmailJS public keys are designed to be public, so abuse is limited client-side (honeypot, minimum fill time, SDK rate limit, headless blocking) and should additionally be restricted by domain in the EmailJS dashboard.
- **Images are published from `public/`, generated from `assets/`.** `assets/` holds the original source files and is not deployed. `npm run images` (`scripts/optimize-images.mjs`) produces the sized WebP/PNG files in `public/images/`.

**Reason:** Owner request for a complete redesign with a specified stack (Next.js, Tailwind, Framer Motion, lucide-react) and a dark, technical visual direction, combined with a site audit the same day that found: placeholder testimonials presented as real, dead links (Dribbble, Privacy, Terms), a non-clickable "View Project Details" overlay, the Tailwind Play CDN and unpinned `lucide@latest` in production, multi-megabyte images, lost focus rings, contrast failures, and docs that had drifted from the code (this file still said "beige", `architecture.md` said the theme followed the OS preference when the code always defaulted to light).
**Supersedes:** 2026-08-23 "Initial scope and doc structure established" (stack only); 2026-08-23 "Color system deferred to CSS variables" (beige/undecided accent — the palette is now dark slate with cyan/indigo accents); 2026-09-01 "Light/dark theme toggle added to scope" (toggle removed).
**Impact:** Entire codebase (`index.html`, `index.css`, `js/` removed; `app/`, `components/`, `lib/`, `public/`, `scripts/` added). `scope.md`, `architecture.md`, `develop.md`, `check.md`, `test.md`, `Agents.md` rewritten to describe the new stack. Deployment: Netlify must run `npm run build` and publish `out/` — configured in `netlify.toml`.

### 2026-10-04 — Looping animations must be compositor-only; deferred rendering rejected

**Changed:** Two standards added after a Lighthouse pass on the redesigned site.

1. Any animation that loops (`infinite`) may animate only `transform` and `opacity`. Animating `left`/`top`, `background-position`, `stroke-dashoffset`, `visibility`, sizes or colours in a loop is not allowed; if an effect can't be done with transform/opacity, run it on hover or once, not forever.
2. `content-visibility: auto` must not be used on page sections. It was tried and removed: with estimated section heights, anchor links and deep links landed in the wrong place.

Also: `backdrop-filter` is reserved for elements that sit over moving or varied content (the header, the nav pill, the dialog backdrop).
**Reason:** Twelve main-thread looping animations were the largest part of 9.2 s of main-thread work on a throttled phone. Navigation accuracy outranks the rendering saving from deferred sections.
**Supersedes:** N/A (refines the Animation rules introduced earlier the same day).
**Impact:** `architecture.md` (Animation Layer), `develop.md` (Animations), `check.md` (Animation conformance), `app/globals.css` keyframes.

### 2026-10-04 — Scope revised: Supabase content backend, blog and careers pages

**Changed:** Three things that were out of scope are now in scope.

1. _Backend:_ a Supabase project holds editable content. The site reads it **at build time only**, through Supabase's Data API with the public (publishable) key. The deployed site is still static files with no server; visitors' browsers never talk to Supabase.
2. _Blog / CMS-driven content:_ a blog (`posts` table) and careers listings (`jobs` table). Content is written in Markdown by developers in Supabase's table editor. There is no admin screen and no editor login on the site.
3. _Routing:_ the site is no longer a single page. New routes: `/blog`, `/blog/[slug]`, `/careers`, `/careers/[slug]`. The home page remains the scroll-navigation page it was.

New dependency: `marked` (Markdown to HTML, run at build time; adds no JavaScript to the pages).

New standards:

- **Database access is read-only and public-content-only.** Row Level Security is on for every table. The only policies allow anonymous `select` of rows where `published` is true and `published_at`/`posted_at` is not in the future. The secret (service-role) key and the database password are never used by the site and never committed.
- **Schema changes go through `supabase/schema.sql`.** That file is the record of the database; change it there and run it in the Supabase SQL editor, rather than editing tables by hand.
- **A missing table is not an error; an unreachable database is.** If a table doesn't exist yet the build treats it as "no content". Any other failure (network, 5xx, bad key) fails the build, so a Supabase outage can never publish a site with the blog wiped — Netlify keeps serving the last good deploy.
- **Navigation follows content.** "Blog" and "Careers" appear in the header, footer and sitemap only when there is at least one published post or open role. The pages themselves always exist.
- **Markdown from the database is rendered with raw HTML escaped.**
- **Careers takes applications by email.** No CV uploads and no applicant data stored. If uploads are added later, a privacy policy must come with them.

Still out of scope: request-time rendering, user accounts or logins on the site, an admin UI, comments, moving `projects`/`services`/`stack` to the database (planned as a later step, to be logged when it starts).
**Reason:** Owner decision to add a blog and careers section and to make site content editable without a code change, with developers as the only editors for now.
**Supersedes:** The "single page, no routing", "no backend" and "no blog / CMS" constraints from 2026-08-23 and the 2026-10-04 redesign entry.
**Impact:** `scope.md`, `architecture.md`, `develop.md`, `check.md`, `test.md`, `debug.md`, `Agents.md`; new `supabase/schema.sql`, `lib/supabase.ts`, `lib/content.ts`, `lib/markdown.ts`, `app/blog/*`, `app/careers/*`; `Navbar`/`Footer` links become `/#section` so they work from every page; `app/sitemap.ts` lists the new pages. Publishing content needs a rebuild: a Netlify build hook called by a Supabase database webhook (set up in the two dashboards).

### 2026-10-05 — Scope revised: all home-page content in Supabase, detail pages, blog extras, privacy page, lint and browser tests

**Changed:** Owner instruction to complete the remaining work in one pass. Six scope changes:

1. _Projects, services and tech stack move to Supabase._ New tables `projects`, `services`, `tech_categories`, `technologies`, read at build time like `posts` and `jobs`. The arrays in `lib/data.ts` stay as **defaults**: if a table is missing or has no published rows, the site uses them, so the home page can never lose a section. `supabase/seed.sql` loads the current content into the tables.
2. _Detail pages._ New routes `/services/[id]` and `/projects/[slug]`. The case-study dialog on the home page is replaced by links to the project pages.
3. _Blog extras._ New routes `/blog/tag/[tag]`, `/blog/page/[page]` and `/blog/feed.xml` (RSS).
4. _Privacy page._ New route `/privacy`, describing only what the site actually does with data.
5. _Lint and format._ New dev dependencies: ESLint (with `eslint-config-next`) and Prettier.
6. _Browser tests in the repo._ New dev dependencies: `@playwright/test` and `@axe-core/playwright`. They run against the built site with the locally installed Chrome.

New standards:

- **Database content has code defaults.** Any section that must never be empty (services, projects, tech stack) falls back to `lib/data.ts`. Blog and careers have no defaults: empty means empty.
- **The bento grid repairs itself.** Service `span` values now come from the database and may not tile three columns; `normalizeSpans()` widens cards so no row has a hole.
- **Availability is computed.** The "Available for Qn projects" line is derived from the build date instead of being typed in.
- **Formatting is Prettier's job.** `npm run format` before committing; `npm run lint` must pass.
- **`npm run test:e2e`** builds the site and runs the browser suite. It is part of "tested" for any change that touches layout, navigation or the form.
**Reason:** Owner request ("do all") after reviewing the list of remaining work.
**Supersedes:** In the 2026-10-04 Supabase entry: "Still out of scope: ... moving `projects`/`services`/`stack` to the database". In the 2026-10-04 redesign entry: "Case-study details shown in an on-page dialog (no separate pages)".
**Impact:** `supabase/schema.sql`, `supabase/seed.sql`, `lib/content.ts`, `lib/data.ts`, `lib/layout.ts`, `app/services/*`, `app/projects/*`, `app/blog/*`, `app/privacy/*`, `components/Projects.tsx`, `components/Services.tsx`, `components/TechStack.tsx`, `e2e/*`, lint/format/test config; `scope.md`, `architecture.md`, `develop.md`, `check.md`, `test.md`, `Agents.md`.

### 2026-10-05 — Database reads must not go through `fetch`

**Changed:** `lib/supabase.ts` now reads Supabase with Node's own HTTP client. Using `fetch` for build-time content is not allowed.
**Reason:** Bug found while testing pagination. Next.js wraps `fetch` and stores successful responses in `.next/cache/fetch-cache`, which survives between builds (hosts keep that folder). A later build reused the stored answer instead of asking the database, so newly published or removed content did not appear. The standard that was missing: "a rebuild always shows the database as it is now". Disabling the cache per request (`cache: 'no-store'`) is not possible in a static export — the build rejects it — so the fix is to stay outside the wrapped `fetch` altogether.
**Supersedes:** In the 2026-10-04 Supabase entry: "`lib/supabase.ts` calls Supabase's Data API with `fetch`".
**Impact:** `lib/supabase.ts`, `lib/supabase.test.ts` (a test starts a local server, changes its answer between two reads, and asserts that `fetch` is never called); `architecture.md`, `develop.md`, `debug.md`.

<!-- Add new entries above this line. Convention: chronological, most recent at the bottom. -->
