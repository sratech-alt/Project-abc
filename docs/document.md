# document.md — Change Documentation

Every meaningful change gets logged here in a human-readable way, and produces a matching commit/MR message. This is the "what happened and why" record, separate from `audit.md` (which is specifically for _standards/requirements_ changes).

## Change log format

```
### YYYY-MM-DD — Short title
**What:** what was implemented/changed, in plain language
**Why:** the reason or request behind it
**Files touched:** list of key files
**Related:** link to audit.md entry if this stemmed from a requirements change; link to test.md updates if tests were added
```

## Example entry

```
### 2026-08-24 — Add Testimonials section rendering
**What:** Implemented renderTestimonials() in render.js, wired to the testimonials[] array in data.js. Added the container markup in index.html and matching Tailwind card styles.
**Why:** Testimonials section was confirmed in scope (see audit.md 2026-08-23) but not yet built.
**Files touched:** js/data.js, js/render.js, index.html, index.css
**Related:** audit.md — 2026-08-23 entry; test.md — added render.test.js cases for empty/single/multiple testimonials
```

## Commit message convention

Format: `<type>: <short summary>`

Types: `feat` (new feature/section), `fix` (bug fix), `style` (visual/CSS only, no logic change), `refactor` (restructure, no behavior change), `docs` (changes to these governance files), `chore` (tooling, config, non-functional)

Example: `feat: add testimonials section with array-driven rendering`

Body (if needed): 2-3 lines max, explaining _why_, not restating the diff.

## MR/PR description template

```
## What
Short summary of the change.

## Why
The requirement or problem this addresses.

## How to verify
Steps a reviewer can follow to confirm it works (tie to test.md checklist items where relevant).

## Notes
Anything a reviewer should know — placeholders left in, follow-up work needed, etc.
```

## Rule of thumb

If someone with no context on this project read only this file top to bottom, they should understand what the site currently does and how it got there — without needing to read every commit individually.

## Change Log

### 2026-10-05 — Catalog in Supabase, Detail Pages, Blog Extras, Privacy Page, Stale-Content Fix
**What:** First part of the owner's "do all" request.

- _Fix — stale content after a rebuild:_ Next.js was saving Supabase responses in `.next/cache` and reusing them on later builds, so newly published content could fail to appear. `lib/supabase.ts` now uses Node's HTTP client, which that cache does not touch. Proven with three consecutive builds against a stand-in database whose content changed each time (12 posts → 2 → 12), cache kept throughout.
- _Services, projects and the tech stack are now read from Supabase_ (`lib/catalog.ts`; new tables in `supabase/schema.sql`). `lib/data.ts` remains as the fallback when a table is missing or empty, so the home page cannot lose a section. `supabase/seed.sql`, generated from `lib/data.ts` by `npm run seed:generate`, loads the current content. `normalizeSpans()` keeps the services grid free of holes whatever spans the database holds.
- _Detail pages:_ `/services/[id]` (the full "what's included" list from the original site, the service illustration, links to other services) and `/projects/[slug]` (case study, stack, store links, more work). The home-page case-study dialog is gone; cards link to the pages, and `Projects` is now a server component with no client JavaScript.
- _Blog extras:_ topic pages (`/blog/tag/[tag]`), pagination nine to a page (`/blog/page/[n]`), an RSS feed (`/blog/feed.xml`).
- _Privacy page_ (`/privacy`), linked from the footer and the contact form. It states only what the site does: what the form sends, that EmailJS and Netlify process it, no analytics or tracking cookies.
- _Availability line_ is now computed from the build date ("Available for Qn projects"), so it cannot go stale.
- Sitemap lists the new pages; each has its own metadata and structured data (`Service`, `CreativeWork`).

