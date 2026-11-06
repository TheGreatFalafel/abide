import type { LanguageCourse, LanguageLesson } from '../types'
import type { LanguageExercise } from '../types'
import { HEBREW_ALPHABET } from './alphabet'
import { HEBREW_PART15_BY_LESSON } from './part15Exercises'
import { HEBREW_VOCABULARY } from './vocabulary'

function withPart15(lessonId: string, exercises: LanguageExercise[]): LanguageExercise[] {
  return [...exercises, ...(HEBREW_PART15_BY_LESSON[lessonId] ?? [])]
}

const ALL_LETTER_IDS = HEBREW_ALPHABET.map((l) => l.id)

const lessonConsonants: LanguageLesson = {
  id: 'hebrew-consonants',
  order: 1,
  title: 'The Hebrew Consonants',
  estimatedMinutes: 35,
  objectives: [
    'Recognize and name all 22 consonants of the Hebrew alphabet.',
    'Read and write Hebrew right-to-left.',
    'Identify the five letters with distinct final forms (kaf, mem, nun, pe, tsade) and recognize them at the end of a word.',
    'Understand that the pronunciation taught here is an academic classroom convention, not necessarily ancient or Modern Israeli pronunciation.',
  ],
  content: [
    {
      kind: 'rtl_note',
      body:
        'Hebrew is written and read from right to left — the opposite direction from English. Within a word, letters still connect left-to-right relative to each other (the first letter of a word is its right-most letter), but the overall flow of reading moves right to left across the line, and pages of a Hebrew book turn in the opposite direction from an English book.',
    },
    {
      kind: 'teaching',
      title: 'Twenty-two consonants, no vowels yet',
      body:
        'The Hebrew alphabet (traditionally called the "alef-bet," after its first two letters) has 22 consonant letters and, originally, no vowel letters built into the standard alphabet. Ancient readers supplied the vowels from memory and context; Lesson 2 introduces the system of vowel points (niqqud) that was added many centuries later to preserve a reading tradition.',
    },
    {
      kind: 'concept',
      term: 'Final forms (אוֹתִיּוֹת סוֹפִיּוֹת)',
      explanation:
        'Five letters change shape when they are the very last letter of a word: kaf (כ → ך), mem (מ → ם), nun (נ → ן), pe (פ → ף), and tsade (צ → ץ). The sound does not change — only the written shape, and only in that word-final position.',
    },
    {
      kind: 'example',
      original: 'מֶלֶךְ',
      transliteration: 'melek',
      gloss: 'king',
      note: 'Ends in ך — the final form of kaf.',
    },
    {
      kind: 'example',
      original: 'בֵּן',
      transliteration: 'ben',
      gloss: 'son',
      note: 'Ends in ן — the final form of nun.',
    },
    {
      kind: 'example',
      original: 'אֶרֶץ',
      transliteration: 'ʾerets',
      gloss: 'land, earth',
      note: 'Ends in ץ — the final form of tsade.',
    },
    {
      kind: 'example',
      original: 'כֶּסֶף',
      transliteration: 'kesef',
      gloss: 'silver, money',
      note: 'Ends in ף — the final form of pe.',
    },
    {
      kind: 'example',
      original: 'שָׁלוֹם',
      transliteration: 'shalom',
      gloss: 'peace',
      note: 'Ends in ם — the final form of mem.',
    },
    {
      kind: 'caution',
      body:
        'The pronunciation taught in this course follows a common academic, introductory-classroom convention for Biblical Hebrew. It is a teaching simplification: letters we pronounce alike for simplicity (such as א/ע, or ט/ת) were likely distinct sounds in ancient Hebrew, and Modern (Israeli) Hebrew pronunciation differs further still. This is a practical starting point for learning to read the text, not a claim to have recovered "the one true original sound."',
    },
  ],
  exercises: withPart15('hebrew-consonants', [
    {
      kind: 'alphabet_match',
      prompt: 'Match each consonant glyph to its name.',
      letterIds: ALL_LETTER_IDS,
    },
    {
      kind: 'mc',
      question: {
        id: 'hebrew-consonants-mc-1',
        type: 'mc',
        prompt: 'Which of these letters has a distinct final (word-ending) form?',
        choices: ['Bet (ב)', 'Kaf (כ)', 'Dalet (ד)', 'Resh (ר)'],
        answer: 1,
        explanation:
          'Kaf is one of five letters — kaf, mem, nun, pe, and tsade — that take a special shape (ך) only at the end of a word.',
        difficulty: 'beginner',
      },
    },
    {
      kind: 'mc',
      question: {
        id: 'hebrew-consonants-mc-2',
        type: 'mc',
        prompt: 'Hebrew is written and read in which direction?',
        choices: ['Left to right', 'Right to left', 'Top to bottom', 'It varies by book'],
        answer: 1,
        explanation: 'Hebrew, like other Semitic scripts, is written and read from right to left.',
        difficulty: 'beginner',
      },
    },
  ]),
  reflectionPrompts: [
    'What felt different about tracking text that moves right to left?',
    'Why might recognizing the five final letter forms matter before you try to sound out whole words?',
  ],
}

