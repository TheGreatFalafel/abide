import { neon } from '@neondatabase/serverless'

/**
 * Idempotent DDL for Phase 2/5 tables that Memory sync + competitions need.
 * Safe to call on every cold start when production was deployed without
 * `drizzle-kit migrate` — matches the additive SQL in drizzle/0001 and 0002.
 */
export async function ensureSchema(databaseUrl = process.env.DATABASE_URL): Promise<void> {
  if (!databaseUrl) return

  const sql = neon(databaseUrl)

  await sql`
    CREATE TABLE IF NOT EXISTS "progress_events" (
      "id" text PRIMARY KEY NOT NULL,
      "user_id" text NOT NULL,
      "type" text NOT NULL,
      "payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
      "awarded_xp" integer DEFAULT 0 NOT NULL,
      "client_created_at" timestamptz NOT NULL,
      "server_received_at" timestamptz DEFAULT now() NOT NULL
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS "progress_events_user_idx" ON "progress_events" ("user_id")`
  await sql`
    CREATE INDEX IF NOT EXISTS "progress_events_user_received_idx"
    ON "progress_events" ("user_id", "server_received_at")
  `

  await sql`
    CREATE TABLE IF NOT EXISTS "challenge_submissions" (
      "id" text PRIMARY KEY NOT NULL,
      "challenge_id" text NOT NULL,
      "user_id" text NOT NULL,
      "verse_id" text NOT NULL,
      "translation_id" text NOT NULL,
      "correct" boolean NOT NULL,
      "created_at" timestamptz DEFAULT now() NOT NULL
    )
  `
  // FK only when memory_challenges already exists (baseline). Skip quietly if not.
  try {
    await sql`
      DO $$ BEGIN
        ALTER TABLE "challenge_submissions"
          ADD CONSTRAINT "challenge_submissions_challenge_id_memory_challenges_id_fk"
          FOREIGN KEY ("challenge_id") REFERENCES "public"."memory_challenges"("id")
          ON DELETE cascade ON UPDATE no action;
      EXCEPTION
        WHEN duplicate_object THEN NULL;
        WHEN undefined_table THEN NULL;
      END $$
    `
  } catch {
    // Neon HTTP may not support DO blocks on some plans; table itself is enough for inserts.
  }

  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS "challenge_submissions_id_user_uidx"
    ON "challenge_submissions" ("id", "user_id")
  `
  await sql`
    CREATE INDEX IF NOT EXISTS "challenge_submissions_user_created_idx"
    ON "challenge_submissions" ("user_id", "created_at")
  `
  await sql`
    CREATE INDEX IF NOT EXISTS "challenge_submissions_challenge_user_idx"
    ON "challenge_submissions" ("challenge_id", "user_id")
  `

  await sql`ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "gems" integer DEFAULT 0 NOT NULL`

  await sql`
    CREATE TABLE IF NOT EXISTS "gem_events" (
      "id" text PRIMARY KEY NOT NULL,
      "user_id" text NOT NULL,
      "type" text NOT NULL,
      "payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
      "delta_gems" integer DEFAULT 0 NOT NULL,
      "activity_key" text NOT NULL,
      "client_created_at" timestamptz NOT NULL,
      "server_received_at" timestamptz DEFAULT now() NOT NULL
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS "gem_events_user_idx" ON "gem_events" ("user_id")`
  await sql`
    CREATE INDEX IF NOT EXISTS "gem_events_user_received_idx"
    ON "gem_events" ("user_id", "server_received_at")
  `
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS "gem_events_user_activity_uidx"
    ON "gem_events" ("user_id", "activity_key")
  `

  try {
    await sql`CREATE INDEX IF NOT EXISTS "nudges_from_created_idx" ON "nudges" ("from_user_id", "created_at")`
    await sql`CREATE INDEX IF NOT EXISTS "nudges_circle_idx" ON "nudges" ("circle_id")`
  } catch {
    // Baseline nudges table may be absent in empty DBs.
  }
}
