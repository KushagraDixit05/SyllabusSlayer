# Supabase Setup Guide

> Complete step-by-step instructions for setting up the Syllabus Slayer database.
>
> **Important:** This app uses **NextAuth.js** for authentication (not Supabase Auth). Supabase is used purely as a PostgreSQL database. This distinction matters — several steps below exist specifically to make these two systems work together.

---

## Overview of What You'll Do

1. Create a Supabase project
2. Copy your API credentials
3. Run the base schema (`schema.sql`)
4. Run the NextAuth compatibility fix (`fix-nextauth.sql`) ← **critical step**
5. Run the gamification migration (`phase3c-gamification.sql`)
6. Add the credentials to `.env.local`
7. Verify it works

---

## Step 1 — Create a Supabase Project

1. Go to **https://supabase.com** and sign in (or create a free account)
2. Click **"New project"**
3. Fill in:
   - **Name:** `syllabus-slayer` (or anything you like)
   - **Database Password:** generate a strong password and **save it somewhere** — you'll need it if you ever connect directly via `psql`
   - **Region:** pick the closest one to you
4. Click **"Create new project"**
5. Wait ~1–2 minutes for the project to provision (you'll see a loading spinner)

---

## Step 2 — Copy Your API Credentials

Once the project is ready:

1. In the left sidebar, click **"Project Settings"** (gear icon at the bottom)
2. Click **"API"** in the settings submenu

You'll see three values you need:

| Value | Where to find it | Environment variable |
|-------|-----------------|---------------------|
| Project URL | "Project URL" box | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` / `public` key | Under "Project API keys" | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` key | Under "Project API keys" (click "Reveal") | `SUPABASE_SERVICE_ROLE_KEY` |

> **Note on the service_role key:** This key bypasses Row Level Security and has full database access. It is used **server-side only** (in Next.js Server Components and API routes via `lib/supabase/server.ts`). It must **never** be exposed to the browser. Keep it out of any `NEXT_PUBLIC_` variable.

Keep this browser tab open — you'll use these values later.

---

## Step 3 — Run the Base Schema

This creates all 9 database tables along with their indexes, RLS policies, triggers, and functions.

1. In the Supabase dashboard left sidebar, click **"SQL Editor"**
2. Click **"New query"**
3. Open the file `supabase/schema.sql` from this project in your code editor
4. **Select all** (`Ctrl+A`) and **copy** the entire contents
5. **Paste** it into the Supabase SQL Editor
6. Click **"Run"** (or press `Ctrl+Enter`)

You should see:

```
Success. No rows returned
```

If you see any red errors, check the Troubleshooting section at the bottom of this guide.

### What this creates:

| Table | Purpose |
|-------|---------|
| `user_profiles` | One row per user — stores stats, preferences, streak data |
| `playlists` | Every saved playlist with duration, status, speed setting |
| `videos` | Individual videos belonging to a playlist |
| `partitions` | Study session groupings within a playlist |
| `schedules` | Schedule configurations (start date, hours/day, rest days) |
| `daily_schedules` | Per-day schedule entries |
| `achievements` | Earned achievement records per user |
| `activity_log` | Event log (playlist created, completed, login, etc.) |
| `templates` | Saved video entry templates |

It also creates:
- **Triggers:** `updated_at` auto-update on `user_profiles`, `playlists`, `schedules`, `templates`
- **Trigger:** `on_auth_user_created` — auto-creates a `user_profiles` row on new user signup *(this trigger will not fire with NextAuth since we bypass Supabase Auth — but it is harmless to leave in place)*
- **Trigger:** `on_playlist_completed` — increments `total_playlists_completed` and `total_hours_completed` on `user_profiles` when a playlist status changes to `'completed'`

---

## Step 4 — Run the NextAuth Compatibility Fix ⚠️ Critical

**Why this is needed:**

The base `schema.sql` was written assuming Supabase Auth (which uses `auth.uid()` and UUID user IDs). This app uses **NextAuth** with Google/GitHub OAuth instead. NextAuth generates user IDs like `"clxyz123abc"` (Prisma cuid) or uses the OAuth sub claim — either way they are **text strings, not UUIDs**.

If you skip this step:
- Sign-in will fail because NextAuth can't write a text ID into a UUID column
- The repository layer will throw type mismatch errors

**What it does:**

1. Drops all foreign key constraints that reference `auth.users`
2. Drops all RLS policies (security is handled at the application level by checking `session.user.id` in each repository function)
3. Disables RLS on all tables
4. Converts `user_profiles.id` from `UUID` → `TEXT`
5. Converts all `user_id` columns (`playlists`, `achievements`, `activity_log`, `templates`) from `UUID` → `TEXT`

**How to run it:**

1. In the Supabase SQL Editor, click **"New query"**
2. Open `supabase/fix-nextauth.sql` from this project
3. Select all, copy, paste into SQL Editor
4. Click **"Run"**

Expected output:

```
Success. No rows returned
```

---

## Step 5 — Run the Gamification Migration

This adds leaderboard support (Phase 3C).

1. In the Supabase SQL Editor, click **"New query"**
2. Open `supabase/migrations/phase3c-gamification.sql` from this project
3. Select all, copy, paste into SQL Editor
4. Click **"Run"**

Expected output:

```
Success. No rows returned
```

### What this adds:

- Two new columns on `user_profiles`:
  - `leaderboard_opt_in BOOLEAN DEFAULT false` — user must opt in to appear on the leaderboard
  - `leaderboard_username TEXT` — their chosen display name for the leaderboard
- A **materialized view** `leaderboard_stats` — a cached leaderboard ranked by hours planned, current streak, and playlists completed. Only includes users where `leaderboard_opt_in = true`.
- Three indexes on the materialized view for fast rank queries

> **Refreshing the leaderboard:** The materialized view does not auto-refresh. To update the rankings, run this in the SQL Editor:
> ```sql
> REFRESH MATERIALIZED VIEW leaderboard_stats;
> ```
> In production you would schedule this with a cron job (Supabase has a `pg_cron` extension for this).

---

## Step 6 — Verify the Tables Exist

1. In the Supabase left sidebar, click **"Table Editor"**
2. You should see all 9 tables listed:
   - `user_profiles`
   - `playlists`
   - `videos`
   - `partitions`
   - `schedules`
   - `daily_schedules`
   - `achievements`
   - `activity_log`
   - `templates`

3. Click on `user_profiles` and check the columns — the `id` column should show type **`text`** (not `uuid`). If it still shows `uuid`, the fix-nextauth step did not run correctly.

---

## Step 7 — Add Credentials to `.env.local`

Open (or create) `frontend/.env.local` and add your Supabase values:

```env
# ── Supabase ──────────────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...

# ── NextAuth ──────────────────────────────────────────────────────────
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-this-with-the-command-below

# ── Google OAuth ──────────────────────────────────────────────────────
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret

# ── GitHub OAuth ──────────────────────────────────────────────────────
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# ── Backend ───────────────────────────────────────────────────────────
NEXT_PUBLIC_API_URL=http://localhost:5000

# ── Email (optional) ──────────────────────────────────────────────────
RESEND_API_KEY=re_your_resend_key
```

### Generate NEXTAUTH_SECRET

Run this in your terminal and paste the output as `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

Or use the setup script which generates one for you:

```bash
bash setup-phase3a.sh
```

---

## Step 8 — Set Up OAuth Providers

You need at least one OAuth provider for sign-in to work.

### Google OAuth

1. Go to **https://console.cloud.google.com**
2. Select your project (or create one)
3. Go to **"APIs & Services"** → **"Credentials"**
4. Click **"Create Credentials"** → **"OAuth 2.0 Client IDs"**
5. Application type: **"Web application"**
6. Under **"Authorized redirect URIs"**, add:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
7. Click **"Create"**
8. Copy the **Client ID** and **Client Secret** into `.env.local`

### GitHub OAuth

1. Go to **https://github.com/settings/developers**
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name:** Syllabus Slayer (Local)
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
4. Click **"Register application"**
5. Copy the **Client ID**
6. Click **"Generate a new client secret"** and copy it
7. Add both to `.env.local`

> You only need **one** provider to get sign-in working. GitHub is faster to set up.

---

## Step 9 — Start the App and Verify

```bash
# From project root
npm run dev
```

Then:

1. Open **http://localhost:3000**
2. Click **"Sign In"** (or go to `/auth/signin`)
3. Choose Google or GitHub
4. Complete OAuth flow
5. You should land on **http://localhost:3000/dashboard**

### Verify data was saved to Supabase

1. Go to Supabase → **Table Editor** → `user_profiles`
2. You should see one row with your name/email and an `id` that is a text string (your OAuth sub claim)

If the row is there, everything is working correctly.

---

## Troubleshooting

### "relation auth.users does not exist"

The `schema.sql` references `auth.users` which exists in every Supabase project. If you see this error, make sure you are running the SQL in your **Supabase project's SQL Editor** (not a local PostgreSQL instance).

---

### "column id of relation user_profiles contains null values" or UUID type errors

You ran `schema.sql` but skipped `fix-nextauth.sql`. Run `fix-nextauth.sql` now — it is safe to run even after data exists (it uses `IF EXISTS` guards).

---

### Sign-in completes but dashboard shows no data / errors

Check that `SUPABASE_SERVICE_ROLE_KEY` is set correctly in `.env.local`. The server-side repository functions use the service role key to bypass RLS and write user data. Without it, the `syncUserToDatabase` call on sign-in silently fails.

---

### "Invalid API key" error from Supabase

- Double-check you copied the full key (they are very long JWT strings)
- Make sure there are no trailing spaces or line breaks in `.env.local`
- Restart the dev server after editing `.env.local` — Next.js does not hot-reload env files

---

### Leaderboard page shows no users

The `leaderboard_stats` materialized view only includes users who have opted in (`leaderboard_opt_in = true`) **and** set a `leaderboard_username`. Go to Dashboard → Settings to opt in, then refresh the view:

```sql
REFRESH MATERIALIZED VIEW leaderboard_stats;
```

---

## Quick Reference — All SQL Files

| File | When to run | What it does |
|------|-------------|-------------|
| `supabase/schema.sql` | Once, first | Creates all 9 tables, triggers, RLS policies |
| `supabase/fix-nextauth.sql` | Once, after schema | Converts UUID→TEXT, disables RLS (NextAuth compatibility) |
| `supabase/migrations/phase3c-gamification.sql` | Once, after fix | Adds leaderboard columns + materialized view |
| `supabase/disable-rls-temp.sql` | Dev only, optional | Disables RLS for easier local debugging |

**Run order: `schema.sql` → `fix-nextauth.sql` → `phase3c-gamification.sql`**
