-- Abide baseline schema (profiles, circles, challenges).
-- Safe to apply on a fresh Neon database. Existing db:push deployments
-- should already have these tables; drizzle will track this as applied.

CREATE TABLE IF NOT EXISTS "profiles" (
  "user_id" text PRIMARY KEY NOT NULL,
  "display_name" text DEFAULT 'Friend' NOT NULL,
  "streak" integer DEFAULT 0 NOT NULL,
  "longest_streak" integer DEFAULT 0 NOT NULL,
  "xp" integer DEFAULT 0 NOT NULL,
  "last_read_date" text,
  "state_json" jsonb,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "circles" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text DEFAULT 'Abide Circle' NOT NULL,
  "invite_code" text NOT NULL,
  "created_by" text NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "circles_invite_code_unique" UNIQUE("invite_code")
);

CREATE TABLE IF NOT EXISTS "circle_members" (
  "circle_id" text NOT NULL,
  "user_id" text NOT NULL,
  "joined_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "circle_members_circle_id_circles_id_fk"
    FOREIGN KEY ("circle_id") REFERENCES "public"."circles"("id") ON DELETE cascade ON UPDATE no action,
  PRIMARY KEY ("circle_id", "user_id")
);

CREATE TABLE IF NOT EXISTS "nudges" (
  "id" text PRIMARY KEY NOT NULL,
  "circle_id" text NOT NULL,
  "from_user_id" text NOT NULL,
  "to_user_id" text NOT NULL,
  "message" text DEFAULT 'Keep the streak going!' NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "nudges_circle_id_circles_id_fk"
    FOREIGN KEY ("circle_id") REFERENCES "public"."circles"("id") ON DELETE cascade ON UPDATE no action
);

CREATE TABLE IF NOT EXISTS "memory_challenges" (
  "id" text PRIMARY KEY NOT NULL,
  "circle_id" text NOT NULL,
  "created_by" text NOT NULL,
  "name" text NOT NULL,
  "source" text DEFAULT 'custom' NOT NULL,
  "verses_json" jsonb NOT NULL,
  "starts_at" timestamptz DEFAULT now() NOT NULL,
  "ends_at" timestamptz NOT NULL,
  "status" text DEFAULT 'active' NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "memory_challenges_circle_id_circles_id_fk"
    FOREIGN KEY ("circle_id") REFERENCES "public"."circles"("id") ON DELETE cascade ON UPDATE no action
);

CREATE TABLE IF NOT EXISTS "memory_challenge_scores" (
  "challenge_id" text NOT NULL,
  "user_id" text NOT NULL,
  "score" integer DEFAULT 0 NOT NULL,
  "correct" integer DEFAULT 0 NOT NULL,
  "attempts" integer DEFAULT 0 NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "memory_challenge_scores_challenge_id_memory_challenges_id_fk"
    FOREIGN KEY ("challenge_id") REFERENCES "public"."memory_challenges"("id") ON DELETE cascade ON UPDATE no action,
  PRIMARY KEY ("challenge_id", "user_id")
);
