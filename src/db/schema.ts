import {
  pgTable,
  text,
  integer,
  jsonb,
  timestamp,
  primaryKey,
  uniqueIndex,
  index,
  boolean,
} from 'drizzle-orm/pg-core'

/** Cloud profile + reading/memory progress (synced from the app). */
export const profiles = pgTable('profiles', {
  userId: text('user_id').primaryKey(),
  displayName: text('display_name').notNull().default('Friend'),
  streak: integer('streak').notNull().default(0),
  longestStreak: integer('longest_streak').notNull().default(0),
  /** Server-authoritative XP (sum of validated progress_events awards). */
  xp: integer('xp').notNull().default(0),
  /** Server-authoritative gems (sum of validated gem_events deltas). */
  gems: integer('gems').notNull().default(0),
  lastReadDate: text('last_read_date'),
  /**
   * Full UserState JSON for sync (readings, memory bank text, etc.).
   * Must not contain esvApiKey — stripped in /api/progress before write.
   * XP/streak denormalized columns are authoritative over state_json.
   */
  stateJson: jsonb('state_json'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

/** Append-only, server-validated progression ledger. */
export const progressEvents = pgTable(
  'progress_events',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    type: text('type').notNull(),
    payload: jsonb('payload').notNull().default({}),
    awardedXp: integer('awarded_xp').notNull().default(0),
    clientCreatedAt: timestamp('client_created_at', { withTimezone: true }).notNull(),
    serverReceivedAt: timestamp('server_received_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index('progress_events_user_idx').on(t.userId),
    index('progress_events_user_received_idx').on(t.userId, t.serverReceivedAt),
    index('progress_events_user_client_created_idx').on(t.userId, t.clientCreatedAt),
  ],
)

/** Small friend group for streak encouragement. */
export const circles = pgTable('circles', {
  id: text('id').primaryKey(),
  name: text('name').notNull().default('Abide Circle'),
  inviteCode: text('invite_code').notNull().unique(),
  createdBy: text('created_by').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const circleMembers = pgTable(
  'circle_members',
  {
    circleId: text('circle_id')
      .notNull()
      .references(() => circles.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(),
    joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.circleId, t.userId] })],
)

export const nudges = pgTable(
  'nudges',
  {
    id: text('id').primaryKey(),
    circleId: text('circle_id')
      .notNull()
      .references(() => circles.id, { onDelete: 'cascade' }),
    fromUserId: text('from_user_id').notNull(),
    toUserId: text('to_user_id').notNull(),
    message: text('message').notNull().default('Keep the streak going!'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('nudges_from_created_idx').on(t.fromUserId, t.createdAt),
    index('nudges_circle_idx').on(t.circleId),
  ],
)

/** Shared memorization competition for a circle. */
export const memoryChallenges = pgTable('memory_challenges', {
  id: text('id').primaryKey(),
  circleId: text('circle_id')
    .notNull()
    .references(() => circles.id, { onDelete: 'cascade' }),
  createdBy: text('created_by').notNull(),
  name: text('name').notNull(),
  /** TMS series id (A–E) or "custom" */
  source: text('source').notNull().default('custom'),
  /** ChallengeVerse[] — shared references everyone quizzes on */
  versesJson: jsonb('verses_json').notNull(),
  startsAt: timestamp('starts_at', { withTimezone: true }).defaultNow().notNull(),
  endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
  status: text('status').notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const memoryChallengeScores = pgTable(
  'memory_challenge_scores',
  {
    challengeId: text('challenge_id')
      .notNull()
      .references(() => memoryChallenges.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(),
    score: integer('score').notNull().default(0),
    correct: integer('correct').notNull().default(0),
    attempts: integer('attempts').notNull().default(0),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.challengeId, t.userId] })],
)

/** Append-only gem ledger (earns + spends). Balance = sum(delta_gems). */
export const gemEvents = pgTable(
  'gem_events',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    type: text('type').notNull(),
    payload: jsonb('payload').notNull().default({}),
    deltaGems: integer('delta_gems').notNull().default(0),
    activityKey: text('activity_key').notNull(),
    clientCreatedAt: timestamp('client_created_at', { withTimezone: true }).notNull(),
    serverReceivedAt: timestamp('server_received_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [
    index('gem_events_user_idx').on(t.userId),
    index('gem_events_user_received_idx').on(t.userId, t.serverReceivedAt),
    uniqueIndex('gem_events_user_activity_uidx').on(t.userId, t.activityKey),
  ],
)

/** Idempotent, server-scored challenge attempts. */
export const challengeSubmissions = pgTable(
  'challenge_submissions',
  {
    id: text('id').primaryKey(),
    challengeId: text('challenge_id')
      .notNull()
      .references(() => memoryChallenges.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(),
    verseId: text('verse_id').notNull(),
    translationId: text('translation_id').notNull(),
    correct: boolean('correct').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex('challenge_submissions_id_user_uidx').on(t.id, t.userId),
    index('challenge_submissions_user_created_idx').on(t.userId, t.createdAt),
    index('challenge_submissions_challenge_user_idx').on(t.challengeId, t.userId),
  ],
)
