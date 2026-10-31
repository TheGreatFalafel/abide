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
    'scr-insp-breathed',
    '"God-breathed" (theopneustos) in 2 Timothy 3:16 most directly claims that Scripture is...',
    [
      'A collection of humanity\u2019s best religious literature',
      'Spoken out of God\u2019s own being, so its source is divine',
      'Useful mainly as ancient history',
      'Inspiring in the same sense a great poem is inspiring',
    ],
    1,
    'Paul\u2019s word pictures Scripture as the product of God\u2019s own breath/speech \u2014 a claim about its origin, not merely its literary effect.',
  ),
  mc(
    'scr-insp-2peter',
    'According to 2 Peter 1:20\u201321, prophecy entered Scripture because...',
    [
      'Prophets invented messages from their own insight',
      'Men spoke from God as they were carried along by the Holy Spirit',
      'Church councils later voted the words in',
      'Scribes dictated whatever a congregation requested',
    ],
    1,
    'Peter explicitly rules out merely human origin ("no prophecy... by the will of man") and credits the Spirit\u2019s superintending work over the human authors.',
  ),
  mc(
    'scr-insp-concursive',
    'This lesson\u2019s "concursive" (organic) view of inspiration teaches that the biblical text is...',
    [
      'Dictated word-for-word with the human author only a pen',
      'Fully God\u2019s word and fully the human author\u2019s word, without error in what it affirms',
      'Partly God\u2019s word wherever it feels spiritually moving to a reader',
      'Human reflection on God that later became authoritative by church decree',
    ],
    1,
    'Concursive inspiration holds together two truths other theories separate: real human authorship (style, vocabulary, personality) and complete divine authorship (truthfulness, authority).',
  ),
  open(
    'scr-insp-open',
    'How does knowing a specific passage is "God-breathed" change how much weight you give it compared to good advice from a wise friend or a bestselling book?',
  ),
]

const L2_QUESTIONS: QuizQuestion[] = [
  mc(
    'scr-auth-matt4',
    'In Matthew 4:4, Jesus answers Satan\u2019s temptation by...',
    [
      'Appealing to his own authority as the Son of God',
      'Quoting a written Scripture ("It is written") as final and sufficient',
      'Refusing to answer the temptation at all',
      'Asking the Father for a new revelation on the spot',
    ],
    1,
    'Jesus treats an already-written Old Testament text as decisive and final \u2014 modeling Scripture\u2019s supreme authority even over the tempter\u2019s direct challenge.',
  ),
  mc(
    'scr-auth-john17',
    'John 17:17 grounds Scripture\u2019s authority in the fact that God\u2019s word is...',
    ['Old', 'Poetic', 'Truth', 'Popular'],
    2,
    'Jesus prays that the Father would sanctify his disciples "in the truth," identifying God\u2019s word as truth itself \u2014 authority rests on truthfulness, not merely antiquity or tradition.',
  ),
  mc(
    'scr-auth-canon',
    'The Reformed "recognition, not creation" view of the canon teaches that church councils...',
    [
      'Invented new Scripture to meet doctrinal needs',
      'Granted authority to books that had none before',
      'Recognized and affirmed books that already carried divine, self-authenticating authority',
      'Had no role at all in identifying which books were received',
    ],
    2,
    'On this view, a book\u2019s authority came from its divine, apostolic/prophetic origin; the church\u2019s councils publicly acknowledged what God had already given, rather than conferring authority by vote.',
  ),
  open(
    'scr-auth-open',
    'Where in your life are you tempted to let tradition, culture, or personal feeling outrank Scripture\u2019s authority? What would it look like to reverse that order this week?',
  ),
]

const L3_QUESTIONS: QuizQuestion[] = [
  mc(
    'scr-inerr-numbers',
    'Numbers 23:19 teaches that, unlike human beings, God...',
    [
      'Sometimes changes his mind without reason',
      'Is not a man that he should lie, nor a son of man that he should change his mind',
      'Speaks only through dreams',
      'Cannot be trusted with long-term promises',
    ],
    1,
    'Balaam\u2019s oracle contrasts God\u2019s truthful, unwavering word with human unreliability \u2014 a foundation for trusting everything God has spoken.',
  ),
  mc(
    'scr-inerr-define',
    'This lesson defines "inerrancy" most precisely as a claim that...',
    [
      'Every modern translation is perfect in every word',
      'Scripture in the original manuscripts is fully true in everything it affirms, rightly interpreted',
      'The Bible gives scientific precision by modern standards in every statement',
      'No copyist ever made a small transmission variant in any manuscript',
    ],
    1,
    'Classic inerrancy applies to what the text actually affirms (given genre, phenomenal language, and ancient reporting conventions), in the autographs, not to modern expectations never intended by the authors.',
  ),
  mc(
    'scr-inerr-limited',
    'A key difference between "full inerrancy" and "limited inerrancy" positions discussed in this lesson is that limited inerrancy...',
    [
      'Denies Scripture has any spiritual authority at all',
      'Restricts guaranteed truthfulness to matters of faith and practice, allowing possible error elsewhere',
      'Is simply another name for the historic Reformed position',
      'Claims the Bible contains no history at all',
    ],
    1,
    'Limited-inerrancy views trust Scripture fully for salvation and ethics but allow for incidental historical or scientific error; the historic evangelical/Reformed position affirms truthfulness across all Scripture affirms, while still reading it on its own terms.',
  ),
  open(
    'scr-inerr-open',
    'Describe a Bible difficulty (an apparent contradiction or hard number) you\u2019ve encountered. How might reading it on its own ancient terms, rather than modern precision standards, change how you approach it?',
  ),
]

