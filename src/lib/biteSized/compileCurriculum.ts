import type {
  ContentBlock,
  CurriculumDifficulty,
  CurriculumLesson,
  CurriculumTopic,
} from '../../data/curriculum/types'
import {
  contentIsGoDeeper,
  contentVisibleInline,
  nextDifficulty,
  objectivesForDifficulty,
  questionMatchesDifficulty,
  shuffleMcChoices,
} from '../../data/curriculum/difficulty'
import { assembleCurriculumQuestions } from '../../data/curriculum/quizBank'
import { formatFurtherStudyItem } from '../../data/curriculum/topics/_helpers'
import type { BiteExercise, BiteLesson, BiteStep } from './types'
import { quizQuestionToMc } from './types'

/** Cap practice length so spiral review cannot produce 25-question walls. */
export const CURRICULUM_PRACTICE_CAP = 5

export type CompileCurriculumOptions = {
  difficulty?: CurriculumDifficulty
  /** Include one tier above the learner’s level in practice MC. */
  challengeUp?: boolean
  random?: () => number
}

function isHistory(topic: CurriculumTopic): boolean {
  return topic.domain === 'church-history'
}

function isEvangelism(topic: CurriculumTopic): boolean {
  return topic.domain === 'evangelism-apologetics'
}

function blockTitle(block: ContentBlock, index: number): string {
  if (block.kind === 'teaching') return block.title?.trim() || `Teaching ${index + 1}`
  if (block.kind === 'concept') return block.term
  if (block.kind === 'distinction') return 'Facts, interpretation, and disagreement'
  if (block.kind === 'scripture_focus') {
    const p = block.passage
    return `${p.bookName} ${p.chapter}${p.verseStart != null ? `:${p.verseStart}` : ''}`
  }
  if (block.kind === 'attribution') return 'Historical / theological note'
  if (block.kind === 'primary_source') return block.work
  return `Step ${index + 1}`
}

function blockLevel(
  block: ContentBlock,
): 'all' | CurriculumDifficulty | undefined {
  if (block.kind === 'teaching' || block.kind === 'concept') return block.level
  return 'all'
}

function blockToSteps(
  block: ContentBlock,
  index: number,
  history: boolean,
  evangelism: boolean,
  asGoDeeper: boolean,
): BiteStep[] {
  const id = `c-block-${index}`
  if (block.kind === 'teaching') {
    if (asGoDeeper) {
      return [
        {
          id,
          kind: 'deeper',
          title: block.title?.trim() || 'Go deeper',
          body: block.body,
          deeperItems: [block.body],
        },
      ]
    }
    return [
      {
        id,
        kind: 'teach',
        title: blockTitle(block, index),
        body: block.body,
      },
    ]
  }
  if (block.kind === 'concept') {
    if (asGoDeeper) {
      return [
        {
          id,
          kind: 'deeper',
          title: block.term,
          body: block.explanation,
          deeperItems: [`${block.term}: ${block.explanation}`],
        },
      ]
    }
    return [
      {
        id,
        kind: 'teach',
        title: block.term,
        term: block.term,
        body: block.explanation,
      },
    ]
  }
  if (block.kind === 'scripture_focus') {
    return [
      {
        id,
        kind: 'scripture',
        title: blockTitle(block, index),
        passage: block.passage,
        scriptureNote: block.note,
      },
    ]
  }
  if (block.kind === 'distinction') {
    return [
      {
        id,
        kind: 'application',
        title: history
          ? 'History, Reformed reading, and careful disagreement'
          : evangelism
            ? 'Scripture, gospel clarity, and careful disagreement'
            : 'Text, interpretation, and careful disagreement',
        biblical: block.biblical,
        interpretation: block.interpretation,
        disagreement: block.disagreement,
        body: history
          ? 'Hold these layers carefully: documented history (and biblical backdrop), how Reformed evangelicals typically read the episode, and where Christians or historians disagree.'
          : evangelism
            ? 'Hold these layers carefully: what Scripture says, how Reformed evangelicals explain the gospel, and where people or traditions differ — without strawmen.'
            : 'Hold these layers carefully: what the text says, how Reformed theology reads it, and where Christians disagree.',
        distinctionLabels: history
          ? {
              biblical: 'Documented history / biblical backdrop',
              interpretation: 'Reformed evangelical reading',
              disagreement: 'Where traditions or historians differ',
            }
          : evangelism
            ? {
                biblical: 'What Scripture states',
                interpretation: 'Reformed evangelical gospel reading',
                disagreement: 'Where people or traditions differ',
              }
            : undefined,
      },
    ]
  }
  if (block.kind === 'primary_source') {
    return [
      {
        id,
        kind: 'deeper',
        title: block.work,
        body: block.context,
        primarySource: {
          authorOrBody: block.authorOrBody,
          work: block.work,
          approxDate: block.approxDate,
          context: block.context,
          excerpt: block.excerpt,
          significance: block.significance,
          rightsNote: block.rightsNote,
          reference: block.reference,
        },
      },
    ]
  }
  return [
    {
      id,
      kind: 'deeper',
      title: block.work,
      body: block.note,
      deeperItems: [`Source: ${block.work}`],
    },
  ]
}

