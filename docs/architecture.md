# architecture.md — Project Architecture

## Overview

A single-page site built with Next.js (App Router), React and TypeScript, and exported to static files. `npm run build` writes the finished site to `out/`; that folder is all that gets deployed. There is no server and no backend. Content and presentation are deliberately separated so content edits (new project, new testimonial) never require touching component markup.

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
│   ├── page.tsx          # The one page — lists the sections in scroll order
│   ├── not-found.tsx     # → /404.html, served by the host for unknown addresses
│   ├── globals.css       # Design tokens (@theme) + the few styles utilities can't express
│   ├── robots.ts         # → /robots.txt
│   └── sitemap.ts        # → /sitemap.xml
├── components/
│   ├── Navbar.tsx  Hero.tsx  CodeTerminal.tsx  About.tsx  Services.tsx
│   ├── TechStack.tsx  Projects.tsx  WhyUs.tsx  Testimonials.tsx  Contact.tsx  Footer.tsx
│   ├── FooterWave.tsx              # The layered brand wave that leads into the footer
│   ├── MotionProvider.tsx          # Framer Motion setup (LazyMotion + reduced motion)
│   ├── services/visuals.tsx        # CSS-drawn illustrations for the services bento grid
│   └── ui/                         # Reveal, SectionHeading, SocialIcon, SpotlightTracker
├── lib/
│   ├── data.ts           # ALL repeatable content arrays
│   ├── site.ts           # Company facts, nav links, EmailJS config
│   ├── code-samples.ts   # The three files shown in the hero code window
│   ├── highlight.ts      # Tiny syntax highlighter for the code window
│   ├── validation.ts     # Contact form rules (pure functions)
│   ├── cn.ts             # Class-name joiner
│   └── *.test.ts         # Unit tests, next to the code they test
├── public/               # Deployed as-is: optimized images, favicons, og.png
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

- Plain `<a href="#section">` links. `scroll-padding-top` on `<html>` keeps targets clear of the fixed header; smooth scrolling is CSS. There is no JS scroll handling, so the URL hash, the back button and keyboard focus all behave natively.
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

No routing, no backend, no request-time rendering, no state-management library, no light theme. If any of these become necessary, `scope.md` and this file must be updated together, with the change logged in `audit.md`.
