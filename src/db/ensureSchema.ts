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
    CREATE INDEX IF NOT EXISTS "progress_events_user_client_created_idx"
    ON "progress_events" ("user_id", "client_created_at" DESC)
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

  // Atomic streak-freeze purchase: one PG function locks the profile row,
  // checks ledger balance + inventory cap, inserts gem_events, updates freezes.
  try {
    await sql`
      CREATE OR REPLACE FUNCTION purchase_streak_freeze(
        p_user_id text,
        p_event_id text,
        p_activity_key text,
        p_payload jsonb,
        p_client_created_at timestamptz,
        p_price integer DEFAULT 20,
        p_max_freezes integer DEFAULT 2
      ) RETURNS jsonb
      LANGUAGE plpgsql
      AS $fn$
      DECLARE
        v_balance integer;
        v_freezes integer;
        v_state jsonb;
      BEGIN
        SELECT
          coalesce((state_json->>'streakFreezes')::int, 0),
          coalesce(state_json, '{}'::jsonb)
        INTO v_freezes, v_state
        FROM profiles
        WHERE user_id = p_user_id
        FOR UPDATE;

        IF NOT FOUND THEN
          RETURN jsonb_build_object(
            'ok', false,
            'error', 'Profile not found',
            'serverGems', 0,
            'streakFreezes', 0,
            'freezesGranted', 0,
            'duplicate', false
          );
        END IF;

        IF EXISTS (
          SELECT 1 FROM gem_events
          WHERE user_id = p_user_id
            AND (id = p_event_id OR activity_key = p_activity_key)
        ) THEN
          SELECT coalesce(sum(delta_gems), 0)::int INTO v_balance
          FROM gem_events WHERE user_id = p_user_id;
          RETURN jsonb_build_object(
            'ok', true,
            'duplicate', true,
            'serverGems', v_balance,
            'streakFreezes', v_freezes,
            'freezesGranted', 0,
            'spent', 0
          );
        END IF;

        SELECT coalesce(sum(delta_gems), 0)::int INTO v_balance
        FROM gem_events WHERE user_id = p_user_id;

        IF v_freezes >= p_max_freezes THEN
          RETURN jsonb_build_object(
            'ok', false,
            'error', 'Streak freeze inventory is full',
            'serverGems', v_balance,
            'streakFreezes', v_freezes,
            'freezesGranted', 0,
            'duplicate', false
          );
        END IF;

        IF v_balance < p_price THEN
          RETURN jsonb_build_object(
            'ok', false,
            'error', 'Insufficient gems',
            'serverGems', v_balance,
            'streakFreezes', v_freezes,
            'freezesGranted', 0,
            'duplicate', false
          );
        END IF;

        INSERT INTO gem_events (
          id, user_id, type, payload, delta_gems, activity_key, client_created_at
        ) VALUES (
          p_event_id,
          p_user_id,
          'shop_streak_freeze',
          coalesce(p_payload, '{}'::jsonb),
          -p_price,
          p_activity_key,
          p_client_created_at
        );

        v_freezes := v_freezes + 1;
        v_balance := v_balance - p_price;
        v_state := jsonb_set(v_state, '{streakFreezes}', to_jsonb(v_freezes), true);
        v_state := jsonb_set(v_state, '{gems}', to_jsonb(v_balance), true);

        UPDATE profiles
        SET gems = v_balance,
            state_json = v_state,
            updated_at = now()
        WHERE user_id = p_user_id;

        RETURN jsonb_build_object(
          'ok', true,
          'duplicate', false,
          'serverGems', v_balance,
          'streakFreezes', v_freezes,
          'freezesGranted', 1,
          'spent', p_price
        );
      EXCEPTION
        WHEN unique_violation THEN
          SELECT coalesce(sum(delta_gems), 0)::int INTO v_balance
          FROM gem_events WHERE user_id = p_user_id;
          SELECT coalesce((state_json->>'streakFreezes')::int, 0) INTO v_freezes
          FROM profiles WHERE user_id = p_user_id;
          RETURN jsonb_build_object(
            'ok', true,
            'duplicate', true,
            'serverGems', coalesce(v_balance, 0),
            'streakFreezes', coalesce(v_freezes, 0),
            'freezesGranted', 0,
            'spent', 0
          );
      END;
      $fn$
    `
  } catch {
    // Fail closed for freeze purchases until the function exists.
  }
}
