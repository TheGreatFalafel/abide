# Gemini pose experiment (`rive/poc-gemini-poses`)

Corrects two issues with the earlier POCs:

1. **Wrong look** — `poc-idle` and `poc-image-animation` used the older painted sit PNGs in `rive/ari/assets/`, not the dimensional Gemini lion in `ari/source/`.
2. **Harsh / ghosty swaps** — opacity blends between unrelated silhouettes still ghost. That is expected without a real part rig.

This folder uses the Gemini master + cropped pose-sheet cells. It is still **not** bone-rigged stand→sit→sleep. See `docs/ari-artwork-audit.md`.

## What was built

| Trigger | Pose art | Motion while held |
|---------|----------|-------------------|
| `idle` | `assets/stand-master.png` (from `ari/source/ari_character_isolated (1).jpg`) | Soft breathe |
| `sit` | Pose sheet P2 crop | Soft breathe |
| `think` | Pose sheet P3 crop | Slight rotate |
| `walk` | Pose sheet P4 crop | Bob + small x sway |
| `sleep` | Pose sheet P7 crop | Slow breathe |

Artboard `PocGemini`, state machine `PocGeminiSM`. Transitions use **400–550 ms** opacity blends between pose plates that share a ground line on a 520×400 canvas.

```powershell
rive rive/poc-gemini-poses --verify
rive rive/poc-gemini-poses --once
rive rive/poc-gemini-poses --screenshot=rive/poc-gemini-poses/preview/01-stand.png --advance=1
```

Previews: `rive/poc-gemini-poses/preview/01-stand.png` … `06-sleep.png`.

## Why this is not “rigged”

| Request | Reality with current Gemini files |
|---------|-----------------------------------|
| Smooth stand → sit → sleep by bending limbs | **Not possible** with `ari/source/layers/*`. Those PNGs are gray rectangular windows over one standing still. Legs/head/mane are fused. Measured in `docs/ari-artwork-audit.md`. |
| Import pose poster cells and warp one into another | RML can crossfade opacities and move whole images. It cannot invent in-between anatomy. Mid-frames still show two lions (ghosting) when silhouettes differ. |
| Mesh / bone deformation | Authorable in principle (`rive docs rigging`), but needs a **true part atlas** (separate legs, head, tail with overlap) and is impractical to weight-paint as XML. That work belongs in the Rive Editor after new art. |

## What would make transitions actually smooth

1. **New Gemini export: standing part atlas** — silhouette alpha, separate head/mane/torso/four legs/tail, shared canvas (checklist in the artwork audit).
2. **Separate full poses** for sit, sleep, walk in-betweens, thinker — transparent, same scale, same ground line (also listed in the audit). Do not crop the opaque poster for production forever; it was a bootstrap.
3. **Then either:**
   - **CLI path:** layered `Image`s under Nodes/bones for micro-motion within a pose; Solo or short opacity fades only between near poses; or
   - **Editor path:** mesh + bones for walks and large pose changes, export `.rev` → CLI, or author in RML after pull.

Until (1)+(2) exist, the best CLI result is what this POC shows: **correct Gemini look**, longer fades, light idle motion, honest ghosting on large pose changes.

## Codex paths

Start at `docs/rive-review-index.md`. Include `ari/` and `docs/ari-artwork-audit*` — not only `rive/`.