const lessonVowels: LanguageLesson = {
  id: 'hebrew-vowels',
  order: 2,
  title: 'Vowel Points and Syllables',
  estimatedMinutes: 40,
  objectives: [
    'Identify the common Masoretic vowel points (niqqud) and their approximate sounds.',
    'Divide simple Hebrew words into syllables.',
    'Distinguish a silent shva from a vocal (reduced) shva.',
    'Explain, in brief, why vowel points were added to the Hebrew text and what that means for how we use them today.',
  ],
  content: [
    {
      kind: 'teaching',
      title: 'Dots and dashes above, below, and inside the letters',
      body:
        'Hebrew vowels are written as small marks (niqqud) placed mostly beneath — and occasionally above or inside — the consonants. These marks were added by scholars called the Masoretes (roughly the 7th–10th centuries AD) to preserve a careful oral reading tradition that was already very old by their time. The consonantal text itself is far older than the written vowel points.',
    },
    {
      kind: 'concept',
      term: 'Common vowel signs',
      explanation:
        'A practical starter set: patach (ַ) and qamats (ָ) both commonly sound like "a" (as in "father"); hireq (ִ) sounds like "i" (as in "machine" or shorter); tsere (ֵ) and segol (ֶ) both commonly sound like "e" (as in "they" or "bed"); holam (ֹ) sounds like "o" (as in "go"); qubuts (ֻ) and shureq (וּ) sound like "u" (as in "moon"). Several of these pairs were likely distinguished by vowel length in ancient pronunciation; the academic classroom convention here does not always force that distinction for beginners.',
    },
    {
      kind: 'concept',
      term: 'The shva (ְ)',
      explanation:
        'The shva is the trickiest mark for beginners: it can be silent (marking the end of a syllable, with no vowel sound at all) or vocal (a quick, reduced "uh" sound that opens a new syllable). Which one applies depends on its position in the word — a detail that becomes more intuitive with practice and is refined in later study, not something this course resolves with one simple rule.',
    },
    {
      kind: 'concept',
      term: 'Syllables',
      explanation:
        'A Hebrew syllable needs exactly one vowel sound. An "open" syllable ends in a vowel; a "closed" syllable ends in a consonant. Breaking a word into syllables is a helpful first step toward sounding it out and, later, toward understanding verb and noun patterns, which are built around syllable structure.',
    },
    {
      kind: 'example',
      original: 'בְּרֵאשִׁית',
      transliteration: 'be-re-shit',
      gloss: 'in the beginning',
      note:
        'The opening shva under bet is vocal (a quick "be-"); the alef is silent here, carried along inside the syllable with resh.',
    },
    {
      kind: 'example',
      original: 'אֱלֹהִים',
      transliteration: 'ʾe-lo-him',
      gloss: 'God; gods',
      note:
        'The small mark under alef is a "composite shva" (chataf segol) — a brief vowel used instead of a full silent/vocal shva under certain guttural letters like alef.',
    },
    {
      kind: 'caution',
      body:
        'Vowel points were added roughly a thousand years after Hebrew had ceased to be most people\'s everyday spoken language, by scholars preserving a received oral reading tradition. They are an enormously valuable, carefully transmitted guide to reading — but it is worth remembering they are a reading tradition layered onto an older consonantal text, not part of the text in the very same sense as the consonants themselves.',
    },
  ],
  exercises: withPart15('hebrew-vowels', [
    {
      kind: 'mc',
      question: {
        id: 'hebrew-vowels-mc-1',
        type: 'mc',
        prompt: 'Which best describes a vocal shva?',
        choices: [
          'Always completely silent',
          'A quick, reduced "uh"-type sound that opens a syllable',
          'A long "a" vowel',
          'A mark that only appears at the end of a word',
        ],
        answer: 1,
        explanation:
          'A vocal shva is a brief, reduced vowel sound that begins a syllable; a silent shva, by contrast, simply closes a syllable with no vowel sound.',
        difficulty: 'intermediate',
      },
    },
    {
      kind: 'parse',
      prompt: 'How does בְּרֵאשִׁית divide into syllables?',
      form: 'בְּרֵאשִׁית',
      transliteration: 'bereshit',
      choices: ['be-re-shit', 'ber-esh-it', 'one single syllable', 'be-re-sh-i-t'],
      answer: 0,
      explanation:
        'בְּרֵאשִׁית divides as be- (vocal shva + bet) / re- (resh + tsere, with the silent alef carried along) / -shit (shin + hireq-yod + tav).',
    },
    {
      kind: 'translate',
      prompt: 'What does אֱלֹהִים mean, as introduced in this lesson?',
      original: 'אֱלֹהִים',
      transliteration: 'ʾelohim',
      choices: ['God; gods', 'heaven', 'earth', 'a personal name only'],
      answer: 0,
      explanation:
        'אֱלֹהִים is grammatically plural in form but is used, with a singular verb, as the primary word for the one God of Israel; it can also mean "gods" (plural) in other contexts.',
    },
  ]),
  introduceVocabIds: ['hv-elohim', 'hv-yhwh', 'hv-erets', 'hv-shamayim', 'hv-yom', 'hv-be', 'hv-le', 'hv-ve'],
  reflectionPrompts: [
    'Why might it matter, when reading the Hebrew Bible devotionally, to remember that the vowel points were added later than the consonants?',
    'What is one word from this lesson you could sound out slowly, syllable by syllable?',
  ],
  reviewFromLessonIds: ['hebrew-consonants'],
}

