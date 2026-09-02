# scope.md — Project Scope

## Project

Sabiora — a single-page portfolio/marketing website for an agency, built with plain HTML, Tailwind CSS, and plain JavaScript (no framework, no build-heavy tooling).

## Goal

Give the agency a fast, editable, credible web presence that converts visitors into inquiries via the contact form. Not a CMS, not a web app — a static, content-driven marketing site.

## In Scope

- Single HTML page, scroll-based navigation (no routing)
- Sections: Hero, About, Services, Portfolio/Projects, Process/Why Us, Team, Testimonials, Contact
- Tailwind CSS for styling, mobile-first responsive layout
- Theming via CSS custom properties (`--color-primary`, `--color-accent`, etc.) defined in `index.css`, including a user-toggleable light/dark theme (see `audit.md` — 2026-09-01)
- Content arrays in a dedicated data file (`data.js` or similar): `projects[]`, `team[]`, `testimonials[]`, `socials[]`
- Light scroll-reveal animations and hover states (cards, buttons) — no heavy motion libraries
- Contact form markup + JS handler wired for EmailJS (service/template IDs added later by the developer)
- Stock, copyright-free imagery as placeholders
- Placeholder copy for all sections, structured so real copy is a drop-in text replacement

## Out of Scope

- Blog / CMS-driven content
- Multi-language support
- Dedicated pricing page (agency is quote-based)
- User accounts, backend database, server-side rendering
- Payment processing
- Any framework (React, Vue, etc.) or bundler-dependent architecture unless explicitly revisited

## Success Criteria

- Loads fast on mobile connections (no unnecessary JS/CSS weight)
- All content sections editable by changing array values or copy strings, without touching layout markup
- Contact form successfully sends via EmailJS once IDs are supplied
- Passes the checks defined in `check.md` before being considered "done" for any given feature

## Change Control

Any addition, removal, or scope change (new section, new integration, framework adoption, etc.) must be logged in `audit.md` before implementation begins, not after.
