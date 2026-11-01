import { beforeEach, describe, expect, it, vi } from 'vitest'

beforeEach(() => {
  vi.stubGlobal('localStorage', {
    setItem: vi.fn(),
    getItem: vi.fn(),
    removeItem: vi.fn(),
  })
})
import {
  CURRICULUM_CATALOG_VERSION,
  assembleCurriculumQuestions,
  curriculumPrimaryPassagesReady,
  getCurriculumLesson,
  isLessonUnlocked,
  isTopicFullyComplete,
  isTopicUnlocked,
  curriculumTopicsById,
  listCurriculumTopics,
  listCurriculumTopicsByDomain,
  migrateCurriculumProgress,
  mergeCurriculumProgress,
  nextLessonId,
  orderedLessons,
  resumeLessonId,
  validateCurriculumTopic,
  validatePassageRef,
} from './index'
import { emptyCurriculumProgress, type CurriculumTopic } from './types'
import { createInitialState } from '../../lib/types'
import {
  completeCurriculumLesson,
  isCurriculumScoreBetter,
  migrateUserState,
} from '../../lib/progress'
import { mergeUserStates } from '../../lib/mergeState'
import { computeEventXp } from '../../lib/progressEvents'
import { XP } from '../../lib/types'

describe('curriculum catalog', () => {
  it('splits theology, church-history, and evangelism domains', () => {
    const theology = listCurriculumTopicsByDomain('theology')
    const history = listCurriculumTopicsByDomain('church-history')
    const witness = listCurriculumTopicsByDomain('evangelism-apologetics')
    expect(theology.every((t) => (t.domain ?? 'theology') === 'theology')).toBe(true)
    expect(history.map((t) => t.id)).toEqual(['early-church'])
    expect(witness.length).toBe(5)
    expect(theology.length + history.length + witness.length).toBe(listCurriculumTopics().length)
  })

  it('publishes theology, Early Church, and evangelism topics', () => {
    const topics = listCurriculumTopics()
    expect(topics.map((t) => t.id)).toEqual([
      'doctrine-of-scripture',
      'doctrine-of-god',
      'nature-of-man',
      'doctrine-of-christ',
      'doctrine-of-salvation',
      'doctrine-of-church',
      'doctrine-of-last-things',
      'early-church',
      'gospel-foundations',
      'christian-apologetics',
      'sharing-your-faith',
      'worldview-atheism',
      'understanding-islam',
    ])
    for (const topic of topics) {
      expect(validateCurriculumTopic(topic)).toEqual([])
      expect(topic.lessons.length).toBeGreaterThanOrEqual(3)
      expect(topic.lessons.length).toBeLessThanOrEqual(10)
    }
    const early = topics.find((t) => t.id === 'early-church')!
    expect(early.domain).toBe('church-history')
    expect(early.era).toBe('early')
    expect(early.lessons.some((l) => l.content.some((b) => b.kind === 'primary_source'))).toBe(
      true,
    )
    expect(early.lessons.some((l) => (l.interactiveExercises?.length ?? 0) > 0)).toBe(true)

    const witness = listCurriculumTopicsByDomain('evangelism-apologetics')
    expect(witness.map((t) => t.id)).toEqual([
      'gospel-foundations',
      'christian-apologetics',
      'sharing-your-faith',
      'worldview-atheism',
      'understanding-islam',
    ])
    expect(
      witness.some((t) =>
        t.lessons.some((l) =>
          l.interactiveExercises?.some((ex) => ex.kind === 'conversation'),
        ),
      ),
    ).toBe(true)
  })

  it('registers Understanding Islam with ten sections, sources, and conversations', () => {
    const topic = listCurriculumTopics().find((t) => t.id === 'understanding-islam')
    expect(topic).toBeTruthy()
    expect(topic!.domain).toBe('evangelism-apologetics')
    expect(topic!.prerequisites).toEqual(['gospel-foundations'])
    expect(orderedLessons(topic!).map((l) => l.id)).toEqual([
      'islam-introduction-origins',
      'islam-quran-sources',
      'islam-allah-monotheism',
      'islam-jesus',
      'islam-salvation-afterlife',
      'islam-five-pillars',
      'islam-differences-christianity',
      'islam-diversity-sunni-shia',
      'islam-common-questions',
      'islam-sharing-gospel',
    ])
    expect(topic!.lessons.some((l) => l.content.some((b) => b.kind === 'primary_source'))).toBe(
      true,
    )
    const convoLessons = topic!.lessons.filter((l) =>
      l.interactiveExercises?.some((ex) => ex.kind === 'conversation'),
    )
    expect(convoLessons.map((l) => l.id)).toEqual([
      'islam-jesus',
      'islam-differences-christianity',
      'islam-common-questions',
      'islam-sharing-gospel',
    ])
    const byId = curriculumTopicsById()
    expect(isTopicUnlocked(topic!, emptyCurriculumProgress(), byId)).toBe(false)
    const afterGospel = emptyCurriculumProgress()
    afterGospel.completedLessonIds = orderedLessons(
      listCurriculumTopics().find((t) => t.id === 'gospel-foundations')!,
    ).map((l) => l.id)
    expect(isTopicUnlocked(topic!, afterGospel, byId)).toBe(true)
  })

  it('registers Christian Apologetics with eight sections and conversations', () => {
    const topic = listCurriculumTopics().find((t) => t.id === 'christian-apologetics')
    expect(topic).toBeTruthy()
    expect(topic!.domain).toBe('evangelism-apologetics')
    expect(topic!.prerequisites).toEqual(['gospel-foundations'])
    expect(orderedLessons(topic!).map((l) => l.id)).toEqual([
      'apologetics-god-exists',
      'apologetics-trust-bible',
      'apologetics-resurrection',
      'apologetics-problem-of-evil',
      'apologetics-science-faith',
      'apologetics-morality-dignity',
      'apologetics-exclusivity',
      'apologetics-difficult-objections',
    ])
    expect(topic!.lessons.some((l) => l.content.some((b) => b.kind === 'primary_source'))).toBe(
      true,
    )
    const convoLessons = topic!.lessons.filter((l) =>
      l.interactiveExercises?.some((ex) => ex.kind === 'conversation'),
    )
    expect(convoLessons.map((l) => l.id)).toEqual([
      'apologetics-problem-of-evil',
      'apologetics-exclusivity',
      'apologetics-difficult-objections',
    ])
    const byId = curriculumTopicsById()
    expect(isTopicUnlocked(topic!, emptyCurriculumProgress(), byId)).toBe(false)
    const afterGospel = emptyCurriculumProgress()
    afterGospel.completedLessonIds = orderedLessons(
      listCurriculumTopics().find((t) => t.id === 'gospel-foundations')!,
    ).map((l) => l.id)
    expect(isTopicUnlocked(topic!, afterGospel, byId)).toBe(true)
  })

  it('keeps Nature of Man lessons ordered with stable ids', () => {
    const topic = listCurriculumTopics().find((t) => t.id === 'nature-of-man')
    expect(topic).toBeTruthy()
    const lessons = orderedLessons(topic!)
    expect(lessons.map((l) => l.order)).toEqual([1, 2, 3, 4, 5])
    expect(lessons[0].id).toBe('nature-of-man-image')
    expect(getCurriculumLesson('nature-of-man-sin')?.topic.id).toBe('nature-of-man')
  })

  it('enforces light topic prerequisites without locking Nature of Man', () => {
    const byId = new Map(listCurriculumTopics().map((t) => [t.id, t]))
    const progress = emptyCurriculumProgress()
    expect(isTopicUnlocked(byId.get('doctrine-of-scripture')!, progress, byId)).toBe(true)
    expect(isTopicUnlocked(byId.get('nature-of-man')!, progress, byId)).toBe(true)
    expect(isTopicUnlocked(byId.get('doctrine-of-god')!, progress, byId)).toBe(false)
    progress.completedLessonIds = orderedLessons(byId.get('doctrine-of-scripture')!).map(
      (l) => l.id,
    )
    expect(isTopicUnlocked(byId.get('doctrine-of-god')!, progress, byId)).toBe(true)
  })

  it('enforces in-topic lesson prerequisites via ordering', () => {
    const topic = listCurriculumTopics()[0]
    const progress = emptyCurriculumProgress()
    expect(isLessonUnlocked(topic, topic.lessons[0].id, progress)).toBe(true)
    const second = orderedLessons(topic)[1]
    expect(isLessonUnlocked(topic, second.id, progress)).toBe(false)
    progress.completedLessonIds.push(orderedLessons(topic)[0].id)
    expect(isLessonUnlocked(topic, second.id, progress)).toBe(true)
  })

  it('preserves completions across catalog version bumps', () => {
    const raw = {
      catalogVersion: 0,
      completedLessonIds: ['nature-of-man-image'],
      lastLessonId: 'nature-of-man-image',
      lessonScores: {
        'nature-of-man-image': {
          correctMc: 3,
          totalMc: 3,
          completedAt: '2026-01-01T00:00:00.000Z',
        },
      },
    }
    const migrated = migrateCurriculumProgress(raw)
    expect(migrated.catalogVersion).toBe(CURRICULUM_CATALOG_VERSION)
    expect(migrated.completedLessonIds).toEqual(['nature-of-man-image'])
  })

  it('merges curriculum progress without dropping either side', () => {
    const a = migrateCurriculumProgress({
      completedLessonIds: ['nature-of-man-image'],
      lastLessonId: 'nature-of-man-image',
    })
    const b = migrateCurriculumProgress({
      completedLessonIds: ['nature-of-man-body-soul'],
      lastLessonId: 'nature-of-man-body-soul',
    })
    const merged = mergeCurriculumProgress(a, b)
    expect(merged.completedLessonIds.sort()).toEqual(
      ['nature-of-man-body-soul', 'nature-of-man-image'].sort(),
    )
  })
})