const lessonNouns: LanguageLesson = {
  id: 'hebrew-nouns',
  order: 3,
  title: 'Nouns: Gender, Number, and Construct Chains',
  estimatedMinutes: 45,
  objectives: [
    'Identify the grammatical gender (masculine/feminine) of a Hebrew noun from common patterns and recognize exceptions.',
    'Recognize singular, plural, and dual number on nouns.',
    'Explain the difference between "absolute" and "construct" state.',
    'Translate a simple Hebrew construct chain ("noun of noun") with an awareness of its range of meaning.',
  ],
  content: [
    {
      kind: 'teaching',
      title: 'Gender and number',
      body:
        'Every Hebrew noun has a grammatical gender, masculine or feminine — this is a feature of the word, not necessarily a statement about biological sex. Many feminine nouns carry a telltale ה- or ת- ending, but plenty of exceptions exist (אֶרֶץ, "land/earth," is feminine despite having no feminine ending at all). Number is usually singular or plural (masculine plurals commonly end in ־ים, feminine plurals in ־וֹת), with a smaller "dual" category used for naturally paired items and a few special words.',
    },
    {
      kind: 'concept',
      term: 'Dual and plural-only nouns',
      explanation:
        'A dual ending marks naturally paired things (hands, eyes). A few important nouns, including שָׁמַיִם ("heaven(s)/sky") and מַיִם ("water"), appear only in this plural/dual-shaped form with no singular counterpart in the language — they are simply plural-only words, not evidence of multiple literal "heavens" or "waters."',
    },
    {
      kind: 'concept',
      term: 'Construct chains (סְמִיכוּת)',
      explanation:
        'When Hebrew joins two nouns tightly to express a relationship like "X of Y," the first noun shifts into "construct state" — often shortened or vowel-reduced — and stands immediately before the second noun (the "absolute" noun), usually linked by a small hyphen-like mark called a maqaf. There is no separate word for "of": the relationship is shown purely by word order and the construct noun\'s altered form.',
    },
    {
      kind: 'example',
      original: 'בֶּן־מֶלֶךְ',
      transliteration: 'ben-melek',
      gloss: 'a king\'s son / son of a king',
      note:
        'The maqaf (hyphen) binds the construct noun (בֶּן, "son of") tightly to the following absolute noun (מֶלֶךְ, "king"). Compare the free-standing form בֵּן ("a son") from Lesson 2 — notice the vowel shortens slightly in construct.',
    },
    {
      kind: 'example',
      original: 'בֵּית הַמֶּלֶךְ',
      transliteration: 'beit hammelek',
      gloss: 'the house of the king / the king\'s house',
      note:
        'בַּיִת ("house") shortens to בֵּית in construct form. Notice the definite article הַ- ("the") attaches to the second noun (מֶּלֶךְ), not to the construct noun itself — that is the normal pattern for a definite construct chain.',
    },
    {
      kind: 'caution',
      body:
        'A construct chain can describe many kinds of relationships beyond plain ownership: material ("a house of stone" = a stone house), description or quality ("a man of war" = a warrior), or source — not only "belonging to." Translate each chain from its context rather than assuming a single fixed formula every time.',
    },
  ],
  exercises: withPart15('hebrew-nouns', [
    {
      kind: 'mc',
      question: {
        id: 'hebrew-nouns-mc-1',
        type: 'mc',
        prompt: 'In a definite construct chain like בֵּית הַמֶּלֶךְ, which noun carries the definite article "the"?',
        choices: [
          'The first (construct) noun',
          'The second (absolute) noun',
          'Neither noun',
          'Both nouns',
        ],
        answer: 1,
        explanation:
          'The article attaches to the second, absolute noun; the whole chain is then understood as definite ("the king\'s house"), even though the first noun has no article of its own.',
        difficulty: 'intermediate',
      },
    },
    {
      kind: 'parse',
      prompt: 'What grammatical state is בֶּן in the phrase בֶּן־מֶלֶךְ?',
      form: 'בֶּן־מֶלֶךְ',
      choices: ['Absolute state', 'Construct state', 'Plural state', 'Dual state'],
      answer: 1,
      explanation:
        'בֶּן here is in construct state — bound tightly to the following noun מֶלֶךְ to express "son of a king."',
    },
    {
      kind: 'translate',
      prompt: 'Which gloss best fits תּוֹרָה across most of its uses in the Hebrew Bible?',
      original: 'תּוֹרָה',
      transliteration: 'torah',
      choices: [
        'Instruction/teaching (and, by extension, law)',
        'A type of musical instrument',
        'A proper name only',
        'A unit of time',
      ],
      answer: 0,
      explanation:
        'תּוֹרָה is often rendered "law," but its core sense is "instruction/teaching" — it can describe a single instruction, a body of law, or the Pentateuch as a whole, depending on context.',
    },
  ]),
  introduceVocabIds: [
    'hv-ish',
    'hv-ben',
    'hv-melek',
    'hv-bayit',
    'hv-am',
    'hv-torah',
    'hv-navi',
    'hv-yad',
    'hv-lev',
  ],
  reflectionPrompts: [
    'Why might it matter, when you meet an English phrase like "son of man" or "house of the LORD," to know it may reflect a Hebrew construct chain?',
    'Can you think of a construct-chain relationship that is not simply about ownership (material, quality, or source instead)?',
  ],
  reviewFromLessonIds: ['hebrew-vowels'],
}

