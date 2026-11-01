'use client'

import { useMemo, useState } from 'react'
import {
  INSIGHTS_MIN_SAMPLE,
  INSIGHTS_RANGES,
  buildLearningInsights,
  type DayCount,
  type InsightsRange,
  type SampledRate,
} from '../lib/learningInsights'
import type { UserState } from '../lib/types'

type Props = {
  user: UserState
}

function formatRate(rate: SampledRate): string {
  if (rate.rate == null) {
    return rate.total === 0
      ? 'No attempts yet'
      : `${rate.correct}/${rate.total} (need ${INSIGHTS_MIN_SAMPLE}+ for %)`
  }
  return `${rate.rate}% (${rate.correct}/${rate.total})`
}

function MiniBars({ series, label }: { series: DayCount[]; label: string }) {
  if (!series.length) {
    return <p className="muted insights-empty">No dated {label} in this range.</p>
  }
  const max = Math.max(1, ...series.map((d) => d.count))
  const hasAny = series.some((d) => d.count > 0)
  if (!hasAny) {
    return <p className="muted insights-empty">No dated {label} in this range.</p>
  }
  return (
    <div className="insights-bars" role="img" aria-label={`${label} by day`}>
      {series.map((d) => (
        <div key={d.day} className="insights-bar-col" title={`${d.day}: ${d.count}`}>
          <div
            className="insights-bar"
            style={{ height: `${Math.max(d.count ? 8 : 2, Math.round((d.count / max) * 56))}px` }}
          />
          <span className="insights-bar-label">{d.day.slice(5)}</span>
        </div>
      ))}
    </div>
  )
}

function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="insights-stat">
      <strong>{value}</strong>
      <span>{label}</span>
      {hint ? <em className="muted">{hint}</em> : null}
    </div>
  )
}

