'use client'

import { useState } from 'react'
import {
  curriculumTopicsById,
  isLessonUnlocked,
  isTopicUnlocked,
  listCurriculumTopics,
  orderedLessons,
  resumeLessonId,
  topicCompletion,
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
import type { UserState } from '../lib/types'

type LearnTab = 'theology' | 'greek' | 'hebrew'

type Props = {
  user: UserState
  onOpenLesson: (lessonId: string) => void
  onOpenLanguageLesson: (track: LanguageTrackId, lessonId: string) => void
}

export function Learn({ user, onOpenLesson, onOpenLanguageLesson }: Props) {
  const [tab, setTab] = useState<LearnTab>('theology')
  const progress = migrateCurriculumProgress(user.curriculum)
  const langProgress = migrateLanguageProgress(user.languages)
  const topics = listCurriculumTopics()
  const byId = curriculumTopicsById()
  const courses = listLanguageCourses()

  return (
    <div className="learn">
      <div className="learn-intro">
        <h2>Learn</h2>
        <p className="muted">
          Theology curriculum plus Biblical Greek and Hebrew tracks. Progress is saved separately for
          each — opening a lesson alone does not earn XP.
        </p>
      </div>

      <div className="shop-filters learn-tabs" role="tablist" aria-label="Learn tracks">
        {(
          [
            ['theology', 'Theology'],
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
