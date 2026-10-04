# scope.md — Project Scope

## Project

Sabiora — a single-page portfolio/marketing website for Sabiora Technologies, built with Next.js (App Router), React, TypeScript and Tailwind CSS, and exported as a fully static site (no server, no backend). See `audit.md` — 2026-10-04 for the decision to move off plain HTML/CSS/JS.

## Goal

Give the company a fast, editable, credible web presence that converts visitors into inquiries via the contact form. Not a CMS, not a web app — a static, content-driven marketing site.

## In Scope

- A single page with scroll-based navigation (no routing)
- Sections, in order: Hero, About, Services, Tech Stack, Projects, Why Us, Testimonials, Contact, Footer
  - Testimonials renders only verified quotes and hides itself when there are none (see `audit.md` — 2026-10-04)
  - Team is not rendered at present; its data is kept in `lib/data.ts` for when it returns
- Next.js static export (`npm run build` → `out/`), React + TypeScript, Tailwind CSS v4, mobile-first responsive layout
- A dark-only theme. Every colour is a design token defined in `app/globals.css`; Tailwind's default palette is switched off
- Content arrays in `lib/data.ts`: `projects[]`, `team[]`, `testimonials[]`, `socials[]`, plus `services[]`, `stack[]`, `reasons[]`, `metrics[]`
- Motion: Framer Motion for scroll reveals and the mobile menu; CSS keyframes for the hero entrance, marquee and illustration loops. All motion respects `prefers-reduced-motion`
- Icons from `lucide-react`; social brand icons as inline SVG
- Contact form sent through EmailJS, with client-side validation and basic spam protection
- Case-study details shown in an on-page dialog (no separate pages)
- SEO basics: metadata, Open Graph/Twitter card, canonical URL, structured data, `robots.txt`, `sitemap.xml`

## Out of Scope

- Blog / CMS-driven content
- Multi-language support
- Dedicated pricing page (the company is quote-based)
- User accounts, backend database, server-side rendering at request time (the site must stay statically exportable)
- Payment processing
- Additional routes/pages (including separate case-study pages)
- A light theme or theme toggle
- Invented client quotes, metrics or logos — content must be true

## Success Criteria

- Loads fast on mobile connections: no render-blocking third-party scripts, images sized for their slot
- All content sections editable by changing values in `lib/data.ts` / `lib/site.ts`, without touching component markup
- Contact form sends via EmailJS and always tells the visitor what happened
- No horizontal scrolling at any width from 320px up
- Passes the checks in `check.md` and the tests in `test.md` before any change is considered "done"

## Change Control

Any addition, removal, or scope change (new section, new integration, new dependency, new page, etc.) must be logged in `audit.md` before implementation begins, not after.
