# scope.md — Project Scope

## Project

Sabiora — the marketing website for Sabiora Technologies, built with Next.js (App Router), React, TypeScript and Tailwind CSS, and exported as a fully static site. A Supabase project holds the blog and careers content, which the site reads when it is built. See `audit.md` — 2026-10-04 for the move off plain HTML/CSS/JS and for the addition of the content backend.

## Goal

Give the company a fast, editable, credible web presence that converts visitors into inquiries via the contact form, and that can publish articles and job openings without a code change.

## In Scope

- A home page with scroll-based navigation. Sections, in order: Hero, About, Services, Tech Stack, Projects, Why Us, Testimonials, Contact, Footer
  - Testimonials renders only verified quotes and hides itself when there are none
  - Team is not rendered at present; its data is kept in `lib/data.ts`
- Content pages: `/blog`, `/blog/[slug]`, `/careers`, `/careers/[slug]`
- A Supabase project as the content backend, read **at build time only** with the public key. Tables: `posts`, `jobs`. Content is written in Markdown by developers in the Supabase dashboard
- Next.js static export (`npm run build` → `out/`), React + TypeScript, Tailwind CSS v4, mobile-first responsive layout
- A dark-only theme. Every colour is a design token defined in `app/globals.css`; Tailwind's default palette is switched off
- Home-page content arrays in `lib/data.ts`: `projects[]`, `services[]`, `stack[]`, `reasons[]`, `metrics[]`, `team[]`, `testimonials[]`, `socials[]`
- Motion: Framer Motion for scroll reveals and the mobile menu; CSS keyframes for everything else. All motion respects `prefers-reduced-motion`
- Icons from `lucide-react`; social brand icons as inline SVG
- Contact form sent through EmailJS, with client-side validation and basic spam protection
- Careers applications by email (a `mailto:` link per role)
- Case-study details shown in an on-page dialog
- SEO basics: metadata, Open Graph/Twitter card, canonical URLs, structured data (organisation, blog posts, job postings), `robots.txt`, `sitemap.xml`

## Out of Scope

- Rendering at request time — the site must stay statically exportable
- An admin screen, editor logins, or user accounts on the site
- Writing to the database from the site (comments, application forms, CV uploads, analytics)
- Multi-language support
- Dedicated pricing page (the company is quote-based)
- Payment processing
- A light theme or theme toggle
- Invented client quotes, metrics or logos — content must be true
- Moving `projects`, `services` and `stack` into the database (planned; log it in `audit.md` when it starts)

## Success Criteria

- Loads fast on mobile connections: no render-blocking third-party scripts, images sized for their slot
- Home-page content editable in `lib/data.ts` / `lib/site.ts`; articles and roles editable in Supabase — neither needs component changes
- Publishing or unpublishing content never needs a code change, only a rebuild
- A database outage can never take content off the live site (the build fails instead)
- Contact form sends via EmailJS and always tells the visitor what happened
- No horizontal scrolling at any width from 320px up
- Passes the checks in `check.md` and the tests in `test.md` before any change is considered "done"

## Change Control

Any addition, removal, or scope change (new section, new page, new table, new integration, new dependency, etc.) must be logged in `audit.md` before implementation begins, not after.
