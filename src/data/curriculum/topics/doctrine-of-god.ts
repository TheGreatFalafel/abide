import type { QuizQuestion } from '../../planQuizzes'
import type { CurriculumTopic } from '../types'
import {
  passage,
  mc,
  open,
  SOURCE_GRUDEM_ORG,
  SOURCE_SPROUL_SUP,
  SOURCE_MACARTHUR_SUP,
} from './_helpers'

const L1_QUESTIONS: QuizQuestion[] = [
  mc(
    'god-exist-rom1',
    'According to Romans 1:19\u201320, people are "without excuse" for unbelief because...',
    [
      'God has hidden all evidence of himself from creation',
      'God\u2019s invisible attributes have been clearly perceived through what has been made',
      'Everyone has already read the Bible',
      'Belief in God requires no evidence of any kind',
    ],
    1,
    'Paul teaches that creation itself clearly displays God\u2019s eternal power and divine nature, so unbelief is suppression of available evidence, not an innocent lack of it.',
  ),
  mc(
    'god-exist-exodus',
    'In Exodus 3:14, God\u2019s name "I AM WHO I AM" emphasizes his...',
    [
      'Dependence on Israel\u2019s worship for existence',
      'Self-existence \u2014 he derives his being from nothing and no one outside himself',
      'Limited, finite nature',
      'Identity as one of several national deities',
    ],
    1,
    '"I AM" points to God\u2019s aseity: unlike everything he made, God\u2019s existence is not caused, sustained, or derived from anything outside himself.',
  ),
  mc(
    'god-exist-ps14',
    'Psalm 14:1 treats denial of God\u2019s existence primarily as a matter of...',
    [
      'Lacking sufficient scientific data',
      'Moral and spiritual folly, not mere intellectual error',
      'A reasonable, neutral conclusion',
      'Something only ancient people struggled with',
    ],
    1,
    'Calling the denier a "fool" uses a biblical category describing a moral-spiritual disposition (rejecting God despite evidence), not simply an information gap.',
  ),
  mc(
    'god-exist-revelation',
    'This lesson distinguishes "general revelation" from "special revelation" by saying that general revelation...',
    [
      'Is given through creation and conscience and is sufficient on its own for saving knowledge of God',
      'Is given through creation and conscience, revealing that God exists and some of his attributes, but not sufficient alone for saving knowledge of him',
      'Refers only to Scripture',
      'Has been fully replaced by special revelation and no longer operates',
    ],
    1,
    'General revelation (creation, conscience) leaves people without excuse and reveals real truth about God, but Scripture\u2019s special revelation is needed for saving knowledge of God as Father through Christ.',
  ),
  open(
    'god-exist-open',
    'Where have you relied mainly on an argument or proof to try to convince someone about God? How might pairing that with prayer for the Spirit\u2019s work change your approach?',
  ),
]

const L2_QUESTIONS: QuizQuestion[] = [
  mc(
    'god-attr-exodus34',
    'Exodus 34:6\u20137 reveals God\u2019s character by having God...',
    [
      'Remain silent about his own nature',
      'Proclaim his own name, describing himself as merciful, gracious, slow to anger, and abounding in steadfast love and faithfulness',
      'Forbid Moses from knowing anything about him',
      'Describe himself only in terms of raw power',
    ],
    1,
    'This is one of Scripture\u2019s richest self-descriptions of God\u2019s character, given in God\u2019s own proclamation rather than human speculation.',
  ),
  mc(
    'god-attr-category',
    'Which pairing correctly matches an attribute with its category as taught in this lesson?',
    [
      'Omniscience is communicable; love is incommunicable',
      'Omniscience is incommunicable (belongs to God alone); love is communicable (creatures reflect it in finite measure)',
      'Both omniscience and love are incommunicable',
      'Attributes cannot be categorized at all',
    ],
    1,
    'Incommunicable attributes (like omniscience, eternity, omnipresence) belong to God alone in unlimited measure; communicable attributes (like love, justice, mercy) are qualities creatures can reflect in finite, derivative ways.',
  ),
  mc(
    'god-attr-malachi',
    'Malachi 3:6 ("I the LORD do not change") grounds Israel\u2019s confidence in God\u2019s continued...',
    [
      'Unpredictability',
      'Faithfulness to his covenant promises despite Israel\u2019s unfaithfulness',
      'Willingness to abandon his people',
      'Physical, bodily appearance',
    ],
    1,
    'God immediately applies his own unchangeableness (immutability) to a pastoral point: because he does not change, his covenant people "are not consumed" \u2014 his promises remain reliable.',
  ),
  mc(
    'god-attr-simplicity',
    'The classical doctrine of divine simplicity, mentioned in this lesson, teaches that God\u2019s attributes are...',
    [
      'Separate parts assembled together like pieces of a machine',
      'Not separable parts, but together describe the one, undivided divine being',
      'In constant tension and sometimes contradiction with one another',
      'Irrelevant to how we think about God',
    ],
    1,
    'Simplicity guards against picturing God as a composite being built from parts; his love, holiness, and justice are not divided portions of him but all fully describe his one undivided nature.',
  ),
  open(
    'god-attr-open',
    'Which communicable attribute of God (e.g., patience, faithfulness, mercy) do you most need to reflect better this week, and in what relationship?',
  ),
]

