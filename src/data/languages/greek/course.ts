import type { LanguageCourse, LanguageLesson } from '../types'
import { GREEK_ALPHABET } from './alphabet'
import { GREEK_VOCABULARY } from './vocabulary'

const FIRST_TWELVE_LETTER_IDS = [
  'gr-alpha',
  'gr-beta',
  'gr-gamma',
  'gr-delta',
  'gr-epsilon',
  'gr-zeta',
  'gr-eta',
  'gr-theta',
  'gr-iota',
  'gr-kappa',
  'gr-lambda',
  'gr-mu',
]

const LAST_TWELVE_LETTER_IDS = [
  'gr-nu',
  'gr-xi',
  'gr-omicron',
  'gr-pi',
  'gr-rho',
  'gr-sigma',
  'gr-tau',
  'gr-upsilon',
  'gr-phi',
  'gr-chi',
  'gr-psi',
  'gr-omega',
]

const lessonAlphabet: LanguageLesson = {
  id: 'greek-alphabet',
  order: 1,
  title: 'The Greek Alphabet',
  estimatedMinutes: 25,
  objectives: [
    'Recite the 24 letters of the Greek alphabet in order, by name and sound.',
    'Distinguish rough and smooth breathing marks and explain how each affects pronunciation.',
    'Recognize the three Greek accent marks (acute, grave, circumflex) and the iota subscript.',
    'Identify the main vowel diphthongs (αι, ει, οι, υι, αυ, ευ, ου, ηυ) by sight.',
  ],
  content: [
    {
      kind: 'teaching',
      title: 'Why learn the alphabet first?',
      body:
        "Every Greek word you'll ever read is built from 24 letters. Learning to sound them out — slowly, letter by letter — is the on-ramp to reading the New Testament's own wording instead of only reading translations of it. You don't need fluency to benefit; even recognizing letters and sounding out short words changes how closely you pay attention to a verse.",
    },
    {
      kind: 'teaching',
      title: 'Breathing marks',
      body:
        'Every word that begins with a vowel (or with rho) carries a breathing mark over that letter. A smooth breathing ( ʼ ) adds no sound — e.g. ἐν ("en," in). A rough breathing ( ῾ ) adds an initial "h" sound — e.g. ὁ ("ho," the). These marks are written, not just implied, so look for them on the very first letter of a word.',
    },
    {
      kind: 'concept',
      term: 'Diphthongs',
      explanation:
        'A diphthong is two vowels read together as one sound. Common ones, with Erasmian classroom sounds: αι ("ai" as in aisle), ει ("ei" as in eight), οι ("oi" as in oil), υι (rare, roughly "wee"), αυ ("ow" as in how), ευ ("eu" as in feud), ου ("oo" as in soup), and the rarer ηυ. Recognizing a diphthong as one syllable (not two) is essential for reading words correctly.',
    },
    {
      kind: 'concept',
      term: 'Accent marks and the iota subscript',
      explanation:
        'Printed Greek New Testaments mark an accented syllable with acute (ά), grave (ὰ), or circumflex (ᾶ) — in this course, read all three simply as "stress this syllable." You will also see a tiny iota written under certain vowels (ᾳ, ῃ, ῳ) called an iota subscript — a leftover of an old diphthong that is usually silent in pronunciation today but is grammatically important (it marks forms like the dative singular in some noun patterns you will meet in Lesson 3).',
    },
    {
      kind: 'caution',
      body:
        "Accent marks were added to the text by scribes and grammarians centuries after the New Testament was written — a system standardized well after the apostolic era. They are a reading and pronunciation aid, not part of the original inspired wording, and differences in accentuation across manuscripts or printed editions don't change Christian doctrine. Treat accents as pronunciation help, not as theological data in themselves.",
    },
  ],
  exercises: [
    {
      kind: 'alphabet_match',
      prompt: 'Match each letter to its name (Alpha–Mu).',
      letterIds: FIRST_TWELVE_LETTER_IDS,
    },
    {
      kind: 'alphabet_match',
      prompt: 'Match each letter to its name (Nu–Omega).',
      letterIds: LAST_TWELVE_LETTER_IDS,
    },
    {
      kind: 'mc',
      question: {
        id: 'greek-alphabet-q1',
        type: 'mc',
        prompt: 'What does a rough breathing mark ( ῾ ) indicate?',
        choices: [
          'An "h" sound before the vowel',
          'That the vowel is long',
          'That the word is negated',
          'That the syllable is accented',
        ],
        answer: 0,
        explanation:
          'Rough breathing adds an initial "h" sound (as in ὁ, "ho"); smooth breathing adds no sound at all.',
      },
    },
    {
      kind: 'mc',
      question: {
        id: 'greek-alphabet-q2',
        type: 'mc',
        prompt: 'Which of these is a diphthong (two vowels read as one sound)?',
        choices: ['ου', 'θ', 'ρ', 'σ'],
        answer: 0,
        explanation:
          'ου is a diphthong read as one sound (roughly "oo"); θ, ρ, and σ are single consonants, not vowel combinations.',
      },
    },
    {
      kind: 'mc',
      question: {
        id: 'greek-alphabet-q3',
        type: 'mc',
        prompt: 'The accent marks in your printed Greek New Testament were...',
        choices: [
          'Added by later scribes and editors as a reading aid, not part of the original inspired wording',
          'Part of the autographs written by the apostles themselves',
          'A modern invention with no ancient basis',
          'Required reading to determine core Christian doctrine',
        ],
        answer: 0,
        explanation:
          "Accentuation was standardized centuries after the NT was written. It helps pronunciation; it isn't a vehicle for new doctrine.",
      },
    },
  ],
  reflectionPrompts: [
    'Why might learning to sound out the Greek text, even slowly and imperfectly, change the way you read a familiar verse?',
  ],
}

