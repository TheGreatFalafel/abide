import { describe, expect, it } from 'vitest'
import {
  ARI_EXPRESSIONS,
  expressionForContext,
  mascotLineFor,
  normalizeExpression,
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
