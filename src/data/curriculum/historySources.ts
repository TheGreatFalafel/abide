/**
 * Church History source stubs — attribution and access hints only.
 * Do not paste copyrighted modern textbooks or sermons here.
 * Primary excerpts must be verified public-domain (or summary-only).
 */

import type { CurriculumSource } from './types'

export const SOURCE_SCHAFF_ORG: Omit<CurriculumSource, 'note'> = {
  teacherId: 'schaff',
  teacher: 'Philip Schaff',
  work: 'History of the Christian Church (public-domain editions)',
  role: 'organizational',
}

export const SOURCE_NEEDHAM_SUP: Omit<CurriculumSource, 'note'> = {
  teacherId: 'needham',
  teacher: 'Nick Needham',
  work: '2,000 Years of Christ’s Power (selected themes)',
  role: 'supplementary',
}

export const SOURCE_GONZALEZ_SUP: Omit<CurriculumSource, 'note'> = {
  teacherId: 'gonzalez',
  teacher: 'Justo L. González',
  work: 'The Story of Christianity (selected themes)',
  role: 'supplementary',
}

/** Nicene Creed — traditional English form is public domain. */
export const PRIMARY_NICENE_CREED = {
  authorOrBody: 'First Council of Nicaea (expanded at Constantinople)',
  work: 'Nicene Creed (Niceno-Constantinopolitan form)',
  approxDate: '325 / 381 AD',
  rightsNote:
    'Traditional English wording of the creed is treated as public domain. Modern annotated editions may still be copyrighted — use only the creed text itself.',
  reference: 'Commonly printed in hymnals and confessional collections; Greek/Latin in NPNF and many PD editions.',
}

/** Apostles’ Creed — traditional English form is public domain. */
export const PRIMARY_APOSTLES_CREED = {
  authorOrBody: 'Western church tradition (received form)',
  work: 'Apostles’ Creed',
  approxDate: 'Received form solidified by late antiquity (roots earlier)',
  rightsNote: 'Traditional English wording is public domain.',
  reference: 'Widely printed; Latin text in many public-domain liturgical collections.',
}

/** 1 Clement — Lightfoot and ANF/NPNF translations are public domain. */
export const PRIMARY_1_CLEMENT = {
  authorOrBody: 'Clement of Rome (traditionally attributed)',
  work: '1 Clement (Letter to the Corinthians)',
  approxDate: 'c. 95–97 AD',
  rightsNote:
    'Public-domain English translations include those in the Ante-Nicene Fathers series and Lightfoot’s editions. Prefer brief verified excerpts; do not paste modern copyrighted translations.',
  reference: 'ANF vol. 1; Lightfoot, The Apostolic Fathers (PD scans widely available).',
}

/** Athanasius — On the Incarnation PD translations exist (e.g., older NPNF). */
export const PRIMARY_ATHANASIUS_INCARNATION = {
  authorOrBody: 'Athanasius of Alexandria',
  work: 'On the Incarnation',
  approxDate: 'c. 318–335 AD (exact dating debated)',
  rightsNote:
    'Older English translations in NPNF are public domain. Modern translations (e.g., Crestwood/SVS) remain under copyright — do not reproduce those editions.',
  reference: 'NPNF second series, vol. 4 (public domain).',
}