const lessonModifiers: LanguageLesson = {
  id: 'hebrew-modifiers',
  order: 4,
  title: 'The Article, Adjectives, Pronouns, and Prepositions',
  estimatedMinutes: 40,
  objectives: [
    'Identify the Hebrew definite article הַ and describe how it attaches to a noun.',
    'Recognize how attributive adjectives agree with and are positioned relative to their noun.',
    'List the basic independent personal pronouns.',
    'Use the core prepositions (עַל, אֶל, מִן) and the relative particle אֲשֶׁר with awareness of their range of meaning.',
  ],
  content: [
    {
      kind: 'teaching',
      title: 'The article is a prefix, not a separate word',
      body:
        'Hebrew has a definite article, "the," but it is written as a prefix (הַ-) attached directly to the noun — never as a free-standing word. Attaching it often triggers a doubling (a dagesh) in the next consonant: מֶלֶךְ ("a king") becomes הַמֶּלֶךְ ("the king"), with the mem doubled. Hebrew has no separate word for "a/an": a bare noun with no article is simply understood as indefinite.',
    },
    {
      kind: 'concept',
      term: 'Attributive adjectives',
      explanation:
        'A descriptive adjective normally follows the noun it modifies and agrees with it in gender and number — and, importantly, in definiteness: if the noun carries the article, the adjective usually does too. מֶלֶךְ טוֹב is "a good king"; הַמֶּלֶךְ הַטּוֹב is "the good king," with הַ- appearing on both words.',
    },
    {
      kind: 'concept',
      term: 'Independent personal pronouns',
      explanation:
        'Hebrew has a set of free-standing personal pronouns used mainly as subjects: אֲנִי ("I"), אַתָּה / אַתְּ ("you," masculine/feminine singular), הוּא / הִיא ("he" / "she"), אֲנַחְנוּ ("we"), אַתֶּם / אַתֶּן ("you," masculine/feminine plural), and הֵם / הֵנָּה ("they," masculine/feminine). Hebrew verbs also encode person/gender/number on their own (covered in Lesson 5), so a pronoun is often added mainly for emphasis or clarity, not strict grammatical necessity.',
    },
    {
      kind: 'concept',
      term: 'Prepositions and the relative particle',
      explanation:
        'Three of the most common prepositions you already met as prefixes (בְּ "in/with/by," לְ "to/for," וְ "and") are always attached directly to the next word. Several other prepositions stand on their own: עַל ("on, upon, concerning, against"), אֶל ("to, toward"), and מִן ("from, out of, than"). The relative particle אֲשֶׁר ("who, which, that") introduces a relative clause and never changes form for gender or number, unlike English "who" versus "which."',
    },
    {
      kind: 'example',
      original: 'הַמֶּלֶךְ הַטּוֹב',
      transliteration: 'hammelek hattov',
      gloss: 'the good king',
      note: 'The article הַ- appears on both the noun (מֶּלֶךְ) and the adjective describing it (טּוֹב).',
    },
    {
      kind: 'caution',
      body:
        'Hebrew prepositions such as עַל, אֶל, and מִן shift their best English rendering with context — spatial, topical, comparative, or adversarial — rather than mapping onto one fixed English word every time. Likewise, remember from Lesson 3 that the article and the construct state interact in a specific way: do not assume "the ___ of the ___" in English always implies an article on the first Hebrew noun too.',
    },
  ],
  exercises: withPart15('hebrew-modifiers', [
    {
      kind: 'mc',
      question: {
        id: 'hebrew-modifiers-mc-1',
        type: 'mc',
        prompt: 'Where does the Hebrew definite article attach?',
        choices: [
          'As a separate word placed before the noun',
          'As a prefix directly on the noun (and usually its adjective)',
          'As a suffix at the very end of the noun',
          'It is optional and rarely appears',
        ],
        answer: 1,
        explanation:
          'הַ- is a prefix fused directly onto the front of the noun it makes definite (and typically onto an adjective describing that noun as well).',
        difficulty: 'beginner',
      },
    },
    {
      kind: 'parse',
      prompt: 'Which word in הַמֶּלֶךְ הַטּוֹב functions as the descriptive adjective?',
      form: 'הַמֶּלֶךְ הַטּוֹב',
      choices: ['הַמֶּלֶךְ ("the king")', 'הַטּוֹב ("the good")', 'Both equally', 'Neither'],
      answer: 1,
      explanation:
        'הַמֶּלֶךְ is the noun being described; הַטּוֹב ("good") is the adjective, following the noun and agreeing with its definiteness.',
    },
    {
      kind: 'translate',
      prompt: 'Translate the relative particle אֲשֶׁר as introduced in this lesson.',
      original: 'אֲשֶׁר',
      choices: ['who / which / that', 'and', 'in / with / by', 'from / out of'],
      answer: 0,
      explanation:
        'אֲשֶׁר is Hebrew\'s general-purpose relative particle, introducing a clause describing or identifying something — invariant for gender and number.',
    },
  ]),
  introduceVocabIds: ['hv-kol', 'hv-asher', 'hv-al', 'hv-el', 'hv-min'],
  reflectionPrompts: [
    'How is the idea of a "prefixed article" similar to, or different from, how "the" works in English?',
    'Pick one of עַל, אֶל, or מִן — can you think of more than one possible English translation for it depending on context?',
  ],
  reviewFromLessonIds: ['hebrew-nouns'],
}

