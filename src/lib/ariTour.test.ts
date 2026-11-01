import { describe, expect, it } from 'vitest'
import {
  TOUR_STEPS,
  completeGuidedTour,
  mergeGuidedTour,
  migrateGuidedTour,
  shouldAutoShowTour,
} from './ariTour'
import { mergeUserStates } from './mergeState'
import { migrateUserState } from './progress'
import { createInitialState } from './types'

describe('guided tour steps', () => {
  it('covers Path, Read, Memory, Games, Circle, Learn with Back/Next-friendly order', () => {
    const ids = TOUR_STEPS.map((s) => s.id)
    expect(ids[0]).toBe('welcome')
    expect(ids).toContain('path')
    expect(ids).toContain('read')
    expect(ids).toContain('memory')
    expect(ids).toContain('games')
    expect(ids).toContain('circle')
    expect(ids).toContain('learn')
    expect(ids[ids.length - 1]).toBe('finish')
    expect(TOUR_STEPS.every((s) => s.title && s.body && s.actionHint)).toBe(true)
    // Finish points users toward reading
    expect(TOUR_STEPS.find((s) => s.id === 'finish')?.actionHint.toLowerCase()).toMatch(/read/)
  })
})

describe('guided tour persistence', () => {
  it('auto-shows for new users and not after complete/skip', () => {
    const fresh = migrateGuidedTour(undefined, { hasProgress: false })
    expect(shouldAutoShowTour(fresh)).toBe(true)
    expect(shouldAutoShowTour(completeGuidedTour(fresh))).toBe(false)
  })

  it('treats legacy progress users as already completed', () => {
    const legacy = migrateGuidedTour(undefined, { hasProgress: true })
    expect(legacy.completed).toBe(true)
    expect(shouldAutoShowTour(legacy)).toBe(false)
  })

  it('merge keeps completed if either device finished', () => {
    expect(
      mergeGuidedTour({ completed: false }, { completed: true }).completed,
    ).toBe(true)
    expect(
      mergeGuidedTour({ completed: true }, { completed: false }).completed,
    ).toBe(true)
    expect(
      mergeGuidedTour({ completed: false }, { completed: false }).completed,
    ).toBe(false)
  })

  it('migrateUserState + mergeUserStates preserve completion across devices', () => {
    const local = migrateUserState({
      ...createInitialState('Local', 'year'),
      guidedTour: { completed: true },
    })
    const cloud = migrateUserState({
      ...createInitialState('Cloud', 'year'),
      guidedTour: { completed: false },
      xp: 10,
    })
    const merged = mergeUserStates(local, cloud)
    expect(merged.guidedTour.completed).toBe(true)
    // Does not wipe cosmetics / notifications
    expect(merged.cosmetics.equipped.base).toBeTruthy()
    expect(merged.notifications).toBeTruthy()
  })

  it('missing guidedTour on brand-new migrate stays incomplete', () => {
    const raw = createInitialState('N', 'year')
    const { guidedTour: _omit, ...without } = raw
    const migrated = migrateUserState(without as typeof raw)
    expect(migrated.guidedTour.completed).toBe(false)
  })
})
