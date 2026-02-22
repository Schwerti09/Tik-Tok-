# TikTok Creator Studio

An AI-powered full-stack content creation and analytics platform for TikTok, Instagram, and YouTube creators. Built with React 18, Vite, TypeScript, Tailwind CSS, Supabase, and Netlify Functions.

## ✨ Features

- **📊 Analytics Dashboard** – Track views, likes, comments, shares, watch time, and virality scores with interactive Recharts visualizations
- **🤖 AI Ideas Generator** – Generate viral content ideas using GPT-4o-mini based on your niche
- **🎵 Whisper Transcription** – Auto-transcribe video audio with OpenAI Whisper
- **😊 Emotion Detection** – Analyze audience emotion from video transcripts using Hugging Face
- **📈 Trend Explorer** – Real-time trending topics across TikTok, Instagram, and YouTube
- **📅 Content Scheduler** – Schedule posts to be published at optimal times
- **👥 Community** – Share tips and wins with other creators
- **💳 Stripe Subscriptions** – Free, Pro ($29/mo), and Enterprise ($99/mo) plans
- **🔐 Supabase Auth** – Email/password + Google OAuth with Row Level Security

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| State | Zustand, React Query (@tanstack/react-query) |
| Forms | Formik + Yup |
| UI Components | Headless UI, Lucide React |
| Charts | Recharts |
| Video | React Player, React Dropzone |
| Backend | Netlify Functions (serverless Node.js 18) |
| Database | Supabase (PostgreSQL + Auth + Storage) |
| AI | OpenAI GPT-4o-mini, Whisper; Hugging Face |
| Payments | Stripe |

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── Layout/          # Sidebar, Header, Layout wrapper
│   │   ├── ui/              # Button, Modal, LoadingSpinner
│   │   ├── VideoPlayer/     # React Player wrapper
│   │   └── VideoUpload/     # React Dropzone wrapper
│   ├── hooks/               # useAuth, useVideos, useTrends, useAnalytics
│   ├── lib/                 # Supabase client, React Query client, utils
│   ├── pages/               # Home, Auth, Upload, Analytics, Trends, Ideas, Schedule, Community, Settings
│   ├── stores/              # Zustand: authStore, appStore
│   └── types/               # TypeScript interfaces
├── netlify/functions/       # Serverless API endpoints
│   ├── auth.ts
│   ├── videos.ts
│   ├── trends.ts
│   ├── ideas.ts             # GPT-4 idea generation
│   ├── analytics.ts
│   ├── schedules.ts
│   ├── community.ts
│   ├── ai-enhance.ts        # GPT-4 content enhancement
│   ├── transcribe.ts        # Whisper transcription
│   ├── emotion.ts           # Hugging Face emotion detection
│   ├── stripe-webhook.ts
│   └── subscription.ts      # Stripe Checkout
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql
```

## 🛠 Setup

### Prerequisites
- Node.js 18+
- Supabase account
- OpenAI API key
- Stripe account (optional)
- Hugging Face account (optional)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:
- `VITE_SUPABASE_URL` – Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` – Supabase anon key
- `OPENAI_API_KEY` – OpenAI API key

### 3. Set Up Database

Run the migration in your Supabase SQL editor:

```bash
# Copy contents of supabase/migrations/001_initial_schema.sql
# and run in Supabase Dashboard > SQL Editor
```

### 4. Start Development Server

```bash
npm run dev
```

The app runs at `http://localhost:5173`. Netlify functions run at `http://localhost:8888`.

For running both together with Netlify Dev:
```bash
npx netlify dev
```

### 5. Build for Production

```bash
npm run build
```

## 🚢 Deploy to Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add all environment variables from `.env.example`
5. Deploy!

## 🗄️ Database Schema

| Table | Description |
|-------|-------------|
| `users` | User profiles (extends Supabase auth) |
| `projects` | Content organization projects |
| `videos` | Uploaded/published videos |
| `trends` | Trending keywords by platform |
| `ideas` | AI-generated and manual content ideas |
| `schedules` | Scheduled publishing queue |
| `analytics` | Per-video performance metrics |
| `community_posts` | Creator community feed |

All tables have Row Level Security (RLS) policies enforcing `user_id = auth.uid()`.

## 📄 License

MIT