# Abide — Animation Architecture

Audit and design for character animation and game-UI feedback. **Preserve** lesson mechanics, rewards, progress sync, and navigation. Character motion stays separate from educational/business logic.

> **Phase C update:** Professional Rive Ari (`public/rive/ari.riv`) is the primary shipping character renderer. See `docs/phase-c-visual-foundation.md` and **`docs/rive-characters.md`** (asset contracts, `CharacterEvent` API, replacement steps). SVG `AriMark` remains the graceful fallback. The Phase A “defer Rive” recommendation is superseded.
>
> **Shared Rive host:** `RiveCharacter` + dedicated `Ari` in `src/components/rive/`. Application boundary prefers `CharacterEvent` (`idle`…`react_incorrect`); legacy `AriCharacterState` still works.
>
> **3D foundation:** React Three Fiber integration is in place for a future rigged `public/characters/ari/ari.glb`. Product UI stays on Rive/SVG until the GLB exists and `NEXT_PUBLIC_ARI_3D=1` is set. See `docs/ari-3d-integration.md` and `docs/ASSET_CONTRACT.md`.

---

## 1. Audit of existing infrastructure

### Technology today

| Layer | Status |
|-------|--------|
| External animation libs (Rive, Lottie, Framer Motion, GSAP) | **None** |
| Ari mascot | Inline SVG (`AriMark.tsx`) + CSS keyframes in `app.css` |
| Human avatar | Inline SVG (`AbideAvatar.tsx`) + shared blink / idle CSS |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` + `prefersReducedMotion()` in `scroll.ts` |

### Ari (mascot)

| Piece | Path | Role |
|-------|------|------|
| Copy + moods/poses | `src/lib/mascot.ts` | Expressions, poses, `mascotLineFor`, `reactionForAnswer` |
| Renderer | `src/components/AriMark.tsx` | Full-body lion SVG; classes `expr-*` / `pose-*` |
| Banner | `src/components/MascotBanner.tsx` | Contextual line + Ari |
| Answer cue | `src/components/AriReactionCue.tsx` | Correct/incorrect reaction |
| Tour | `src/lib/ariTour.ts`, `GuidedTour.tsx` | Guided onboarding with Ari |
| Motion | `app.css` (`.mascot-anim`, `ari-*` keyframes) | Breathe, blink, tail, pose loops, react pop |

**Existing expressions:** `welcome`, `encouraging`, `thinking`, `celebrating`, `proud`, `comforting`, `neutral`  
**Existing poses:** `idle`, `walk`, `jump`, `celebrate`, `encourage`, `think`, `guide`, `fly`  
**Unused in product:** `walk`, `fly` (CSS present, never assigned by copy helpers)

### Human avatar

| Piece | Path |
|-------|------|
| Renderer | `AbideAvatar.tsx` |
| Sizes | `avatarSizes.ts` |
| Cosmetics / appearance | `cosmetics.ts`, `appearance.ts`, `catalog.ts` |
| Motion | Idle + blink; optional click `react` (~700ms) — **no pose enum** |

### Games & feedback

- Registry: `src/games/registry.ts` (6 games).
- Ari per-answer: Trivia, WhoSaidIt, Scramble, FinishTheVerse via `AriReactionCue`.
- No Ari cue yet: MatchThePassage, BiblicalTimeline; SectionQuiz.
- Completion → `completeBibleGame` / lesson complete → `Celebration` + `mascotLineFor('celebrate', …)`.

### Lessons

- Active: `BiteSizedLessonSession` + `BiteExercisePanel` (`AriReactionCue` on check).
- Legacy (unwired in `App`): `CurriculumLesson`, `LanguageLessonSession`.

### Rewards (do not animate inside business logic)

- XP / achievements / streaks: `progress.ts`, `streak.ts`, `types.ts`
- Gems: `gems.ts`, `gemEvents.ts`
- Celebration UI: `Celebration.tsx` (CSS confetti + staged reveal + Ari banner)

### Reuse vs replace

| Reuse | Do not duplicate / replace |
|-------|----------------------------|
| `AriMark`, `MascotBanner`, `AriReactionCue` | New mascot art or branding |
| `mascot.ts` copy + expression/pose types | Parallel “mood” systems |
| CSS Ari/avatar keyframes | Full Rive/Lottie rewrite of existing SVG |
| `Celebration`, game registry, progress/gems | Reward math inside animation code |
| `AbideAvatar` cosmetics pipeline | Second avatar renderer |

---

## 2. Technology recommendation

**Recommended stack (smallest maintainable set):**

1. **Keep inline SVG + CSS** for Ari and the human avatar (already shipping, mobile-light, no new deps).
2. **Add a thin TypeScript state/event layer** (`src/lib/animation/`) that maps app feedback → character presentation without touching XP/gems/progress.
3. **Defer Rive / Lottie** until a specific interaction cannot be expressed with the current SVG limbs (e.g. lip-sync, complex walk cycles). They add weight, tooling, and a second asset pipeline while Abide already owns official Ari art in code.

### Tradeoffs

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **CSS + SVG (current)** | Zero deps, reduced-motion easy, works offline, matches branding | Limited skeletal motion | **Primary** |
| **Rive** | Interactive state machines, polish | New runtime + `.riv` assets; redesign risk | Optional later for premium scenes |
| **Lottie** | Designer-friendly JSON | Poor interactivity; large files; still not event-native | Skip for characters |
| **Framer Motion / GSAP** | Nice UI transitions | Extra dep; overlaps CSS for characters | Optional later for **game chrome only**, not Ari |

---

## 3. State machines & event contracts

### Ari character states (product API)

`idle` · `blink` · `greet` · `walk` · `run` · `think` · `guide` · `correct` · `encourage` · `celebrate` · `jump` · `levelUp` · `milestone`

3D clip bridge: `src/lib/animation/ari3d.ts` (`ariMotionFromCharacterState` / `ariMotionFromFeedback`).

**Presentation bridge (no new art):**

| State | Expression | Pose | Motion |
|-------|------------|------|--------|
| `idle` | `neutral` | `idle` | idle loop (includes blink CSS) |
| `blink` | current / `neutral` | `idle` | idle (blink is ambient CSS) |
| `greet` | `welcome` | `guide` | idle |
| `walk` | `encouraging` | `walk` | idle |
| `run` | `encouraging` | `walk` + `pose-run` speed class | idle |
| `think` | `thinking` | `think` | idle |
| `guide` | `welcome` | `guide` | idle |
| `correct` | `proud` | `celebrate` | **react** |
| `encourage` | `comforting` | `encourage` | **react** |
| `celebrate` | `celebrating` | `celebrate` | react |
| `milestone` | `celebrating` | `jump` | react |

Fallback when assets/mark unavailable: static `AriMark` with `animate={false}` / `motion="none"` (SVG always inline — “unavailable” means disable motion only).

### Human avatar states (product API; foundation only)

`idle` · `blink` · `smile` · `think` · `celebrate` · `achievement`

Map onto existing idle/blink + short react flash and face variants — **no second avatar system**. Full wiring is a follow-up; types live in `src/lib/animation/`.

### Game / lesson feedback events

| Event | Typical Ari state | Existing hook |
|-------|-------------------|---------------|
| `answer_selected` | (optional UI only; no Ari spam) | option highlight |
| `correct_answer` | `correct` | `AriReactionCue` / `reactionForAnswer(true)` |
| `incorrect_answer` | `encourage` | `AriReactionCue` / `reactionForAnswer(false)` |
| `matching_completed` | `correct` or `encourage` | Match game complete |
| `exercise_completed` | `correct` / `encourage` | Bite exercise result |
| `lesson_completed` | `celebrate` | Celebration + banner |
| `level_up` | `levelUp` | Level-up celebration (presentation only) |
| `achievement_unlocked` | `milestone` | Celebration badges |
| `streak_milestone` | `milestone` | `streakMilestoneFrom` + jump pose |

Events are **descriptive**; they never award XP/gems. Progress modules emit outcomes; animation layer only interprets them.

---

## 4. Reusable components (target shape)

| Component / module | Responsibility |
|--------------------|----------------|
| `src/lib/animation/*` | Types, event → state, state → `{ expression, pose, motion, poseClass }` |
| `AriMark` | Pure SVG renderer; accepts legacy props **or** `characterState` |
| `AriRive` | Rive player → SVG fallback |
| `AriCompanion` / `Ari3D` | Optional WebGL player when GLB + opt-in; else Rive/SVG |
| `AriReactionCue` | Resolves feedback events → Ari presentation (Rive; keeps canvases small) |
| `MascotBanner` | Contextual copy (still from `mascotLineFor`) + `AriCompanion` |
| Future: `GameFeedbackFx` | Correct/incorrect chrome without owning Ari art |
| Future: avatar state helper | Drive `AbideAvatar` react / face from events |

---

## 5. Asset requirements

- **No new mascot designs.** Continue official Ari SVG in `AriMark.tsx`.
- Optional later: Rive export that **matches** current Ari proportions if product wants richer motion — treat as swap behind `AriMark`, not a redesign.
- Confetti / XP pop remain CSS in `Celebration` / `app.css`.
- Human cosmetics stay catalog-driven SVG paths.

---

## 6. Smallest independently testable slice (Phase A)

1. Document this architecture (this file).
2. Add `src/lib/animation` state/event resolvers + unit tests.
3. Teach `AriMark` optional `characterState`; add `pose-run` CSS (faster walk).
4. Route `AriReactionCue` through feedback events (behavior unchanged for users).
5. Verify Ari idle/react in the browser on Home + a reaction cue path.
6. **Out of scope for Phase A:** avatar full wiring, Match/Timeline Ari cues, Rive, Celebration rewrite, game chrome overhaul.

---

## 7. Constraints (always)

- Keep character animation out of `progress.ts` / gem / streak math.
- Honor `prefers-reduced-motion` (CSS + optional JS via `prefersReducedMotion`).
- Prefer event-driven states over random timers for expressive poses.
- Avoid unnecessary dependencies and motion noise on mobile.