describe('passage and topic validation', () => {
  it('rejects unknown bookIds and out-of-range chapters', () => {
    expect(
      validatePassageRef(
        { bookId: 'not-a-book', bookName: 'Nope', chapter: 1 },
        'p',
      ).some((e) => e.includes('unknown bookId')),
    ).toBe(true)
    expect(
      validatePassageRef(
        { bookId: 'jude', bookName: 'Jude', chapter: 9 },
        'p',
      ).some((e) => e.includes('exceeds')),
    ).toBe(true)
    expect(
      validatePassageRef(
        { bookId: 'genesis', bookName: 'Genesis', chapter: 1, verseStart: 1, verseEnd: 3 },
        'p',
      ),
    ).toEqual([])
  })

  it('requires a distinction block on lessons', () => {
    const topic = structuredClone(listCurriculumTopics()[0]) as CurriculumTopic
    topic.lessons[0].content = topic.lessons[0].content.filter((b) => b.kind !== 'distinction')
    const errors = validateCurriculumTopic(topic)
    expect(errors.some((e) => e.includes('distinction'))).toBe(true)
  })
})

describe('offline Scripture gate', () => {
  it('blocks when a required primary passage is missing and allows when cached', () => {
    const a = { verses: [{ number: 1, text: 'In the beginning…' }] }
    const b = { verses: [{ number: 6, text: 'Whoever sheds…' }] }
    expect(curriculumPrimaryPassagesReady(2, [null, null], false)).toBe(false)
    expect(curriculumPrimaryPassagesReady(2, [a, null], false)).toBe(false)
    expect(curriculumPrimaryPassagesReady(2, [a, b], false)).toBe(true)
    expect(curriculumPrimaryPassagesReady(1, [a], true)).toBe(false)
  })
})

