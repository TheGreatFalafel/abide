# Multi-PNG image animation (CLI experiment)

Follow-on to `docs/rive-cli-workflow.md`. Verified with **Rive CLI 1.8.0** and `@rive-app/canvas` **2.48.0**. Project: `rive/poc-image-animation/`. Production Ari, `ARI_RIVE_CONTRACT`, and `rive/poc-idle/` were not changed.

## Audit of what RML can do with PNGs

Looked up on this install: `rive schema Image --animatable`, `rive schema Solo`, `rive schema KeyFrameId`, `rive docs assets`, `rive docs rigging` (Solo), `rive docs format` (keyframe types), `rive docs state-machines` (transition duration blending).

| Capability | Result |
|------------|--------|
| Import many PNGs | Yes. One `<ImageAsset file="assets/….png">` per file; bytes embed in the `.riv`. |
| Image sequence / sprite strip as a first-class timeline | **Not found.** No sequence or frame-strip type in schema. |
| Retarget one `Image` to another asset over time | **No.** `Image.assetId` is not animatable. |
| Frame-by-frame pose swaps | **Yes**, via `Solo` + `KeyFrameId` on `activeComponentId`. Interpolation is **hold only** — there is no halfway id. Hard cut. |
| Smooth blend between two full paintings | **Yes**, via two sibling `Image`s and keying `opacity`. A state-machine transition with `duration` mixes those opacities during the blend. |
| Idle / bounce / transform on a painting | **Yes.** `Image` (and a parent `Node`) animate `x`, `y`, `rotation`, `scaleX`, `scaleY`, `opacity`. |
| Layered artwork, each part moving alone | **Yes**, if Gemini (or any tool) exports **separate PNGs** (head, body, tail, …). Each becomes its own `Image`. A single flattened PNG cannot be split inside RML. |
| Mesh / bone deformation of a PNG | Authorable in RML (`Mesh` under `Image`, see `rive docs rigging`), but weight painting is not practical as XML. Treat as Editor work if needed. |

Production `rive/ari/scene.rml` already uses the Solo path for pose swaps. This experiment also proves the opacity-crossfade path.

## What `rive/poc-image-animation` demonstrates

Artboard `PocImageAnim`, state machine `PocImageSM`, triggers `idle` | `softPose` | `frames`.

1. **Idle** — `sit-idle.png` visible; root `Node` breathes (`scaleX` / `scaleY` loop). Controllable: fire `idle`.
2. **Soft pose** — layered `sit-idle.png` and `sit-happy.png`. Fire `softPose`. Transition `duration="280"` blends opacities. Mid-frame (`preview/03-soft-mid.png`) shows both paintings; settled frame (`04-soft-end.png`) is happy only.
3. **Hard frames** — `Solo` cycles `sit-think.png` ↔ `sit-curious.png` with `KeyFrameId` holds. Fire `frames`. Settled frames differ by ~41% of pixels (`05` vs `06`).

Build and checks (no login):

```powershell
rive rive/poc-image-animation --verify --format=json
rive inspect rive/poc-image-animation --summary
rive rive/poc-image-animation --once
rive rive/poc-image-animation --screenshot=rive/poc-image-animation/preview/01-idle-start.png --advance=1
```

Runtime: `runtime-check.html` loads `build/poc-image-animation.riv` with the app's `@rive-app/canvas` 2.48.0. Reported artboard, three animations, three trigger inputs; `softPose.fire()` and `frames.fire()` succeeded. Not mounted in the Next app.

## Visual quality (with current placeholders)

The placeholders are **different full-body paintings**, not registered expression frames or cut layers.

- Idle breathe reads cleanly.
- Soft morph mid-blend shows **ghosting** wherever idle and happy silhouettes disagree (head and mane offset). Opacity blending works; registration quality decides whether it looks smooth or muddy.
- Solo cuts are sharp. Fine for blinks or distinct expressions if the body stays locked.

For Gemini frames intended for soft morphs: same canvas size, same ground contact, same body registration; change only the parts that should morph (face, eyes). For hard Solo cuts, registration still helps but is less critical.