const lessonReadingWords: LanguageLesson = {
  id: 'greek-reading-words',
  order: 2,
  title: 'Reading Greek Words',
  estimatedMinutes: 20,
  objectives: [
    'Break multi-syllable Greek words into syllables using vowel and diphthong boundaries.',
    'Apply a consistent transliteration scheme when sounding out unfamiliar Greek words.',
    'Recognize on sight several of the New Testament\u2019s most frequent words (θεός, λόγος, καί, ἐν, εἰμί).',
    'Explain why slow, out-loud reading supports attentive Bible reading rather than instant translation.',
  ],
  content: [
    {
      kind: 'teaching',
      title: 'One vowel (or diphthong) = one syllable',
      body:
        'To break a Greek word into syllables, find each vowel or diphthong — each one anchors a syllable. θε-ός has two syllables (ε, ό); ἄν-θρω-πος has three (ά, ω, ο, where -θρω- counts as one syllable around its vowel). Consonants attach to the syllable that follows them, as in English.',
    },
    {
      kind: 'example',
      original: 'θεός',
      transliteration: 'the-ós',
      gloss: 'God',
      note: 'Two syllables: θε- and -ός. The acute accent on the ultima tells you to stress the second syllable: the-ÓS.',
    },
    {
      kind: 'example',
      original: 'ἄνθρωπος',
      transliteration: 'án-thrō-pos',
      gloss: 'human being',
      note: 'Three syllables. The accent on the first syllable (ἄ) tells you to stress "ÁN-thrō-pos," not "an-THRÓ-pos."',
    },
    {
      kind: 'concept',
      term: 'Sounding out vs. understanding',
      explanation:
        'Reading a word aloud and recognizing it on sight is a different skill than knowing its grammatical form in a sentence, or its full range of meaning. The goal of this lesson is recognition and pronunciation — grammar comes in the lessons that follow.',
    },
    {
      kind: 'caution',
      body:
        "Being able to pronounce or even recognize a Greek word is not the same as knowing how it functions in a sentence or what it contributes to a specific verse's meaning. Resist the feeling that you've 'unlocked' a verse just because you can sound out one of its words — that understanding comes from grammar, context, and careful reading, which this course builds toward across later lessons.",
    },
  ],
  exercises: [
    {
      kind: 'mc',
      question: {
        id: 'greek-reading-words-q1',
        type: 'mc',
        prompt: 'How many syllables does λόγος have?',
        choices: ['1', '2', '3', '4'],
        answer: 1,
        explanation: 'λό-γος: two vowel sounds (ο, ο) give two syllables.',
      },
    },
    {
      kind: 'mc',
      question: {
        id: 'greek-reading-words-q2',
        type: 'mc',
        prompt: 'In ἄνθρωπος, which syllable is stressed?',
        choices: [
          'The first (ἄν-)',
          'The second (-θρω-)',
          'The last (-πος)',
          'Greek words are never stressed',
        ],
        answer: 0,
        explanation: 'The acute accent sits on the first syllable, ἄ, so it is stressed: ÁN-thrō-pos.',
      },
    },
    {
      kind: 'translate',
      prompt: 'Which English phrase matches this Greek phrase?',
      original: 'Ἐν ἀρχῇ ἦν ὁ λόγος',
      transliteration: 'En archē ēn ho logos',
      choices: [
        'In the beginning was the Word',
        'In the beginning God created',
        'The Word became flesh',
        'In the beginning was love',
      ],
      answer: 0,
      explanation: "This is the opening clause of John 1:1: 'In the beginning was the Word.'",
    },
  ],
  introduceVocabIds: ['gv-theos', 'gv-logos', 'gv-kai', 'gv-en', 'gv-eimi'],
  reflectionPrompts: [
    'Try reading John 1:1 aloud in Greek, even haltingly. What did you notice slowing down to sound out each word, rather than just reading the English translation?',
  ],
  reviewFromLessonIds: ['greek-alphabet'],
}