describe('spaced review quiz assembly', () => {
  it('appends prior-lesson questions with stable ids and skips duplicates', () => {
    const topic = listCurriculumTopics().find((t) => t.id === 'nature-of-man')!
    const lesson = orderedLessons(topic).find((l) => l.id === 'nature-of-man-composition')!
    expect(lesson.reviewFromLessonIds?.length).toBeGreaterThan(0)

    const assembled = assembleCurriculumQuestions(topic, lesson)
    const ids = assembled.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)

    for (const q of lesson.questions) {
      expect(ids).toContain(q.id)
    }
    const image = topic.lessons.find((l) => l.id === 'nature-of-man-image')!
    for (const q of image.questions) {
      expect(ids).toContain(q.id)
    }
    expect(assembled.length).toBeGreaterThan(lesson.questions.length)
  })

  it('does not duplicate when a review question id already appears in the lesson', () => {
    const topic = structuredClone(listCurriculumTopics()[0]) as CurriculumTopic
    const lesson = orderedLessons(topic)[1]
    const prior = orderedLessons(topic)[0]
    const shared = prior.questions[0]
    lesson.questions = [shared, ...lesson.questions]
    lesson.reviewFromLessonIds = [prior.id]
    const assembled = assembleCurriculumQuestions(topic, lesson)
    expect(assembled.filter((q) => q.id === shared.id)).toHaveLength(1)
  })
})

