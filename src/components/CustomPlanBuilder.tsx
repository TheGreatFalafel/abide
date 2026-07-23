'use client'

import { useMemo, useState } from 'react'
import { BOOKS, chaptersFrom, chunkPassages } from '../data/bible'
import type { CustomPlan } from '../lib/types'

type Props = {
  onCreate: (plan: CustomPlan) => void
}

export function CustomPlanBuilder({ onCreate }: Props) {
  const [selected, setSelected] = useState<string[]>(['john'])
  const [days, setDays] = useState(21)
  const [name, setName] = useState('')

  const totalChapters = useMemo(() => {
    return selected.reduce((sum, id) => {
      const book = BOOKS.find((b) => b.id === id)
      return sum + (book?.chapters ?? 0)
    }, 0)
  }, [selected])

  const maxDays = Math.max(1, totalChapters)
  const safeDays = Math.min(Math.max(1, days), maxDays)
  const perDay = totalChapters ? (totalChapters / safeDays).toFixed(1) : '0'

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

  function create() {
    if (!selected.length || totalChapters < 1) return
    const bookNames = selected
      .map((id) => BOOKS.find((b) => b.id === id)?.name)
      .filter(Boolean)
    const label =
      name.trim() ||
      (bookNames.length <= 3
        ? bookNames.join(', ')
        : `${bookNames[0]} + ${bookNames.length - 1} more`)
    const plan: CustomPlan = {
      id: `custom-${Date.now()}`,
      name: `${label} (${safeDays}d)`,
      bookIds: selected,
      days: safeDays,
      createdAt: new Date().toISOString().slice(0, 10),
    }
    // Validate generation works
    chunkPassages(chaptersFrom(plan.bookIds), plan.days)
    onCreate(plan)
  }

  return (
    <div className="custom-plan">
      <h3>Custom reading plan</h3>
      <p className="muted">
        Pick books and how many days to spread them across. About {perDay} chapter
        {perDay === '1.0' ? '' : 's'}/day.
      </p>

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

      <label className="field-label">
        Plan name (optional)
        <input
          className="field"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My John plan"
        />
      </label>

      <label className="field-label">
        Number of days (1–{maxDays})
        <input
          className="field"
          type="number"
          min={1}
          max={maxDays}
          value={safeDays}
          onChange={(e) => setDays(Number(e.target.value) || 1)}
        />
      </label>

      <p className="memory-meta">
        {totalChapters} chapters · {selected.length} book{selected.length === 1 ? '' : 's'} ·{' '}
        {safeDays} days
      </p>

      <button
        className="btn primary"
        disabled={!selected.length}
        onClick={create}
      >
        Create & start this plan
      </button>
    </div>
  )
}
