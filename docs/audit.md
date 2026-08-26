# audit.md — Requirements & Quality Audit Log

Running log of every change to requirements, scope, coding style, or quality standards. This is the historical record — `scope.md` and `architecture.md` describe the _current_ state; this file explains _how it got there and why_.

## How to use this file

- Add a new dated entry every time a requirement, standard, or convention changes — not every time code changes (that belongs in `document.md`).
- Never delete or rewrite past entries. If a decision is reversed, add a new entry that supersedes it and link back.
- Each entry: what changed, why, what it replaces (if anything), who/what decided it.

## Entry format

```
### YYYY-MM-DD — Short title
**Changed:** what specifically changed
**Reason:** why it changed
**Supersedes:** link/reference to prior entry, or "N/A"
**Impact:** which files/sections/docs need to be updated as a result
```

## Log

### 2026-08-23 — Initial scope and doc structure established

**Changed:** Defined project scope (single-page, plain HTML/Tailwind/JS), section list (Hero, About, Services, Portfolio, Process/Why Us, Team, Testimonials, Contact), and the governance file set (scope, audit, architecture, develop, check, test, document, sync, debug, agents).
**Reason:** Requirements gathered from client discovery; needed a durable process so future changes don't erode consistency.
**Supersedes:** N/A
**Impact:** All docs in this set.

### 2026-08-23 — Content model set to array-driven

**Changed:** Projects, Team, Testimonials, and Socials are all rendered from JS arrays rather than hardcoded markup.
**Reason:** Client will add real project links, team members, and testimonials later; editing array values is lower-risk than editing markup.
**Supersedes:** N/A
**Impact:** `architecture.md`, `develop.md` data-file conventions.

### 2026-08-23 — Color system deferred to CSS variables

**Changed:** Beige confirmed as primary color; accent color left undecided, to be controlled via CSS custom properties in `index.css` rather than hardcoded Tailwind classes.
**Reason:** Client hasn't finalized accent color; variables let the whole site re-theme from one file later.
**Supersedes:** N/A
**Impact:** `architecture.md` theming section, `develop.md` styling conventions.

<!-- Add new entries above this line, most recent at the bottom of the log or top — pick one convention and stay consistent. -->