const L3_QUESTIONS: QuizQuestion[] = [
  mc(
    'god-trin-matt28',
    'Matthew 28:19 supports the doctrine of the Trinity by...',
    [
      'Commanding baptism in three separate "names," implying three gods',
      'Commanding baptism in the one singular "name" of the Father, Son, and Holy Spirit together',
      'Mentioning only the Father',
      'Teaching that Jesus is merely a prophet, not divine',
    ],
    1,
    'The single, singular "name" shared by Father, Son, and Spirit points to one divine being while the threefold naming points to three distinct persons.',
  ),
  mc(
    'god-trin-modalism',
    'Modalism is the error of teaching that...',
    [
      'Father, Son, and Spirit are three separate, independent gods',
      'Father, Son, and Spirit are merely three modes or masks of one person appearing at different times, not simultaneously distinct',
      'Jesus was a created being, not fully God',
      'God cannot be known at all',
    ],
    1,
    'Modalism denies real, simultaneous distinction among the persons \u2014 a claim contradicted by texts like Matthew 3:16\u201317, where Father, Son, and Spirit are all present and active at once.',
  ),
  mc(
    'god-trin-tritheism',
    'Tritheism is the error of teaching that...',
    [
      'There is only one person in the Godhead',
      'Father, Son, and Holy Spirit are three entirely separate gods rather than one God in three persons',
      'The Holy Spirit is not a person at all',
      'God cannot have any attributes',
    ],
    1,
    'Tritheism so separates the persons that it effectively denies the unity of the one God affirmed in Deuteronomy 6:4 and John 10:30.',
  ),
  mc(
    'god-trin-baptism',
    'Which passage most clearly shows all three persons of the Trinity distinctly present at the same moment?',
    [
      'Deuteronomy 6:4',
      'Matthew 3:16\u201317 (Jesus\u2019 baptism)',
      'Genesis 1:1',
      'Malachi 3:6',
    ],
    1,
    'At Jesus\u2019 baptism, the Son is baptized, the Spirit descends like a dove, and the Father speaks from heaven \u2014 three persons acting distinctly and simultaneously.',
  ),
  open(
    'god-trin-open',
    'Why might it matter pastorally that prayer in Scripture is often addressed to the Father, through the Son, in the power of the Spirit, rather than to an undifferentiated "God"?',
  ),
]

const L4_QUESTIONS: QuizQuestion[] = [
  mc(
    'god-sov-daniel',
    'Daniel 4:34\u201335 teaches that God\u2019s dominion extends over...',
    [
      'Only Israel, not other nations',
      'The kingdoms of men, such that none can stay his hand or question his actions',
      'Nothing in the political realm',
      'Only spiritual, not historical, matters',
    ],
    1,
    'Nebuchadnezzar\u2019s own confession, after humbling, acknowledges that God\u2019s rule extends over every human kingdom and that his will cannot be thwarted.',
  ),
  mc(
    'god-sov-joseph',
    'Genesis 50:20 illustrates the Reformed teaching that God\u2019s sovereignty and human responsibility...',
    [
      'Cannot both be true at the same time',
      'Are both fully true in the very same event: human sin is real and blameworthy, while God\u2019s good purpose stands',
      'Mean humans bear no real responsibility for sin',
      'Mean God merely reacted after the fact to the brothers\u2019 choice',
    ],
    1,
    'Joseph affirms both truths in one sentence \u2014 "you meant evil... God meant it for good" \u2014 the classic biblical pattern behind Reformed compatibilism.',
  ),
  mc(
    'god-sov-opentheism',
    'Open theism differs from classical Reformed theology primarily by teaching that...',
    [
      'God\u2019s knowledge of future free human choices is partly open or uncertain, rather than exhaustively foreknown and ordained',
      'God has no attributes at all',
      'Human choices are never genuinely free',
      'Scripture has no teaching on providence',
    ],
    0,
    'Open theism revises God\u2019s exhaustive foreknowledge to protect what it sees as authentic human freedom; Reformed theology holds that Scripture (e.g., Isaiah 46:9\u201310; Acts 4:27\u201328) teaches settled, sovereign foreknowledge and plan alongside genuine human responsibility.',
  ),
  mc(
    'god-sov-acts4',
    'Acts 4:27\u201328, concerning the crucifixion of Jesus, teaches that the various human actors...',
    [
      'Acted completely outside of God\u2019s plan',
      'Did "whatever your hand and plan had predestined to take place," while still bearing real moral responsibility for their actions',
      'Were innocent because God predestined the event',
      'Had no actual role in what happened',
    ],
    1,
    'The early church\u2019s prayer holds together God\u2019s predetermined plan and the real, blameworthy choices of Herod, Pilate, and others \u2014 the clearest New Testament case of compatibilism.',
  ),
  open(
    'god-sov-open',
    'Describe a difficult season where, looking back, you can see God\u2019s hand at work even through others\u2019 wrong choices or painful circumstances, similar to Joseph\u2019s testimony in Genesis 50:20.',
  ),
]

