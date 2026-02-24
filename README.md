# TikFlow – Creator Studio MVP

KI-gestützte Plattform für TikTok/Instagram/YouTube-Creator.

## Projektstruktur

```
tikflow/
├── frontend/          # React + TypeScript + Vite + Tailwind
├── netlify/functions/ # Serverless-Backend (TypeScript)
├── worker/            # BullMQ Video-Processing-Worker
├── supabase/          # Datenbankmigrationen
├── src/               # Legacy Express-Backend (optional)
└── shared/            # Gemeinsame Typen und Validierung
```

## Schnellstart

### Voraussetzungen

- Node.js 20+
- npm 10+
- [Supabase-Konto](https://supabase.com) (kostenlos)
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (optional für lokale Functions)
- [Redis](https://redis.io) oder [Upstash](https://upstash.com) (für den Worker)

### 1. Repository klonen

```bash
git clone https://github.com/Schwerti09/Tik-Tok-.git tikflow
cd tikflow
```

### 2. Umgebungsvariablen konfigurieren

```bash
cp .env.example .env
# Öffne .env und trage deine Werte ein
```

Erstelle außerdem `frontend/.env.local`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### 3. Supabase-Datenbank einrichten

1. Öffne dein Supabase-Projekt → SQL-Editor
2. Führe `supabase/migrations/001_initial_schema.sql` aus
3. Erstelle einen Storage-Bucket namens `recordings` (öffentlich oder mit Policies)

### 4. Abhängigkeiten installieren und Dev-Server starten

```bash
cd frontend
npm install
npm run dev
```

Der Dev-Server läuft auf http://localhost:5173

### 5. Netlify Functions lokal testen (optional)

```bash
npm install -g netlify-cli
cd netlify/functions && npm install
netlify dev
```

### 6. Worker starten (optional)

```bash
cd worker
npm install
npm run dev
```

## Deployment auf Netlify

1. Repository mit Netlify verbinden (GitHub-App)
2. Build-Einstellungen werden automatisch aus `netlify.toml` gelesen
3. Umgebungsvariablen in Netlify UI eintragen (alle aus `.env.example`)
4. Stripe-Webhook konfigurieren:
   - URL: `https://deine-domain.netlify.app/.netlify/functions/stripe/webhook`
   - Events: `customer.subscription.*`, `invoice.payment_*`

## Features

| Feature | Status |
|---------|--------|
| Benutzerauthentifizierung (Supabase Auth) | ✅ |
| Video-Upload (Supabase Storage) | ✅ |
| S3 Multipart-Upload | ✅ |
| KI-Ideen-Generator (OpenAI GPT-4o-mini) | ✅ |
| BullMQ Video-Worker (FFmpeg) | ✅ |
| Stripe-Abonnements | ✅ |
| TypeScript strict mode | ✅ |
| Tailwind CSS | ✅ |
| TanStack Query | ✅ |
| Zustand State Management | ✅ |

## Technologie-Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, Zustand, React Router  
**Backend:** Netlify Functions (TypeScript), Supabase, OpenAI, Stripe  
**Worker:** BullMQ, FFmpeg (fluent-ffmpeg), Redis/Upstash  
**Datenbank:** Supabase (PostgreSQL mit Row Level Security)  
**Storage:** Supabase Storage / AWS S3

## Lizenz

MIT
