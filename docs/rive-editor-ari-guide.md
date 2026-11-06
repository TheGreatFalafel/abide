# Rive Editor guide for Ari (Gemini art)

Two different questions get mixed together. This page separates them, then walks through the Editor.

Official references (current Rive docs):

- [Assets](https://rive.app/docs/editor/fundamentals/assets-overview)
- [Bones](https://rive.app/docs/editor/manipulating-shapes/bones)
- [Meshes](https://rive.app/docs/editor/manipulating-shapes/meshes)
- [Toolbar / Design vs Animate](https://rive.app/docs/editor/interface-overview/toolbar)

Abide contract (names the app expects): artboard **`Ari`**, state machine **`AriSM`**, triggers listed in `docs/rive-characters.md`. Keep those names if this file will replace `public/rive/ari.riv`.

---

## Why sit / sleep “can’t be used” — and why that was misleading

They **can** be used. The Gemini pose poster already has sitting (P2) and sleeping (P7). `rive/poc-gemini-poses/` already crops and plays them.

What they **cannot** do:

| Use | Sit / sleep drawings | Standing “layer” PNGs in `ari/source/layers/` |
|-----|----------------------|-----------------------------------------------|
| Show Ari sitting or sleeping | Yes — as whole images | No — those files are only standing crops |
| Fade or cut between stand ↔ sit ↔ sleep | Yes (will look soft only if poses line up) | N/A |
| Bend the standing legs into a sit with bones | No — sit is a different drawing | No — windows are fused rectangles, not separate limbs |
| Smooth cartoon “morph” stand → lie without ghosting | Needs either many in-between drawings **or** a real part atlas + bones | Same |

So: **sitting and lying are usable pose artwork.** They are not spare limb pieces that turn the standing lion into a sit by rotating joints. Saying “they can’t be used” only meant “they can’t fix the standing layer pack into a skeletal sit.”

Best practice before production:

1. Export sit, sleep, walk, think as **separate transparent PNGs** (no poster title, no gray plate).
2. Same character scale and a shared ground line.
3. Prefer the high-res standing **master** (`ari/source/ari_character_isolated (1).jpg`) for idle, not the small poster cell.

Starter crops already exist in `rive/poc-gemini-poses/assets/` for Editor import if you want to start today.

---

## Choose a path

### Path A — Pose library (do this first; works with what you have)

Import stand / sit / think / walk / sleep as full images. Solo or opacity between them. Add breathe / bob on a parent group. This matches Abide’s current trigger style and is what the CLI POCs proved.

**Smoothness:** soft fades between **similar** poses (idle ↔ smile). Large changes (stand → sleep) will still ghost a little mid-fade. That is normal for full-frame swaps.

### Path B — Bone + mesh rig (only after new art)

Need a **standing part atlas**: separate head, mane, torso, four legs, tail (silhouette alpha, overlap at joints). Then bones + image meshes in the Editor. Sit and sleep still usually need **their own** drawings or a second rig — a standing skeleton cannot invent a lying silhouette from one still.

Do Path A now. Commission Path B art when you want walks and bends without ghosting.

---

## Path A — Step by step in the Rive Editor

### 0. Accounts and files

1. Create a free account at [rive.app](https://rive.app) if you do not have one.
2. Open the **Rive Editor** (web or desktop).
3. Create a new file, name it something like `Ari Gemini poses`.
4. Optional later: bind the CLI project with `rive login` + `rive push` so Editor and Cursor share one file. Not required for Path A.

### 1. Prepare images on disk (5 minutes)

Use either:

- `rive/poc-gemini-poses/assets/stand-master.png`, `sit.png`, `think.png`, `walk.png`, `sleep.png`, or  
- Fresh Gemini exports: transparent PNGs, roughly the same height, feet on one ground line.

Artboard target for Abide: **520 × 400**.

### 2. Design mode — artboard

1. Press **Tab** until you are in **Design** mode (toolbar mode toggle).
2. Select the default artboard. Set size to **520 × 400**.
3. Rename the artboard to **`Ari`** (required for the app contract).
4. Background: transparent or a soft fill you will hide in-app.

### 3. Import images

1. Open the **Assets** panel.
2. Click **+** or drag the PNGs in. JPEG/PNG/WebP are supported ([assets overview](https://rive.app/docs/editor/fundamentals/assets-overview)).
3. Drag each image onto the artboard (or create Image instances that reference the assets).
4. Align them so feet sit on the same ground line, centered. Stack them on top of each other.
5. In the Hierarchy, put all pose images under a group named **`AriRoot`**.

### 4. Solo for hard pose cuts (simplest)

1. Select the pose images (or their group children).
2. Create a **Solo** that contains Stand, Sit, Think, Walk, Sleep as children (Hierarchy: Solo → each Image).
3. Set the Solo’s active child to Stand.
4. Only one pose draws at a time — clean cuts, no ghosting.

### 5. Optional softer fades

Instead of Solo-only:

1. Keep images as siblings under `AriRoot` (not Solo).
2. Set all opacities to 0 except Stand = 100%.
3. In Animate mode you will key opacities and use state transitions with duration (see below). Expect some ghosting on stand ↔ sleep.

### 6. Animate mode — timelines

1. Press **Tab** → **Animate** mode.
2. Create timelines (names can match product states):

| Timeline | Loop | Content |
|----------|------|---------|
| `idle` | loop | Solo → Stand (or Stand opacity 100). Soft scale breathe on `AriRoot` (~1.00 → 1.03 → 1.00 over ~2s). |
| `sit` | loop | Solo → Sit + light breathe. |
| `think` | loop | Solo → Think + slight rotation. |
| `walk` | loop | Solo → Walk + bob Y on `AriRoot`. |
| `sleep` | loop | Solo → Sleep + slow breathe. |
| `greet` / `celebrate` / etc. | one-shot | Map to closest pose for now, or hold sit/happy until you have more art. |

3. Key **only** what changes. For Solo, key `active` (or the Solo’s active child) with **hold** interpolation — there is no halfway between two poses.

### 7. State machine `AriSM`

1. Still in Animate mode, create a **State Machine** named **`AriSM`**.
2. Add inputs (Triggers) matching Abide (minimum for a Gemini test):

   - `idle`, `sit` (or map sit to product `think` if you prefer), `walk`, `sleep`, plus existing product names when you are ready: `greet`, `jump`, `celebrate`, `encourage`, `correct`, `guide`, `milestone`, …

3. Layer graph:

   - **Entry** → `idle`
   - **Any State** → each pose state, conditioned on the matching **Trigger**
   - Transition **duration** 300–500 ms for softer feel (opacity path) or ~100–150 ms for Solo cuts
   - One-shot states (greet, celebrate): **Exit time** 100% back to `idle`

4. Press the toolbar **Play State Machine** and click triggers / use the Inputs panel to test.

### 8. Listener clicks (optional Editor preview only)

You can add click listeners on hit shapes for scrubbing in the Editor. The Abide app fires triggers from React (`RiveCharacter`), so listeners are optional for shipping.

### 9. Export for the app

1. Editor menu / Publish → **Export for Runtime** (exports a `.riv`).
2. Keep images **Embedded** so the `.riv` is self-contained ([asset export options](https://rive.app/docs/editor/fundamentals/assets-overview)).
3. Copy the file to a review path first, e.g. `rive/poc-gemini-poses/editor-export/ari-gemini.riv`.
4. Only after review: replace `public/rive/ari.riv` (and hard-refresh the app).

Checklist before replacing production:

- [ ] Artboard name `Ari`
- [ ] Default state machine `AriSM`
- [ ] Trigger names match `docs/rive-characters.md` / `ARI_RIVE_CONTRACT`
- [ ] Transparent / soft ground composites on banners
- [ ] Readable at ~48–96 CSS px

### 10. Optional: round-trip with the CLI

```powershell
rive login
# From a folder you create for the Editor file, or after downloading .rev:
rive create rive/ari-editor --from-rev=path\to\export.rev
```

Or `rive push` / `rive pull` once a CLI project is linked to the cloud file. Local `--once` builds stay free/offline; `--publish` needs login and counts toward the free monthly allowance.

---

## Path B — Bone + mesh (after you have a part atlas)

Only start this when Gemini (or a designer) delivers **separate** PNGs: head, mane pieces, torso, L/R forelegs, L/R hind legs, tail — same canvas, alpha silhouette, extra pixels under joints.

1. **Design:** Import parts, stack in draw order, align on the standing pose.
2. **Bones:** Draw a spine → neck → head; hips → hind legs; shoulders → forelegs; tail chain ([bones](https://rive.app/docs/editor/manipulating-shapes/bones)).
3. **Mesh:** Select each image → Deform → **+ Mesh**. Add vertices along bends ([meshes](https://rive.app/docs/editor/manipulating-shapes/meshes)).
4. **Bind:** Bind mesh vertices to bones; paint weights (Auto Weights as a start, then fix elbows/knees).
5. **Animate:** Pose the skeleton on `idle` / `walk` timelines. For **sit** and **sleep**, either:
   - animate the same rig into those shapes if the mesh allows, **or**
   - Solo-swap to full sit/sleep drawings when the silhouette change is too large.
6. **State machine** same naming rules as Path A.
7. Export `.riv` as above.

Without the atlas, Path B will fight you: pinching, missing far legs, gray plates. That is an art problem, not an Editor setting.

---

## Practical recommendation for you this week

1. Open the Editor and do **Path A** with `rive/poc-gemini-poses/assets/*.png`.
2. Name artboard `Ari`, SM `AriSM`, add the product triggers you care about first (`idle`, `walk`, `think`, `sleep`, `greet`, `celebrate`).
3. Export a `.riv` and drop it beside the POCs for review — do not overwrite `public/rive/ari.riv` until triggers and scale look right in the app.
4. In parallel, ask Gemini for **transparent individual poses** (cleaner than poster crops) and, if you want Path B later, the **standing part atlas** checklist in `docs/ari-artwork-audit.md`.

Sitting and lying were never useless — they are the correct **pose** sources. They just are not a skeleton hidden inside the standing layer pack.
