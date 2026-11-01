# Phase 6 — Christian Apologetics Course

## Architecture audit (before coding)

Reuse the Phase 3–5 stack. **No new lesson engine.**

| Need | Existing piece | Phase 6 action |
| --- | --- | --- |
| Domain / Learn UX | `evangelism-apologetics` + **Witness** tab | Add one topic; list order after gospel foundations |
| Content model | `CurriculumTopic` / `CurriculumLesson` / `ContentBlock` | New topic file only |
| Session / drafts / XP / gems | `BiteSizedLessonSession`, `completeCurriculumLesson` | Unchanged |
| Exercises | `mc`, `match`, `true_false`, `order`, `conversation` | Reuse; conversations on hard objections |
| Sources | `evangelismSources.ts`, `primary_source` blocks | Extend stubs + PD/primary summaries |
| Catalog | `CURRICULUM_CATALOG_VERSION` | Bump to **5** (membership add; completions preserved) |

Theology, Church History, Gospel, Sharing Faith, and Atheism topics stay intact.

### Soft limit note

Catalog tests previously capped topics at ≤6 lessons. Apologetics ships **8** coherent sections as one topic; the test ceiling is raised to **8**. Validator does not hard-cap lesson count.

## Curriculum structure

**Topic id:** `christian-apologetics`  
**Title:** Christian Apologetics  
**Prerequisite:** `gospel-foundations`  
**Placement in Witness:** after Understanding the Gospel; before Sharing Your Faith (so learners see reasons after gospel clarity, then practice witness).

| # | Lesson id | Section |
| --- | --- | --- |
| 1 | `apologetics-god-exists` | Does God Exist? |
| 2 | `apologetics-trust-bible` | Can We Trust the Bible? |
| 3 | `apologetics-resurrection` | The Resurrection of Jesus |
| 4 | `apologetics-problem-of-evil` | The Problem of Evil |
| 5 | `apologetics-science-faith` | Science and Christianity |
| 6 | `apologetics-morality-dignity` | Morality and Human Value |
| 7 | `apologetics-exclusivity` | Religious Exclusivity |
| 8 | `apologetics-difficult-objections` | Difficult Questions and Objections |

## Source standards

- Scripture first; Reformed evangelical evaluation labeled as interpretation.
- Serious objections stated fairly before responses.
- Distinguish historical claims, philosophical arguments, scientific description, and theology.
- Attribution via Packer / Frame / Sproul stubs (paraphrase themes only).
- Public-domain primary sources (e.g., Tacitus *Annals*, older Aquinas translations) with `rightsNote`; no copyrighted modern apologetics pasted.
- Do not overclaim manuscript, archaeological, or scientific “proof.”

## Conversation practice

Conversations on evil/suffering, exclusivity/pluralism, and hypocrisy / hard OT questions. Scoring unchanged: all steps must be `helpful`.

## Remaining content gaps

- Deeper manuscript / textual-criticism lab lessons.
- Dedicated archaeology deep-dives with more primary dig reports.
- Expanded free-will / theodicy philosophical track.
- More conversation bank (science peer, OT violence specialist, unanswered prayer).
- Optional later: free-text reply evaluation (careful, non-overclaiming).

## Verification results

- Topic registered; Witness lists **Christian Apologetics** (8 lessons) after Gospel foundations
- Lessons compile through bite engine; conversations on evil, exclusivity, difficult objections
- Vitest: **258 passed** (4 skipped)
- oxlint: warnings only (pre-existing); no new errors from this work
- TypeScript: `BiteConversationChoice` export fixed; remaining errors only in pre-existing `historyIntegrity.integration.test.ts`
- Browser (http://localhost:3003): Witness list, Does God Exist? intro, Problem of Evil conversation + Helpful feedback verified

## Catalog

`CURRICULUM_CATALOG_VERSION = 5`
