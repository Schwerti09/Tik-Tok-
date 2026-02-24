-- Fix ideas table: add missing columns used by the backend
ALTER TABLE public.ideas
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS hashtags TEXT[],
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

-- Fix schedules table: rename scheduled_time → scheduled_at to match backend query
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'schedules' AND column_name = 'scheduled_time'
  ) THEN
    ALTER TABLE public.schedules RENAME COLUMN scheduled_time TO scheduled_at;
  END IF;
END $$;

-- Recordings: raw uploads by users
CREATE TABLE public.recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  original_name TEXT,
  mime_type TEXT,
  size BIGINT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.recordings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own recordings"
  ON public.recordings FOR ALL
  USING (auth.uid() = user_id);

-- Jobs: video processing queue
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_url TEXT,
  options JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'pending',
  output_path TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own jobs"
  ON public.jobs FOR ALL
  USING (auth.uid() = user_id);

-- Posts: community posts (backend uses "posts" table)
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are readable by authenticated users"
  ON public.posts FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Comments: replies to community posts
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are readable by authenticated users"
  ON public.comments FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Mentors: creator mentors available for matching
CREATE TABLE public.mentors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  bio TEXT,
  niche TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mentors are readable by authenticated users"
  ON public.mentors FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Sales: revenue tracking with UTM attribution
CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sales"
  ON public.sales FOR SELECT
  USING (auth.uid() = user_id);

-- Analytics overview: per-user aggregated stats view
CREATE VIEW public.analytics_overview AS
  SELECT
    p.id AS user_id,
    COALESCE(SUM(s.amount), 0) AS total_revenue,
    COUNT(DISTINCT j.id) FILTER (WHERE j.status = 'completed') AS total_videos,
    0::BIGINT AS total_views,
    0::BIGINT AS subscribers
  FROM public.profiles p
  LEFT JOIN public.sales s ON s.user_id = p.id
  LEFT JOIN public.jobs j ON j.user_id = p.id
  GROUP BY p.id;

-- Scan requests: trend scan requests (admin only)
CREATE TABLE public.scan_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requested_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.scan_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own scan requests"
  ON public.scan_requests FOR ALL
  USING (auth.uid() = requested_by);