const lessonNouns: LanguageLesson = {
  id: 'greek-nouns',
  order: 3,
  title: 'Nouns, Gender, and Case',
  estimatedMinutes: 22,
  objectives: [
    'Identify Greek\u2019s three grammatical genders, two numbers, and five cases (nominative, genitive, dative, accusative, vocative).',
    'Explain the basic role each case typically plays: subject, possession/source, indirect object, direct object, direct address.',
    'Recognize the 2nd-declension masculine pattern (λόγος, λόγου, λόγῳ, λόγον) and the 1st-declension feminine pattern (ἀγάπη, ἀγάπης, ἀγάπῃ, ἀγάπην).',
    'Explain why Greek case endings — not word order — carry the core grammatical relationships in a sentence.',
  ],
  content: [
    {
      kind: 'teaching',
      title: 'Case does the work word order does in English',
      body:
        'In English, "the dog bites the man" and "the man bites the dog" mean opposite things, decided entirely by word order. In Greek, the endings on each noun tell you who is doing what to whom, so word order is freed up to do other work — usually emphasis.',
    },
    {
      kind: 'concept',
      term: 'The five cases',
      explanation:
        'Nominative marks the subject ("the Word," as the one being described). Genitive usually marks possession or source, often translated "of ___." Dative usually marks the indirect object ("to/for ___") or instrument. Accusative marks the direct object. Vocative marks direct address ("O God!") and is rare.',
    },
    {
      kind: 'example',
      original: 'λόγος, λόγου, λόγῳ, λόγον',
      transliteration: 'lógos, lógou, lógō, lógon',
      gloss: 'word (nominative, genitive, dative, accusative singular)',
      note: 'A 2nd-declension masculine pattern — only the ending changes, not the stem λόγ-.',
    },
    {
      kind: 'example',
      original: 'ἀγάπη, ἀγάπης, ἀγάπῃ, ἀγάπην',
      transliteration: 'agápē, agápēs, agápē, agápēn',
      gloss: 'love (nominative, genitive, dative, accusative singular)',
      note: 'A 1st-declension feminine pattern. Notice the dative ἀγάπῃ carries an iota subscript (see Lesson 1).',
    },
    {
      kind: 'caution',
      body:
        "Knowing a case ending tells you a word's grammatical function — not automatically a doctrine. The genitive case alone, for example, can express several different relationships (possession, source, description, and more); only the surrounding context decides which. Avoid arguments shaped like 'it's genitive, so it must mean X' without checking how the phrase is actually used.",
    },
  ],
  exercises: [
    {
      kind: 'parse',
      prompt: 'What case and number is λόγον in a sentence like "...καὶ εἶδον τὸν λόγον" (illustrative)?',
      form: 'λόγον',
      transliteration: 'lógon',
      choices: [
        'Accusative singular',
        'Nominative singular',
        'Genitive plural',
        'Dative singular',
      ],
      answer: 0,
      explanation: 'The -ον ending marks 2nd-declension masculine accusative singular — here, the direct object.',
    },
    {
      kind: 'parse',
      prompt: 'What case and number is ἀγάπης?',
      form: 'ἀγάπης',
      transliteration: 'agápēs',
      choices: [
        'Genitive singular',
        'Nominative plural',
        'Accusative singular',
        'Dative plural',
      ],
      answer: 0,
      explanation: 'The -ης ending marks 1st-declension feminine genitive singular ("of love").',
    },
    {
      kind: 'mc',
      question: {
        id: 'greek-nouns-q1',
        type: 'mc',
        prompt: 'Which case normally marks the subject of a Greek sentence?',
        choices: ['Nominative', 'Genitive', 'Dative', 'Accusative'],
        answer: 0,
        explanation: 'The nominative case marks the subject — the one doing the action or being described.',
      },
    },
    {
      kind: 'translate',
      prompt: 'In John 3:16, τὸν υἱὸν τὸν μονογενῆ is accusative. What role does it play in the sentence?',
      original: 'τὸν υἱὸν τὸν μονογενῆ',
      transliteration: 'ton huion ton monogenē',
      choices: [
        'Direct object ("gave his only Son")',
        'Subject of the sentence',
        'Indirect object ("to the Son")',
        'Possessor ("of the Son")',
      ],
      answer: 0,
      explanation: 'Accusative case marks the direct object of ἔδωκεν ("he gave") — God gave his only Son.',
    },
  ],
  introduceVocabIds: ['gv-anthropos', 'gv-kurios', 'gv-ouranos', 'gv-ge', 'gv-huios', 'gv-pater', 'gv-hemera'],
  reflectionPrompts: [
    'English leans on word order; Greek leans on word endings. How might that shape the way a New Testament writer could arrange a sentence for emphasis?',
  ],
  reviewFromLessonIds: ['greek-reading-words'],
}

const lessonModifiers: LanguageLesson = {
  id: 'greek-modifiers',
  order: 4,
  title: 'Articles, Adjectives, Pronouns, and Prepositions',
  estimatedMinutes: 20,
  objectives: [
    'Recognize the Greek definite article (ὁ, ἡ, τό) across genders and explain that Greek has no indefinite article ("a/an").',
    'Explain how adjectives agree with the noun they modify in gender, number, and case.',
    'Identify common personal and demonstrative pronouns (αὐτός, οὗτος).',
    'Recognize common prepositions (ἐν, εἰς, ἀπό, διά, μετά, πρός) and explain how the case of the following noun can shift their nuance.',
  ],
  content: [
    {
      kind: 'teaching',
      title: 'The article: ὁ, ἡ, τό',
      body:
        'Greek\u2019s definite article changes form by gender: ὁ (masculine), ἡ (feminine), τό (neuter), all meaning "the," and each also changes by case and number. There is no separate word for "a/an" — Greek simply omits the article for its own grammatical and stylistic reasons, which is not the same as the English sense of "indefinite."',
    },
    {
      kind: 'concept',
      term: 'Adjective agreement',
      explanation:
        'A Greek adjective changes its ending to match the gender, number, and case of the noun it modifies. An adjective describing λόγος (masculine) will look different from the same adjective describing ἀγάπη (feminine), even though the underlying idea is the same.',
    },
    {
      kind: 'concept',
      term: 'Prepositions and case',
      explanation:
        'Several Greek prepositions change meaning depending on the case of the noun that follows them: διά + genitive = "through"; διά + accusative = "because of." μετά + genitive = "with"; μετά + accusative = "after." The case carries real meaning — always check it, not just the preposition.',
    },
    {
      kind: 'example',
      original: 'ὁ λόγος ἦν πρὸς τὸν θεόν',
      transliteration: 'ho lógos ēn pros ton theón',
      gloss: 'the Word was with God',
      note: 'πρός + accusative here expresses close relational presence ("with," face-to-face), not physical motion toward something.',
    },
    {
      kind: 'caution',
      body:
        "A preposition's root or spatial sense doesn't guarantee that exact nuance in every occurrence. Don't build a sermon point purely on a preposition's etymology (for example, assuming ἐν must always carry some mystical 'in union with' force) — check how the word is actually used in its own sentence first.",
    },
  ],
  exercises: [
    {
      kind: 'parse',
      prompt: 'What gender, number, and case does the article τόν mark in the phrase τὸν λόγον?',
      form: 'τόν',
      choices: [
        'Masculine accusative singular',
        'Feminine nominative singular',
        'Neuter genitive plural',
        'Masculine dative plural',
      ],
      answer: 0,
      explanation: 'τόν is the masculine accusative singular article, matching λόγον (also masculine accusative singular).',
    },
    {
      kind: 'mc',
      question: {
        id: 'greek-modifiers-q1',
        type: 'mc',
        prompt:
          'Greek has no indefinite article ("a/an"). What does this mean for a noun written without the article (an "anarthrous" noun)?',
        choices: [
          'It may or may not need "a/an" in English — context and usage decide, not a fixed rule',
          'It must always be translated with "a/an" in English',
          'It is always less important than an articular noun',
          'It cannot be the subject of a sentence',
        ],
        answer: 0,
        explanation:
          "Lacking the article doesn't automatically mean 'indefinite' in the English sense. Greek omits (and uses) the article for several reasons; translators weigh context rather than apply a mechanical rule.",
      },
    },
    {
      kind: 'translate',
      prompt:
        "In Μεθ' ἡμῶν ὁ θεός (\"God with us,\" Matthew 1:23), μετά + genitive (ἡμῶν) means...",
      original: "Μεθ' ἡμῶν ὁ θεός",
      transliteration: "Meth' hēmōn ho theós",
      choices: ['With us (accompaniment)', 'After us (time)', 'Against us', 'Instead of us'],
      answer: 0,
      explanation:
        "μετά + genitive expresses accompaniment: 'with.' (μετά elides to μεθ' before the rough breathing on ἡμῶν.)",
    },
  ],
  introduceVocabIds: [
    'gv-autos',
    'gv-houtos',
    'gv-me',
    'gv-ou',
    'gv-eis',
    'gv-apo',
    'gv-dia',
    'gv-meta',
    'gv-pros',
  ],
  reflectionPrompts: [
    "Why might it matter, when reading a translation, to know that adding or omitting 'a/an' in English sometimes reflects an interpretive decision rather than something explicit in the Greek?",
  ],
  reviewFromLessonIds: ['greek-nouns'],
}

