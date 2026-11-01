# Phase 7 — Understanding Islam

## Architecture audit (before coding)

Reuse Phase 3–6 Witness stack. **No new lesson engine.**

| Need | Existing piece | Phase 7 action |
| --- | --- | --- |
| Pattern | `worldview-atheism` comparative course | New topic `understanding-islam` |
| Domain / UX | `evangelism-apologetics` + Witness tab | List after Atheism (worldview track) |
| Session / XP / drafts | Bite engine + `completeCurriculumLesson` | Unchanged |
| Exercises | MC, match, true/false, order, conversation | Reuse; conversations on Trinity, cross, Bible, gospel |
| Sources | `evangelismSources.ts`, `primary_source` | Quran/Hadith stubs — **summary + ayah refs**, no copyrighted translation dumps |
| Catalog | `CURRICULUM_CATALOG_VERSION` | Bump to **6** |

Gospel Foundations, Apologetics, Sharing Faith, and Atheism remain intact.

### Lesson-count note

Tests allow up to **10** lessons per topic so this course can ship as one coherent Witness topic (ten sections).

## Curriculum structure

**Topic id:** `understanding-islam`  
**Title:** Understanding Islam  
**Prerequisite:** `gospel-foundations`  
**Placement:** After Understanding Atheism in Witness browse order.

| # | Lesson id | Section |
| --- | --- | --- |
| 1 | `islam-introduction-origins` | Introduction to Islam |
| 2 | `islam-quran-sources` | The Quran and Islamic Sources |
| 3 | `islam-allah-monotheism` | Who Is Allah? |
| 4 | `islam-jesus` | Who Is Jesus? |
| 5 | `islam-salvation-afterlife` | Salvation and the Afterlife |
| 6 | `islam-five-pillars` | The Five Pillars |
| 7 | `islam-differences-christianity` | Major Differences with Christianity |
| 8 | `islam-diversity-sunni-shia` | Muslim Perspectives and Diversity |
| 9 | `islam-common-questions` | Common Questions and Objections |
| 10 | `islam-sharing-gospel` | Sharing the Gospel with Muslims |

## Source standards

1. Describe Islamic teaching from Islamic categories first (Quran, Hadith, classical theology), then Reformed evaluation.
2. Cite Quran by surah:ayah; paraphrase meaning — do not paste modern copyrighted English translations.
3. Distinguish Quran, Hadith grades/usage, fiqh/Sharia, and what individual Muslims believe.
4. Represent Sunni / Shia (and note further diversity) without treating Islam as monolithic.
5. Historical claims marked carefully; disputed biography details acknowledged.
6. Christian comparison uses Scripture + historic Reformed evangelical confession; no strawmen.

## Conversation practice

Scenarios: Jesus’ deity / Trinity; crucifixion; Bible preservation; gospel / forgiveness. Scoring unchanged (`helpful` required).

## Remaining gaps

- Deeper Surah-by-Surah study tracks.
- Extended Hadith methodology lesson.
- Regional Islam (Sufism, folk practice) depth.
- Arabic vocabulary aids (optional later).
- More conversation bank (Ramadan hospitality, family pressure).

## Verification results

- Topic registered; Witness lists **Understanding Islam** (10 lessons) after Atheism
- Conversations on Jesus’ deity, Trinity, crucifixion/Bible, and gospel assurance
- Quran/Hadith `primary_source` stubs use paraphrase + references (no copyrighted translation dumps)
- Vitest: **260 passed** (4 skipped)
- oxlint: pre-existing warnings only
- TypeScript: no new errors (remaining: pre-existing Neon `historyIntegrity.integration.test.ts`)
- Browser (http://localhost:3004): Witness list, Introduction to Islam, Who Is Jesus conversation + Helpful feedback verified

## Catalog

`CURRICULUM_CATALOG_VERSION = 6`
