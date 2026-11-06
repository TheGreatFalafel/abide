# Abide — Phase C Visual Foundation

Professional character art, Rive animation, and visual system foundation.

---

## 1. Architecture audit (retain / adapt / replace)

| Area | Decision |
|------|----------|
| `src/lib/animation/*` event → state contracts | **Retain** — Rive fires the same product states |
| `mascot.ts` copy / contexts / reactions | **Retain** — never duplicate progress logic |
| `AriMark` SVG + CSS poses | **Adapt** → **SVG fallback** when Rive fails / reduced-motion / tests |
| `MascotBanner`, `AriReactionCue`, `Celebration` | **Adapt** — render via `AriRive` |
| Game registry / lesson / XP / gems / sync | **Retain** untouched |
| Avatar cosmetics pipeline | **Retain** data model; **adapt** renderer toward Storybook Warmth |
| Phase A “defer Rive” recommendation | **Superseded** by this phase |

---

## 2. Character art directions (mockups)

Files in `docs/phase-c/mockups/`:

| Direction | File | Character |
|-----------|------|-----------|
| **A — Storybook Warmth** | `ari-direction-a-storybook.jpg` | Soft painterly honey-gold lion, layered mane, friendly confidence |
| **B — Editorial Companion** | `ari-direction-b-editorial.jpg` | Graphic bronze mane, calm guide pose, parchment/teal |
| **C — Playful Courage** | `ari-direction-c-playful.jpg` | Brighter game-art energy, copper-tipped mane, cheer stance |
| Avatar (A) | `avatar-direction-a-storybook.jpg` | Matching human learner illustration |
| Home UI (A) | `ui-home-direction-a.jpg` | Path home mock using Storybook Warmth |
| Rive idle frame | `ari-rive-painted-idle.png` | Compiled **painted** Ari from `rive/ari` (ImageAssets) |

### Recommendation: **Direction A — Storybook Warmth** (revised)

**Locked product direction (user feedback):**

- Keep Direction A’s painterly honey-gold / chestnut mane look.
- Ari is a **real lion**: walks on **four legs**, or **sits / lies** at rest — **not** upright, **not** anthropomorphic / human-like.
- Borrow Direction C’s **clear facial emotion** (brows, eyes, mouth readable at small sizes).
- Human avatar stays Direction A for now (no change until requested).

Updated mockups:

| File | Content |
|------|---------|
| `ari-quad-idle-sit.jpg` | Sitting quadruped Ari (A style) |
| `ari-quad-expressions.jpg` | Face sheet with C-level emotion clarity |
| `ari-rive-painted-idle.png` | Compiled Rive idle (painted ImageAssets — current runtime look) |

**Runtime art approach:** `rive/ari` embeds Storybook Warmth **painted** PNGs (`assets/sit-*.png`, `walk.png`) and swaps them via a Solo + root motion timelines. The early ellipse/vector stand-in looked like SVG on purpose as a placeholder and is retired. SVG `AriMark` remains fallback only.

Direction B remains a marketing alternate. Direction C’s body language is not used; only its facial expressiveness.

---

## 3. Rive asset & state machine

### Source of truth

| Path | Role |
|------|------|
| `rive/ari/scene.rml` | Authored character + timelines + `AriSM` |
| `rive/ari/rive.yaml` | CLI project config |
| `rive/ari/build/ari.riv` | Local unsigned build (`rive . --once` / screenshot) |
| `public/rive/ari.riv` | Runtime copy served to the app |

Rebuild:

```bash
# from repo root (PATH includes ~/.rive/bin)
rive rive/ari --once
copy rive\ari\build\ari.riv public\rive\ari.riv
```

### Artboard

- Name: `Ari`
- Size: **520×400** (landscape; quadruped silhouette)
- Soft transparent ground; no opaque page fill (composites into UI)
- Body: horizontal torso, four legs, mane + expressive face (brows / eyes / mouth)

### State machine `AriSM`

**Triggers (inputs):** `idle`, `greet`, `walk`, `run`, `jump`, `think`, `guide`, `correct`, `encourage`, `celebrate`, `milestone`

