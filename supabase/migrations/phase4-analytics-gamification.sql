-- Phase 4: Real Analytics + XP/Leveling Gamification
-- Run this in Supabase SQL Editor

-- ============================================
-- ACTIVITY LOG: add duration tracking
-- ============================================
ALTER TABLE activity_log
  ADD COLUMN IF NOT EXISTS duration_seconds INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_activity_log_user_created
  ON activity_log(user_id, created_at DESC);

-- ============================================
-- USER PROFILES: XP/leveling + achievement counters
-- ============================================
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_hours_saved INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS speed_mastery_count INTEGER DEFAULT 0;

-- Level curve: level = floor(sqrt(xp / 50)) + 1
-- Mirrored client-side in frontend/lib/gamification/xpCurve.ts — keep both in sync.
CREATE OR REPLACE FUNCTION xp_to_level(xp_val INTEGER)
RETURNS INTEGER AS $$
  SELECT GREATEST(1, FLOOR(SQRT(xp_val::float / 50)) + 1)::INTEGER;
$$ LANGUAGE sql IMMUTABLE;

-- ============================================
-- Extend playlist-completion trigger with hours-saved / speed-mastery counters
-- ============================================
CREATE OR REPLACE FUNCTION update_user_stats_on_playlist_complete()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE user_profiles
    SET
      total_playlists_completed = total_playlists_completed + 1,
      total_hours_completed = total_hours_completed + FLOOR(COALESCE(NEW.adjusted_duration, NEW.total_duration) / 3600.0),
      total_hours_saved = total_hours_saved + GREATEST(0, FLOOR((NEW.total_duration - COALESCE(NEW.adjusted_duration, NEW.total_duration)) / 3600.0)),
      speed_mastery_count = speed_mastery_count + CASE WHEN NEW.playback_speed >= 2.0 THEN 1 ELSE 0 END,
      updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger already exists (on_playlist_completed) and just needs the function above
-- redefined; no need to re-create the trigger itself.

-- ============================================
-- Automatic streak tracking from activity_log inserts
-- ============================================
CREATE OR REPLACE FUNCTION update_streak_on_activity()
RETURNS TRIGGER AS $$
DECLARE
  last_date DATE;
BEGIN
  SELECT last_activity_date INTO last_date FROM user_profiles WHERE id = NEW.user_id;

  IF last_date = CURRENT_DATE THEN
    -- Already logged activity today, no change
    RETURN NEW;
  ELSIF last_date = CURRENT_DATE - 1 THEN
    UPDATE user_profiles
    SET
      current_streak = current_streak + 1,
      longest_streak = GREATEST(longest_streak, current_streak + 1),
      last_activity_date = CURRENT_DATE
    WHERE id = NEW.user_id;
  ELSE
    UPDATE user_profiles
    SET
      current_streak = 1,
      longest_streak = GREATEST(longest_streak, 1),
      last_activity_date = CURRENT_DATE
    WHERE id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_activity_logged ON activity_log;
CREATE TRIGGER on_activity_logged
  AFTER INSERT ON activity_log
  FOR EACH ROW EXECUTE FUNCTION update_streak_on_activity();
