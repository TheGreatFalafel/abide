import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TOUR_STEPS } from '../lib/ariTour'
import { GuidedTour } from './GuidedTour'

afterEach(() => cleanup())

describe('GuidedTour controls', () => {
  it('supports Back, Next, Skip, and Finish', () => {
    const onNavigate = vi.fn()
    const onComplete = vi.fn()
    const onFinishGoRead = vi.fn()

    render(
      <GuidedTour
        open
        onNavigate={onNavigate}
        onComplete={onComplete}
        onFinishGoRead={onFinishGoRead}
      />,
    )

    expect(screen.getByRole('dialog')).toBeTruthy()
    expect(screen.getByText(TOUR_STEPS[0]!.title)).toBeTruthy()
    expect(onNavigate).toHaveBeenCalledWith(TOUR_STEPS[0]!.view)

    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText(TOUR_STEPS[1]!.title)).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByText(TOUR_STEPS[0]!.title)).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Skip' }))
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onFinishGoRead).not.toHaveBeenCalled()
  })

  it('Finish completes and guides toward Read', () => {
    const onNavigate = vi.fn()
    const onComplete = vi.fn()
    const onFinishGoRead = vi.fn()

    render(
      <GuidedTour
        open
        onNavigate={onNavigate}
        onComplete={onComplete}
        onFinishGoRead={onFinishGoRead}
      />,
    )

    for (let i = 0; i < TOUR_STEPS.length - 1; i++) {
      fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    }
    expect(screen.getByText(TOUR_STEPS[TOUR_STEPS.length - 1]!.title)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Finish' }))
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onFinishGoRead).toHaveBeenCalledTimes(1)
  })

  it('renders nothing when closed', () => {
    const { container } = render(
      <GuidedTour
        open={false}
        onNavigate={() => {}}
        onComplete={() => {}}
        onFinishGoRead={() => {}}
      />,
    )
    expect(container.querySelector('.guided-tour')).toBeNull()
  })
})
