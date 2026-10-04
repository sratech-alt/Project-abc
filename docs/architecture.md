# architecture.md — Project Architecture

## Overview

A site built with Next.js (App Router), React and TypeScript, and exported to static files. `npm run build` writes the finished site to `out/`; that folder is all that gets deployed. There is no server. Blog and careers content lives in a Supabase database that is read during the build (see "Content backend" below); visitors' browsers never talk to it. Content and presentation are deliberately separated so content edits (new project, new testimonial) never require touching component markup.

## Commands

| Command             | What it does                                                              |
| ------------------- | ------------------------------------------------------------------------- |
| `npm install`       | Install dependencies (Node 20.9+; Node 22 is used on Netlify)             |
| `npm run dev`       | Local development server with hot reload                                  |
| `npm run build`     | Type-check and build the static site into `out/`                          |
| `npm run typecheck` | TypeScript only                                                           |
| `npm test`          | Unit tests (Vitest)                                                       |
| `npm run images`    | Regenerate the published images in `public/` from the originals in `assets/` |

## File Structure

```
/
├── app/
│   ├── layout.tsx        # <html>, fonts, metadata/SEO, structured data, global providers
│   ├── page.tsx          # The home page — lists the sections in scroll order
│   ├── blog/page.tsx, blog/[slug]/page.tsx         # Article list and one page per published post
│   ├── careers/page.tsx, careers/[slug]/page.tsx   # Open roles and one page per role
│   ├── not-found.tsx     # → /404.html, served by the host for unknown addresses
│   ├── globals.css       # Design tokens (@theme) + the few styles utilities can't express
│   ├── robots.ts         # → /robots.txt
│   └── sitemap.ts        # → /sitemap.xml
├── components/
│   ├── Navbar.tsx  Hero.tsx  CodeTerminal.tsx  About.tsx  Services.tsx
│   ├── TechStack.tsx  Projects.tsx  WhyUs.tsx  Testimonials.tsx  Contact.tsx  Footer.tsx
│   ├── FooterWave.tsx              # The layered brand wave that leads into the footer
│   ├── SiteShell.tsx  PageHeader.tsx  Prose.tsx   # Shared page frame, content-page header, Markdown output
│   ├── MotionProvider.tsx          # Framer Motion setup (LazyMotion + reduced motion)
│   ├── services/visuals.tsx        # CSS-drawn illustrations for the services bento grid
│   └── ui/                         # Reveal, SectionHeading, SocialIcon, SpotlightTracker
├── lib/
│   ├── data.ts           # Home-page content arrays
│   ├── site.ts           # Company facts, nav links, EmailJS and Supabase config
│   ├── supabase.ts       # Build-time reader for Supabase's Data API (plain fetch, with retries)
│   ├── content.ts        # Posts and jobs: loading, mapping rows to types, page links
│   ├── markdown.ts       # Markdown → safe HTML
│   ├── static-params.ts  # Placeholder route for empty content tables
│   ├── code-samples.ts   # The three files shown in the hero code window
│   ├── highlight.ts      # Tiny syntax highlighter for the code window
│   ├── validation.ts     # Contact form rules (pure functions)
│   ├── cn.ts             # Class-name joiner
│   └── *.test.ts         # Unit tests, next to the code they test
├── supabase/schema.sql   # The database: tables, access rules, storage bucket
├── public/               # Deployed as-is: optimized images, favicons, og.png, search-engine verification files
├── assets/               # ORIGINAL images. Never deployed. Source for `npm run images`
├── scripts/optimize-images.mjs
├── netlify.toml          # Build command, publish dir, cache/security headers
├── next.config.mjs       # output: 'export'
└── docs/                 # This governance file set
```

## Server vs. client components

Components are server components by default — they render to HTML at build time and ship no JavaScript. Add `'use client'` only when a component needs state, effects or event handlers. Currently client: `Navbar`, `CodeTerminal`, `TechStack`, `Projects`, `Contact`, `MotionProvider`, `ui/Reveal`, `ui/SpotlightTracker`.

