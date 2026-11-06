import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Ari } from './Ari'
import { RiveCharacter } from './RiveCharacter'
import { AvatarRive } from './AvatarRive'

describe('Ari Rive foundation', () => {
  it('falls back to SVG in Vitest and exposes character state', () => {
    const { container } = render(<Ari characterState="celebrate" size={48} />)
    const svg = container.querySelector('svg.mascot-mark')
    expect(svg).toBeTruthy()
    expect(svg?.getAttribute('data-ari-state')).toBe('celebrate')
    expect(container.querySelector('[data-rive-engine="rive"]')).toBeNull()
  })

  it('dispatches CharacterEvent onto the Ari state bridge', () => {
    const { container } = render(<Ari event="react_correct" size={40} />)
    const svg = container.querySelector('svg.mascot-mark')
    expect(svg?.getAttribute('data-ari-state')).toBe('correct')
    expect(svg?.getAttribute('class') ?? '').toContain('expr-proud')
  })

  it('maps react_incorrect to the encourage presentation', () => {
    const { container } = render(<Ari event="react_incorrect" />)
    const cls = container.querySelector('svg.mascot-mark')?.getAttribute('class') ?? ''
    expect(cls).toContain('ari-state-encourage')
    expect(cls).toContain('expr-comforting')
  })

  it('supports sleep without breaking the SVG fallback', () => {
    const { container } = render(<Ari event="sleep" />)
    expect(container.querySelector('svg.mascot-mark')?.getAttribute('data-ari-state')).toBe(
      'sleep',
    )
  })

  it('forceFallback skips Rive initialization', () => {
    const { container } = render(
      <Ari characterState="walk" forceFallback fallbackProps={{ animate: false }} />,
    )
    expect(container.querySelector('svg.mascot-mark')).toBeTruthy()
    expect(container.querySelector('canvas')).toBeNull()
  })
})

describe('RiveCharacter fallback', () => {
  it('renders fallback when forced and does not mount a canvas', () => {
    const { container, getByText } = render(
      <RiveCharacter
        src="/rive/ari.riv"
        stateMachine="AriSM"
        forceFallback
        fallback={<span>static stand-in</span>}
      />,
    )
    expect(getByText('static stand-in')).toBeTruthy()
    expect(container.querySelector('[data-rive-engine="fallback"]')).toBeTruthy()
    expect(container.querySelector('canvas')).toBeNull()
  })

  it('falls back when src is missing', () => {
    const { getByText } = render(
      <RiveCharacter src="" stateMachine="AriSM" fallback={<span>missing asset</span>} />,
    )
    expect(getByText('missing asset')).toBeTruthy()
  })
})

describe('AvatarRive preparation', () => {
  it('keeps the SVG fallback when avatar.riv is absent', () => {
    const { container, getByText } = render(
      <AvatarRive event="greet" fallback={<span>AbideAvatar stand-in</span>} />,
    )
    expect(getByText('AbideAvatar stand-in')).toBeTruthy()
    expect(container.querySelector('[data-avatar-engine="svg"]')).toBeTruthy()
    expect(container.querySelector('[data-avatar-event="greet"]')).toBeTruthy()
    expect(container.querySelector('canvas')).toBeNull()
  })
})
