import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { AriMark } from './AriMark'
import { AriReactionCue } from './AriReactionCue'
import { MascotBanner } from './MascotBanner'
import { mascotLineFor } from '../lib/mascot'
import { createInitialState } from '../lib/types'

function svgClass(el: Element | null): string {
  return el?.getAttribute('class') ?? ''
}

describe('AriMark', () => {
  it('renders quadruped mark with expression and pose classes', () => {
    const { container } = render(
      <AriMark expression="celebrating" pose="celebrate" size={48} animate />,
    )
    const svg = container.querySelector('svg.mascot-mark')
    expect(svg).toBeTruthy()
    const cls = svgClass(svg)
    expect(cls).toContain('ari-full')
    expect(cls).toContain('ari-quad')
    expect(cls).toContain('expr-celebrating')
    expect(cls).toContain('pose-celebrate')
    expect(cls).toContain('mascot-anim')
    expect(container.querySelector('.ari-torso')).toBeTruthy()
    expect(container.querySelector('.ari-leg-l')).toBeTruthy()
    expect(container.querySelector('.ari-tail')).toBeTruthy()
  })

  it('defaults pose from expression when omitted', () => {
    const { container } = render(<AriMark expression="thinking" animate={false} />)
    const svg = container.querySelector('svg.mascot-mark')
    const cls = svgClass(svg)
    expect(cls).toContain('pose-think')
    expect(cls).not.toContain('mascot-anim')
  })

  it('resolves characterState through the animation machine', () => {
    const { container } = render(<AriMark characterState="correct" size={40} />)
    const svg = container.querySelector('svg.mascot-mark')
    const cls = svgClass(svg)
    expect(cls).toContain('ari-state-correct')
    expect(cls).toContain('expr-proud')
    expect(cls).toContain('pose-celebrate')
    expect(cls).toContain('ari-react')
    expect(svg?.getAttribute('data-ari-state')).toBe('correct')
  })

  it('applies pose-run modifier for run state', () => {
    const { container } = render(<AriMark characterState="run" />)
    expect(svgClass(container.querySelector('svg.mascot-mark'))).toContain('pose-run')
    expect(svgClass(container.querySelector('svg.mascot-mark'))).toContain('pose-walk')
  })

  it('falls back to static mark when reduceMotion is set', () => {
    const { container } = render(
      <AriMark characterState="celebrate" reduceMotion />,
    )
    const cls = svgClass(container.querySelector('svg.mascot-mark'))
    expect(cls).toContain('expr-celebrating')
    expect(cls).not.toContain('mascot-anim')
    expect(cls).not.toContain('ari-react')
  })
})

describe('AriReactionCue', () => {
  it('stays silent until active, then shows contextual reaction', () => {
    const idle = render(<AriReactionCue active={false} correct />)
    expect(idle.container.querySelector('.ari-reaction-cue')).toBeNull()

    const ok = render(<AriReactionCue active correct />)
    expect(ok.getByText(/nice catch/i)).toBeTruthy()
    expect(ok.container.querySelector('.ari-reaction-cue.good')).toBeTruthy()
    expect(ok.container.querySelector('svg.mascot-mark')?.getAttribute('data-ari-state')).toBe(
      'correct',
    )

    const miss = render(<AriReactionCue active correct={false} />)
    expect(miss.getByText(/keep going/i)).toBeTruthy()
    expect(miss.container.querySelector('.ari-reaction-cue.risk')).toBeTruthy()
    expect(miss.container.querySelector('svg.mascot-mark')?.getAttribute('data-ari-state')).toBe(
      'encourage',
    )
  })
})

describe('MascotBanner', () => {
  it('passes pose from mascot line into AriMark', () => {
    const user = createInitialState('A', 'year')
    const line = mascotLineFor('celebrate', user, { streakMilestone: 7 })
    const { container } = render(<MascotBanner line={line} compact />)
    const svg = container.querySelector('svg.mascot-mark')
    expect(svgClass(svg)).toContain('pose-jump')
    expect(container.querySelector('.mascot-banner.mood-celebrating')).toBeTruthy()
  })
})
