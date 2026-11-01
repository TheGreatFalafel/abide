import { describe, expect, it } from 'vitest'
import {
  ARI_EXPRESSIONS,
  ARI_POSES,
  expressionForContext,
  mascotLineFor,
  normalizeExpression,
  normalizePose,
  poseForExpression,
  reactionForAnswer,
  streakMilestoneFrom,
} from './mascot'
import { createInitialState } from './types'

describe('Ari expressions', () => {
  it('lists every supported expression and falls back safely', () => {
    expect(ARI_EXPRESSIONS).toEqual([
      'welcome',
      'encouraging',
      'thinking',
      'celebrating',
      'proud',
      'comforting',
      'neutral',
    ])
    expect(normalizeExpression('welcome')).toBe('welcome')
    expect(normalizeExpression('celebrate')).toBe('celebrating')
    expect(normalizeExpression('nudge')).toBe('comforting')
    expect(normalizeExpression('encourage')).toBe('encouraging')
    expect(normalizeExpression('empty')).toBe('thinking')
    expect(normalizeExpression('nope')).toBe('neutral')
    expect(normalizeExpression(undefined)).toBe('neutral')
  })
})

describe('Ari poses', () => {
  it('lists poses and maps expressions to defaults', () => {
    expect(ARI_POSES).toContain('idle')
    expect(ARI_POSES).toContain('celebrate')
    expect(ARI_POSES).toContain('guide')
    expect(normalizePose('jump')).toBe('jump')
    expect(normalizePose('nope')).toBe('idle')
    expect(normalizePose(undefined)).toBe('idle')
    expect(poseForExpression('celebrating')).toBe('celebrate')
    expect(poseForExpression('thinking')).toBe('think')
    expect(poseForExpression('welcome')).toBe('guide')
    expect(poseForExpression('encouraging')).toBe('encourage')
  })

  it('mascot lines carry intentional poses for celebrate contexts', () => {
    const user = createInitialState('A', 'year')
    expect(mascotLineFor('celebrate', user, { leveledUp: true }).pose).toBe('celebrate')
    expect(mascotLineFor('celebrate', user, { streakMilestone: 7 }).pose).toBe('jump')
    expect(mascotLineFor('learn', user).pose).toBe('think')
    expect(mascotLineFor('tour', user).pose).toBe('guide')
  })
})

describe('streakMilestoneFrom', () => {
  it('prefers newly unlocked streak achievements', () => {
    expect(streakMilestoneFrom(7, ['streak_7'])).toBe(7)
    expect(streakMilestoneFrom(30, ['streak_7', 'streak_30'])).toBe(30)
    expect(streakMilestoneFrom(14, ['streak_14'])).toBe(14)
  })

  it('falls back to exact streak day when it is a milestone', () => {
    expect(streakMilestoneFrom(7, [])).toBe(7)
    expect(streakMilestoneFrom(14, [])).toBe(14)
    expect(streakMilestoneFrom(30, [])).toBe(30)
    expect(streakMilestoneFrom(8, [])).toBeUndefined()
    expect(streakMilestoneFrom(3, [])).toBeUndefined()
  })
})

describe('reactionForAnswer', () => {
  it('returns proud celebrate for correct and comforting encourage for incorrect', () => {
    const ok = reactionForAnswer(true)
    expect(ok.expression).toBe('proud')
    expect(ok.pose).toBe('celebrate')
    expect(ok.body.toLowerCase()).not.toMatch(/\+\d+\s*xp/)

    const miss = reactionForAnswer(false)
    expect(miss.expression).toBe('comforting')
    expect(miss.pose).toBe('encourage')
    expect(miss.title.toLowerCase()).toMatch(/keep/)
  })
})

describe('mascotLineFor contexts', () => {
  it('welcome / encouraging / comforting home triggers without inventing progress', () => {
    const fresh = createInitialState('A', 'year')
    const welcome = mascotLineFor('home', fresh)
    expect(welcome.mood).toBe('welcome')
    expect(welcome.body.toLowerCase()).not.toMatch(/\+\d+\s*xp|level up/)

    const active = {
      ...fresh,
      lastReadDate: '2099-01-01',
      streak: 3,
      todayXp: 0,
      todayXpDate: '2099-01-01',
    }
    // lastReadDate !== today → streak risk → comforting
    const risk = mascotLineFor('home', { ...active, lastReadDate: '2000-01-01' })
    expect(risk.mood).toBe('comforting')
    expect(risk.body.toLowerCase()).toMatch(/invitation|waiting|short/)

    const goal = mascotLineFor('home', {
      ...fresh,
      lastReadDate: fresh.todayXpDate,
      todayXp: fresh.dailyGoalXp,
      todayXpDate: fresh.todayXpDate,
    })
    expect(goal.mood).toBe('proud')
  })

  it('celebration opts distinguish level, badge, streak, and session', () => {
    const user = createInitialState('A', 'year')
    expect(mascotLineFor('celebrate', user, { leveledUp: true }).mood).toBe('celebrating')
    expect(mascotLineFor('celebrate', user, { newAchievements: 1 }).mood).toBe('proud')
    expect(mascotLineFor('celebrate', user, { streakMilestone: 7 }).mood).toBe('celebrating')
    expect(mascotLineFor('celebrate', user, { earnedXp: 12 }).body).toContain('+12 XP')
    // No false milestone without opts
    const plain = mascotLineFor('celebrate', user)
    expect(plain.title).toBe('Session complete')
    expect(plain.body).not.toMatch(/level|badge|7-day/i)
  })

  it('empty and feature contexts map to stable expressions', () => {
    const user = createInitialState('A', 'year')
    expect(mascotLineFor('empty-memory', user).mood).toBe('thinking')
    expect(mascotLineFor('empty-learn', user).mood).toBe('encouraging')
    expect(mascotLineFor('games', user).mood).toBe('encouraging')
    expect(mascotLineFor('shop', user).mood).toBe('welcome')
    expect(mascotLineFor('read', user).mood).toBe('thinking')
    expect(mascotLineFor('circle', user).mood).toBe('proud')
    expect(mascotLineFor('learn', user).mood).toBe('thinking')
    expect(mascotLineFor('tour', user).mood).toBe('welcome')
    expect(expressionForContext('games', user)).toBe('encouraging')
  })

  it('memory empty bank reuses empty-memory copy', () => {
    const user = createInitialState('A', 'year')
    expect(user.memoryVerses).toHaveLength(0)
    expect(mascotLineFor('memory', user).title).toMatch(/garden/i)
  })
})
