import type { UserState } from './types'
import { todayKey } from './types'

export type MascotMood = 'welcome' | 'encourage' | 'celebrate' | 'nudge' | 'empty'

export type MascotLine = {
  mood: MascotMood
  title: string
  body: string
}

/** Abide’s original companion — a playful, refined adult lion. */
export const MASCOT_NAME = 'Ari'

/**
 * Pick a single supportive line. Kept calm — no spammy interruptions.
 */
export function mascotLineFor(
  context: 'home' | 'empty-memory' | 'empty-learn' | 'celebrate' | 'shop' | 'games',
  user: UserState,
  opts?: { leveledUp?: boolean; newAchievements?: number; earnedXp?: number },
): MascotLine {
  const today = todayKey()
  const goalMet = user.todayXpDate === today && user.todayXp >= user.dailyGoalXp
  const streakRisk = user.streak > 0 && user.lastReadDate !== today

  if (context === 'celebrate') {
    if (opts?.leveledUp) {
      return {
        mood: 'celebrate',
        title: `${MASCOT_NAME} noticed your growth`,
        body: 'A new level — keep walking steadily. Faithfulness compounds quietly.',
      }
    }
    if ((opts?.newAchievements ?? 0) > 0) {
      return {
        mood: 'celebrate',
        title: 'A milestone marked',
        body: 'Well done. Let the badge remind you of grace, not grind.',
      }
    }
    return {
      mood: 'celebrate',
      title: 'Session complete',
      body: opts?.earnedXp
        ? `+${opts.earnedXp} XP earned. Rest when you need to — return when you can.`
        : 'Review noted. Consistency matters more than speed.',
    }
  }

  if (context === 'empty-memory') {
    return {
      mood: 'empty',
      title: 'Your memory garden is quiet',
      body: 'Add a verse from today’s reading. Small seeds become storehouses.',
    }
  }

  if (context === 'empty-learn') {
    return {
      mood: 'encourage',
      title: 'Ready when you are',
      body: 'Theology lessons help you see Scripture’s connections. Start with The Nature of Man.',
    }
  }

  if (context === 'shop') {
    return {
      mood: 'welcome',
      title: 'Cosmetic treasures only',
      body: 'Gems come from real study. Nothing here changes how Abide teaches — only how you look.',
    }
  }

  if (context === 'games') {
    return {
      mood: 'encourage',
      title: `${MASCOT_NAME} likes sharp minds`,
      body: 'Play to remember and understand — rewards once a day per game, practice anytime.',
    }
  }

  // home
  if (streakRisk) {
    return {
      mood: 'nudge',
      title: 'Your streak is waiting',
      body: 'A short reading or memory review keeps the flame from going out tonight.',
    }
  }
  if (goalMet) {
    return {
      mood: 'celebrate',
      title: 'Today’s quest is full',
      body: 'You met your XP goal. If you have margin, hide one more verse in your heart.',
    }
  }
  if (!user.lastReadDate) {
    return {
      mood: 'welcome',
      title: `Welcome — I’m ${MASCOT_NAME}`,
      body: 'I’ll cheer quiet faithfulness: reading, remembering, learning, and a good game of Scripture.',
    }
  }
  return {
    mood: 'encourage',
    title: 'Abide a little longer',
    body: 'Open the Path, review a due verse, or try a Bible game — one faithful step.',
  }
}
