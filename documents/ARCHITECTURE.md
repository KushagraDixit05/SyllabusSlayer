# Architecture

System design, stack, repository layout, modules and API reference for SyllabusSlayer. Setup and operations: [DEPLOYMENT.md](./DEPLOYMENT.md).

## 1. Overview

SyllabusSlayer turns YouTube playlists into study plans: it fetches a playlist's videos and durations, computes total time at several playback speeds, splits the playlist into study sessions, schedules completion dates, and tracks progress (streaks, XP, achievements, leaderboard, analytics) for signed-in users.

## 2. System architecture

```
┌────────────────────────── Browser ───────────────────────────┐
│ Next.js 14 client: pages, Zustand stores (planner state       │
│ persisted in localStorage), Supabase browser client (anon key)│
└───────┬───────────────────────────┬──────────────────────────┘
        │ SSR / RSC / NextAuth      │ GET /api/playlist
        ▼                           ▼
┌───────────────────┐        ┌────────────────────┐      ┌──────────────────┐
│ Frontend server   │        │ Backend (Express)  │ ───► │ YouTube Data API │
│ Next.js 14 :3000  │        │ :5000              │      │ v3               │
│ • Auth.js (Google)│        └────────────────────┘      └──────────────────┘
│ • repositories    │──► Supabase PostgreSQL (anon key, no RLS)
│ • lib/email       │──► Resend (client + templates exist; no code path sends yet)
└───────────────────┘
```

Responsibilities
- **Backend** — only the YouTube integration and duration maths. Stateless, public, rate-limited.
- **Frontend** — everything else: UI, auth, persistence (Supabase via repositories), planning algorithms (client-side), exports.
- **Planner state** is client-side (`usePlannerStore`, localStorage key `planner-storage`); saved playlists/progress/gamification are in Supabase.

## 3. Tech stack (as installed)

| Layer | Technology |
|---|---|
| Monorepo | npm workspaces (`backend`, `frontend`), `concurrently` for `npm run dev` |
| Frontend | Next.js 14 App Router, React 18, TypeScript (strict), Tailwind CSS 3.4 + `tailwindcss-animate`, shadcn-style primitives on Radix UI (`components/ui/`), Framer Motion 12, Zustand 4, lucide-react, sonner (toasts), cmdk (⌘K), next-themes, Recharts 3, `shepherd.js` (onboarding tour), react-confetti, `@dnd-kit` (reorder), date-fns 2, jsPDF + jspdf-autotable, simplex-noise |
| Auth | next-auth 5 beta (Auth.js, `@auth/core` pinned to 0.41.0), Google provider, JWT sessions |
| Data | Supabase PostgreSQL via `@supabase/supabase-js` + `@supabase/ssr` |
| Email | Resend + `@react-email/components` |
| Backend | Node.js, Express 4, TypeScript (CommonJS → `dist/`), Zod, helmet, cors, morgan, express-rate-limit, dotenv; native `fetch`; `tsx` for dev |
| Design | Tokens from CSS custom properties in `frontend/app/globals.css`, exposed as Tailwind colors (`brand-*`, `flame-*`, `rarity-*`, `gold`, `sidebar-*`); fonts Inter, Space Grotesk, JetBrains Mono; "brutalist" component style (`brutal-*` charts, `stat-tile`). Do not hard-code hex/raw palette colors (see `CLAUDE.md`). |

Packaging quirk: `shepherd.js` is imported by `components/onboarding/OnboardingTour.tsx` but is **not declared** in `frontend/package.json`; it arrives transitively through `react-shepherd` (which is otherwise unused). Declare `shepherd.js` directly before removing `react-shepherd`.

## 4. Repository structure

```
SyllabusSlayer/
├── backend/                    Express API
│   └── src/ config/ routes/ controllers/ services/ middleware/ utils/ types/ app.ts server.ts
├── frontend/                   Next.js app
│   ├── app/                    routes (below), globals.css, providers.tsx, layout.tsx
│   ├── components/             feature folders + ui/ primitives
│   ├── emails/                 react-email templates
│   ├── hooks/ store/ types/
│   ├── lib/                    algorithms, repositories, supabase, auth, analytics, email, gamification
│   └── middleware.ts           Auth.js middleware
├── supabase/                   schema.sql, fix-nextauth.sql, migrations/, disable-rls-temp.sql
├── documents/                  this documentation
├── CLAUDE.md                   contributor/AI-assistant conventions
└── package.json                workspace root (dev/build scripts)
```
(`.agents/`, `.claude/`, `skills-lock.json` hold AI-assistant skill files, not application code.)

### Routes