const lessonVerbs: LanguageLesson = {
  id: 'hebrew-verbs',
  order: 5,
  title: 'Verbs: Stems, Person, and the Perfect/Imperfect System',
  estimatedMinutes: 50,
  objectives: [
    'Identify the three-consonant root (shoresh) underlying most Hebrew verbs.',
    'Recognize that Hebrew verb forms mark person, gender, and number.',
    'Name the seven common binyanim (verb stems) and describe their basic function in general terms.',
    'Explain why "perfect" and "imperfect" are grammatical forms with a range of nuance, not simple equivalents of English past and future tense.',
  ],
  content: [
    {
      kind: 'teaching',
      title: 'Roots, stems, and conjugations',
      body:
        'Most Hebrew verbs are built on a three-consonant root (שֹׁרֶשׁ, shoresh) — such as כ-ת-ב ("write") — that carries the core meaning. The vowel pattern and any added prefixes or suffixes around that root then communicate the verb\'s stem (binyan), conjugation, and the subject\'s person, gender, and number.',
    },
    {
      kind: 'concept',
      term: 'The binyanim (verb stems)',
      explanation:
        'Classical Hebrew grammar names seven common stems built on the same root: Qal (the basic, most frequent active stem), Niphal (often passive or reflexive of Qal), Piel (often intensive or causative-like active), Pual (passive of Piel), Hifil (causative active — "cause to ___"), Hofal (passive of Hifil), and Hitpael (often reflexive or reciprocal — "___ oneself"). These are broad tendencies, not airtight rules; a given verb\'s actual stem meanings are learned root by root.',
    },
    {
      kind: 'concept',
      term: 'Person, gender, and number on the verb',
      explanation:
        'A finite Hebrew verb form itself encodes who performs the action: 1st, 2nd, or 3rd person; masculine or feminine (for 2nd and 3rd person); and singular or plural — all through prefixes and/or suffixes attached around the root, without necessarily needing a separate pronoun.',
    },
    {
      kind: 'caution',
      body:
        'The two main finite conjugations are traditionally called "perfect" (built on a קָטַל-type pattern) and "imperfect" (built on a יִקְטֹל-type pattern). The common shorthand "perfect = past tense, imperfect = future tense" is misleading. The perfect frequently describes a completed or past action, but it can also express a present general truth or even a confidently-expected future event (sometimes called the "prophetic perfect"). The imperfect frequently describes future or ongoing/repeated action, but it regularly covers present habitual action too — and, prefixed with vav in narrative, it takes on yet another sense (covered next lesson). Treat "perfect" and "imperfect" as the names of verb FORMS with a range of time-related nuance, not as a one-to-one match with English past and future.',
    },
    {
      kind: 'example',
      original: 'קָטַל',
      transliteration: 'qatal',
      gloss: '(he) killed — paradigm root ק-ט-ל, "perfect" 3rd masculine singular',
      note:
        'Grammars traditionally use this root (ק-ט-ל, "kill") as a clean model to display verb patterns without the complications of irregular roots. You will see this paradigm again as you study the stems in more depth.',
    },
    {
      kind: 'example',
      original: 'אָמַר',
      transliteration: 'ʾamar',
      gloss: 'he said',
      note:
        'The "perfect" 3rd masculine singular form of the very common verb אמר ("say"). Despite the traditional name, only context — not the form by itself — tells you whether this is a simple past action, a general statement, or something else.',
    },
  ],
  exercises: withPart15('hebrew-verbs', [
    {
      kind: 'mc',
      question: {
        id: 'hebrew-verbs-mc-1',
        type: 'mc',
        prompt: 'What does a Hebrew verb\'s three-consonant root (shoresh) primarily carry?',
        choices: [
          'The core lexical meaning of the verb',
          'The exact English tense, always',
          'The subject\'s gender only',
          'The speaker\'s regional dialect',
        ],
        answer: 0,
        explanation:
          'The root carries the basic lexical meaning; stem, vowel pattern, and affixes layer on grammatical nuance (voice, intensity, causation) and person/gender/number/conjugation.',
        difficulty: 'beginner',
      },
    },
    {
      kind: 'mc',
      question: {
        id: 'hebrew-verbs-mc-2',
        type: 'mc',
        prompt: 'Why is it misleading to call the Hebrew "perfect" simply "past tense"?',
        choices: [
          'Because it can also express a present general truth or a confidently-expected future event, depending on context',
          'Because Hebrew verbs have no concept of time at all',
          'Because the perfect is used only in poetry',
          'Because "perfect" and "imperfect" are identical in form',
        ],
        answer: 0,
        explanation:
          'While the perfect very often marks past/completed action, context can show a general truth ("the LORD is good," gnomic sense) or a confidently-expected future (the "prophetic perfect") — so the label "perfect" names a form, not a fixed English tense.',
        difficulty: 'intermediate',
      },
    },
    {
      kind: 'parse',
      prompt: 'Which binyan (stem) is typically described as the basic, most frequent active stem?',
      form: 'קָטַל (Qal)',
      choices: ['Qal', 'Piel', 'Hifil', 'Hitpael'],
      answer: 0,
      explanation:
        'Qal is the simplest, most common active stem; the other stems layer on nuances like intensity, causation, passivity, or reflexivity relative to Qal.',
    },
  ]),
  introduceVocabIds: ['hv-amar', 'hv-hayah', 'hv-shama', 'hv-raah', 'hv-natan'],
  reflectionPrompts: [
    'What is one example (in any language you know) where a single verb form can describe more than one kind of time or aspect?',
    'Why might treating "perfect" as a strict synonym for "past tense" lead a reader to overstate what a Hebrew sentence actually claims?',
  ],
  reviewFromLessonIds: ['hebrew-modifiers'],
}