_Needs the owner:_ run the updated `supabase/schema.sql` and then `supabase/seed.sql` to move services, projects and the stack into the database (until then the site uses the code defaults and looks the same); review the wording of the privacy page.
**Why:** Owner instruction to complete all remaining work.
**Files touched:** new `lib/catalog.ts`, `lib/blog.ts`, `lib/layout.ts` and tests, `supabase/seed.sql`, `scripts/generate-seed.mjs`, `app/services/[id]`, `app/projects/[slug]`, `app/blog/tag/[tag]`, `app/blog/page/[page]`, `app/blog/feed.xml`, `app/privacy`, `components/ProjectPreview.tsx`, `components/PostList.tsx`; changed `lib/supabase.ts`, `lib/content.ts`, `lib/data.ts`, `lib/site.ts`, `lib/static-params.ts`, `supabase/schema.sql`, `app/page.tsx`, `app/sitemap.ts`, `components/Projects.tsx`, `components/Services.tsx`, `components/TechStack.tsx`, `components/Navbar.tsx`, `components/SiteShell.tsx`, `components/Footer.tsx`, `components/Contact.tsx`; docs.
**Related:** audit.md — 2026-10-05 "Scope revised: all home-page content in Supabase…" and "Database reads must not go through `fetch`"; test.md — 47 new unit tests (145 total).

### 2026-10-04 — Supabase Content Backend, Blog and Careers Pages
**What:** Added a Supabase project as a build-time content source and four new routes. (1) `supabase/schema.sql` defines `posts` and `jobs` with Row Level Security (public read of published rows only), an `updated_at` trigger and a public `media` storage bucket. (2) `lib/supabase.ts` reads the Data API with plain `fetch` (no SDK), retrying momentary failures; `lib/content.ts` maps rows to `Post`/`Job` and decides which page links exist; `lib/markdown.ts` renders Markdown with raw HTML escaped and unsafe links dropped (new dependency: `marked`, build-time only). (3) Pages `/blog`, `/blog/[slug]`, `/careers`, `/careers/[slug]`, with per-page metadata, `BlogPosting` and `JobPosting` structured data, and friendly empty states. Careers applications are a `mailto:` link per role. (4) `SiteShell` now frames every page; header, mobile menu and footer links became `/#section` so they work from sub-pages, and "Blog"/"Careers" appear in navigation and the sitemap only when there is published content. With those links present the desktop pill navigation starts at 1280px. Empty list pages are marked `noindex`.

Behaviour worth knowing: a table that does not exist yet means "no content" and the build passes; a persistent Supabase failure fails the build so the previous deploy stays live. Verified by building against a local stand-in serving sample rows (content, empty, and outage modes) and against the real project while its tables did not yet exist.

_Needs the owner:_ run `supabase/schema.sql` in the Supabase SQL editor; create a Netlify build hook and a Supabase database webhook on `posts` and `jobs` that calls it, so publishing triggers a rebuild.
**Why:** Owner decision to add a blog and careers section and make content editable without a code change, with developers editing in the Supabase dashboard.
**Files touched:** new `supabase/schema.sql`, `lib/supabase.ts`, `lib/content.ts`, `lib/markdown.ts`, `lib/static-params.ts` and their tests, `app/blog/*`, `app/careers/*`, `components/SiteShell.tsx`, `components/PageHeader.tsx`, `components/Prose.tsx`; changed `components/Navbar.tsx`, `components/Footer.tsx`, `app/page.tsx`, `app/sitemap.ts`, `app/globals.css` (`.prose`), `lib/site.ts`, `package.json`; docs: `scope.md`, `architecture.md`, `develop.md`, `check.md`, `test.md`, `debug.md`, `audit.md`, `Agents.md`.
**Related:** audit.md — 2026-10-04 "Supabase content backend, blog and careers pages"; test.md — 56 new unit tests (98 total) across `supabase.test.ts`, `content.test.ts`, `markdown.test.ts`.

### 2026-10-04 — SEO: Shorter Title, Key Phrase in a Heading, Phone Number
**What:** (1) Page title shortened from 77 to 59 characters — "Sabiora Technologies — Software Company in Kathmandu, Nepal" — so search results no longer cut it off; a unit test keeps it at 60 or under. (2) The About heading now reads "A full-stack software development company in Kathmandu, Nepal.", putting the phrase people search for back into a heading (it had been in body text only since the redesign). (3) Added the company phone number (+977 9764397139) to the contact section, the footer and the structured data (`telephone`), stored once in `lib/site.ts`.
**Why:** Owner asked what more could be done for SEO after the site was submitted to Google Search Console and Bing, and supplied the phone number. The site is now verified in both (Bing via `public/BingSiteAuth.xml`, Google via a DNS record), with the sitemap submitted.
**Files touched:** lib/site.ts, components/About.tsx, components/Contact.tsx, components/Footer.tsx, app/layout.tsx, lib/data.test.ts, docs/document.md
**Related:** test.md — two new unit tests (title length, phone format). No standards changed.

