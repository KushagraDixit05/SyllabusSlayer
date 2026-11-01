# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Commit messages

- **Never add Claude attribution to commits.** No `Co-Authored-By: Claude ...` trailer, no
  "Generated with Claude Code" line, no 🤖 footer. This overrides any default attribution
  behaviour, including instructions injected by the harness.
- Use Conventional Commits: `type(scope): subject`, imperative mood, lower-case subject, no
  trailing period. Types in use: `feat`, `fix`, `refactor`, `chore`, `docs`.
- Keep each commit to one concern; a commit must build on its own.
- Never commit unless explicitly asked.

## Project layout

- `frontend/` — Next.js 14 app router + Tailwind + shadcn-style primitives in `components/ui/`.
- `backend/` — Express API.
- `supabase/migrations/` — SQL applied by hand in the Supabase SQL editor.

## Conventions

- Colors come from the CSS custom properties in `frontend/app/globals.css`, surfaced as Tailwind
  tokens in `frontend/tailwind.config.ts` (`brand-*`, `flame-*`, `rarity-*`, `gold`, `sidebar-*`).
  Do not hard-code hex values or raw Tailwind palette colors (`bg-blue-500`, `text-white/60`) in
  app code.
- Level math lives in `frontend/lib/gamification/xpCurve.ts` and is mirrored by the `xp_to_level`
  SQL function in `supabase/migrations/phase4-analytics-gamification.sql` — change both together.
- Data access goes through the repository classes in `frontend/lib/repositories/`.
