import { beforeEach, describe, expect, it, vi } from 'vitest'

beforeEach(() => {
  vi.stubGlobal('localStorage', {
    setItem: vi.fn(),
    getItem: vi.fn(),
    removeItem: vi.fn(),
  })
})
import { getCurriculumLesson } from '../../data/curriculum'
import { getLanguageLesson } from '../../data/languages'
import { createInitialState } from '../types'
import {
  ALPHABET_PRACTICE_ROUNDS,
  CURRICULUM_PRACTICE_CAP,
  compileCurriculumBiteLesson,
  compileLanguageBiteLesson,
  makeDraft,
  migrateBiteDraft,
  readCurriculumDraft,
  readLanguageDraft,
  resolveCurriculumBiteLesson,
  resolveLanguageBiteLesson,
  withCurriculumDraft,
  withLanguageDraft,
} from './index'

describe('bite-sized compilers', () => {
  it('compiles scripture-inspiration into a full instructional sequence', () => {
    const found = getCurriculumLesson('scripture-inspiration')
    expect(found).toBeTruthy()
    const bite = compileCurriculumBiteLesson(found!.topic, found!.lesson)
    expect(bite.lessonId).toBe('scripture-inspiration')
    expect(bite.subject).toBe('curriculum')
    expect(bite.steps[0]?.kind).toBe('intro')
    expect(bite.steps.some((s) => s.kind === 'teach')).toBe(true)
    expect(bite.steps.some((s) => s.kind === 'scripture')).toBe(true)
    expect(bite.steps.some((s) => s.kind === 'practice')).toBe(true)
    expect(bite.steps.some((s) => s.kind === 'application')).toBe(true)
    expect(bite.steps.some((s) => s.kind === 'deeper')).toBe(true)
    expect(bite.steps.some((s) => s.kind === 'review')).toBe(true)
    const practice = bite.steps.filter((s) => s.kind === 'practice')
    expect(practice.length).toBeGreaterThan(0)
    expect(practice.length).toBeLessThanOrEqual(CURRICULUM_PRACTICE_CAP)
    expect(practice.every((s) => s.exercise?.kind === 'mc' || s.exercise?.kind === 'true_false')).toBe(
      true,
    )
  })

  it('compiles greek-alphabet with capped alphabet rounds', () => {
    const found = getLanguageLesson('greek-alphabet')
    expect(found).toBeTruthy()
    const bite = compileLanguageBiteLesson(found!.course, found!.lesson)
    expect(bite.track).toBe('greek')
    expect(bite.steps[0]?.kind).toBe('intro')
    const alpha = bite.steps.filter((s) => s.id.startsWith('l-alpha-'))
    expect(alpha.length).toBeGreaterThan(0)
    expect(alpha.length).toBeLessThanOrEqual(ALPHABET_PRACTICE_ROUNDS)
    expect(alpha.every((s) => s.exercise?.kind === 'match')).toBe(true)
    expect(bite.steps.some((s) => s.kind === 'review')).toBe(true)
  })

  it('compiles hebrew-consonants with RTL flags on alphabet practice', () => {
    const found = getLanguageLesson('hebrew-consonants')
    expect(found).toBeTruthy()
    const bite = compileLanguageBiteLesson(found!.course, found!.lesson)
    expect(bite.track).toBe('hebrew')
    const alpha = bite.steps.filter((s) => s.exercise?.kind === 'match')
    expect(alpha.length).toBeGreaterThan(0)
    expect(alpha.every((s) => s.rtl === true)).toBe(true)
    const guide = bite.steps.find((s) => s.exercise?.kind === 'passage_guide')
    if (guide?.exercise?.kind === 'passage_guide') {
      expect(guide.exercise.rtl).toBe(true)
    }
  })

  it('resolve helpers return the three representative lessons', () => {
    expect(resolveCurriculumBiteLesson('scripture-inspiration')?.title).toContain('Inspiration')
    expect(resolveLanguageBiteLesson('greek', 'greek-alphabet')?.lessonId).toBe('greek-alphabet')
    expect(resolveLanguageBiteLesson('hebrew', 'hebrew-consonants')?.lessonId).toBe(
      'hebrew-consonants',
    )
    expect(resolveLanguageBiteLesson('greek', 'hebrew-consonants')).toBeNull()
  })

  it('compiles Early Church Nicaea lesson with primary sources and timeline practice', () => {
    const found = getCurriculumLesson('early-nicaea-arian')
    expect(found).toBeTruthy()
    expect(found!.topic.domain).toBe('church-history')
    const bite = compileCurriculumBiteLesson(found!.topic, found!.lesson)
    expect(bite.domain).toBe('church-history')
    expect(bite.steps.some((s) => s.primarySource?.work.includes('Nicene'))).toBe(true)
    expect(bite.steps.some((s) => s.exercise?.kind === 'order')).toBe(true)
    expect(bite.steps.some((s) => s.distinctionLabels?.biblical)).toBe(true)
    const practice = bite.steps.filter((s) => s.kind === 'practice')
    expect(practice.length).toBeGreaterThan(0)
    expect(practice.length).toBeLessThanOrEqual(CURRICULUM_PRACTICE_CAP)
  })

  it('compiles evangelism conversation practice for sharing-your-faith', () => {
    const found = getCurriculumLesson('share-listening-and-conversations')
    expect(found).toBeTruthy()
    expect(found!.topic.domain).toBe('evangelism-apologetics')
    const bite = compileCurriculumBiteLesson(found!.topic, found!.lesson)
    expect(bite.domain).toBe('evangelism-apologetics')
    const convo = bite.steps.find((s) => s.exercise?.kind === 'conversation')
    expect(convo?.exercise?.kind).toBe('conversation')
    if (convo?.exercise?.kind === 'conversation') {
      expect(convo.exercise.steps.length).toBeGreaterThan(0)
      expect(convo.exercise.steps[0]?.choices.some((c) => c.quality === 'helpful')).toBe(true)
      expect(convo.exercise.steps[0]?.choices.some((c) => c.quality === 'hostile')).toBe(true)
    }
  })

  it('compiles Understanding Islam conversations and Quran source stubs', () => {
    const engage = getCurriculumLesson('is-engage-objections')
    expect(engage).toBeTruthy()
    const bite = compileCurriculumBiteLesson(engage!.topic, engage!.lesson)
    expect(bite.domain).toBe('evangelism-apologetics')
    const convo = bite.steps.find((s) => s.exercise?.kind === 'conversation')
    expect(convo?.exercise?.kind).toBe('conversation')
    if (convo?.exercise?.kind === 'conversation') {
      expect(convo.exercise.partnerName).toBe('Amir')
      expect(convo.exercise.steps[0]?.choices.some((c) => c.quality === 'helpful')).toBe(true)
      expect(convo.exercise.steps[0]?.choices.some((c) => c.quality === 'hostile')).toBe(true)
      expect(convo.exercise.steps.length).toBe(2)
    }

    const origins = getCurriculumLesson('is-origins-pillars')
    const sourceBite = compileCurriculumBiteLesson(origins!.topic, origins!.lesson)
    expect(
      sourceBite.steps.some((s) => s.primarySource?.authorOrBody.includes('Quran')),
    ).toBe(true)
  })

  it('compiles Christian Apologetics conversations and primary sources', () => {
    const evil = getCurriculumLesson('apologetics-problem-of-evil')
    expect(evil).toBeTruthy()
    const bite = compileCurriculumBiteLesson(evil!.topic, evil!.lesson)
    expect(bite.domain).toBe('evangelism-apologetics')
    expect(bite.steps.some((s) => s.primarySource?.authorOrBody === 'David Hume')).toBe(true)
    const convo = bite.steps.find((s) => s.exercise?.kind === 'conversation')
    expect(convo?.exercise?.kind).toBe('conversation')
    if (convo?.exercise?.kind === 'conversation') {
      expect(convo.exercise.partnerName).toBe('Sam')
      expect(convo.exercise.steps.length).toBe(2)
      expect(
        convo.exercise.steps.every((step) =>
          step.choices.some((c) => c.quality === 'helpful'),
        ),
      ).toBe(true)
    }

    const god = getCurriculumLesson('apologetics-god-exists')
    const godBite = compileCurriculumBiteLesson(god!.topic, god!.lesson)
    expect(godBite.steps.length).toBeGreaterThan(8)
  })
})