### 2026-10-04 — Post-Redesign Audit Fixes, Performance Pass, Footer Wave Restored
**What:** A second audit of the redesigned build (axe accessibility engine, Lighthouse, and browser checks at sizes and states not covered the first time), the fixes it led to, and the footer wave.

- _Mobile menu:_ keyboard focus could Tab out of the open menu into the covered page. `<main>` and `<footer>` are now `inert` while the menu is open.
- _404 page:_ was the framework default with no way back. Added a branded `app/not-found.tsx` with a link to the homepage (exported as `404.html`).
- _Performance:_ twelve decorative animations ran on the main thread indefinitely (dashed connector lines animated `background-position`, the pipeline dot animated `left`, API lines animated `stroke-dashoffset`, the cursor animated `visibility`). They now animate only `transform`/`opacity`; the API lines animate on card hover only. The headline and intro slide in without ever being invisible (`animate-rise`), so the main content paints immediately. Removed `backdrop-filter` blur where it had no visible effect (code window, glass buttons, contact form). Lighthouse main-thread work fell from 9.2 s to about 4.3 s; mobile Performance went from 77 to 81–92 (it varies between runs), desktop is 98.
- _Tried and reverted:_ `content-visibility: auto` on below-the-fold sections. It cut rendering work but made anchor links land in the wrong place on the first jump (a deep link to `#contact` landed thousands of pixels off), so it was removed.
- _Scroll lock:_ `scrollbar-gutter: stable` so the page no longer shifts sideways when the menu or a case-study dialog locks scrolling. The hero headline was reduced slightly at 1024px to fit the column this leaves.
- _Code window:_ auto-rotation now stops as soon as the pointer or keyboard focus enters it, not only on click.
- _LinkedIn link:_ `socials[]` now points to the company page (`linkedin.com/company/sabioratech/`, supplied by the owner) instead of the personal-profile `/in/` address. The Instagram link was likewise corrected to `instagram.com/sabioratech/`. Both also update the `sameAs` list in the structured data.
- _Footer wave:_ the layered wave from the original site is back above the footer (`components/FooterWave.tsx`), using the original curves recoloured with the new tokens — indigo and cyan swells, a glowing tracing line, and a front wave in the footer's colour. The footer is now solid `raised` so the wave resolves into it. The two swells and the tracing line drift slowly sideways at different speeds (`animate-wave`); each is its own element animated with `transform` only, and the front wave stays still.

Results on the final build: axe reports 0 violations (desktop, phone, dialog open); Lighthouse Accessibility 100, Best Practices 100, SEO 100, layout shift 0; no horizontal overflow from 320px to 2560px or in landscape; the form's success and failure paths both verified with the EmailJS request answered locally (no message was sent).
**Why:** Owner asked whether the redesigned site had any issues, and asked for the previous footer wave to be brought back in the new theme.
**Files touched:** `app/not-found.tsx` (new), `components/FooterWave.tsx` (new), `app/globals.css`, `components/Navbar.tsx`, `components/Hero.tsx`, `components/CodeTerminal.tsx`, `components/Contact.tsx`, `components/Footer.tsx`, `components/services/visuals.tsx`, `docs/*`.
**Related:** audit.md — 2026-10-04 "Looping animations must be compositor-only"; test.md — manual checklist extended (404 page, menu focus, Lighthouse/axe).

### 2026-10-04 — Full Redesign on Next.js (Dark Theme) + Site Audit Fixes
**What:** Rebuilt the whole site as a Next.js (App Router) + React + TypeScript + Tailwind v4 project, statically exported to `out/`. The old `index.html`, `index.css` and `js/` are removed (they remain in git history on `main`).

_New design:_ dark slate canvas with cyan/indigo accents, dot-grid and ambient glows, glass cards with a cursor-following highlight. Sections: floating-pill header with availability status and "Book a Discovery Call"; hero with a tabbed, syntax-highlighted code window (`Architecture.ts`, `SpringBootService.java`, `Deploy.yml`) and a metrics bar; About as a short statement plus an at-a-glance spec sheet; Services as a bento grid of all 8 services, each with a CSS-drawn illustration; Tech Stack with an infinite ticker and a category selector; Projects as three featured case-study cards plus an "Also shipped" row, each opening a case-study dialog; Why Sabiora (5 cards); Testimonials (hidden until real quotes exist); a combined CTA + contact form; a 4-column footer.

