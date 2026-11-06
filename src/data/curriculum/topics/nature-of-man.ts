import type { QuizQuestion } from '../../planQuizzes'
import type { CurriculumTopic } from '../types'
import {
  passage,
  mc,
  open,
  study,
  SOURCE_GRUDEM_ORG,
  SOURCE_SPROUL_SUP,
  SOURCE_MACARTHUR_SUP,
} from './_helpers'

/** Supplement S1 — Creation and Origins (Update Pack Part 9.1) */
const L0: QuizQuestion[] = [
  mc(
    'nom-0-q1',
    'Who created the heavens and the earth (Genesis 1:1)?',
    ['God', 'Nature', 'Man', 'The angels'],
    0,
    'Genesis 1:1 opens with God as the Creator.',
    'beginner',
  ),
  mc(
    'nom-0-q2',
    'According to the seminary, how long were the days of creation?',
    ['Six literal 24-hour days', 'Millions of years each', 'One day', 'Unspecified'],
    0,
    'The TMS statement teaches six literal 24-hour days.',
    'beginner',
  ),
  mc(
    'nom-0-q3',
    'Which verse bases the work week on the six days of creation?',
    ['Exodus 20:11', 'Genesis 3:15', 'Psalm 23', 'Romans 1:1'],
    0,
    'Exodus 20:11 says the LORD made heaven and earth in six days and rested on the seventh.',
    'intermediate',
  ),
  mc(
    'nom-0-q4',
    'The day-age view holds that the days are:',
    ['Long periods of time', 'Literary only', '24 hours', 'Not in the Bible'],
    0,
    'It reads each “day” as an age.',
    'intermediate',
  ),
  mc(
    'nom-0-q5',
    'Why does theistic evolution conflict with the TMS statement?',
    [
      'The statement says Adam was directly and immediately created in God’s image',
      'It denies God',
      'It teaches six days',
      'It rejects the Bible',
    ],
    0,
    'Evolutionary descent conflicts with Genesis 2:7 and the direct creation of Adam.',
    'advanced',
  ),
]

const L1: QuizQuestion[] = [
  mc(
    'nom-1-q1',
    'Which verse first says humans are made in God’s image?',
    ['John 3:16', 'Genesis 1:27', 'Psalm 23:1', 'Romans 3:23'],
    1,
    'Genesis 1:27 states it directly.',
    'beginner',
  ),
  mc(
    'nom-1-q2',
    'Genesis 9:6 forbids murder because:',
    [
      'Murder harms society',
      'Man is made in the image of God',
      'Noah was righteous',
      'Animals were also protected',
    ],
    1,
    'The command is grounded in the image of God.',
    'intermediate',
  ),
  mc(
    'nom-1-q3',
    'Why do Reformed theologians reject the view that “likeness” was a supernatural gift lost at the fall?',
    [
      'Hebrew has no word for likeness',
      'Tselem and demut are parallel terms for one reality, and the image is still affirmed after the fall',
      'Only the Septuagint uses both words',
      'Adam was not created righteous',
    ],
    1,
    'Genesis 1:26 pairs the terms; Genesis 9:6 and James 3:9 treat the image as still present.',
    'advanced',
  ),
  open(
    'nom-1-open',
    'How does believing everyone is an image-bearer change how you treat someone you find difficult?',
  ),
]

const L2: QuizQuestion[] = [
  mc(
    'nom-2-q1',
    'According to Philippians 1:23, what does Paul say about departing this life?',
    [
      'It is the end of existence',
      'To be with Christ is far better',
      'We return as angels',
      'We sleep until Judgment',
    ],
    1,
    'Paul longs to depart and be with Christ, which is far better.',
    'beginner',
  ),
  mc(
    'nom-2-q2',
    'Which view says that humans are only physical and have no immaterial soul?',
    ['Dualism', 'Trichotomy', 'Materialist monism', 'Gnosticism'],
    2,
    'Materialist monism denies an immaterial soul.',
    'intermediate',
  ),
  mc(
    'nom-2-q3',
    'Why is “living creature” (nephesh chayyah) in Genesis 2:7 not by itself proof of an immaterial soul?',
    [
      'The phrase is not in the Hebrew text',
      'It is also used of animals, so the doctrine rests on other passages as well',
      'Nephesh only means breath',
      'Genesis 2 is poetry',
    ],
    1,
    'The same phrase describes animals in Genesis 1; soul teaching rests on texts like Matthew 10:28 and 2 Corinthians 5.',
    'advanced',
  ),
  open(
    'nom-2-open',
    'How should believing the body is good shape the way you care for yours?',
  ),
]