const L5_QUESTIONS: QuizQuestion[] = [
  mc(
    'god-crea-exnihilo',
    '"Creation ex nihilo" (Genesis 1:1; Hebrews 11:3) means God created the universe...',
    [
      'Out of pre-existing matter that always existed alongside him',
      'Out of nothing, by his word, with no pre-existing material',
      'Out of his own divine substance',
      'Through a long process he did not fully control',
    ],
    1,
    'Hebrews 11:3 explicitly states that what is seen was not made out of things visible \u2014 Scripture presents God as the sole, uncaused source of all that exists.',
  ),
  mc(
    'god-crea-colossians',
    'Colossians 1:16\u201317 teaches that Christ presently...',
    [
      'Has no ongoing relationship to the created world',
      'Holds all things together, sustaining creation moment by moment',
      'Is merely one created being among others',
      'Abandoned creation after making it',
    ],
    1,
    '"In him all things hold together" describes Christ\u2019s ongoing sustaining role, not just a past act of creation \u2014 grounding God\u2019s immanent, continual involvement with the world.',
  ),
  mc(
    'god-crea-pantheism',
    'Which best distinguishes pantheism from the historic Christian doctrine of creation taught in this lesson?',
    [
      'Pantheism identifies God and the universe as the same thing, while Christian doctrine maintains a Creator-creature distinction',
      'Pantheism and Christian doctrine teach the same thing in different words',
      'Pantheism denies God exists, while Christian doctrine affirms it',
      'Pantheism teaches creation ex nihilo more clearly than Christian doctrine',
    ],
    0,
    'Pantheism collapses God into the natural world; historic Christian doctrine insists God is distinct from and independent of creation even while remaining intimately active within it.',
  ),
  mc(
    'god-crea-acts17',
    'Acts 17:28 ("in him we live and move and have our being") illustrates God\u2019s...',
    [
      'Total absence from the created order (deism)',
      'Immanence \u2014 his intimate, sustaining presence within creation',
      'Identity with the created order (pantheism)',
      'Irrelevance to daily human existence',
    ],
    1,
    'Paul affirms that creaturely existence itself depends moment by moment on God\u2019s presence and sustaining activity \u2014 immanence held together with the transcendence affirmed earlier in the same speech (Acts 17:24\u201325).',
  ),
  open(
    'god-crea-open',
    'How does holding transcendence (God above creation) and immanence (God present within creation) together \u2014 rather than emphasizing only one \u2014 shape how you pray about an ordinary, everyday concern?',
  ),
]