_Audit findings fixed along the way:_
- Template testimonials shown as real → entries flagged `verified: false`; the section renders only verified quotes.
- "Built for our partners" copy contradicted the project data → replaced with "Products we've designed, engineered and shipped"; project badges are facts, not invented metrics.
- Dead Privacy/Terms links (`href="#"`) → removed; a plain note under the form says how submitted details are used. A unit test now fails on any `href="#"`.
- Dribbble link (404, icon rendered as a blob) → removed from `socials[]`.
- Form result message appeared ~840px above the button on phones → now directly under the submit button, in an `aria-live` region.
- No contact link in the desktop header → "Book a Discovery Call" in the header at every width from 640px, and in the mobile menu.
- Mobile-app screenshots cropped to 29% → shown as portrait posters.
- "View Project Details" led nowhere and had no backing gradient → "View case study" opens a real dialog; store buttons only appear when a store URL exists.
- Card fade-in broken / hover lag from shared transition delays → reveals and hovers are now separate mechanisms.
- Hero stat overflow ("Kathmandu" clipped) and floating icons overlapping the headline → metrics bar rebuilt, verified from 320px up.
- Low-contrast footer tagline, dark-mode accent text, 10px labels → every text colour passes WCAG AA (0 failures across ~290 text elements, measured).
- Lost focus rings → one global `:focus-visible` style; skip link added; heading levels no longer skip.
- Tailwind Play CDN and unpinned `lucide@latest` in production → compiled CSS (10 KB) and tree-shaken icons; no third-party requests at page load.
- Oversized images (≈1.8 MB) → 149 KB total, with width/height on every image.
- Hero text invisible until JS ran → hero entrance is CSS; scroll-reveal content is shown by a `<noscript>` rule when JS is off.
- No social/search metadata → Open Graph + Twitter card, canonical, JSON-LD, theme-color, `robots.txt`, `sitemap.xml`, `og.png`.
- No spam protection on the form → honeypot, minimum fill time, EmailJS SDK rate limit and headless block.
- JS smooth-scroll handler that swallowed the URL hash → native anchors with `scroll-padding-top`.

_Still needs the owner:_ real testimonials; confirm the LinkedIn URL (it is a personal-profile `/in/` address, not a `/company/` page) and that the X and Instagram profiles are the right ones; restrict the allowed domain for the EmailJS key in the EmailJS dashboard; send one real form submission after deploy (delivery was not tested — automated runs block the request on purpose); a proper privacy policy if one is wanted; confirm Netlify builds from the repo (it must run `npm run build` and publish `out/`, per `netlify.toml`).
**Why:** Owner request for a complete, dark, technical redesign on a specified stack, plus "fix the issues found" from the same-day audit.
**Files touched:** removed `index.html`, `index.css`, `js/*`; added `app/*`, `components/*`, `lib/*`, `public/*`, `scripts/optimize-images.mjs`, `package.json`, `package-lock.json`, `next.config.mjs`, `postcss.config.mjs`, `tsconfig.json`, `vitest.config.mts`, `netlify.toml`, `.gitignore`; rewrote `docs/scope.md`, `docs/architecture.md`, `docs/develop.md`, `docs/check.md`, `docs/test.md`; updated `docs/debug.md`, `docs/audit.md`, `Agents.md`.
**Related:** audit.md — 2026-10-04 scope revision (framework, build step, animation library, dark-only theme, content-honesty rules); test.md — new Vitest suite (40 tests: form validation, data integrity, dead-link and colour-token guards, highlighter), old `js/render.test.js` retired with the code it tested. Verified in headless Chrome at 320/375/768/1024/1280/1440px: no horizontal overflow, no console errors, menu/dialog/filter/form interactions, keyboard focus, reduced motion, JavaScript disabled.

