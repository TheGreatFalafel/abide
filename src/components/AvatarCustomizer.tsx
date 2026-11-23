'use client'

import {
  BROWS,
  CLOTHES,
  EXPRESSIONS,
  FACE_SHAPES,
  FACIAL_HAIR,
  HAIR_COLORS,
  HAIR_STYLES,
  LOOKS,
  SKIN_TONES,
  type AvatarAppearance,
} from '../data/cosmetics/appearance'
import {
  migrateCosmeticsState,
  setAppearance,
  type CosmeticsState,
} from '../lib/cosmetics'
import type { UserState } from '../lib/types'
import { AbideAvatar } from './AbideAvatar'

type Props = {
  user: UserState
  onUserChange: (user: UserState) => void
  previewEquipped?: Partial<CosmeticsState['equipped']>
  previewLabel?: string | null
}

type Opt<T extends string> = { id: T; name: string; color?: string }

function selectedName<T extends string>(options: Opt<T>[], value: T) {
  return options.find((o) => o.id === value)?.name ?? value
}

/** Equal-width segmented control (Look, short lists). */
function SegmentRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: Opt<T>[]
  value: T
  onChange: (id: T) => void
}) {
  return (
    <fieldset className="avatar-opt-row">
      <legend>{label}</legend>
      <div className="avatar-segments" role="listbox" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            role="option"
            aria-selected={value === o.id}
            className={`avatar-segment ${value === o.id ? 'active' : ''}`}
            onClick={() => onChange(o.id)}
          >
            {o.name}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

/** Compact color disks; current name lives in the legend. */
function ColorRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: Opt<T>[]
  value: T
  onChange: (id: T) => void
}) {
  return (
    <fieldset className="avatar-opt-row">
      <legend>
        {label}
        <span className="avatar-opt-current">{selectedName(options, value)}</span>
      </legend>
      <div className="avatar-color-row" role="listbox" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            role="option"
            aria-selected={value === o.id}
            aria-label={o.name}
            title={o.name}
            className={`avatar-color-dot ${value === o.id ? 'active' : ''}`}
            style={{ background: o.color ?? 'var(--mist)' }}
            onClick={() => onChange(o.id)}
          />
        ))}
      </div>
    </fieldset>
  )
}

function ChipRow<T extends string>({
  label,
  options,
  value,
  onChange,
  swatch,
}: {
  label: string
  options: Opt<T>[]
  value: T
  onChange: (id: T) => void
  swatch?: boolean
}) {
  return (
    <fieldset className="avatar-opt-row">
      <legend>
        {label}
        <span className="avatar-opt-current">{selectedName(options, value)}</span>
      </legend>
      <div className="avatar-opt-chips" role="listbox" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            role="option"
            aria-selected={value === o.id}
            className={`avatar-chip ${value === o.id ? 'active' : ''}`}
            title={o.name}
            onClick={() => onChange(o.id)}
          >
            {swatch && o.color ? (
              <span className="avatar-swatch" style={{ background: o.color }} aria-hidden />
            ) : null}
            <span>{o.name}</span>
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export function AvatarCustomizer({
  user,
  onUserChange,
  previewEquipped,
  previewLabel,
}: Props) {
  const cosmetics = migrateCosmeticsState(user.cosmetics)
  const appearance = cosmetics.appearance

  function patch(partial: Partial<AvatarAppearance>) {
    onUserChange({
      ...user,
      cosmetics: setAppearance(cosmetics, partial),
    })
  }

  return (
    <section className="avatar-customizer" data-avatar-studio="v2" aria-label="Customize appearance">
      <header className="avatar-studio-head">
        <div className="avatar-customizer-stage">
          <AbideAvatar
            user={user}
            size="lg"
            animate
            interactive
            previewEquipped={previewEquipped}
          />
        </div>
        <div className="avatar-customizer-copy">
          <h3>Your look</h3>
          <p className="muted">
            Free face, hair, and clothes. Gem backgrounds and accessories sit below.
          </p>
          {previewLabel ? (
            <p className="avatar-preview-cue" role="status">
              Previewing {previewLabel}
            </p>
          ) : null}
        </div>
      </header>

      <div className="avatar-customizer-controls">
        <div className="avatar-group">
          <h4 className="avatar-group-title">Face</h4>
          <SegmentRow
            label="Look"
            options={LOOKS}
            value={appearance.look}
            onChange={(look) => patch({ look })}
          />
          <SegmentRow
            label="Shape"
            options={FACE_SHAPES}
            value={appearance.faceShape}
            onChange={(faceShape) => patch({ faceShape })}
          />
          <ColorRow
            label="Skin"
            options={SKIN_TONES}
            value={appearance.skin}
            onChange={(skin) => patch({ skin })}
          />
          <SegmentRow
            label="Brows"
            options={BROWS}
            value={appearance.brows}
            onChange={(brows) => patch({ brows })}
          />
          <SegmentRow
            label="Expression"
            options={EXPRESSIONS}
            value={appearance.expression}
            onChange={(expression) => patch({ expression })}
          />
          <SegmentRow
            label="Facial hair"
            options={FACIAL_HAIR}
            value={appearance.facialHair}
            onChange={(facialHair) => patch({ facialHair })}
          />
        </div>

        <div className="avatar-group">
          <h4 className="avatar-group-title">Hair</h4>
          <ChipRow
            label="Style"
            options={HAIR_STYLES}
            value={appearance.hair}
            onChange={(hair) => patch({ hair })}
          />
          <ColorRow
            label="Color"
            options={HAIR_COLORS}
            value={appearance.hairColor}
            onChange={(hairColor) => patch({ hairColor })}
          />
        </div>

        <div className="avatar-group">
          <h4 className="avatar-group-title">Clothes</h4>
          <ChipRow
            label="Outfit"
            options={CLOTHES}
            value={appearance.clothes}
            onChange={(clothes) => patch({ clothes })}
            swatch
          />
        </div>
      </div>
    </section>
  )
}
