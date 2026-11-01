import { NATURE_OF_MAN } from './topics/nature-of-man'
import { DOCTRINE_OF_SCRIPTURE } from './topics/doctrine-of-scripture'
import { DOCTRINE_OF_GOD } from './topics/doctrine-of-god'
import { DOCTRINE_OF_CHRIST } from './topics/doctrine-of-christ'
import { DOCTRINE_OF_SALVATION } from './topics/doctrine-of-salvation'
import { DOCTRINE_OF_CHURCH } from './topics/doctrine-of-church'
import { DOCTRINE_OF_LAST_THINGS } from './topics/doctrine-of-last-things'
import { EARLY_CHURCH } from './topics/early-church'
import { GOSPEL_FOUNDATIONS } from './topics/gospel-foundations'
import { CHRISTIAN_APOLOGETICS } from './topics/christian-apologetics'
import { SHARING_YOUR_FAITH } from './topics/sharing-your-faith'
import { WORLDVIEW_ATHEISM } from './topics/worldview-atheism'
import { UNDERSTANDING_ISLAM } from './topics/understanding-islam'
import { assertValidTopic } from './validate'
import type { CurriculumDomain, CurriculumLesson, CurriculumTopic } from './types'
import { CURRICULUM_CATALOG_VERSION } from './types'

export * from './types'
export * from './access'
export { assembleCurriculumQuestions } from './quizBank'
export { curriculumPrimaryPassagesReady } from './scriptureGate'
export { validateCurriculumTopic, assertValidTopic, validatePassageRef } from './validate'

/**
 * Published Learn curriculum topics (browse order).
 * Lesson IDs are stable — never rename existing completions.
 * Theology topics first; Church History eras follow.
 */
export const CURRICULUM_TOPICS: CurriculumTopic[] = [
  DOCTRINE_OF_SCRIPTURE,
  DOCTRINE_OF_GOD,
  NATURE_OF_MAN,
  DOCTRINE_OF_CHRIST,
  DOCTRINE_OF_SALVATION,
  DOCTRINE_OF_CHURCH,
  DOCTRINE_OF_LAST_THINGS,
  EARLY_CHURCH,
  GOSPEL_FOUNDATIONS,
  CHRISTIAN_APOLOGETICS,
  SHARING_YOUR_FAITH,
  WORLDVIEW_ATHEISM,
  UNDERSTANDING_ISLAM,
]

const byId = new Map<string, CurriculumTopic>()
const lessonToTopic = new Map<string, string>()

for (const topic of CURRICULUM_TOPICS) {
  assertValidTopic(topic)
  byId.set(topic.id, topic)
  for (const lesson of topic.lessons) {
    if (lessonToTopic.has(lesson.id)) {
      throw new Error(`Duplicate curriculum lesson id across topics: ${lesson.id}`)
    }
    lessonToTopic.set(lesson.id, topic.id)
  }
}

export function getCurriculumCatalogVersion(): number {
  return CURRICULUM_CATALOG_VERSION
}

export function listCurriculumTopics(): CurriculumTopic[] {
  return CURRICULUM_TOPICS
}

export function topicDomain(topic: CurriculumTopic): CurriculumDomain {
  return topic.domain ?? 'theology'
}

export function listCurriculumTopicsByDomain(domain: CurriculumDomain): CurriculumTopic[] {
  return CURRICULUM_TOPICS.filter((t) => topicDomain(t) === domain)
}

export function getCurriculumTopic(id: string): CurriculumTopic | undefined {
  return byId.get(id)
}

export function getCurriculumLesson(
  lessonId: string,
): { topic: CurriculumTopic; lesson: CurriculumLesson } | undefined {
  const topicId = lessonToTopic.get(lessonId)
  if (!topicId) return undefined
  const topic = byId.get(topicId)
  if (!topic) return undefined
  const lesson = topic.lessons.find((l) => l.id === lessonId)
  if (!lesson) return undefined
  return { topic, lesson }
}

export function curriculumTopicsById(): Map<string, CurriculumTopic> {
  return byId
}