describe('bite-sized draft resume', () => {
  it('migrates and reads curriculum drafts', () => {
    const draft = makeDraft({
      lessonId: 'scripture-inspiration',
      subject: 'curriculum',
      stepIndex: 3,
      correct: 1,
      total: 2,
    })
    let user = withCurriculumDraft(createInitialState('Tester', 'gospel-john'), draft)
    expect(readCurriculumDraft(user, 'scripture-inspiration')?.stepIndex).toBe(3)
    expect(readCurriculumDraft(user, 'other')).toBeNull()

    const migrated = migrateBiteDraft({
      lessonId: 'scripture-inspiration',
      subject: 'curriculum',
      stepIndex: 2.7,
      correct: -1,
      total: 4,
    })
    expect(migrated?.stepIndex).toBe(2)
    expect(migrated?.correct).toBe(0)

    user = withCurriculumDraft(user, null)
    expect(readCurriculumDraft(user, 'scripture-inspiration')).toBeNull()
  })

  it('migrates and reads language drafts per track', () => {
    const draft = makeDraft({
      lessonId: 'greek-alphabet',
      subject: 'language',
      track: 'greek',
      stepIndex: 5,
      correct: 3,
      total: 4,
    })
    const user = withLanguageDraft(createInitialState('Tester', 'gospel-john'), 'greek', draft)
    expect(readLanguageDraft(user, 'greek', 'greek-alphabet')?.correct).toBe(3)
    expect(readLanguageDraft(user, 'hebrew', 'greek-alphabet')).toBeNull()
  })
})

