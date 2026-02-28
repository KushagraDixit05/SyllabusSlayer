-- ============================================
-- SYLLABUS SLAYER - DATABASE SCHEMA
-- Phase 3A: Foundation & Authentication
-- ============================================

-- ============================================
-- USER PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  timezone TEXT DEFAULT 'UTC',
  preferred_speed REAL DEFAULT 1.5,
  theme_preference TEXT DEFAULT 'system', -- 'light', 'dark', 'system'
  email_notifications BOOLEAN DEFAULT true,
  
  -- Gamification stats
  total_playlists_created INTEGER DEFAULT 0,
  total_playlists_completed INTEGER DEFAULT 0,
  total_hours_planned INTEGER DEFAULT 0,
  total_hours_completed INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PLAYLISTS
-- ============================================
CREATE TABLE IF NOT EXISTS playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Playlist metadata
  youtube_playlist_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  source TEXT DEFAULT 'youtube', -- 'youtube', 'manual', 'mixed'
  
  -- Duration data
  total_duration INTEGER NOT NULL, -- in seconds
  video_count INTEGER NOT NULL,
  average_video_duration INTEGER,
  
  -- User settings
  playback_speed REAL DEFAULT 1.5,
  adjusted_duration INTEGER, -- duration at selected speed
  
  -- Status
  status TEXT DEFAULT 'planning', -- 'planning', 'in_progress', 'completed', 'archived'
  completion_percentage INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_playlists_user_id ON playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_playlists_status ON playlists(status);

-- ============================================
-- VIDEOS
-- ============================================
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
  
  -- Video metadata
  youtube_video_id TEXT,
  title TEXT NOT NULL,
  duration INTEGER NOT NULL, -- in seconds
  thumbnail_url TEXT,
  position INTEGER NOT NULL, -- order in playlist (0-indexed)
  source TEXT DEFAULT 'youtube', -- 'youtube', 'manual'
  
  -- User notes
  notes TEXT,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_videos_playlist_id ON videos(playlist_id);

-- ============================================
-- PARTITIONS
-- ============================================
CREATE TABLE IF NOT EXISTS partitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
  
  session_number INTEGER NOT NULL,
  start_video_index INTEGER NOT NULL,
  end_video_index INTEGER NOT NULL,
  total_duration INTEGER NOT NULL, -- in seconds
  video_count INTEGER NOT NULL,
  
  -- Status
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_partitions_playlist_id ON partitions(playlist_id);

-- ============================================
-- SCHEDULES
-- ============================================
CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
  
  -- Schedule configuration
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  hours_per_weekday REAL NOT NULL,
  hours_per_weekend REAL NOT NULL,
  rest_days INTEGER[], -- array of day numbers (0=Sunday, 6=Saturday)
  
  -- Calculated fields
  total_days INTEGER NOT NULL,
  study_days INTEGER NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_schedules_playlist_id ON schedules(playlist_id);

-- ============================================
-- DAILY SCHEDULE ENTRIES
-- ============================================
CREATE TABLE IF NOT EXISTS daily_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID REFERENCES schedules(id) ON DELETE CASCADE,
  
  date DATE NOT NULL,
  day_of_week INTEGER NOT NULL, -- 0-6
  is_rest_day BOOLEAN DEFAULT false,
  hours_allocated REAL DEFAULT 0,
  
  -- Which partitions/sessions are scheduled
  partition_ids UUID[],
  
  -- Completion tracking
  is_completed BOOLEAN DEFAULT false,
  actual_hours REAL,
  completed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_daily_schedules_schedule_id ON daily_schedules(schedule_id);
CREATE INDEX IF NOT EXISTS idx_daily_schedules_date ON daily_schedules(date);

-- ============================================
-- ACHIEVEMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  achievement_type TEXT NOT NULL,
  -- 'first_plan', 'speed_demon', 'streak_7', 'syllabus_slayer_10', 
  -- 'early_adopter', 'time_saver_100', 'marathon_50h', 'sprint_master'
  
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Achievement-specific data
  metadata JSONB,
  -- Example: { "hours_saved": 100, "speed": 2.0 }
  
  -- Visibility
  is_shared BOOLEAN DEFAULT false,
  
  UNIQUE(user_id, achievement_type)
);

CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_type ON achievements(achievement_type);

-- ============================================
-- ACTIVITY LOG
-- ============================================
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  activity_type TEXT NOT NULL,
  -- 'playlist_created', 'playlist_completed', 'session_completed',
  -- 'achievement_earned', 'streak_milestone', 'login'
  
  activity_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at);

-- ============================================
-- TEMPLATES (from Phase 2)
-- ============================================
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  
  -- Template data (array of video objects)
  videos JSONB NOT NULL,
  total_duration INTEGER NOT NULL,
  video_count INTEGER NOT NULL,
  
  -- Visibility
  is_public BOOLEAN DEFAULT false,
  use_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_public ON templates(is_public) WHERE is_public = true;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE partitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- User Profiles: Users can only read/update their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile" 
  ON user_profiles FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" 
  ON user_profiles FOR UPDATE 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile" 
  ON user_profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Playlists: Users can only access their own playlists
DROP POLICY IF EXISTS "Users can view own playlists" ON playlists;
CREATE POLICY "Users can view own playlists" 
  ON playlists FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own playlists" ON playlists;
CREATE POLICY "Users can insert own playlists" 
  ON playlists FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own playlists" ON playlists;
CREATE POLICY "Users can update own playlists" 
  ON playlists FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own playlists" ON playlists;
CREATE POLICY "Users can delete own playlists" 
  ON playlists FOR DELETE 
  USING (auth.uid() = user_id);

