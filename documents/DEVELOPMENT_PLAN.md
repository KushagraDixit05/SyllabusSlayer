# Development Plan

What has been delivered, what is known to be incomplete, and what comes next. Architecture: [ARCHITECTURE.md](./ARCHITECTURE.md). Operations: [DEPLOYMENT.md](./DEPLOYMENT.md).

## 1. Delivered

| Phase | Theme | Delivered |
|---|---|---|
| **1 — MVP** | Calculator | Playlist URL/ID parsing; YouTube Data API integration (paged, batched); total and average duration; 1×–2× speed table; copy-to-clipboard, clear, loading and error states; responsive UI. Express backend with Zod validation, helmet, CORS, rate limiting. |
| **2 — Architect engine** | Planner | Partitioning into sessions (video-boundary aware, presets 60–240 min, custom 15–300, breaks); time-to-finish scheduling (weekday/weekend hours, rest days, start date); speed comparison with time saved and custom 0.25–3× speed; manual entry (single + bulk, 8+ time formats); PDF, CSV and shareable-link export; `/planner` and `/shared/[id]`; Zustand store with persistence. |
| **3A — Auth & data** | Accounts | Auth.js v5 (Google), Supabase PostgreSQL schema, repository layer, protected dashboard shell. |
| **3B — Premium UI** | Experience | Dark mode, collapsible sidebar, ⌘K palette, Framer Motion transitions, toasts, grid/list/compact views, skeletons. |
| **3C — Gamification** | Engagement | 12 achievements with unlock detection and confetti modal, opt-in leaderboard, streak display, activity heatmap, milestone celebrations. |
| **3D — Analytics, onboarding, email** | Insight | Analytics dashboard (insight cards, monthly chart), shepherd.js onboarding tour, Resend client and react-email templates, error boundary, performance hooks, settings and help pages. |
| **Post-3D polish** | Navigation | Playlist library and detail pages, search, 9-item sidebar (Dashboard, Playlists, New Playlist, Search, Achievements, Leaderboard, Analytics, Settings, Help), planner ↔ dashboard navigation. |
| **4 — Analytics & XP** | Progression | XP / level curve (client + SQL), tier titles, DB-driven streak and hours-saved counters, `activity_log.duration_seconds`, expanded analytics (speed distribution, category split, learning radar, streak heatmap, gamification summary), profile page, leaderboard ranked live from `user_profiles`. |
| **UI redesign (current branch `phase-3-ui-gamification`)** | Design system | Token-based brutalist theme (Stitch design tokens → CSS variables → Tailwind), new landing page and `/kage` variant, restyled dashboard and charts. Uncommitted at time of writing. |

Release history was never tagged; `package.json` versions are all `1.0.0`.

## 2. Known limitations and issues

**Security (address before public launch)**
1. **RLS is disabled** (`fix-nextauth.sql`) and all DB access uses the public anon key with `user_id` filtering done in application code. Anyone with the anon key (shipped to every browser) can read or modify any user's rows. Fix options: mint Supabase-compatible JWTs from the Auth.js session and restore per-user RLS policies, or move all DB access behind server-only code using the service-role key and enable deny-by-default RLS.
2. `SUPABASE_SERVICE_ROLE_KEY` and `GITHUB_*` appear in `frontend/.env.example` but no code uses them.
3. Backend rate limit is in-memory, per instance, keyed on the connecting IP (behind a reverse proxy this needs Express `trust proxy` — not configured).

**Functionality**
4. **Email is not wired**: `EmailService` (achievement, weekly summary, streak reminder) has no callers and no scheduler; the settings page's email-preference toggles are local component state and are not persisted. Sender address is hard-coded (`notifications@syllabusslayer.com`).
5. `SessionCheckIn` component is not mounted anywhere.
6. Tables `partitions`, `schedules`, `daily_schedules`, `templates` are unused; planner state is client-only, so plans don't follow users across devices.
7. The `Early Adopter` achievement is defined with a `playlist_count ≥ 1` requirement (the original design was "joined during beta").
8. `leaderboard_stats` materialized view is not read by the app and has no refresh schedule.
9. `/kage` renders its landing copy in an iframe, so it is not indexable; `/` is the SEO landing.
10. Shareable links encode the whole plan in the URL (length-limited, unauthenticated, no expiry).

**Build and operations**
11. No automated tests, CI, Dockerfile or hosting configuration; migrations are applied by hand and ordering matters (see DEPLOYMENT §4).
12. `shepherd.js` is an undeclared (transitive) dependency via `react-shepherd`; `@auth/core` is pinned by `overrides` for the Auth.js beta.
13. No caching of YouTube responses; each analysis costs quota (≈ 1 + 2·⌈videos/50⌉ units).
14. Root `.env.example` duplicates backend and frontend templates and is stale (no Supabase/auth vars).
15. No `LICENSE` file is present although `backend/package.json` declares MIT.

## 3. Future improvements

Ordered roughly by value for a production deployment:

1. **Security hardening** — restore RLS or server-only data access (item 1); trust-proxy + shared rate-limit store.
2. **Operational baseline** — CI (type-check, lint, build), unit tests for planner algorithms and `xpCurve`/SQL parity, Dockerfiles or platform config, a migration runner (e.g. Supabase CLI) replacing manual SQL, error monitoring.
3. **Finish existing features** — wire email sending (achievement unlock hook, scheduled weekly summary), persist notification preferences, mount session check-ins, sync planner state to the unused `partitions`/`schedules` tables.
4. **Backend** — Redis (or similar) cache for playlist metadata (previously planned 24 h TTL), versioned routes (`/api/v1/…`), shared types package between backend and frontend.
5. **Ecosystem (original "Phase 4" scope, not started)** — browser extension (YouTube page integration, "send to planner"), calendar export (`.ics`), mobile apps with offline support, Notion/Todoist integrations, study groups and public playlist directory, AI recommendations and auto-tagging, premium tier with Stripe (free vs Pro limits were sketched but are undecided), additional providers (GitHub sign-in was originally planned).
6. **Longer term** — adaptive study coaching, support for other platforms (courses, podcasts), education/enterprise licensing.
