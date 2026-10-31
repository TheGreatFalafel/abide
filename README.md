# Abide

Habit-forming Bible reading — streaks, TMS memory, section quizzes, and (Phase 2) cloud accounts + friend circles on Vercel.

## Run locally (app UI)

```bash
npm install
npm run dev
```

Open http://localhost:3000

Pure offline Vite (no auth/API): `npm run dev:vite`  
Vite and Next share styles from `src/styles/app.css`. Keep Vite entry files until offline mode is intentionally retired.

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

Clerk is **optional**. Without those keys the app runs fully on-device (reading, memory, XP). Settings and Circle degrade gracefully; Circle shows a setup message instead of crashing.

### 3. Deploy on Vercel (free Hobby)
1. Push this repo to GitHub
2. Import in [vercel.com](https://vercel.com)
3. Add the same env vars in Project → Settings → Environment Variables
4. Deploy

Then open the **Circle** tab → Sign in → Create a circle → share the invite code with a friend.

## What is stored where

### On this device (`localStorage` key `abide-user-v1`)
- Name, plan, completed days, XP, streaks, achievements
- Memory bank including **memorized verse text** (needed for offline practice)
- Translation preference
- **Personal Crossway ESV API key** (device-local only)

### In Neon (when signed in)
- Profile: name, streak, XP, last read date
- Full progress JSON (`profiles.state_json`): readings, quizzes, memory bank (**including verse text** for sync across devices)
- Circle membership, encourage nudges, memory challenges / scores

**ESV API keys are not uploaded.** Cloud sync strips `esvApiKey` before PUT and before writing `state_json`. GET responses also redact any legacy keys still present in older rows. After you sign in on a new device, re-enter the Crossway key in Settings once.

### Scripture licensing note
Passages for reading are fetched live (ESV / bible-api). Memorized verse **text** is stored so practice works offline and can sync with your account. Keep ESV attribution visible; do not republish ESV text outside the app’s licensed use.

## ESV key handling (security)

| Layer | Behavior |
|---|---|
| Browser | Key saved in `localStorage` with the rest of local progress; used for direct calls to `api.esv.org` |
| Cloud sync / Neon | Key **stripped** — never intentionally stored in `state_json` |
| API responses | Progress payloads return empty `esvApiKey` |
| Limitations | Any XSS or shared-device access to the browser can still read the local key; there is no server-side ESV proxy yet (Phase 0 keeps Crossway’s free personal-key model) |

## Features
- Bible in a Year + other plans with section quizzes  
- Navigators TMS memory pack, memorized retention, memory quiz  
- ESV via your Crossway API key (browser, device-local)  
- Friend circle: streaks + encourage (cloud)

## Database schema (current) & future migrations

**Do not run a new migration as part of casual local setup unless you intend to.** Schema lives in `src/db/schema.ts` and is applied today with:

```bash
npm run db:push
```

### Current tables
| Table | Role |
|---|---|
| `profiles` | Clerk `user_id`, display fields, XP/streak denormalized, `state_json` blob |
| `circles` | Invite-code friend groups |
| `circle_members` | Membership (max 8 enforced in API) |
| `nudges` | Encourage messages |
| `memory_challenges` | Async circle memory competitions |
| `memory_challenge_scores` | Per-user challenge tallies |

Challenge tables may also be ensured at runtime via `CREATE TABLE IF NOT EXISTS` in the challenge API (technical debt).

### Migrations (Phase 2+)
Versioned SQL lives in `drizzle/`:

| File | Purpose |
|---|---|
| `0000_baseline.sql` | profiles, circles, nudges, memory challenges |
| `0001_phase2_integrity.sql` | `progress_events`, `challenge_submissions`, rate-limit indexes |

```bash
npm run db:migrate   # preferred for shared environments
# or, for a brand-new empty DB during local experimentation:
npm run db:push
```

**Rollback (0001):** drop `challenge_submissions` and `progress_events` (and the nudge indexes). Does not delete reading/memory content in `profiles.state_json`.

### Progress integrity (Phase 2)
- Local XP still updates immediately (offline-friendly).
- Each award also enqueues a UUID progress event (`abide-progress-events-v1`).
- When signed in, CloudBridge POSTs events to `/api/progress/events`; the server recomputes XP and rejects duplicates / forged types.
- `PUT /api/progress` syncs content (readings, memory bank) but **does not** accept client XP as authoritative.
- Circle challenge answers are graded server-side from `selectedText` (never from `correct: true`).

### ESV proxy
Signed-in or anonymous Next deployments can call `POST /api/bible/esv` with `X-ESV-API-Key` for the request only. The key is not stored. Vite offline mode still talks to Crossway directly.

### Theology curriculum (Phase 3 + expansion)
- Browse topics under the **Learn** tab (`src/data/curriculum/`).
- Progress lives in `UserState.curriculum` (stable lesson ids) and syncs with the rest of `state_json`.
- XP uses `curriculum_lesson` progress events only after quiz + reflection — not for opening a lesson.
- Topics: Doctrine of Scripture, Doctrine of God, The Nature of Man, Doctrine of Christ, Doctrine of Salvation, Doctrine of the Church, Doctrine of Last Things (Reformed; Grudem-organized; Sproul/MacArthur supplementary attribution). Catalog version 2 preserves prior completions.

### Biblical Greek & Hebrew
- Learn tab tracks for **Biblical Greek** and **Biblical Hebrew** (`src/data/languages/`) — 8 lessons each from alphabet through guided passage reading.
- Progress in `UserState.languages` with per-track lesson completion and **separate FSRS vocab decks** (never mixed with Scripture `memoryVerses`).
- XP/gems via `language_lesson` / `language_vocab_review` (and matching gem events); replay does not re-award.

### Progressive Web App (Phase 4)
- Installable via `public/manifest.webmanifest` + brand icons in `public/icons/`.
- Service worker (`public/sw.js`) caches the app shell and static assets only — never `/api/*`, Clerk, or API keys.
- Bible passages you have opened are stored in IndexedDB for offline re-reading; memory, curriculum text, and XP queues already work locally.
- Opt-in reminders live under **Settings → Reminders** (no permission prompt on first launch).
- **iPhone:** Safari → Share → Add to Home Screen for standalone mode and better notification support.

### Gems & cosmetics (Phase 5)
- Gems are a separate currency from XP with a server ledger (`gem_events`, migration `0002_phase5_gems`).
- Earn from meaningful first-time study (lessons, curriculum, scheduled reviews, quests, daily goal); daily earn cap applies.
- Shop (More → Shop) sells cosmetic avatar items only — no pay-to-win, no paid currency.
- Mascot **Ari** (a playful, refined lion) offers quiet encouragement on Home, Games, and celebrations.

### Bible games (Phase 6)
- **Game Center** under More hosts a modular registry of educational games.
- Games: Scripture Scramble, Finish the Verse, Bible Trivia, Who Said It?, Biblical Timeline, Match the Passage.
- Curated question banks with Scripture references; verse games use your memory translation or public-domain WEB.
- XP/gems once per game per calendar day — replays for practice do not farm rewards. FSRS scheduling is untouched.
