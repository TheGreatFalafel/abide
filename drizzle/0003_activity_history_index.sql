-- Faster private history queries ordered by client time (Learning Insights).
CREATE INDEX IF NOT EXISTS "progress_events_user_client_created_idx"
  ON "progress_events" ("user_id", "client_created_at" DESC);