const lessonVerbs: LanguageLesson = {
  id: 'greek-verbs',
  order: 5,
  title: 'Verbs: Person, Voice, Mood, and Aspect',
  estimatedMinutes: 24,
  objectives: [
    'Identify the five things a Greek verb form can tell you: person, number, tense-form, voice, and mood.',
    'Explain verbal aspect — the kind of action (ongoing/repeated vs. viewed as a whole) — as the core meaning of a Greek tense-form, rather than assuming it is primarily about calendar time.',
    'Recognize common present and aorist indicative active endings using λέγω and πιστεύω as models.',
    'Distinguish active, middle, and passive voice in simple forms.',
  ],
  content: [
    {
      kind: 'teaching',
      title: 'What a Greek verb packs into one word',
      body:
        'Unlike English, which often needs several words ("I was believing," "they will have said"), a Greek verb typically packs person, number, tense-form, voice, and mood into its ending alone. πιστεύομεν, for example, is "we believe" — 1st person, plural, present, active, indicative — in one word.',
    },
    {
      kind: 'concept',
      term: 'Aspect vs. time',
      explanation:
        'The present tense-form usually presents an action as ongoing or repeated ("imperfective" aspect). The aorist tense-form usually presents an action as a simple whole, without commenting on how long it took ("perfective" aspect). Both can appear in past, present, or other time frames depending on mood and context — aspect, not time, is the tense-form\u2019s primary job.',
    },
    {
      kind: 'caution',
      body:
        "A common but mistaken claim is that 'the aorist tense always means a decisive, once-for-all action' — and that this can settle a theological debate by itself. In the indicative mood the aorist is often past time, but its core contribution is aspect (the action viewed as a whole), not a guarantee of 'finality' or any other specific theological nuance. Outside the indicative mood (in participles, infinitives, subjunctives, and imperatives) the aorist frequently carries no past-time meaning at all. Treat any 'the aorist proves...' argument with real caution, and check what serious grammars actually say rather than leaning on a single rule of thumb.",
    },
    {
      kind: 'concept',
      term: 'Voice',
      explanation:
        'Active voice: the subject does the action (πιστεύω, "I believe"). Middle voice: the subject acts in a way that especially involves or affects itself (middle and passive forms often overlap in Koine Greek). Passive voice: the subject receives the action (ἐπιστεύθη, "it was believed").',
    },
    {
      kind: 'example',
      original: 'πιστεύω',
      transliteration: 'pisteúō',
      gloss: 'I believe (present active indicative — ongoing, habitual trust)',
      note: 'Contrast the aorist ἐπίστευσα, "I believed" (the same kind of event viewed as a simple whole) — a difference of aspect, not necessarily of how long the believing lasted.',
    },
  ],
  exercises: [
    {
      kind: 'parse',
      prompt: 'πιστεύομεν — identify its person and number.',
      form: 'πιστεύομεν',
      transliteration: 'pisteúomen',
      choices: [
        '1st person plural ("we believe")',
        '2nd person singular ("you believe")',
        '3rd person plural ("they believe")',
        '1st person singular ("I believe")',
      ],
      answer: 0,
      explanation: 'The -ομεν ending marks 1st person plural: "we."',
    },
    {
      kind: 'mc',
      question: {
        id: 'greek-verbs-q1',
        type: 'mc',
        prompt: 'What is the PRIMARY thing a Greek tense-form (like present or aorist) communicates?',
        choices: [
          'Aspect — the kind of action (ongoing vs. viewed as a whole)',
          'Absolute calendar time, always matching English past/present/future',
          'Whether the action is morally good or bad',
          'The gender of the subject',
        ],
        answer: 0,
        explanation:
          'Greek tense-forms are primarily about aspect. Time is a secondary signal that depends heavily on mood (especially in the indicative) and context — it is not guaranteed by the tense-form alone.',
      },
    },
    {
      kind: 'mc',
      question: {
        id: 'greek-verbs-q2',
        type: 'mc',
        prompt: '"The aorist tense proves this was a single, final, unrepeatable action." Is this reasoning sound?',
        choices: [
          'No — the aorist marks aspect (viewed as a whole), not finality; this kind of argument overclaims from the form alone',
          'Yes — the aorist always means a final, unrepeatable action',
          'Yes, but only in the Gospel of John',
          'No — the aorist always refers to future time',
        ],
        answer: 0,
        explanation:
          "This is a classic overclaim. The aorist's aspect (a whole, summary view of the action) is not the same as a theological claim about finality. Serious grammars warn against exactly this error.",
      },
    },
    {
      kind: 'translate',
      prompt: 'Translate the verb form: ὁ θεὸς ἠγάπησεν τὸν κόσμον (illustrative, cf. John 3:16).',
      original: 'ἠγάπησεν',
      transliteration: 'ēgápēsen',
      choices: [
        'loved (aorist active indicative, 3rd singular — the act of loving viewed as a whole)',
        'is loving (present, ongoing)',
        'will love (future)',
        'was being loved (passive)',
      ],
      answer: 0,
      explanation:
        'ἠγάπησεν is aorist active indicative, 3rd singular: "he/she/it loved" — presenting God\u2019s love as a completed whole, without by itself saying whether it was a single instance or an ongoing pattern.',
    },
  ],
  introduceVocabIds: ['gv-echo', 'gv-pisteuo', 'gv-lego', 'gv-ginomai'],
  reflectionPrompts: [
    "How does thinking in terms of 'aspect' rather than strict English tense change how you'd read a verb like 'believed' or 'loved' in your English Bible?",
  ],
  reviewFromLessonIds: ['greek-modifiers'],
}