describe('curriculum progress completion', () => {
  it('rejects forged lesson ids and mismatched topic ids', () => {
    const state = createInitialState('Test', 'year')
    const forged = completeCurriculumLesson(state, {
      topicId: 'nature-of-man',
      lessonId: 'forged-lesson-id',
      correctMc: 5,
      totalMc: 5,
      reflectionDone: true,
    })
    expect(forged.earnedXp).toBe(0)
    expect(forged.state.curriculum.completedLessonIds).toEqual([])
    expect(forged.state.xp).toBe(state.xp)

    const mismatch = completeCurriculumLesson(state, {
      topicId: 'some-other-topic',
      lessonId: 'nature-of-man-image',
      correctMc: 3,
      totalMc: 3,
      reflectionDone: true,
    })
    expect(mismatch.earnedXp).toBe(0)
    expect(mismatch.state.curriculum.completedLessonIds).toEqual([])
  })

  it('awards XP only with quiz + reflection, not on empty completion', () => {
    const state = createInitialState('Test', 'year')
    const denied = completeCurriculumLesson(state, {
      topicId: 'nature-of-man',
      lessonId: 'nature-of-man-image',
      correctMc: 3,
      totalMc: 3,
      reflectionDone: false,
    })
    expect(denied.earnedXp).toBe(0)
    expect(denied.state.curriculum.completedLessonIds).toEqual([])

    const ok = completeCurriculumLesson(state, {
      topicId: 'nature-of-man',
      lessonId: 'nature-of-man-image',
      correctMc: 3,
      totalMc: 3,
      reflectionDone: true,
    })
    expect(ok.earnedXp).toBe(
      XP.curriculumLesson + XP.curriculumReflection + XP.curriculumQuizBonus,
    )
    expect(ok.state.curriculum.completedLessonIds).toContain('nature-of-man-image')
    expect(ok.state.completedDays).toEqual([])
  })

  it('does not re-award XP when reopening a completed lesson', () => {
    let state = createInitialState('Test', 'year')
    state = completeCurriculumLesson(state, {
      topicId: 'nature-of-man',
      lessonId: 'nature-of-man-image',
      correctMc: 2,
      totalMc: 3,
      reflectionDone: true,
    }).state
    const xp = state.xp
    const again = completeCurriculumLesson(state, {
      topicId: 'nature-of-man',
      lessonId: 'nature-of-man-image',
      correctMc: 3,
      totalMc: 3,
      reflectionDone: true,
    })
    expect(again.earnedXp).toBe(0)
    expect(again.state.xp).toBe(xp)
  })

  it('preserves a better score on a worse replay and upgrades on a better replay', () => {
    let state = createInitialState('Test', 'year')
    state = completeCurriculumLesson(state, {
      topicId: 'nature-of-man',
      lessonId: 'nature-of-man-image',
      correctMc: 3,
      totalMc: 3,
      reflectionDone: true,
    }).state
    expect(state.curriculum.lessonScores['nature-of-man-image'].correctMc).toBe(3)

    state = completeCurriculumLesson(state, {
      topicId: 'nature-of-man',
      lessonId: 'nature-of-man-image',
      correctMc: 1,
      totalMc: 3,
      reflectionDone: true,
    }).state
    expect(state.curriculum.lessonScores['nature-of-man-image'].correctMc).toBe(3)

    // Start from a weaker first score, then improve
    let weak = createInitialState('Weak', 'year')
    weak = completeCurriculumLesson(weak, {
      topicId: 'nature-of-man',
      lessonId: 'nature-of-man-image',
      correctMc: 1,
      totalMc: 3,
      reflectionDone: true,
    }).state
    weak = completeCurriculumLesson(weak, {
      topicId: 'nature-of-man',
      lessonId: 'nature-of-man-image',
      correctMc: 3,
      totalMc: 3,
      reflectionDone: true,
    }).state
    expect(weak.curriculum.lessonScores['nature-of-man-image'].correctMc).toBe(3)
    expect(isCurriculumScoreBetter({ correctMc: 3, totalMc: 3 }, { correctMc: 1, totalMc: 3 })).toBe(
      true,
    )
  })

  it('unlocks curriculum_topic when any topic is fully complete', () => {
    const stub: CurriculumTopic = {
      id: 'stub-topic',
      title: 'Stub',
      description: 'Test only',
      objectives: ['x'],
      estimatedMinutes: 10,
      prerequisites: [],
      framework: 'reformed',
      sources: [],
      version: 1,
      lessons: [
        { id: 'stub-l1' } as CurriculumTopic['lessons'][0],
        { id: 'stub-l2' } as CurriculumTopic['lessons'][0],
      ],
    }
    expect(isTopicFullyComplete(stub, ['stub-l1'])).toBe(false)
    expect(isTopicFullyComplete(stub, ['stub-l1', 'stub-l2'])).toBe(true)

    let state = createInitialState('Test', 'year')
    const topic = listCurriculumTopics().find((t) => t.id === 'nature-of-man')!
    for (const lesson of orderedLessons(topic)) {
      state = completeCurriculumLesson(state, {
        topicId: topic.id,
        lessonId: lesson.id,
        correctMc: 3,
        totalMc: 3,
        reflectionDone: true,
      }).state
    }
    expect(isTopicFullyComplete(topic, state.curriculum.completedLessonIds)).toBe(true)
    expect(state.achievements).toContain('curriculum_topic')
    expect(state.achievements).toContain('curriculum_first')
  })

  it('advances nextLessonId after completion', () => {
    const topic = listCurriculumTopics()[0]
    let progress = emptyCurriculumProgress()
    expect(nextLessonId(topic, progress)).toBe(orderedLessons(topic)[0].id)
    progress = {
      ...progress,
      completedLessonIds: [orderedLessons(topic)[0].id],
      lastLessonId: orderedLessons(topic)[0].id,
    }
    expect(nextLessonId(topic, progress)).toBe(orderedLessons(topic)[1].id)
    expect(resumeLessonId(topic, progress)).toBe(orderedLessons(topic)[1].id)
  })

  it('migrates legacy users without curriculum field', () => {
    const raw = {
      name: 'Legacy',
      planId: 'year',
      completedDays: [1],
      xp: 40,
    }
    const next = migrateUserState(raw as Parameters<typeof migrateUserState>[0])
    expect(next.curriculum.completedLessonIds).toEqual([])
    expect(next.curriculum.catalogVersion).toBe(CURRICULUM_CATALOG_VERSION)
  })

  it('cloud merge unions curriculum completions', () => {
    const local = createInitialState('A', 'year')
    local.curriculum.completedLessonIds = ['nature-of-man-image']
    const cloud = createInitialState('A', 'year')
    cloud.curriculum.completedLessonIds = ['nature-of-man-body-soul']
    const merged = mergeUserStates(local, cloud)
    expect(merged.curriculum.completedLessonIds.sort()).toEqual(
      ['nature-of-man-body-soul', 'nature-of-man-image'].sort(),
    )
  })
})

describe('curriculum_lesson XP events', () => {
  it('requires reflection and MC totals server-side', () => {
    expect(
      computeEventXp('curriculum_lesson', {
        reflection: false,
        correctMc: 3,
        totalMc: 3,
      }),
    ).toBe(0)
    expect(
      computeEventXp('curriculum_lesson', {
        reflection: true,
        correctMc: 3,
        totalMc: 0,
      }),
    ).toBe(0)
    expect(
      computeEventXp('curriculum_lesson', {
        reflection: true,
        alreadyCompleted: true,
        correctMc: 3,
        totalMc: 3,
      }),
    ).toBe(0)
    expect(
      computeEventXp('curriculum_lesson', {
        reflection: true,
        correctMc: 3,
        totalMc: 3,
      }),
    ).toBe(XP.curriculumLesson + XP.curriculumReflection + XP.curriculumQuizBonus)
  })
})
