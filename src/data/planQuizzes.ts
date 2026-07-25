export type McQuestion = {
  id: string
  type: 'mc'
  prompt: string
  choices: string[]
  answer: number
}

export type OpenQuestion = {
  id: string
  type: 'open'
  prompt: string
  reflection?: string
}

export type QuizQuestion = McQuestion | OpenQuestion

export type SectionQuiz = {
  id: string
  title: string
  blurb: string
  questions: QuizQuestion[]
  askCount?: number
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

/** Quizzes keyed by planId → checkpoints after every N reading days */
export const PLAN_QUIZZES: Record<string, { every: number; quizzes: SectionQuiz[] }> = {
  year: {
    every: 30,
    quizzes: [
      {
        id: 'year-1',
        title: 'Month 1 checkpoint',
        blurb: 'Genesis beginnings & early Gospels / NT trail.',
        askCount: 4,
        questions: [
          mc('y1-1', 'In Genesis 1, what does God call His creation repeatedly?', ['Useful', 'Good', 'Finished', 'Mysterious'], 1),
          mc('y1-2', 'What does the serpent tempt Eve to doubt in Genesis 3?', ["God's goodness and word", "Noah's ark", "Abraham's promise", "Joseph's dreams"], 0),
          open('y1-3', "What stood out to you about God's character in this stretch of reading?", 'Thank Him for one trait you noticed.'),
          mc('y1-4', 'The New Testament opens by presenting Jesus as…', ['Only a teacher', 'Messiah and Son of God', 'A Roman citizen', 'An Old Testament prophet only'], 1),
          mc('y1-5', 'In the creation account, humans are made…', ["In God's image", 'As accidents of nature', 'Equal to angels in rank', 'Without purpose'], 0),
          mc('y1-6', 'After the fall, God still pursues Adam and Eve by…', ['Abandoning them forever', 'Seeking them and speaking promise', 'Erasing Eden from memory', 'Giving them a census'], 1),
          open('y1-7', "Where did you see both human failure and God's mercy in these readings?"),
          open('y1-8', "What is one truth from this month's path you want to remember?"),
        ],
      },
      {
        id: 'year-2',
        title: 'Month 2 checkpoint',
        blurb: 'Patriarchs, Exodus themes, and the life of Jesus.',
        askCount: 4,
        questions: [
          mc('y2-1', 'What does God remember in the Exodus story?', ["Egypt's power", "His covenant with Abraham's family", "Only Moses' staff", 'The golden calf first'], 1),
          open('y2-2', 'Where did you see God rescue or provide in these chapters?'),
          mc('y2-3', 'Jesus often taught using…', ['Parables', 'Roman law codes', 'Temple tax receipts', 'Census records'], 0),
          open('y2-4', 'What is one way these readings invite you to trust God this week?'),
          mc('y2-5', "God's name revealed to Moses emphasizes that He is…", ['The self-existent "I AM"', 'A tribal mascot only', 'Bound to Pharaoh', 'Uninvolved in history'], 0),
          mc('y2-6', "In the Gospels, Jesus' miracles primarily point to…", ['Entertainment', 'His kingdom authority and compassion', 'Roman politics', 'Temple fundraising'], 1),
          open('y2-7', 'Which person in these chapters (OT or NT) challenged your faith most?'),
          open('y2-8', 'Summarize this stretch in one line: what is God doing?'),
        ],
      },
      {
        id: 'year-3',
        title: 'Month 3 checkpoint',
        blurb: 'Law, wilderness, and growing discipleship.',
        askCount: 4,
        questions: [
          mc('y3-1', 'The heart of the law points people toward…', ['Self-reliance', 'Love of God and neighbor', 'Wealth', 'Political power'], 1),
          open('y3-2', 'What wilderness moment (literal or figurative) resonated with you?'),
          mc('y3-3', 'Disciples of Jesus are called to…', ['Follow Him', 'Replace the law with nothing', 'Avoid all community', 'Seek status first'], 0),
          open('y3-4', 'Write one sentence summarizing what you want to remember from this section.'),
          mc('y3-5', "Israel's wilderness journey teaches dependence on…", ["Egypt's leftovers", "God's daily provision", 'Military alliances alone', 'Human kings first'], 1),
          open('y3-6', 'What command or teaching from this stretch do you most need to obey?'),
          mc('y3-7', 'Jesus\' call "follow me" means…', ['Admire from a distance', 'A whole-life discipleship', 'Weekend religion only', 'Private belief with no cost'], 1),
          open('y3-8', "How has this month's reading reshaped your view of God?"),
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
        askCount: 4,
        questions: [
          mc('gm-1', 'Matthew especially presents Jesus as…', ['The promised King / Messiah', 'A Pharisee', "Caesar's ally", 'Only a healer'], 0),
          mc('gm-2', 'The Sermon on the Mount begins with the…', ['Beatitudes', 'Ten Commandments', "Lord's Prayer only", 'Great Commission'], 0),
          open('gm-3', 'Which teaching of Jesus challenged you most, and why?'),
          open('gm-4', 'How might you "seek first the kingdom" in a concrete way this week?'),
          mc('gm-5', 'The Great Commission sends disciples to…', ['Stay only in Galilee', 'Make disciples of all nations', 'Build a political party', 'Avoid baptism'], 1),
          mc('gm-6', 'In Matthew, Jesus fulfills…', ['Roman mythology', 'Old Testament promises', 'Census quotas', 'Temple tourism'], 1),
          open('gm-7', 'Where did you see the kingdom breaking into ordinary life in Matthew?'),
          open('gm-8', 'What "first step" of obedience will you take from Matthew?'),
        ],
      },
      {
        id: 'g-mark',
        title: 'Mark section',
        blurb: 'Action, authority, and the suffering Servant.',
        askCount: 4,
        questions: [
          mc('gk-1', "Mark's Gospel moves with a sense of…", ['Urgency ("immediately")', 'Slow genealogy lists', 'Temple architecture detail', 'Roman poetry'], 0),
          open('gk-2', "Where do you see Jesus' authority on display in Mark?"),
          mc('gk-3', 'Jesus says He came not to be served but to…', ['Be served by angels', 'Serve and give His life', 'Rule Rome', 'Avoid the cross'], 1),
          open('gk-4', 'What does following a suffering Savior mean for you right now?'),
          mc('gk-5', 'In Mark, the cross reveals Jesus as the…', ['Political revolutionary only', 'Suffering Servant-King', 'Failed prophet', 'Temple tourist'], 1),
          open('gk-6', 'Where is Jesus calling you to follow Him into costly love?'),
          open('gk-7', 'What "immediately" step of faith can you take today?'),
          mc('gk-8', "Mark's audience is urged to see Jesus' power and…", ['His path through suffering', 'Escape from all pain', 'Alliance with Herod', 'Silence about the kingdom'], 0),
        ],
      },
      {
        id: 'g-luke',
        title: 'Luke section',
        blurb: 'Compassion, outsiders, and joyful news.',
        askCount: 4,
        questions: [
          mc('gl-1', "Luke highlights Jesus' care for…", ['Only religious elites', 'The lost, poor, and outsiders', 'Roman officials alone', 'Temple traders'], 1),
          open('gl-2', 'Which parable or story of mercy stuck with you?'),
          mc('gl-3', 'The "lost" chapter of Luke (15) includes the lost sheep, coin, and…', ['Lost son', 'Lost temple', 'Lost scroll', 'Lost city'], 0),
          open('gl-4', 'Who might God be inviting you to notice or welcome?'),
          mc('gl-5', "Luke's Gospel begins with…", ['Joyful announcement and promise', 'A Roman tax revolt', "Paul's shipwreck", 'The fall of Jerusalem only'], 0),
          open('gl-6', "How does Jesus' compassion in Luke reshape how you see someone?"),
          open('gl-7', 'What "good news of great joy" do you need to believe again?'),
          mc('gl-8', "The Spirit's work in Luke–Acts emphasizes…", ['Power for witness and welcome', 'Private mysticism only', 'Temple construction', 'Avoiding prayer'], 0),
        ],
      },
      {
        id: 'g-john',
        title: 'John section',
        blurb: 'Signs, "I am" claims, and believing life.',
        askCount: 4,
        questions: [
          mc('gj-1', 'John writes so that readers may…', ['Believe Jesus is the Christ and have life', 'Build a synagogue', "Memorize Rome's laws", 'Avoid the Spirit'], 0),
          mc('gj-2', '"I am the way, and the truth, and the life" is spoken by…', ['Peter', 'Jesus', 'John the Baptist', 'Nicodemus'], 1),
          open('gj-3', 'Which "I am" statement of Jesus means the most to you currently?'),
          open('gj-4', 'How does believing Jesus change how you face today?'),
          mc('gj-5', 'In John 3, Jesus tells Nicodemus he must be…', ['Born again / from above', 'A Pharisee leader', 'Silent forever', 'A temple guard'], 0),
          mc('gj-6', 'John\'s "signs" are meant to lead to…', ['Belief in Jesus', 'Magic entertainment', 'Political revolt', 'Avoiding the cross'], 0),
          open('gj-7', 'Where is Jesus inviting you to abide in Him this week?'),
          open('gj-8', 'What does "life in His name" look like in your ordinary schedule?'),
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
        askCount: 3,
        questions: [
          mc('p1-1', 'Psalms teach us we can bring God…', ['Only polished praise', 'The full range of human emotion', 'Only national concerns', 'Silent thoughts only'], 1),
          open('p1-2', 'Which psalm felt like it put words to your own heart?'),
          open('p1-3', 'Write a one-sentence prayer inspired by what you read.'),
          mc('p1-4', 'Lament psalms show that faith can include…', ['Honest sorrow before God', 'Only cheerfulness', 'Silence forever', 'Accusing God without hope'], 0),
          open('p1-5', 'Which emotion in these psalms matches your week?'),
        ],
      },
      {
        id: 'ps-2',
        title: 'Psalms week 2',
        blurb: 'Trust when circumstances shake.',
        askCount: 3,
        questions: [
          mc('p2-1', 'A repeated refuge image in the Psalms is God as…', ['A rock / fortress', 'A merchant', 'A census taker', 'A distant star only'], 0),
          open('p2-2', 'What fear or hope did you hand to God this week?'),
          open('p2-3', "How will you remember God's faithfulness today?"),
          mc('p2-4', 'When the psalmist is afraid, he often…', ['Runs to God as refuge', 'Gives up praying', 'Trusts idols', 'Hides the problem'], 0),
          open('p2-5', 'What would "taking refuge" look like for you today?'),
        ],
      },
      {
        id: 'ps-3',
        title: 'Psalms week 3',
        blurb: 'Worship and wisdom for the path.',
        askCount: 3,
        questions: [
          mc('p3-1', 'Psalm 1 contrasts the way of the righteous with the way of…', ['The wealthy', 'The wicked / scoffers', 'The priests', 'The kings only'], 1),
          open('p3-2', 'What habit of "delighting in the law of the Lord" could you practice?'),
          open('p3-3', 'Praise God for one attribute you saw in these psalms.'),
          mc('p3-4', "Wisdom psalms urge God's people to…", ['Walk in His ways with joy', 'Ignore Scripture', 'Trust wealth first', 'Avoid worship'], 0),
          open('p3-5', 'Which line of praise do you want to carry into tomorrow?'),
        ],
      },
      {
        id: 'ps-4',
        title: 'Psalms week 4',
        blurb: 'Culmination — steadfast love forever.',
        askCount: 3,
        questions: [
          mc('p4-1', 'Many psalms end by turning lament into…', ['Trust and praise', 'Silence forever', 'Revenge plans', 'Census lists'], 0),
          open('p4-2', 'What line from the Psalms do you want to carry into next month?'),
          open('p4-3', 'How has praying the Psalms changed your conversations with God?'),
          mc('p4-4', '"His steadfast love endures forever" emphasizes God\'s…', ['Loyal covenant love', 'Temporary mood', 'Distance from us', 'Need for our help'], 0),
          open('p4-5', "Write one sentence of thanks from this week's psalms."),
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
        blurb: "Jesus' mission and the Spirit-empowered church.",
        askCount: 3,
        questions: [
          mc('n1-1', 'Acts shows the gospel spreading by the power of…', ['The Holy Spirit', 'Roman armies', 'Temple taxes', 'Silent monks only'], 0),
          open('n1-2', 'Where did you see courage or boldness in these books?'),
          open('n1-3', 'What is one step of obedience this section invites?'),
          mc('n1-4', 'The early church devoted themselves to…', ['Teaching, fellowship, breaking bread, and prayer', 'Temple politics only', 'Avoiding outsiders', 'Silent retreat forever'], 0),
          open('n1-5', 'How is the Spirit prompting your witness this week?'),
        ],
      },
      {
        id: 'nt-2',
        title: "Paul's letters",
        blurb: 'Grace, faith, and life in Christ.',
        askCount: 3,
        questions: [
          mc('n2-1', 'Paul emphasizes salvation as a gift of…', ['Grace through faith', 'Perfect law-keeping', 'Family heritage', 'Temple sacrifice alone'], 0),
          open('n2-2', 'Which gospel truth in these letters refreshed you?'),
          open('n2-3', 'How might "life in the Spirit" look in your relationships?'),
          mc('n2-4', 'Union with Christ means believers are…', ['New creations in Him', 'Still under condemnation', 'Saved by pedigree', 'Free from all community'], 0),
          open('n2-5', 'What grace-fueled change do you want to pursue?'),
        ],
      },
      {
        id: 'nt-3',
        title: 'General letters & Revelation',
        blurb: 'Perseverance, love, and living hope.',
        askCount: 3,
        questions: [
          mc('n3-1', 'Revelation ultimately centers on…', ['The victory of the Lamb', 'Predicting every modern headline', 'Avoiding worship', 'Building Babel'], 0),
          open('n3-2', 'What hope from the end of the story strengthens you now?'),
          open('n3-3', 'Write a short prayer of perseverance based on what you read.'),
          mc('n3-4', 'James stresses that living faith is shown by…', ['Works of love and obedience', 'Words alone', 'Wealth', 'Avoiding trials'], 0),
          open('n3-5', 'How will you endure with hope this week?'),
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
        askCount: 3,
        questions: [
          mc('r1-1', 'Proverbs says wisdom begins with…', ['The fear of the Lord', 'Wealth', 'Clever speech', 'Avoiding people'], 0),
          open('r1-2', 'Which proverb do you want to practice this week?'),
          open('r1-3', "Where do you need God's wisdom in a decision right now?"),
          mc('r1-4', 'Fools in Proverbs typically…', ['Despise wisdom and instruction', 'Seek counsel eagerly', 'Fear the Lord', 'Guard their words'], 0),
          open('r1-5', 'What wise habit will you start today?'),
        ],
      },
      {
        id: 'pr-2',
        title: 'Wisdom week 2',
        blurb: 'Speech, diligence, and integrity.',
        askCount: 3,
        questions: [
          mc('r2-1', 'Proverbs often warns about…', ['Careless words', 'Too much sleep only', 'Building temples', 'Roman politics'], 0),
          open('r2-2', 'How will you guard your tongue or your work habits this week?'),
          open('r2-3', 'Thank God for one wise example in your life.'),
          mc('r2-4', 'Diligence in Proverbs is contrasted with…', ['Sluggard laziness', 'Quiet prayer', 'Temple worship', 'Generous giving'], 0),
          open('r2-5', 'Where do you need integrity more than image?'),
        ],
      },
      {
        id: 'pr-3',
        title: 'Wisdom week 3',
        blurb: 'Relationships and the heart.',
        askCount: 3,
        questions: [
          mc('r3-1', 'Proverbs values friends who…', ['Speak truth in love', 'Only flatter', 'Avoid hard talks', 'Seek quarrel'], 0),
          open('r3-2', 'Which relationship needs wiser love from you?'),
          open('r3-3', 'Ask God for one change of heart this week.'),
          mc('r3-4', 'Pride in Proverbs leads toward…', ['Fall and folly', 'True honor', 'Lasting peace', 'Deeper wisdom'], 0),
          open('r3-5', 'How will humility show up in your next conversation?'),
        ],
      },
      {
        id: 'pr-4',
        title: 'Wisdom week 4',
        blurb: 'A life that fears the Lord.',
        askCount: 3,
        questions: [
          mc('r4-1', 'The "excellent wife" passage celebrates…', ['Fear of the Lord and faithful work', 'Fashion only', 'Silence forever', 'Wealth without character'], 0),
          open('r4-2', 'What wise pattern from Proverbs do you want to keep next month?'),
          open('r4-3', 'Praise God for one area He is growing you.'),
          mc('r4-4', 'True beauty in Proverbs is rooted in…', ['The fear of the Lord', 'Appearances alone', 'Status', 'Clever arguments'], 0),
          open('r4-5', 'Write one proverb-shaped prayer for your household or friendships.'),
        ],
      },
    ],
  },
}
