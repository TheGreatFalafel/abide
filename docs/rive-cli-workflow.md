# Rive CLI workflow for Ari

Abide already authors Ari as Rive Markup Language and plays it with `@rive-app/react-canvas`. This page is how to keep doing that from Cursor, without opening the Rive Editor for ordinary animation changes.

Verified on this machine with **Rive CLI 1.8.0** (`rive doctor` on 4 Nov 2026) and the installed runtime `@rive-app/canvas` **2.48.0** (the dependency of `@rive-app/react-canvas` 4.38.0). The CLI reported 1.9.0 as available. This document does not assume 1.9.0 features. Live docs at [rive.app/docs/cli/getting-started](https://rive.app/docs/cli/getting-started) and [monthly allowance](https://rive.app/docs/cli/monthly-allowance) were checked the same day and are cited where they add a shipping rule the bundled 1.8.0 pages do not spell out.

The product contract is unchanged. See `docs/rive-characters.md`. `CharacterEvent` still maps onto state-machine trigger names. Nothing in `src/` was changed for the proof of concept.

## What is already in the repo

| Path | Role |
|------|------|
| `rive/ari/scene.rml` | Production Ari source: painted PNGs, `Ari` artboard, `AriSM`, the trigger set the app fires |
| `rive/ari/assets/*.png` | Pose paintings embedded by `<ImageAsset file="...">` |
| `public/rive/ari.riv` | The file the app loads. Replace only after a reviewed build |
| `src/components/rive/RiveCharacter.tsx` | Fires `StateMachineInput.fire()` and sets boolean/number inputs |
| `rive/poc-idle/` | Isolated proof of concept. Different artboard and state-machine names. Not mounted by the app |
| `rive/poc-image-animation/` | Multi-PNG experiment (Solo hard swaps + opacity soft morph). See `docs/rive-cli-image-animation.md` |
| `rive/poc-gemini-poses/` | Gemini dimensional lion poses (stand/sit/think/walk/sleep). See `docs/rive-cli-gemini-poses.md` and `docs/rive-review-index.md` |

`rive/ari/AGENTS.md` is the CLI's own instructions for an agent editing that project. Follow it: look types up with `rive schema` and `rive docs`, then check the build. Do not guess property names.

## Install and health check (Windows)

The official installer is already present:

```powershell
irm https://releases.rive.app/cli/install.ps1 | iex
rive doctor
```

`rive doctor` on this machine:

- `rive 1.8.0`, installed at `%USERPROFILE%\.rive`
- not logged in (`--publish`, `--rev`, and `rive push` need a session)
- live-link port 9640 available
- `wamrc` available when an ahead-of-time script compile is requested

The user `PATH` already includes `%USERPROFILE%\.rive\bin`. A terminal opened before that entry existed will not see `rive` until it is restarted. The binary is `rive.exe` in that folder.

`rive doctor` also warned that 1.9.0 is published. Update only with the official command, `rive update`. This proof of concept was built and checked on 1.8.0.

Do not download the CLI from anywhere other than `releases.rive.app` or the Homebrew cask `rive-app/tap/rive-cli`.

## What the CLI can author

Confirmed against the 1.8.0 docs bundled with the install (`rive docs`), not from memory.

**Images.** Drop a `.png`, `.jpg`, `.jpeg`, or `.webp` in the project and declare it. The path is relative to the project directory. Bytes are embedded in the `.riv`.

```xml
<ImageAsset file="assets/sit-idle.png" name="sitIdle" id="0:60"/>
<Image x="260" y="200" originX="0.5" originY="0.5" assetId="0:60" name="Lion" id="0:20"/>
```

`file` is an authoring attribute. `rive schema ImageAsset` does not list it; `rive docs assets` does. An `Image` has no width or height of its own. It uses the bitmap's size. `SVGAsset` and `LottieAsset` are stripped on export. Paintings stay PNGs, or become real shapes.

**Artboards, timelines, state machines.** All three are RML elements. A new `rive create` project starts with one of each. `defaultStateMachineId` is what makes the machine run on load. Declare the `StateMachine` before any `LinearAnimation`. Keyframes use the property name on the object they animate (`property="scaleY"`, `property="y"`). `rive schema Image --animatable` lists legal names.

**Inputs the app can drive.** Abide's host still uses state-machine triggers, booleans, and numbers (`useStateMachineInput`, `stateMachineInputs`). The CLI and the web runtime both mark those inputs as deprecated and prefer view-model properties. The deprecated inputs still load and still fire. Keep using them for Ari until the React host is deliberately migrated. A new file that only speaks view models will not respond to `RiveCharacter`'s trigger calls.

**Local `.riv`.** From the project directory:

```powershell
rive . --verify          # compile, write nothing
rive . --once            # unsigned .riv at build/<name>.riv
rive . --screenshot --advance=1
rive inspect . --summary
```

`--once` needs no account. A file with **no scripts** is what the web runtime accepts from that unsigned build. A file **with** `.luau` or `.as` scripts must be built with `rive . --publish` or the web runtime rejects the scripts. `--publish` needs `rive login`.

## Proof of concept

`rive/poc-idle/` was created with `rive create` and then edited. It is not mounted by `Ari`.

- Artboard `PocIdle`, 520×400
- State machine `PocSM`
- Trigger `idle`: looping scale breathe on the painted lion
- Trigger `bounce`: one-shot lift that returns to idle on exit time
- A click listener fires `bounce`, so the CLI can drive the same trigger a runtime would fire

Checks that passed:

```text
rive rive/poc-idle --verify --format=json
  success, 0 errors, 0 warnings

rive rive/poc-idle --once
  built rive/poc-idle/build/poc-idle.riv (215714 bytes)

rive inspect rive/poc-idle --summary
  problems: []
  artboard PocIdle, state machine, 2 triggers, 2 linear animations, 1 image asset

idle-start.png (--advance=1) vs idle-peak.png (--advance=60)
  34.55% of pixels differ

bounce.png (--pointer=click@260,200 --advance=18) vs idle-peak.png
  40.60% of pixels differ
```

Frames:

- `rive/poc-idle/preview/idle-start.png`
- `rive/poc-idle/preview/idle-peak.png`
- `rive/poc-idle/preview/bounce.png`

The click is only there so a headless capture can fire the trigger. `RiveCharacter` does not need the listener. It calls `fire()` on the input named in the contract.

### Runtime compatibility

`rive/poc-idle/runtime-check.html` loads `build/poc-idle.riv` with the repo's `@rive-app/canvas@2.48.0`. That is the canvas runtime inside `@rive-app/react-canvas@4.38.0`. It is not a route in the Next app.

Loaded result:

| Field | Value |
|-------|--------|
| Artboard | `PocIdle` |
| State machine | `PocSM` |
| Animations | `idle`, `bounce` |
| Inputs | `idle` and `bounce`, both `StateMachineInputType.Trigger` (58) |
| `bounce.fire()` | returned without throwing |
| Canvas | drew the painted lion |

So a script-free `.riv` from `rive --once` is compatible with the runtime Abide already ships. It does not use the production names `Ari` / `AriSM`, so dropping the file onto `public/rive/ari.riv` would fail the existing contract. Do not do that until a reviewed `rive/ari` build is explicitly approved.

## Doing the next Ari change from Cursor

Work in `rive/ari/` for production source, or a new `rive/<name>/` folder for an experiment. Leave `public/rive/ari.riv` alone until the build has been reviewed.

1. Read `rive/ari/AGENTS.md` and `docs/rive-characters.md`.
2. Look up every new type with `rive schema <Type>` and `rive docs <topic>`. Topics that matter here: `assets`, `drawing`, `state-machines`, `format`, `gotchas`, `publishing`.
3. Edit `scene.rml`. Keep artboard `Ari`, state machine `AriSM`, and the trigger names in `ARI_RIVE_CONTRACT`. Add `sleep` when that timeline is ready. Do not rename triggers the app already fires.
4. Put new paintings in `rive/ari/assets/` and point an `<ImageAsset file="...">` at them.
5. Check:

```powershell
rive rive/ari --verify --format=json
rive inspect rive/ari --summary
rive rive/ari --screenshot=rive/ari/preview/idle.png --advance=1
```

Create the screenshot directory first. `--screenshot` resolves its path from the current directory, and a missing directory fails.

6. Build the local file with `rive rive/ari --once`. The output is `rive/ari/build/ari.riv`. `build/` is gitignored.
7. Stop there until someone reviews the frames and the inspect summary. Copying onto `public/rive/ari.riv` is a separate, explicit step (`docs/rive-characters.md`).

Prompts that work: "add a sleep timeline that holds the gentle pose and a `sleep` trigger on AriSM", "swap the idle painting for this PNG and keep the breathe keys". Prompts should name the artboard, the state machine, and the trigger. Ask for `--verify`, `inspect --summary`, and a screenshot. Do not ask the agent to `rive push` or `rive login` unless that is the actual request.

`rive rive/ari` with no flag opens a preview window and rebuilds on save. It does not exit. Run it in its own terminal. `rive push` is an upload, not a preview.

## What still needs the Rive Editor

This proof of concept did not. Pose swaps, root motion, timelines, triggers, and a `.riv` the web runtime can play were all done from RML.

The Editor is still the practical tool, and the only GUI, for:

- Drawing vector art and painting bone or mesh weights. `rive docs rigging` describes the same objects in RML, but weight painting is not something to maintain as XML.
- Hand-tuning curves on a dense timeline. Keyframes in RML are exact; the graph editor is visual.
- Opening the file as a designer. That handoff is `rive login`, then `rive push` or `rive <project> --once --rev=<file>.rev`. Both need an account. `--rev` does not count against the monthly allowance. `rive push` does.

The Editor is not required to compile, preview, screenshot, or load a script-free `.riv` in the app.

Two asset paths are not available in the CLI: imported SVG and imported Lottie are stripped. Convert them to shapes, or use a PNG.

## Licensing, export, and the free plan

No subscription was purchased and the CLI was not logged in. Local authoring does not need either.

From the installed CLI and the live docs:

| Action | Account | Counts toward the monthly allowance |
|--------|---------|-------------------------------------|
| `rive create`, `--verify`, `--once`, `--screenshot`, `inspect`, the preview window | no | no |
| `--rev` (editor handoff) | yes | no |
| `rive push` | yes | yes, when the push completes |
| `--publish` and `--publish=web` | yes | yes, when the publish starts |

Live allowance page (4 Nov 2026): **Free 50** publishes and pushes per workspace per month, **Cadet 1,000**, **Voyager and Enterprise unlimited**. The allowance resets at 00:00 UTC on the first of the month. Editor exports and `rive pull` never count. The bundled 1.8.0 docs do not include this page; the numbers come from the live docs.

**Watermark.** The live getting-started page says `--publish` may watermark the graphic. A clean published file needs the project bound to a Rive file with `rive push`, and that file in a workspace on the **Cadet plan or higher**. The 1.8.0 `publish-web` page says an unbound publish is watermarked on any plan and that `rive push` removes the watermark. Plan on the stricter live rule before shipping a `--publish` build.

**Scripts.** Unsigned scripts are rejected by web runtimes. Ari today has none, so `--once` is a valid runtime file, and that is what the canvas check loaded. The moment a script is added, the file that ships has to be `--publish`, with the allowance and watermark rules above.

**Runtimes.** `@rive-app/react-canvas` and `@rive-app/canvas` are MIT. Rive's current product page says the open-source runtimes have no royalties and no runtime fee. That is separate from the CLI publish allowance and from a watermark on a published graphic.

**Not done here.** No `rive login`, no `rive push`, no `--publish`, no copy onto `public/rive/ari.riv`, and no change to `Ari` or `CharacterEvent`.