/** Third complete theology topic: the doctrine of God (Grudem-organized theology proper). */
export const DOCTRINE_OF_GOD: CurriculumTopic = {
  id: 'doctrine-of-god',
  title: 'The Doctrine of God',
  description:
    'A Reformed introduction to theology proper: that God exists and may be known, who he is in his attributes, how he is one God in three persons, how he sovereignly governs all things, and how he relates to the world as its transcendent yet immanent Creator.',
  objectives: [
    'Explain the biblical basis for God\u2019s existence and knowability, and distinguish general from special revelation.',
    'Distinguish incommunicable and communicable attributes and summarize God\u2019s self-revealed character.',
    'State the historic doctrine of the Trinity accurately and identify classic errors to avoid.',
    'Explain divine sovereignty and providence, and how Reformed theology holds them together with human responsibility.',
    'Describe creation ex nihilo and hold together God\u2019s transcendence and immanence in relation to the world.',
  ],
  estimatedMinutes: 96,
  prerequisites: ['doctrine-of-scripture'],
  framework: 'reformed',
  version: 1,
  sources: [
    {
      ...SOURCE_GRUDEM_ORG,
      note:
        'Topic order and major headings follow Grudem\u2019s "Doctrine of God" chapters (knowability of God, character/attributes of God, the Trinity, and God\u2019s providence) as an organizational map for original lesson writing \u2014 not as reproduced textbook text.',
    },
    {
      ...SOURCE_SPROUL_SUP,
      work: 'Published teaching on the holiness and character of God (e.g. Ligonier resources)',
      note:
        'Sproul\u2019s widely known emphasis on God\u2019s holiness as central to rightly knowing him supplements the lessons on attributes, the Trinity, and creation. Claims here are original paraphrase of a well-known public theme, not quotations from any specific work.',
    },
    {
      ...SOURCE_MACARTHUR_SUP,
      work: 'Published biblical teaching on the sovereignty and glory of God',
      note:
        'MacArthur\u2019s pastoral stress on God\u2019s sovereign rule and the believer\u2019s confidence under it supplements the lessons on attributes and providence. No sermon transcripts are reproduced.',
    },
  ],
  lessons: [
    {
      id: 'god-existence-knowability',
      order: 1,
      title: 'God\u2019s Existence and Knowability',
      estimatedMinutes: 18,
      objectives: [
        'Summarize the biblical teaching that God\u2019s existence and some of his attributes are evident through creation (general revelation).',
        'Explain Exodus 3:14 as a claim of God\u2019s self-existence (aseity), unlike every created thing.',
        'State the Reformed emphasis that saving, intimate knowledge of God depends on his self-revelation and the Spirit\u2019s work, not reason alone.',
        'Engage fairly with classical arguments for God\u2019s existence and their proper, limited role.',
      ],
      primaryPassages: [
        passage('psalms', 'Psalms', 19, 1, 4),
        passage('romans', 'Romans', 1, 18, 20),
        passage('exodus', 'Exodus', 3, 13, 14),
      ],
      supportingPassages: [
        passage('psalms', 'Psalms', 14, 1, 1),
        passage('job', 'Job', 11, 7, 7),
        passage('romans', 'Romans', 11, 33, 36),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'The foundation of every other doctrine',
          body:
            'Having studied how God has spoken (the doctrine of Scripture), we now ask who is speaking. Theology proper \u2014 the doctrine of God \u2014 underlies every other Christian teaching, since how we think of salvation, humanity, and ethics all depend on who God is.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('romans', 'Romans', 1, 19, 20),
          note:
            'Interpretation: Paul teaches that God\u2019s invisible attributes \u2014 his eternal power and divine nature \u2014 are "clearly perceived" in creation, leaving humanity without excuse for unbelief. This is general revelation: real, but not salvation-sufficient on its own.',
        },
        {
          kind: 'concept',
          term: 'General revelation and special revelation',
          explanation:
            'General revelation is God\u2019s self-disclosure through creation and conscience, available to everyone and sufficient to establish accountability (Romans 1:20), but not sufficient alone for saving knowledge of God. Special revelation is God\u2019s self-disclosure in Scripture (and supremely in Christ), necessary for knowing God savingly as Father.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('exodus', 'Exodus', 3, 14, 14),
          note:
            'Interpretation: God\u2019s self-chosen name, "I AM WHO I AM," declares his self-existence \u2014 he depends on nothing outside himself for his being, unlike everything he has made.',
        },
        {
          kind: 'concept',
          term: 'Aseity (self-existence)',
          explanation:
            'The incommunicable attribute that God\u2019s existence is underived and self-sufficient: he does not depend on creation, worshippers, or anything else to exist or to be who he is.',
        },
        {
          kind: 'distinction',
          biblical:
            'Psalm 19:1 says the heavens declare God\u2019s glory; Romans 1:19\u201320 says God\u2019s eternal power and divine nature have been clearly perceived in what has been made, leaving people without excuse; Psalm 14:1 calls the one who says "there is no God" a "fool" \u2014 a moral-spiritual judgment, not merely an intellectual verdict.',
          interpretation:
            'Reformed theology teaches that God\u2019s existence is clearly evidenced in creation and conscience, such that unbelief is culpable suppression of available truth rather than an innocent lack of evidence; yet saving, intimate knowledge of God as Father requires special revelation (Scripture) and the Spirit\u2019s illuminating and regenerating work, not unaided human reasoning alone.',
          disagreement:
            'Classical and evidentialist apologetic traditions place significant weight on philosophical arguments (cosmological, teleological, moral) as a starting point for persuading unbelievers, treating these proofs as capable of establishing God\u2019s existence apart from prior faith commitments. Presuppositional Reformed approaches argue that all human reasoning already presupposes God\u2019s existence as its foundation, and that such arguments, while genuinely useful supporting evidence, cannot by themselves produce saving faith apart from the Spirit\u2019s work. This lesson values rational arguments as real and useful without treating them as sufficient for saving knowledge of God.',
        },
        {
          kind: 'attribution',
          teacherId: 'grudem',
          work: 'Systematic Theology',
          note:
            'Organizational cue: Grudem\u2019s "Doctrine of God" opens with the knowability of God \u2014 how we can know him truly, though not exhaustively \u2014 which this lesson mirrors with original content.',
        },
        {
          kind: 'attribution',
          teacherId: 'sproul',
          work: 'Published teaching on the knowledge and holiness of God',
          note:
            'Supplementary emphasis: true knowledge of God is never merely academic; it leads to reverence and worship, since the God who can be known is also utterly holy. Original paraphrase of a widely known public theme.',
        },
      ],
      questions: L1_QUESTIONS,
      reflectionPrompts: [
        'Spend a few minutes outside or looking at the sky, and let Psalm 19:1\u20134 shape a short prayer of praise for what creation reveals about God.',
      ],
      furtherStudy: [
        'Read Job 38\u201341 and notice how God\u2019s questions to Job appeal to creation\u2019s vastness to correct Job\u2019s demand for explanations.',
      ],
    },
    {
      id: 'god-attributes',
      order: 2,
      title: 'The Attributes of God',
      estimatedMinutes: 20,
      objectives: [
        'Distinguish incommunicable attributes (e.g., eternity, immutability, omniscience, omnipresence) from communicable attributes (e.g., love, holiness, justice, mercy).',
        'Summarize Exodus 34:6\u20137 as a key biblical self-description of God\u2019s character.',
        'Explain divine simplicity in basic terms: God\u2019s attributes are not separable parts but describe his one undivided being.',
        'Apply specific attributes (holiness, love, immutability) to worship and assurance.',
      ],
      primaryPassages: [
        passage('exodus', 'Exodus', 34, 6, 7),
        passage('psalms', 'Psalms', 90, 2, 2),
        passage('malachi', 'Malachi', 3, 6, 6),
      ],
      supportingPassages: [
        passage('isaiah', 'Isaiah', 6, 3, 3),
        passage('1john', '1 John', 4, 8, 8),
        passage('psalms', 'Psalms', 139, 1, 12),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Not just that God is, but who he is',
          body:
            'Lesson 1 established that God exists and may be known. This lesson asks what Scripture reveals about his character \u2014 the qualities, or attributes, that describe who God actually is.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('exodus', 'Exodus', 34, 6, 7),
          note:
            'Interpretation: God proclaims his own name and character to Moses \u2014 merciful, gracious, slow to anger, abounding in steadfast love and faithfulness, forgiving sin, yet not clearing the guilty. This self-proclamation becomes a foundational text echoed throughout the rest of Scripture.',
        },
        {
          kind: 'concept',
          term: 'Incommunicable attributes',
          explanation:
            'Qualities that belong to God alone and that creatures cannot share, even in part: self-existence (aseity), eternity, immutability, omnipresence, omniscience, and omnipotence.',
        },
        {
          kind: 'concept',
          term: 'Communicable attributes',
          explanation:
            'Qualities creatures can reflect in finite, derivative measure because they are made in God\u2019s image: love, holiness, justice, mercy, wisdom, goodness, and faithfulness.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('malachi', 'Malachi', 3, 6, 6),
          note:
            'Interpretation: "I the LORD do not change" (immutability) is immediately applied pastorally \u2014 because God does not change, his covenant people are not consumed despite their unfaithfulness.',
        },
        {
          kind: 'distinction',
          biblical:
            'Exodus 34:6\u20137 lists mercy, grace, patience, steadfast love, faithfulness, forgiveness, and justice together in one divine self-description; Psalm 90:2 affirms God is "from everlasting to everlasting"; Isaiah 6:3 records the seraphim declaring "holy, holy, holy" before God\u2019s throne.',
          interpretation:
            'Reformed theology organizes these self-revelations under incommunicable attributes (belonging to God alone: eternity, immutability, omnipresence, omniscience, omnipotence, aseity) and communicable attributes (qualities creatures can reflect in limited, derivative ways: love, holiness, justice, mercy, wisdom, goodness) \u2014 while affirming that in God these are not separate "parts" added together, but together describe the one simple, undivided divine being (the classical doctrine of divine simplicity).',
          disagreement:
            'Some modern theological movements (process theism, open theism) revise immutability and exhaustive omniscience to make God genuinely changeable or uncertain about the future, in order to protect human freedom or divine responsiveness to creation. Classical Reformed theology affirms God\u2019s unchanging being and exhaustive knowledge, while still teaching that Scripture\u2019s language of God "relenting" or "being grieved" describes real, personal engagement with creation without implying change in his essential being or eternal plan (a theme developed further in Lesson 4 on providence).',
        },
        {
          kind: 'attribution',
          teacherId: 'grudem',
          work: 'Systematic Theology',
          note:
            'Organizational cue: Grudem organizes God\u2019s attributes under incommunicable and communicable categories, following his treatment of knowability. Lesson content is original summary for learners, not reproduced text.',
        },
        {
          kind: 'attribution',
          teacherId: 'macarthur',
          work: 'Biblical teaching on the holiness and character of God',
          note:
            'Supplementary emphasis: a biblical view of God holds his holiness and his love together, resisting both a sentimental God who never judges sin and a stern God incapable of mercy. Original paraphrase only.',
        },
        {
          kind: 'teaching',
          title: 'Worshiping the whole character of God',
          body:
            'It is possible to emphasize one attribute (love, or justice, or sovereignty) until it distorts the rest. Faithful worship holds God\u2019s holiness and love, his justice and mercy, together \u2014 just as Exodus 34:6\u20137 does in a single breath.',
        },
      ],
      questions: L2_QUESTIONS,
      reflectionPrompts: [
        'Choose one incommunicable attribute (such as omniscience or immutability) and write a short prayer of praise that applies it to a current worry.',
      ],
      furtherStudy: [
        'Trace Exodus 34:6\u20137\u2019s language as it is echoed in Numbers 14:18, Psalm 86:15, Joel 2:13, and Jonah 4:2.',
      ],
      reviewFromLessonIds: ['god-existence-knowability'],
    },
    {
      id: 'god-trinity',
      order: 3,
      title: 'The Holy Trinity: One God in Three Persons',
      estimatedMinutes: 20,
      objectives: [
        'State the historic doctrine of the Trinity: one God eternally existing in three distinct persons, equal in deity and distinct in person.',
        'Trace the biblical basis for the Trinity across both testaments.',
        'Identify and avoid the classic errors of modalism and tritheism.',
        'Evaluate common Trinity analogies and their limits.',
      ],
      primaryPassages: [
        passage('deuteronomy', 'Deuteronomy', 6, 4, 4),
        passage('matthew', 'Matthew', 28, 19, 19),
        passage('john', 'John', 1, 1, 1),
      ],
      supportingPassages: [
        passage('matthew', 'Matthew', 3, 16, 17),
        passage('2corinthians', '2 Corinthians', 13, 14, 14),
        passage('john', 'John', 10, 30, 30),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'A mystery drawn from the whole of Scripture',
          body:
            'The word "Trinity" never appears in the Bible, but the doctrine is not a late invention \u2014 it is the church\u2019s careful summary of Scripture\u2019s full witness: there is one God, yet Father, Son, and Holy Spirit are each called God, worshipped as God, and distinguished from one another as persons.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('deuteronomy', 'Deuteronomy', 6, 4, 4),
          note:
            'Interpretation: The Shema \u2014 "the LORD our God, the LORD is one" \u2014 establishes the non-negotiable starting point: biblical faith is resolutely monotheistic. Any doctrine of the Trinity must honor this, not compromise it.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('matthew', 'Matthew', 28, 19, 19),
          note:
            'Interpretation: Jesus commands baptism "in the name" (singular) "of the Father and of the Son and of the Holy Spirit" \u2014 one shared name/essence, three distinctly named persons.',
        },
        {
          kind: 'concept',
          term: 'Trinity',
          explanation:
            'The doctrine that there is one God who eternally exists in three distinct, co-equal, co-eternal persons: Father, Son, and Holy Spirit \u2014 each fully and truly God, yet really distinct from one another.',
        },
        {
          kind: 'concept',
          term: '"Person" vs. "essence" in Trinitarian theology',
          explanation:
            '"Essence" (or "nature," "being") refers to the one undivided divine substance that Father, Son, and Spirit equally share. "Person" refers to the real, relational distinctions among them \u2014 the Father is not the Son, the Son is not the Spirit \u2014 without dividing the one essence into three beings.',
        },
        {
          kind: 'distinction',
          biblical:
            'Deuteronomy 6:4 affirms God is one; Matthew 28:19 commands baptism in the one "name" of Father, Son, and Holy Spirit together; John 1:1 says the Word was with God and was God; Matthew 3:16\u201317 depicts the Father speaking from heaven, the Son being baptized, and the Spirit descending \u2014 three distinct persons present and active at the very same moment.',
          interpretation:
            'Historic Christian and Reformed doctrine affirms, from the full pattern of Scripture rather than any single isolated verse, that there is one God eternally existing in three co-equal, co-eternal persons \u2014 Father, Son, and Holy Spirit \u2014 each fully and equally God, yet really distinct from one another in relation (the Father begets, the Son is begotten, the Spirit proceeds), and inseparable in their work.',
          disagreement:
            'Modalism (sometimes called Sabellianism) teaches that Father, Son, and Spirit are merely three successive modes or masks of one person, denying real, simultaneous distinction \u2014 contradicted by texts like Matthew 3:16\u201317, where all three appear distinctly at once. Tritheism, by contrast, so separates the persons that it effectively teaches three gods, denying the unity stressed in Deuteronomy 6:4 and John 10:30 ("I and the Father are one"). Arian and similar views deny the Son\u2019s (and Spirit\u2019s) full, eternal deity, treating the Son as a created or lesser being; Scripture\u2019s attribution of divine titles, worship, and works to the Son (John 1:1; John 20:28) stands against this. This lesson teaches the historic Nicene consensus while naming these errors so students can recognize and avoid them.',
        },
        {
          kind: 'concept',
          term: 'Trinity analogies and their limits',
          explanation:
            'Common analogies (water/ice/steam, a three-leaf clover, an egg\u2019s shell/white/yolk) can illustrate a single idea but always break down: water/ice/steam actually illustrates modalism (one substance in sequential states, not three simultaneous persons), and a clover\u2019s leaves are separable parts, unlike the undivided persons of the Godhead. Analogies may serve as limited teaching aids but are never offered as proof, since God\u2019s triune being is unique and without true created parallel.',
        },
        {
          kind: 'attribution',
          teacherId: 'grudem',
          work: 'Systematic Theology',
          note:
            'Organizational cue: Grudem treats the Trinity as a central locus of theology proper, following his discussion of God\u2019s attributes. Lesson content is original summary for learners, not reproduced text.',
        },
        {
          kind: 'attribution',
          teacherId: 'sproul',
          work: 'Published teaching on the Trinity and the holiness of God',
          note:
            'Supplementary emphasis: the Trinity is not a problem to be solved by clever analogies but a revealed mystery to be worshipped, since finite minds should expect the infinite, triune God to exceed full comprehension. Original paraphrase of a widely known public theme.',
        },
      ],
      questions: L3_QUESTIONS,
      reflectionPrompts: [
        'Try praying in explicitly Trinitarian shape this week \u2014 to the Father, through the Son, by the power of the Spirit \u2014 and note how it shapes your prayer.',
      ],
      furtherStudy: [
        'Read John 14\u201316 and list every distinct role attributed to the Father, the Son, and the Holy Spirit.',
      ],
      reviewFromLessonIds: ['god-existence-knowability', 'god-attributes'],
    },
    {
      id: 'god-sovereignty-providence',
      order: 4,
      title: 'God\u2019s Sovereignty and Providence',
      estimatedMinutes: 20,
      objectives: [
        'Define providence as God\u2019s ongoing preservation, governance, and sustaining of all creation and events toward his purposes.',
        'Show from Ephesians 1:11 and Daniel 4:34\u201335 that God\u2019s sovereign rule extends over all things, including human kingdoms.',
        'Explain how Reformed theology holds divine sovereignty and genuine human responsibility together (compatibilism) using Genesis 50:20 and Acts 4:27\u201328.',
        'Fairly contrast this view with open theism and with hard fatalism.',
      ],
      primaryPassages: [
        passage('ephesians', 'Ephesians', 1, 11, 11),
        passage('daniel', 'Daniel', 4, 34, 35),
        passage('genesis', 'Genesis', 50, 20, 20),
      ],
      supportingPassages: [
        passage('acts', 'Acts', 4, 27, 28),
        passage('proverbs', 'Proverbs', 16, 9, 9),
        passage('romans', 'Romans', 8, 28, 28),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Not an absent watchmaker',
          body:
            'Having considered who God is (attributes) and that he is triune, this lesson turns to how God relates to history: not as a distant designer who wound up the world and stepped back, but as a sovereign King who actively upholds and governs everything that happens.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('ephesians', 'Ephesians', 1, 11, 11),
          note:
            'Interpretation: Paul says God "works all things according to the counsel of his will" \u2014 a sweeping claim that nothing falls outside God\u2019s purposeful governance.',
        },
        {
          kind: 'concept',
          term: 'Providence',
          explanation:
            'God\u2019s ongoing activity of preserving creation in existence, governing all events toward his purposes, and concurrently working through (not merely alongside) creaturely causes, including human choices.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('genesis', 'Genesis', 50, 20, 20),
          note:
            'Interpretation: Joseph tells his brothers, "you meant evil against me, but God meant it for good." Both the brothers\u2019 real sin and God\u2019s good purpose are affirmed in the very same historical event.',
        },
        {
          kind: 'distinction',
          biblical:
            'Daniel 4:34\u201335 has Nebuchadnezzar confessing that God\u2019s dominion rules over the kingdoms of men and that none can stay his hand; Genesis 50:20 holds human evil intent ("you meant evil") and God\u2019s good purpose ("God meant it for good") together in the very same event; Acts 4:27\u201328 says Herod, Pilate, the Gentiles, and Israel did "whatever your hand and plan had predestined to take place" in crucifying Jesus.',
          interpretation:
            'Reformed theology teaches compatibilism: God\u2019s exhaustive sovereign plan and genuine human moral responsibility are both fully true and coexist without logical contradiction, even though Scripture does not fully explain how. God ordains the ends and often the means \u2014 including human, responsible choices, even sinful ones such as the crucifixion \u2014 without himself being the author of sin or removing blame from human agents.',
          disagreement:
            'Open theism denies that God exhaustively foreknows or ordains free human choices, holding that God\u2019s knowledge of the future is partly open so that God genuinely risks and responds without fixed certainty, in order to protect what it sees as authentic human freedom; classical Reformed theology responds that this view struggles to account for texts like Isaiah 46:9\u201310 and the passages above showing settled, sovereign foreknowledge and plan. On the other extreme, hard fatalism or hyper-determinism can collapse human responsibility altogether, treating people as mere puppets \u2014 a conclusion Scripture itself resists, since it consistently holds people accountable for their choices even while naming God\u2019s predetermined plan (as in Acts 4:27\u201328). This lesson holds both truths together without resolving the mystery by denying either.',
        },
        {
          kind: 'attribution',
          teacherId: 'grudem',
          work: 'Systematic Theology',
          note:
            'Organizational cue: Grudem treats providence (preservation, concurrence, government) as the outworking of God\u2019s sovereignty following his treatment of the Trinity. Lesson content is original summary, not reproduced text.',
        },
        {
          kind: 'attribution',
          teacherId: 'macarthur',
          work: 'Biblical teaching on the sovereignty of God',
          note:
            'Supplementary pastoral emphasis: confidence in God\u2019s sovereign care grounds endurance in suffering and trust in prayer, since no circumstance falls outside his purposeful rule. Original paraphrase only.',
        },
        {
          kind: 'teaching',
          title: 'Trusting providence without presuming to explain it',
          body:
            'Romans 8:28 promises that God works all things for the good of those who love him \u2014 not that every individual event is pleasant, or that believers can always identify the specific purpose behind a trial. Pastoral application of providence counsels humble trust, not confident speculation about "why this happened to me."',
        },
      ],
      questions: L4_QUESTIONS,
      reflectionPrompts: [
        'Name a current trial. What would it look like this week to entrust the parts you cannot control to God\u2019s sovereign care, while still acting responsibly in the parts you can?',
      ],
      furtherStudy: [
        'Read Genesis 37\u201350 in outline and trace every point where human sin and God\u2019s providence intersect in Joseph\u2019s story.',
      ],
      reviewFromLessonIds: ['god-existence-knowability', 'god-attributes', 'god-trinity'],
    },
    {
      id: 'god-creation-relation',
      order: 5,
      title: 'God as Creator: Transcendence and Immanence',
      estimatedMinutes: 18,
      objectives: [
        'Explain creation ex nihilo from Genesis 1:1 and Hebrews 11:3, and why it preserves the Creator-creature distinction.',
        'Define transcendence (God above and beyond creation) and immanence (God present and active within creation), holding both together.',
        'Show from Colossians 1:16\u201317 and Acts 17:24\u201328 that God both made and continually sustains his creation.',
        'Fairly distinguish the Creator-creature distinction from pantheism, panentheism, and deism.',
      ],
      primaryPassages: [
        passage('genesis', 'Genesis', 1, 1, 1),
        passage('colossians', 'Colossians', 1, 16, 17),
        passage('acts', 'Acts', 17, 24, 28),
      ],
      supportingPassages: [
        passage('hebrews', 'Hebrews', 11, 3, 3),
        passage('psalms', 'Psalms', 104, 27, 30),
        passage('nehemiah', 'Nehemiah', 9, 6, 6),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'A capstone lesson',
          body:
            'Having studied God\u2019s existence, attributes, triune nature, and sovereign providence, this final lesson asks how the self-existent, triune, sovereign God relates to the world he has made \u2014 both above it and within it.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('genesis', 'Genesis', 1, 1, 1),
          note:
            'Interpretation: "In the beginning, God created the heavens and the earth" presents an absolute beginning with God as the uncaused source of everything else that exists \u2014 nothing is eternal or self-existent alongside him.',
        },
        {
          kind: 'concept',
          term: 'Creation ex nihilo',
          explanation:
            'The doctrine that God created the universe "out of nothing" \u2014 by his word alone, with no pre-existing matter, no struggle against rival forces, and no use of his own divine substance as building material.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('colossians', 'Colossians', 1, 16, 17),
          note:
            'Interpretation: Paul names Christ as both the agent of creation ("all things were created through him") and its ongoing sustainer ("in him all things hold together") \u2014 creation is not a past event God has since abandoned.',
        },
        {
          kind: 'concept',
          term: 'Transcendence and immanence',
          explanation:
            'Transcendence means God is distinct from, independent of, and exalted above creation \u2014 not made of the same "stuff" and not dependent on it. Immanence means God is intimately present and active within creation, sustaining and engaging it moment by moment. Scripture affirms both without contradiction.',
        },
        {
          kind: 'distinction',
          biblical:
            'Genesis 1:1 and Hebrews 11:3 teach that God made the universe out of nothing by his word, not from pre-existing matter or his own being; Colossians 1:16\u201317 says all things were created through Christ and presently hold together in him; Acts 17:24\u201328 says God, who made the world, does not dwell in temples as though needing anything, yet "in him we live and move and have our being."',
          interpretation:
            'Reformed theology holds the Creator-creature distinction as foundational: God is utterly transcendent \u2014 distinct from, independent of, and not composed of the same substance as creation \u2014 while also being graciously immanent, intimately present and active in sustaining every moment of creaturely existence (the ongoing, immanent outworking of the providence studied in Lesson 4). God did not need creation to be complete in himself, yet freely chose to create and remains closely, personally involved with it.',
          disagreement:
            'Pantheism teaches that God and the universe are identical \u2014 God simply is the natural world \u2014 collapsing transcendence into immanence. Panentheism teaches that the world is part of God\u2019s being, or that God\u2019s experience or being grows through the world\u2019s history, partly collapsing the Creator-creature distinction. Deism teaches the opposite error: a transcendent God created the world but now stands uninvolved with it, denying meaningful immanence and providence. This lesson teaches the historic Christian view that upholds full transcendence (Genesis 1:1) and full, continual immanence (Acts 17:28; Colossians 1:17) together as complementary, not competing, truths.',
        },
        {
          kind: 'attribution',
          teacherId: 'grudem',
          work: 'Systematic Theology',
          note:
            'Organizational cue: Grudem treats creation as flowing from God\u2019s sovereign will and sustaining power, closing out the major loci of theology proper. Lesson content is original summary for learners.',
        },
        {
          kind: 'attribution',
          teacherId: 'sproul',
          work: 'Published teaching on the Creator-creature distinction',
          note:
            'Supplementary emphasis: confusing Creator and creature, in either direction, distorts both worship (treating creation as divine) and confidence (treating God as absent); a clear Creator-creature distinction protects both. Original paraphrase of a widely known public theme.',
        },
        {
          kind: 'teaching',
          title: 'Looking ahead',
          body:
            'This topic has traced who God is: existing, knowable, richly attributed, triune, sovereign, and both transcendent and near. Every later doctrine \u2014 sin, salvation, the church, the future \u2014 builds on this foundation. A right view of God is not the end of theology; it is where faithful theology always begins.',
        },
      ],
      questions: L5_QUESTIONS,
      reflectionPrompts: [
        'Write a short prayer that intentionally addresses both God\u2019s transcendence (his greatness, above you) and his immanence (his nearness, with you) in your current circumstances.',
      ],
      furtherStudy: [
        'Read Psalm 104 in full and note how it moves between God\u2019s transcendent majesty and his immanent care for creatures.',
      ],
      reviewFromLessonIds: [
        'god-existence-knowability',
        'god-attributes',
        'god-trinity',
        'god-sovereignty-providence',
      ],
    },
  ],
}