const L4_QUESTIONS: QuizQuestion[] = [
  mc(
    'scr-suff-2tim',
    '2 Timothy 3:16\u201317 teaches that Scripture is sufficient in the sense that it...',
    [
      'Answers every scientific and practical question in detail',
      'Equips the person of God "for every good work" needed for faith and godly living',
      'Replaces the need for pastors and teachers',
      'Only applies to ancient Israel, not the church',
    ],
    1,
    'Paul\u2019s point is functional sufficiency for the purposes Scripture was given \u2014 teaching, correction, training in righteousness \u2014 not encyclopedic coverage of every topic.',
  ),
  mc(
    'scr-suff-ps119',
    'Psalm 119:130 says the unfolding of God\u2019s words...',
    [
      'Confuses the simple further',
      'Gives light and understanding to the simple',
      'Is reserved only for scholars',
      'Has no practical effect on ordinary life',
    ],
    1,
    'This verse is a classic text for the clarity (perspicuity) of Scripture: its central message is accessible to ordinary, humble readers, not locked behind elite expertise.',
  ),
  mc(
    'scr-suff-qualify',
    'This lesson qualifies the clarity of Scripture by noting that...',
    [
      'Every verse is equally easy to understand on a first reading',
      'Some passages are genuinely difficult and reward careful study, teachers, and the Spirit\u2019s illumination',
      'Clarity means private interpretation without any reference to the church',
      'Only ordained clergy are permitted to read the Bible',
    ],
    1,
    'Clarity concerns the saving, central message of Scripture being accessible to ordinary believers \u2014 it does not claim every passage is equally plain, and it does not discourage the use of teachers and diligent study (2 Peter 3:16).',
  ),
  open(
    'scr-suff-open',
    'Where have you looked outside Scripture for something it already sufficiently provides (assurance, guidance, identity)? What would it look like to return to it there?',
  ),
]

const L5_QUESTIONS: QuizQuestion[] = [
  mc(
    'scr-interp-bereans',
    'In Acts 17:11, the Bereans are commended because they...',
    [
      'Rejected Paul\u2019s teaching outright',
      'Examined the Scriptures daily to test whether Paul\u2019s teaching was true',
      'Refused to read Scripture for themselves',
      'Accepted every teacher\u2019s word without question',
    ],
    1,
    'Luke praises the Bereans\u2019 posture: eager to hear, yet still testing teaching against the text itself \u2014 a model for all interpretation and discernment.',
  ),
  mc(
    'scr-interp-luke24',
    'Luke 24:27 shows Jesus interpreting the Old Testament Scriptures as ultimately...',
    [
      'Unrelated writings with no unified theme',
      'Pointing to himself as their fulfillment',
      'Only relevant to ancient Israelite law',
      'A collection of moral fables',
    ],
    1,
    '"Beginning with Moses and all the Prophets, he interpreted to them in all the Scriptures the things concerning himself" \u2014 Jesus models a Christ-centered, whole-Bible reading.',
  ),
  mc(
    'scr-interp-method',
    'The "grammatical-historical" method taught in this lesson interprets a passage primarily by...',
    [
      'Ignoring the original audience and historical setting',
      'Attending to its original language, genre, and historical context before drawing application',
      'Assigning hidden meanings disconnected from the plain sense of the words',
      'Treating every genre (poetry, law, narrative, prophecy) exactly the same way',
    ],
    1,
    'Sound interpretation starts with what the text actually says in its own language, genre, and setting, then moves to theological synthesis (analogy of Scripture) and application.',
  ),
  mc(
    'scr-interp-nehemiah',
    'Nehemiah 8:8 describes the Levites reading the Law and...',
    [
      'Forbidding the people from asking questions',
      'Giving the sense, so that the people understood the reading',
      'Reading it only in a language the people could not understand',
      'Replacing the Law with new commandments',
    ],
    1,
    'The pattern of reading plus explanation ("gave the sense") models that teaching and clear exposition serve, rather than compete with, Scripture\u2019s clarity.',
  ),
  open(
    'scr-interp-open',
    'Pick a passage you\u2019ve found confusing. What is one question about its context (audience, genre, surrounding verses) you could ask before deciding what it means?',
  ),
]