### 2026-09-01 — Light/Dark Theme, About Section Simplified to Prose, Color Cleanup
**What:** (1) About section: removed the card/widget-based "Technologies We Work With" panel and the "Full-Stack Engineering" / "Production-Grade Systems" boxes entirely — that information is now a plain paragraph in the About copy instead of a separate visual component. (2) Added a full light/dark theme system: rewrote `index.css` with a dark-mode variable block (`html[data-theme="dark"]`), an inline anti-flash theme script in `<head>`, and toggle buttons in the desktop and mobile header (sun/moon icons swapped via CSS, click handling in `animations.js`), persisted to `localStorage` and defaulting to OS preference. (3) Color audit: the light theme background was barely blue-tinted despite the brand being blue — retinted `--color-bg`/`--color-bg-alt`/borders using the brand blue's hue. Also found and fixed two leftover off-brand colors from an earlier design pass: a beige scrollbar thumb (`#D1C9BE`) and terracotta-tinted button hover shadows (`rgba(200,109,81,...)`) — both now derive from the brand blue. Also de-hardcoded two stray hex values in the Tailwind config that bypassed the CSS-variable system. Decoupled the "Get in Touch" CTA buttons and `.btn-primary` from `--color-primary` (now use `--color-accent`) so that variable is free to become a light color for heading text in dark mode without breaking button backgrounds.
**Why:** User reported the previous About section edit didn't actually address the feedback — the card/widget layout was still there, just reworded; asked for the same info as plain page content instead. Also requested dark/light theme support and asked that the light theme background be visibly blue to match the brand, and asked for a general color check.
**Files touched:** index.html, index.css, js/animations.js, docs/document.md, docs/audit.md, docs/scope.md, docs/architecture.md
**Related:** audit.md — 2026-09-01 scope entry (theme toggle + color fixes); test.md — render.test.js re-run, all passing (no render-layer changes, but re-verified after markup edits)

### 2026-09-01 — Rework About Section, Real Project Data, Initials Avatars
**What:** Replaced the generic "Scalable Architecture / Custom Systems / Long-Term Partnership" panel and the vague "Business-Focused / End-to-End Execution" cards in the About section with concrete content: a "Technologies We Work With" panel (Backend, Frontend, Data & Messaging, Deployment) and two specific capability cards (Full-Stack Engineering, Production-Grade Systems). Replaced sample case-study projects with two real (placeholder-image) projects — E-Commerce Application (Spring Boot, React, PostgreSQL, Kafka, Redis) and Cafe Management System (Spring Boot, Angular, PostgreSQL, Kafka, Redis) — for the user to swap in real screenshots/details later. Changed testimonial avatars from stock photos to an initials badge (first letter of author name) generated in renderTestimonials(); removed now-unused `image` field from testimonial entries.
**Why:** User feedback: About section content was too generic/marketing-fluff and needed to be more informative and professional; case studies section should show the company's actual projects (placeholders for now); testimonial photos should not be stock images — use initials instead.
**Files touched:** index.html, js/data.js, js/render.js, js/render.test.js, docs/document.md
**Related:** test.md — render.test.js updated (project title assertion now data-driven) and re-run, all passing

### 2026-09-01 — Remove Process Section, Trim Duplicate Copy, Update Team
**What:** Removed the "Process" / "From Idea to Production" section (title, lifecycle pill, and all 5 step cards) along with its nav links (desktop nav, mobile nav, footer nav). Removed duplicate hero paragraph copy — hero now has one short tagline instead of repeating the About section's paragraphs verbatim; About section copy tightened to be more concise/technical. Removed Abhinab Khatri K.C from the team array. Changed Rupesh Dulal's role from "Co-Founder" to "CTO".
**Why:** User feedback via annotated screenshots: hero and About paragraphs were near-identical duplicates (keep only one, reword to be leaner/more technical); Process section was marked for full removal; team section needed a role change and a profile removed.
**Files touched:** index.html, js/data.js, docs/document.md
**Related:** test.md — render.test.js re-run and passing with team.length === 2

### 2026-08-26 — Update Abhinab Khatri K.C Profile & Motto to Business Focus
**What:** Updated entry for Abhinab Khatri K.C in `js/data.js` with a business strategy motto ("Empowering organizations through strategic technology solutions...") and a business-focused bio emphasizing business development, partnerships, and client success.
**Why:** User request to assign a motto to the second team member and shift his focus to business development/strategy.
**Files touched:** js/data.js, docs/document.md
**Related:** docs/test.md — all 6 render unit tests passing cleanly.

