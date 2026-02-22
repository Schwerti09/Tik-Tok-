# TikFlow 🎬

**TikFlow** is an AI-powered, full-stack content creator suite for TikTok, Instagram Reels, and YouTube Shorts. It combines trend discovery, AI idea generation, in-browser recording, video processing, smart scheduling, analytics, and community – all in one dark-themed SaaS platform.

---

## ✨ Features

| Module | Description |
|---|---|
| 📡 **TrendRadar** | Discover trending sounds, hashtags, and content styles in real time |
| 💡 **IdeaLab** | Generate viral video concepts with GPT-4 AI |
| 🎥 **QuickCapture** | Record camera or screen in-browser with teleprompter support |
| ✂️ **ClipForge** | Upload and process videos (highlights, subtitles, reframe, thumbnails) |
| 📅 **SmartScheduler** | Plan and schedule posts to TikTok, Instagram, and YouTube |
| 📊 **Analytics+** | Track views, clicks, conversions, and revenue via UTM links |
| 🌐 **Community Hub** | Forum threads, mentoring sessions, and member highlights |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/tikflow.git
cd tikflow

# Install all dependencies
npm run install:all
```

### Development

```bash
# Start the frontend dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

> For full local development with Netlify Functions, install the [Netlify CLI](https://docs.netlify.com/cli/get-started/) and run `netlify dev`.

---

## 🔧 Environment Variables

Copy `.env.example` to `.env.local` in the `frontend/` directory:

```bash
cp .env.example frontend/.env.local
```

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public API key |
| `OPENAI_API_KEY` | OpenAI API key for IdeaLab (server-side only) |
| `STRIPE_SECRET_KEY` | Stripe secret key for payments |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (frontend) |

---

## 🏗️ Project Structure

```
tikflow/
├── frontend/               # React + Vite + Tailwind CSS app
│   ├── src/
│   │   ├── components/     # Navbar, Sidebar, LoadingSpinner
│   │   ├── pages/          # All page components
│   │   ├── hooks/          # useAuth (Supabase)
│   │   ├── services/       # API client (axios)
│   │   └── utils/          # Helper functions
│   └── ...
├── netlify/
│   └── functions/          # Serverless backend functions
│       ├── auth.js
│       ├── trendradar.js
│       ├── ideagen.js      # OpenAI GPT-4 integration
│       ├── video-process.js
│       ├── scheduler.js
│       ├── analytics.js
│       └── stripe.js       # Stripe webhook handler
├── shared/
│   └── types.js            # JSDoc type definitions
├── netlify.toml            # Netlify build & redirect config
└── .env.example
```

---

## 🚢 Deployment

### Deploy to Netlify

1. Push the repository to GitHub.
2. Connect the repo to [Netlify](https://app.netlify.com).
3. Netlify will auto-detect `netlify.toml` and configure the build.
4. Set all environment variables in **Site Settings → Environment Variables**.
5. Deploy!

Build settings (auto-detected from `netlify.toml`):
- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Functions directory**: `netlify/functions`

---

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router v6, Tailwind CSS, Vite
- **Auth**: Supabase Auth
- **Backend**: Netlify Functions (Node.js)
- **AI**: OpenAI GPT-4o
- **Payments**: Stripe
- **Deployment**: Netlify

---

## 📄 License

MIT License. Built with ❤️ for content creators.