const lessonVerbPatterns: LanguageLesson = {
  id: 'hebrew-verb-patterns',
  order: 6,
  title: 'Participles, Infinitives, and the Vav-Consecutive',
  estimatedMinutes: 45,
  objectives: [
    'Recognize an active participle and describe its noun-like/adjective-like function.',
    'Distinguish, at a basic level, the infinitive absolute from the infinitive construct.',
    'Describe how the vav-consecutive form functions in Hebrew narrative, without reducing it to one mechanical rule.',
  ],
  content: [
    {
      kind: 'teaching',
      title: 'Beyond perfect and imperfect',
      body:
        'Alongside the finite perfect and imperfect conjugations from Lesson 5, Hebrew verbs also form participles and infinitives — forms that behave more like nouns or adjectives than like a fully finite "he/she/it did/does" verb.',
    },
    {
      kind: 'concept',
      term: 'Participles',
      explanation:
        'An active participle (built on a קֹטֵל-type pattern) functions like a verbal adjective or noun — "one who kills / killing." Participles often describe ongoing action, a characteristic role, or a present circumstance, and are frequently best rendered into English with "-ing" or "the one who ___."',
    },
    {
      kind: 'concept',
      term: 'Infinitive absolute vs. infinitive construct',
      explanation:
        'The infinitive absolute often stands beside a finite verb of the same root to emphasize or intensify it (a pattern sometimes rendered in English as "he surely died" or "dying, he died"), or can stand alone as a terse command or summary. The infinitive construct behaves more like an English "to ___" or gerund, and very commonly follows the preposition לְ ("to/for") to express purpose: לְ + infinitive construct ≈ "in order to ___."',
    },
    {
      kind: 'concept',
      term: 'The vav-consecutive (vav-conversive)',
      explanation:
        'Biblical Hebrew narrative is driven forward by a distinctive form: a vav prefixed directly onto an imperfect verb (a וַיִּקְטֹל-type shape), which typically carries straightforward past, sequential narration — "and then he did X, and then Y happened." A related construction, vav prefixed to a perfect verb in certain sequential or future-oriented passages (common in legal, prophetic, and some poetic material), can carry a future or ongoing-sequence nuance instead. This is a distinct grammatical construction recognized by its characteristic prefixed shape — not simply any "vav" meaning "and" — and its precise function still varies some by genre and is discussed by grammarians in more technical detail than this course covers.',
    },
    {
      kind: 'example',
      original: 'וַיֹּאמֶר',
      transliteration: 'vayyomer',
      gloss: 'and he said',
      note:
        'A vav-consecutive form built on the imperfect of אמר ("say"). This exact form is, by a wide margin, the single most frequent verb form in Old Testament narrative — it is the engine that keeps Hebrew stories moving clause by clause.',
    },
    {
      kind: 'example',
      original: 'קֹטֵל',
      transliteration: 'qotel',
      gloss: '(one) killing / one who kills',
      note: 'The active participle of the paradigm root ק-ט-ל — functioning like a noun or adjective, not a finite verb.',
    },
    {
      kind: 'caution',
      body:
        'It is tempting to flatten the vav-consecutive into a tidy rule — "vav + imperfect = past" and "vav + perfect = future" — and that rule of thumb does describe the large majority of narrative instances. But treat it as a strong, recognizable pattern (identified by its distinctive prefixed shape) rather than an exceptionless mechanical formula: narrative, poetic, and legal material can use these forms somewhat differently, and skilled readers decide from context, not a flowchart alone.',
    },
  ],
  exercises: withPart15('hebrew-verb-patterns', [
    {
      kind: 'mc',
      question: {
        id: 'hebrew-verb-patterns-mc-1',
        type: 'mc',
        prompt: 'What is the primary narrative function of a vav-consecutive prefixed to an imperfect verb (a וַיִּקְטֹל-type form)?',
        choices: [
          'It typically carries the story forward as sequential past narration ("and then he did...")',
          'It always means the exact opposite of the verb\'s normal meaning',
          'It only occurs in poetry, never in narrative',
          'It marks a yes/no question',
        ],
        answer: 0,
        explanation:
          'This is the backbone form of Hebrew storytelling: clause after clause of וַ-prefixed imperfect verbs carrying the narrative forward in sequence.',
        difficulty: 'advanced',
      },
    },
    {
      kind: 'parse',
      prompt: 'What part of speech does a Hebrew active participle (such as קֹטֵל) most closely resemble in actual use?',
      form: 'קֹטֵל',
      choices: [
        'A noun or adjective ("one who kills," "killing")',
        'A preposition',
        'A conjunction',
        'A personal pronoun',
      ],
      answer: 0,
      explanation:
        'Participles function like verbal adjectives or nouns, describing an ongoing action or characteristic role, rather than acting as a fully finite verb.',
    },
    {
      kind: 'translate',
      prompt: 'Translate וַיֹּאמֶר as it is most commonly used in Hebrew narrative.',
      original: 'וַיֹּאמֶר',
      choices: ['and he said', 'he will say', 'say! (a command)', 'they said'],
      answer: 0,
      explanation:
        'As a vav-consecutive imperfect, וַיֹּאמֶר overwhelmingly functions as simple past narration, "and he said," driving the story forward.',
    },
  ]),
  introduceVocabIds: ['hv-bo', 'hv-halak', 'hv-asah'],
  reflectionPrompts: [
    'Why might a storyteller benefit from a dedicated verb form whose main job is simply "and then..."?',
    'What is one risk of treating the vav-consecutive rule as an exceptionless formula rather than a strong pattern?',
  ],
  reviewFromLessonIds: ['hebrew-verbs'],
}

const lessonSyntax: LanguageLesson = {
  id: 'hebrew-syntax',
  order: 7,
  title: 'Basic Hebrew Syntax and Word Order',
  estimatedMinutes: 35,
  objectives: [
    'Describe the common default clause word order in Biblical Hebrew narrative.',
    'Recognize the direct object marker אֵת / אֶת and explain what it does (and does not) mean.',
    'Identify how negation and yes/no questions are typically formed.',
    'Practice reading a short Hebrew clause phrase by phrase rather than forcing English word order onto it.',
  ],
  content: [
    {
      kind: 'teaching',
      title: 'Verb-first storytelling',
      body:
        'Classical Hebrew prose narrative very commonly favors a Verb-Subject-Object order, especially in the vav-consecutive chains from Lesson 6 ("and-he-said God..."). Word order is more flexible than in English overall, though, and can shift for emphasis, to front a topic, or for poetic effect — so "common default" is not the same as "fixed rule."',
    },
    {
      kind: 'concept',
      term: 'The direct object marker אֵת / אֶת',
      explanation:
        'This small, untranslatable particle simply flags the noun right after it as the direct object of the verb, typically when that noun is definite. It carries no independent meaning of its own in this role and is simply skipped over in a natural English translation. (A different, identically-spelled word אֵת meaning "with" exists separately — context, not spelling, tells readers which function is in play.)',
    },
    {
      kind: 'concept',
      term: 'Negation and questions',
      explanation:
        'The basic negative particle לֹא ("not") is placed immediately before the verb (or other word) it negates. A yes/no question is often signaled by an interrogative prefix הַ- attached to the first word of the question — identical in shape to the definite article from Lesson 4, but functioning quite differently; context shows which role it is playing.',
    },
    {
      kind: 'example',
      original: 'וְאֵת הָאָרֶץ',
      transliteration: 've\'et ha\'arets',
      gloss: 'and the earth',
      note:
        'אֵת here marks the following definite noun הָאָרֶץ as a direct object; it adds no word of its own to the English translation.',
    },
    {
      kind: 'caution',
      body:
        'Word order in Hebrew can carry real interpretive weight — fronting a word ahead of the verb, for instance, often signals emphasis or contrast. But it is easy to over-read significance into a word\'s position without solid grammatical support from the wider context. Treat a word-order observation as one piece of supporting evidence, not a decisive argument standing alone.',
    },
  ],
  exercises: withPart15('hebrew-syntax', [
    {
      kind: 'mc',
      question: {
        id: 'hebrew-syntax-mc-1',
        type: 'mc',
        prompt: 'What is the main function of the particle אֵת / אֶת placed before a definite noun?',
        choices: [
          'It marks that noun as the direct object of the verb',
          'It means "with" in every single instance',
          'It marks the subject of the sentence',
          'It negates the verb',
        ],
        answer: 0,
        explanation:
          'As a direct object marker, אֵת/אֶת simply flags the following definite noun as what the verb\'s action is done to — it is not translated as a separate English word.',
        difficulty: 'intermediate',
      },
    },
    {
      kind: 'parse',
      prompt: 'In a typical Biblical Hebrew narrative clause built on a vav-consecutive verb, what word order is most common?',
      form: '(word-order pattern, not a single word)',
      choices: [
        'Verb – Subject – Object',
        'Subject – Verb – Object',
        'Object – Verb – Subject',
        'Hebrew has no describable default order',
      ],
      answer: 0,
      explanation:
        'Vav-consecutive narrative clauses commonly place the verb first, then the subject, then the object — e.g., "and-he-said God, ..."',
    },
    {
      kind: 'translate',
      prompt: 'Where does the negation particle לֹא ("not") typically stand relative to the verb it negates?',
      original: 'לֹא',
      choices: [
        'Immediately before the verb',
        'Immediately after the verb',
        'At the very end of the clause',
        'Attached as a suffix on the verb',
      ],
      answer: 0,
      explanation: 'לֹא is placed directly before the word (usually a verb) that it negates.',
    },
  ]),
  reflectionPrompts: [
    'Why might translators choose to render the direct object marker אֵת/אֶת with no corresponding English word at all?',
    'What is one danger of reading too much theological weight into a single word\'s position in a Hebrew clause?',
  ],
  reviewFromLessonIds: ['hebrew-verb-patterns'],
}

