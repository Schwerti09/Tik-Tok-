# TikTok Clone

A short-video sharing app built with React (Vite) and Netlify Functions.

## Project Structure

```
/
├── frontend/          # React + Vite frontend (builds to frontend/dist)
│   └── src/
├── netlify/
│   └── functions/     # Netlify serverless functions (API)
│       ├── videos.js  # GET  /api/videos  – video feed
│       ├── auth.js    # POST /api/auth    – login / register
│       └── upload.js  # POST /api/upload  – pre-signed upload URL
├── netlify.toml       # Netlify build & routing configuration
└── .env.example       # Required environment variables
```

## Local Development

```bash
# Install frontend dependencies
cd frontend && npm install

# Start the dev server
npm run dev
```

For local function testing install the Netlify CLI and run `netlify dev` from the project root.

## Deployment to Netlify

### 1. Push the repository to GitHub (already done).

### 2. Import the project in Netlify

Open [app.netlify.com](https://app.netlify.com), click **"Add new site → Import an existing project"** and choose this GitHub repository.

### 3. Configure build settings

| Setting | Value |
|---|---|
| Base directory | `/` |
| Build command | `cd frontend && npm run build` |
| Publish directory | `frontend/dist` |
| Functions directory | `netlify/functions` *(auto-detected from `netlify.toml`)* |

### 4. Set environment variables

In the Netlify UI go to **Site Settings → Environment Variables** and add the variables listed in [`.env.example`](.env.example):

| Variable | Description |
|---|---|
| `DATABASE_URL` | Connection string for your database |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `STORAGE_BUCKET` | Object storage bucket name |
| `STORAGE_KEY_ID` | Object storage key ID |
| `STORAGE_SECRET` | Object storage secret |
| `STORAGE_REGION` | Object storage region |
| `VITE_API_BASE_URL` | Set to `/.netlify/functions` |

### 5. Deploy

Click **"Deploy site"**. Subsequent pushes to the main branch trigger automatic deployments.

Netlify Functions are automatically deployed from the `netlify/functions` directory and are available at `https://<your-site>.netlify.app/api/*` via the redirect rule in `netlify.toml`.