## Replacing placeholders with Gemini artwork

Keep the experiment reversible: swap files under `rive/poc-image-animation/assets/`, do not edit `rive/ari/assets/` until a production pass.

1. Generate PNGs that match the role of each placeholder:

| File | Role in this demo |
|------|-------------------|
| `assets/sit-idle.png` | Soft idle / breathe |
| `assets/sit-happy.png` | Soft morph target |
| `assets/sit-think.png` | Hard Solo frame A |
| `assets/sit-curious.png` | Hard Solo frame B |

2. Constraints for the model:
   - Transparent background preferred (these placeholders are opaque cream; Abide compositing prefers soft ground / alpha).
   - Same pixel size across a morph pair (placeholders are 480×360).
   - Morph pairs: lock body and feet; vary expression only.
   - Layer packs (optional, better quality later): export `body.png`, `head.png`, `tail.png`, … then add one `<ImageAsset>` and one `<Image>` per layer under a shared `Node`.

3. Overwrite only the copies in `rive/poc-image-animation/assets/`. Filenames must stay the same unless you also edit `file=` in `scene.rml`.

4. Rebuild and capture:

```powershell
rive rive/poc-image-animation --verify
rive rive/poc-image-animation --once
rive rive/poc-image-animation --screenshot=rive/poc-image-animation/preview/gemini-idle.png --advance=1
rive rive/poc-image-animation --screenshot=rive/poc-image-animation/preview/gemini-soft-mid.png --pointer=click@130,200 --advance=9
rive rive/poc-image-animation --screenshot=rive/poc-image-animation/preview/gemini-soft-end.png --pointer=click@130,200 --advance=30
rive rive/poc-image-animation --screenshot=rive/poc-image-animation/preview/gemini-frames-a.png --pointer=click@390,200 --advance=5
rive rive/poc-image-animation --screenshot=rive/poc-image-animation/preview/gemini-frames-b.png --pointer=click@390,200 --advance=55
```

5. Review mid soft-morph for ghosting. If muddy, tighten registration or shorten transition `duration`. If the cut should be hard, use Solo instead of opacity.

6. When a set is approved for product, copy the workflow into `rive/ari/` with contract names (`Ari`, `AriSM`, product triggers). Do not copy this experiment's `.riv` onto `public/rive/ari.riv`.

## Limitations and paid features

- No account was used. `--verify`, `--once`, screenshots, and the canvas check stay free and offline.
- Script-free `.riv` from `--once` is enough for this experiment and for today's Ari. Scripts still need `--publish` (login + monthly allowance; Free plan 50 publish/push actions).
- Watermark / Cadet rules apply only to `--publish` / bound publish, not to this local build.
- Soft morph quality is an art problem (registration), not a paid CLI feature.
- Mesh deformation and fine bone weight painting remain Editor-sided if you outgrow layered PNGs.

## Recommended workflow for Ari's final animations

1. **Ship with layered or registered PNGs + RML**, not a single flattened JPG animated in CSS. Keep authoring in `rive/ari/` via Cursor + CLI.
2. **Default pose language:** continue `Solo` + hold keys for distinct product states (`idle`, `think`, `walk`, …), matching what `rive/ari` and `CharacterEvent` already expect.
3. **Add opacity crossfades** only between **near-registered** Gemini pairs (e.g. idle ↔ blink, idle ↔ smile) where a 150–300 ms SM transition looks intentional.
4. **Idle motion:** parent `Node` breathe / bob on the active painting (already proven in `poc-idle` and here).
5. **Next quality step without the Editor:** ask Gemini for cut layers (body, head, eyes, tail) and animate those `Image`s independently under one root.
6. **Reach for the Editor** when you need painted meshes, complex skeletal walks, or designer curve polish — then `rive login` + `rive push` / `--rev` (account required; push counts toward the monthly allowance).

Do not integrate this experiment into the app until a Gemini art pass and a production `rive/ari` edit are reviewed.
