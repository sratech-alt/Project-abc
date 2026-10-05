# scope.md — Project Scope

## Project

Sabiora — the marketing website for Sabiora Technologies, built with Next.js (App Router), React, TypeScript and Tailwind CSS, and exported as a fully static site. A Supabase project holds the site's editable content, which is read when the site is built. See `audit.md` for how the scope reached this point.

## Goal

Give the company a fast, editable, credible web presence that converts visitors into inquiries via the contact form, and that can publish articles, job openings, projects and services without a code change.

## In Scope

- A home page with scroll-based navigation. Sections, in order: Hero, About, Services, Tech Stack, Projects, Why Us, Testimonials, Contact, Footer
  - Testimonials renders only verified quotes and hides itself when there are none
  - Team is not rendered at present; its data is kept in `lib/data.ts`
- Content pages:
  - `/services/[id]` — one per service
  - `/projects/[slug]` — one case study per project
  - `/blog`, `/blog/[slug]`, `/blog/tag/[tag]`, `/blog/page/[n]`, `/blog/feed.xml` (RSS)
  - `/careers`, `/careers/[slug]`
  - `/privacy`
- A Supabase project as the content backend, read **at build time only** with the public key. Tables: `posts`, `jobs`, `services`, `projects`, `tech_categories`, `technologies`. Content is edited by developers in the Supabase dashboard
- Code defaults in `lib/data.ts` for services, projects and the tech stack, used while their tables are empty
- Next.js static export (`npm run build` → `out/`), React + TypeScript, Tailwind CSS v4, mobile-first responsive layout
- A dark-only theme. Every colour is a design token defined in `app/globals.css`; Tailwind's default palette is switched off
- Motion: Framer Motion for scroll reveals and the mobile menu; CSS keyframes for everything else. All motion respects `prefers-reduced-motion`
- Icons from `lucide-react`; social brand icons as inline SVG
- Contact form sent through EmailJS, with client-side validation and basic spam protection
- Careers applications by email (a `mailto:` link per role)
- SEO basics: metadata, Open Graph/Twitter card, canonical URLs, structured data (organisation, services, case studies, blog posts, job postings), `robots.txt`, `sitemap.xml`, RSS
- Tooling: ESLint, Prettier, Vitest unit tests, Playwright browser tests

## Out of Scope

- Rendering at request time — the site must stay statically exportable
- An admin screen, editor logins, or user accounts on the site
- Writing to the database from the site (comments, application forms, CV uploads, analytics)
- Multi-language support
- Dedicated pricing page (the company is quote-based)
- Payment processing
- A light theme or theme toggle
- Invented client quotes, metrics or logos — content must be true

## Success Criteria

- Loads fast on mobile connections: no render-blocking third-party scripts, images sized for their slot
- Articles, roles, services, projects and the tech stack are editable in Supabase; other home-page content in `lib/data.ts` / `lib/site.ts` — none needs component changes
- Publishing or unpublishing content never needs a code change, only a rebuild — and a rebuild always shows the database as it is now
- A database outage can never take content off the live site (the build fails instead), and an empty table can never empty a home-page section (code defaults take over)
- Contact form sends via EmailJS and always tells the visitor what happened
- No horizontal scrolling at any width from 320px up
- Passes the checks in `check.md` and the tests in `test.md` before any change is considered "done"

## Change Control

Any addition, removal, or scope change (new section, new page, new table, new integration, new dependency, etc.) must be logged in `audit.md` before implementation begins, not after.
