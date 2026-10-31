import { beforeEach, describe, expect, it, vi } from 'vitest'
import { addMemoryVerse, completeMemoryQuest, scoreMemoryQuiz } from './progress'
import { XP, createInitialState, todayKey } from './types'

const NOW = new Date(`${todayKey()}T15:00:00.000Z`)

beforeEach(() => {
  vi.stubGlobal('localStorage', {
    setItem: vi.fn(),
    getItem: vi.fn(),
    removeItem: vi.fn(),
  })
})

describe('completeMemoryQuest', () => {
  it('awards less than a full lesson and continues the streak', () => {
    let state = createInitialState('Test', 'plan')
    state = addMemoryVerse(
      state,
      {
        reference: 'Isaiah 53:5',
        text: 'But he was pierced for our transgressions.',
        bookName: 'Isaiah',
        bookId: 'isaiah',
        chapter: 53,
        verseStart: 5,
        verseEnd: 5,
        translationId: 'esv',
      },
      NOW,
    ).state
    const id = state.memoryVerses[0].id
    const rounds = Array.from({ length: 5 }, () => ({
      verseId: id,
      correct: true,
    }))

    const result = completeMemoryQuest(state, { rounds, now: NOW })

    // Only first correct answer for the verse gets per-correct XP (duplicate prevention)
    expect(result.earnedXp).toBe(XP.memoryQuestCorrect + XP.memoryQuest)
    expect(result.earnedXp).toBeLessThan(XP.lesson)
    expect(result.state.streak).toBe(1)
    expect(result.state.lastReadDate).toBe(todayKey(NOW))
  })

  it('still gives completion XP and streak credit without a correct answer', () => {
    let state = createInitialState('Test', 'plan')
    state = addMemoryVerse(
      state,
      {
        reference: 'Isaiah 53:5',
        text: 'But he was pierced for our transgressions.',
        bookName: 'Isaiah',
        bookId: 'isaiah',
        chapter: 53,
        verseStart: 5,
        verseEnd: 5,
        translationId: 'esv',
      },
      NOW,
    ).state

    const result = completeMemoryQuest(state, {
      now: NOW,
      rounds: [{ verseId: state.memoryVerses[0].id, correct: false }],
    })

    expect(result.earnedXp).toBe(XP.memoryQuest)
    expect(result.state.streak).toBe(1)
  })
})

describe('scoreMemoryQuiz', () => {
  it('awards a small amount of XP and continues the streak', () => {
    const state = createInitialState('Test', 'plan')

    const result = scoreMemoryQuiz(state, true, { now: NOW, updateSchedule: false })

    expect(result.earnedXp).toBe(XP.memoryQuiz)
    expect(result.earnedXp).toBeLessThan(XP.lesson)
    expect(result.state.streak).toBe(1)
    expect(result.state.lastReadDate).toBe(todayKey(NOW))
  })
})
