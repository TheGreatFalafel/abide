# Phase 3 — Bite-sized learning system

## Architecture audit (summary)

### Existing surface

| Area | Location | Notes |
| --- | --- | --- |
| Theology (7 topics) | `src/data/curriculum/` | Content blocks + quiz bank + reflection; completion via `completeCurriculumLesson` |
| Greek / Hebrew | `src/data/languages/` | Teaching blocks, alphabet/MC/parse/translate/passage_guide exercises |
| Legacy sessions | `CurriculumLesson.tsx`, `LanguageLessonSession.tsx` | Study → quiz/practice → reflect phases (still in tree; App now routes to bite-sized) |
| Rewards | `progress.ts` XP/gems, achievements unlock | Idempotent on `already` completed lesson ids + gem event keys |
| Insights / history | `learningInsights`, activity events | Lesson completions already emit client events |
| Sync | `mergeCurriculumProgress` / language merge + draft fields | Local-first `saveState`; drafts merge by `updatedAt` |

### Reuse vs duplication

- **Reused:** curriculum/language catalogs, quiz bank, `complete*` reward paths, Ari (`AriReactionCue`), passage fetch/cache, scroll helpers, distinction/concept content shapes.
- **New shared layer:** `src/lib/biteSized/` compilers + draft helpers; `BiteSizedLessonSession` + `BiteExercisePanel`.
- **Limitation addressed:** legacy language alphabet drills advanced one exercise slot per letter poorly; compiler expands to capped fair rounds (`ALPHABET_PRACTICE_ROUNDS`).
- **Limitation addressed:** curriculum spiral review could inflate quiz length; practice capped (`CURRICULUM_PRACTICE_CAP`).

## Reusable learning framework

Instructional step kinds: `intro` → `teach` → `scripture` → `practice` → `application` → `deeper` → `review` (optional per lesson).

- **Compilers** map existing catalog content into `BiteLesson` without changing lesson ids or completion contracts.
- **Exercises:** `mc`, `match`, `true_false`, `order`, `passage_guide` (immediate feedback + explanation; Ari on check).
- **Resume:** `curriculum.draft` / `languages[track].draft` store `stepIndex`, `correct`, `total`; cleared on successful complete.
- **Rewards:** unchanged ledgers; reopen/complete-again yields `earnedXp: 0` and no gem re-award.

## Representative lessons

Wired through the shared session (not one-off UIs):

1. Theology — `scripture-inspiration`
2. Greek — `greek-alphabet`
3. Hebrew — `hebrew-consonants` (RTL on glyphs / originals)

All other catalog lessons compile through the same path.

## Migration plan (remaining curriculum)

1. Keep compilers as the single adapter; avoid hand-rewriting every lesson into a parallel schema.
2. Optionally enrich weak lessons by improving **source** content blocks/questions (preferred) or adding thin compiler special-cases for a lesson id.
3. Retire `CurriculumLessonSession` / `LanguageLessonSession` once product QA is confident (they remain available for reference).
4. Add exercise kinds in catalog → extend `exerciseToSteps` / curriculum practice mapper; UI already knows `true_false` and `order`.
5. Do not bump completion-breaking catalog versions unless lesson ids or score semantics change.

## Incomplete / known limitations

- Application reflection text is not persisted in drafts (step index/scores only).
- Mid-practice choice state is not restored; resume restarts the current practice step.
- Scripture gating is softer than the old “all primary passages required before quiz” wall — steps show retry, but learners can continue with notes if offline.
- `order` / scenario exercises are supported in the panel but not yet widely authored in catalog data.
- Legacy session components are unused by `App.tsx` but not deleted.
- No dedicated Playwright suite yet; browser verification is manual/screenshot-based.