| Route | Access | Purpose |
|---|---|---|
| `/` | public | Landing page (`components/landing/*`) |
| `/kage` | public | Alternate landing rendered in an iframe (`components/kage`, `public/landing-pages/kage.html`); not crawlable by design — `/` is the indexable landing |
| `/planner` | public (sidebar when signed in) | Playlist analyser + planner (Partition / Schedule / Speed / Manual tabs, export) |
| `/shared/[id]` | public | Read-only view of a shared plan (state encoded in the URL) |
| `/auth/signin`, `/auth/error` | public | Auth.js custom pages |
| `/api/auth/[...nextauth]` | public | Auth.js handlers |
| `/dashboard` | signed in | Stats, active playlists, progress, recent activity |
| `/dashboard/playlists`, `/dashboard/playlists/[id]` | signed in | Library (filter/search/view modes) and playlist detail |
| `/dashboard/search` | signed in | Playlist search |
| `/dashboard/achievements` | signed in | Achievement grid |
| `/dashboard/leaderboard` | signed in | Hours / streak / completion boards (opt-in) |
| `/dashboard/analytics` | signed in | Insights and charts |
| `/dashboard/profile`, `/settings`, `/help` | signed in | Profile (theme preference), settings, FAQ |

## 5. Backend

```
GET request → rate limiter → helmet/CORS → router → playlistController (Zod) → youtubeService → JSON
```
- `config/config.ts` — env loading; throws if `YOUTUBE_API_KEY` missing.
- `utils/urlParser.ts` — extracts the playlist ID from `…/playlist?list=`, `…/watch?v=…&list=` or a bare ID matching `^(PL|UU|LL|RD|OL)[A-Za-z0-9_-]+$`.
- `services/youtubeService.ts` — three YouTube calls: `playlists` (title), `playlistItems` (paged, 50/page), `videos` (durations, batched 50). A 200-video playlist ≈ 9 quota units of the 10,000/day free quota.
- `utils/durationCalculator.ts` — totals, average, formatting, speeds 1 / 1.25 / 1.5 / 1.75 / 2.
- `middleware/errorHandler.ts` — `AppError(message, status, code)`; every error returns `{success:false,error:{message,code}}`; details are logged, never returned.

### API reference
Base: `{backend}/api`. All responses: `{ "success": true, "data": … }` or `{ "success": false, "error": { "message", "code" } }`. No authentication. Rate limit 100 req / 15 min / IP on `/api/*` (`RateLimit-*` headers).

**`GET /api/playlist?url=<youtube url>`** or **`?playlistId=<id>`** (one required)

```json
{ "success": true, "data": {
  "title": "Complete Python Course", "videoCount": 42,
  "totalDuration": 15430, "totalDurationFormatted": "4h 17m",
  "averageVideoLength": 367, "averageVideoLengthFormatted": "6m 7s",
  "speeds": { "1": "4h 17m", "1.25": "3h 26m", "1.5": "2h 51m", "1.75": "2h 27m", "2": "2h 8m" },
  "videos": [ { "id": "xyz123", "title": "Introduction", "duration": 600 } ] } }
```

**`GET /api/health`** → `{ "success": true, "data": { "status": "healthy", "timestamp": "<ISO 8601>" } }`

| Code | HTTP | Meaning |
|---|---|---|
| `VALIDATION_ERROR` | 400 | neither `url` nor `playlistId` |
| `INVALID_URL` / `INVALID_PLAYLIST_ID` | 400 | unparsable URL / bad ID format |
| `EMPTY_PLAYLIST` | 400 | no videos |
| `PLAYLIST_NOT_FOUND` | 404 | missing or private |
| `NOT_FOUND` | 404 | unknown route |
| `QUOTA_EXCEEDED` | 429 | YouTube quota |
| `RATE_LIMIT_EXCEEDED` | 429 | per-IP limit |
| `API_ERROR` / `INTERNAL_ERROR` | 500 | upstream / unexpected |

Frontend client: `frontend/lib/api.ts` (`fetchPlaylistData`, `healthCheck`) via `hooks/usePlaylist.ts`.

## 6. Frontend modules

**Planner engine (client-side, pure functions in `frontend/lib/`)**
- `partitioning.ts` — session splitting that respects video boundaries; presets 60/90/120/180/240 min, custom 15–300 min, configurable breaks.
- `scheduling.ts` — completion date from daily hours (separate weekday/weekend), rest days, start date.
- `speed.ts` — preset speeds plus custom 0.25–3.0×, comparison and time-saved.
- `timeParser.ts` — accepts `HH:MM:SS`, `1h 30m`, `90 minutes`, raw seconds, etc.; bulk entry format `Title | Duration`.
- `pdfExport.ts`, `csvExport.ts`, `shareableLink.ts` (base64-encoded state in the URL, no server storage).
- UI: `components/{partition,schedule,speed,manual,export}`; state `store/usePlannerStore.ts`.

**Persistence and data access** — `lib/repositories/` (`playlist`, `user`, `achievement`, `activity`, `leaderboard`) are the only DB access path; Supabase clients in `lib/supabase/{client,server,env}.ts`. Tables touched by code: `user_profiles`, `playlists`, `videos`, `achievements`, `activity_log`. `components/progress/SessionCheckIn.tsx` exists but is not mounted anywhere.

