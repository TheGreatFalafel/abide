# Phase 4 — Church History curriculum

## Architecture audit

Church History **extends the existing curriculum catalog** and Phase 3 bite-sized engine. It does **not** add a third lesson subject or a languages-like track.

| Need | Approach |
| --- | --- |
| Content model | `CurriculumTopic` / `CurriculumLesson` + new `primary_source` block |
| Session UI | Existing `BiteSizedLessonSession` / `BiteExercisePanel` |
| Compiler | `compileCurriculumBiteLesson` (history-aware intro/labels + interactive exercises) |
| Progress / XP / gems | Unchanged `completeCurriculumLesson` + draft fields |
| Sync | Existing `mergeCurriculumProgress` |
| Learn UX | New **History** tab via `domain: 'church-history'` |

Theology topics remain untouched in content and completion IDs.

## Curriculum structure (chronological)

| Era | Topic id (planned) | Status |
| --- | --- | --- |
| Early Church (c. 30–500) | `early-church` | **Shipped (5 lessons)** |
| Medieval Church (c. 500–1500) | `medieval-church` | Planned; prereq `early-church` |
| Protestant Reformation (c. 1500–1650) | `reformation` | Planned |
| Post-Reformation & Revival (c. 1650–1900) | `post-reformation` | Planned |
| Modern Christianity (1900–present) | `modern-christianity` | Planned |

### Early Church lessons

1. `early-apostolic-setting` — Apostolic church & setting  
2. `early-persecution-expansion` — Persecution & expansion  
3. `early-apostolic-fathers` — Apostolic Fathers  
4. `early-creeds` — Early creeds / rule of faith  
5. `early-nicaea-arian` — Nicaea & Arian controversy  

## Source & attribution model

- Topic `sources[]` extended with historians (`schaff`, `needham`, `gonzalez`) — **paraphrase / organizational notes only**.
- `ContentPrimarySource` blocks carry author/body, work, date, context, optional **verified public-domain** excerpt, significance, rights note, and access hint.
- Helpers live in `src/data/curriculum/historySources.ts`.
- No fabricated quotations. Copyrighted modern textbooks/sermons are never reproduced.

## Interactive exercises

Lessons may set `interactiveExercises` (`order`, `match`, `true_false`, …). The compiler merges them with capped MC practice (`CURRICULUM_PRACTICE_CAP`).

## Expansion plan

1. Author Medieval topic with the same block patterns and PD primary sources (Augustine excerpts from NPNF, creeds, etc.).
2. Chain `prerequisites` across eras.
3. Optional Learn timeline chrome (era strip) once multiple eras exist.
4. Keep enriching `interactiveExercises` for historical reasoning (not date trivia alone).

## Known gaps / limitations

- Only Early Church is populated.
- No interactive maps or portrait assets yet.
- Distinction UI labels adapt for history; legacy `CurriculumLesson.tsx` is unused by App but still present.
- Catalog version bumped to **3** (completions preserved).
