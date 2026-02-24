# TikFlow – Projektstatus

## A. WAS BEREITS FUNKTIONIERT (CHECKLISTE)

- [x] Projektstruktur (alle Ordner/Dateien angelegt)
- [x] Frontend-Grundgerüst (Vite, React, JavaScript, Tailwind-ähnliches CSS)
- [x] Routing (React Router mit allen Seiten)
- [x] Supabase-Client (konfiguriert in `src/supabaseClient.js`)
- [x] Authentifizierung (Login/Register mit geschützten Routen via `PrivateRoute`)
- [x] Dashboard (Grundlayout mit Sidebar und Quick-Action-Karten)
- [x] ClipForge Upload (Datei-Upload via `RecordingsPage` mit Multer + Supabase Storage)
- [x] Video-Processing-Queue (Jobs-Tabelle in Supabase; `worker/` Grundgerüst angelegt)
- [x] OpenAI-Integration (Ideen-Generator API in `/api/ideas/generate` – aktuell Platzhalter)
- [x] TrendRadar (Supabase-Tabelle `trends` + API-Endpunkt `/api/trends`)
- [x] Scheduler (CRUD-Operationen in `/api/schedules`)
- [x] Analytics (Übersichtsview `analytics_overview` + `/api/analytics/overview`)
- [x] Community (Forum-Posts + Kommentare + Mentoren via Supabase)
- [x] Stripe-Zahlungen (Checkout-Session + Webhook + Portal-Session)
- [x] RLS-Policies (Row Level Security für alle User-Tabellen)
- [x] Responsive Design (Mobile/Desktop via CSS-Grid/Flexbox)
- [x] Umgebungsvariablen (vollständig in `.env.example` dokumentiert)
- [x] Shared Types (Typdefinitionen und Validierungsschemas in `shared/`)
- [x] Worker-Grundgerüst (simulierter Video-Processing-Worker in `worker/`)

---

## B. WAS NOCH NICHT FUNKTIONIERT / FEHLT

- [ ] Tatsächliche Video-Rendering-Pipeline (FFmpeg) – derzeit nur simuliert im Worker
- [ ] TikTok/Instagram/YouTube API-Integration – nur Mock-Endpunkte vorhanden
- [ ] UTM-Tracking für Sales – Struktur vorhanden, aber keine echten Conversions
- [ ] Team-Zugang für Business-Plan (Multi-User / Seat-Management)
- [ ] E-Mail-Benachrichtigungen (z.B. Resend oder SendGrid)
- [ ] Admin-Bereich (Nutzerverwaltung, Trend-Scan auslösen)
- [ ] Performance-Optimierung (Bild-Kompression, Lazy Loading, Code Splitting)
- [ ] Volltextsuche in Community-Posts
- [ ] Export-Funktion für Analytics (PDF/CSV)
- [ ] KI-Modell für bessere Trend-Vorhersage (aktuell nur Basisimplementierung)
- [ ] OpenAI-Anbindung im Ideen-Generator (derzeit werden Platzhalter zurückgegeben)

---

## C. BEKANNTE BUGS / EINSCHRÄNKUNGEN

1. **Video-Upload > 100 MB schlägt fehl** – Netlify/Express-Limit; Workaround: Direkt-Upload zu S3/Supabase Storage nötig
2. **Redis-Verbindung** – Worker verwendet aktuell In-Memory-Queue; bei kostenlosem Upstash-Tier kann die Verbindung langsam sein
3. **OpenAI-Rate-Limits** – bei vielen gleichzeitigen Anfragen können Fehler auftreten; Retry-Logik fehlt
4. **Keine Upload-Wiederaufnahme** – bei abgebrochenen Uploads muss neu gestartet werden
5. **Mobile Analytics-Charts** – tabellarische Darstellung auf kleinen Bildschirmen noch suboptimal
6. **Kein Offline-Modus / PWA** – App erfordert ständige Internetverbindung
7. **`scheduled_time` vs. `scheduled_at`** – Spaltenname in Migration 2 umbenannt; ältere Daten müssen ggf. migriert werden
8. **Supabase `analytics_overview`-View** – `total_views` und `subscribers` werden immer als 0 zurückgegeben (keine Plattform-API-Anbindung)

