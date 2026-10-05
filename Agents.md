# agents.md — Project Entrypoint

Read this file first. It combines everything in `/docs` into one map — the individual files (`scope.md`, `audit.md`, `architecture.md`, `develop.md`, `check.md`, `test.md`, `document.md`, `sync.md`, `debug.md`) hold the full detail; this file tells you what each one is for and the order to use them in.

## Project Summary

**Sabiora** — the marketing website for Sabiora Technologies: a scroll-navigation home page plus service, case-study, blog, careers and privacy pages. Built with Next.js (App Router), React, TypeScript and Tailwind CSS v4, and exported as a static site (`npm run build` → `out/`). Mobile-first, dark-only, no server. Posts, jobs, services, projects and the tech stack live in a Supabase database that is read at build time (`supabase/schema.sql`, `lib/content.ts`, `lib/catalog.ts`); `lib/data.ts` holds the rest of the home-page content plus the defaults used while a catalog table is empty. Every colour is a design token in `app/globals.css`; Tailwind's default palette is switched off. The contact form sends through EmailJS. The stack changed on 2026-10-04 — see `audit.md`.

Quick start: `npm install`, then `npm run dev`. Before finishing any change: `npm run typecheck && npm test && npm run build`.

## The Doc Set, In Order Of Use

| File              | Purpose                                                            | When to read it                                                                            |
| ----------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `scope.md`        | What the project is and isn't — the boundary                       | Before starting any new feature; when unsure if something belongs                          |
| `architecture.md` | File structure, data flow, theming, integration points             | Before writing any code — where does this go?                                              |
| `develop.md`      | How to actually build a feature consistently                       | While implementing                                                                         |
| `check.md`        | Checklist to confirm the new code matches the established patterns | Immediately after implementing, before calling it done                                     |
| `test.md`         | What needs automated vs. manual testing, and the manual checklist  | After `check.md` passes                                                                    |
| `debug.md`        | Root-cause process for bugs, feeding fixes into `test.md`          | Whenever something is broken                                                               |
| `document.md`     | Change log format, commit message and MR description conventions   | After any change is complete, to record it                                                 |
| `audit.md`        | Historical log of requirement/standard changes (not code changes)  | Whenever a standard or scope itself changes; read recent entries at the start of a session |
| `sync.md`         | How to keep standards consistent across sessions/tools/machines    | Start and end of every session                                                             |

## Standard Workflow For Any Change

1. **Check scope** (`scope.md`) — is this in bounds? If not, log a proposed scope change in `audit.md` first.
2. **Check architecture** (`architecture.md`) — where does this fit in the existing structure?
3. **Build it** following `develop.md` conventions.
4. **Verify it** against `check.md`.
5. **Test it** per `test.md` (write/update tests, run the manual checklist).
6. **Document it** in `document.md`, with a matching commit message.
7. **If a standard changed along the way**, make sure it's reflected in the relevant doc and logged in `audit.md`.

## Standard Workflow For Any Bug

1. Reproduce and root-cause it via `debug.md`.
2. Fix at the root cause.
3. Re-run `check.md` on the fix.
4. Add a test case per `test.md` so it can't silently regress.
5. Log the fix in `document.md`; log any standards gap it revealed in `audit.md`.

## Core Constraints (from scope.md — always true unless formally revised)

- Pages: the home page (scroll navigation), `/services/[id]`, `/projects/[slug]`, `/blog` (+ `/blog/[slug]`, `/blog/tag/[tag]`, `/blog/page/[n]`, `/blog/feed.xml`), `/careers`, `/careers/[slug]`, `/privacy`. New routes need an `audit.md` entry
- Next.js + React + TypeScript, statically exported — it must always build to plain files in `out/` with no server
- Supabase is read at build time only, with the public key only, through `lib/content.ts` and `lib/catalog.ts`. The site never writes to it. No secret key or database password in the repo, ever
- Build-time content is never read with `fetch` (Next.js caches it between builds) — only through `selectRows()` in `lib/supabase.ts`
- Database changes go in `supabase/schema.sql`; every table has Row Level Security with a published-rows-only read policy
- Mobile-first responsive design; no horizontal scroll from 320px up
- Repeatable content is data-driven: posts, jobs, services, projects and the tech stack from Supabase; `reasons`, `team`, `testimonials`, `socials`, `metrics` from `lib/data.ts`. Services, projects and the stack fall back to defaults in `lib/data.ts` when their table is empty
- The privacy page must stay true: update `app/privacy/page.tsx` whenever what the site collects or shares changes
- Section links are written `/#section` so they work from every page
- All colors are design tokens in `app/globals.css` — never hardcoded hex values or default-palette classes (unit-tested)
- Dark theme only — no light theme, no toggle
- Motion stays light: `<Reveal>` for scroll reveals (Framer Motion via `m.*`), CSS for everything else; reduced motion and no-JS must still work
- Content must be true — no invented testimonials, metrics or client names; no links or buttons that lead nowhere
- Out of scope: request-time rendering, an admin UI or logins, database writes from the site, multi-language, pricing page, new dependencies, new routes or tables — unless scope is formally revised via `audit.md`

## Golden Rule

If a change to code, content, or convention isn't reflected in these files, it effectively didn't happen — the next session (human or AI) has no way to know about it. Write it down where it belongs, every time.
