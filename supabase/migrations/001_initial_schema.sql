-- TikFlow – Initiales Datenbankschema
-- Migration 001: Alle Tabellen, RLS-Policies und Indizes

-- ======================================================
-- PROFILES: Erweitert die Supabase Auth-Tabelle
-- ======================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id                UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username          TEXT UNIQUE,
  full_name         TEXT,
  avatar_url        TEXT,
  niche             TEXT[],                          -- z.B. ['Beauty', 'Business', 'Gaming']
  subscription_tier TEXT    NOT NULL DEFAULT 'free', -- free | creator | pro | business
  stripe_customer_id TEXT   UNIQUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Benutzer können ihr eigenes Profil lesen"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Benutzer können ihr eigenes Profil aktualisieren"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Benutzer können ihr eigenes Profil anlegen"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Profil automatisch bei Registrierung anlegen
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ======================================================
-- VIDEOS: Hochgeladene Roh-Dateien und generierte Clips
-- ======================================================
CREATE TABLE IF NOT EXISTS public.videos (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  original_url     TEXT,                          -- S3-URL der Roh-Datei
  processed_urls   TEXT[],                        -- Array von S3-URLs für fertige Clips
  status           TEXT        NOT NULL DEFAULT 'pending'
                               CHECK (status IN ('pending','processing','done','failed')),
  duration_seconds INTEGER,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Benutzer können nur ihre eigenen Videos verwalten"
  ON public.videos FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_videos_user_id ON public.videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_status  ON public.videos(status);

-- ======================================================
-- JOBS: Video-Verarbeitungs-Warteschlange
-- ======================================================
CREATE TABLE IF NOT EXISTS public.jobs (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id    UUID        REFERENCES public.videos(id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_url   TEXT,
  status      TEXT        NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending','processing','completed','failed')),
  output_path TEXT,
  error_msg   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Benutzer können nur ihre eigenen Jobs lesen"
  ON public.jobs FOR SELECT
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_jobs_status     ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at);

-- ======================================================
-- TRENDS: Gespeicherte Trend-Daten
-- ======================================================
CREATE TABLE IF NOT EXISTS public.trends (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT        NOT NULL,
  type        TEXT        CHECK (type IN ('sound','hashtag','aesthetic','challenge')),
  niche       TEXT,
  engagement  JSONB,                               -- { views, posts, growth_rate }
  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.trends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trends sind für alle angemeldeten Benutzer lesbar"
  ON public.trends FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_trends_niche       ON public.trends(niche);
CREATE INDEX IF NOT EXISTS idx_trends_detected_at ON public.trends(detected_at DESC);

-- ======================================================
-- IDEAS: KI-generierte Video-Ideen
-- ======================================================
CREATE TABLE IF NOT EXISTS public.ideas (
  id       UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id  UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content  JSONB       NOT NULL,                  -- { niche, platform, ideas: [...] }
  saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Benutzer können nur ihre eigenen Ideen verwalten"
  ON public.ideas FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_ideas_user_id ON public.ideas(user_id);

-- ======================================================
-- SCHEDULES: Geplante Social-Media-Posts
-- ======================================================
CREATE TABLE IF NOT EXISTS public.schedules (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform       TEXT        NOT NULL CHECK (platform IN ('tiktok','instagram','youtube','reels')),
  video_url      TEXT,
  caption        TEXT,
  hashtags       TEXT[],
  scheduled_at   TIMESTAMPTZ NOT NULL,
  status         TEXT        NOT NULL DEFAULT 'pending'
                             CHECK (status IN ('pending','posted','failed','cancelled')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Benutzer können nur ihre eigenen Schedules verwalten"
  ON public.schedules FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_schedules_user_id      ON public.schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_scheduled_at ON public.schedules(scheduled_at);

-- ======================================================
-- ANALYTICS: Plattform-Analytics-Snapshots
-- ======================================================
CREATE TABLE IF NOT EXISTS public.analytics (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform     TEXT        NOT NULL,
  video_id     UUID        REFERENCES public.videos(id) ON DELETE SET NULL,
  views        BIGINT      NOT NULL DEFAULT 0,
  likes        INTEGER     NOT NULL DEFAULT 0,
  comments     INTEGER     NOT NULL DEFAULT 0,
  shares       INTEGER     NOT NULL DEFAULT 0,
  followers    INTEGER     NOT NULL DEFAULT 0,
  revenue_usd  NUMERIC(10,2) NOT NULL DEFAULT 0,
  recorded_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Benutzer können nur ihre eigenen Analytics lesen"
  ON public.analytics FOR ALL
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_analytics_user_id     ON public.analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_recorded_at ON public.analytics(recorded_at DESC);

-- Analytics-Übersichtsansicht
CREATE OR REPLACE VIEW public.analytics_overview AS
  SELECT
    user_id,
    SUM(views)       AS total_views,
    COUNT(DISTINCT video_id) FILTER (WHERE video_id IS NOT NULL) AS total_videos,
    SUM(revenue_usd) AS total_revenue,
    MAX(followers)   AS subscribers
  FROM public.analytics
  GROUP BY user_id;

-- ======================================================
-- COMMUNITY: Forum-Posts und Kommentare
-- ======================================================
CREATE TABLE IF NOT EXISTS public.posts (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title      TEXT        NOT NULL,
  content    TEXT        NOT NULL,
  tags       TEXT[],
  upvotes    INTEGER     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts sind für alle angemeldeten Benutzer lesbar"
  ON public.posts FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Benutzer können eigene Posts anlegen"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Benutzer können eigene Posts ändern"
  ON public.posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.comments (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID        NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id    UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content    TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kommentare sind für alle angemeldeten Benutzer lesbar"
  ON public.comments FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Benutzer können eigene Kommentare anlegen"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ======================================================
-- UPDATED_AT Trigger
-- ======================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

CREATE OR REPLACE TRIGGER set_videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

CREATE OR REPLACE TRIGGER set_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