const L3: QuizQuestion[] = [
  mc(
    'nom-3-q1',
    'What does “trichotomy” mean?',
    [
      'Humans have two parts',
      'Humans have three parts: body, soul, spirit',
      'Humans have no soul',
      'Humans are divine',
    ],
    1,
    'Trichotomy teaches body, soul, and spirit as three parts.',
    'beginner',
  ),
  mc(
    'nom-3-q2',
    'Which verse do trichotomists most often cite?',
    ['Genesis 1:1', '1 Thessalonians 5:23', 'Romans 3:23', 'John 1:14'],
    1,
    '1 Thessalonians 5:23 lists spirit, soul, and body.',
    'intermediate',
  ),
  mc(
    'nom-3-q3',
    'What was the doctrinal danger in Apollinarius’s use of trichotomy?',
    [
      'He denied the Trinity',
      'He denied that Christ had a human mind or spirit, which undermined the full incarnation',
      'He denied the resurrection',
      'He denied the canon',
    ],
    1,
    'Constantinople (381) condemned Apollinarianism; Christ took a complete human nature.',
    'advanced',
  ),
  mc(
    'nom-3-q5',
    'Which view does the app teach about the makeup of man?',
    ['Monism', 'Dichotomy', 'Trichotomy', 'Materialism'],
    1,
    'The app teaches dichotomy: body and immaterial soul or spirit. The TMS statement does not name the view; this is the app’s instructed position.',
    'intermediate',
  ),
  open(
    'nom-3-open',
    'Does your view of body and soul affect how you think about sanctification? How?',
  ),
]

const L4: QuizQuestion[] = [
  mc(
    'nom-4-q1',
    'According to the Westminster Shorter Catechism, what is the chief end of man?',
    [
      'To be successful',
      'To glorify God and enjoy Him forever',
      'To rule the earth',
      'To earn salvation',
    ],
    1,
    'WSC Q1: to glorify God and enjoy Him forever.',
    'beginner',
  ),
  mc(
    'nom-4-q2',
    'In Genesis 2:15, God put Adam in the garden “to work it and keep it.” This shows that dominion means:',
    ['Exploiting creation', 'Stewarding creation', 'Escaping creation', 'Worshiping creation'],
    1,
    'Dominion is stewardship under God, not exploitation.',
    'intermediate',
  ),
  mc(
    'nom-4-q3',
    'Romans 2:14-15 teaches that Gentiles who do not have the law:',
    [
      'Are saved by conscience',
      'Show the work of the law written on their hearts, so they are accountable but not saved by it',
      'Are not responsible to God',
      'Have a different law',
    ],
    1,
    'Conscience witnesses accountability; it does not save.',
    'advanced',
  ),
  open(
    'nom-4-open',
    'What would change in your week if you took “do all to the glory of God” seriously?',
  ),
]

const L5: QuizQuestion[] = [
  mc(
    'nom-5-q1',
    'Through whom did sin and death enter the world, according to Romans 5?',
    ['Moses', 'One man, Adam', 'The angels', 'Noah'],
    1,
    'Romans 5:12 — sin entered through one man.',
    'beginner',
  ),
  mc(
    'nom-5-q2',
    '“Total depravity” means:',
    [
      'Everyone is as evil as possible',
      'Sin touches every part of us so that we cannot please God apart from grace',
      'Christians never sin',
      'The body is evil and the soul is pure',
    ],
    1,
    'Total depravity is extensive corruption, not maximal intensity.',
    'intermediate',
  ),
  mc(
    'nom-5-q3',
    'The Reformed answer to Pelagianism is that:',
    [
      'Humans can obey God unaided',
      'Regeneration precedes and enables faith',
      'Grace only assists after we begin',
      'Original sin is merely a bad example',
    ],
    1,
    'Ezekiel 36; John 3; Ephesians 2 — new birth enables faith.',
    'advanced',
  ),
  open(
    'nom-5-open',
    'Where do you still tend to minimize sin’s seriousness — or despair of God’s power to renew you?',
  ),
]

