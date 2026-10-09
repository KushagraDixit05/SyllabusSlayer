# Deployment Guide

Setup, configuration and operation of SyllabusSlayer — local and production. For design see [ARCHITECTURE.md](./ARCHITECTURE.md); for status and limitations see [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md).

## 1. Deployment architecture

Two independently deployed Node processes plus managed services. The repo ships **no** Dockerfile, CI config or hosting config; the commands below are what any Node host needs.

```
Browser ──► Frontend  (Next.js 14, `next start`, :3000)  ── Google OAuth (sign-in)
              │   │  └─ server-side: Supabase (PostgreSQL), Resend (email client; not yet invoked)
              │   └──── browser: Supabase (anon key)
              └──► Backend (Express, `node dist/server.js`, :5000) ──► YouTube Data API v3
```

| Component | Runtime | Notes |
|---|---|---|
| Frontend | Node 18+ | Public site, auth, dashboard, planner. Hosts the NextAuth routes (`/api/auth/*`). The existing docs suggested Vercel; any Node host works. |
| Backend | Node 18+ | Stateless; only calls YouTube. Holds the YouTube key. The existing docs suggested Railway / Fly.io / DigitalOcean / Heroku. |
| Supabase | managed | PostgreSQL only. **Supabase Auth is not used** (see §6). |
| Google Cloud | managed | YouTube Data API key + OAuth 2.0 client. |
| Resend | managed | Optional. |

## 2. Prerequisites

- Node.js ≥ 18, npm ≥ 9 (npm workspaces: `backend`, `frontend`)
- Supabase project
- Google Cloud project with **YouTube Data API v3** enabled, an **API key**, and an **OAuth 2.0 Web client**
- (optional) Resend account

## 3. Environment variables

Templates: `backend/.env.example` → `backend/.env`; `frontend/.env.example` → `frontend/.env.local`. (The root `.env.example` is a combined copy of the same values.)

