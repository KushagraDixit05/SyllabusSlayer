-- Phase 3C: Gamification Schema Additions
-- Run this in Supabase SQL Editor

-- Add leaderboard opt-in fields to user_profiles
ALTER TABLE user_profiles 
  ADD COLUMN IF NOT EXISTS leaderboard_opt_in BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS leaderboard_username TEXT;

-- Leaderboard materialized view (refreshed periodically)
CREATE MATERIALIZED VIEW IF NOT EXISTS leaderboard_stats AS
SELECT
  up.id,
  up.leaderboard_username,
  up.total_playlists_completed,
  up.total_hours_planned,
  up.total_hours_completed,
  up.current_streak,
  up.longest_streak,
  RANK() OVER (ORDER BY up.total_hours_planned DESC) AS hours_rank,
  RANK() OVER (ORDER BY up.current_streak DESC) AS streak_rank,
  RANK() OVER (ORDER BY up.total_playlists_completed DESC) AS completion_rank
FROM user_profiles up
WHERE up.leaderboard_opt_in = true
  AND up.leaderboard_username IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_leaderboard_hours ON leaderboard_stats (hours_rank);
CREATE INDEX IF NOT EXISTS idx_leaderboard_streak ON leaderboard_stats (streak_rank);
CREATE INDEX IF NOT EXISTS idx_leaderboard_completion ON leaderboard_stats (completion_rank);

-- Manual refresh command (run when needed):
-- REFRESH MATERIALIZED VIEW leaderboard_stats;