const lessonPassageGenesis: LanguageLesson = {
  id: 'hebrew-passage-genesis',
  order: 8,
  title: 'Guided Reading: Genesis 1:1',
  estimatedMinutes: 40,
  objectives: [
    'Read Genesis 1:1 aloud in Hebrew, word by word.',
    'Identify familiar vocabulary, grammatical patterns (article, construct, direct object marker, verb form) from earlier lessons within this verse.',
    'Describe at least one well-known interpretive question this verse raises at the grammatical level, and why this course does not try to settle it for you.',
    'Articulate why careful word-level study is a valuable but incomplete step toward understanding a verse.',
  ],
  content: [
    {
      kind: 'teaching',
      title: 'Putting it all together',
      body:
        'This lesson applies everything from Lessons 1–7 to the opening verse of the Hebrew Bible. Read through it slowly, matching each piece to what you already know, rather than rushing to an English gloss.',
    },
    {
      kind: 'example',
      original: 'בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ',
      transliteration: "bereshit bara ʾelohim ʾet hashamayim ve'et ha'arets",
      gloss: 'In the beginning God created the heavens and the earth.',
      note: 'Genesis 1:1, the opening verse of the Hebrew Bible.',
    },
    {
      kind: 'concept',
      term: 'בְּרֵאשִׁית (be-reshit)',
      explanation:
        'The prefix בְּ ("in") plus רֵאשִׁית ("beginning, first part" — related to רֹאשׁ, "head"). This word lacks the definite article, which has fueled long-standing discussion among grammarians and translators over whether to render it as a simple absolute phrase ("In the beginning...") or to read it as grammatically bound to what follows ("In the beginning of God\'s creating..." / "When God began..."). This course flags that debate rather than declaring a winner.',
    },
    {
      kind: 'concept',
      term: 'בָּרָא (bara)',
      explanation:
        'The Qal perfect, 3rd masculine singular, of the verb ברא, "to create." This verb is used in the Old Testament especially — though not completely exclusively — for God\'s own creative activity. Here the perfect form fittingly narrates a completed act (recall Lesson 5\'s caution: "perfect" names a form, not automatically "simple past" in every context — though a completed past act is indeed the natural sense here).',
    },
    {
      kind: 'concept',
      term: 'אֱלֹהִים (ʾelohim)',
      explanation:
        'The subject of בָּרָא. As studied in Lessons 1–2, this noun is grammatically plural in form but paired here with a singular verb — the regular pattern when אֱלֹהִים refers to the one God of Israel.',
    },
    {
      kind: 'concept',
      term: 'אֵת (ʾet) — twice',
      explanation:
        'The direct object marker from Lesson 7, appearing twice in this verse: once before הַשָּׁמַיִם and once (as וְאֵת, "and" + the marker) before הָאָרֶץ. Neither occurrence is translated as a separate English word.',
    },
    {
      kind: 'concept',
      term: 'הַשָּׁמַיִם וְהָאָרֶץ (hashamayim ve-haʾarets)',
      explanation:
        'Definite article הַ- (Lesson 4) prefixed to שָׁמַיִם ("heavens," plural-only, Lesson 3) and to אֶרֶץ ("earth/land," Lesson 2–3). Notice אֶרֶץ\'s vowel shifts slightly to אָרֶץ once the article is attached — a small, regular adjustment, not a different word.',
    },
    {
      kind: 'caution',
      body:
        'Word-by-word parsing like this is a genuinely useful first step — it shows you what the Hebrew text actually says and surfaces real interpretive questions (like the grammatical ambiguity of בְּרֵאשִׁית). But it is not, by itself, a complete theological or exegetical reading of the verse. Questions about this verse\'s full meaning, its relationship to the rest of Genesis 1, and its place in the wider biblical story deserve careful study with good commentaries and teachers — not a grammar pass alone.',
    },
  ],
  exercises: withPart15('hebrew-passage-genesis', [
    {
      kind: 'passage_guide',
      reference: 'Genesis 1:1',
      bookName: 'Genesis',
      chapter: 1,
      verseStart: 1,
      verseEnd: 1,
      originalSnippet: 'בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ',
      transliteration: "bereshit bara ʾelohim ʾet hashamayim ve'et ha'arets",
      gloss: 'In the beginning God created the heavens and the earth.',
      analysis:
        'בְּרֵאשִׁית ("in [the] beginning") opens without an article, a grammatical point debated among translators. בָּרָא is a Qal perfect 3ms verb, "created." אֱלֹהִים is the grammatically-plural-but-singular-agreeing subject, "God." אֵת appears twice as the direct object marker (untranslated), once before הַשָּׁמַיִם ("the heavens," article + plural-only noun) and once (as וְאֵת) before הָאָרֶץ ("the earth," article + noun, with a small vowel shift from אֶרֶץ to אָרֶץ under the article).',
      caution:
        'This breakdown describes Hebrew grammar and flags a well-known debate about בְּרֵאשִׁית\'s grammatical form — it is a starting point for study, not a substitute for careful theological reflection on the verse in its full canonical context.',
    },
    {
      kind: 'mc',
      question: {
        id: 'hebrew-passage-genesis-mc-1',
        type: 'mc',
        prompt: 'In Genesis 1:1, which word functions as the subject of the verb "created" (בָּרָא)?',
        choices: ['אֱלֹהִים', 'בְּרֵאשִׁית', 'אֵת', 'וְאֵת'],
        answer: 0,
        explanation: 'אֱלֹהִים ("God") is the subject performing the action of בָּרָא ("created").',
        difficulty: 'beginner',
      },
    },
    {
      kind: 'translate',
      prompt: 'Translate אֵת הַשָּׁמַיִם as it functions in Genesis 1:1.',
      original: 'אֵת הַשָּׁמַיִם',
      choices: ['the heavens (as the verb\'s direct object)', 'in heaven', 'from the heavens', 'and heaven'],
      answer: 0,
      explanation:
        'אֵת marks הַשָּׁמַיִם ("the heavens") as the direct object of בָּרָא; אֵת itself is not rendered as a separate English word.',
    },
  ]),
  reflectionPrompts: [
    'What is one grammatical detail in Genesis 1:1 you would likely have missed reading only in an English translation?',
    'Why might this course choose to flag the debate over בְּרֵאשִׁית\'s grammatical form rather than pick a side for you?',
    'How would you describe, in your own words, the difference between "parsing a verse grammatically" and "understanding a verse theologically"?',
  ],
  reviewFromLessonIds: ['hebrew-nouns', 'hebrew-verbs', 'hebrew-verb-patterns', 'hebrew-syntax'],
}