const lessonParticiplesInfinitives: LanguageLesson = {
  id: 'greek-participles-infinitives',
  order: 6,
  title: 'Participles and Infinitives',
  estimatedMinutes: 20,
  objectives: [
    'Recognize a Greek participle as a verbal adjective that carries aspect, voice, and (relative) time.',
    'Recognize a Greek infinitive as a verbal noun, often used together with the article.',
    'Translate common participle phrases, such as ὁ πιστεύων ("the one believing / the believer").',
    "Explain why a participle's 'time' is usually relative to its main verb rather than an absolute point on a calendar — and why that limits what you can claim from it alone.",
  ],
  content: [
    {
      kind: 'teaching',
      title: 'Verbal adjectives and verbal nouns',
      body:
        'A participle (e.g. πιστεύων, "believing") behaves like an adjective built from a verb — it can modify a noun, take an object, and still carry voice and aspect. An infinitive (e.g. πιστεύειν, "to believe") behaves like a noun built from a verb and can even take the article (τὸ πιστεύειν, "the believing / to believe").',
    },
    {
      kind: 'example',
      original: 'πᾶς ὁ πιστεύων εἰς αὐτὸν',
      transliteration: 'pas ho pisteúōn eis autón',
      gloss: 'everyone who believes in him',
      note: 'ὁ πιστεύων, literally "the believing one," uses a present participle with the article to mean "the one who believes" — a durative, characterizing description, not just a single past event.',
    },
    {
      kind: 'example',
      original: 'τὸ ζῆν Χριστὸς καὶ τὸ ἀποθανεῖν κέρδος',
      transliteration: 'to zēn Christòs kai to apothaneín kérdos',
      gloss: 'to live is Christ and to die is gain',
      note: 'Philippians 1:21 uses two articular infinitives, τὸ ζῆν ("the living / to live") and τὸ ἀποθανεῖν ("the dying / to die"), as the subjects of the sentence — a construction English doesn\u2019t really have.',
    },
    {
      kind: 'concept',
      term: 'Relative time in participles',
      explanation:
        "A participle's time (before, at the same time as, or after its main verb) is normally relative to that main verb, not an absolute calendar date, and is inferred from context and aspect — not guaranteed by the participle's form alone.",
    },
    {
      kind: 'caution',
      body:
        "Don't stack theological weight on a participle's 'tense' as if it independently proved a point about when or how long something happened. A present participle like ὁ πιστεύων primarily characterizes (\"the believing kind of person\" / \"one who believes\"), and a participle's relative timing still depends on the sentence around it. Check the whole sentence and passage before drawing a conclusion from the participle form alone.",
    },
  ],
  exercises: [
    {
      kind: 'parse',
      prompt: 'In ὁ πιστεύων εἰς αὐτὸν, what is πιστεύων functioning as?',
      form: 'πιστεύων',
      transliteration: 'pisteúōn',
      choices: [
        'A present participle used substantivally ("the one believing")',
        'A finite indicative verb ("he believes")',
        'A noun unrelated to any verb',
        'An aorist infinitive',
      ],
      answer: 0,
      explanation: 'πιστεύων is a present active participle; with the article ὁ, it functions like a noun phrase, "the one who believes."',
    },
    {
      kind: 'mc',
      question: {
        id: 'greek-participles-infinitives-q1',
        type: 'mc',
        prompt: 'What does an articular infinitive like τὸ ζῆν do grammatically?',
        choices: [
          'Functions as a verbal noun — here, the subject of the sentence',
          'Functions only as a command',
          'Can never take an article',
          'Always indicates future time',
        ],
        answer: 0,
        explanation: 'An infinitive with the article (τὸ ζῆν, "the living / to live") functions as a noun — in Philippians 1:21 it is the sentence\u2019s subject.',
      },
    },
    {
      kind: 'translate',
      prompt: 'Translate: τὸ ζῆν Χριστὸς καὶ τὸ ἀποθανεῖν κέρδος',
      original: 'τὸ ζῆν Χριστὸς καὶ τὸ ἀποθανεῖν κέρδος',
      transliteration: 'to zēn Christòs kai to apothaneín kérdos',
      choices: [
        'To live is Christ and to die is gain',
        'Life and death are both meaningless',
        'Christ lived and then died for gain',
        'To die is Christ and to live is gain',
      ],
      answer: 0,
      explanation: 'Philippians 1:21 uses two articular infinitives (ζῆν, "to live"; ἀποθανεῖν, "to die") as subjects: "to live is Christ, and to die is gain."',
    },
  ],
  introduceVocabIds: ['gv-agape', 'gv-pneuma'],
  reflectionPrompts: [
    "Philippians 1:21 uses two infinitives as the subjects of a sentence — a construction English doesn't really have. What does that tell you about the limits of a strictly word-for-word translation?",
  ],
  reviewFromLessonIds: ['greek-verbs'],
}

