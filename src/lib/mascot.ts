import type { AchievementId, UserState } from './types'
import { todayKey } from './types'

/**
 * Ari’s expression set — maps 1:1 to face/mane variants in AriMark.
 * Legacy aliases (encourage, celebrate, nudge, empty) normalize via `normalizeExpression`.
 */
export type AriExpression =
  | 'welcome'
  | 'encouraging'
  | 'thinking'
  | 'celebrating'
  | 'proud'
  | 'comforting'
  | 'neutral'

/**
 * Full-body pose for Ari. Independent of facial expression so the same smile
 * can sit, cheer, point, or think depending on context.
 */
export type AriPose =
  | 'idle'
  | 'walk'
  | 'jump'
  | 'celebrate'
  | 'encourage'
  | 'think'
  | 'guide'
  | 'fly'

/** @deprecated Prefer AriExpression — kept as alias for existing imports. */
export type MascotMood = AriExpression

export type MascotLine = {
  mood: AriExpression
  title: string
  body: string
  /** Optional body pose; defaults from mood when omitted. */
  pose?: AriPose
}

/** Abide’s original companion — a playful, refined adult lion. */
export const MASCOT_NAME = 'Ari'

export const ARI_EXPRESSIONS: readonly AriExpression[] = [
  'welcome',
  'encouraging',
  'thinking',
  'celebrating',
  'proud',
  'comforting',
  'neutral',
] as const

export const ARI_POSES: readonly AriPose[] = [
  'idle',
  'walk',
  'jump',
  'celebrate',
  'encourage',
  'think',
  'guide',
  'fly',
] as const

/** Streak lengths that unlock achievements / special celebrate copy. */
export const STREAK_MILESTONES = [7, 14, 30] as const

const LEGACY_MOOD: Record<string, AriExpression> = {
  encourage: 'encouraging',
  celebrate: 'celebrating',
  nudge: 'comforting',
  empty: 'thinking',
}

const STREAK_ACHIEVEMENT_TO_DAYS: Partial<Record<AchievementId, number>> = {
  streak_7: 7,
  streak_14: 14,
  streak_30: 30,
}

export function normalizeExpression(raw: unknown): AriExpression {
  if (typeof raw !== 'string') return 'neutral'
  if ((ARI_EXPRESSIONS as readonly string[]).includes(raw)) return raw as AriExpression
  return LEGACY_MOOD[raw] ?? 'neutral'
}

export function normalizePose(raw: unknown): AriPose {
  if (typeof raw !== 'string') return 'idle'
  if ((ARI_POSES as readonly string[]).includes(raw)) return raw as AriPose
  return 'idle'
}

/** Default body pose for a facial expression (banner / tour when pose omitted). */
export function poseForExpression(expression: AriExpression): AriPose {
  switch (normalizeExpression(expression)) {
    case 'celebrating':
      return 'celebrate'
    case 'encouraging':
      return 'encourage'
    case 'thinking':
      return 'think'
    case 'welcome':
      return 'guide'
    case 'proud':
      return 'idle'
    case 'comforting':
      return 'idle'
    default:
      return 'idle'
  }
}

/**
 * If a streak achievement just unlocked, return its day count for celebrate copy.
 * Prefers newAchievements so mid-streak revisits do not re-trigger the line.
 */
export function streakMilestoneFrom(
  streak: number,
  newAchievements: readonly AchievementId[] = [],
): number | undefined {
  let best: number | undefined
  for (const id of newAchievements) {
    const days = STREAK_ACHIEVEMENT_TO_DAYS[id]
    if (days != null && (best == null || days > best)) best = days
  }
  if (best != null) return best
  if ((STREAK_MILESTONES as readonly number[]).includes(streak)) return streak
  return undefined
}

/** Short-lived in-game reaction (no invented XP). */
export type AriAnswerReaction = {
  expression: AriExpression
  pose: AriPose
  title: string
  body: string
}

export function reactionForAnswer(correct: boolean): AriAnswerReaction {
  if (correct) {
    return {
      expression: 'proud',
      pose: 'celebrate',
      title: 'Nice catch',
      body: 'Truth remembered is truth ready to share.',
    }
  }
  return {
    expression: 'comforting',
    pose: 'encourage',
    title: 'Keep going',
    body: 'Wrong answers teach. Read the note, then try the next one.',
  }
}

export type MascotContext =
  | 'home'
  | 'empty-memory'
  | 'empty-learn'
  | 'celebrate'
  | 'shop'
  | 'games'
  | 'read'
  | 'memory'
  | 'circle'
  | 'learn'
  | 'tour'

export type MascotLineOpts = {
  leveledUp?: boolean
  newAchievements?: number
  earnedXp?: number
  /** Streak milestone (e.g. 7, 30) — only celebrate real thresholds. */
  streakMilestone?: number
}

/**
 * Pick a single supportive line. Calm — no spammy interruptions.
 * Never invent progress; never grant XP/gems/streaks.
 */
