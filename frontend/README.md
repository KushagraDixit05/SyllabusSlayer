# SyllabusSlayer Frontend

Next.js 14 (App Router) application: landing page, playlist planner, Google sign-in (Auth.js v5), and the authenticated dashboard (playlists, search, achievements, leaderboard, analytics, profile, settings, help). It talks to the Express backend for playlist data and to Supabase for user data.

## Configuration (`frontend/.env.local`, template in `.env.example`)

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | prod | Backend URL; inlined at build |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Inlined at build |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | yes | Google OAuth |
| `NEXTAUTH_SECRET` (or `AUTH_SECRET`), `NEXTAUTH_URL` (or `AUTH_URL`) | yes / recommended | Auth.js |
| `RESEND_API_KEY` | no | Email client (not yet used by any flow) |

`SUPABASE_SERVICE_ROLE_KEY` and `GITHUB_*` appear in `.env.example` but are unused. Full table: [DEPLOYMENT.md §3](../documents/DEPLOYMENT.md#3-environment-variables).

## Commands

```bash
npm run dev          # next dev (http://localhost:3000)
npm run build
npm start            # next start
npm run type-check
npm run lint
```
(Run from `frontend/`, or from the repo root with `--workspace=frontend`.)

## Layout

`app/` routes · `components/` feature folders and `ui/` primitives · `lib/` planner algorithms, repositories (all DB access), Supabase clients, auth, analytics, email, gamification · `store/` Zustand stores · `emails/` react-email templates · `middleware.ts` Auth.js middleware.

## Conventions

- Colors come from the CSS custom properties in `app/globals.css`, surfaced as Tailwind tokens in `tailwind.config.ts` (`brand-*`, `flame-*`, `rarity-*`, `gold`, `sidebar-*`); no hard-coded hex or raw palette classes.
- Level math lives in `lib/gamification/xpCurve.ts` and is mirrored by the SQL `xp_to_level` function; change both together.
- Data access goes through `lib/repositories/`.
- Icon components cannot be passed from server to client components — use a `'use client'` wrapper (see `AnalyticsContent`).

Routes, modules and stores: [ARCHITECTURE.md §4–§6](../documents/ARCHITECTURE.md#4-repository-structure).
