-- Benutzer (wird von Supabase Auth automatisch erweitert)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  niche TEXT[],                          -- z.B. ['Beauty', 'Business']
  subscription_tier TEXT DEFAULT 'free',
  stripe_customer_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Projekte (ein Projekt kann mehrere Videos enthalten)
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own projects"
  ON public.projects FOR ALL
  USING (auth.uid() = user_id);

-- Videos (hochgeladene Rohdateien und generierte Clips)
CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  original_url TEXT,                     -- Full S3 object URL of the uploaded raw file
  processed_urls TEXT[],                 -- Array of full S3 object URLs for generated clips
  status TEXT DEFAULT 'pending',         -- pending, processing, done, failed
  duration_seconds INT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own videos"
  ON public.videos FOR ALL
  USING (auth.uid() = user_id);

-- Trends (gespeicherte Trenddaten)
CREATE TABLE public.trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  type TEXT,                             -- sound, hashtag, aesthetic
  niche TEXT,
  engagement JSONB,
  detected_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.trends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trends are readable by all authenticated users"
  ON public.trends FOR SELECT
  USING (auth.role() = 'authenticated');

-- Ideen
CREATE TABLE public.ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content JSONB,                         -- { hook, storyboard, sounds, hashtags }
  saved_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own ideas"
  ON public.ideas FOR ALL
  USING (auth.uid() = user_id);

-- Geplante Posts
CREATE TABLE public.schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform TEXT,                         -- tiktok, instagram, youtube
  video_url TEXT,
  caption TEXT,
  scheduled_time TIMESTAMP,
  status TEXT DEFAULT 'pending',         -- pending, posted, failed
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own schedules"
  ON public.schedules FOR ALL
  USING (auth.uid() = user_id);

-- Analytics-Ereignisse (werden über Webhooks von Plattformen empfangen)
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
  platform TEXT,
  event_type TEXT,                       -- view, like, share, comment, sale
  value INT,
  occurred_at TIMESTAMP
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own analytics"
  ON public.analytics_events FOR SELECT
  USING (auth.uid() = user_id);

-- Community-Posts
CREATE TABLE public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Community posts are readable by all authenticated users"
  ON public.community_posts FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage their own community posts"
  ON public.community_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own community posts"
  ON public.community_posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own community posts"
  ON public.community_posts FOR DELETE
  USING (auth.uid() = user_id);