const lessonSyntax: LanguageLesson = {
  id: 'greek-syntax',
  order: 7,
  title: 'Putting Sentences Together',
  estimatedMinutes: 20,
  objectives: [
    'Describe how Greek relies on case endings rather than strict word order to mark subject/object relationships.',
    'Recognize how καί functions as a flexible connector and how NT narrative often opens clauses with it, echoing Hebrew style.',
    'Distinguish the two main uses of ὅτι (introducing discourse, "that," vs. causal, "because") and explain why context — not the word itself — decides which.',
    'Describe, cautiously, what an anarthrous (no-article) predicate noun placed before the verb can and cannot establish on its own, in preparation for reading John 1:1.',
  ],
  content: [
    {
      kind: 'teaching',
      title: 'Flexible order, fixed endings',
      body:
        'Because case endings mark grammatical role, Greek word order is freer than English and is often used for emphasis rather than to show "who did what to whom." A word moved to the front of its clause is frequently the most emphasized word in that clause.',
    },
    {
      kind: 'concept',
      term: 'καί and NT narrative style',
      explanation:
        'Greek NT narrative — especially in the Gospels — often links short clauses with καί ("and"), much like Hebrew narrative links clauses with vav. This paratactic ("and... and... and...") style is a feature of style and translation background, not a grammatical defect.',
    },
    {
      kind: 'concept',
      term: 'ὅτι: "that" or "because"?',
      explanation:
        'ὅτι introduces either reported speech/content ("that," after verbs like "say" or "know") or a causal clause ("because," giving a reason). The surrounding context — not the word ὅτι by itself — tells you which.',
    },
    {
      kind: 'example',
      original: 'ὅτι ὁ θεὸς ἀγάπη ἐστίν',
      transliteration: 'hóti ho theòs agápē estín',
      gloss: 'because God is love',
      note: 'In 1 John 4:8, this ὅτι gives the reason for the preceding statement: "because God is love."',
    },
    {
      kind: 'concept',
      term: 'Predicate nouns without the article',
      explanation:
        "Greek can place a noun before the 'to be' verb as its predicate without the article (an 'anarthrous' predicate noun), often to highlight its quality or category rather than a specific, already-identified individual. This is a recognized, ordinary feature of Greek style — not an automatic grammatical loophole in either direction.",
    },
    {
      kind: 'caution',
      body:
        "Beginning-level grammar rules — including the ones in this course — are simplifications of a living, flexible language. Writers had more nuance and flexibility than any single textbook rule fully captures, and specific constructions, like an anarthrous predicate noun placed before the verb, have been debated by professional grammarians for well over a century. Don't treat a syntax rule as a conversation-ending 'proof text' for a doctrinal claim; read widely, consult serious scholarship, and let the whole counsel of Scripture — not an isolated grammar point — carry the theological weight.",
    },
  ],
  exercises: [
    {
      kind: 'mc',
      question: {
        id: 'greek-syntax-q1',
        type: 'mc',
        prompt: 'In ὅτι ὁ θεὸς ἀγάπη ἐστίν (1 John 4:8), how is ὅτι functioning?',
        choices: [
          'Causal: "because God is love," giving a reason',
          'Introducing a question',
          'As a negative, "not"',
          'As a proper name',
        ],
        answer: 0,
        explanation: 'Here ὅτι gives the reason for what was just said — "because God is love."',
      },
    },
    {
      kind: 'mc',
      question: {
        id: 'greek-syntax-q2',
        type: 'mc',
        prompt:
          'An anarthrous (no-article) predicate noun placed before the verb, by itself, is best described as...',
        choices: [
          'A recognized stylistic pattern that often highlights quality/category — not an automatic proof of a specific doctrine either way',
          'Absolute proof that the noun is indefinite ("a god")',
          'Absolute proof that the noun is fully identical in every sense to the subject',
          'A scribal error',
        ],
        answer: 0,
        explanation:
          "This construction is actively debated among grammarians precisely because it doesn't settle a theological question by itself. It is a real, ordinary feature of Greek style that needs careful, humble handling — this course flags it so you can recognize it, not so you can resolve a centuries-old debate from one grammar rule.",
      },
    },
    {
      kind: 'translate',
      prompt: 'Translate: Ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν',
      original: 'Ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν',
      transliteration: 'En archē ēn ho lógos, kai ho lógos ēn pros ton theón',
      choices: [
        'In the beginning was the Word, and the Word was with God',
        'In the beginning God made the Word',
        'In the beginning was love, and love was with God',
        'The Word was in the beginning of God',
      ],
      answer: 0,
      explanation: 'This is John 1:1a–b: "In the beginning was the Word, and the Word was with God."',
    },
  ],
  introduceVocabIds: ['gv-iesous', 'gv-christos', 'gv-hoti'],
  reflectionPrompts: [
    'Why do you think this course asks you to hold syntax observations (like the anarthrous predicate noun) with humility rather than certainty?',
  ],
  reviewFromLessonIds: ['greek-participles-infinitives'],
}

