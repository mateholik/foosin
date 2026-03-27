# Foosball Tracker (MVP)

Simple self-hosted foosball score tracker for 2v2 matches.

## MVP Features

- No authentication
- Start a 2v2 game by selecting existing players or creating new ones
- Submit final score
- Leaderboard with wins, losses, games played, win rate
- Recent games list
- Best teammate ranking (included as a bonus section)
- `/admin` shared-password access for editing/deleting games
- `/admin` player management (rename, delete if unused)
- `/admin` team management (rename team, syncs game snapshots)

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
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
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
# Optional: the public key can exist, but should not be able to access tables once RLS is enabled.
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_publishable_key
ADMIN_PASSWORD=replace_with_shared_admin_password
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

## 3) Build and Run (Standalone)

```bash
npm run build
cp -R public .next/standalone/
cp -R .next/static .next/standalone/.next/
node .next/standalone/server.js
```

`/admin` uses `ADMIN_PASSWORD`. Anyone with that password can log in and edit/delete games.

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
cp -R public .next/standalone/
cp -R .next/static .next/standalone/.next/
node .next/standalone/server.js
```

Optional PM2:

```bash
pm2 start .next/standalone/server.js --name foosball
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


Copy standalone build files to DO server. .next folder should exist in www/foosin
scp -r .next/standalone root@161.35.22.48:/var/www/foosin/.next/
scp -r .next/static root@161.35.22.48:/var/www/foosin/.next/
scp -r public root@161.35.22.48:/var/www/foosin/
