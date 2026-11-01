-- Progress-event semantic idempotency (reading_session cross-device dedupe).
-- Non-destructive: nullable column; legacy rows keep activity_key NULL and are excluded
-- from the unique index. Rollback: DROP INDEX …; ALTER TABLE … DROP COLUMN activity_key;

ALTER TABLE "progress_events" ADD COLUMN IF NOT EXISTS "activity_key" text;

-- One logical activity per user (e.g. read:john:3:2026-06-15:web).
CREATE UNIQUE INDEX IF NOT EXISTS "progress_events_user_activity_uidx"
  ON "progress_events" ("user_id", "activity_key")
  WHERE "activity_key" IS NOT NULL;

-- History list by client time (also in 0003; IF NOT EXISTS keeps upgrades safe).
CREATE INDEX IF NOT EXISTS "progress_events_user_client_created_idx"
  ON "progress_events" ("user_id", "client_created_at" DESC);