## Data Flow

1. `lib/data.ts` is the single source of truth for repeatable content (projects, services, stack, reasons, team, testimonials, socials, metrics). `lib/site.ts` holds one-off facts (name, emails, address, nav links, availability line, EmailJS IDs).
2. Each section component imports its array and maps it to markup. No section hardcodes repeating content.
3. The services bento grid derives its layout from each service's `span` (1, 2 or 3 of 3 desktop columns). Spans must tile into full rows — a unit test enforces this.
4. Projects: the first three `featured: true` entries get full cards; everything else is listed under "Also shipped". `platform: 'web' | 'mobile'` decides how the image is framed (browser frame vs. portrait poster).
5. Testimonials: only entries with `verified: true` render; with none, the section is omitted entirely.

## Content backend (Supabase)

- **What it holds:** `posts` (blog) and `jobs` (careers). The full definition is `supabase/schema.sql`; change the database by editing that file and running it in the Supabase SQL editor. It is safe to re-run.
- **How the site reads it:** `lib/supabase.ts` calls Supabase's Data API with `fetch` during `npm run build`. There is no Supabase SDK and nothing runs in the visitor's browser. `lib/content.ts` turns rows into `Post` and `Job` objects; pages import only from there.
- **Access:** the project URL and publishable key in `lib/site.ts` are public by design. Row Level Security is on for every table, and the only policies allow reading rows that are published (and, for jobs, not yet closed). Nothing can be written with the public key. The secret key and database password are never used and must never be committed.
- **Editing content:** in the Supabase dashboard's table editor. A row goes live when `published` is true and its date has passed — **and the site has been rebuilt**.
- **Rebuilds:** content is baked in at build time, so a change appears after the next deploy. A Supabase database webhook calls a Netlify build hook whenever `posts` or `jobs` change. A post scheduled for a future date needs a build after that date.
- **Failure behaviour:** a table that doesn't exist yet counts as "no content" and the build succeeds. A network error or 5xx is retried; if it persists, or the key is rejected, the build **fails** and Netlify keeps serving the previous deploy. The site never publishes with its content silently missing.
- **Markdown:** rendered by `lib/markdown.ts` at build time. Raw HTML is escaped, links and images are limited to safe addresses, `#` headings become `<h2>`, and code blocks and tables are keyboard-scrollable.
- **Navigation follows content:** `getPageLinks()` returns "Blog" and "Careers" only when there is at least one published post or open role. The header, mobile menu, footer and sitemap all use it. With the two extra links the desktop pill navigation starts at 1280px instead of 1024px.
- **Empty tables and static export:** a static export refuses to build a `[slug]` route with zero pages, so `lib/static-params.ts` pads an empty list with one reserved slug (`_empty`) that renders the 404 page.
- **Images:** cover images are full `https://` URLs, normally files in the public `media` storage bucket.

## Theming

- All colours are design tokens declared in the `@theme` block of `app/globals.css` (`--color-canvas`, `--color-panel`, `--color-fg`, `--color-muted`, `--color-accent`, …). Tailwind turns each into utilities: `bg-canvas`, `text-muted`, `border-line`, `text-accent/60`, etc.
- `--color-*: initial` at the top of that block removes Tailwind's default palette. `bg-zinc-900`, `text-cyan-400` and raw hex values in class names produce no CSS. To use a new colour, add a token first.
- The site is dark-only. There is no theme toggle and no light palette.
- Text tokens (`fg`, `muted`, `faint`) all meet WCAG AA on `canvas` and `panel`. `iris` is for fills and glows; use `iris-soft` for text.
- Two values cannot read CSS variables and mirror `--color-canvas` by hand: `themeColor` in `lib/site.ts` and `CANVAS` in `scripts/optimize-images.mjs`. Change all three together.
- One focus style for everything interactive is defined in `globals.css` (`:focus-visible`). Never remove outlines with utilities.