const lessonPassageJohn: LanguageLesson = {
  id: 'greek-passage-john',
  order: 8,
  title: 'Guided Reading: John 1:1',
  estimatedMinutes: 25,
  objectives: [
    'Parse each word of John 1:1 (case, gender, number, tense-form, and mood as applicable) using the grammar covered in this course.',
    "Explain the grammatical structure of John 1:1's three clauses and summarize, with appropriate humility, what each grammatical choice does and does not establish.",
    'Identify the anarthrous predicate noun θεός in clause three and describe how translators and grammarians have handled it, without overclaiming from the grammar alone.',
    'Apply the aspect lesson to ἦν (imperfect) versus ἐγένετο (aorist, John 1:3) and explain what that contrast suggests about existence versus coming-into-being.',
  ],
  content: [
    {
      kind: 'teaching',
      title: 'Reading John 1:1 clause by clause',
      body:
        'Ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν, καὶ θεὸς ἦν ὁ λόγος. Three short clauses, each built around the same verb, ἦν ("was"). Reading each clause separately before combining them keeps you from skipping straight to a familiar English paraphrase.',
    },
    {
      kind: 'example',
      original: 'Ἐν ἀρχῇ ἦν ὁ λόγος',
      transliteration: 'En archē ēn ho lógos',
      gloss: 'In the beginning was the Word',
      note: 'ἦν is imperfect active indicative of εἰμί, 3rd singular — a past, ongoing state of being ("was existing"), not an event with a beginning or end in view. ὁ λόγος is nominative singular, the subject.',
    },
    {
      kind: 'example',
      original: 'καὶ ὁ λόγος ἦν πρὸς τὸν θεόν',
      transliteration: 'kai ho lógos ēn pros ton theón',
      gloss: 'and the Word was with God',
      note: 'πρὸς τὸν θεόν (accusative after πρός) expresses close relational presence — "with," face-to-face with, God — implying some distinction between the Word and God in this clause.',
    },
    {
      kind: 'example',
      original: 'καὶ θεὸς ἦν ὁ λόγος',
      transliteration: 'kai theòs ēn ho lógos',
      gloss: 'and the Word was God',
      note: 'θεός here is an anarthrous (no-article) predicate noun placed before the verb; ὁ λόγος is the subject (carrying the article used in the earlier clauses). The great majority of English translations and the mainstream of NT scholarship render this "the Word was God," understanding θεός to describe the nature/quality of the Word rather than to erase all distinction between "the Word" and "God." This is also the exact point grammarians debate most — see the caution below.',
    },
    {
      kind: 'concept',
      term: 'ἦν vs. ἐγένετο',
      explanation:
        'John deliberately contrasts εἰμί (ἦν, "was," used of the Word in v.1) with γίνομαι (ἐγένετο, "came into being," used of creation in v.3: πάντα διʼ αὐτοῦ ἐγένετο, "all things came into being through him"). This is a well-attested vocabulary/word-choice observation — not a single tense-form "proving" eternality by itself — that signals a contrast between the Word\u2019s being and creation\u2019s coming-into-being.',
    },
    {
      kind: 'caution',
      body:
        "This verse sits at the center of long-running translation and theological debates (for example, around how to render the anarthrous θεός in English). This course's job is to help you see the grammar accurately — not to hand you a 'grammar gotcha' that settles the debate in one line. Historic Christian teaching about who Jesus is rests on the whole witness of Scripture, read across many passages in their contexts, not on a single Greek construction. Hold what you've learned here with real humility, and keep reading the rest of the chapter — and the rest of Scripture — rather than stopping at one clause.",
    },
  ],
  exercises: [
    {
      kind: 'parse',
      prompt: 'In Ἐν ἀρχῇ ἦν ὁ λόγος, what mood and tense-form is ἦν?',
      form: 'ἦν',
      transliteration: 'ēn',
      choices: [
        'Imperfect indicative (past, ongoing state)',
        'Aorist indicative (past, viewed as a whole)',
        'Present indicative (ongoing, now)',
        'Future indicative',
      ],
      answer: 0,
      explanation: 'ἦν is the imperfect indicative of εἰμί — a past, ongoing state of being, fitting for describing something that simply "was" without a beginning in view.',
    },
    {
      kind: 'parse',
      prompt: 'In καὶ θεὸς ἦν ὁ λόγος, what case/number is θεός, and what role does it play?',
      form: 'θεός',
      transliteration: 'theós',
      choices: [
        'Nominative singular, predicate noun (describes the subject ὁ λόγος)',
        'Accusative singular, direct object',
        'Genitive singular, showing possession',
        'Vocative singular, direct address',
      ],
      answer: 0,
      explanation: 'θεός is nominative singular, functioning as the predicate noun of ἦν — it describes the subject, ὁ λόγος, rather than being an addressed party or an object.',
    },
    {
      kind: 'mc',
      question: {
        id: 'greek-passage-john-q1',
        type: 'mc',
        prompt:
          'John 1:1 uses ἦν (from εἰμί) for the Word, and John 1:3 uses ἐγένετο (from γίνομαι) for creation. What does this vocabulary contrast suggest?',
        choices: [
          'A deliberate distinction between the Word simply "being" and creation "coming into being" — a safe, well-attested observation about word choice',
          'Nothing — the words are totally interchangeable with no difference in nuance',
          'That ἐγένετο always refers to a sinful action',
          'That ἦν is always future tense',
        ],
        answer: 0,
        explanation:
          "This is a standard, widely recognized observation: εἰμί and γίνομαι are different verbs with different core meanings, and John's switch between them in the same passage is a meaningful stylistic/semantic choice — distinct from (and much safer than) claims built on a single tense-form alone.",
      },
    },
    {
      kind: 'translate',
      prompt: 'Translate the full verse: Ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν, καὶ θεὸς ἦν ὁ λόγος.',
      original: 'Ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν, καὶ θεὸς ἦν ὁ λόγος.',
      transliteration: 'En archē ēn ho lógos, kai ho lógos ēn pros ton theón, kai theòs ēn ho lógos.',
      choices: [
        'In the beginning was the Word, and the Word was with God, and the Word was God.',
        'In the beginning God created the Word, and the Word created God.',
        'Before the beginning, God spoke a word about the world.',
        'In the beginning was the Word, and the Word was God, and God was alone.',
      ],
      answer: 0,
      explanation: 'This is the standard rendering of John 1:1 found across the great majority of English translations.',
    },
    {
      kind: 'passage_guide',
      reference: 'John 1:1',
      bookId: 'john',
      bookName: 'John',
      chapter: 1,
      verseStart: 1,
      verseEnd: 1,
      originalSnippet: 'Ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν, καὶ θεὸς ἦν ὁ λόγος.',
      transliteration: 'En archē ēn ho lógos, kai ho lógos ēn pros ton theón, kai theòs ēn ho lógos.',
      gloss: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
      analysis:
        "Three balanced clauses share the same verb, ἦν (imperfect of εἰμί, \"was\" — a past, ongoing state). Clause 1 sets the Word's existence \"in the beginning\" (ἐν ἀρχῇ). Clause 2 locates the Word in relationship \"with God\" (πρὸς τὸν θεόν, accusative after πρός, conveying close presence and implying some distinction). Clause 3 places an anarthrous predicate noun, θεός (\"God,\" no article), before the verb, with ὁ λόγος (\"the Word,\" carrying the article from the earlier clauses) as the subject — standard introductory grammars describe this as the writer highlighting the nature/quality of the Word rather than simply equating two fully interchangeable terms. Compare this to v.3's ἐγένετο (aorist of γίνομαι, \"came into being\"), used of creation — a deliberate vocabulary contrast between the Word's being and creation's coming-into-being.",
      caution:
        "This verse is one of the most theologically weighted and most debated single verses for Greek grammar in the entire New Testament (especially around how English should render the anarthrous θεός). The grammar here supports — but by itself does not single-handedly 'prove' — any particular side of that debate; historic Christian understanding of who the Word is rests on the whole of John's Gospel and the wider witness of Scripture, not on one clause's word order. Treat any claim that 'the Greek proves X' about this verse with real caution, and keep reading the rest of the chapter rather than stopping at a single grammatical point.",
    },
  ],
  introduceVocabIds: ['gv-theos', 'gv-logos', 'gv-en', 'gv-eimi'],
  reflectionPrompts: [
    "Having parsed John 1:1 word by word, what's one thing you now notice in the verse that you hadn't picked up on reading only an English translation?",
    "Why does this course encourage humility about what a single grammatical construction can 'prove,' even when the underlying grammar itself is accurate?",
  ],
  reviewFromLessonIds: ['greek-nouns', 'greek-verbs', 'greek-syntax'],
}