---

## D. NÄCHSTE SCHRITTE (PRIORISIERT)

1. 🔥 **Hohe Priorität** – Video-Rendering mit AWS Lambda + FFmpeg implementieren
2. 🔥 **Hohe Priorität** – Echte Social-Media-APIs integrieren (TikTok, Instagram, YouTube)
3. 🔥 **Hohe Priorität** – S3-Direkt-Upload für große Dateien (Multipart-Upload)
4. 🔥 **Hohe Priorität** – OpenAI-API im Ideen-Generator tatsächlich anbinden
5. 📊 **Mittlere Priorität** – UTM-Tracking live schalten (Query-Parameter auslesen, in `sales` speichern)
6. 📊 **Mittlere Priorität** – E-Mail-Benachrichtigungen (Resend / SendGrid)
7. 📊 **Mittlere Priorität** – Team-Funktionalität (Einladungen, geteilte Projekte)
8. 📊 **Mittlere Priorität** – Admin-Bereich (Dashboard, Nutzer- und Trend-Verwaltung)
9. 🔧 **Niedrige Priorität** – PWA / Offline-Fähigkeit (Service Worker)
10. 🔧 **Niedrige Priorität** – KI-Modell verbessern (Fine-tuning für Trend-Vorhersage)
11. 🔧 **Niedrige Priorität** – Analytics-Export (PDF via `jsPDF`, CSV via `papaparse`)
12. 🔧 **Niedrige Priorität** – Volltextsuche in Community (Supabase `pg_trgm` oder Meilisearch)

---

## E. DEPLOYMENT-CHECKLISTE (NETLIFY)

- [ ] Umgebungsvariablen in Netlify UI setzen (alle Werte aus `.env.example`)
- [ ] Supabase-Projekt erstellen und beide SQL-Migrationen ausführen
  - `supabase/migrations/20240001000000_initial_schema.sql`
  - `supabase/migrations/20240002000000_add_missing_tables.sql`
- [ ] Stripe-Webhook konfigurieren (URL: `https://<domain>/.netlify/functions/stripe/webhook`)
- [ ] Stripe-Produkte und -Preise anlegen; Preis-IDs in Umgebungsvariablen eintragen
- [ ] Supabase Storage-Bucket `recordings` anlegen (public oder mit signierten URLs)
- [ ] Backend-Server deployen (z.B. Railway, Render, Fly.io) und `VITE_API_URL` setzen
- [ ] Redis (Upstash) einrichten und `REDIS_URL` in Backend-Umgebungsvariablen eintragen
- [ ] AWS S3 Bucket + IAM-User anlegen (für zukünftigen Direkt-Upload)
- [ ] Custom Domain konfigurieren (optional, Netlify DNS oder externer Anbieter)
- [ ] SSL automatisch (Netlify übernimmt das)
- [ ] CI/CD via GitHub (Netlify-GitHub-App verbinden, automatische Deploys bei Push)

---

## F. TECHNISCHE SCHULD / REFACTORING-IDEEN

- **Monorepo mit Turborepo** aufsetzen (Frontend, Backend, Worker, Shared in einem Repo verwalten)
- **TypeScript** durchgehend einführen (Frontend aktuell JavaScript; `shared/types.js` bereits als Grundlage vorhanden)
- **GraphQL statt REST** für komplexe verschachtelte Queries (z.B. Analytics + Sales in einer Abfrage)
- **Microservices** für Video-Processing (separater Dienst, skalierbar auf eigene Instanzen)
- **KI-Modelle** auf eigene GPU-Instanz auslagern (reduziert OpenAI-API-Kosten bei Scale)
- **WebSockets** für Echtzeit-Fortschrittsanzeige beim Video-Processing (z.B. via Socket.io)
- **Fehlermonitoring** einbinden (Sentry für Frontend und Backend)
- **API-Rate-Limiting** im Backend (express-rate-limit)
- **Eingabevalidierung** ausbauen (`shared/validation.js` als Basis vorhanden)
- **Test-Abdeckung** erhöhen (aktuell keine automatisierten Tests vorhanden)