## Animation Layer

- Scroll reveals: wrap content in `<Reveal>` (`components/ui/Reveal.tsx`, Framer Motion `whileInView`, runs once).
- Framer Motion is loaded through `LazyMotion` with `domAnimation` only — use `m.div`, never `motion.div`. Layout animations (`layoutId`) are not available in this bundle.
- Anything above the fold or purely decorative uses CSS keyframes from `globals.css` (`animate-fade-up`, `animate-marquee`, `animate-flow`, …) so it works before JavaScript loads.
- Looping animations change only `transform` and `opacity`, so they run off the main thread (see `audit.md` — 2026-10-04). The hero headline uses `animate-rise` (slide only): it must never start invisible, because it is the page's main content.
- Do not put `content-visibility: auto` on sections — it breaks anchor-link accuracy.
- Hover states are CSS. The card cursor highlight is one document-level listener (`SpotlightTracker`) feeding CSS variables to `[data-spotlight]` elements.
- `prefers-reduced-motion` is honoured twice: `MotionConfig reducedMotion="user"` for Framer Motion and a media query in `globals.css` for CSS animation.
- With JavaScript disabled, a `<noscript>` rule in `layout.tsx` makes `[data-reveal]` content visible.

## Navigation

- Plain `<a href="/#section">` links, so they work from every page; on the home page the browser treats them as an in-page jump. `scroll-padding-top` on `<html>` keeps targets clear of the fixed header; smooth scrolling is CSS. There is no JS scroll handling, so the URL hash, the back button and keyboard focus all behave natively.
- Every page is wrapped in `<SiteShell>`, which renders the header, `<main>` and footer and passes them the current content-page links.
- The header highlights the current section with one `IntersectionObserver` in `Navbar.tsx`.
- While the mobile menu is open, `<main>` and `<footer>` are `inert` and page scrolling is locked; `scrollbar-gutter: stable` on `<html>` stops the layout shifting when scrolling is locked.
- `navLinks` in `lib/site.ts` drives the header, mobile menu and footer. Every id must match a `<section id>` (unit-tested).

## Contact Form Integration

- Markup and submit handling: `components/Contact.tsx`. Rules: `lib/validation.ts` (pure, unit-tested).
- The EmailJS SDK (`@emailjs/browser`) is imported on submit, not on page load.
- The EmailJS public key, service ID and template ID in `lib/site.ts` are live values. EmailJS public keys are designed to ship in client code. The template receives `name`, `email`, `title`, `message`, `time`.
- Spam protection: a honeypot field, a minimum fill time, the SDK's rate limit and headless-browser block. A blocked submission still shows an error with the sales email address — it never fails silently. Restricting the allowed domain in the EmailJS dashboard is the server-side half of this and must be done there.
- The result message sits directly under the submit button in an `aria-live` region.

## Images

- Originals live in `assets/` and are never deployed. `npm run images` writes sized WebP/PNG files to `public/images/` and the favicons to `public/`.
- `next/image` is used for intrinsic sizing and lazy loading; Next's optimizer is off (`images.unoptimized`) because a static export has no server to run it.
- Each project's `image` in `lib/data.ts` records `src`, `width` and `height` — update them if the image changes (the script prints the dimensions).
- `public/og.png` (1200×630, the social share image) is a capture of the hero. Re-capture it after a significant hero redesign.

## Responsive Strategy

- Mobile-first: unprefixed classes target phones; `sm:`/`md:`/`lg:`/`xl:` layer on enhancements.
- One markup tree. Supported from 320px wide upwards with no horizontal scroll.

## Deployment

Netlify, configured by `netlify.toml`: build command `npm run build`, publish directory `out`. Pushing a branch that Netlify builds will deploy it.

## Non-Goals (see scope.md)

No request-time rendering, no writes to the database from the site, no admin UI, no state-management library, no light theme. If any of these become necessary, `scope.md` and this file must be updated together, with the change logged in `audit.md`.