export function LearningInsights({ user }: Props) {
  const [range, setRange] = useState<InsightsRange>('30d')
  const data = useMemo(() => buildLearningInsights(user, range), [user, range])
  const empty =
    data.overall.planCompletedDays === 0 &&
    data.memory.totalVerses === 0 &&
    data.theology.lessonsCompleted === 0 &&
    data.languages.greek.lessonsCompleted === 0 &&
    data.languages.hebrew.lessonsCompleted === 0 &&
    data.games.played === 0

  return (
    <div className="insights">
      <header className="insights-head">
        <div>
          <h2>Learning Insights</h2>
          <p className="muted">
            Read-only snapshot of progress from your saved activity. Viewing this never awards XP or
            gems.
          </p>
        </div>
        <div className="shop-filters insights-ranges" role="tablist" aria-label="Date range">
          {INSIGHTS_RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              role="tab"
              aria-selected={range === r.id}
              className={range === r.id ? 'active' : ''}
              onClick={() => setRange(r.id)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </header>

      {empty && (
        <div className="insights-empty-card">
          <strong>Nothing to chart yet</strong>
          <p className="muted">
            Read a plan day, add a memory verse, open a Learn lesson, or play a Bible game — Insights
            only use activity you have already recorded.
          </p>
        </div>
      )}

      <section className="insights-section" aria-labelledby="insights-overall">
        <h3 id="insights-overall">Overall progress</h3>
        <div className="insights-stat-grid">
          <Stat label="Level" value={data.overall.level} />
          <Stat label="Lifetime XP" value={data.overall.lifetimeXp} />
          <Stat
            label="Streak"
            value={data.overall.streak}
            hint={`Longest ${data.overall.longestStreak}`}
          />
          <Stat
            label="Plan progress"
            value={`${data.overall.planPct}%`}
            hint={`${data.overall.planCompletedDays}/${data.overall.planTotalDays} plan days`}
          />
          <Stat
            label="Today’s XP"
            value={`${data.overall.todayXp}/${data.overall.dailyGoalXp}`}
          />
          <Stat
            label="Reading today"
            value={data.overall.readToday ? 'Yes' : 'Not yet'}
            hint={data.overall.lastReadDate ? `Last: ${data.overall.lastReadDate}` : 'No reads yet'}
          />
        </div>
        <p className="muted tiny">
          Plan days are checklist progress on your reading plan — not a calendar of every chapter
          opened.
        </p>
      </section>

      <section className="insights-section" aria-labelledby="insights-activity">
        <h3 id="insights-activity">Activity trends</h3>
        <div className="insights-stat-grid">
          <Stat label="Memory reviews" value={data.activity.memoryReviewsInRange} />
          <Stat label="Lessons / attempts" value={data.activity.lessonsCompletedInRange} />
          <Stat label="Reading sessions" value={data.activity.readingSessionsInRange} />
          <Stat label="Verses added" value={data.activity.versesAddedInRange} />
          <Stat
            label="Games in range"
            value={
              data.activity.gamesPlayedInRange == null
                ? '—'
                : data.activity.gamesPlayedInRange
            }
          />
          <Stat
            label="Games (lifetime)"
            value={data.activity.gamesPlayedLifetime}
            hint={`${data.activity.gamesUniqueLifetime} unique · ${data.activity.gamesPerfectLifetime} perfect`}
          />
        </div>
        {data.activity.usesActivityHistory && (
          <p className="muted tiny">{data.activity.historySinceNote}</p>
        )}
        {data.activity.memoryReviewsIncompleteHistory && (
          <p className="muted tiny">
            Some older memory reviews are outside the per-verse history cap and are not included.
          </p>
        )}
        <h4 className="insights-subh">Memory reviews by day</h4>
        <MiniBars series={data.activity.reviewsByDay} label="reviews" />
        <h4 className="insights-subh">Reading sessions by day</h4>
        <MiniBars series={data.activity.readingByDay} label="reading" />
        <h4 className="insights-subh">Lessons / attempts by day</h4>
        <MiniBars series={data.activity.lessonsByDay} label="lessons" />
        <h4 className="insights-subh">Games by day</h4>
        <MiniBars series={data.activity.gamesByDay} label="games" />
        <p className="muted tiny">{data.activity.gamesNote}</p>
      </section>

      <section className="insights-section" aria-labelledby="insights-memory">
        <h3 id="insights-memory">Scripture memory</h3>
        <div className="insights-stat-grid">
          <Stat label="In bank" value={data.memory.totalVerses} />
          <Stat
            label="Marked memorized"
            value={data.memory.memorizedFlagCount}
            hint="Status flag"
          />
          <Stat label="Learning" value={data.memory.learningCount} />
          <Stat label="Due now" value={data.memory.dueCount} />
          <Stat label="Due in 7 days" value={data.memory.upcoming7Days} />
          <Stat label="Reviewed today" value={data.memory.reviewedToday} />
        </div>
        <div className="insights-stat-grid">
          <Stat label="Good/Easy rate" value={formatRate(data.memory.reviewAccuracy)} />
          <Stat label="Again share" value={formatRate(data.memory.againRate)} />
          <Stat
            label="Avg stability (memorized)"
            value={data.memory.avgStabilityMemorized ?? '—'}
          />
          <Stat
            label="Avg retrievability"
            value={
              data.memory.avgRetrievabilityMemorized == null
                ? '—'
                : data.memory.avgRetrievabilityMemorized
            }
          />
        </div>
        <p className="muted tiny">{data.memory.disclaimer}</p>
      </section>

      <section className="insights-section" aria-labelledby="insights-theology">
        <h3 id="insights-theology">Theology</h3>
        <div className="insights-stat-grid">
          <Stat label="Topics started" value={data.theology.topicsStarted} />
          <Stat label="Topics completed" value={data.theology.topicsCompleted} />
          <Stat
            label="Lessons"
            value={`${data.theology.lessonsCompleted}/${data.theology.lessonsTotal}`}
          />
          <Stat label="Quiz accuracy" value={formatRate(data.theology.quizAccuracy)} />
        </div>
        {data.theology.suggestedNext && (
          <p className="insights-suggest">
            Suggested next: <strong>{data.theology.suggestedNext.title}</strong>
            <span className="muted"> · {data.theology.suggestedNext.topicTitle}</span>
          </p>
        )}
        {data.theology.weakLessons.length > 0 && (
          <div className="insights-list">
            <h4 className="insights-subh">Needs more practice (≥{INSIGHTS_MIN_SAMPLE} Qs)</h4>
            <ul>
              {data.theology.weakLessons.map((l) => (
                <li key={l.id}>
                  {l.title} — {l.rate}% ({l.correct}/{l.total})
                </li>
              ))}
            </ul>
          </div>
        )}
        {data.theology.strongLessons.length > 0 && (
          <div className="insights-list">
            <h4 className="insights-subh">Stronger quizzes</h4>
            <ul>
              {data.theology.strongLessons.map((l) => (
                <li key={l.id}>
                  {l.title} — {l.rate}% ({l.correct}/{l.total})
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="muted tiny">{data.theology.disclaimer}</p>
      </section>

      <section className="insights-section" aria-labelledby="insights-lang">
        <h3 id="insights-lang">Greek &amp; Hebrew</h3>
        {(['greek', 'hebrew'] as const).map((track) => {
          const t = data.languages[track]
          return (
            <div key={track} className="insights-lang-card">
              <strong>{track === 'greek' ? 'Biblical Greek' : 'Biblical Hebrew'}</strong>
              <div className="insights-stat-grid tight">
                <Stat
                  label="Lessons"
                  value={`${t.lessonsCompleted}/${t.lessonsTotal}`}
                />
                <Stat label="Quiz accuracy" value={formatRate(t.quizAccuracy)} />
                <Stat label="Vocab cards" value={t.vocabIntroduced} />
                <Stat label="Vocab due" value={t.vocabDue} />
              </div>
              {t.alphabetMastered && <p className="muted tiny">Alphabet marked complete.</p>}
            </div>
          )
        })}
        <p className="muted tiny">{data.languages.disclaimer}</p>
      </section>

      <section className="insights-section" aria-labelledby="insights-games">
        <h3 id="insights-games">Bible knowledge (games)</h3>
        <div className="insights-stat-grid">
          <Stat label="Sessions played" value={data.games.played} />
          <Stat label="Games tried" value={data.games.uniqueCompleted} />
          <Stat label="Perfect runs" value={data.games.perfect} />
        </div>
        {data.games.notYetTried.length > 0 && (
          <div className="insights-list">
            <h4 className="insights-subh">Not tried yet</h4>
            <ul>
              {data.games.notYetTried.map((g) => (
                <li key={g.id}>{g.title}</li>
              ))}
            </ul>
          </div>
        )}
        <p className="muted tiny">{data.games.disclaimer}</p>
      </section>

      <details className="insights-limits">
        <summary>What Insights cannot show</summary>
        <ul>
          {data.limitations.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </details>
    </div>
  )
}
