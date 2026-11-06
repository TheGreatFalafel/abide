'use client'

import { useState } from 'react'
import {
  CURRICULUM_DIFFICULTY_LABELS,
  curriculumTopicsById,
  isLessonUnlocked,
  isTopicUnlocked,
  listCurriculumTopicsByDomain,
  orderedLessons,
  resumeLessonId,
  topicCompletion,
  type CurriculumTopic,
} from '../data/curriculum'
import { migrateCurriculumProgress } from '../data/curriculum/access'
import {
  isLanguageLessonUnlocked,
  languageTrackCompletion,
  listLanguageCourses,
  migrateLanguageProgress,
  orderedLanguageLessons,
  resumeLanguageLessonId,
  trackProgressOf,
  type LanguageTrackId,
} from '../data/languages'
import { dueLanguageVocab } from '../lib/languageProgress'
import { mascotLineFor } from '../lib/mascot'
import type { UserState } from '../lib/types'
import type { CurriculumProgress } from '../data/curriculum/types'
import { MascotBanner } from './MascotBanner'

type LearnTab = 'theology' | 'history' | 'witness' | 'greek' | 'hebrew'

type Props = {
  user: UserState
  onOpenLesson: (lessonId: string) => void
  onOpenLanguageLesson: (track: LanguageTrackId, lessonId: string) => void
}

