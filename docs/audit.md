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

### 2026-09-01 — Light/dark theme toggle added to scope

**Changed:** Added a user-toggleable light/dark theme (persisted via localStorage, defaulting to OS preference on first visit) as an in-scope feature. All colors continue to route through the CSS custom properties in `index.css`; dark mode is implemented purely as an `html[data-theme="dark"]` override block, no per-element `dark:` utility classes needed.
**Reason:** Client request. Also surfaced during this pass: the light palette wasn't visibly blue-tinted despite the brand being blue, and two leftover off-brand colors existed (a beige scrollbar thumb, terracotta-tinted button hover shadows) from an earlier design iteration — both fixed to derive from the brand blue.
**Supersedes:** N/A
**Impact:** `index.css` (full palette rewrite + dark block), `index.html` (theme toggle buttons, anti-flash inline script, tailwind config brand colors de-hardcoded), `js/animations.js` (toggle click handling). `scope.md` and `architecture.md` updated to reflect theming now includes a dark variant.

<!-- Add new entries above this line, most recent at the bottom of the log or top — pick one convention and stay consistent. -->