function practiceFromInteractive(lesson: CurriculumLesson): BiteStep[] {
  const extras = lesson.interactiveExercises ?? []
  return extras.map((exercise, i) => ({
    id: `c-interactive-${exercise.kind}-${i}`,
    kind: 'practice' as const,
    title:
      exercise.kind === 'order'
        ? 'Timeline'
        : exercise.kind === 'match'
          ? 'Identify'
          : exercise.kind === 'true_false'
            ? 'True or false'
            : exercise.kind === 'passage_guide'
              ? 'Guided reading'
              : exercise.kind === 'conversation'
                ? 'Conversation'
                : `Practice ${i + 1}`,
    body:
      exercise.kind === 'order'
        ? 'Arrange these in chronological order, then read why the sequence matters.'
        : exercise.kind === 'conversation'
          ? 'Choose responses that are truthful, loving, and clear — not hostile or manipulative.'
          : 'Work the exercise carefully, then read the explanation.',
    exercise,
  }))
}

function practiceFromQuestions(
  lesson: CurriculumLesson,
  topic: CurriculumTopic,
  remainingSlots: number,
  difficulty: CurriculumDifficulty,
  challengeUp: boolean,
  random: () => number,
): BiteStep[] {
  if (remainingSlots <= 0) return []

  const assembled = assembleCurriculumQuestions(topic, lesson)
  const mc = assembled.filter((q): q is Extract<typeof q, { type: 'mc' }> => q.type === 'mc')
  const nativeIds = new Set(
    lesson.questions.filter((q) => q.type === 'mc').map((q) => q.id),
  )

  const matches = (q: (typeof mc)[number]) =>
    questionMatchesDifficulty(q.difficulty, difficulty, { includeChallengeUp: challengeUp })

  const native = mc.filter((q) => nativeIds.has(q.id) && matches(q))
  const review = mc.filter((q) => !nativeIds.has(q.id) && matches(q))

  // Prefer same-tier native, then challenge-up, then review
  const sameTier = [...native, ...review].filter(
    (q) => q.difficulty == null || q.difficulty === difficulty || !challengeUp,
  )
  const challenge = challengeUp
    ? [...native, ...review].filter((q) => {
        const up = nextDifficulty(difficulty)
        return up != null && q.difficulty === up
      })
    : []
  const picked = [...sameTier, ...challenge]
    .filter((q, i, arr) => arr.findIndex((x) => x.id === q.id) === i)
    .slice(0, remainingSlots)

  if (!picked.length) {
    // Fall back to any MC so lessons still complete when banks lack tagged items
    const fallback = [...native, ...review, ...mc].slice(0, remainingSlots)
    return fallback.map((q, i) => {
      const shuffled = shuffleMcChoices(q, random)
      return {
        id: `c-practice-${q.id || i}`,
        kind: 'practice' as const,
        title: `Practice ${i + 1}`,
        body: 'Choose the best answer, then read the explanation carefully.',
        exercise: quizQuestionToMc(shuffled) as BiteExercise,
      }
    })
  }

  return picked.map((q, i) => {
    const shuffled = shuffleMcChoices(q, random)
    const up = nextDifficulty(difficulty)
    const isChallenge = up != null && q.difficulty === up
    return {
      id: `c-practice-${q.id || i}`,
      kind: 'practice' as const,
      title: isChallenge ? `Challenge ${i + 1}` : `Practice ${i + 1}`,
      body: isChallenge
        ? 'Challenge-up question from the next difficulty tier. Choose the best answer, then read the explanation.'
        : 'Choose the best answer, then read the explanation carefully.',
      exercise: quizQuestionToMc(shuffled) as BiteExercise,
    }
  })
}