export const HEBREW_COURSE: LanguageCourse = {
  id: 'hebrew',
  title: 'Biblical Hebrew',
  description:
    'An introductory, academically-grounded course in Biblical Hebrew — the language of the Hebrew Bible (Old Testament) — covering the alphabet, vowel pointing, core grammar (nouns, verbs, and syntax), and a guided first reading of Genesis 1:1. Designed for self-directed learners working alongside the Bible Reading Program; it is a starting point, not a substitute for a full seminary- or university-level grammar course.',
  objectives: [
    'Read the Hebrew consonants and common vowel points aloud using a standard academic pronunciation convention.',
    'Recognize core Biblical Hebrew nouns, verbs, and particles that recur throughout the Old Testament.',
    'Understand foundational grammar: noun gender/number/state (including construct chains), verb person/stem/conjugation, and basic clause word order.',
    'Approach the Hebrew verbal system (perfect/imperfect, the binyanim, the vav-consecutive) as a system of grammatical forms, without collapsing it into simple English past/future tense equivalents.',
    'Read Genesis 1:1 in the original Hebrew with real grammatical understanding.',
    'Recognize the limits of word-level study, and handle the divine name (YHWH) with appropriate care and reverence.',
  ],
  estimatedMinutes: 350,
  scriptDirection: 'rtl',
  pronunciationNote:
    'Pronunciation in this course follows a common academic / introductory-classroom convention for Biblical Hebrew — similar to what many first-year university and seminary courses teach — chosen for consistency and ease of learning, not as a claim about the exact sound of ancient spoken Hebrew. Modern (Israeli) Hebrew pronunciation differs in real, well-known ways: for example, Modern Hebrew merges sounds that this academic convention (following likely ancient distinctions) keeps separate, such as א/ע, the two forms of כ/ח, ט/ת, and ס/שׂ. If you go on to learn or speak Modern Hebrew, expect — and do not be alarmed by — these differences; neither convention is "wrong," they simply serve different purposes.',
  sourcesNote:
    "This course's lessons, explanations, examples, and exercises are original material written for this program. Where the overall lesson sequence echoes the broad pedagogical shape common to standard introductory Biblical Hebrew grammars (beginning with the alphabet, then vowels, then nouns and verbs, then syntax, then a guided passage reading — a structure found in widely-used textbooks such as Pratico & Van Pelt's Basics of Biblical Hebrew or Allen P. Ross's Introducing Biblical Hebrew), that influence is limited strictly to high-level topic ordering as organizational inspiration. No text, exercises, charts, or wording have been copied or adapted from any copyrighted textbook.",
  alphabet: HEBREW_ALPHABET,
  vocabulary: HEBREW_VOCABULARY,
  lessons: [
    lessonConsonants,
    lessonVowels,
    lessonNouns,
    lessonModifiers,
    lessonVerbs,
    lessonVerbPatterns,
    lessonSyntax,
    lessonPassageGenesis,
  ],
  version: 2,
}
