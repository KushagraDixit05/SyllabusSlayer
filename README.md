# SyllabusSlayer — YouTube Time Architect

Turn a YouTube playlist into a study plan: see how long it really takes, split it into sessions, schedule it around your week, tune playback speed, and track progress with streaks, XP, achievements and analytics.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![Express](https://img.shields.io/badge/Express-4-black?logo=express)](https://expressjs.com/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

**Who it is for:** students facing a lecture playlist before an exam, professionals fitting a long course around work, certification candidates, and anyone with a Watch Later queue that never shrinks.

## Features

- **Playlist analysis** — paste a playlist URL or ID; get video count, total and average duration, and duration at 1×, 1.25×, 1.5×, 1.75× and 2× (YouTube Data API v3).
- **Planner** (`/planner`, works signed-out) — partition into sessions of a chosen length, compute a finish date from daily hours / rest days / weekday-weekend hours, compare speeds (including custom 0.25–3×), add manual videos in many time formats, export PDF / CSV, or share a link.
- **Dashboard** (Google sign-in) — saved playlists with filter, search and view modes; ⌘K command palette; dark mode; onboarding tour.
- **Gamification** — streaks and activity heatmap, XP and levels, 12 achievements with celebration modals, opt-in leaderboard.
- **Analytics** — average study time, most productive day, speed distribution, completion rate, monthly progress.

## Architecture at a glance

```
Browser ─► Next.js 14 frontend (:3000) ─► Supabase PostgreSQL
              │  Auth.js (Google, JWT)
              └─► Express backend (:5000) ─► YouTube Data API v3
```

npm-workspaces monorepo: `backend/` (Express + TypeScript, YouTube only), `frontend/` (Next.js App Router + Tailwind + Zustand), `supabase/` (SQL applied by hand). Details in [ARCHITECTURE.md](./documents/ARCHITECTURE.md).

## Quick start

Requires Node ≥ 18, a YouTube Data API key, a Supabase project and a Google OAuth client.

```bash
npm install
cp backend/.env.example backend/.env           # set YOUTUBE_API_KEY
cp frontend/.env.example frontend/.env.local   # Supabase, Google OAuth, NEXTAUTH_SECRET
# apply supabase/schema.sql → fix-nextauth.sql → migrations/* in the Supabase SQL editor
npm run dev                                    # frontend :3000, backend :5000
```

Production build: `npm run build`, then `npm start` in `backend/` and `frontend/`. Full setup, environment variables, database order, security notes and troubleshooting: [DEPLOYMENT.md](./documents/DEPLOYMENT.md).

## Documentation

| File | Contents |
|---|---|
| [documents/DEPLOYMENT.md](./documents/DEPLOYMENT.md) | Setup, env vars, database, OAuth, build/run, production checklist, security, troubleshooting |
| [documents/ARCHITECTURE.md](./documents/ARCHITECTURE.md) | System design, stack, repository structure, routes, modules, data model, API reference |
| [documents/DEVELOPMENT_PLAN.md](./documents/DEVELOPMENT_PLAN.md) | Delivered phases, known limitations, future improvements |
| [backend/README.md](./backend/README.md), [frontend/README.md](./frontend/README.md) | Per-package commands |
| [CLAUDE.md](./CLAUDE.md) | Contributor conventions (commit style, design tokens, level-math sync) |

## Status

Core product, auth, dashboard, gamification and analytics are implemented. **Before opening to untrusted users, read the security limitation on row-level security in [DEVELOPMENT_PLAN.md](./documents/DEVELOPMENT_PLAN.md#2-known-limitations-and-issues).** Email notifications are scaffolded but not yet sent.

## License

MIT is declared in `backend/package.json`; no `LICENSE` file is present yet.