/** Second complete theology topic: the doctrine of Scripture (Grudem-organized bibliology). */
export const DOCTRINE_OF_SCRIPTURE: CurriculumTopic = {
  id: 'doctrine-of-scripture',
  title: 'The Doctrine of Scripture',
  description:
    'A Reformed introduction to bibliology: how Scripture came to be (inspiration), why it stands over every other authority (authority and canon), why it can be fully trusted (inerrancy), why it is enough and understandable (sufficiency and clarity), and how to read it responsibly (interpretation).',
  objectives: [
    'Explain what it means for Scripture to be "God-breathed" and why that grounds its trustworthiness.',
    'State why Scripture holds supreme authority over tradition, reason, and experience, and summarize how the canon was recognized.',
    'Define inerrancy carefully and engage fairly with differing views among professing Christians.',
    'Distinguish sufficiency and clarity from claims Scripture never makes, while affirming both.',
    'Apply basic, sound hermeneutical principles to personal Bible reading.',
  ],
  estimatedMinutes: 92,
  prerequisites: [],
  framework: 'reformed',
  version: 1,
  sources: [
    {
      ...SOURCE_GRUDEM_ORG,
      note:
        'Topic order and major headings follow Grudem\u2019s "Doctrine of the Word of God" chapters (inspiration, authority/canon, inerrancy, clarity, necessity, sufficiency) as an organizational map for original lesson writing \u2014 not as reproduced textbook text.',
    },
    {
      ...SOURCE_SPROUL_SUP,
      work: 'Published teaching on the trustworthiness of Scripture and the truthfulness of God (e.g. Ligonier resources)',
      note:
        'Sproul\u2019s widely known emphasis that Scripture\u2019s reliability flows from God\u2019s own truthful character supplements the lessons on inerrancy and interpretation. Claims here are original paraphrase of a well-known public theme, not quotations from any specific work.',
    },
    {
      ...SOURCE_MACARTHUR_SUP,
      work: 'Published biblical teaching on the authority and sufficiency of Scripture',
      note:
        'MacArthur\u2019s pastoral stress on Scripture\u2019s sufficiency for ordinary believers and the primacy of careful exposition supplements the lessons on authority, sufficiency, and interpretation. No sermon transcripts are reproduced.',
    },
  ],
  lessons: [
    {
      id: 'scripture-inspiration',
      order: 1,
      title: 'Inspiration: The God-Breathed Word',
      estimatedMinutes: 18,
      objectives: [
        'Define "God-breathed" (theopneustos) from 2 Timothy 3:16 and explain what it claims about Scripture\u2019s origin.',
        'Explain concursive (organic) inspiration: Scripture is fully God\u2019s word and fully written by human authors.',
        'Show from 2 Peter 1:20\u201321 how the Holy Spirit carried along the human writers.',
        'Distinguish inspiration from dictation and from mere human literary genius.',
      ],
      primaryPassages: [
        passage('2timothy', '2 Timothy', 3, 16, 17),
        passage('2peter', '2 Peter', 1, 20, 21),
      ],
      supportingPassages: [
        passage('2samuel', '2 Samuel', 23, 2, 2),
        passage('john', 'John', 10, 35, 35),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Why this lesson matters',
          body:
            'Everything else in this curriculum rests on one claim: the Bible is not merely a record of religious experience but God\u2019s own word, given through human writers. If that claim is true, Scripture carries a kind of authority no other book can claim. This lesson asks what "inspired" actually means before later lessons build on it.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('2timothy', '2 Timothy', 3, 16, 16),
          note:
            'Interpretation: Paul\u2019s word for "breathed out by God" pictures Scripture as the product of God\u2019s own speech-act, not merely writing that later earned God\u2019s approval. The origin, not just the effect, is divine.',
        },
        {
          kind: 'concept',
          term: 'Inspiration (God-breathed)',
          explanation:
            'The doctrine that God so worked through the human authors of Scripture that the resulting text is, in its entirety, his own word \u2014 true, authoritative, and without error in what it affirms.',
        },
        {
          kind: 'distinction',
          biblical:
            '2 Timothy 3:16 states that all Scripture is breathed out by God and profitable for teaching, reproof, correction, and training; 2 Peter 1:21 says prophecy never had its origin in the will of man, but men spoke from God as they were carried along by the Holy Spirit.',
          interpretation:
            'Reformed theology describes this as concursive (or organic) inspiration: God so superintended the human authors \u2014 using their vocabulary, personality, research, and style \u2014 that the resulting text is wholly God\u2019s word and wholly the human author\u2019s word, without error in what it affirms.',
          disagreement:
            'Some older views pictured inspiration as dictation, with human authors functioning almost as stenographers, which struggles to explain the Bible\u2019s varied styles and personal touches. Other views (sometimes associated with liberal Protestant or neo-orthodox thought) treat Scripture as merely human testimony that "becomes" God\u2019s word in the moment a reader encounters God through it, rather than being God\u2019s word in its own right as written text. This curriculum teaches concursive inspiration as the historic evangelical and Reformed position, while naming these alternatives fairly rather than caricaturing them.',
        },
        {
          kind: 'concept',
          term: 'Concursive inspiration vs. dictation',
          explanation:
            'Concursive inspiration affirms two simultaneous, non-competing causes: God\u2019s superintending work and the human author\u2019s free, personal writing. Dictation theory, by contrast, minimizes the human author to a passive instrument with no real contribution of style or vocabulary.',
        },
        {
          kind: 'attribution',
          teacherId: 'grudem',
          work: 'Systematic Theology',
          note:
            'Organizational cue: Grudem\u2019s "Doctrine of the Word of God" begins precisely here, with inspiration as the foundation for every later claim about authority, inerrancy, clarity, and sufficiency. Lesson content is original summary for learners.',
        },
        {
          kind: 'teaching',
          title: 'Reading with confidence, not superstition',
          body:
            'Believing Scripture is God-breathed does not mean treating the physical book as magical or approaching hard passages with a closed mind. It means approaching the text expecting to meet the God who speaks truthfully, and bringing careful study rather than either blind acceptance or skeptical dismissal.',
        },
        {
          kind: 'attribution',
          teacherId: 'macarthur',
          work: 'Biblical teaching on the authority of Scripture',
          note:
            'Supplementary emphasis: a high view of inspiration grounds confident, expository reading of the text as God\u2019s address to his people, rather than treating Scripture as a springboard for human opinion. Original paraphrase only.',
        },
      ],
      questions: L1_QUESTIONS,
      reflectionPrompts: [
        'Thank God that he has spoken, and name one area of life where you tend to trust your own feelings over his written word.',
      ],
      furtherStudy: [
        'Read 2 Timothy 3:14\u201317 in full and list every stated purpose for Scripture in verses 16\u201317.',
        'Compare 2 Peter 1:16\u201321, noting how Peter contrasts "cleverly devised myths" with eyewitness testimony and Spirit-carried prophecy.',
      ],
    },
    {
      id: 'scripture-authority',
      order: 2,
      title: 'Authority and the Canon of Scripture',
      estimatedMinutes: 18,
      objectives: [
        'Explain why Scripture\u2019s divine authorship grounds its supreme authority over tradition, reason, and experience.',
        'Distinguish sola scriptura ("Scripture is the final authority") from the caricature "solo scriptura" ("Scripture is the only source of truth or teacher I need").',
        'Trace in outline how the Old and New Testament canons were recognized, not invented, by the believing community.',
        'Show from Matthew 4:4 and John 17:17 how Jesus himself treated Scripture as supremely authoritative.',
      ],
      primaryPassages: [
        passage('matthew', 'Matthew', 4, 4, 4),
        passage('john', 'John', 17, 17, 17),
        passage('2peter', '2 Peter', 3, 15, 16),
      ],
      supportingPassages: [
        passage('luke', 'Luke', 24, 44, 44),
        passage('deuteronomy', 'Deuteronomy', 4, 2, 2),
        passage('revelation', 'Revelation', 22, 18, 19),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'From origin to authority',
          body:
            'If Scripture is God\u2019s own word (Lesson 1), then it carries God\u2019s own authority. That authority does not compete with tradition, reason, or experience as equals; it stands over them as the final court of appeal, even while those other sources remain genuinely useful as servants under Scripture.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('matthew', 'Matthew', 4, 4, 4),
          note:
            'Interpretation: Facing direct temptation from Satan, Jesus answers by quoting a written Old Testament text ("It is written") as final and sufficient \u2014 modeling Scripture\u2019s supreme authority even over a spiritual adversary\u2019s challenge.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('john', 'John', 17, 17, 17),
          note:
            'Interpretation: Jesus grounds Scripture\u2019s power to sanctify in the fact that it is truth. Authority flows from truthfulness, not merely from age, popularity, or institutional endorsement.',
        },
        {
          kind: 'concept',
          term: 'Canon',
          explanation:
            'The recognized collection of books that the church receives as Scripture \u2014 from a word meaning "rule" or "standard." "Canonical" means belonging to that authoritative collection.',
        },
        {
          kind: 'distinction',
          biblical:
            'Luke 24:44 shows Jesus referring to "the Law of Moses and the Prophets and the Psalms" as an already-recognized authoritative collection in his own day; 2 Peter 3:15\u201316 places Paul\u2019s letters alongside "the other Scriptures," treating them as Scripture during the apostolic era itself.',
          interpretation:
            'Reformed theology teaches that the canon was recognized, not created, by the church: books carried divine authority because of their prophetic or apostolic origin and self-authenticating qualities (consistency with earlier revelation, transformative power, widespread reception by believing communities), and councils later affirmed publicly what God had already given.',
          disagreement:
            'Some traditions (notably Roman Catholic teaching) hold that the church\u2019s authoritative decision effectively settles and in some sense establishes the canon, including additional Old Testament books (the Apocrypha) that Protestant Reformed theology does not receive as canonical Scripture. Some popular skeptical claims suggest the canon was politically imposed centuries later by a single council; historically, the core New Testament books were widely received and used as Scripture well before any formal conciliar list. This lesson teaches the Protestant "recognition, not creation" view while naming these other positions fairly.',
        },
        {
          kind: 'concept',
          term: 'Sola scriptura (not "solo scriptura")',
          explanation:
            'Sola scriptura means Scripture alone is the final, infallible authority for faith and life \u2014 not that it is the only source of truth or that creeds, confessions, and teachers are worthless. "Solo scriptura" wrongly treats every individual\u2019s private reading as equally authoritative to Scripture itself, discarding the church\u2019s historic wisdom; Reformed theology rejects that caricature.',
        },
        {
          kind: 'attribution',
          teacherId: 'grudem',
          work: 'Systematic Theology',
          note:
            'Organizational cue: Grudem treats the canon and Scripture\u2019s authority as the natural outworking of its inspired origin. Lesson content is original summary for learners, not reproduced text.',
        },
        {
          kind: 'attribution',
          teacherId: 'macarthur',
          work: 'Biblical teaching on the authority of Scripture',
          note:
            'Supplementary emphasis: Scripture\u2019s authority means it has the right to correct every tradition, feeling, and cultural assumption believers bring to it, rather than merely confirming what readers already think. Original paraphrase only.',
        },
      ],
      questions: L2_QUESTIONS,
      reflectionPrompts: [
        'Name one belief or habit you hold mainly because of tradition or personal preference. How would you test it against Scripture this week?',
      ],
      furtherStudy: [
        'Read Deuteronomy 4:2 and Revelation 22:18\u201319 together and note the pattern of warning against adding to or subtracting from God\u2019s word.',
      ],
      reviewFromLessonIds: ['scripture-inspiration'],
    },
    {
      id: 'scripture-inerrancy',
      order: 3,
      title: 'Inerrancy and the Truthfulness of Scripture',
      estimatedMinutes: 20,
      objectives: [
        'Define inerrancy as a claim about Scripture in the original manuscripts being fully true in what it affirms.',
        'Explain how inerrancy accounts for phenomenal language, round numbers, and differing eyewitness perspectives without denying truthfulness.',
        'Fairly summarize the range of views among professing Christians on inerrancy, and state the historic evangelical/Reformed commitment.',
        'Apply a mature, patient posture toward apparent Bible difficulties rather than panic or dismissal.',
      ],
      primaryPassages: [
        passage('psalms', 'Psalms', 119, 160, 160),
        passage('numbers', 'Numbers', 23, 19, 19),
        passage('titus', 'Titus', 1, 2, 2),
      ],
      supportingPassages: [
        passage('proverbs', 'Proverbs', 30, 5, 5),
        passage('psalms', 'Psalms', 12, 6, 6),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Why truthfulness matters',
          body:
            'A God-breathed, supremely authoritative word (Lessons 1\u20132) would be of little comfort if it could not be trusted to tell the truth. This lesson asks a narrower, careful question: in what sense, and how precisely, is Scripture true?',
        },
        {
          kind: 'scripture_focus',
          passage: passage('psalms', 'Psalms', 119, 160, 160),
          note:
            'Interpretation: "The sum of your word is truth" suggests truthfulness as a property of Scripture taken as a whole, not merely isolated proof-texts pulled out of context.',
        },
        {
          kind: 'concept',
          term: 'Inerrancy',
          explanation:
            'The claim that Scripture, in its original manuscripts, is fully true and without error in everything it affirms, when interpreted according to its own intended sense (genre, phenomenal/observational language, ancient numbering and quotation conventions).',
        },
        {
          kind: 'concept',
          term: 'Inerrancy vs. infallibility',
          explanation:
            'Some theologians use "infallible" to mean Scripture cannot fail to accomplish its purpose (incapable of leading astray in faith and practice) and reserve "inerrant" for the stronger claim that it contains no errors at all in what it affirms. This curriculum affirms both: Scripture cannot fail its purpose, and it is also fully true in what it affirms.',
        },
        {
          kind: 'distinction',
          biblical:
            'Numbers 23:19 declares that God is not a man that he should lie, nor a son of man that he should change his mind; Titus 1:2 describes God as the one "who never lies"; Psalm 119:160 affirms that the sum of God\u2019s word is truth.',
          interpretation:
            'Because Scripture is God\u2019s breathed-out word (Lesson 1) and God cannot lie, Scripture is wholly true in everything it affirms when properly interpreted \u2014 including attention to genre, approximate or round numbers, phenomenal language ("the sun rose"), and the free-quotation conventions of ancient historical writing. Inerrancy is a claim about truthfulness on the text\u2019s own terms, not about meeting modern standards of statistical or scientific precision the biblical authors never intended.',
          disagreement:
            'Some traditions teach "limited inerrancy," trusting Scripture fully for salvation and Christian living while allowing for possible incidental error in historical or scientific details; others, in more liberal Protestant streams, deny inerrancy altogether while still valuing Scripture\u2019s religious insight. The historic evangelical and Reformed position (reflected in documents like the Chicago Statement on Biblical Inerrancy) affirms full inerrancy across everything Scripture affirms, while carefully distinguishing that claim from imposing modern precision standards the text never claimed for itself. This lesson states the Reformed commitment clearly while describing other positions fairly rather than dismissively.',
        },
        {
          kind: 'attribution',
          teacherId: 'grudem',
          work: 'Systematic Theology',
          note:
            'Organizational cue: Grudem treats inerrancy as flowing directly from inspiration and authority, addressing common objections (numbers, quotations, apparent contradictions) in turn. Lesson content is original summary, not reproduced text.',
        },
        {
          kind: 'attribution',
          teacherId: 'sproul',
          work: 'Published teaching on the truthfulness of God and Scripture',
          note:
            'Supplementary emphasis: because God himself cannot lie, a document that is truly his breathed-out word must itself be fully truthful \u2014 the doctrine of Scripture\u2019s truthfulness is grounded in the doctrine of God, not asserted in isolation. Original paraphrase of a widely known public theme.',
        },
        {
          kind: 'teaching',
          title: 'A patient posture toward hard texts',
          body:
            'Every long, ancient document invites real interpretive questions \u2014 differing details between parallel Gospel accounts, large numbers in historical narratives, or quotations that summarize rather than reproduce word-for-word. A mature doctrine of inerrancy does not panic at these questions; it studies context, genre, and ancient convention before concluding there is an actual error, and holds unresolved difficulties with humility rather than either denial or despair.',
        },
      ],
      questions: L3_QUESTIONS,
      reflectionPrompts: [
        'Where do you tend to react with either anxiety or dismissiveness when you meet a hard passage? What would patient, confident study look like instead?',
      ],
      furtherStudy: [
        'Compare the resurrection morning accounts in the four Gospels and note how differing details (who arrived first, how many angels) can reflect complementary eyewitness perspectives rather than contradiction.',
      ],
      reviewFromLessonIds: ['scripture-inspiration', 'scripture-authority'],
    },
    {
      id: 'scripture-sufficiency-clarity',
      order: 4,
      title: 'Sufficiency and Clarity of Scripture',
      estimatedMinutes: 18,
      objectives: [
        'Define sufficiency: Scripture contains everything necessary for salvation and godly living, without requiring additional revelation.',
        'Define clarity (perspicuity): Scripture\u2019s central saving message is understandable to ordinary believers.',
        'Distinguish sufficiency from the claim that Scripture answers every practical, scientific, or personal-guidance question in detail.',
        'Explain how clarity still leaves room for difficult passages, careful study, and the ministry of teachers.',
      ],
      primaryPassages: [
        passage('2timothy', '2 Timothy', 3, 16, 17),
        passage('psalms', 'Psalms', 19, 7, 11),
        passage('2peter', '2 Peter', 1, 3, 3),
      ],
      supportingPassages: [
        passage('deuteronomy', 'Deuteronomy', 29, 29, 29),
        passage('psalms', 'Psalms', 119, 105, 105),
        passage('psalms', 'Psalms', 119, 130, 130),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Enough, and understandable',
          body:
            'Having established that Scripture is God-breathed, authoritative, and true (Lessons 1\u20133), this lesson asks two practical questions: does it give us what we need, and can ordinary people actually understand it? Reformed theology answers yes to both, with careful qualification.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('2timothy', '2 Timothy', 3, 16, 17),
          note:
            'Interpretation: Scripture equips the person of God to be "complete, equipped for every good work" \u2014 a claim about functional sufficiency for faith and godly living, not about covering every conceivable topic.',
        },
        {
          kind: 'concept',
          term: 'Sufficiency of Scripture',
          explanation:
            'The doctrine that Scripture contains everything God requires us to know, believe, and do for salvation and faithful Christian living, so that no additional revelation or binding tradition is necessary alongside it.',
        },
        {
          kind: 'concept',
          term: 'Clarity (perspicuity) of Scripture',
          explanation:
            'The doctrine that Scripture\u2019s central saving message is clear enough for ordinary believers \u2014 using normal means such as reading, hearing it taught, and depending on the Holy Spirit \u2014 to understand what is necessary for salvation and faithful living.',
        },
        {
          kind: 'distinction',
          biblical:
            'Psalm 19:7 says the law of the LORD is perfect, reviving the soul, and its testimony makes wise the simple; Psalm 119:105 calls God\u2019s word a lamp to the feet; Psalm 119:130 says the unfolding of God\u2019s words gives light and understanding to the simple; 2 Peter 1:3 says God\u2019s divine power has granted everything needed for life and godliness through the knowledge of him.',
          interpretation:
            'Reformed doctrine affirms that Scripture\u2019s saving message is sufficiently clear that ordinary readers, trusting the Spirit\u2019s illumination and ordinary means (reading, hearing preaching, basic study tools), can grasp what is necessary for salvation and faithful living \u2014 even though some passages are genuinely difficult (2 Peter 3:16) and reward careful study and teachers. Sufficiency means no further revelation or required tradition needs to be added to Scripture\u2019s content for faith and practice.',
          disagreement:
            'Some traditions hold that an authoritative supplementary deposit of oral tradition, or ongoing prophetic revelation, is necessary alongside Scripture to complete what is needed for faith and practice; Reformed theology affirms Scripture\u2019s final sufficiency while still valuing creeds, confessions, and teachers as genuinely helpful, fallible aids rather than required additions. Popular appeals to "just read it yourself, no help needed" can also overstate clarity by ignoring the real value of teachers and the believing community (Nehemiah 8:8; Acts 8:30\u201331); this lesson qualifies clarity accordingly.',
        },
        {
          kind: 'attribution',
          teacherId: 'grudem',
          work: 'Systematic Theology',
          note:
            'Organizational cue: Grudem treats clarity and sufficiency as paired doctrines following inerrancy, addressing how they guard against both legalistic rule-making beyond Scripture and against treating Scripture as too obscure for ordinary believers. Lesson content is original summary.',
        },
        {
          kind: 'attribution',
          teacherId: 'macarthur',
          work: 'Biblical teaching on the sufficiency of Scripture',
          note:
            'Supplementary emphasis: Scripture is sufficient for the soul\u2019s deepest needs, so believers need not look to merely human psychology, superstition, or novel techniques as a replacement for faithful biblical teaching and counsel. Original paraphrase only.',
        },
        {
          kind: 'teaching',
          title: 'Guidance without a verse for everything',
          body:
            'Sufficiency does not mean Scripture names which job to take or which house to buy. It gives wisdom, character, and principles (general revelation, Christian liberty, prayerful wisdom) for decisions it does not directly address \u2014 a very different claim than demanding an explicit verse for every choice.',
        },
      ],
      questions: L4_QUESTIONS,
      reflectionPrompts: [
        'Name a decision or struggle where you\u2019ve been waiting for a specific sign rather than applying Scripture\u2019s wisdom and principles. What would faithful next steps look like?',
      ],
      furtherStudy: [
        'Read Psalm 19 in full and note how it moves from general revelation (vv. 1\u20136) to special revelation (vv. 7\u201314).',
      ],
      reviewFromLessonIds: ['scripture-inspiration', 'scripture-authority', 'scripture-inerrancy'],
    },
    {
      id: 'scripture-interpretation',
      order: 5,
      title: 'Interpretation and Application',
      estimatedMinutes: 18,
      objectives: [
        'State basic hermeneutical principles: context, genre, authorial intent, and letting Scripture interpret Scripture.',
        'Explain the redemptive-historical principle that the whole Bible points toward Christ (Luke 24:27).',
        'Apply the Berean pattern (Acts 17:11) of testing teaching against the text itself.',
        'Identify and avoid common interpretive errors such as proof-texting and unwarranted allegorizing.',
      ],
      primaryPassages: [
        passage('2timothy', '2 Timothy', 2, 15, 15),
        passage('luke', 'Luke', 24, 27, 27),
        passage('acts', 'Acts', 17, 11, 11),
      ],
      supportingPassages: [
        passage('nehemiah', 'Nehemiah', 8, 8, 8),
        passage('2peter', '2 Peter', 3, 16, 16),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'From doctrine to practice',
          body:
            'Knowing Scripture is inspired, authoritative, true, sufficient, and clear (Lessons 1\u20134) still leaves an essential question: how should it actually be read? This closing lesson offers basic tools for responsible interpretation.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('2timothy', '2 Timothy', 2, 15, 15),
          note:
            'Interpretation: Paul calls Timothy to diligent, accurate handling of "the word of truth," implying interpretation can be done well or poorly, and that careful effort \u2014 not laziness or cleverness \u2014 honors the text.',
        },
        {
          kind: 'concept',
          term: 'Hermeneutics',
          explanation:
            'The discipline and principles of biblical interpretation: understanding a passage\u2019s original language, genre, historical setting, and literary context before drawing theological conclusions and application.',
        },
        {
          kind: 'concept',
          term: 'Analogy of Scripture',
          explanation:
            'The principle that Scripture interprets Scripture: clearer passages help illuminate less clear ones, and the whole counsel of Scripture guards against building doctrine on a single isolated verse.',
        },
        {
          kind: 'distinction',
          biblical:
            'Luke 24:27 records Jesus, "beginning with Moses and all the Prophets," interpreting "in all the Scriptures the things concerning himself"; Acts 17:11 commends the Bereans for examining the Scriptures daily to test Paul\u2019s teaching; Nehemiah 8:8 describes the Levites reading the Law clearly and giving the sense so the people understood.',
          interpretation:
            'Reformed hermeneutics reads each passage first in its own literary and historical context, according to its genre (narrative, law, poetry, prophecy, letter), and lets Scripture interpret Scripture \u2014 while also tracing how the whole Bible\u2019s unified redemptive storyline is fulfilled in Christ (a Christ-centered, grammatical-historical method).',
          disagreement:
            'Allegorical approaches, common at various points in church history, sometimes find hidden Christ-centered or spiritual meanings disconnected from a passage\u2019s plain, intended sense. Strict literalism at the other extreme can flatten poetic or apocalyptic genre into wooden, overly technical readings it was never meant to bear. This lesson teaches a Christ-centered, grammatical-historical method that honors both a text\u2019s original meaning and its place in Scripture\u2019s larger story, while noting that godly interpreters sometimes disagree about where redemptive-historical reading ends and eisegesis (reading meaning into a text) begins.',
        },
        {
          kind: 'attribution',
          teacherId: 'grudem',
          work: 'Systematic Theology',
          note:
            'Organizational cue: Grudem\u2019s "Doctrine of the Word of God" material concludes by turning doctrine toward practical reading and application, which this closing lesson mirrors with original content.',
        },
        {
          kind: 'attribution',
          teacherId: 'sproul',
          work: 'Published teaching on biblical interpretation',
          note:
            'Supplementary emphasis: careful, contextual reading protects both the text\u2019s integrity and the reader\u2019s soul from convenient but unfounded interpretations. Original paraphrase of a widely known public emphasis, not a quotation.',
        },
        {
          kind: 'teaching',
          title: 'A simple study pattern',
          body:
            'A workable pattern for personal study is observe (what does the text actually say?), interpret (what did it mean to its original audience, and what is the point?), and apply (how does this truth call for faith and obedience today?). Skipping straight to application without observation and interpretation is the most common source of misreading.',
        },
      ],
      questions: [
        ...L5_QUESTIONS,
        mc(
          'scr-interp-review-insp',
          'Review: This topic\u2019s first lesson taught that "God-breathed" (2 Timothy 3:16) describes Scripture\u2019s...',
          ['Literary beauty', 'Divine origin', 'Age', 'Popularity'],
          1,
          'Lesson 1 defined inspiration as a claim about Scripture\u2019s source \u2014 breathed out by God \u2014 not merely its quality or reception.',
        ),
      ],
      reflectionPrompts: [
        'Choose one passage you plan to study this week using the observe-interpret-apply pattern, and write down your first observation.',
      ],
      furtherStudy: [
        'Read Nehemiah 8:1\u201312 and notice how reading, explanation, and response to God\u2019s word are woven together.',
      ],
      reviewFromLessonIds: [
        'scripture-inspiration',
        'scripture-authority',
        'scripture-inerrancy',
        'scripture-sufficiency-clarity',
      ],
    },
  ],
}
