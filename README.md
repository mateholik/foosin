# Foosball Tracker (MVP)

Simple self-hosted foosball score tracker for 2v2 matches.

## MVP Features

- No authentication
- Start a 2v2 game by selecting existing players or creating new ones
- Submit final score
- Leaderboard with wins, losses, games played, win rate
- Recent games list
- Best teammate ranking (included as a bonus section)

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (`@supabase/supabase-js`)

## 1) Local Setup

Install dependencies:

```bash
npm install
```

Copy environment variables:

```bash
cp .env.example .env.local
```

Set your Supabase values in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# or (Supabase dashboard naming):
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_publishable_key
```

Run development server:

```bash
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

## 2) Supabase Setup

Run SQL from `supabase/schema.sql` in your Supabase SQL editor, then run `supabase/seed.sql`.

This creates:
- `players`
- `games`

Note: your draft schema had `player_b_b2`; the app and schema use `player_b2`.

## 3) Build and Run

```bash
npm run build
npm start
```

## 4) DigitalOcean Deployment (Manual)

Install on droplet:
- `node`
- `npm`
- `pm2` (optional)
- `nginx`

Run app:

```bash
npm install
npm run build
npm start
```

Optional PM2:

```bash
pm2 start npm --name foosball -- start
```

## 5) Nginx Reverse Proxy

Example server block:

```nginx
server {
  server_name foosball.yourdomain.com;

  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
  }
}
```

References:
- [Supabase Next.js Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [PM2 Quick Start](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Docs](https://nginx.org/en/docs/)
