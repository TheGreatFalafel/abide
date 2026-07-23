import {
  pgTable,
  text,
  integer,
  jsonb,
  timestamp,
  primaryKey,
} from 'drizzle-orm/pg-core'

/** Cloud profile + reading/memory progress (synced from the app). */
export const profiles = pgTable('profiles', {
  userId: text('user_id').primaryKey(),
  displayName: text('display_name').notNull().default('Friend'),
  streak: integer('streak').notNull().default(0),
  longestStreak: integer('longest_streak').notNull().default(0),
  xp: integer('xp').notNull().default(0),
  lastReadDate: text('last_read_date'),
  /** Full UserState JSON for sync — small for a few users */
  stateJson: jsonb('state_json'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

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

export const nudges = pgTable('nudges', {
  id: text('id').primaryKey(),
  circleId: text('circle_id')
    .notNull()
    .references(() => circles.id, { onDelete: 'cascade' }),
  fromUserId: text('from_user_id').notNull(),
  toUserId: text('to_user_id').notNull(),
  message: text('message').notNull().default('Keep the streak going!'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})
