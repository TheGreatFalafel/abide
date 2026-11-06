# Abide — Rive Character Foundation

Rive is the **primary long-term character animation runtime**. SVG (`AriMark`, `AbideAvatar`) remains the graceful fallback. The optional WebGL Ari path stays opt-in and does not replace Rive.

---

## Audit summary

| Layer | Status |
|-------|--------|
| Official runtime | `@rive-app/react-canvas` (React wrapper) |
| Shared host | `src/components/rive/RiveCharacter.tsx` |
| Ari | `src/components/rive/Ari.tsx` → `public/rive/ari.riv` |
| App events | `CharacterEvent` in `src/lib/animation/characterEvents.ts` |
| Feedback bridge | `AnimationFeedbackEvent` → `CharacterEvent` → Ari/Rive |
| Human avatar live UI | `AbideAvatar` + cosmetics inventory (**unchanged**) |
| Avatar Rive prep | `AvatarRive` + `AVATAR_RIVE_CONTRACT` (loads only when `/rive/avatar.riv` exists) |
| 3D experiment | `AriCompanion` / `Ari3D` behind `NEXT_PUBLIC_ARI_3D` + missing GLB |

**Artwork approach (current):** Gemini pose plates in `rive/ari/assets/pose-*.png` (stand / sit / think / walk / sleep). Motion is long opacity **ghost-fades** between plates plus a soft root breathe/bob — not bone/mesh rigging. Rebuild with `rive rive/ari --once` and copy `rive/ari/build/ari.riv` → `public/rive/ari.riv`.

---

## Asset locations

| Asset | Path | Role |
|-------|------|------|
| Ari runtime | `public/rive/ari.riv` | Served to the app |
| Ari authoring | `rive/ari/` (`scene.rml`, `rive.yaml`, painted PNGs) | Source of truth |
| Ari build output | `rive/ari/build/ari.riv` | Local CLI build |
| Avatar runtime (future) | `public/rive/avatar.riv` | Not shipped yet |

### Replace / ship a new Ari `.riv`

```bash
# From repo root (Rive CLI on PATH)
rive rive/ari --once
# Windows
copy rive\ari\build\ari.riv public\rive\ari.riv
# macOS / Linux
cp rive/ari/build/ari.riv public/rive/ari.riv
```

After copying, hard-refresh the app. No code change is required if artboard / state machine / trigger names match the contract below.

`rive <project> --once` writes an unsigned `.riv`. That is the local build for a file with no scripts, which is what `rive/ari` is today. A file that contains scripts has to be built with `rive <project> --publish` before a web runtime will play those scripts. Publishing can watermark the graphic and counts against the free-plan CLI allowance. The agent workflow, verification commands, and those limits are in `docs/rive-cli-workflow.md`.

An isolated proof of concept lives in `rive/poc-idle/`. It is not wired into `Ari` and must not be copied over `public/rive/ari.riv`.

A second experiment, `rive/poc-image-animation/`, tests multi-PNG Solo swaps and opacity morphs for Gemini artwork. Details: `docs/rive-cli-image-animation.md`. Also not wired into production.

---

## Ari contract

| Field | Value |
|-------|-------|
| URL | `/rive/ari.riv` |
| Artboard | `Ari` |
| State machine | `AriSM` |
| Aspect | 520×400 |

Implemented as `ARI_RIVE_CONTRACT` in `src/lib/animation/riveAri.ts`.

### CharacterEvent → Ari SM triggers

| `CharacterEvent` | Rive trigger | Loop |
|------------------|--------------|------|
| `idle` | `idle` | yes |
| `walk` | `walk` | yes |
| `run` | `run` | yes |
| `think` | `think` | yes |
| `sleep` | `sleep` | yes (author in `.riv`; missing trigger → keep current / idle) |
| `greet` | `greet` | one-shot |
| `jump` | `jump` | one-shot |
| `celebrate` | `celebrate` | one-shot |
| `encourage` | `encourage` | one-shot |
| `react_correct` | `correct` | one-shot |
| `react_incorrect` | `encourage` | one-shot |

Legacy product states (`guide`, `correct`, `levelUp`, `milestone`, …) still work via `characterState` on `Ari` / `AriRive`.

### Required authoring checklist for a replacement `ari.riv`

1. Artboard named **`Ari`**, state machine named **`AriSM`**.
2. Trigger inputs for every row in the table (at minimum the non-`sleep` set already shipping).
3. Looping timelines for `idle` / `walk` / `run` / `think` / `sleep`.
4. One-shot timelines that can return to idle without blocking UI input (`AnyState` → trigger is fine).
5. Transparent / soft ground so Ari composites into banners and cues.
6. Quadruped lion silhouette readable at ~48–96 CSS px (Storybook Warmth / approved reference).

---

## Application API

```tsx
import { Ari } from '@/components/rive/Ari'
import type { CharacterEvent } from '@/lib/animation'

<Ari event="react_correct" size={48} />
<Ari characterState="greet" size={96} />  // legacy bridge
```

Shared host for a second character:

```tsx
import { RiveCharacter } from '@/components/rive/RiveCharacter'
import { AVATAR_RIVE_CONTRACT } from '@/lib/animation'

<RiveCharacter
  contract={AVATAR_RIVE_CONTRACT}
  trigger="idle"
  numberInputs={{ hairStyle: 2, top: 1 }}
  fallback={<AbideAvatar ... />}
/>
```

### Feedback → events (non-blocking)

| Feedback | CharacterEvent |
|----------|----------------|
| `answer_selected` | `idle` (no spam) |
| `correct_answer` | `react_correct` |
| `incorrect_answer` | `react_incorrect` |
| `lesson_completed` / `level_up` | `celebrate` |
| `achievement_unlocked` / `streak_milestone` | `celebrate` |

Progress, XP, gems, and navigation stay outside this layer.

### Reduced motion & errors

- `prefers-reduced-motion: reduce` → SVG / static fallback; Rive canvas is not required.
- Load errors → fallback; triggers that are missing in the file are ignored (no throw).
- Vitest / SSR → fallback only (no duplicate Rive instances in tests).

---

## Avatar Rive preparation (do not remove SVG cosmetics)

| Piece | Path |
|-------|------|
| Contract | `src/lib/animation/avatarRive.ts` |
| Host | `src/components/rive/AvatarRive.tsx` |
| Live customizer | `AbideAvatar`, `AvatarCustomizer`, `cosmetics/*` |

When `public/rive/avatar.riv` is added:

1. Artboard `Avatar`, state machine `AvatarSM`.
2. Same `CharacterEvent` triggers (or aliases documented in the contract).
3. Number inputs for cosmetic slots: `skinTone`, `hairStyle`, `hairColor`, `top`, `bottom`, `accessory`, `frame`, `expression`.
4. Wire catalog IDs → enum indices in a follow-up; keep inventory purchase/equip logic as-is.

Until that file exists, `AvatarRive` never initializes the runtime and always shows the provided SVG fallback.

---

## Tests

- `src/lib/animation/characterEvents.test.ts` — event normalization & feedback mapping
- `src/lib/animation/riveAri.test.ts` — Ari asset / trigger contracts
- `src/lib/animation/riveCharacter.test.ts` — binding helpers
- `src/lib/animation/avatarRive.test.ts` — avatar contract + probe
- `src/components/rive/Ari.test.tsx` — fallback / event dispatch attributes
- Existing `ariMachine` / `AriMark` / reaction cue tests remain the SVG bridge coverage
