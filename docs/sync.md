# sync.md — Keeping Standards & Context in Sync

This project may be worked on across multiple tools/environments (different editors, AI coding assistants, different machines, different sessions). This file exists so a standard or context change made in one place doesn't get silently lost when work continues somewhere else.

## The problem this solves

A markdown file set like this only works if every session/tool actually reads it before acting, and updates it when something changes. Without an explicit sync step, drift happens: one session invents a new naming convention, another session doesn't know about it, and the codebase becomes inconsistent.

## Sync rule

Any time a standard, convention, or piece of durable project context changes — regardless of which tool or session made the change — it must be written into the relevant file (`scope.md`, `architecture.md`, `develop.md`, etc.) immediately, not just mentioned in conversation. Conversation is not persistent; the files are.

## Start-of-session checklist (for a human or an AI agent picking up work)

1. Read `agents.md` first — it's the combined entrypoint.
2. Read `audit.md`'s most recent entries — check for anything that changed since your last session.
3. Read `document.md`'s most recent entries — check what was last implemented.
4. Confirm your planned work still matches current `scope.md`.

## End-of-session checklist

1. Did any standard/convention change during this session? → Log it in `audit.md`, update the relevant doc(s).
2. Did any feature get implemented/changed? → Log it in `document.md`.
3. Did any bug get root-caused? → Confirm `debug.md`'s findings were handed to `test.md` as a new test case.
4. Is there anything a different tool/session would need to know to not contradict this session's work? → Make sure it's written down, not just implied by the code.

## Cross-tool consistency notes

- Don't assume any tool "remembers" prior sessions — these files are the memory, not the tool.
- If a tool has its own local config/preferences (formatter settings, linter rules), make sure those are consistent with what's written in `develop.md`; if they conflict, `develop.md` wins and the tool config should be corrected.
- If working across multiple machines, these doc files should be committed to the repo (not left as local-only notes) so they travel with the codebase.

## When in doubt

If a session is unsure whether something counts as a "standards change" (→ `audit.md`) or just a "regular change" (→ `document.md`), err on the side of logging in both — over-documentation here is cheaper than silent drift.