| Trigger | Timeline | Loop | Returns to idle |
|---------|----------|------|-----------------|
| `idle` | sit, breathe, blink, soft tail | yes | — |
| `greet` | head lift, ear perk, wider smile | one-shot | exitTime 100% |
| `walk` | four-leg gait | yes | until next trigger |
| `run` | faster four-leg | yes | until next trigger |
| `jump` | crouch → pounce | one-shot | yes |
| `think` | head tilt + knit brows + small mouth | yes | until next trigger |
| `guide` | attentive look + ear forward | yes | until next trigger |
| `correct` | proud smile + tail wag | one-shot | yes |
| `encourage` | soft eyes + gentle smile | one-shot | yes |
| `celebrate` | sit-bounce + joyful mouth + tail | one-shot | yes |
| `milestone` | pounce + celebration face | one-shot | yes |

`AnyState` → trigger conditions so app events can interrupt safely. Blend durations 100–180ms.

### Product ↔ Rive mapping

Prefer application `CharacterEvent` (see `docs/rive-characters.md`). Legacy `AriCharacterState` still maps:

| `AriCharacterState` / `CharacterEvent` | Rive trigger |
|----------------------------------------|--------------|
| `idle`, `blink` | `idle` |
| `greet` | `greet` |
| `walk` / `run` / `think` / `guide` / `sleep` | same names |
| `correct` / `react_correct` | `correct` |
| `encourage` / `react_incorrect` | `encourage` |
| `celebrate` / `jump` / `milestone` | same names |

Implemented in `src/lib/animation/riveAri.ts` + `characterEvents.ts`.

### React contract

```ts
// Ari (preferred) / AriRive (compat)
src: '/rive/ari.riv'
artboard: 'Ari'
stateMachines: 'AriSM'
// on event / characterState change → useStateMachineInput(...).fire()
// Shared host: RiveCharacter
```

Package: `@rive-app/react-canvas` (official React wrapper; peer React 19 compatible).

**Fallback:** `AriMark` SVG when load error, `prefers-reduced-motion`, Vitest, or missing canvas.

**Human avatar:** Live UI stays on `AbideAvatar` + cosmetics inventory. `AvatarRive` / `AVATAR_RIVE_CONTRACT` prepare `/rive/avatar.riv` without removing customization.

---

## 4. Application integration

- `MascotBanner` / `AriReactionCue` → `AriRive` (events still via `ariPresentationFromFeedback` / `mascotLineFor`).
- XP, gems, achievements, lessons, games, sync: **unchanged**.
- No random idle trigger spam — only mapped feedback / banner context.

---

## 5. Visual design tokens (initial)

In `app.css` `:root` (Storybook Warmth):

- `--honey`, `--mane`, `--sage`, `--cream`
- Spacing: `--space-1` … `--space-4`
- Radii: `--radius`, `--radius-sm`
- Ari slot: `--ari-slot-w` / `--ari-slot-h` (reserve space → reduce CLS)

Representative screens validated first: **Home (Path banner)**, **Games answer cue**. Broader Learn / Witness / Shop redesigns follow the same tokens without a big-bang rewrite.

---

## 6. Performance & accessibility

- Single Ari `.riv` ~4.6KB (vector) — suitable for mobile.
- Intersection-friendly canvas; SVG fallback under reduced motion.
- Fixed Ari slot dimensions avoid layout shift while loading.
- Keyboard / touch game controls unchanged; Ari remains `aria-hidden` with text in the banner/cue.

---

## 7. Verification checklist

- [x] Three Ari art directions + recommendation documented with mockups
- [x] Real `ari.riv` built from RML (11 animations, 11 triggers) — not a static placeholder
- [x] React runtime wired; event layer reused
- [x] SVG graceful fallback
- [x] Browser: `data-ari-engine="rive"` on Home (`greet`) + Trivia correct cue (`correct`) with live canvas pixels
- [x] Mobile viewport (390×844) smoke on Trivia cue
- [x] `npm test` 273 passed; `oxlint` exit 0; `tsc` only pre-existing `historyIntegrity` errors
