export type McQuestion = {
  id: string
  type: 'mc'
  prompt: string
  choices: string[]
  /** index into choices */
  answer: number
}

export type OpenQuestion = {
  id: string
  type: 'open'
  prompt: string
  /** soft guidance shown after they answer */
  reflection?: string
}

export type QuizQuestion = McQuestion | OpenQuestion

export type SectionQuiz = {
  id: string
  title: string
  blurb: string
  questions: QuizQuestion[]
}

function mc(
  id: string,
  prompt: string,
  choices: string[],
  answer: number,
): McQuestion {
  return { id, type: 'mc', prompt, choices, answer }
}

function open(id: string, prompt: string, reflection?: string): OpenQuestion {
  return { id, type: 'open', prompt, reflection }
}

/** Quizzes keyed by planId → ordered checkpoints after N reading days */
export const PLAN_QUIZZES: Record<string, { every: number; quizzes: SectionQuiz[] }> = {
  year: {
    every: 30,
    quizzes: [
      {
        id: 'year-1',
        title: 'Month 1 checkpoint',
        blurb: 'Genesis beginnings & early Gospels / NT trail.',
        questions: [
          mc('y1-1', 'In Genesis 1, what does God call His creation repeatedly?', ['Useful', 'Good', 'Finished', 'Mysterious'], 1),
          mc('y1-2', 'What does the serpent tempt Eve to doubt in Genesis 3?', ["God's goodness and word", 'Noah’s ark', 'Abraham’s promise', 'Joseph’s dreams'], 0),
          open('y1-3', 'What stood out to you about God’s character in this stretch of reading?', 'Thank Him for one trait you noticed.'),
          mc('y1-4', 'The New Testament opens by presenting Jesus as…', ['Only a teacher', 'Messiah and Son of God', 'A Roman citizen', 'An Old Testament prophet only'], 1),
        ],
      },
      {
        id: 'year-2',
        title: 'Month 2 checkpoint',
        blurb: 'Patriarchs, Exodus themes, and the life of Jesus.',
        questions: [
          mc('y2-1', 'What does God remember in the Exodus story?', ['Egypt’s power', 'His covenant with Abraham’s family', 'Only Moses’ staff', 'The golden calf first'], 1),
          open('y2-2', 'Where did you see God rescue or provide in these chapters?'),
          mc('y2-3', 'Jesus often taught using…', ['Parables', 'Roman law codes', 'Temple tax receipts', 'Census records'], 0),
          open('y2-4', 'What is one way these readings invite you to trust God this week?'),
        ],
      },
      {
        id: 'year-3',
        title: 'Month 3 checkpoint',
        blurb: 'Law, wilderness, and growing discipleship.',
        questions: [
          mc('y3-1', 'The heart of the law points people toward…', ['Self-reliance', 'Love of God and neighbor', 'Wealth', 'Political power'], 1),
          open('y3-2', 'What wilderness moment (literal or figurative) resonated with you?'),
          mc('y3-3', 'Disciples of Jesus are called to…', ['Follow Him', 'Replace the law with nothing', 'Avoid all community', 'Seek status first'], 0),
          open('y3-4', 'Write one sentence summarizing what you want to remember from this section.'),
        ],
      },
    ],
  },
  gospels: {
    every: 22,
    quizzes: [
      {
        id: 'g-matt',
        title: 'Matthew section',
        blurb: 'Kingship, teaching, and the call to follow.',
        questions: [
          mc('gm-1', 'Matthew especially presents Jesus as…', ['The promised King / Messiah', 'A Pharisee', 'Caesar’s ally', 'Only a healer'], 0),
          mc('gm-2', 'The Sermon on the Mount begins with the…', ['Beatitudes', 'Ten Commandments', 'Lord’s Prayer only', 'Great Commission'], 0),
          open('gm-3', 'Which teaching of Jesus challenged you most, and why?'),
          open('gm-4', 'How might you “seek first the kingdom” in a concrete way this week?'),
        ],
      },
      {
        id: 'g-mark',
        title: 'Mark section',
        blurb: 'Action, authority, and the suffering Servant.',
        questions: [
          mc('gk-1', 'Mark’s Gospel moves with a sense of…', ['Urgency (“immediately”)', 'Slow genealogy lists', 'Temple architecture detail', 'Roman poetry'], 0),
          open('gk-2', 'Where do you see Jesus’ authority on display in Mark?'),
          mc('gk-3', 'Jesus says He came not to be served but to…', ['Be served by angels', 'Serve and give His life', 'Rule Rome', 'Avoid the cross'], 1),
          open('gk-4', 'What does following a suffering Savior mean for you right now?'),
        ],
      },
      {
        id: 'g-luke',
        title: 'Luke section',
        blurb: 'Compassion, outsiders, and joyful news.',
        questions: [
          mc('gl-1', 'Luke highlights Jesus’ care for…', ['Only religious elites', 'The lost, poor, and outsiders', 'Roman officials alone', 'Temple traders'], 1),
          open('gl-2', 'Which parable or story of mercy stuck with you?'),
          mc('gl-3', 'The “lost” chapter of Luke (15) includes the lost sheep, coin, and…', ['Lost son', 'Lost temple', 'Lost scroll', 'Lost city'], 0),
          open('gl-4', 'Who might God be inviting you to notice or welcome?'),
        ],
      },
      {
        id: 'g-john',
        title: 'John section',
        blurb: 'Signs, “I am” claims, and believing life.',
        questions: [
          mc('gj-1', 'John writes so that readers may…', ['Believe Jesus is the Christ and have life', 'Build a synagogue', 'Memorize Rome’s laws', 'Avoid the Spirit'], 0),
          mc('gj-2', '“I am the way, and the truth, and the life” is spoken by…', ['Peter', 'Jesus', 'John the Baptist', 'Nicodemus'], 1),
          open('gj-3', 'Which “I am” statement of Jesus means the most to you currently?'),
          open('gj-4', 'How does believing Jesus change how you face today?'),
        ],
      },
    ],
  },
  psalms30: {
    every: 7,
    quizzes: [
      {
        id: 'ps-1',
        title: 'Psalms week 1',
        blurb: 'Honest prayer — praise, lament, trust.',
        questions: [
          mc('p1-1', 'Psalms teach us we can bring God…', ['Only polished praise', 'The full range of human emotion', 'Only national concerns', 'Silent thoughts only'], 1),
          open('p1-2', 'Which psalm felt like it put words to your own heart?'),
          open('p1-3', 'Write a one-sentence prayer inspired by what you read.'),
        ],
      },
      {
        id: 'ps-2',
        title: 'Psalms week 2',
        blurb: 'Trust when circumstances shake.',
        questions: [
          mc('p2-1', 'A repeated refuge image in the Psalms is God as…', ['A rock / fortress', 'A merchant', 'A census taker', 'A distant star only'], 0),
          open('p2-2', 'What fear or hope did you hand to God this week?'),
          open('p2-3', 'How will you remember God’s faithfulness today?'),
        ],
      },
      {
        id: 'ps-3',
        title: 'Psalms week 3',
        blurb: 'Worship and wisdom for the path.',
        questions: [
          mc('p3-1', 'Psalm 1 contrasts the way of the righteous with the way of…', ['The wealthy', 'The wicked / scoffers', 'The priests', 'The kings only'], 1),
          open('p3-2', 'What habit of “delighting in the law of the Lord” could you practice?'),
          open('p3-3', 'Praise God for one attribute you saw in these psalms.'),
        ],
      },
      {
        id: 'ps-4',
        title: 'Psalms week 4',
        blurb: 'Culmination — steadfast love forever.',
        questions: [
          mc('p4-1', 'Many psalms end by turning lament into…', ['Trust and praise', 'Silence forever', 'Revenge plans', 'Census lists'], 0),
          open('p4-2', 'What line from the Psalms do you want to carry into next month?'),
          open('p4-3', 'How has praying the Psalms changed your conversations with God?'),
        ],
      },
    ],
  },
  nt90: {
    every: 14,
    quizzes: [
      {
        id: 'nt-1',
        title: 'Gospels & Acts',
        blurb: 'Jesus’ mission and the Spirit-empowered church.',
        questions: [
          mc('n1-1', 'Acts shows the gospel spreading by the power of…', ['The Holy Spirit', 'Roman armies', 'Temple taxes', 'Silent monks only'], 0),
          open('n1-2', 'Where did you see courage or boldness in these books?'),
          open('n1-3', 'What is one step of obedience this section invites?'),
        ],
      },
      {
        id: 'nt-2',
        title: 'Paul’s letters',
        blurb: 'Grace, faith, and life in Christ.',
        questions: [
          mc('n2-1', 'Paul emphasizes salvation as a gift of…', ['Grace through faith', 'Perfect law-keeping', 'Family heritage', 'Temple sacrifice alone'], 0),
          open('n2-2', 'Which gospel truth in these letters refreshed you?'),
          open('n2-3', 'How might “life in the Spirit” look in your relationships?'),
        ],
      },
      {
        id: 'nt-3',
        title: 'General letters & Revelation',
        blurb: 'Perseverance, love, and living hope.',
        questions: [
          mc('n3-1', 'Revelation ultimately centers on…', ['The victory of the Lamb', 'Predicting every modern headline', 'Avoiding worship', 'Building Babel'], 0),
          open('n3-2', 'What hope from the end of the story strengthens you now?'),
          open('n3-3', 'Write a short prayer of perseverance based on what you read.'),
        ],
      },
    ],
  },
  proverbs31: {
    every: 7,
    quizzes: [
      {
        id: 'pr-1',
        title: 'Wisdom week 1',
        blurb: 'The fear of the Lord is the beginning of knowledge.',
        questions: [
          mc('r1-1', 'Proverbs says wisdom begins with…', ['The fear of the Lord', 'Wealth', 'Clever speech', 'Avoiding people'], 0),
          open('r1-2', 'Which proverb do you want to practice this week?'),
          open('r1-3', 'Where do you need God’s wisdom in a decision right now?'),
        ],
      },
      {
        id: 'pr-2',
        title: 'Wisdom week 2',
        blurb: 'Speech, diligence, and integrity.',
        questions: [
          mc('r2-1', 'Proverbs often warns about…', ['Careless words', 'Too much sleep only', 'Building temples', 'Roman politics'], 0),
          open('r2-2', 'How will you guard your tongue or your work habits this week?'),
          open('r2-3', 'Thank God for one wise example in your life.'),
        ],
      },
      {
        id: 'pr-3',
        title: 'Wisdom week 3',
        blurb: 'Relationships and humility.',
        questions: [
          mc('r3-1', 'Pride in Proverbs leads toward…', ['Fall / ruin', 'Guaranteed riches', 'Temple service', 'Long life automatically'], 0),
          open('r2-4', 'Where is God inviting humility in your life?'),
          open('r2-5', 'What relationship wisdom from Proverbs will you apply?'),
        ],
      },
      {
        id: 'pr-4',
        title: 'Wisdom week 4+',
        blurb: 'A life shaped by wise fear of the Lord.',
        questions: [
          mc('r4-1', 'The “excellent wife” passage (Prov 31) celebrates…', ['Fear of the Lord lived out in love and work', 'Luxury alone', 'Silence only', 'Avoiding all commerce'], 0),
          open('r4-2', 'Summarize one lifelong wisdom lesson from this month.'),
          open('r4-3', 'How will you keep seeking wisdom after this plan?'),
        ],
      },
    ],
  },
}

export function quizForCheckpoint(planId: string, checkpointIndex: number): SectionQuiz | null {
  const pack = PLAN_QUIZZES[planId]
  if (!pack?.quizzes.length) return null
  return pack.quizzes[Math.min(checkpointIndex, pack.quizzes.length - 1)] ?? null
}
