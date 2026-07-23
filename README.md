# Abide

Habit-forming Bible reading — streaks, TMS memory, section quizzes, and (Phase 2) cloud accounts + friend circles on Vercel.

## Run locally (app UI)

```bash
npm install
npm run dev
```

Open http://localhost:3000

Pure offline Vite (no auth/API): `npm run dev:vite`

## Storage: do you need Supabase?

**No.** You do not need to use your ToolLoop Supabase project.

| Option | Use for Abide? |
|---|---|
| **Vercel alone** | Hosts the app. Does **not** include a free durable SQL database by itself. |
| **Your existing Supabase** | Possible (you get 2 free projects), but you’d share org quota with ToolLoop. Skip if you want isolation. |
| **Neon free Postgres** (recommended) | Separate free DB. Tiny data for a few friends (streaks/XP/JSON) — usually well under 1 MB. |

Abide Phase 2 uses **Neon + Clerk**, not your Supabase.

## Phase 2 setup (accounts + circle)

### 1. Neon database
1. Sign up at [console.neon.tech](https://console.neon.tech) (free)
2. Create a project → copy the connection string
3. Put it in `.env.local` as `DATABASE_URL`
4. Push tables:

```bash
npm run db:push
```

### 2. Clerk auth
1. Sign up at [dashboard.clerk.com](https://dashboard.clerk.com) (free)
2. Create an application
3. Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` to `.env.local`
4. In Clerk, allow email/password or social login as you like

### 3. Deploy on Vercel (free Hobby)
1. Push this repo to GitHub
2. Import in [vercel.com](https://vercel.com)
3. Add the same env vars in Project → Settings → Environment Variables
4. Deploy

Then open the **Circle** tab → Sign in → Create a circle → share the invite code with a friend.

## What’s stored in Neon
- Profile: name, streak, XP, last read date  
- Full progress JSON (readings, memory bank)  
- Circle membership + encourage nudges  

No Bible text is stored in the DB (passages still come from ESV / bible-api).

## Features
- Bible in a Year + other plans with section quizzes  
- Navigators TMS memory pack, memorized retention, memory quiz  
- ESV via your Crossway API key (browser)  
- Friend circle: streaks + encourage (cloud)
