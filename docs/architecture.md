# architecture.md — Project Architecture

## Overview

A static, single-page site. No build step required to run it (a lightweight dev server like `live-server` is optional, not mandatory). No framework. Content and presentation are deliberately separated so non-markup edits (new project, new testimonial) never require touching HTML.

## File Structure

```
/
├── index.html          # Single page — all sections live here, in order
├── index.css           # CSS custom properties (theme) + any custom styles Tailwind can't express
├── tailwind.config.js  # If using the Tailwind CLI/build; extends theme to reference CSS vars
├── /js
│   ├── data.js          # All content arrays: projects[], team[], testimonials[], socials[]
│   ├── render.js         # Functions that take data.js arrays and inject markup into the DOM
│   ├── animations.js     # Scroll-reveal (IntersectionObserver) + hover-state logic
│   └── contact.js        # EmailJS init + form submit handler
├── /assets
│   ├── /images           # Stock/copyright-free images, logo files
│   └── /icons             # Social icons, UI icons
└── /docs                  # This governance file set (scope, audit, architecture, etc.)
```

## Data Flow

1. `data.js` is the single source of truth for repeatable content (projects, team, testimonials, socials).
2. `render.js` reads each array on page load and generates the corresponding section's DOM nodes (e.g., one project card per entry in `projects[]`).
3. `index.html` contains empty container elements (e.g., `<div id="projects-grid"></div>`) that `render.js` populates — it does NOT contain hardcoded repeating markup for array-driven sections.
4. Static sections (Hero, About copy, Services) can remain as plain HTML since they don't repeat or change structurally — only their text/image content changes.

## Theming

- All color values are defined once as CSS custom properties in `index.css` (`:root { --color-primary; --color-accent; --color-text; --color-text-muted; }`).
- Tailwind classes reference these via arbitrary value syntax (`bg-[var(--color-primary)]`) or via `tailwind.config.js` `theme.extend.colors` mapped to the same variables.
- Never hardcode a hex value directly in HTML/JS. If a new color is needed, add it as a variable first.

## Animation Layer

- Scroll reveals: implemented with `IntersectionObserver`, not scroll event listeners (performance).
- Hover states: pure CSS (`:hover`, `transition`) — no JS needed for hover effects.
- No animation library dependency. If one becomes necessary, that's a scope change — log it in `audit.md` first.

## Contact Form Integration

- Form markup lives in the Contact section of `index.html`.
- `contact.js` initializes EmailJS and handles `submit`, including basic client-side validation and a success/error UI state.
- Service ID, template ID, and public key are placeholders until the client's EmailJS account is connected — placeholders must be clearly marked (e.g., `YOUR_SERVICE_ID`) so they're impossible to ship by accident.

## Responsive Strategy

- Mobile-first: base Tailwind classes target mobile; `sm:`/`md:`/`lg:` breakpoints layer on enhancements for larger screens.
- No separate mobile/desktop templates — one markup tree, responsive utility classes only.

## Non-Goals (see scope.md)

No routing, no backend, no build-required JS framework, no state management library. If any of these become necessary, `scope.md` and this file must be updated together, with the change logged in `audit.md`.