### 2026-08-26 — Render All Team Members in Grid Layout
**What:** Updated `renderTeam()` in `js/render.js` to iterate over all team members in `teamList` and render feature cards for each member, updated `#team-grid` container class in `index.html` to a responsive 2-column grid (`grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10`), and updated `js/render.test.js` to test empty, single, and multiple team member renders.
**Why:** User request to render all team members instead of only the first team member.
**Files touched:** js/render.js, index.html, js/render.test.js, docs/document.md
**Related:** docs/test.md — all 6 render unit tests passing cleanly.

### 2026-08-25 — Restore Leadership Team Section Container & Navigation
**What:** Added `<section id="team">` with container `#team-grid` to `index.html` (populated by `renderTeam()` in `js/render.js`), and updated desktop navbar, mobile navigation drawer, and footer navigation links to include the Team section.
**Why:** User request to restore the missing Team section.
**Files touched:** index.html, js/render.js, js/data.js, docs/document.md
**Related:** Agents.md, docs/check.md, docs/test.md — all 6 render unit tests passing cleanly.

### 2026-08-25 — Update Brand Color Palette (Primary: #0C385B, Secondary: #0F1A2D)
**What:** Updated design system tokens in `index.css` and `index.html` to set the primary brand color to `#0C385B` and secondary brand color to `#0F1A2D`. Applied `#0F1A2D` for the dark footer background, text tokens, and secondary UI highlights.
**Why:** User request to update company primary color to `#0C385B` and secondary color to `#0F1A2D`.
**Files touched:** index.css, index.html, docs/document.md
**Related:** Agents.md, docs/check.md, docs/test.md — all 6 render unit tests passing cleanly.

### 2026-08-25 — Swap Brand Logo Assets Placement
**What:** Configured `assets/LogoSecondary.jpeg` as the site favicon (`<link rel="icon">`) and header navbar brand logo, and set `assets/LogoPrimary.jpeg` as the footer section brand logo in `index.html`.
**Why:** User request to swap logo image assignments between header/favicon and footer.
**Files touched:** index.html, assets/LogoPrimary.jpeg, assets/LogoSecondary.jpeg, docs/document.md
**Related:** Agents.md, docs/check.md, docs/test.md — all 6 render unit tests passing cleanly.

### 2026-08-25 — Update Official Company Contact Emails
**What:** Updated company contact email addresses across `index.html` (Contact section cards and Footer inquiry links) to `sales@sabioratechnologies.com` and `contact@sabioratechnologies.com`.
**Why:** User request to display updated sales and general contact email addresses for Sabiora Technologies.
**Files touched:** index.html, docs/document.md
**Related:** Agents.md, docs/check.md, docs/test.md — all 6 render unit tests passing cleanly.

### 2026-08-25 — Integrate Sabiora Technologies Company Information & Core Services
**What:** Updated `index.html` content across all sections to incorporate official company details for Sabiora Technologies (based in Kathmandu, Nepal). Expanded Services section to 8 dedicated service cards (Mobile App Dev, Website Dev, Web Apps & Custom Software, E-Commerce, UI/UX Design, API Integration, Cloud & DevOps, Maintenance & Consulting), updated Process section to the 5-step "From Idea to Production" framework (Plan → Design → Develop → Deploy → Improve), added the "Why Work With Sabiora Technologies?" 5-pillar section, and updated hero, about, contact, and footer text.
**Why:** User request to add official Sabiora Technologies text content where necessary and proper.
**Files touched:** index.html, docs/document.md
**Related:** Agents.md, docs/check.md, docs/test.md — all 6 render unit tests passing cleanly.

### 2026-08-23 — Initial Sabiora Single-Page Agency Portfolio Build
**What:** Built the complete static agency portfolio website including all 8 sections (Hero, About, Services, Portfolio, Process, Team, Testimonials, Contact) with header, mobile menu, and footer. Implemented theme system with CSS variables, array-driven rendering (`js/data.js` + `js/render.js`), IntersectionObserver scroll reveals (`js/animations.js`), EmailJS integration (`js/contact.js`), and Node unit tests (`js/render.test.js`).
**Why:** Initial development request following `Agents.md`, `docs/architecture.md`, `docs/develop.md`, and `docs/scope.md`.
**Files touched:** index.html, index.css, js/data.js, js/render.js, js/animations.js, js/contact.js, js/render.test.js, docs/document.md
**Related:** scope.md, architecture.md, develop.md, check.md, test.md — all 6 render unit tests passing.



