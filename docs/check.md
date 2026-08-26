# check.md — Pattern & Standards Check

Run through this before marking any change complete. This checks _conformance_ to the standards in `scope.md`, `architecture.md`, and `develop.md` — it does not test functionality (see `test.md`) or write the change log (see `document.md`).

## Scope conformance

- [ ] Does this change fall within `scope.md`? If not, was it added to scope via an `audit.md` entry first?
- [ ] Does it avoid introducing anything explicitly listed as out-of-scope (blog, multi-language, pricing page, framework, backend)?

## Architecture conformance

- [ ] Does the file live in the correct location per `architecture.md`'s file structure?
- [ ] If it's repeatable content (project, team member, testimonial, social link), is it array-driven from `data.js` rather than hardcoded in `index.html`?
- [ ] If it's a static section, is it plain markup in `index.html` with no unnecessary JS?
- [ ] Are all colors referenced via CSS custom properties — zero raw hex values in HTML/JS/Tailwind classes?
- [ ] Is the responsive approach mobile-first (base classes = mobile, breakpoints layer up)?

## Code style conformance

- [ ] Does new JS follow the single-responsibility file split (`render.js` / `animations.js` / `contact.js`)?
- [ ] Are function and data-key naming conventions consistent with existing code (see `develop.md`)?
- [ ] Are Tailwind utility classes used instead of new custom CSS, unless justified and documented?
- [ ] Any placeholder content (copy, EmailJS IDs, images) clearly marked as placeholder?

## Animation conformance

- [ ] Scroll reveals use the existing `IntersectionObserver` setup, not a new one?
- [ ] Hover effects are CSS-only, no unnecessary JS listeners?
- [ ] No new animation dependency introduced without an `audit.md` entry?

## Regression check

- [ ] Does this change break any existing section's layout, spacing, or responsiveness?
- [ ] Does it still load without a build step (or with only the agreed build step, if one was formally adopted)?

## Outcome

- If everything above passes → proceed to `test.md`.
- If anything fails → fix it, or if the failure reveals the standard itself needs to change, log that in `audit.md` and update the relevant doc(s) before proceeding.
