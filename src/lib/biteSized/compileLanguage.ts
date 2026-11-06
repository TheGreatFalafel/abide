import type { CurriculumDifficulty } from '../../data/curriculum'
import {
  nextDifficulty,
  questionMatchesDifficulty,
  shuffleMcChoices,
} from '../../data/curriculum/difficulty'
import type {
  LanguageCourse,
  LanguageExercise,
  LanguageLesson,
  LanguageLetter,
} from '../../data/languages/types'
import type { BiteExercise, BiteLesson, BiteStep } from './types'

export type CompileLanguageOptions = {
  difficulty?: CurriculumDifficulty
  challengeUp?: boolean
  random?: () => number
}

/** Max alphabet recognition rounds generated from alphabet_match exercises. */
export const ALPHABET_PRACTICE_ROUNDS = 6

function shuffle<T>(items: T[], seed: number): T[] {
  const out = [...items]
  let s = seed || 1
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0
    const j = s % (i + 1)
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function lettersByIds(course: LanguageCourse, ids: string[]): LanguageLetter[] {
  const map = new Map(course.alphabet.map((l) => [l.id, l]))
  return ids.map((id) => map.get(id)).filter((l): l is LanguageLetter => Boolean(l))
}

function alphabetRounds(
  course: LanguageCourse,
  exercise: Extract<LanguageExercise, { kind: 'alphabet_match' }>,
  seed: number,
  maxRounds: number = ALPHABET_PRACTICE_ROUNDS,
): BiteStep[] {
  const pool = lettersByIds(course, exercise.letterIds)
  if (!pool.length) return []
  const rounds = Math.min(maxRounds, Math.max(Math.min(pool.length, maxRounds), 1))
  const targets = shuffle(pool, seed).slice(0, rounds)

  return targets.map((target, i) => {
    const distractors = shuffle(
      pool.filter((l) => l.id !== target.id),
      seed + i * 17,
    ).slice(0, 5)
    const options = shuffle([target, ...distractors], seed + i * 31)
    const answer = options.findIndex((l) => l.id === target.id)
    return {
      id: `l-alpha-${target.id}-${i}`,
      kind: 'practice' as const,
      title: `Alphabet ${i + 1}`,
      body: exercise.prompt,
      exercise: {
        kind: 'match',
        prompt: exercise.prompt,
        target: target.glyph,
        choices: options.map((l) => `${l.name} (${l.transliteration})`),
        answer: Math.max(0, answer),
        explanation: `${target.glyph} is ${target.name} — ${target.pronunciation}${target.soundCue ? ` (${target.soundCue})` : ''}.`,
      } satisfies BiteExercise,
      rtl: course.scriptDirection === 'rtl',
    }
  })
}

function exerciseToSteps(
  course: LanguageCourse,
  exercise: LanguageExercise,
  index: number,
  seed: number,
  alphabetMaxRounds: number = ALPHABET_PRACTICE_ROUNDS,
  difficulty: CurriculumDifficulty = 'beginner',
  challengeUp = true,
  random: () => number = Math.random,
): BiteStep[] {
  if (exercise.kind === 'alphabet_match') {
    return alphabetRounds(course, exercise, seed + index * 97, alphabetMaxRounds)
  }
  if (exercise.kind === 'mc' && exercise.question.type === 'mc') {
    const q = exercise.question
    if (
      !questionMatchesDifficulty(q.difficulty, difficulty, { includeChallengeUp: challengeUp })
    ) {
      return []
    }
    const shuffled = shuffleMcChoices(q, random)
    const up = nextDifficulty(difficulty)
    const isChallenge = up != null && q.difficulty === up
    return [
      {
        id: `l-mc-${q.id || index}`,
        kind: 'practice',
        title: isChallenge ? `Challenge ${index + 1}` : `Practice ${index + 1}`,
        exercise: {
          kind: 'mc',
          prompt: shuffled.prompt,
          choices: shuffled.choices,
          answer: shuffled.answer,
          explanation:
            shuffled.explanation?.trim() ||
            'Re-read the teaching step, then try a related example.',
        },
      },
    ]
  }
  if (exercise.kind === 'parse' || exercise.kind === 'translate') {
    const shuffled = shuffleMcChoices(
      {
        choices: exercise.choices,
        answer: exercise.answer,
      },
      random,
    )
    return [
      {
        id: `l-${exercise.kind}-${index}`,
        kind: 'practice',
        title: exercise.kind === 'parse' ? 'Parse' : 'Translate',
        body: exercise.prompt,
        original: exercise.kind === 'parse' ? exercise.form : exercise.original,
        transliteration: exercise.transliteration,
        rtl: course.scriptDirection === 'rtl',
        exercise: {
          kind: 'mc',
          prompt: exercise.prompt,
          choices: shuffled.choices,
          answer: shuffled.answer,
          explanation: exercise.explanation,
        },
      },
    ]
  }
  if (exercise.kind === 'passage_guide') {
    return [
      {
        id: `l-passage-${index}`,
        kind: 'practice',
        title: exercise.reference,
        body: 'Read the snippet carefully. Morphology informs interpretation — it does not replace it.',
        exercise: {
          kind: 'passage_guide',
          prompt: 'Guided reading',
          reference: exercise.reference,
          original: exercise.originalSnippet,
          transliteration: exercise.transliteration,
          gloss: exercise.gloss,
          analysis: exercise.analysis,
          caution: exercise.caution,
          rtl: course.scriptDirection === 'rtl',
        },
        rtl: course.scriptDirection === 'rtl',
      },
    ]
  }

  return []
}

/**
 * Compile a Greek/Hebrew lesson into bite-sized steps.
 * Expands alphabet drills into multiple fair rounds.
 */
export function compileLanguageBiteLesson(
  course: LanguageCourse,
  lesson: LanguageLesson,
  options: CompileLanguageOptions = {},
): BiteLesson {
  const difficulty = options.difficulty ?? 'beginner'
  const challengeUp = options.challengeUp ?? true
  const random = options.random ?? Math.random
  const steps: BiteStep[] = []
  const rtl = course.scriptDirection === 'rtl'
  const seed = lesson.order * 1009 + lesson.id.length

  steps.push({
    id: 'l-intro',
    kind: 'intro',
    title: lesson.title,
    body: `${course.title}: ${lesson.estimatedMinutes}-minute focus. ${course.pronunciationNote}`,
    reviewItems: lesson.objectives,
    rtl,
  })

  lesson.content.forEach((block, i) => {
    if (block.kind === 'teaching') {
      steps.push({
        id: `l-teach-${i}`,
        kind: 'teach',
        title: block.title?.trim() || `Teaching ${i + 1}`,
        body: block.body,
        rtl,
      })
      return
    }
    if (block.kind === 'concept') {
      steps.push({
        id: `l-concept-${i}`,
        kind: 'teach',
        title: block.term,
        term: block.term,
        body: block.explanation,
        rtl,
      })
      return
    }
    if (block.kind === 'caution') {
      steps.push({
        id: `l-caution-${i}`,
        kind: 'teach',
        title: 'Handle with care',
        body: block.body,
        rtl,
      })
      return
    }
    if (block.kind === 'rtl_note') {
      steps.push({
        id: `l-rtl-${i}`,
        kind: 'teach',
        title: 'Reading direction',
        body: block.body,
        rtl: true,
      })
      return
    }
    // example
    steps.push({
      id: `l-example-${i}`,
      kind: 'teach',
      title: 'Example',
      original: block.original,
      transliteration: block.transliteration,
      gloss: block.gloss,
      body: block.note,
      rtl,
    })
  })

  const alphabetExerciseCount = lesson.exercises.filter((e) => e.kind === 'alphabet_match').length
  const alphabetPerExercise = Math.max(
    2,
    Math.ceil(ALPHABET_PRACTICE_ROUNDS / Math.max(1, alphabetExerciseCount)),
  )
  lesson.exercises.forEach((ex, i) => {
    steps.push(
      ...exerciseToSteps(
        course,
        ex,
        i,
        seed,
        alphabetPerExercise,
        difficulty,
        challengeUp,
        random,
      ),
    )
  })

  if (lesson.reflectionPrompts[0]) {
    steps.push({
      id: 'l-application',
      kind: 'application',
      title: 'Apply',
      prompt: lesson.reflectionPrompts[0],
      body: 'Connect the language detail to reading Scripture carefully.',
    })
  }

  steps.push({
    id: 'l-deeper',
    kind: 'deeper',
    title: 'Sources and further practice',
    body: course.sourcesNote,
    deeperItems: [
      course.pronunciationNote,
      ...(lesson.introduceVocabIds?.length
        ? [`New vocabulary introduced on completion: ${lesson.introduceVocabIds.length} lemma(s).`]
        : []),
    ],
  })

  steps.push({
    id: 'l-review',
    kind: 'review',
    title: 'Review',
    body: 'Confirm the lesson objectives before finishing.',
    reviewItems: lesson.objectives,
  })

  lesson.reflectionPrompts.slice(1).forEach((prompt, i) => {
    steps.push({
      id: `l-reflect-${i + 1}`,
      kind: 'application',
      title: `Reflection ${i + 2}`,
      prompt,
    })
  })

  return {
    subject: 'language',
    lessonId: lesson.id,
    track: course.id,
    title: lesson.title,
    estimatedMinutes: lesson.estimatedMinutes,
    objectives: lesson.objectives,
    steps,
  }
}
