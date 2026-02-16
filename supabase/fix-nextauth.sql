-- Fix for NextAuth (JWT-based) with Supabase
-- Remove foreign key constraints to auth.users since we're using NextAuth
-- This must be done in the correct order: FK constraints -> Policies -> RLS -> Column types

-- Step 1: Drop ALL foreign key constraints that reference auth.users or user_profiles
-- These must be dropped first before we can alter column types
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_id_fkey;
ALTER TABLE playlists DROP CONSTRAINT IF EXISTS playlists_user_id_fkey;
ALTER TABLE achievements DROP CONSTRAINT IF EXISTS achievements_user_id_fkey;
ALTER TABLE activity_log DROP CONSTRAINT IF EXISTS activity_log_user_id_fkey;
ALTER TABLE templates DROP CONSTRAINT IF EXISTS templates_user_id_fkey;

-- Step 2: Drop all RLS policies (they depend on column types)
-- User profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- Playlists policies
DROP POLICY IF EXISTS "Users can view own playlists" ON playlists;
DROP POLICY IF EXISTS "Users can insert own playlists" ON playlists;
DROP POLICY IF EXISTS "Users can update own playlists" ON playlists;
DROP POLICY IF EXISTS "Users can delete own playlists" ON playlists;

-- Videos policies
DROP POLICY IF EXISTS "Users can view videos from own playlists" ON videos;
DROP POLICY IF EXISTS "Users can insert videos to own playlists" ON videos;
DROP POLICY IF EXISTS "Users can update videos in own playlists" ON videos;
DROP POLICY IF EXISTS "Users can delete videos from own playlists" ON videos;

-- Partitions policies
DROP POLICY IF EXISTS "Users can view partitions from own playlists" ON partitions;
DROP POLICY IF EXISTS "Users can insert partitions to own playlists" ON partitions;
DROP POLICY IF EXISTS "Users can update partitions in own playlists" ON partitions;
DROP POLICY IF EXISTS "Users can delete partitions from own playlists" ON partitions;

-- Schedules policies
DROP POLICY IF EXISTS "Users can view schedules from own playlists" ON schedules;
DROP POLICY IF EXISTS "Users can insert schedules to own playlists" ON schedules;
DROP POLICY IF EXISTS "Users can update schedules in own playlists" ON schedules;
DROP POLICY IF EXISTS "Users can delete schedules from own playlists" ON schedules;

-- Daily schedules policies
DROP POLICY IF EXISTS "Users can view daily schedules from own schedules" ON daily_schedules;
DROP POLICY IF EXISTS "Users can insert daily schedules to own schedules" ON daily_schedules;
DROP POLICY IF EXISTS "Users can update daily schedules in own schedules" ON daily_schedules;
DROP POLICY IF EXISTS "Users can delete daily schedules from own schedules" ON daily_schedules;

-- Achievements policies
DROP POLICY IF EXISTS "Users can view own achievements" ON achievements;
DROP POLICY IF EXISTS "Users can insert own achievements" ON achievements;

-- Activity log policies
DROP POLICY IF EXISTS "Users can view own activity" ON activity_log;
DROP POLICY IF EXISTS "Users can insert own activity" ON activity_log;

-- Templates policies
DROP POLICY IF EXISTS "Users can view public templates" ON templates;
DROP POLICY IF EXISTS "Users can insert own templates" ON templates;
DROP POLICY IF EXISTS "Users can update own templates" ON templates;
DROP POLICY IF EXISTS "Users can delete own templates" ON templates;

-- Step 3: Disable RLS on all tables (we'll use application-level security with NextAuth)
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE playlists DISABLE ROW LEVEL SECURITY;
ALTER TABLE videos DISABLE ROW LEVEL SECURITY;
ALTER TABLE partitions DISABLE ROW LEVEL SECURITY;
ALTER TABLE schedules DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_schedules DISABLE ROW LEVEL SECURITY;
ALTER TABLE achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log DISABLE ROW LEVEL SECURITY;
ALTER TABLE templates DISABLE ROW LEVEL SECURITY;

-- Step 4: Modify column types from UUID to TEXT for OAuth provider IDs
-- user_profiles.id will now store NextAuth user IDs (from Google/GitHub OAuth)
ALTER TABLE user_profiles ALTER COLUMN id TYPE TEXT;

-- Step 5: Update all user_id foreign key columns to TEXT
-- These columns reference user_profiles.id which is now TEXT
ALTER TABLE playlists ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE achievements ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE activity_log ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE templates ALTER COLUMN user_id TYPE TEXT;

-- Migration complete!
-- Your application will now:
-- 1. Use NextAuth for authentication (Google/GitHub OAuth)
-- 2. Store user IDs as TEXT (OAuth provider IDs like "google_123456")
-- 3. Handle authorization at the application level
-- 4. Manually create/update user_profiles via the syncUserToDatabase function
