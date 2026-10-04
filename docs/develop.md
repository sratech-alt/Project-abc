# develop.md — Development Guide

How to build any new feature or change for this project so it stays consistent with `architecture.md` and `scope.md`.

## Before you start

1. Read `scope.md` — is this change actually in scope? If not, log it in `audit.md` first and get it explicitly approved into scope before writing code.
2. Read `architecture.md` — where does this feature fit in the existing structure? Don't invent a new pattern if an existing one already covers it.
3. Check `audit.md` for any recent decisions that affect this area.
4. Run `npm install` once, then `npm run dev` to work locally.

## Editing content (no code changes)

- Projects, services, tech stack, "why us" reasons, testimonials, team, socials, hero metrics → `lib/data.ts`.
- Company name, emails, address, nav links, the availability line next to the logo → `lib/site.ts`.
- The code shown in the hero window → `lib/code-samples.ts`.
- A new or changed image → put the original in `assets/`, add it to `scripts/optimize-images.mjs`, run `npm run images`, and record the printed width/height in `lib/data.ts`.

## Publishing a blog post or a job (no code changes)

1. Open the Supabase dashboard → Table Editor → `posts` or `jobs` → Insert row.
2. Fill in `slug` (lowercase letters, numbers and single hyphens; it becomes the address), `title`, and the body in Markdown (`content_md` / `description_md`). For a post, `excerpt` is the summary shown in lists and search results. For a job, set `employment_type` to one of `FULL_TIME`, `PART_TIME`, `CONTRACTOR`, `INTERN`.
3. Leave `published` off while drafting. Turn it on to publish. `published_at` / `posted_at` in the future schedules it; a job with `closes_at` in the past disappears.
4. For a cover image: Storage → `media` → upload → copy the public URL into `cover_image_url`, and describe the image in `cover_image_alt`.
5. The live site updates on the next build. The database webhook triggers one automatically; you can also use "Trigger deploy" in Netlify.
6. To preview before publishing, run `npm run dev` — it reads the database on every page load, but only shows published rows.

Markdown notes: start section headings at `##`. Raw HTML is not supported and will be shown as text. Images must be `https://` URLs.

## Changing the database

1. Log the change in `audit.md` first if it adds a table or a new kind of content.
2. Edit `supabase/schema.sql` — keep it re-runnable (`create table if not exists`, `drop policy if exists`). Every table must enable Row Level Security and allow only `select` of published rows to `anon`.
3. Run the file in the Supabase SQL editor.
4. Add the loader and row-to-type mapping in `lib/content.ts`, with tests in `lib/content.test.ts`.

## Adding a new content-driven section

1. Add the type and the array to `lib/data.ts`. Keep keys consistent with existing arrays (lowerCamelCase; always `image`, never `img`/`photo`).
2. Add a component in `components/` that maps the array to markup. Follow the existing sections: `<section id="…" aria-labelledby="…-title">`, a `<SectionHeading>`, content wrapped in `<Reveal>`, cards using the `.card` class with `data-spotlight`.
3. Add it to `app/page.tsx` in scroll order. If it should be in the navigation, add it to `navLinks` in `lib/site.ts`.
4. Keep it a server component unless it needs state or event handlers.

## Adding a static section

Write it as a server component with its copy inline. If the copy is a placeholder, mark it with a `{/* PLACEHOLDER COPY */}` comment so it is easy to find — and do not ship placeholder claims (quotes, numbers, client names) as if they were real.

## Content rules

- Everything published must be true. No invented testimonials, metrics, client names or logos. A testimonial is only shown when `verified: true`; set that only for a real quote the client agreed to.
- A project's `highlight` is a fact about the project (what it does, where it's live), not a made-up performance figure.
- Never render a link, button or hover cue that leads nowhere. No `href="#"`.
- Links to home-page sections are written `/#section`, never `#section`, so they work from the blog and careers pages too.
- Never put a secret in the repo. The only Supabase credentials the site uses are the project URL and the publishable key.

## Styling conventions

- Tailwind utility-first. Extract a class into `@layer components` in `app/globals.css` only when it's reused 3+ times or can't be expressed with utilities (the existing ones: `.btn`, `.card`, `.chip`, `.eyebrow`, `.glow`, `.flow-line`).
- Colours come from design tokens only: `bg-canvas`, `bg-panel`, `border-line`, `text-fg`, `text-muted`, `text-faint`, `text-accent`, `text-iris-soft`, `text-ok`/`warn`/`err`. Need a new colour? Add a `--color-*` token to `@theme` first. Raw hex values and default-palette classes (`bg-zinc-900`) do not work and fail the unit tests.
- Body copy is at least `text-[0.95rem]`; 12px (`text-xs`) is for labels and chips only.
- Mobile-first: write the unprefixed (phone) classes first, then layer `sm:`/`md:`/`lg:`/`xl:`.
- Use `cn()` from `lib/cn.ts` for conditional classes.

## TypeScript / React conventions

- TypeScript strict mode; no `any`.
- One component per file, named exports, file name matches the component.
- Pure logic (validation, tokenizing, layout maths) lives in `lib/` so it can be unit-tested without a DOM.
- Import with the `@/` alias (`@/lib/data`, `@/components/ui/Reveal`).

## Animations

- Scroll reveal → `<Reveal>` (optionally with `delay` for staggering). Don't create new `IntersectionObserver`s for reveals.
- Framer Motion → `m.*` components only (the provider uses `LazyMotion strict`).
- Above-the-fold or decorative loops → CSS keyframes in `globals.css`, exposed as `animate-*` utilities.
- A looping animation may animate only `transform` and `opacity`. Never loop `left`/`top`, `background-position`, `stroke-dashoffset`, `visibility`, sizes or colours — move a wider strip with `transform` instead (see `.flow-line`), or run the effect on hover.
- The largest text on screen at load (the hero headline) must not start at `opacity: 0`.
- Hover effects are CSS-only. Keep motion light and make sure it still reads correctly with reduced motion on.

## Accessibility

- Every section has a heading; heading levels don't skip (`h1` → `h2` → `h3` → `h4`).
- Interactive elements are real `<a>`/`<button>` elements, at least 24×24px, with a visible focus ring (never remove the outline).
- Decorative graphics get `aria-hidden="true"`; meaningful images get real `alt` text; icon-only controls get an `aria-label`.
- Status messages go in an `aria-live` region next to the control that triggered them.

## When you're done

- Run `npm run typecheck`, `npm test` and `npm run build`.
- Run through `check.md`, then the manual checklist in `test.md`.
- Log the change in `document.md`.
- If the change altered a standard or convention (not just added content), log it in `audit.md` too.