export const NATURE_OF_MAN: CurriculumTopic = {
  id: 'nature-of-man',
  title: 'The Nature of Man',
  description:
    'A Reformed introduction to humanity: the image of God, body and soul, purpose, and the effects of sin — taught with MacArthur / Master’s Seminary clarity and fair notes on other views.',
  objectives: [
    'Explain the image of God and why it still matters after the Fall.',
    'Describe body-soul unity without materialism or body-denying dualism.',
    'State human purpose and responsibility under God’s glory.',
    'Summarize original sin and total depravity without denying remaining dignity.',
  ],
  estimatedMinutes: 108,
  prerequisites: [],
  framework: 'reformed',
  contentStatus: 'full',
  version: 3,
  sources: [
    {
      ...SOURCE_MACARTHUR_SUP,
      teacher: 'John MacArthur / The Master’s Seminary',
      work: 'Biblical Doctrine (Mayhue, general editor)',
      role: 'organizational',
      note:
        'Organizational baseline for anthropology positions taught in this topic (image, dichotomy, depravity). Paraphrase only; not reproduced textbook text.',
    },
    {
      ...SOURCE_GRUDEM_ORG,
      role: 'supplementary',
      note:
        'Clear definitions of image, composition, and sin as a teaching map. Where Grudem differs from TMS on other loci, those differences are not taught here as app doctrine.',
    },
    {
      ...SOURCE_SPROUL_SUP,
      work: 'Essential Truths of the Christian Faith; Chosen by God (themes)',
      note:
        'Supplementary emphasis on holiness, fallenness, and grace. Paraphrased themes only.',
    },
    {
      teacherId: 'hoekema',
      teacher: 'Anthony A. Hoekema',
      work: 'Created in God’s Image',
      role: 'supplementary',
      note:
        'Holistic reading of the image (substantive, relational, and functional aspects together) informs Go Deeper teaching — paraphrase only.',
    },
  ],
  lessons: [
    {
      id: 'nature-of-man-creation-origins',
      order: 1,
      title: 'Creation and Origins',
      estimatedMinutes: 18,
      objectives: {
        beginner: [
          'Know that God created everything and what the Bible says about the six days.',
        ],
        intermediate: [
          'Compare the main views of Genesis 1 and why the seminary holds the six-day view.',
        ],
        advanced: [
          'Evaluate each view’s handling of Exodus 20:11, “evening and morning,” and death before the fall.',
        ],
      },
      primaryPassages: [
        passage('genesis', 'Genesis', 1, 1, 31),
        passage('genesis', 'Genesis', 2, 1, 3),
        passage('exodus', 'Exodus', 20, 8, 11),
        passage('romans', 'Romans', 5, 12, 12),
      ],
      supportingPassages: [
        passage('genesis', 'Genesis', 2, 7, 7),
        passage('exodus', 'Exodus', 31, 17, 17),
        passage('matthew', 'Matthew', 19, 4, 5),
        passage('mark', 'Mark', 10, 6, 6),
        passage('romans', 'Romans', 8, 20, 22),
        passage('colossians', 'Colossians', 1, 16, 17),
      ],
      content: [
        {
          kind: 'teaching',
          level: 'all',
          title: 'Six literal days',
          body:
            'Genesis 1:1 says God created the heavens and the earth. The seminary, and therefore the app, teaches that the creation days were six literal 24-hour days, that God specially created Adam and Eve (Genesis 1:26-28; 2:7, 21-22), and that there was no death before the fall (Romans 5:12; 8:20-22). Reasons include: yom (“day”) with a number and with “evening and morning” refers to ordinary days; Exodus 20:9-11 bases the work week on the six days of creation; Jesus spoke of Adam and Eve as historical “from the beginning of creation” (Mark 10:6; Matthew 19:4-5); and Genesis genealogies treat Adam as a real ancestor.',
        },
        {
          kind: 'teaching',
          level: 'all',
          title: 'Other views (described fairly)',
          body:
            'Christians who love Scripture have held other readings of Genesis 1. The day-age (progressive creation) view treats the days as long ages. The gap view places a gap between Genesis 1:1 and 1:2. The framework hypothesis treats the six days as a literary frame, not a timeline. Analogical-day views treat God’s workdays as analogous to ours but not identical. Theistic (evolutionary) creation holds that God used evolution and may deny a historical first man — that conflicts with the TMS statement that man was directly and immediately created. Naturalistic evolution denies a Creator. The app teaches the six-day view and describes the others so you can recognize them without mocking people who hold them.',
        },
        {
          kind: 'teaching',
          level: 'intermediate',
          title: 'Go deeper: yom with ordinals',
          body:
            'Yom (day) with an ordinal number occurs many times in the Old Testament and, in that pattern, refers to an ordinary day. Pair that with “evening and morning” in Genesis 1 and with Exodus 20:11.',
        },
        {
          kind: 'teaching',
          level: 'advanced',
          title: 'Go deeper: Exodus 20:11',
          body:
            'Exodus 20:11 uses “made” (asah) of the six days; this is among the strongest textual supports for the six-day view. Verify lexical counts against a concordance when you study further.',
        },
        {
          kind: 'distinction',
          biblical:
            'Genesis narrates creation in six days with evening and morning; Exodus 20:11 grounds the Sabbath command in those six days; Romans ties death to Adam’s sin.',
          interpretation:
            'The app teaches young-earth, six literal 24-hour days and the special creation of Adam and Eve as the seminary’s position.',
          disagreement:
            'Day-age, gap, framework, and analogical views are held by some who affirm Scripture; the seminary rejects them. Theistic evolution conflicts with TMS on Adam. Naturalistic evolution denies God as Creator.',
        },
        {
          kind: 'concept',
          term: 'Creatio ex nihilo',
          explanation:
            'Creation out of nothing — God alone brings the universe into being; He is not arranging eternal matter.',
        },
      ],
      questions: L0,
      reflectionPrompts: [
        'Why does it matter whether Genesis 1 is read as history?',
        'How can you talk about origins with a friend who holds a different view without losing the gospel?',
      ],
      furtherStudy: [
        study('Wayne Grudem', 'Systematic Theology', { locator: 'ch. 15 Creation', verified: true }),
        study('R.C. Sproul', "Everyone's a Theologian", {
          locator: 'ch. 16 Creatio ex Nihilo p. 87',
          verified: true,
        }),
        study('Ligonier Ministries', 'Foundations', {
          locator: 'message #16 Creation Ex Nihilo',
          verified: true,
        }),
        study('John MacArthur & Richard Mayhue', 'Biblical Doctrine', {
          locator: 'ch. 3',
          verified: true,
        }),
        study('John MacArthur', 'The Battle for the Beginning', { verified: false }),
      ],
      status: 'published',
    },
    {
      id: 'nature-of-man-image',
      order: 2,
      title: 'Created in the Image of God',
      estimatedMinutes: 18,
      objectives: {
        beginner: [
          'Explain that every human being is made in God’s image and what that means for how we treat people.',
        ],
        intermediate: [
          'Compare the substantive, relational, and functional views of the image and explain why Reformed theology prefers a holistic view.',
        ],
        advanced: [
          'Discuss the Hebrew terms tselem and demut, the Roman Catholic donum superadditum distinction, and Christ as the true image.',
        ],
      },
      primaryPassages: [
        passage('genesis', 'Genesis', 1, 26, 28),
        passage('genesis', 'Genesis', 9, 5, 6),
        passage('james', 'James', 3, 7, 10),
      ],
      supportingPassages: [
        passage('genesis', 'Genesis', 2, 7, 7),
        passage('genesis', 'Genesis', 5, 1, 3),
        passage('psalms', 'Psalms', 8, 1, 9),
        passage('romans', 'Romans', 8, 29, 29),
        passage('2corinthians', '2 Corinthians', 4, 4, 4),
        passage('colossians', 'Colossians', 1, 15, 15),
        passage('colossians', 'Colossians', 3, 10, 10),
      ],
      content: [
        {
          kind: 'teaching',
          level: 'all',
          title: 'What the Bible says',
          body:
            'Genesis 1:26-27 is the high point of creation. Everything else is made “according to its kind,” but humanity is made in God’s image and likeness and given dominion. Man is not a divine being and not merely an advanced animal. He is a creature who represents and resembles God.',
        },
        {
          kind: 'teaching',
          level: 'all',
          title: 'Why it matters',
          body:
            'Genesis 9:6 grounds the sanctity of human life in the image. James 3:9 grounds the way we speak about people in it. The image gives every person, at every stage and ability, a dignity that does not depend on usefulness or achievement.',
        },
        {
          kind: 'teaching',
          level: 'all',
          title: 'What the image includes',
          body:
            'The Westminster Shorter Catechism (Q10) summarizes it as being made male and female, in knowledge, righteousness, and holiness, with dominion over the creatures. Reformed teachers, including Sproul and MacArthur, consistently stress that the image is not one single faculty. It touches the whole person: reason, morality, relationships, creativity, and rule under God.',
        },
        {
          kind: 'teaching',
          level: 'all',
          title: 'Christ, the true image',
          body:
            'Colossians 1:15 and 2 Corinthians 4:4 call Christ the image of God in the fullest sense. Colossians 3:10 and Romans 8:29 teach that believers are being renewed into that image. In salvation, God restores what sin distorted.',
        },
        {
          kind: 'teaching',
          level: 'intermediate',
          title: 'Go deeper: three classic proposals',
          body:
            'Substantive views locate the image in a capacity (often reason or the soul). Relational views locate it in capacity for relationship with God and others. Functional views locate it in our role as God’s rulers and representatives. Most Reformed theologians, following Calvin and later Hoekema and Grudem, treat these as aspects of a single whole rather than rival answers. Ancient Near Eastern kings set up statues (images) to mark authority; Genesis democratizes the idea: every human is God’s image-bearer on earth.',
        },
        {
          kind: 'teaching',
          level: 'advanced',
          title: 'Go deeper: image and likeness',
          body:
            'Roman Catholic theology has historically distinguished image (natural capacities, retained) from likeness (a supernatural gift, lost at the fall). Reformers rejected this, reading “image” and “likeness” (tselem and demut) as Hebrew parallelism for one reality. Genesis 9:6 and James 3:9 affirm the image after the fall.',
        },
        {
          kind: 'distinction',
          biblical:
            'Genesis states that God created mankind in His image and likeness, male and female, with a mandate over the earth; after the flood, murder is forbidden because man is made in God’s image.',
          interpretation:
            'This curriculum teaches a holistic Reformed view: the image involves knowledge, righteousness, holiness, relationship, and stewardly rule — marred by sin but not erased. Dignity is creaturely, not deity.',
          disagreement:
            'Christians debate whether the image is primarily structural, functional, or relational. Some traditions historically split “image” from “likeness.” Those alternatives are described, not taught as the app’s position.',
        },
        {
          kind: 'concept',
          term: 'Imago Dei',
          explanation:
            'Latin for “image of God.” In Abide’s teaching, it names the human status and calling to represent God under His authority — never identity as God.',
        },
        {
          kind: 'attribution',
          teacherId: 'macarthur',
          work: 'Biblical Doctrine',
          note:
            'Organizational emphasis: creation design grounds human worth and moral accountability. Paraphrased theme, not a quotation.',
        },
      ],
      questions: L1,
      reflectionPrompts: [
        'How does believing everyone is an image-bearer change how you treat someone you find difficult?',
        'In what ways do you image God at work or at home?',
      ],
      furtherStudy: [
        'Hoekema, Created in God’s Image (study themes; do not paste copyrighted chapters).',
        'Westminster Shorter Catechism Q1 and Q10.',
        'Spurgeon sermons on man’s creation (public domain; verify titles).',
      ],
    },
    {
      id: 'nature-of-man-body-soul',
      order: 3,
      title: 'Body and Soul',
      estimatedMinutes: 18,
      objectives: {
        beginner: [
          'Explain that humans have a physical body and an inner, immaterial part, and that both are good.',
        ],
        intermediate: [
          'Distinguish biblical dualism from materialism and Gnosticism, and explain the intermediate state.',
        ],
        advanced: [
          'Evaluate the range of meaning of nephesh and psyche and critique monism and soul sleep.',
        ],
      },
      primaryPassages: [
        passage('genesis', 'Genesis', 2, 7, 7),
        passage('matthew', 'Matthew', 10, 28, 28),
        passage('2corinthians', '2 Corinthians', 5, 1, 10),
      ],
      supportingPassages: [
        passage('ecclesiastes', 'Ecclesiastes', 12, 7, 7),
        passage('luke', 'Luke', 23, 43, 43),
        passage('philippians', 'Philippians', 1, 21, 24),
        passage('revelation', 'Revelation', 6, 9, 11),
        passage('1corinthians', '1 Corinthians', 15, 42, 54),
      ],
      content: [
        {
          kind: 'teaching',
          level: 'all',
          title: 'Two parts, one person',
          body:
            'Genesis 2:7 describes God forming man from the dust and breathing life into him. The body is material and from the earth; the inner life comes from God. Scripture never treats the body as a prison. God made it, Christ took one, and believers will be raised in glorified ones.',
        },
        {
          kind: 'teaching',
          level: 'all',
          title: 'Soul and spirit',
          body:
            'Scripture speaks of an inner person that can exist apart from the body. Jesus told the thief that he would be with him in paradise that day (Luke 23:43). Paul says that to be away from the body is to be at home with the Lord (2 Corinthians 5:8) and that departing is far better (Philippians 1:21-24). Jesus warns that men can kill the body but not the soul (Matthew 10:28).',
        },
        {
          kind: 'teaching',
          level: 'all',
          title: 'Not a ghost',
          body:
            'Christianity does not hope for escape from the body. Death is an enemy (1 Corinthians 15:26). The final hope is bodily resurrection. Believers who die are with Christ in a conscious intermediate state and await the resurrection.',
        },
        {
          kind: 'teaching',
          level: 'intermediate',
          title: 'Go deeper: holistic dualism',
          body:
            'Holistic dualism (compare Grudem and Berkhof): the person is a unity of body and soul, and the two are truly distinct. Opposing views: materialist monism (no soul), Platonic dualism (soul is the real self, body lesser), and Gnosticism (matter evil). Soul sleep (unconscious until resurrection) is held by some Christians, but Luke 23:43, Philippians 1:23, and Revelation 6:9-10 are normally read as conscious presence with Christ.',
        },
        {
          kind: 'teaching',
          level: 'advanced',
          title: 'Go deeper: nephesh and psyche',
          body:
            'Nephesh (Hebrew) and psyche (Greek) have a wide range: life, person, desire, the inner self. Genesis 2:7 calls Adam a “living creature” (nephesh chayyah), but the same phrase describes animals. The case for an immaterial soul rests on passages like Matthew 10:28, 2 Corinthians 5, and Revelation 6:9, not on that phrase alone.',
        },
        {
          kind: 'distinction',
          biblical:
            'Genesis presents an embodied creature living by God’s breath. Jesus distinguishes body and soul; Paul speaks of being away from the body and at home with the Lord; resurrection hope is bodily.',
          interpretation:
            'This curriculum teaches dichotomy: unified persons with material and immaterial aspects; conscious intermediate state for believers; final hope of resurrection — not soul sleep, materialism, or body-despising dualism.',
          disagreement:
            'Some Christians teach trichotomy or soul sleep; materialists deny the soul. Those views are noted and answered from Scripture, not caricatured.',
        },
        {
          kind: 'concept',
          term: 'Intermediate state',
          explanation:
            'The condition of the person between death and the bodily resurrection — for the believer, conscious presence with Christ.',
        },
      ],
      questions: L2,
      reflectionPrompts: [
        'How does the Christian hope of bodily resurrection differ from “going to heaven when you die” as most people picture it?',
        'How should believing the body is good shape the way you care for yours?',
      ],
      furtherStudy: [
        'Grudem, Systematic Theology (composition of man — themes).',
        'Cooper, Body, Soul, and Life Everlasting (secondary; dualism defense).',
      ],
      reviewFromLessonIds: ['nature-of-man-image'],
    },
    {
      id: 'nature-of-man-composition',
      order: 4,
      title: 'How Body and Soul Relate',
      estimatedMinutes: 18,
      objectives: {
        beginner: [
          'Describe the idea that a person has a body and an inner life that work together.',
        ],
        intermediate: [
          'Compare dichotomy and trichotomy and give the key texts each side uses.',
        ],
        advanced: [
          'Explain the Apollinarian use of trichotomy and its condemnation at Constantinople (381), and respond to monism.',
        ],
      },
      primaryPassages: [
        passage('matthew', 'Matthew', 10, 28, 28),
        passage('1thessalonians', '1 Thessalonians', 5, 23, 23),
        passage('hebrews', 'Hebrews', 4, 12, 12),
      ],
      supportingPassages: [
        passage('genesis', 'Genesis', 2, 7, 7),
        passage('matthew', 'Matthew', 22, 37, 37),
        passage('luke', 'Luke', 1, 46, 47),
        passage('hebrews', 'Hebrews', 2, 14, 17),
      ],
      content: [
        {
          kind: 'teaching',
          level: 'all',
          title: 'Dichotomy (taught)',
          body:
            'The app teaches dichotomy: man is two parts, a material body and an immaterial soul (also called spirit), and “soul” and “spirit” are often used interchangeably (Genesis 2:7; Matthew 10:28; Luke 1:46-47; 1 Corinthians 5:3-5; Hebrews 12:23). The TMS doctrinal statement does not name dichotomy or trichotomy; it teaches that physical death separates soul and body and that the soul of the redeemed passes at once into Christ’s presence. Trichotomy (body, soul, and spirit as three parts, citing 1 Thessalonians 5:23 and Hebrews 4:12) is held by faithful teachers and is described here as another view. The app finds dichotomy better supported: those texts describe the whole person and do not give an anatomical list. Matthew 22:37 lists heart, soul, and mind to call for loving God with the whole person.',
        },
        {
          kind: 'teaching',
          level: 'intermediate',
          title: 'Go deeper: reading the proof texts',
          body:
            'Hebrews 4:12 says the Word divides soul and spirit — and also joints and marrow. The point is penetration of the whole inner life. Paul’s list in 1 Thessalonians 5:23 is a prayer for total sanctification. Trichotomy is described fairly; the app still teaches dichotomy. The danger is any view that cuts the person so that sanctification is only “spiritual” and not physical or mental.',
        },
        {
          kind: 'teaching',
          level: 'advanced',
          title: 'Go deeper: Apollinarius',
          body:
            'Apollinarius of Laodicea used a trichotomist scheme to claim that Christ had a human body and soul but the divine Logos in place of a human mind or spirit. Constantinople (381) condemned this. Christ took a complete human nature (Hebrews 2:14-17); what He did not assume He did not heal (Gregory of Nazianzus).',
        },
        {
          kind: 'distinction',
          biblical:
            'Scripture speaks of body and soul/spirit, sometimes listing spirit, soul, and body, and calls for loving God with heart, soul, and mind.',
          interpretation:
            'This curriculum prefers dichotomy as the cleaner biblical pattern while insisting on the unity of the person and the full humanity of Christ. Trichotomy is described fairly; Apollinarian misuse is rejected.',
          disagreement:
            'Faithful teachers differ on dichotomy vs trichotomy. The dividing line of orthodoxy is the full incarnation and the goodness of embodied life under God.',
        },
        {
          kind: 'concept',
          term: 'Dichotomy',
          explanation:
            'The view that humans consist of two aspects: material body and immaterial soul/spirit as one person.',
        },
      ],
      questions: L3,
      reflectionPrompts: [
        'Does your view of body and soul affect how you think about sanctification? How?',
        'Why might it matter that Jesus took a complete human nature?',
      ],
      furtherStudy: [
        'Berkhof, Systematic Theology (constitution of man — themes).',
        'Gregory of Nazianzus, Epistle 101 (public-domain translations).',
      ],
      reviewFromLessonIds: ['nature-of-man-image', 'nature-of-man-body-soul'],
    },
    {
      id: 'nature-of-man-purpose',
      order: 5,
      title: 'Human Purpose and Responsibility',
      estimatedMinutes: 18,
      objectives: {
        beginner: [
          'State why God made us and name some of the responsibilities He gave humanity.',
        ],
        intermediate: [
          'Explain the cultural mandate, stewardship, and the role of conscience.',
        ],
        advanced: [
          'Distinguish general from special revelation, common grace, and moral accountability.',
        ],
      },
      primaryPassages: [
        passage('genesis', 'Genesis', 1, 28, 28),
        passage('genesis', 'Genesis', 2, 15, 15),
        passage('1corinthians', '1 Corinthians', 10, 31, 31),
      ],
      supportingPassages: [
        passage('psalms', 'Psalms', 8, 1, 9),
        passage('isaiah', 'Isaiah', 43, 7, 7),
        passage('romans', 'Romans', 2, 14, 15),
        passage('ecclesiastes', 'Ecclesiastes', 12, 13, 14),
        passage('matthew', 'Matthew', 22, 37, 40),
      ],
      content: [
        {
          kind: 'teaching',
          level: 'all',
          title: 'The chief end',
          body:
            'The Westminster Shorter Catechism’s first question answers that man’s chief end is to glorify God and enjoy Him forever. Isaiah 43:7 says God made His people for His glory, and 1 Corinthians 10:31 applies this to ordinary life. MacArthur’s teaching consistently puts God’s glory first; Sproul’s treatment of holiness does the same.',
        },
        {
          kind: 'teaching',
          level: 'all',
          title: 'The mandate',
          body:
            'Genesis 1:28 commands humanity to be fruitful, fill the earth, and rule. Genesis 2:15 shows the right spirit: Adam was to “work and keep” the garden. Dominion is stewardship, not exploitation. Psalm 8 marvels that God entrusts so much to so small a creature.',
        },
        {
          kind: 'teaching',
          level: 'all',
          title: 'Responsibility',
          body:
            'Because we are made in God’s image, we answer to God. Romans 2:14-15 teaches that even those without Scripture have the work of the law written on their hearts. Ecclesiastes 12:13-14 ends with fearing God and facing judgment. Jesus summed up our duty in Matthew 22:37-40.',
        },
        {
          kind: 'teaching',
          level: 'intermediate',
          title: 'Go deeper: cultural mandate and revelation',
          body:
            'The cultural mandate was given before the fall and renewed in Genesis 9:1. The fall makes the work harder but does not cancel it. General revelation (Psalm 19; Romans 1–2) leaves all without excuse but does not save. Special revelation (Scripture and Christ) is needed for salvation. Common grace explains civic good among unbelievers without confusing it with saving grace.',
        },
        {
          kind: 'teaching',
          level: 'advanced',
          title: 'Go deeper: responsibility and ability',
          body:
            'Reformed theology holds that responsibility does not depend on libertarian ability. Human responsibility and God’s sovereignty are both taught (Acts 2:23; Philippians 2:12-13). Edwards’s Freedom of the Will defended this at length — paraphrase only here.',
        },
        {
          kind: 'distinction',
          biblical:
            'Scripture commands humanity to fill and steward the earth, to glorify God in all things, and teaches that conscience and creation leave people accountable to God.',
          interpretation:
            'Purpose is God-centered: glory and enjoyment of God, stewardship, and moral responsibility. Conscience convicts; it does not justify.',
          disagreement:
            'Some treat dominion as exploitation or deny natural-law accountability. Libertarian accounts of free will differ from Reformed compatibilism; alternatives are described, not taught as the app’s position.',
        },
      ],
      questions: L4,
      reflectionPrompts: [
        'What would change in your week if you took “do all to the glory of God” seriously?',
        'Where have you treated work or creation as either an idol or as worthless?',
      ],
      furtherStudy: [
        'Westminster Shorter Catechism Q1.',
        'Sproul, The Holiness of God (themes).',
        'MacArthur, The Battle for the Beginning (themes).',
      ],
      reviewFromLessonIds: ['nature-of-man-image', 'nature-of-man-body-soul'],
    },
    {
      id: 'nature-of-man-sin',
      order: 6,
      title: 'Sin’s Effects on Human Nature',
      estimatedMinutes: 18,
      objectives: {
        beginner: ['Explain what happened at the fall and how it affects everyone.'],
        intermediate: [
          'Define original sin, total depravity, and the distinction between sin imputed and sin inherited.',
        ],
        advanced: [
          'Compare Pelagian, semi-Pelagian, Arminian, and Reformed accounts of sin, and explain the bondage of the will.',
        ],
      },
      primaryPassages: [
        passage('genesis', 'Genesis', 3, 1, 24),
        passage('romans', 'Romans', 5, 12, 21),
        passage('ephesians', 'Ephesians', 2, 1, 5),
      ],
      supportingPassages: [
        passage('psalms', 'Psalms', 51, 5, 5),
        passage('jeremiah', 'Jeremiah', 17, 9, 9),
        passage('john', 'John', 6, 44, 44),
        passage('romans', 'Romans', 3, 10, 23),
        passage('romans', 'Romans', 8, 7, 8),
        passage('colossians', 'Colossians', 3, 10, 10),
      ],
      content: [
        {
          kind: 'teaching',
          level: 'all',
          title: 'The fall',
          body:
            'In Genesis 3, Adam and Eve disobeyed a clear command. Death, shame, broken relationships, a cursed creation, and exile from God’s presence followed. Romans 5:12-21 teaches that sin and death entered through one man, and that through one Man (Christ) righteousness and life come.',
        },
        {
          kind: 'teaching',
          level: 'all',
          title: 'Original sin and total depravity',
          body:
            'Psalm 51:5 and Ephesians 2:3 teach that we are sinners from conception. We sin because we are sinners. Total depravity does not mean everyone is as evil as possible. It means sin touches every part of us: mind, will, affections, and body. Unregenerate people cannot please God (Romans 8:8) or come to Christ unless drawn (John 6:44).',
        },
        {
          kind: 'teaching',
          level: 'all',
          title: 'The image after the fall',
          body:
            'The image is marred but not destroyed (Genesis 9:6; James 3:9). Regeneration and sanctification restore it (Colossians 3:10; 2 Corinthians 3:18).',
        },
        {
          kind: 'teaching',
          level: 'intermediate',
          title: 'Go deeper: imputation',
          body:
            'Imputation (Romans 5:18-19): Adam’s guilt is counted to his descendants as their federal head. Reformed confessions (WCF 6) combine imputed guilt and inherited corruption. Realism and mediate imputation are other historical accounts — described, not taught as rivals to the federal reading here.',
        },
        {
          kind: 'teaching',
          level: 'advanced',
          title: 'Go deeper: Pelagius to the bondage of the will',
          body:
            'Pelagius denied original sin. Semi-Pelagianism said the will initiates faith and grace assists. Arminianism teaches prevenient grace restores ability. The Reformed answer is that regeneration precedes and enables faith (Ezekiel 36:26-27; John 3:3-8; Ephesians 2:4-5). Bondage of the will: people choose according to their desires, and sin corrupts those desires (Luther; Edwards — paraphrase).',
        },
        {
          kind: 'distinction',
          biblical:
            'Genesis narrates the fall; Romans teaches sin and death through Adam and life through Christ; Scripture describes universal sinfulness and inability apart from grace.',
          interpretation:
            'This curriculum teaches original sin (imputed guilt and inherited corruption), total depravity as extensive corruption, and regenerating grace that enables faith — while affirming the image remains.',
          disagreement:
            'Pelagian, semi-Pelagian, and Arminian accounts differ on ability and grace. Those views are described so learners can recognize them; the app teaches the Reformed order of salvation on this point.',
        },
        {
          kind: 'concept',
          term: 'Total depravity',
          explanation:
            'Sin’s corruption of every faculty of the person — not that every person is maximally wicked.',
        },
      ],
      questions: L5,
      reflectionPrompts: [
        'Where do you still tend to minimize sin’s seriousness — or despair of God’s power to renew you?',
        'How does Romans 5’s “one Man” hope reshape how you speak about yourself and others?',
      ],
      furtherStudy: [
        'Sproul, Chosen by God (themes on sin and grace).',
        'Beeke and Smalley, Reformed Systematic Theology vol. 2 (themes).',
        'Westminster Confession of Faith, chapter 6.',
      ],
      reviewFromLessonIds: [
        'nature-of-man-image',
        'nature-of-man-body-soul',
        'nature-of-man-purpose',
      ],
    },
  ],
}
