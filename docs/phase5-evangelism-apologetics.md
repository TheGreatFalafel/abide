# Phase 5 — Evangelism & Apologetics

## Architecture audit

Reuse the Phase 3/4 curriculum + bite-sized stack. Do **not** add a new lesson engine.

| Need | Approach |
| --- | --- |
| Content | New `CurriculumTopic`s with `domain: 'evangelism-apologetics'` |
| Session | Existing `BiteSizedLessonSession` |
| Exercises | Existing kinds + new `conversation` exercise in `BiteExercise` / `BiteExercisePanel` |
| Progress / XP / gems | Unchanged `completeCurriculumLesson` |
| Learn UX | **Witness** tab |

Theology and Church History topics remain intact.

## Curriculum structure

| Section | Topic id | Status |
| --- | --- | --- |
| A. Understanding the Gospel | `gospel-foundations` | **Shipped (4 lessons)** |
| B. Sharing Your Faith | `sharing-your-faith` | **Shipped (4 lessons)** |
| C. Christian Apologetics (topical) | `christian-apologetics` | **Shipped Phase 6 (8 lessons)** — see `docs/phase6-christian-apologetics.md` |
| D. Other beliefs | `worldview-atheism`, `understanding-islam` | **Atheism + Islam shipped**; others planned |
| E. Practical evangelism | embedded in B + conversation sims | **Started** |

### First comparative worldview: Atheism

Chosen because:

1. Clear educational scope overlapping apologetics.
2. Public-domain philosophical sources available (e.g., Hume) for careful citation/summary.
3. Lower risk of rushed misrepresentation versus complex living religious traditions.

Remaining planned worldview topics: Roman Catholicism, LDS, Islam, Jehovah’s Witnesses, Judaism, Hinduism, Buddhism, Agnosticism (may merge with atheism materials where appropriate).

## Source standards

- Scripture first.
- Other worldviews described from their own categories before Reformed evaluation.
- `evangelismSources.ts` for Packer / Frame / Grudem / Sproul attribution stubs (paraphrase only).
- `primary_source` blocks for PD texts; copyrighted official catechisms/publications must be **paraphrased with section references**, never pasted.

## Conversation simulator

`BiteConversationExercise`: multi-step partner lines + learner choices tagged `helpful | incomplete | inaccurate | hostile`.

- Feedback explains quality.
- Hostile replies never score as success.
- Whole exercise counts correct only if every step chose `helpful`.

## Expansion plan

1. Author remaining worldview courses one at a time with primary/official sources.
2. ~~Add dedicated apologetics topic~~ → done in Phase 6 (`christian-apologetics`).
3. Grow conversation bank for Catholic, Muslim, LDS, and “hurt by church” scenarios.
4. Optional free-text later — only with careful, non-overclaiming evaluation.

## Catalog

`CURRICULUM_CATALOG_VERSION = 6` (Phase 7 Islam added; completions preserved).