**Gamification**
- XP / level: `lib/gamification/xpCurve.ts` — `level = floor(sqrt(xp/50)) + 1`; mirrored by SQL `xp_to_level`. Tier titles (Newcomer → Grandmaster Slayer, by level) in `tier.ts` are cosmetic.
- Streaks: DB trigger `on_activity_logged` updates `current_streak` / `longest_streak` on each `activity_log` insert. `StreakFlame`, `StreakDisplay`, `ActivityHeatmap`.
- Achievements: `lib/achievements/definitions.ts` (12) + `checker.ts`; unlocks queue in `useSavedPlaylistStore` and `GlobalAchievementNotifier` shows the modal. Milestone confetti: `lib/milestones/checker.ts`, `GlobalMilestoneNotifier`.

| Name | Requirement | Rarity | Points |
|---|---|---|---|
| First Steps | 1 playlist | common | 10 |
| Syllabus Slayer | 10 playlists | rare | 100 |
| Marathon Runner | 50 h planned | epic | 150 |
| Ultra Marathon | 100 h planned | legendary | 300 |
| Getting Started | 3-day streak | common | 25 |
| Week Warrior | 7-day streak | rare | 50 |
| Month Master | 30-day streak | epic | 200 |
| Centurion | 100-day streak | legendary | 500 |
| Speed Demon | 50 h saved | rare | 75 |
| Time Bender | 100 h saved | epic | 150 |
| 2x Master | 10 playlists at 2× | epic | 200 |
| Early Adopter | 1 playlist (as defined in code) | legendary | 1000 |

- Leaderboard: opt-in (`leaderboard_opt_in` + `leaderboard_username`), three boards (hours, streak, completion) ranked live from `user_profiles`; UI in `components/leaderboard`.

**Analytics** — `lib/analytics/service.ts` computes daily average, most productive day, speed distribution, completion rate, streak history and monthly progress from `user_profiles`, `playlists`, `activity_log`. The page is a server component; `AnalyticsContent` is a `'use client'` wrapper because icon components can't cross the server→client boundary. Charts: Recharts plus `components/ui/brutal-*`.

**Onboarding / UX** — `OnboardingTour` (shepherd.js, 5 steps, auto-starts after first login, completion stored via `useOnboardingStore` in localStorage), `FeatureTooltip`, ⌘K `CommandMenu`, dark mode (`next-themes`, preference also in `user_profiles.theme_preference`), `ErrorBoundary`, performance hooks in `lib/utils/performance.ts`.

**Email** — `lib/email/{client,service}.ts` and templates `emails/{AchievementUnlocked,WeeklySummary}.tsx`; `EmailService` has `sendAchievementUnlocked`, `sendWeeklySummary`, `sendStreakReminder`. Nothing currently calls it (see limitations).

**Zustand stores** (`frontend/store/`): `usePlannerStore` (persisted `planner-storage`), `useSavedPlaylistStore` (DB-synced playlists + pending achievements), `useUIStore` (loading/error), `useViewStore` (persisted grid/list/compact), `useOnboardingStore` (persisted), `useCommandMenuStore`.

## 7. Data model

| Table | Purpose / key columns |
|---|---|
| `user_profiles` | `id` TEXT (Google sub); display name, avatar, `theme_preference`, streaks (`current_streak`, `longest_streak`, `last_activity_date`), totals (`total_playlists_created/completed`, `total_hours_planned/completed`), `xp`, `total_hours_saved`, `speed_mastery_count`, `leaderboard_opt_in`, `leaderboard_username` |
| `playlists` | saved playlist: `youtube_playlist_id`, `title`, `source`, `total_duration`, `adjusted_duration`, `playback_speed`, `status` (`planning`/`in_progress`/`completed`/`archived`), `completion_percentage` |
| `videos` | videos per playlist |
| `achievements` | unlocked achievements per user |
| `activity_log` | event log with `duration_seconds`; drives streaks, heatmap, analytics |
| `partitions`, `schedules`, `daily_schedules`, `templates` | in schema, not used by current code |
| `leaderboard_stats` (materialized view) | ranked opted-in users; not read by the app |

Triggers/functions: `updated_at` triggers, `on_playlist_completed` → `update_user_stats_on_playlist_complete()` (completed totals, hours saved, 2×-mastery count), `on_activity_logged` → `update_streak_on_activity()`, `xp_to_level()`.

## 8. Key decisions

| Decision | Choice | Why |
|---|---|---|
| Separate backend | Express, not Next API routes | Keeps the YouTube key and quota logic out of the web tier; reusable by future clients |
| Auth | Auth.js JWT + Google, no adapter | Simple; user rows created lazily by `syncUserToDatabase` |
| DB access | Supabase as plain Postgres via anon key | Consequence: RLS disabled — see Known limitations |
| Planner state | Client-side + base64 share links | No server storage needed for sharing |
| State | Zustand | Minimal boilerplate, `persist` middleware |
| Tour | `shepherd.js` directly | `react-shepherd` conflicted with Next 14 / React |
| Validation | Zod | Runtime-typed query validation |
