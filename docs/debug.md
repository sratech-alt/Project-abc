# debug.md — Debugging Process

How to investigate and fix a bug in this project, and how to hand it off to `test.md` so it can't silently come back.

## Step 1 — Reproduce

- Confirm the exact steps, viewport size, and browser that trigger the bug.
- Check the browser console for errors first — plain JS bugs are usually loud if you look.

## Step 2 — Localize

Work outward from the symptom to the layer responsible, using `architecture.md` as the map:

- Visual/layout issue → check Tailwind classes in `index.html`, then `index.css` custom properties.
- Content missing/wrong → check the relevant array in `js/data.js` first, then the matching render function in `js/render.js`.
- Animation glitch → `js/animations.js`, check the `IntersectionObserver` setup and CSS transition rules.
- Form not submitting → `js/contact.js`, check EmailJS init, event listener binding, and whether placeholder IDs are still in place (expected to fail until real IDs are added).

## Step 3 — Find the root cause, not just the symptom

- Don't patch the visible effect if the actual defect is upstream (e.g., don't add a null-check band-aid in `render.js` if the real issue is malformed data in `data.js`).
- Check `audit.md` and `document.md` for recent changes to the affected area — regressions often trace back to a recent, undocumented deviation from the established pattern.
- Check `check.md` retroactively: would running the checklist have caught this before it shipped? If yes, note which checklist item was skipped.

## Step 4 — Fix

- Fix at the root cause identified in Step 3.
- Re-run the relevant sections of `check.md` on the fix itself.

## Step 5 — Hand off to test.md

- Every root-caused bug must produce a corresponding test case in `test.md` (automated if the affected code is testable — render functions, form validation; manual checklist item if it's visual/behavioral).
- If the bug reveals a gap in `check.md`'s checklist itself, add the missing check there too.

## Step 6 — Document

- Log the fix in `document.md` using the standard change-log format, referencing the root cause, not just "fixed bug."
- If the bug was caused by a standards drift (someone didn't follow `develop.md`), note that in `audit.md` so the pattern is reinforced, not just the one instance fixed.

## Anti-patterns to avoid

- Fixing the same symptom twice without ever writing a test for it.
- Silent fixes with no `document.md` entry — makes future debugging harder because there's no record of what already changed.
- Adding defensive code everywhere instead of fixing the one place the bad state originates.
