# debug.md — Debugging Process

How to investigate and fix a bug in this project, and how to hand it off to `test.md` so it can't silently come back.

## Step 1 — Reproduce

- Confirm the exact steps, viewport size, and browser that trigger the bug.
- Check the browser console for errors first, then the terminal running `npm run dev` — build and type errors show up there.
- Reproduce against a production build too (`npm run build`, then serve `out/`): a few things only differ there (static export, font loading).

## Step 2 — Localize

Work outward from the symptom to the layer responsible, using `architecture.md` as the map:

- Visual/layout issue → check the Tailwind classes in the section's component under `components/`, then the tokens and component classes in `app/globals.css`.
- A colour or class that "does nothing" → it is probably not a design token. Only tokens declared in `@theme` generate utilities (see `architecture.md` — Theming).
- Content missing/wrong → check the relevant array in `lib/data.ts` (or `lib/site.ts`) first, then the component that maps it.
- A section missing entirely → check its guard: Testimonials renders nothing until an entry has `verified: true`.
- Animation glitch → `components/ui/Reveal.tsx` for scroll reveals, the keyframes in `app/globals.css` for CSS animation. Check behaviour with reduced motion on.
- "Hydration" warning in the console → a client component rendered something different on the server than in the browser (dates, random values, `window` access during render).
- Form not submitting → `components/Contact.tsx` and `lib/validation.ts`; check the EmailJS IDs in `lib/site.ts`, the allowed-domain setting in the EmailJS dashboard, and the browser's network tab for the request to `api.emailjs.com`.
- Image missing → check it exists in `public/`; if not, run `npm run images`.

## Step 3 — Find the root cause, not just the symptom

- Don't patch the visible effect if the actual defect is upstream (e.g., don't add a null-check band-aid in a component if the real issue is malformed data in `lib/data.ts`).
- Check `audit.md` and `document.md` for recent changes to the affected area — regressions often trace back to a recent, undocumented deviation from the established pattern.
- Check `check.md` retroactively: would running the checklist have caught this before it shipped? If yes, note which checklist item was skipped.

## Step 4 — Fix

- Fix at the root cause identified in Step 3.
- Re-run the relevant sections of `check.md` on the fix itself.

## Step 5 — Hand off to test.md

- Every root-caused bug must produce a corresponding test case in `test.md` (automated if the affected code is testable — data integrity, form validation, pure functions in `lib/`; manual checklist item if it's visual/behavioral).
- If the bug reveals a gap in `check.md`'s checklist itself, add the missing check there too.

## Step 6 — Document

- Log the fix in `document.md` using the standard change-log format, referencing the root cause, not just "fixed bug."
- If the bug was caused by a standards drift (someone didn't follow `develop.md`), note that in `audit.md` so the pattern is reinforced, not just the one instance fixed.

## Anti-patterns to avoid

- Fixing the same symptom twice without ever writing a test for it.
- Silent fixes with no `document.md` entry — makes future debugging harder because there's no record of what already changed.
- Adding defensive code everywhere instead of fixing the one place the bad state originates.
