# Rive runtime assets

| File | Character | Status |
|------|-----------|--------|
| `ari.riv` | Ari (Gemini pose fades) | **Required** — copy from `rive/ari/build/ari.riv` after CLI build |
| `avatar.riv` | Customizable human avatar | Optional — omit until authored; UI keeps `AbideAvatar` |

See `docs/rive-characters.md` for state-machine names, `CharacterEvent` → trigger contracts, and replacement steps.

**Do not** drop a flattened JPG/PNG here and expect it to animate. Rive needs a properly authored `.riv` with artboard + state machine inputs.
