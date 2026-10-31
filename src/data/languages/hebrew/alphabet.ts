import type { LanguageLetter } from '../types'

/**
 * The 22 consonants of the Biblical Hebrew alphabet (אָלֶף־בֵּית), in traditional order.
 *
 * Pronunciation follows a common academic / introductory-grammar convention used in
 * first-year Biblical Hebrew classrooms (the kind of convention found across standard
 * intro grammars). This is a teaching simplification, not a claim about exact ancient
 * phonetics, and it differs in several places from Modern (Israeli) Hebrew pronunciation
 * — see the course-level `pronunciationNote` for specifics (e.g. Modern Hebrew merges
 * several historically distinct consonant sounds: א/ע, ח/כ, ט/ת, ס/שׂ).
 *
 * Five letters have a distinct "final form" (סוֹפִית) used only when the letter ends a word:
 * kaf, mem, nun, pe, and tsade.
 */
export const HEBREW_ALPHABET: LanguageLetter[] = [
  {
    id: 'hb-alef',
    glyph: 'א',
    name: 'Alef',
    transliteration: 'ʾ',
    pronunciation:
      'A glottal stop (the catch in your throat in "uh-oh"), or silent in many positions. Carries no sound of its own; vowels are written with it.',
    soundCue: 'uh-oh (the little catch between syllables)',
  },
  {
    id: 'hb-bet',
    glyph: 'ב',
    name: 'Bet',
    transliteration: 'b / v',
    pronunciation:
      'With a dagesh (dot) in the letter, "b" as in "boy." Without the dot, a soft "v" as in "van." Beginners can start by reading it as "b" and refine later.',
    soundCue: 'b (boy) or v (van)',
  },
  {
    id: 'hb-gimel',
    glyph: 'ג',
    name: 'Gimel',
    transliteration: 'g',
    pronunciation: 'A hard "g" as in "go," never soft as in "gym."',
    soundCue: 'g (go)',
  },
  {
    id: 'hb-dalet',
    glyph: 'ד',
    name: 'Dalet',
    transliteration: 'd',
    pronunciation: '"d" as in "door."',
    soundCue: 'd (door)',
  },
  {
    id: 'hb-he',
    glyph: 'ה',
    name: 'He',
    transliteration: 'h',
    pronunciation: '"h" as in "house." Often silent at the end of a word (a vowel-letter there, not a consonant sound).',
    soundCue: 'h (house)',
  },
  {
    id: 'hb-vav',
    glyph: 'ו',
    name: 'Vav',
    transliteration: 'v (w)',
    pronunciation:
      'Taught as "v" as in "van" in most introductory courses. Many scholars reconstruct the ancient consonantal sound as "w" (as in "way"). Also doubles as a vowel letter (see Lesson 2) and as the conjunction "and."',
    soundCue: 'v (van); historically closer to w (way)',
  },
  {
    id: 'hb-zayin',
    glyph: 'ז',
    name: 'Zayin',
    transliteration: 'z',
    pronunciation: '"z" as in "zoo."',
    soundCue: 'z (zoo)',
  },
  {
    id: 'hb-het',
    glyph: 'ח',
    name: 'Het',
    transliteration: 'ḥ',
    pronunciation:
      'A raspy, breathy sound made at the back of the throat — think of clearing your throat gently, or German "ach." In Modern Hebrew this has largely merged with kaf\'s fricative sound, but academic Biblical Hebrew keeps it distinct.',
    soundCue: 'rasped "kh" (German "ach," or clearing the throat)',
  },
  {
    id: 'hb-tet',
    glyph: 'ט',
    name: 'Tet',
    transliteration: 'ṭ',
    pronunciation:
      'An emphatic "t," historically distinct from tav but pronounced the same ("t" as in "top") in the academic classroom convention used here.',
    soundCue: 't (top) — historically a distinct "emphatic" t',
  },
  {
    id: 'hb-yod',
    glyph: 'י',
    name: 'Yod',
    transliteration: 'y',
    pronunciation: '"y" as in "yes." Also doubles as a vowel letter marking a long "i" or "ee" sound.',
    soundCue: 'y (yes)',
  },
  {
    id: 'hb-kaf',
    glyph: 'כ',
    finalGlyph: 'ך',
    name: 'Kaf',
    transliteration: 'k / kh',
    pronunciation:
      'With a dagesh, "k" as in "kite." Without it, a softer "kh" rasp similar to Het. Takes the final form ך at the end of a word.',
    soundCue: 'k (kite) or kh (loch)',
  },
  {
    id: 'hb-lamed',
    glyph: 'ל',
    name: 'Lamed',
    transliteration: 'l',
    pronunciation: '"l" as in "lamp."',
    soundCue: 'l (lamp)',
  },
  {
    id: 'hb-mem',
    glyph: 'מ',
    finalGlyph: 'ם',
    name: 'Mem',
    transliteration: 'm',
    pronunciation: '"m" as in "mom." Takes the final form ם at the end of a word.',
    soundCue: 'm (mom)',
  },
  {
    id: 'hb-nun',
    glyph: 'נ',
    finalGlyph: 'ן',
    name: 'Nun',
    transliteration: 'n',
    pronunciation: '"n" as in "nose." Takes the final form ן at the end of a word.',
    soundCue: 'n (nose)',
  },
  {
    id: 'hb-samekh',
    glyph: 'ס',
    name: 'Samekh',
    transliteration: 's',
    pronunciation: '"s" as in "sun." Sounds identical to שׂ (sin) and must be distinguished by spelling, not sound.',
    soundCue: 's (sun)',
  },
  {
    id: 'hb-ayin',
    glyph: 'ע',
    name: 'Ayin',
    transliteration: 'ʿ',
    pronunciation:
      'A deep, voiced throat sound with no real English equivalent; most beginning students pronounce it as a silent glottal stop (merging it in sound, though not in spelling, with alef). Modern Hebrew speakers typically do not distinguish it from alef either.',
    soundCue: 'a guttural catch — often simplified to silent in the classroom',
  },
  {
    id: 'hb-pe',
    glyph: 'פ',
    finalGlyph: 'ף',
    name: 'Pe',
    transliteration: 'p / f',
    pronunciation:
      'With a dagesh, "p" as in "pot." Without it, "f" as in "fun." Takes the final form ף at the end of a word.',
    soundCue: 'p (pot) or f (fun)',
  },
  {
    id: 'hb-tsade',
    glyph: 'צ',
    finalGlyph: 'ץ',
    name: 'Tsade',
    transliteration: 'ts',
    pronunciation: '"ts" as in "nuts." Takes the final form ץ at the end of a word.',
    soundCue: 'ts (nuts)',
  },
  {
    id: 'hb-qof',
    glyph: 'ק',
    name: 'Qof',
    transliteration: 'q',
    pronunciation:
      'Pronounced "k" as in "kite" in the classroom convention, though historically a distinct sound made further back in the throat than kaf.',
    soundCue: 'k (kite) — historically a deeper "k"',
  },
  {
    id: 'hb-resh',
    glyph: 'ר',
    name: 'Resh',
    transliteration: 'r',
    pronunciation: '"r," commonly taught as an English-style "r," though a rolled or guttural "r" is also attested.',
    soundCue: 'r (run)',
  },
  {
    id: 'hb-shin',
    glyph: 'ש',
    name: 'Shin / Sin',
    transliteration: 'sh / s',
    pronunciation:
      'The same letter is pointed two ways: a dot over the right arm (שׁ) gives "sh" as in "ship"; a dot over the left arm (שׂ) gives "s" as in "sun." Context and the dot (not covered until vowel-pointing lessons) distinguish them.',
    soundCue: 'sh (ship) or s (sun), by pointing',
  },
  {
    id: 'hb-tav',
    glyph: 'ת',
    name: 'Tav',
    transliteration: 't',
    pronunciation: '"t" as in "top" in the classroom convention used here (some traditions softened an undotted tav to "th").',
    soundCue: 't (top)',
  },
]
