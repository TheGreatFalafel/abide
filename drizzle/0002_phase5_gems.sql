-- Phase 5: gem ledger + denormalized balance.
-- Non-destructive. Rollback: DROP TABLE gem_events; ALTER TABLE profiles DROP COLUMN IF EXISTS gems;

ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "gems" integer DEFAULT 0 NOT NULL;

CREATE TABLE IF NOT EXISTS "gem_events" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL,
  "type" text NOT NULL,
  "payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "delta_gems" integer DEFAULT 0 NOT NULL,
  "activity_key" text NOT NULL,
  "client_created_at" timestamptz NOT NULL,
  "server_received_at" timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "gem_events_user_idx" ON "gem_events" ("user_id");
CREATE INDEX IF NOT EXISTS "gem_events_user_received_idx"
  ON "gem_events" ("user_id", "server_received_at");
CREATE UNIQUE INDEX IF NOT EXISTS "gem_events_user_activity_uidx"
  ON "gem_events" ("user_id", "activity_key");