/**
 * Compile an existing curriculum lesson into a bite-sized step sequence.
 * Preserves lesson ids and completion contracts.
 */
export function compileCurriculumBiteLesson(
  topic: CurriculumTopic,
  lesson: CurriculumLesson,
  options: CompileCurriculumOptions = {},
): BiteLesson {
  const difficulty = options.difficulty ?? 'beginner'
  const challengeUp = options.challengeUp ?? true
  const random = options.random ?? Math.random
  const history = isHistory(topic)
  const evangelism = isEvangelism(topic)
  const objectives = objectivesForDifficulty(lesson.objectives, difficulty)
  const steps: BiteStep[] = []

  steps.push({
    id: 'c-intro',
    kind: 'intro',
    title: lesson.title,
    body: history
      ? `In about ${lesson.estimatedMinutes} minutes you will study one focused episode in church history — what happened, why it mattered, how primary sources speak, and how Reformed evangelicals receive the story without erasing other Christian readings.`
      : evangelism
        ? `In about ${lesson.estimatedMinutes} minutes you will grow in gospel clarity and wise witness — Scripture first, accurate understanding of others, and practice that favors love and truth over winning arguments.`
        : `In about ${lesson.estimatedMinutes} minutes you will work through one focused theological concept — taught briefly, grounded in Scripture, practiced, and applied.`,
    reviewItems: objectives,
  })

  if (lesson.primaryPassages[0]) {
    steps.push({
      id: 'c-primary-scripture',
      kind: 'scripture',
      title: history ? 'Scripture backdrop' : 'Start with Scripture',
      body: history
        ? 'Church history begins under Scripture’s authority. Read this passage as the biblical backdrop for the historical lesson.'
        : evangelism
          ? 'Evangelism and apologetics begin with God’s Word. Read carefully before practicing how to speak.'
          : 'Read the primary passage carefully before the teaching steps. Distinction between text and interpretation comes later.',
      passage: lesson.primaryPassages[0],
    })
  }

  const goDeeperBodies: string[] = []
  lesson.content.forEach((block, i) => {
    const level = blockLevel(block)
    if (contentVisibleInline(level, difficulty)) {
      steps.push(...blockToSteps(block, i, history, evangelism, false))
    } else if (contentIsGoDeeper(level, difficulty)) {
      if (block.kind === 'teaching') {
        goDeeperBodies.push(
          `${block.title?.trim() ? `${block.title.trim()}: ` : ''}${block.body}`,
        )
      } else if (block.kind === 'concept') {
        goDeeperBodies.push(`${block.term}: ${block.explanation}`)
      } else {
        steps.push(...blockToSteps(block, i, history, evangelism, true))
      }
    }
  })

  if (goDeeperBodies.length) {
    steps.push({
      id: 'c-go-deeper-tier',
      kind: 'deeper',
      title: 'Go deeper',
      body: 'Optional material written for a higher Learn difficulty. Open when you want more depth — not required to finish the lesson.',
      deeperItems: goDeeperBodies,
    })
  }

  lesson.primaryPassages.slice(1).forEach((p, i) => {
    steps.push({
      id: `c-primary-extra-${i}`,
      kind: 'scripture',
      title: `${p.bookName} ${p.chapter}`,
      passage: p,
      body: history
        ? 'Additional biblical backdrop for this historical lesson.'
        : 'Supporting primary text for this lesson.',
    })
  })

  const interactive = practiceFromInteractive(lesson)
  const mcSlots = Math.max(0, CURRICULUM_PRACTICE_CAP - interactive.length)
  const fromQuiz = practiceFromQuestions(
    lesson,
    topic,
    mcSlots,
    difficulty,
    challengeUp,
    random,
  )
  const practice = [...interactive, ...fromQuiz]

  if (!practice.length) {
    practice.push({
      id: 'c-practice-fallback',
      kind: 'practice',
      title: 'Check your understanding',
      body: 'Confirm the lesson objective before finishing.',
      exercise: {
        kind: 'true_false',
        prompt: `This lesson’s focus is: ${objectives[0] ?? lesson.title}`,
        answer: true,
        explanation:
          'Revisit the teaching steps if this objective does not yet feel clear.',
      },
    })
  }

  steps.push(...practice)

  if (lesson.reflectionPrompts[0]) {
    steps.push({
      id: 'c-application',
      kind: 'application',
      title: history
        ? 'Why this history matters'
        : evangelism
          ? 'Practice with humility'
          : 'Apply what you learned',
      prompt: lesson.reflectionPrompts[0],
      body: 'Write a short response. Aim for clarity over length — at least a sentence or two.',
    })
  }

  const videos = lesson.video
    ? (Array.isArray(lesson.video) ? lesson.video : [lesson.video]).map(
        (v) => `${v.attribution}: ${v.url}`,
      )
    : []
  const deeperItems = [
    ...videos,
    ...(lesson.furtherStudy ?? []).map(formatFurtherStudyItem),
    ...lesson.supportingPassages.map(
      (p) =>
        `Supporting passage: ${p.bookName} ${p.chapter}${p.verseStart != null ? `:${p.verseStart}` : ''}${p.verseEnd != null && p.verseEnd !== p.verseStart ? `–${p.verseEnd}` : ''}`,
    ),
  ]
  if (deeperItems.length) {
    steps.push({
      id: 'c-deeper',
      kind: 'deeper',
      title: 'Deeper study',
      body: 'Optional expansion — open when you have margin. Completing the lesson does not require reading every item.',
      deeperItems,
    })
  }

  const concepts = lesson.content
    .filter((b): b is Extract<ContentBlock, { kind: 'concept' }> => b.kind === 'concept')
    .filter((b) => contentVisibleInline(b.level, difficulty))
    .map((b) => `${b.term}: ${b.explanation}`)
  steps.push({
    id: 'c-review',
    kind: 'review',
    title: 'Review',
    body: history
      ? 'Before you finish, glance over the objectives, people, and documents.'
      : evangelism
        ? 'Before you finish, glance over the gospel points and wise-witness habits.'
        : 'Before you finish, glance over the objectives and key terms.',
    reviewItems: [...objectives, ...concepts.slice(0, 4)],
  })

  lesson.reflectionPrompts.slice(1).forEach((prompt, i) => {
    steps.push({
      id: `c-reflect-${i + 1}`,
      kind: 'application',
      title: `Reflection ${i + 2}`,
      prompt,
    })
  })

  return {
    subject: 'curriculum',
    lessonId: lesson.id,
    topicId: topic.id,
    domain: topic.domain ?? 'theology',
    title: lesson.title,
    estimatedMinutes: lesson.estimatedMinutes,
    objectives,
    steps,
    prefetchPassages: [...lesson.primaryPassages, ...lesson.supportingPassages],
  }
}