describe('duplicate reward prevention (completion clears draft)', () => {
  it('completeCurriculumLesson clears draft and does not double XP', async () => {
    const { completeCurriculumLesson } = await import('../progress')
    const found = getCurriculumLesson('scripture-inspiration')!
    let state = withCurriculumDraft(
      createInitialState('Tester', 'gospel-john'),
      makeDraft({
        lessonId: 'scripture-inspiration',
        subject: 'curriculum',
        stepIndex: 4,
        correct: 2,
        total: 3,
      }),
    )
    const first = completeCurriculumLesson(state, {
      topicId: found.topic.id,
      lessonId: 'scripture-inspiration',
      correctMc: 4,
      totalMc: 5,
      reflectionDone: true,
    })
    expect(first.earnedXp).toBeGreaterThan(0)
    expect(first.state.curriculum.draft).toBeNull()
    expect(first.state.curriculum.completedLessonIds).toContain('scripture-inspiration')

    const second = completeCurriculumLesson(first.state, {
      topicId: found.topic.id,
      lessonId: 'scripture-inspiration',
      correctMc: 5,
      totalMc: 5,
      reflectionDone: true,
    })
    expect(second.earnedXp).toBe(0)
    expect(second.state.xp).toBe(first.state.xp)
  })

  it('completeLanguageLesson clears draft and does not double XP', async () => {
    const { completeLanguageLesson } = await import('../progress')
    let state = withLanguageDraft(
      createInitialState('Tester', 'gospel-john'),
      'greek',
      makeDraft({
        lessonId: 'greek-alphabet',
        subject: 'language',
        track: 'greek',
        stepIndex: 2,
        correct: 1,
        total: 1,
      }),
    )
    const first = completeLanguageLesson(state, {
      track: 'greek',
      lessonId: 'greek-alphabet',
      correct: 5,
      total: 6,
      reflectionDone: true,
    })
    expect(first.earnedXp).toBeGreaterThan(0)
    expect(first.state.languages.greek.draft).toBeNull()

    const second = completeLanguageLesson(first.state, {
      track: 'greek',
      lessonId: 'greek-alphabet',
      correct: 6,
      total: 6,
      reflectionDone: true,
    })
    expect(second.earnedXp).toBe(0)
    expect(second.state.xp).toBe(first.state.xp)
  })
})
