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
  it('renders full-body mark with expression and pose classes', () => {
    const { container } = render(
      <AriMark expression="celebrating" pose="celebrate" size={48} animate />,
    )
    const svg = container.querySelector('svg.mascot-mark')
    expect(svg).toBeTruthy()
    const cls = svgClass(svg)
    expect(cls).toContain('ari-full')
    expect(cls).toContain('expr-celebrating')
    expect(cls).toContain('pose-celebrate')
    expect(cls).toContain('mascot-anim')
    expect(container.querySelector('.ari-torso')).toBeTruthy()
    expect(container.querySelector('.ari-legs')).toBeTruthy()
    expect(container.querySelector('.ari-tail')).toBeTruthy()
  })

  it('defaults pose from expression when omitted', () => {
    const { container } = render(<AriMark expression="thinking" animate={false} />)
    const svg = container.querySelector('svg.mascot-mark')
    const cls = svgClass(svg)
    expect(cls).toContain('pose-think')
    expect(cls).not.toContain('mascot-anim')
  })
})

describe('AriReactionCue', () => {
  it('stays silent until active, then shows contextual reaction', () => {
    const idle = render(<AriReactionCue active={false} correct />)
    expect(idle.container.querySelector('.ari-reaction-cue')).toBeNull()

    const ok = render(<AriReactionCue active correct />)
    expect(ok.getByText(/nice catch/i)).toBeTruthy()
    expect(ok.container.querySelector('.ari-reaction-cue.good')).toBeTruthy()

    const miss = render(<AriReactionCue active correct={false} />)
    expect(miss.getByText(/keep going/i)).toBeTruthy()
    expect(miss.container.querySelector('.ari-reaction-cue.risk')).toBeTruthy()
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
