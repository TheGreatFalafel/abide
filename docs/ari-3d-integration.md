# Abide — Ari 3D Integration

Foundation for a premium, rigged 3D Ari character (React Three Fiber / Three.js), wired into the existing animation event layer without changing XP, gems, rewards, or lesson logic.

> **Status:** Runtime + event mapping + preview are integrated. The production **rigged GLB is not in the repo**. Until `public/characters/ari/ari.glb` exists, product UI continues on **Rive → SVG**. The supplied reference image is art direction only — not a model.

Visual target: `docs/ari-3d-visual-target.png` (warm golden lion, layered brown mane, film-style lighting). Asset contract: `docs/ASSET_CONTRACT.md`.

---

## 1. How it fits the existing architecture

| Layer | Role after this integration |
|-------|-----------------------------|
| `src/lib/animation/types.ts` | Product states + feedback events (extended with `jump`, `levelUp`, `level_up`) |
| `ariMachine.ts` | Event → state → SVG presentation (unchanged responsibility) |
| `riveAri.ts` | State → Rive triggers (`jump`/`levelUp` alias onto existing clips) |
| **`ari3d.ts` (new)** | State / feedback → `AriMotion` clip names; GLB probe; product opt-in flag |
| `AriRive` / `AriMark` | **Still the shipping fallback** |
| **`Ari3D` / `AriCompanion` (new)** | WebGL player + unified entry that prefers 3D only when safe |
| `MascotBanner` | Uses `AriCompanion` (falls through to Rive/SVG today) |
| `AriReactionCue` | Stays on `AriRive` (48px — avoid tiny WebGL canvases) |

Do **not** invent a second mood/event system. Product code should keep emitting `AnimationFeedbackEvent` / `AriCharacterState`.

---

## 2. Files added / modified

### Added

| Path | Purpose |
|------|---------|
| `src/components/ari3d/Ari3D.tsx` | Client WebGL character + blend/reduced-motion |
| `src/components/ari3d/Ari3D.types.ts` | `AriMotion`, clip map, props |
| `src/components/ari3d/Ari3D.css` | Layout, loading/error shells (no CLS-prone jumps) |
| `src/components/ari3d/AriCompanion.tsx` | 3D ↔ Rive ↔ SVG selection |
| `src/components/ari3d/index.ts` | Barrel exports |
| `src/lib/animation/ari3d.ts` | Motion bridge + model probe |
| `src/lib/animation/ari3d.test.ts` | Unit tests for the bridge |
| `src/app/dev/ari-3d/page.tsx` | Dev-only preview route |
| `src/app/dev/ari-3d/Ari3DPreview.tsx` | Motion / sizing / fallback harness |
| `public/characters/ari/README.md` | Drop zone for `ari.glb` |
| `docs/ASSET_CONTRACT.md` | Model + clip contract |
| `docs/ari-3d-visual-target.png` | Art-direction reference |
| `docs/ari-3d-integration.md` | This document |

### Modified

| Path | Change |
|------|--------|
| `package.json` / lockfile | `three`, `@react-three/fiber@9`, `@react-three/drei`, `@types/three` |
| `src/lib/animation/types.ts` | `jump`, `levelUp`, `level_up` event |
| `src/lib/animation/ariMachine.ts` | Specs + feedback mapping for new states |
| `src/lib/animation/riveAri.ts` | Alias new states onto existing Rive triggers |
| `src/lib/animation/index.ts` | Re-export 3D bridge |
| `src/components/MascotBanner.tsx` | Render via `AriCompanion` |
| `docs/animation-architecture.md` | Pointer to 3D foundation |
| Tests for ariMachine / riveAri | Expect extended state list |

---

## 3. Dependencies

Installed against **React 19.2** / **Next 15.5** (no React/Next upgrades):

- `three@^0.187`
- `@react-three/fiber@^9.8` (React 19 line)
- `@react-three/drei@^10.7`
- `@types/three@^0.187` (dev)

---

## 4. Event → motion mapping

