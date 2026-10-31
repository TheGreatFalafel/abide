import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  LANGUAGE_CATALOG_VERSION,
  getLanguageCourse,
  getLanguageLesson,
  isLanguageLessonUnlocked,
  listLanguageCourses,
  migrateLanguageProgress,
  mergeLanguageProgress,
  orderedLanguageLessons,
  validateLanguageCourse,
} from './index'
import { createInitialState, XP } from '../../lib/types'
import {
  addMemoryVerse,
  completeLanguageLesson,
  reviewLanguageVocab,
  reviewMemoryVerse,
} from '../../lib/progress'
import { computeEventXp } from '../../lib/progressEvents'
import { computeGemDelta } from '../../lib/gemEvents'
import { mergeUserStates } from '../../lib/mergeState'
import { dueLanguageVocab } from '../../lib/languageProgress'

beforeEach(() => {
  vi.stubGlobal('localStorage', {
    setItem: vi.fn(),
    getItem: vi.fn(),
    removeItem: vi.fn(),
  })
})

describe('language courses', () => {
  it('registers greek and hebrew with valid structure', () => {
    const courses = listLanguageCourses()
    expect(courses.map((c) => c.id)).toEqual(['greek', 'hebrew'])
    for (const course of courses) {
      expect(validateLanguageCourse(course)).toEqual([])
      expect(course.lessons.length).toBe(8)
      expect(course.alphabet.length).toBeGreaterThanOrEqual(22)
      expect(course.vocabulary.length).toBeGreaterThanOrEqual(24)
    }
    expect(getLanguageCourse('greek')?.scriptDirection).toBe('ltr')
    expect(getLanguageCourse('hebrew')?.scriptDirection).toBe('rtl')
  })

  it('handles Greek and Hebrew character data', () => {
    const greek = getLanguageCourse('greek')!
    const hebrew = getLanguageCourse('hebrew')!
    expect(greek.alphabet.some((l) => l.glyph === 'α')).toBe(true)
    expect(hebrew.alphabet.some((l) => l.finalGlyph)).toBe(true)
    const john = getLanguageLesson('greek-passage-john')
    expect(john?.lesson.exercises.some((e) => e.kind === 'passage_guide')).toBe(true)
    const gen = getLanguageLesson('hebrew-passage-genesis')
    const guide = gen?.lesson.exercises.find((e) => e.kind === 'passage_guide')
    expect(guide && guide.kind === 'passage_guide' && guide.originalSnippet.includes('בְּרֵאשִׁית')).toBe(
      true,
    )
  })

  it('unlocks lessons in order', () => {
    const course = getLanguageCourse('greek')!
    const progress = migrateLanguageProgress(undefined).greek
    const first = orderedLanguageLessons(course)[0]
    const second = orderedLanguageLessons(course)[1]
    expect(isLanguageLessonUnlocked(course, first.id, progress)).toBe(true)
    expect(isLanguageLessonUnlocked(course, second.id, progress)).toBe(false)
    progress.completedLessonIds.push(first.id)
    expect(isLanguageLessonUnlocked(course, second.id, progress)).toBe(true)
  })
})

