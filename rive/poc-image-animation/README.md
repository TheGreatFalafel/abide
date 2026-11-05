# poc-image-animation

Isolated experiment: multi-PNG character animation through the Rive CLI.
Not production Ari. Does not modify `rive/poc-idle/` or `public/rive/ari.riv`.

| | |
|---|---|
| Artboard | `PocImageAnim` |
| State machine | `PocImageSM` |
| Triggers | `idle`, `softPose`, `frames` |
| Placeholder art | copies of `rive/ari/assets/sit-{idle,happy,think,curious}.png` |
| Build | `build/poc-image-animation.riv` (gitignored; `rive . --once`) |

## What this tests (CLI 1.8.0)

| Technique | Supported? | How |
|-----------|------------|-----|
| Dedicated image-sequence / sprite-sheet timeline | **No** | No sequence type in `rive schema` |
| Swap `Image.assetId` on one drawable | **No** | `assetId` is not animatable |
| Discrete frame swap | **Yes** | `Solo` + `KeyFrameId` on `activeComponentId` (`hold` only) |
| Soft pose change between two paintings | **Yes** | Two layered `Image`s; key `opacity`; SM transition `duration` blends |
| Controllable idle | **Yes** | Looping timeline on a root `Node` (`scaleX` / `scaleY`) |
| Independent motion per image | **Yes** | Each `Image` is a `Node` (`x`, `y`, `rotation`, `scale*`, `opacity`) |

Verified: `--verify` clean, `inspect --summary` clean, `@rive-app/canvas` 2.48.0 loads the `.riv` and fires all three triggers.

Preview frames: `preview/01-idle-start.png` … `06-frames-curious.png`.

See `docs/rive-cli-image-animation.md` for the Gemini replacement workflow and the recommended Ari path.
