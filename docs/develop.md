# develop.md — Development Guide

How to build any new feature or change for this project so it stays consistent with `architecture.md` and `scope.md`.

## Before you start

1. Read `scope.md` — is this change actually in scope? If not, log it in `audit.md` first and get it explicitly approved into scope before writing code.
2. Read `architecture.md` — where does this feature fit in the existing structure? Don't invent a new pattern if an existing one already covers it.
3. Check `audit.md` for any recent decisions that affect this area.

## Adding a new content-driven section (like Projects/Team/Testimonials)

1. Add the data shape to `js/data.js` as a new array of plain objects. Keep object keys consistent with existing arrays' style (lowerCamelCase, same key names across similar arrays — e.g., always `image`, never mix `img`/`photo`/`image`).
2. Add a render function in `js/render.js` that maps the array to DOM nodes. Follow the pattern of the existing render functions — same function naming convention (`renderProjects`, `renderTeam`, etc.), same "find container → clear it → map and append" structure.
3. Add the empty container element in `index.html` in the correct section order (see `architecture.md` section order).
4. Style with Tailwind utility classes only. Don't add custom CSS unless Tailwind genuinely can't express it — if you do, it goes in `index.css`, documented with a comment explaining why.

## Adding a static section (text-only, non-repeating)

1. Write directly in `index.html` inside the appropriate `<section>`.
2. Use placeholder copy in the agreed tone until real copy is supplied — mark placeholder text clearly (e.g., an HTML comment `<!-- PLACEHOLDER COPY -->` above it) so it's easy to find and replace later.

## Styling conventions

- Tailwind utility-first. Avoid custom classes unless reused 3+ times, in which case extract with `@apply` in `index.css`.
- All colors via CSS variables (see `architecture.md` theming section) — never a raw hex code in a class.
- Mobile-first: write the unprefixed (mobile) classes first, then layer `sm:`/`md:`/`lg:` on top.

## JS conventions

- Plain JS, no framework. Prefer small, named functions over large inline scripts.
- One responsibility per file (`render.js` renders, `animations.js` animates, `contact.js` handles the form) — don't mix concerns into one file as the project grows.
- No global variables beyond what's necessary to wire modules together; prefer function parameters/returns.

## Animations

- Use `IntersectionObserver` for scroll reveals — reuse the existing observer setup in `animations.js`, don't create a new one per section.
- Hover states are CSS-only.
- Keep it light — if a new feature seems to need a heavy animation library, stop and check `scope.md`/`audit.md` first.

## When you're done

- Run through `check.md` before considering the feature complete.
- Write or update tests per `test.md`.
- Log the change in `document.md`.
- If the change altered a standard or convention (not just added content), log it in `audit.md` too.