-- Videos: Inherit access from parent playlist
DROP POLICY IF EXISTS "Users can view videos from own playlists" ON videos;
CREATE POLICY "Users can view videos from own playlists" 
  ON videos FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = videos.playlist_id 
      AND playlists.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert videos to own playlists" ON videos;
CREATE POLICY "Users can insert videos to own playlists" 
  ON videos FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = videos.playlist_id 
      AND playlists.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update videos in own playlists" ON videos;
CREATE POLICY "Users can update videos in own playlists" 
  ON videos FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = videos.playlist_id 
      AND playlists.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete videos from own playlists" ON videos;
CREATE POLICY "Users can delete videos from own playlists" 
  ON videos FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = videos.playlist_id 
      AND playlists.user_id = auth.uid()
    )
  );

-- Partitions: Inherit access from parent playlist
DROP POLICY IF EXISTS "Users can view partitions from own playlists" ON partitions;
CREATE POLICY "Users can view partitions from own playlists" 
  ON partitions FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = partitions.playlist_id 
      AND playlists.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert partitions to own playlists" ON partitions;
CREATE POLICY "Users can insert partitions to own playlists" 
  ON partitions FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = partitions.playlist_id 
      AND playlists.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update partitions in own playlists" ON partitions;
CREATE POLICY "Users can update partitions in own playlists" 
  ON partitions FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = partitions.playlist_id 
      AND playlists.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete partitions from own playlists" ON partitions;
CREATE POLICY "Users can delete partitions from own playlists" 
  ON partitions FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = partitions.playlist_id 
      AND playlists.user_id = auth.uid()
    )
  );

-- Schedules: Inherit access from parent playlist
DROP POLICY IF EXISTS "Users can view schedules from own playlists" ON schedules;
CREATE POLICY "Users can view schedules from own playlists" 
  ON schedules FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = schedules.playlist_id 
      AND playlists.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert schedules to own playlists" ON schedules;
CREATE POLICY "Users can insert schedules to own playlists" 
  ON schedules FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = schedules.playlist_id 
      AND playlists.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update schedules in own playlists" ON schedules;
CREATE POLICY "Users can update schedules in own playlists" 
  ON schedules FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = schedules.playlist_id 
      AND playlists.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete schedules from own playlists" ON schedules;
CREATE POLICY "Users can delete schedules from own playlists" 
  ON schedules FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = schedules.playlist_id 
      AND playlists.user_id = auth.uid()
    )
  );

-- Daily Schedules: Inherit access from parent schedule
DROP POLICY IF EXISTS "Users can view daily schedules from own schedules" ON daily_schedules;
CREATE POLICY "Users can view daily schedules from own schedules" 
  ON daily_schedules FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM schedules 
      JOIN playlists ON playlists.id = schedules.playlist_id
      WHERE schedules.id = daily_schedules.schedule_id 
      AND playlists.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert daily schedules to own schedules" ON daily_schedules;
CREATE POLICY "Users can insert daily schedules to own schedules" 
  ON daily_schedules FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM schedules 
      JOIN playlists ON playlists.id = schedules.playlist_id
      WHERE schedules.id = daily_schedules.schedule_id 
      AND playlists.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update daily schedules in own schedules" ON daily_schedules;
CREATE POLICY "Users can update daily schedules in own schedules" 
  ON daily_schedules FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM schedules 
      JOIN playlists ON playlists.id = schedules.playlist_id
      WHERE schedules.id = daily_schedules.schedule_id 
      AND playlists.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete daily schedules from own schedules" ON daily_schedules;
CREATE POLICY "Users can delete daily schedules from own schedules" 
  ON daily_schedules FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM schedules 
      JOIN playlists ON playlists.id = schedules.playlist_id
      WHERE schedules.id = daily_schedules.schedule_id 
      AND playlists.user_id = auth.uid()
    )
  );

-- Achievements: Users can only access their own
DROP POLICY IF EXISTS "Users can view own achievements" ON achievements;
CREATE POLICY "Users can view own achievements" 
  ON achievements FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own achievements" ON achievements;
CREATE POLICY "Users can insert own achievements" 
  ON achievements FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Activity Log: Users can only access their own
DROP POLICY IF EXISTS "Users can view own activity" ON activity_log;
CREATE POLICY "Users can view own activity" 
  ON activity_log FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own activity" ON activity_log;
CREATE POLICY "Users can insert own activity" 
  ON activity_log FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Templates: Users can view public templates or their own
DROP POLICY IF EXISTS "Users can view public templates" ON templates;
CREATE POLICY "Users can view public templates" 
  ON templates FOR SELECT 
  USING (is_public = true OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own templates" ON templates;
CREATE POLICY "Users can insert own templates" 
  ON templates FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own templates" ON templates;
CREATE POLICY "Users can update own templates" 
  ON templates FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own templates" ON templates;
CREATE POLICY "Users can delete own templates" 
  ON templates FOR DELETE 
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_playlists_updated_at ON playlists;
CREATE TRIGGER update_playlists_updated_at 
  BEFORE UPDATE ON playlists 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_schedules_updated_at ON schedules;
CREATE TRIGGER update_schedules_updated_at 
  BEFORE UPDATE ON schedules 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_templates_updated_at ON templates;
CREATE TRIGGER update_templates_updated_at 
  BEFORE UPDATE ON templates 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update user stats when playlist is completed
CREATE OR REPLACE FUNCTION update_user_stats_on_playlist_complete()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE user_profiles
    SET 
      total_playlists_completed = total_playlists_completed + 1,
      total_hours_completed = total_hours_completed + FLOOR(COALESCE(NEW.adjusted_duration, NEW.total_duration) / 3600.0),
      updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_playlist_completed ON playlists;
CREATE TRIGGER on_playlist_completed
  AFTER UPDATE ON playlists
  FOR EACH ROW EXECUTE FUNCTION update_user_stats_on_playlist_complete();