describe('language progress and FSRS separation', () => {
  it('rejects forged lesson ids and mismatched tracks', () => {
    const state = createInitialState('Test', 'year')
    const forged = completeLanguageLesson(state, {
      track: 'greek',
      lessonId: 'not-real',
      correct: 3,
      total: 3,
      reflectionDone: true,
    })
    expect(forged.earnedXp).toBe(0)
    expect(forged.state.languages.greek.completedLessonIds).toEqual([])

    const mismatch = completeLanguageLesson(state, {
      track: 'hebrew',
      lessonId: 'greek-alphabet',
      correct: 3,
      total: 3,
      reflectionDone: true,
    })
    expect(mismatch.earnedXp).toBe(0)
  })

  it('awards once and introduces vocab without touching memoryVerses', () => {
    let state = createInitialState('Test', 'year')
    const beforeMem = state.memoryVerses.length
    const first = completeLanguageLesson(state, {
      track: 'greek',
      lessonId: 'greek-alphabet',
      correct: 4,
      total: 4,
      reflectionDone: true,
    })
    expect(first.earnedXp).toBeGreaterThan(0)
    expect(first.state.achievements).toContain('greek_first')
    expect(first.state.memoryVerses.length).toBe(beforeMem)

    state = first.state
    const again = completeLanguageLesson(state, {
      track: 'greek',
      lessonId: 'greek-alphabet',
      correct: 1,
      total: 4,
      reflectionDone: true,
    })
    expect(again.earnedXp).toBe(0)
    expect(again.state.xp).toBe(state.xp)
    expect(again.state.languages.greek.lessonScores['greek-alphabet'].correct).toBe(4)
  })

  it('keeps language vocab FSRS separate from Scripture memory FSRS', () => {
    let state = createInitialState('Test', 'year')
    state = completeLanguageLesson(state, {
      track: 'greek',
      lessonId: 'greek-reading-words',
      correct: 3,
      total: 3,
      reflectionDone: true,
    }).state
    // force first lesson done so reading-words unlocks in real flow — complete alphabet first
    state = createInitialState('Test', 'year')
    state = completeLanguageLesson(state, {
      track: 'greek',
      lessonId: 'greek-alphabet',
      correct: 3,
      total: 3,
      reflectionDone: true,
    }).state
    state = completeLanguageLesson(state, {
      track: 'greek',
      lessonId: 'greek-reading-words',
      correct: 3,
      total: 3,
      reflectionDone: true,
    }).state

    expect(state.languages.greek.vocabCards.length).toBeGreaterThan(0)
    expect(state.memoryVerses.length).toBe(0)

    const card = state.languages.greek.vocabCards[0]
    const reviewed = reviewLanguageVocab(state, {
      track: 'greek',
      cardId: card.id,
      grade: 'good',
    })
    expect(reviewed.state.languages.greek.vocabCards[0].fsrs.reps).toBeGreaterThan(0)
    expect(reviewed.state.memoryVerses.length).toBe(0)

    const withMem = addMemoryVerse(reviewed.state, {
      reference: 'John 3:16',
      text: 'For God so loved the world',
      bookName: 'John',
      bookId: 'john',
      chapter: 3,
      verseStart: 16,
      verseEnd: 16,
      translationId: 'web',
    }).state
    const memId = withMem.memoryVerses[0].id
    const memReview = reviewMemoryVerse(withMem, memId, 'good', {
      applySchedule: true,
      source: 'practice',
    })
    expect(memReview.state.memoryVerses[0].fsrs.reps).toBeGreaterThan(0)
    expect(memReview.state.languages.greek.vocabCards[0].id).toBe(card.id)
  })

  it('merges language progress across devices', () => {
    const local = createInitialState('A', 'year')
    local.languages.greek.completedLessonIds = ['greek-alphabet']
    const cloud = createInitialState('A', 'year')
    cloud.languages.hebrew.completedLessonIds = ['hebrew-consonants']
    const merged = mergeUserStates(local, cloud)
    expect(merged.languages.greek.completedLessonIds).toContain('greek-alphabet')
    expect(merged.languages.hebrew.completedLessonIds).toContain('hebrew-consonants')
    expect(migrateLanguageProgress({ catalogVersion: 0 }).catalogVersion).toBe(
      LANGUAGE_CATALOG_VERSION,
    )
  })

  it('computes language XP/gems with idempotency flags', () => {
    expect(
      computeEventXp('language_lesson', {
        reflection: true,
        correct: 4,
        total: 4,
        alreadyCompleted: false,
      }),
    ).toBe(XP.languageLesson + XP.languageLessonQuizBonus)
    expect(
      computeEventXp('language_lesson', { reflection: true, alreadyCompleted: true, total: 4 }),
    ).toBe(0)
    expect(computeEventXp('language_vocab_review', { applySchedule: true, grade: 'good' })).toBe(
      XP.languageVocabReview,
    )
    expect(computeGemDelta('gem_language_lesson', { alreadyCompleted: false, reflection: true })).toBeGreaterThan(
      0,
    )
    expect(computeGemDelta('gem_language_lesson', { alreadyCompleted: true, reflection: true })).toBe(0)
  })

  it('reports due language vocab from the language deck only', () => {
    const state = createInitialState('Test', 'year')
    expect(dueLanguageVocab(state, 'greek')).toEqual([])
  })
})
