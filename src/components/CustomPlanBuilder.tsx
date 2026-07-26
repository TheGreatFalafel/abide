'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { BOOKS, unitsFromPlan } from '../data/bible'
import { totalVersesInBooks } from '../data/chapterVerseCounts'
import type { CustomPlan } from '../lib/types'

type Pace = CustomPlan['pace']

type Props = {
  onSave: (plan: CustomPlan) => void
  onCancel?: () => void
  initial?: CustomPlan | null
}

export function CustomPlanBuilder({ onSave, onCancel, initial }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<string[]>(initial?.bookIds ?? ['john'])
  const [name, setName] = useState(initial?.name ?? '')
  const [pace, setPace] = useState<Pace>(initial?.pace ?? 'section')
  const [versesPerDay, setVersesPerDay] = useState(initial?.versesPerDay ?? 10)
  const [unitsPerDay, setUnitsPerDay] = useState(1)
  const [daysMode, setDaysMode] = useState<'pace' | 'days'>('pace')
  const [days, setDays] = useState(initial?.days ?? 21)

  useEffect(() => {
    if (!initial) return
    setSelected(initial.bookIds)
    setName(initial.name)
    setPace(initial.pace ?? 'chapter')
    setVersesPerDay(initial.versesPerDay ?? 10)
    setDays(initial.days)
    setDaysMode('days')
    setUnitsPerDay(1)
    window.requestAnimationFrame(() => {
      rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [initial])

  const totalChapters = useMemo(() => {
    return selected.reduce((sum, id) => {
      const book = BOOKS.find((b) => b.id === id)
      return sum + (book?.chapters ?? 0)
    }, 0)
  }, [selected])

  const verseTotal = useMemo(() => totalVersesInBooks(selected), [selected])

  const unitCount = useMemo(() => {
    if (!selected.length) return 0
    return unitsFromPlan({
      bookIds: selected,
      pace,
      versesPerDay: pace === 'verses' ? versesPerDay : undefined,
    }).length
  }, [selected, pace, versesPerDay])

  const computedDays = Math.max(
    1,
    Math.ceil(unitCount / Math.max(1, unitsPerDay)),
  )
  const safeDays =
    daysMode === 'pace'
      ? Math.min(unitCount, computedDays)
      : Math.min(Math.max(1, days), Math.max(1, unitCount))

  const unitsEachDay = unitCount && safeDays ? unitCount / safeDays : 0

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  function selectGroup(kind: 'ot' | 'nt' | 'gospels' | 'clear') {
    if (kind === 'clear') {
      setSelected([])
      return
    }
    if (kind === 'ot') {
      setSelected(BOOKS.filter((b) => b.testament === 'OT').map((b) => b.id))
      return
    }
    if (kind === 'nt') {
      setSelected(BOOKS.filter((b) => b.testament === 'NT').map((b) => b.id))
      return
    }
    setSelected(['matthew', 'mark', 'luke', 'john'])
  }

  function save() {
    const trimmed = name.trim()
    if (!trimmed || !selected.length || unitCount < 1) return
    const plan: CustomPlan = {
      id: initial?.id ?? `custom-${Date.now()}`,
      name: trimmed,
      bookIds: selected,
      days: safeDays,
      pace,
      versesPerDay: pace === 'verses' ? Math.max(1, Math.min(50, versesPerDay)) : undefined,
      createdAt: initial?.createdAt ?? new Date().toISOString().slice(0, 10),
    }
    onSave(plan)
  }

  const amountLabel =
    pace === 'verses'
      ? 'Verse-chunks per day'
      : pace === 'section'
        ? 'Sections per day'
        : pace === 'half'
          ? 'Half-chapters per day'
          : 'Chapters per day'

  return (
    <div className="custom-plan" ref={rootRef}>
      <h3>{initial ? 'Edit custom plan' : 'Custom reading plan'}</h3>
      <p className="muted">
        Name your plan, pick books, then choose how readings are sized — including a fixed number of
        verses at a time.
      </p>

      <label className="field-label">
        Plan name
        <input
          className="field"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. John in 3 weeks"
          required
        />
      </label>

      <div className="memory-actions row">
        <button type="button" className="btn tiny ghost-outline" onClick={() => selectGroup('gospels')}>
          Gospels
        </button>
        <button type="button" className="btn tiny ghost-outline" onClick={() => selectGroup('nt')}>
          All NT
        </button>
        <button type="button" className="btn tiny ghost-outline" onClick={() => selectGroup('ot')}>
          All OT
        </button>
        <button type="button" className="btn tiny ghost-outline" onClick={() => selectGroup('clear')}>
          Clear
        </button>
      </div>

      <p className="muted">Old Testament</p>
      <div className="book-grid">
        {BOOKS.filter((b) => b.testament === 'OT').map((b) => (
          <button
            key={b.id}
            type="button"
            className={`book-chip ${selected.includes(b.id) ? 'selected' : ''}`}
            onClick={() => toggle(b.id)}
          >
            {b.name}
          </button>
        ))}
      </div>
      <p className="muted">New Testament</p>
      <div className="book-grid">
        {BOOKS.filter((b) => b.testament === 'NT').map((b) => (
          <button
            key={b.id}
            type="button"
            className={`book-chip ${selected.includes(b.id) ? 'selected' : ''}`}
            onClick={() => toggle(b.id)}
          >
            {b.name}
          </button>
        ))}
      </div>

      <div className="pace-row pace-row-4">
        <button
          type="button"
          className={`plan-card ${pace === 'verses' ? 'selected' : ''}`}
          onClick={() => setPace('verses')}
        >
          <strong>By verses</strong>
          <span className="plan-blurb">Read a set number of verses at a time</span>
        </button>
        <button
          type="button"
          className={`plan-card ${pace === 'section' ? 'selected' : ''}`}
          onClick={() => setPace('section')}
        >
          <strong>Section breaks</strong>
          <span className="plan-blurb">Standard headings inside chapters</span>
        </button>
        <button
          type="button"
          className={`plan-card ${pace === 'chapter' ? 'selected' : ''}`}
          onClick={() => setPace('chapter')}
        >
          <strong>Whole chapters</strong>
          <span className="plan-blurb">One chapter = one unit</span>
        </button>
        <button
          type="button"
          className={`plan-card ${pace === 'half' ? 'selected' : ''}`}
          onClick={() => setPace('half')}
        >
          <strong>Half chapters</strong>
          <span className="plan-blurb">Split each chapter in two</span>
        </button>
      </div>

      {pace === 'verses' && (
        <label className="field-label">
          Verses per reading
          <input
            className="field"
            type="number"
            min={1}
            max={50}
            step={1}
            value={versesPerDay}
            onChange={(e) => setVersesPerDay(Number(e.target.value) || 1)}
          />
        </label>
      )}

      <div className="memory-actions row">
        <button
          type="button"
          className={`btn tiny ${daysMode === 'pace' ? 'primary' : 'ghost-outline'}`}
          onClick={() => setDaysMode('pace')}
        >
          By amount/day
        </button>
        <button
          type="button"
          className={`btn tiny ${daysMode === 'days' ? 'primary' : 'ghost-outline'}`}
          onClick={() => setDaysMode('days')}
        >
          By total days
        </button>
      </div>

      {daysMode === 'pace' ? (
        <label className="field-label">
          {amountLabel}
          <input
            className="field"
            type="number"
            min={1}
            max={Math.max(1, unitCount)}
            step={1}
            value={unitsPerDay}
            onChange={(e) => setUnitsPerDay(Number(e.target.value) || 1)}
          />
        </label>
      ) : (
        <label className="field-label">
          Number of days (1–{Math.max(1, unitCount)})
          <input
            className="field"
            type="number"
            min={1}
            max={Math.max(1, unitCount)}
            value={safeDays}
            onChange={(e) => setDays(Number(e.target.value) || 1)}
          />
        </label>
      )}

      <p className="memory-meta">
        {totalChapters} chapters
        {verseTotal ? ` · ${verseTotal} verses` : ''} · {unitCount} reading unit
        {unitCount === 1 ? '' : 's'} · ~{unitsEachDay.toFixed(1)}/day · {safeDays} days
        {pace === 'verses' ? ` · ~${versesPerDay} verses/unit` : ''}
      </p>

      <div className="session-actions">
        {onCancel && (
          <button type="button" className="btn ghost-outline" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button
          className="btn primary"
          disabled={!selected.length || !name.trim()}
          onClick={save}
        >
          {initial ? 'Save changes' : 'Create & start'}
        </button>
      </div>
    </div>
  )
}