function TopicList({
  topics,
  progress,
  byId,
  onOpenLesson,
  emptyHint,
}: {
  topics: CurriculumTopic[]
  progress: CurriculumProgress
  byId: Map<string, CurriculumTopic>
  onOpenLesson: (lessonId: string) => void
  emptyHint?: string
}) {
  if (!topics.length && emptyHint) {
    return <p className="muted">{emptyHint}</p>
  }

  return (
    <>
      {topics.map((topic) => {
        const unlocked = isTopicUnlocked(topic, progress, byId)
        const { done, total, pct } = topicCompletion(topic, progress)
        const resume = unlocked ? resumeLessonId(topic, progress) : null
        const lessons = orderedLessons(topic)

        return (
          <article key={topic.id} className={`learn-topic ${unlocked ? '' : 'locked'}`}>
            <header className="learn-topic-head">
              <div>
                <h3>{topic.title}</h3>
                {topic.eraLabel ? <p className="eyebrow">{topic.eraLabel}</p> : null}
                {(topic.contentStatus ?? 'full') === 'outline' ? (
                  <p className="nudge" role="note">
                    Outline — teaching to be expanded to full lesson depth.
                  </p>
                ) : null}
                <p className="muted">{topic.description}</p>
              </div>
              <div className="learn-meta">
                <span>~{topic.estimatedMinutes} min</span>
                <span>
                  {done}/{total} lessons
                </span>
              </div>
            </header>

            <div className="meter tall learn-meter">
              <div className="meter-fill" style={{ width: `${pct}%` }} />
            </div>

            {!unlocked ? (
              <p className="nudge">
                Complete prerequisite topics first
                {topic.prerequisites.length
                  ? `: ${topic.prerequisites.map((id) => byId.get(id)?.title ?? id).join(', ')}`
                  : ''}
                .
              </p>
            ) : (
              <>
                {resume && (
                  <button
                    type="button"
                    className="btn primary"
                    onClick={() => onOpenLesson(resume)}
                  >
                    {done === total ? 'Review topic' : done > 0 ? 'Resume' : 'Start topic'}
                  </button>
                )}

                <ol className="learn-lessons">
                  {lessons.map((lesson) => {
                    const complete = progress.completedLessonIds.includes(lesson.id)
                    const open = isLessonUnlocked(topic, lesson.id, progress)
                    return (
                      <li key={lesson.id}>
                        <button
                          type="button"
                          className={`learn-lesson ${complete ? 'done' : ''} ${open ? '' : 'locked'}`}
                          disabled={!open}
                          onClick={() => onOpenLesson(lesson.id)}
                        >
                          <span className="learn-lesson-mark" aria-hidden>
                            {complete ? '✓' : open ? lesson.order : '·'}
                          </span>
                          <span className="learn-lesson-body">
                            <strong>{lesson.title}</strong>
                            <span className="muted">
                              ~{lesson.estimatedMinutes} min
                              {complete ? ' · completed' : open ? '' : ' · locked'}
                            </span>
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ol>
              </>
            )}
          </article>
        )
      })}
    </>
  )
}

export function Learn({ user, onOpenLesson, onOpenLanguageLesson }: Props) {
  const [tab, setTab] = useState<LearnTab>('theology')
  const progress = migrateCurriculumProgress(user.curriculum)
  const langProgress = migrateLanguageProgress(user.languages)
  const byId = curriculumTopicsById()
  const theologyTopics = listCurriculumTopicsByDomain('theology')
  const historyTopics = listCurriculumTopicsByDomain('church-history')
  const witnessTopics = listCurriculumTopicsByDomain('evangelism-apologetics')
  const courses = listLanguageCourses()

  const noTheologyYet = progress.completedLessonIds.length === 0

  return (
    <div className="learn">
      <div className="learn-intro">
        <h2>Learn</h2>
        <p className="muted">
          Theology, Church History, Evangelism & Apologetics, and Biblical Greek and Hebrew.
          Progress is saved separately — opening a lesson alone does not earn XP.
        </p>
        <p className="eyebrow">
          Difficulty:{' '}
          {CURRICULUM_DIFFICULTY_LABELS[user.learnDifficulty ?? 'beginner']} (change in Settings)
        </p>
      </div>

      <MascotBanner
        line={mascotLineFor(noTheologyYet ? 'empty-learn' : 'learn', user)}
        compact
      />

      <div className="shop-filters learn-tabs" role="tablist" aria-label="Learn tracks">
        {(
          [
            ['theology', 'Theology'],
            ['history', 'History'],
            ['witness', 'Witness'],
            ['greek', 'Greek'],
            ['hebrew', 'Hebrew'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={tab === id ? 'active' : ''}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'theology' && (
        <>
          <p className="muted">
            Reformed framework — Scripture, God, humanity, Christ, salvation, church, and last things.
            Some topics unlock after prerequisites.
          </p>
          <TopicList
            topics={theologyTopics}
            progress={progress}
            byId={byId}
            onOpenLesson={onOpenLesson}
          />
        </>
      )}

      {tab === 'history' && (
        <>
          <p className="muted">
            Chronological Church History from a historic Reformed evangelical perspective — primary
            documents, councils, and controversies, with other Christian traditions named fairly.
            Scripture remains the final authority. Later eras unlock after earlier ones are complete.
          </p>
          <TopicList
            topics={historyTopics}
            progress={progress}
            byId={byId}
            onOpenLesson={onOpenLesson}
            emptyHint="Church History lessons are coming soon."
          />
        </>
      )}

      {tab === 'witness' && (
        <>
          <p className="muted">
            Evangelism and apologetics: understand the gospel, share it with humility, engage hard
            questions, and learn other beliefs accurately before responding. Scripture is the final
            authority — the goal is loving clarity, not winning arguments.
          </p>
          <TopicList
            topics={witnessTopics}
            progress={progress}
            byId={byId}
            onOpenLesson={onOpenLesson}
            emptyHint="Witness lessons are coming soon."
          />
        </>
      )}

      {(tab === 'greek' || tab === 'hebrew') &&
        courses
          .filter((c) => c.id === tab)
          .map((course) => {
            const track = trackProgressOf(langProgress, course.id)
            const { done, total, pct } = languageTrackCompletion(course, track)
            const resume = resumeLanguageLessonId(course, track)
            const lessons = orderedLanguageLessons(course)
            const due = dueLanguageVocab(user, course.id).length

            return (
              <article key={course.id} className="learn-topic">
                <header className="learn-topic-head">
                  <div>
                    <h3>{course.title}</h3>
                    <p className="muted">{course.description}</p>
                  </div>
                  <div className="learn-meta">
                    <span>~{course.estimatedMinutes} min</span>
                    <span>
                      {done}/{total} lessons
                    </span>
                  </div>
                </header>
                <p className="muted tiny">{course.pronunciationNote}</p>
                <p className="muted tiny">{course.sourcesNote}</p>
                <div className="meter tall learn-meter">
                  <div className="meter-fill" style={{ width: `${pct}%` }} />
                </div>
                {due > 0 && (
                  <p className="nudge good">
                    {due} vocabulary card{due === 1 ? '' : 's'} due for spaced review (separate from
                    Scripture memory).
                  </p>
                )}
                {resume && (
                  <button
                    type="button"
                    className="btn primary"
                    onClick={() => onOpenLanguageLesson(course.id, resume)}
                  >
                    {done === total ? 'Review course' : done > 0 ? 'Resume' : 'Start course'}
                  </button>
                )}
                <ol className="learn-lessons">
                  {lessons.map((lesson) => {
                    const complete = track.completedLessonIds.includes(lesson.id)
                    const open = isLanguageLessonUnlocked(course, lesson.id, track)
                    return (
                      <li key={lesson.id}>
                        <button
                          type="button"
                          className={`learn-lesson ${complete ? 'done' : ''} ${open ? '' : 'locked'}`}
                          disabled={!open}
                          onClick={() => onOpenLanguageLesson(course.id, lesson.id)}
                        >
                          <span className="learn-lesson-mark" aria-hidden>
                            {complete ? '✓' : open ? lesson.order : '·'}
                          </span>
                          <span className="learn-lesson-body">
                            <strong>{lesson.title}</strong>
                            <span className="muted">
                              ~{lesson.estimatedMinutes} min
                              {complete ? ' · completed' : open ? '' : ' · locked'}
                            </span>
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ol>
              </article>
            )
          })}
    </div>
  )
}