### Backend

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `YOUTUBE_API_KEY` | **yes** (process exits without it) | – | YouTube Data API v3 key. Secret. |
| `PORT` | no | `5000` | Listen port |
| `NODE_ENV` | no | `development` | `development` enables request logging (morgan) |
| `ALLOWED_ORIGINS` | no | `http://localhost:3000` | Comma-separated CORS origins. **Set to the production frontend origin.** |
| `RATE_LIMIT_WINDOW_MS` | no | `900000` | Rate-limit window (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | no | `100` | Requests per IP per window |

### Frontend

| Variable | Required | Exposed to browser | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | yes in prod | yes (inlined at build) | Backend base URL, no trailing `/api`. Falls back to `http://localhost:5000`. |
| `NEXT_PUBLIC_SUPABASE_URL` | **yes** | yes (inlined at build) | `https://<ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **yes** | yes (inlined at build) | Supabase anon key. Used for *all* DB access (see §6). |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | **yes** | no | Google OAuth client. Secret. |
| `NEXTAUTH_SECRET` (or `AUTH_SECRET`) | **yes** | no | JWT/session signing secret. Auth.js v5 reads `AUTH_SECRET` first, then `NEXTAUTH_SECRET`. Generate with `openssl rand -base64 32`. |
| `NEXTAUTH_URL` (or `AUTH_URL`) | recommended | no | Public frontend URL. `trustHost: true` is set in `lib/auth.ts`, so it is not strictly needed behind a proxy that sets host headers. |
| `RESEND_API_KEY` | no | no | Resend client. Sender is hard-coded to `notifications@syllabusslayer.com` in `lib/email/client.ts`. |
| `SUPABASE_SERVICE_ROLE_KEY` | no | no | Listed in `.env.example` but **not read by any code**. Do not set it unless you add code that needs it. |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | no | no | Listed in `.env.example` but unused — GitHub sign-in is not configured. |

`NEXT_PUBLIC_*` values are baked in at **build** time: changing them requires a rebuild. Missing/placeholder Supabase values throw a `SupabaseConfigError` (`lib/supabase/env.ts`).

## 4. Database (Supabase)

Migrations are plain SQL applied **by hand** in the Supabase SQL Editor, in this order (the repo has no migration runner):

| # | File | Purpose |
|---|---|---|
| 1 | `supabase/schema.sql` | 9 tables: `user_profiles`, `playlists`, `videos`, `partitions`, `schedules`, `daily_schedules`, `achievements`, `activity_log`, `templates`; indexes, `updated_at` triggers, `on_playlist_completed` trigger, RLS policies written for Supabase Auth |
| 2 | `supabase/fix-nextauth.sql` | **Required.** Drops FKs to `auth.users`, drops all RLS policies and disables RLS, converts `user_profiles.id` and every `user_id` column from `UUID` to `TEXT` (NextAuth IDs are Google `sub` strings). Idempotent. |
| 3 | `supabase/migrations/phase3c-gamification.sql` | `user_profiles.leaderboard_opt_in`, `leaderboard_username`; `leaderboard_stats` materialized view + indexes |
| 4 | `supabase/migrations/phase4-analytics-gamification.sql` | `activity_log.duration_seconds` (+ index), `user_profiles.xp / total_hours_saved / speed_mastery_count`, `xp_to_level()`, extended `update_user_stats_on_playlist_complete()`, streak trigger `on_activity_logged` |

Notes
- `supabase/disable-rls-temp.sql` is a debugging leftover; `fix-nextauth.sql` already disables RLS. Do not run it separately.
- Verify after step 2: Table Editor → `user_profiles.id` must be type `text`.
- The app code reads/writes `user_profiles`, `playlists`, `videos`, `achievements`, `activity_log`. `partitions`, `schedules`, `daily_schedules`, `templates` exist in the schema but are not used by current code (planner state lives in the browser; see ARCHITECTURE).
- The leaderboard UI queries `user_profiles` directly (opted-in users with a username), **not** the `leaderboard_stats` view, so no refresh job is needed for the app. If you query the view yourself: `REFRESH MATERIALIZED VIEW leaderboard_stats;`.
- Level math exists twice: `frontend/lib/gamification/xpCurve.ts` and SQL `xp_to_level` (`level = floor(sqrt(xp/50)) + 1`). Change both together.

## 5. Google setup

1. **YouTube API key** — Cloud Console → APIs & Services → enable *YouTube Data API v3* → Credentials → API key (optionally restrict to that API). Goes in `backend/.env`. Quota: 10,000 units/day; a 200-video playlist costs ≈ 9 units.
2. **OAuth client** — Credentials → OAuth 2.0 Client ID (Web application). Authorized redirect URIs:
   - local: `http://localhost:3000/api/auth/callback/google`
   - prod: `https://<frontend-host>/api/auth/callback/google`

## 6. Authentication & security

- **Auth:** NextAuth.js (Auth.js) v5 beta, **Google provider only**, JWT sessions (no DB sessions, no adapter). `session.user.id` is the Google `sub`. Custom pages: `/auth/signin`, `/auth/error`.
- **Route protection:** `app/dashboard/*` is guarded server-side by `ProtectedRoute` (redirects to `/auth/signin`). `/planner` and `/shared/[id]` work signed-out. `middleware.ts` re-exports `auth` with a matcher that skips `api/auth`, static assets, `auth` pages and `/`.
- **Profile creation:** `syncUserToDatabase` (`lib/auth-helpers.ts`) inserts/updates the `user_profiles` row when `/dashboard` loads. The `on_auth_user_created` trigger from `schema.sql` never fires (Supabase Auth unused).
- **Database access model (important):** every repository uses the Supabase **anon key** (`@supabase/ssr` browser/server clients) and filters by `user_id` in application code. **RLS is disabled** after `fix-nextauth.sql`, so anyone holding the public anon key can read or write every table directly through the Supabase API. Treat this as the main security gap before opening to untrusted users (see Known limitations).
- **Backend:** helmet headers, CORS allow-list (`ALLOWED_ORIGINS`, `credentials: true`), Zod validation, per-IP rate limit (in-memory, per instance) on `/api/*`, error responses never include stack traces. No authentication — endpoints are public and read-only.
- **Secrets:** `YOUTUBE_API_KEY`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `RESEND_API_KEY` are server-only. `.env*` files are git-ignored.

## 7. Local development

```bash
npm install                                   # installs both workspaces
cp backend/.env.example backend/.env          # set YOUTUBE_API_KEY
cp frontend/.env.example frontend/.env.local  # set Supabase, Google, NEXTAUTH_SECRET
npm run dev                                   # backend :5000 + frontend :3000
```

Verify: `curl localhost:5000/api/health` → `{"success":true,"data":{"status":"healthy",...}}`; open `http://localhost:3000`, analyse a public playlist, sign in with Google, land on `/dashboard`, and confirm a row appears in `user_profiles` with a text `id`. Restart the dev server after editing `.env.local`.

## 8. Build and run (production)

| Where | Command | Result |
|---|---|---|
| root | `npm run build` | builds both workspaces (`build:backend`, `build:frontend` individually) |
| backend | `npm run build` then `npm start` | `tsc` → `dist/`; runs `node dist/server.js` |
| frontend | `npm run build` then `npm start` | `next build`; `next start` |
| both | `npm run type-check`, `npm run lint` | static checks (no test suite exists) |

Production checklist
1. Deploy backend with `YOUTUBE_API_KEY`, `NODE_ENV=production`, `ALLOWED_ORIGINS=https://<frontend-host>`; confirm `GET /api/health`.
2. Build frontend with `NEXT_PUBLIC_API_URL=https://<backend-host>` and the Supabase vars present **at build time**; set the server-side vars at runtime.
3. Add the production Google redirect URI (§5) and set `NEXTAUTH_URL`/`AUTH_URL` to the public frontend URL.
4. Apply the four SQL files (§4) to the production Supabase project.
5. Sign in end-to-end and check `user_profiles`.

## 9. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Backend exits: `Missing required environment variable: YOUTUBE_API_KEY` | Add it to `backend/.env` / host env |
| `EADDRINUSE :5000` | Change `PORT` and `NEXT_PUBLIC_API_URL` together |
| Browser CORS error calling the API | `ALLOWED_ORIGINS` must contain the exact frontend origin; restart backend |
| `QUOTA_EXCEEDED` | YouTube quota resets at midnight Pacific; or request more quota |
| `PLAYLIST_NOT_FOUND` | Playlist private/unlisted-deleted, or key lacks the API |
| `SupabaseConfigError` / `Failed to fetch` | URL/anon key missing or still the `.env.example` placeholder; restart/rebuild |
| Sign-in fails writing the profile, or type errors on `user_id` | `fix-nextauth.sql` was skipped (UUID columns) |
| Sign-in loop / `redirect_uri_mismatch` | Redirect URI not registered in Google, or wrong `NEXTAUTH_URL` |
| Dashboard empty after sign-in | Check server logs from `syncUserToDatabase`; verify Supabase URL/anon key and that tables exist |
| Leaderboard empty | Users must opt in (Settings/Leaderboard dialog) and have a `leaderboard_username` |
| `Module not found: '@/…'` | `rm -rf frontend/node_modules frontend/.next && npm install` |

## 10. Manual smoke checklist

Backend health 200 · invalid URL shows error · playlist analysis shows all speeds · copy/clear work · planner partition/schedule/speed/manual tabs · PDF/CSV export · shareable link opens `/shared/…` · Google sign-in → `/dashboard` · onboarding tour on first login · playlists/search/analytics/achievements/leaderboard/profile/settings/help load · ⌘K palette · dark-mode toggle.
