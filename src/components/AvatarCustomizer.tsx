'use client'

import {
  CLOTHES,
  FACES,
  HAIR_COLORS,
  HAIR_STYLES,
  SKIN_TONES,
  type AvatarAppearance,
} from '../data/cosmetics/appearance'
import { migrateCosmeticsState, setAppearance } from '../lib/cosmetics'
import type { UserState } from '../lib/types'
import { AbideAvatar } from './AbideAvatar'

type Props = {
  user: UserState
  onUserChange: (user: UserState) => void
}

function OptionRow<T extends string>({
  label,
  options,
  value,
  onChange,
  swatch,
}: {
  label: string
  options: { id: T; name: string; color?: string }[]
  value: T
  onChange: (id: T) => void
  swatch?: boolean
}) {
  return (
    <fieldset className="avatar-opt-row">
      <legend>{label}</legend>
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

export function AvatarCustomizer({ user, onUserChange }: Props) {
  const cosmetics = migrateCosmeticsState(user.cosmetics)
  const appearance = cosmetics.appearance

  function patch(partial: Partial<AvatarAppearance>) {
    onUserChange({
      ...user,
      cosmetics: setAppearance(cosmetics, partial),
    })
  }

  return (
    <section className="avatar-customizer" aria-label="Customize appearance">
      <div className="avatar-customizer-preview">
        <AbideAvatar user={user} size="lg" />
        <div>
          <h3>Your look</h3>
          <p className="muted">
            Skin, hair, face, and basic clothes are free. Outfits, backgrounds, accessories, and
            frames are in the gem shop below.
          </p>
        </div>
      </div>

      <OptionRow
        label="Skin tone"
        options={SKIN_TONES}
        value={appearance.skin}
        onChange={(skin) => patch({ skin })}
        swatch
      />
      <OptionRow
        label="Hair style"
        options={HAIR_STYLES}
        value={appearance.hair}
        onChange={(hair) => patch({ hair })}
      />
      <OptionRow
        label="Hair color"
        options={HAIR_COLORS}
        value={appearance.hairColor}
        onChange={(hairColor) => patch({ hairColor })}
        swatch
      />
      <OptionRow
        label="Expression"
        options={FACES}
        value={appearance.face}
        onChange={(face) => patch({ face })}
      />
      <OptionRow
        label="Basic clothes"
        options={CLOTHES}
        value={appearance.clothes}
        onChange={(clothes) => patch({ clothes })}
        swatch
      />
    </section>
  )
}
