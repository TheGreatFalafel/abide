import type { QuizQuestion, SectionQuiz } from '../data/planQuizzes'

function mulberry32(seed: number) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Pick a cycling subset so repeats feel fresh. */
export function pickQuizQuestions(
  quiz: SectionQuiz,
  seed: number,
  count = quiz.askCount ?? 4,
): QuizQuestion[] {
  const pool = quiz.questions
  if (pool.length <= count) return shuffle(pool, mulberry32(seed))
  return shuffle(pool, mulberry32(seed)).slice(0, count)
}