const GREEK_LESSONS: LanguageLesson[] = [
  lessonAlphabet,
  lessonReadingWords,
  lessonNouns,
  lessonModifiers,
  lessonVerbs,
  lessonParticiplesInfinitives,
  lessonSyntax,
  lessonPassageJohn,
]

export const GREEK_COURSE: LanguageCourse = {
  id: 'greek',
  title: 'Biblical Greek',
  description:
    'An introduction to Koine (New Testament) Greek for Bible readers — the alphabet, core vocabulary, basic grammar, and a guided reading of John 1:1 — built to deepen attentive reading of Scripture, not to manufacture quick word-study "gotchas."',
  objectives: [
    'Read aloud and recognize all 24 Greek letters, breathing marks, and common diphthongs.',
    "Recognize roughly 30 of the New Testament's most frequent words by sight and sound.",
    'Describe the basic Greek noun case system and verb aspect system well enough to follow a parsed text.',
    'Use Greek vocabulary and grammar as support for closer reading — not as a shortcut for proving doctrine from a single word or grammatical form.',
    'Work through a guided grammatical reading of John 1:1 with appropriate humility about what morphology can and cannot establish.',
  ],
  estimatedMinutes: 176,
  scriptDirection: 'ltr',
  pronunciationNote:
    "Abide teaches letter and word sounds using the \"Erasmian\" pronunciation convention common in English-speaking seminaries and Bible colleges — a system Renaissance-era scholars built to give every letter and diphthong a distinct, learnable sound for classroom use. It is a teaching convention, not a historical reconstruction of how Koine Greek actually sounded in the first century, and it differs noticeably from Modern Greek pronunciation. In Modern Greek, several vowels and diphthongs that Erasmian keeps distinct (η, ι, υ, ει, οι) have all collapsed toward a single \"ee\" sound — a shift called iotacism — while Erasmian keeps them apart on purpose so beginners can hear spelling differences. If you later hear Modern Greek speakers read the New Testament aloud, the sound will differ noticeably from what you learn here; both are legitimate conventions, used for different purposes.",
  sourcesNote:
    'These lessons are original content written for Abide, informed by the general pedagogical sequence common to standard introductory Koine Greek grammars (alphabet, then vocabulary/reading, noun morphology, article/adjectives/pronouns/prepositions, verb morphology and aspect, participles/infinitives, syntax, and finally guided passage reading) — a sequence shared by widely used classroom texts (e.g., Mounce- and Black-style first-year grammars). No text, exercises, or lexicon entries have been copied from any copyrighted textbook, grammar, or lexicon; every explanation, example, and exercise here was written fresh for this course. Greek Scripture quotations are short, commonly cited phrases from the New Testament and Septuagint text tradition, included strictly for teaching purposes.',
  alphabet: GREEK_ALPHABET,
  vocabulary: GREEK_VOCABULARY,
  lessons: GREEK_LESSONS,
  version: 1,
}
