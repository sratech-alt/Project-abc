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



