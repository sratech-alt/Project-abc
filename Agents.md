# agents.md — Project Entrypoint

Read this file first. It combines everything in `/docs` into one map — the individual files (`scope.md`, `audit.md`, `architecture.md`, `develop.md`, `check.md`, `test.md`, `document.md`, `sync.md`, `debug.md`) hold the full detail; this file tells you what each one is for and the order to use them in.

## Project Summary

**Sabiora** — a single-page portfolio/marketing website for an agency. Built with plain HTML, Tailwind CSS, and plain JavaScript. Mobile-first, no framework, no backend. Content that repeats (projects, team, testimonials, social links) is driven by JS arrays in `data.js` so it can be edited without touching markup. Theming (beige primary, accent TBD) is controlled via CSS custom properties in `index.css`. Contact form is wired for EmailJS.

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

- Single-page, scroll-based navigation — no routing
- Plain HTML/CSS/JS — no framework, no required build step
- Mobile-first responsive design
- All repeatable content is array-driven (`projects`, `team`, `testimonials`, `socials`)
- All colors via CSS custom properties — never hardcoded hex values
- Light animations only (scroll reveal + CSS hover) — no animation library
- Out of scope: blog, multi-language, pricing page, backend, framework adoption — unless scope is formally revised via `audit.md`

## Golden Rule

If a change to code, content, or convention isn't reflected in these files, it effectively didn't happen — the next session (human or AI) has no way to know about it. Write it down where it belongs, every time.
