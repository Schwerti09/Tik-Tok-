-- ============================================================
-- TikTok Creator Studio - Initial Schema
-- ============================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- TABLES
-- ============================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL UNIQUE,
  full_name   TEXT,
  avatar_url  TEXT,
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  stripe_customer_id TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  platform    TEXT NOT NULL DEFAULT 'all' CHECK (platform IN ('tiktok', 'instagram', 'youtube', 'all')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Videos table
CREATE TABLE IF NOT EXISTS public.videos (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  project_id    UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  title         TEXT NOT NULL,
  description   TEXT,
  video_url     TEXT,
  thumbnail_url TEXT,
  status        TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'published', 'scheduled', 'failed')),
  platform      TEXT NOT NULL DEFAULT 'tiktok' CHECK (platform IN ('tiktok', 'instagram', 'youtube', 'all')),
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trends table (populated by background jobs)
CREATE TABLE IF NOT EXISTS public.trends (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform    TEXT NOT NULL CHECK (platform IN ('tiktok', 'instagram', 'youtube', 'all')),
  keyword     TEXT NOT NULL,
  score       NUMERIC(6,2) NOT NULL DEFAULT 0,
  category    TEXT NOT NULL DEFAULT 'general',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ideas table
CREATE TABLE IF NOT EXISTS public.ideas (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT NOT NULL,
  platform     TEXT NOT NULL DEFAULT 'tiktok' CHECK (platform IN ('tiktok', 'instagram', 'youtube', 'all')),
  tags         TEXT[] DEFAULT '{}',
  ai_generated BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Schedules table
CREATE TABLE IF NOT EXISTS public.schedules (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  video_id     UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  platform     TEXT NOT NULL CHECK (platform IN ('tiktok', 'instagram', 'youtube')),
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'failed', 'cancelled')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Analytics table
CREATE TABLE IF NOT EXISTS public.analytics (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id       UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  views          BIGINT NOT NULL DEFAULT 0,
  likes          BIGINT NOT NULL DEFAULT 0,
  comments       BIGINT NOT NULL DEFAULT 0,
  shares         BIGINT NOT NULL DEFAULT 0,
  watch_time     NUMERIC(10,2) NOT NULL DEFAULT 0, -- average seconds
  virality_score NUMERIC(5,2) NOT NULL DEFAULT 0,  -- 0-100
  emotion_data   JSONB,                             -- {joy, sadness, anger, fear, surprise, disgust}
  recorded_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Community posts table
CREATE TABLE IF NOT EXISTS public.community_posts (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content        TEXT NOT NULL,
  likes          INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_videos_user_id       ON public.videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_project_id    ON public.videos(project_id);
CREATE INDEX IF NOT EXISTS idx_videos_status        ON public.videos(status);
CREATE INDEX IF NOT EXISTS idx_projects_user_id     ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_trends_platform      ON public.trends(platform);
CREATE INDEX IF NOT EXISTS idx_trends_score         ON public.trends(score DESC);
CREATE INDEX IF NOT EXISTS idx_ideas_user_id        ON public.ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_user_id    ON public.schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_scheduled  ON public.schedules(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_analytics_video_id   ON public.analytics(video_id);
CREATE INDEX IF NOT EXISTS idx_analytics_recorded   ON public.analytics(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_created    ON public.community_posts(created_at DESC);

-- ============================================================
-- TRIGGERS - updated_at auto-update
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at         BEFORE UPDATE ON public.users          FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER projects_updated_at      BEFORE UPDATE ON public.projects        FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER videos_updated_at        BEFORE UPDATE ON public.videos          FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER schedules_updated_at     BEFORE UPDATE ON public.schedules       FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER community_updated_at     BEFORE UPDATE ON public.community_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create user profile on sign-up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.users           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trends          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- Users: can read/update own profile
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE USING (auth.uid() = id);

-- Projects: full access to own
CREATE POLICY "Users can view own projects"
  ON public.projects FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
  ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON public.projects FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- Videos: full access to own
CREATE POLICY "Users can view own videos"
  ON public.videos FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own videos"
  ON public.videos FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own videos"
  ON public.videos FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own videos"
  ON public.videos FOR DELETE USING (auth.uid() = user_id);

-- Trends: everyone can read (no user filter)
CREATE POLICY "Trends are publicly readable"
  ON public.trends FOR SELECT USING (TRUE);

-- Ideas: full access to own
CREATE POLICY "Users can view own ideas"
  ON public.ideas FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ideas"
  ON public.ideas FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own ideas"
  ON public.ideas FOR DELETE USING (auth.uid() = user_id);

-- Schedules: full access to own
CREATE POLICY "Users can view own schedules"
  ON public.schedules FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own schedules"
  ON public.schedules FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own schedules"
  ON public.schedules FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own schedules"
  ON public.schedules FOR DELETE USING (auth.uid() = user_id);

-- Analytics: users can view analytics for their own videos
CREATE POLICY "Users can view own video analytics"
  ON public.analytics FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.videos v
    WHERE v.id = analytics.video_id AND v.user_id = auth.uid()
  ));

-- Community posts: everyone can read, users write own
CREATE POLICY "Community posts are publicly readable"
  ON public.community_posts FOR SELECT USING (TRUE);

CREATE POLICY "Users can insert own community posts"
  ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own community posts"
  ON public.community_posts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own community posts"
  ON public.community_posts FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- SEED DATA - Sample trends
-- ============================================================

INSERT INTO public.trends (platform, keyword, score, category) VALUES
  ('tiktok', 'BookTok', 94.5, 'education'),
  ('tiktok', 'DayInMyLife', 91.2, 'lifestyle'),
  ('tiktok', 'GlowUp', 88.7, 'beauty'),
  ('tiktok', 'FoodTok', 87.3, 'food'),
  ('tiktok', 'FinanceTok', 85.1, 'finance'),
  ('tiktok', 'FitTok', 83.4, 'fitness'),
  ('instagram', 'Reels', 92.1, 'general'),
  ('instagram', 'Aesthetic', 89.5, 'lifestyle'),
  ('instagram', 'GRWM', 86.3, 'beauty'),
  ('instagram', 'Foodie', 84.2, 'food'),
  ('youtube', 'Shorts', 90.8, 'general'),
  ('youtube', 'Tutorial', 88.6, 'education'),
  ('youtube', 'Vlog', 85.9, 'lifestyle'),
  ('youtube', 'Review', 83.1, 'reviews')
ON CONFLICT DO NOTHING;
