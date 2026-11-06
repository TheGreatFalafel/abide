# Rive / Ari review index (for Codex and other agents)

Open the **repo root**: `Bible Reading Program` (not only `rive/`).  
Binary `.riv` builds under `rive/*/build/` are gitignored by each project’s `.gitignore`, but **source** is plain text + PNGs and should be visible.

## Read in this order

1. `docs/ari-artwork-audit.md` — Gemini standing layers **cannot** be bone-rigged; pose sheet inventory
2. `docs/rive-characters.md` — production `CharacterEvent` / Ari contract
3. `docs/rive-cli-workflow.md` — CLI install + first POC notes
4. `docs/rive-cli-image-animation.md` — Solo vs opacity morph findings
5. `docs/rive-cli-gemini-poses.md` — Gemini pose experiment + honesty about “smooth” transitions
6. `docs/rive-editor-ari-guide.md` — step-by-step Rive Editor Path A (pose library) and Path B (bones/mesh)

## Source artwork (Gemini dimensional lion)

| Path | What it is |
|------|------------|
| `ari/source/ari_character_isolated (1).jpg` | Standing master |
| `ari/source/layers/Code_Generated_Image*.png` | Rectangular standing windows (not a rig atlas) |
| `ari/2e46c96d-a167-4efe-9685-cc7603382d1b.jfif` | Pose poster (stand/sit/think/walk/sleep/…) |
| `docs/ari-artwork-audit/*.png` | Audit diagrams |

## Experiments (isolated; not wired into the app)

| Path | Art used | Purpose |
|------|----------|---------|
| `rive/poc-idle/` | Old painted `sit-idle.png` | First CLI smoke test |
| `rive/poc-image-animation/` | Old painted sit poses | Solo + opacity technique test |
| `rive/poc-gemini-poses/` | **Gemini** master + pose-sheet crops | Correct look; stand/sit/think/walk/sleep with long opacity blends |

## Production (do not overwrite casually)

| Path | Role |
|------|------|
| `rive/ari/scene.rml` + `rive/ari/assets/` | Current shipped authoring (painted sit poses) |
| `public/rive/ari.riv` | Runtime file the React app loads |
| `src/lib/animation/riveAri.ts` | `ARI_RIVE_CONTRACT` |
| `src/components/rive/RiveCharacter.tsx` | Trigger firing host |

## If files seem “missing”

- Look under `ari/` and `docs/`, not only `rive/`.
- `build/*.riv` may be absent until `rive <dir> --once` (requires Rive CLI on PATH).
- Preview PNGs are in each POC’s `preview/` folder and are committed-friendly.
- Filenames with spaces exist under `ari/source/` — quote paths on Windows.
