# poc-idle

Isolated Rive CLI proof of concept. Not production Ari.

| | |
|---|---|
| Artboard | `PocIdle` |
| State machine | `PocSM` |
| Triggers | `idle` (looping breathe), `bounce` (one-shot, returns to idle) |
| Artwork | `assets/sit-idle.png`, a copy of `rive/ari/assets/sit-idle.png` |
| Build | `build/poc-idle.riv` (gitignored; produced by `rive . --once`) |

Do not copy this file to `public/rive/ari.riv`. The production contract stays `Ari` / `AriSM` in `rive/ari/`.

`runtime-check.html` loads the local build with the repo's `@rive-app/canvas` (`2.48.0`, the package `@rive-app/react-canvas` 4.38.0 depends on). It is not imported by the Next app.

Preview frames from the CLI are in `preview/`.
