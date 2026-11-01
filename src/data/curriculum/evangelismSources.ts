/**
 * Evangelism & Apologetics source stubs — attribution and access hints only.
 * Do not paste copyrighted modern books or apologetics-site articles here.
 * Represent other worldviews from their own texts/official statements (paraphrased)
 * before offering a Reformed evangelical evaluation.
 */

import type { CurriculumSource } from './types'

export const SOURCE_PACKER_ORG: Omit<CurriculumSource, 'note'> = {
  teacherId: 'packer',
  teacher: 'J.I. Packer',
  work: 'Evangelism and the Sovereignty of God (selected themes)',
  role: 'organizational',
}

export const SOURCE_FRAME_SUP: Omit<CurriculumSource, 'note'> = {
  teacherId: 'frame',
  teacher: 'John M. Frame',
  work: 'Apologetics writings (selected themes)',
  role: 'supplementary',
}

export const SOURCE_GRUDEM_EVANG: Omit<CurriculumSource, 'note'> = {
  teacherId: 'grudem',
  teacher: 'Wayne Grudem',
  work: 'Systematic Theology (gospel loci — organizational map)',
  role: 'organizational',
}

export const SOURCE_SPROUL_EVANG: Omit<CurriculumSource, 'note'> = {
  teacherId: 'sproul',
  teacher: 'R.C. Sproul',
  work: 'Published Ligonier teaching on the gospel & apologetics (themes)',
  role: 'supplementary',
}

/** Public-domain philosophical text — use brief verified excerpts or summary-only. */
export const PRIMARY_HUME_DIALOGUES = {
  authorOrBody: 'David Hume',
  work: 'Dialogues Concerning Natural Religion',
  approxDate: '1779 (posthumous)',
  rightsNote:
    'Original English text is public domain. Modern annotated editions may be copyrighted — prefer PD text or summary-only.',
  reference: 'Public-domain editions widely available (e.g., Project Gutenberg / standard PD reprints).',
}

/** Roman historian — Annals 15.44 is a standard classical reference for early Christian persecution. */
export const PRIMARY_TACITUS_ANNALS = {
  authorOrBody: 'Tacitus',
  work: 'Annals 15.44',
  approxDate: 'c. AD 116',
  rightsNote:
    'Latin text and older English translations are public domain. Prefer brief verified excerpt or summary-only; modern annotated editions may be copyrighted.',
  reference: 'Standard Loeb / PD Latin and older English translations of Annals 15.',
}

/** Medieval scholastic — Five Ways often cited in classical theism; paraphrase or PD translation only. */
export const PRIMARY_AQUINAS_SUMMA = {
  authorOrBody: 'Thomas Aquinas',
  work: 'Summa Theologiae I, q.2 (existence of God — “Five Ways”)',
  approxDate: '1265–1274',
  rightsNote:
    'Latin text and many older English translations are public domain. Do not paste modern copyrighted translations.',
  reference: 'PD Latin / older English Summa editions (e.g., Fathers of the English Dominican Province, older printings).',
}

/**
 * Quran — cite by surah:ayah; paraphrase meaning in lessons.
 * Modern English translations are typically copyrighted; do not paste them.
 */
export const PRIMARY_QURAN = {
  authorOrBody: 'The Quran (Islamic scripture)',
  work: 'Quran (cited by surah and ayah)',
  approxDate: '7th century CE (traditional Islamic dating of revelation)',
  rightsNote:
    'Arabic text is treated as sacred scripture by Muslims. Modern English translations are usually copyrighted — use paraphrase + verse references only in Abide content.',
  reference:
    'Consult a reputable translation with notes (e.g., academic editions) for personal study; Abide lessons summarize, they do not reproduce translation text.',
}

/** Hadith literature — paraphrase with collection/reference; grades and canons vary. */
export const PRIMARY_HADITH = {
  authorOrBody: 'Hadith collections (e.g., Sahih al-Bukhari, Sahih Muslim — Sunni canon examples)',
  work: 'Hadith (reports about Muhammad’s words and deeds)',
  approxDate: 'Compiled centuries after Muhammad (classical collections ~9th century CE)',
  rightsNote:
    'Arabic Hadith texts circulate widely; modern English editions are often copyrighted. Prefer paraphrase with collection name and topical reference.',
  reference:
    'Standard Hadith collections and academic introductions to Hadith sciences; note Sunni/Shia differences in authoritative corpora.',
}
