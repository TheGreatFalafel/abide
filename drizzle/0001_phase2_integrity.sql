-- Phase 2: server-authoritative progress events + challenge submissions.
-- Non-destructive: adds tables/indexes only. Does not drop or alter user data.
-- Rollback: DROP TABLE challenge_submissions; DROP TABLE progress_events;
--           DROP INDEX IF EXISTS nudges_from_created_idx; DROP INDEX IF EXISTS nudges_circle_idx;

CREATE TABLE IF NOT EXISTS "progress_events" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL,
  "type" text NOT NULL,
  "payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "awarded_xp" integer DEFAULT 0 NOT NULL,
  "client_created_at" timestamptz NOT NULL,
  "server_received_at" timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "progress_events_user_idx" ON "progress_events" ("user_id");
CREATE INDEX IF NOT EXISTS "progress_events_user_received_idx"
  ON "progress_events" ("user_id", "server_received_at");

CREATE TABLE IF NOT EXISTS "challenge_submissions" (
  "id" text PRIMARY KEY NOT NULL,
  "challenge_id" text NOT NULL,
  "user_id" text NOT NULL,
  "verse_id" text NOT NULL,
  "translation_id" text NOT NULL,
  "correct" boolean NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "challenge_submissions_challenge_id_memory_challenges_id_fk"
    FOREIGN KEY ("challenge_id") REFERENCES "public"."memory_challenges"("id")
    ON DELETE cascade ON UPDATE no action
);

CREATE UNIQUE INDEX IF NOT EXISTS "challenge_submissions_id_user_uidx"
  ON "challenge_submissions" ("id", "user_id");
CREATE INDEX IF NOT EXISTS "challenge_submissions_user_created_idx"
  ON "challenge_submissions" ("user_id", "created_at");
CREATE INDEX IF NOT EXISTS "challenge_submissions_challenge_user_idx"
  ON "challenge_submissions" ("challenge_id", "user_id");

CREATE INDEX IF NOT EXISTS "nudges_from_created_idx" ON "nudges" ("from_user_id", "created_at");
CREATE INDEX IF NOT EXISTS "nudges_circle_idx" ON "nudges" ("circle_id");