| Feedback event | `AriCharacterState` | `AriMotion` (GLB clip key) |
|----------------|---------------------|----------------------------|
| `answer_selected` | `idle` | `idle` |
| `correct_answer` | `correct` | `correct` |
| `incorrect_answer` | `encourage` | `encourage` |
| `matching_completed` / `exercise_completed` | `correct` / `encourage` | same |
| `lesson_completed` | `celebrate` | `celebrate` |
| `level_up` | `levelUp` | `levelUp` |
| `achievement_unlocked` / `streak_milestone` | `milestone` | `milestone` |

Product states `walk`, `run`, `think`, `guide`, `greet`, `jump` are available for explicit UI (tour, banners) without new reward logic. `blink` → 3D `idle`.

Default GLB clip names: `Idle`, `Greet`, `Walk`, `Run`, `Think`, `Guide`, `Correct`, `Encourage`, `Celebrate`, `Jump`, `LevelUp`, `Milestone` (overridable via `animationMap`).

---

## 5. Adding the final GLB

1. Produce a skinned lion matching `docs/ASSET_CONTRACT.md` and the visual target.
2. Export animations in one file as the clip names above (or supply an `animationMap`).
3. Place the file at:

```text
public/characters/ari/ari.glb
```

4. Open `/dev/ari-3d` and verify framing, scale, foot placement, and each clip.
5. Adjust `scale` / group Y offset in `Ari3D.tsx` after inspecting the export.
6. Enable in product UI (optional):

```bash
NEXT_PUBLIC_ARI_3D=1
```

Without the flag, product banners stay on Rive/SVG even if the GLB is present; the preview can still force 3D with `prefer3d`.

---

## 6. Runtime behavior

- **Client-only:** `Ari3D` is dynamically imported with `ssr: false`.
- **Single-canvas preference:** Small reaction cues stay on Rive; companion skips 3D under `minSizeFor3d` (default 72).
- **Probe:** `probeAri3dModel()` HEAD/GETs the GLB once per page load.
- **Fallback chain:** missing GLB / load error / reduced motion / Vitest / forced → `AriRive` → `AriMark`.
- **Reduced motion:** product companion falls back to SVG; raw `Ari3D` clamps to the Idle clip if mounted.
- **Presentation only:** no XP/gem/streak code inside `ari3d` components.

---

## 7. Preview

With `npm run dev`:

```text
http://localhost:3000/dev/ari-3d
```

Production builds return 404 for this route.

Use the preview to:

- Inspect load / error shells before the model exists
- Fire every `AriMotion` and product state
- Drive sample feedback events
- Tune stage size and model scale
- Compare `AriCompanion` vs current `AriRive`

---

## 8. What was verified vs remaining work

### Verified in this integration

- Dependency install against current React/Next majors (`three`, R3F v9, drei)
- Unit tests for state/event → motion mapping (`src/lib/animation/*`)
- Full Vitest: **278 passed**, 4 skipped
- oxlint clean on new Ari 3D paths
- `tsc --noEmit`: only pre-existing errors in `src/db/historyIntegrity.integration.test.ts` (unrelated)
- Browser (desktop + ~390px mobile): `/dev/ari-3d` probes missing GLB, keeps WebGL unmounted, Rive companion fallback works, motion/state controls respond
- Browser: Home (`/?view=path`) still shows Ari via Rive (single canvas; no accidental 3D mount)

### Not verified (blocked on asset production)

- Actual skeletal animation, mane deformation, facial clips
- Film-style materials / lighting match to the reference
- Mobile GPU cost with the real mesh
- Every clip name present in a production export

### Remaining work for the finished character

1. Commission / author the rigged `ari.glb` to the asset contract and visual target.
2. Validate clips in `/dev/ari-3d`; fix orientation, scale, and ground contact.
3. Optionally extend the Rive file with `jump` / `levelUp` triggers (aliases work today).
4. Turn on `NEXT_PUBLIC_ARI_3D=1` after sign-off; watch memory and canvas count on Home.
5. Consider visibility-based pause (`frameloop="demand"` / offscreen unmount) once the hero model is heavy.