export function mascotLineFor(
  context: MascotContext,
  user: UserState,
  opts?: MascotLineOpts,
): MascotLine {
  const today = todayKey()
  const goalMet = user.todayXpDate === today && user.todayXp >= user.dailyGoalXp
  const streakRisk = user.streak > 0 && user.lastReadDate !== today
  const missedYesterday =
    user.streak === 0 && Boolean(user.lastReadDate) && user.lastReadDate !== today

  if (context === 'celebrate') {
    if (opts?.leveledUp) {
      return {
        mood: 'celebrating',
        pose: 'celebrate',
        title: `${MASCOT_NAME} noticed your growth`,
        body: 'A new level — keep walking steadily. Faithfulness compounds quietly.',
      }
    }
    if ((opts?.newAchievements ?? 0) > 0) {
      return {
        mood: 'proud',
        pose: 'celebrate',
        title: 'A milestone marked',
        body: 'Well done. Let the badge remind you of grace, not grind.',
      }
    }
    if (opts?.streakMilestone && opts.streakMilestone >= 7) {
      return {
        mood: 'celebrating',
        pose: 'jump',
        title: `${opts.streakMilestone}-day streak`,
        body: 'Consistency over intensity. Rest when you need to — the path will wait.',
      }
    }
    return {
      mood: 'celebrating',
      pose: 'celebrate',
      title: 'Session complete',
      body: opts?.earnedXp
        ? `+${opts.earnedXp} XP earned. Rest when you need to — return when you can.`
        : 'Review noted. Consistency matters more than speed.',
    }
  }

  if (context === 'empty-memory') {
    return {
      mood: 'thinking',
      pose: 'think',
      title: 'Your memory garden is quiet',
      body: 'Add a verse from today’s reading. Small seeds become storehouses.',
    }
  }

  if (context === 'empty-learn') {
    return {
      mood: 'encouraging',
      pose: 'encourage',
      title: 'Ready when you are',
      body: 'Theology, Greek, and Hebrew help you see Scripture’s connections. Start when curiosity tugs.',
    }
  }

  if (context === 'shop') {
    return {
      mood: 'welcome',
      pose: 'guide',
      title: 'Spend what study earned',
      body: 'Cosmetics change your look only. Streak freezes never change what Abide teaches.',
    }
  }

  if (context === 'games') {
    return {
      mood: 'encouraging',
      pose: 'encourage',
      title: `${MASCOT_NAME} likes sharp minds`,
      body: 'Play to remember and understand — practice anytime; daily rewards stay light.',
    }
  }

  if (context === 'read') {
    return {
      mood: 'thinking',
      pose: 'think',
      title: 'Open the Word',
      body: 'A short portion kept is better than a long skim forgotten. Read at your pace.',
    }
  }

  if (context === 'memory') {
    if ((user.memoryVerses?.length ?? 0) === 0) {
      return mascotLineFor('empty-memory', user, opts)
    }
    return {
      mood: 'encouraging',
      pose: 'encourage',
      title: 'Hide it in your heart',
      body: 'Due cards first. Honest grades teach the schedule — no shame in Again.',
    }
  }

  if (context === 'circle') {
    return {
      mood: 'proud',
      pose: 'idle',
      title: 'Walk with others',
      body: 'League and challenges are companionship, not a race against grace.',
    }
  }

  if (context === 'learn') {
    return {
      mood: 'thinking',
      pose: 'think',
      title: 'Study with care',
      body: 'Lessons unlock as you go. Reflection matters more than rushing the catalog.',
    }
  }

  if (context === 'tour') {
    return {
      mood: 'welcome',
      pose: 'guide',
      title: `Welcome — I’m ${MASCOT_NAME}`,
      body: 'I’ll point out Path, Read, Memory, Games, Circle, and Learn. Skip whenever you like.',
    }
  }

  // home
  if (streakRisk) {
    return {
      mood: 'comforting',
      pose: 'encourage',
      title: 'Your streak is waiting',
      body: 'A short reading or memory review keeps the flame from going out tonight — no guilt, just an invitation.',
    }
  }
  if (missedYesterday) {
    return {
      mood: 'comforting',
      pose: 'idle',
      title: 'Glad you’re back',
      body: 'Missed days happen. One faithful step today is enough.',
    }
  }
  if (goalMet) {
    return {
      mood: 'proud',
      pose: 'celebrate',
      title: 'Today’s quest is full',
      body: 'You met your XP goal. If you have margin, hide one more verse in your heart.',
    }
  }
  if (!user.lastReadDate) {
    return {
      mood: 'welcome',
      pose: 'guide',
      title: `Welcome — I’m ${MASCOT_NAME}`,
      body: 'I’ll cheer quiet faithfulness: reading, remembering, learning, and a good game of Scripture.',
    }
  }
  return {
    mood: 'encouraging',
    pose: 'encourage',
    title: 'Abide a little longer',
    body: 'Open the Path, review a due verse, or try a Bible game — one faithful step.',
  }
}

/** Expression alone for overlays that supply their own copy (e.g. tour steps). */
export function expressionForContext(
  context: MascotContext,
  user: UserState,
  opts?: MascotLineOpts,
): AriExpression {
  return normalizeExpression(mascotLineFor(context, user, opts).mood)
}
