# TikFlow – Das Creator-Betriebssystem 🚀

Ein vollständiges Creator-OS für TikTok, Instagram & YouTube – alles in einer App.

## 📋 Übersicht

TikFlow ist eine Full-Stack-Webanwendung (React + Netlify Functions), die Content Creatorn alle wichtigen Werkzeuge bietet:

| Modul | Beschreibung |
|-------|-------------|
| **Trend Radar** | Echtzeit-Trends: Sounds, Hashtags & Aesthetics |
| **Idea Lab** | KI-generierte Video-Konzepte (Hook, Storyboard, Hashtags) |
| **Quick Capture** | Direktaufnahme aus dem Browser mit Teleprompter |
| **Clip Forge** | KI-Videoverarbeitung: Highlights, Untertitel, Reframe |
| **Smart Scheduler** | Post-Planung mit Kalender & Beste-Zeiten-Empfehlung |
| **Analytics+** | Performance-Übersicht, UTM-Builder, KI-Tipps |
| **Community Hub** | Diskussionen, Ressourcen & Mentoring-Sessions |

## 🚀 Einrichtung

```bash
cp .env.example .env
cd frontend && npm install && npm start
```

> Alle Module funktionieren ohne API-Keys im Demo-Modus mit Mock-Daten.

## ☁️ Deployment auf Netlify

Build-Einstellungen (automatisch aus `netlify.toml`):
- **Build command:** `npm run build`
- **Publish directory:** `frontend/build`

## 🛠️ Tech-Stack

React 18, Tailwind CSS, Lucide React, Axios, date-fns, Netlify Functions, OpenAI, Supabase, Stripe

---

Original README: