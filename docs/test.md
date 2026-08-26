# test.md — Testing Standards

This is a static site with plain JS, so "testing" here means a mix of manual verification checklists and small automated checks for the JS logic that has real behavior (rendering, form handling, animations) — not full end-to-end test suites unless the project's complexity grows to justify one.

## What needs a test vs. what needs a manual check

| Type                                                                         | Approach                                                                           |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Data-driven rendering (`renderProjects`, `renderTeam`, `renderTestimonials`) | Automated: feed a sample array, assert the expected DOM/HTML output                |
| Contact form validation logic                                                | Automated: valid/invalid input cases                                               |
| EmailJS submission itself                                                    | Manual (requires live service — can't easily be automated without mocking the SDK) |
| Layout, responsiveness, visual spacing                                       | Manual, cross-device/browser                                                       |
| Scroll-reveal animation                                                      | Manual — visually confirm trigger points and no jank                               |
| Accessibility (contrast, alt text, keyboard nav)                             | Manual checklist, run a Lighthouse/axe pass                                        |

## Automated testing setup (lightweight)

- If/when automated tests are added, use a minimal runner (e.g., Vitest or plain Node `assert` scripts) — do not pull in a heavy framework for a static site.
- Test files live alongside their source: `js/render.test.js` next to `js/render.js`, etc.
- Each render function test should cover: empty array (renders nothing / shows empty state, doesn't throw), single item, multiple items, and any expected data-attribute or class output that other code depends on.

## Manual test checklist (run before any release/handoff)

- [ ] All 8 sections render correctly with current placeholder data
- [ ] Adding a new entry to each array (`projects`, `team`, `testimonials`, `socials`) renders correctly with no markup edits needed
- [ ] Contact form: empty submit is blocked with a clear message
- [ ] Contact form: valid submit triggers the EmailJS call (check network tab even with placeholder IDs — it should attempt the call)
- [ ] Mobile viewport (375px), tablet (768px), desktop (1280px+) all look correct
- [ ] Scroll reveals trigger once per element, no repeated re-trigger flicker
- [ ] All images have `alt` text
- [ ] Color contrast meets at least WCAG AA for text against beige backgrounds
- [ ] No console errors on load or interaction

## When a bug is found

- Don't just patch it — follow `debug.md` to find the root cause, then write a test here that would have caught it, so it can't silently regress.

## Definition of "tested"

A feature isn't done until it passes both the relevant automated tests (if applicable) and every relevant line of the manual checklist above.
