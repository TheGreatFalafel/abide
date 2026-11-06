import type { CurriculumTopic } from '../types'
import { SOURCE_FRAME_SUP, SOURCE_SPROUL_EVANG } from '../evangelismSources'
import { mc, passage } from './_helpers'

const ans = (letter: string) => ({ A: 0, B: 1, C: 2, D: 3 }[letter]!)
const Q = (
  id: string,
  prompt: string,
  choices: string[],
  letter: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  exp?: string,
) => mc(id, prompt, choices, ans(letter), exp, difficulty)

const BEGINNER = [
  Q('en-b1', 'What is the ultimate reality in Hinduism?', ['Jehovah', 'Allah', 'Brahman', 'Nirvana'], 'C', 'beginner'),
  Q('en-b2', 'Who founded Buddhism?', ['Siddhartha Gautama', 'Muhammad', 'Confucius', 'Krishna'], 'A', 'beginner'),
  Q('en-b3', 'Karma is the idea that:', ['Actions have consequences across lifetimes', 'God forgives all', 'Matter is evil', 'Faith saves'], 'A', 'beginner'),
  Q('en-b4', 'Which verse says people die once and then face judgment?', ['Hebrews 9:27', 'John 1:1', 'Genesis 2:7', 'Romans 8:1'], 'A', 'beginner'),
  Q('en-b5', 'Genesis 1:1 teaches that God is:', ['A personal Creator distinct from creation', 'The universe itself', 'An impersonal force', 'Many gods'], 'A', 'beginner'),
  Q('en-b6', 'In Buddhism, "nirvana" is:', ['Heaven', 'Release from the cycle of rebirth and suffering', 'A god', 'A holiday'], 'B', 'beginner'),
  Q('en-b7', 'Which verse says Jesus is the only way to the Father?', ['John 14:6', 'John 3:16', 'Psalm 23', 'Romans 3:23'], 'A', 'beginner'),
  Q('en-b8', 'What lie did the serpent tell in Genesis 3:5?', ['"You will be like God"', '"You will not die" only', '"God does not exist"', '"Eat the fruit of life"'], 'A', 'beginner'),
]

const INTERMEDIATE = [
  Q('en-i1', 'The Four Noble Truths concern:', ['Suffering, its cause, its end, and the path to end it', 'Four gods', 'Four laws', 'Four rivers'], 'A', 'intermediate'),
  Q('en-i2', 'Which is a Hindu scripture?', ['The Bhagavad Gita', 'The Dhammapada', 'The Quran', 'The Book of Mormon'], 'A', 'intermediate'),
  Q('en-i3', '*Samsara* is:', ['The cycle of birth, death, and rebirth', 'A god', 'A prayer', 'A pilgrimage'], 'A', 'intermediate'),
  Q('en-i4', '*Moksha* is:', ['Liberation from the cycle of rebirth', 'A festival', 'A caste', 'A sin'], 'A', 'intermediate'),
  Q('en-i5', 'What do Theravada Buddhists teach about a creator god?', ['They do not teach one', 'They worship Jehovah', 'They worship Brahma as creator', 'They worship Allah'], 'A', 'intermediate'),
  Q('en-i6', 'In Acts 17:24-29, Paul tells the Athenians:', ['God made the world and does not live in temples, and we are His offspring', 'Zeus is Lord', 'The Torah is law', 'Nothing about God'], 'A', 'intermediate'),
  Q('en-i7', 'Which verse best contrasts grace with self-effort?', ['Ephesians 2:8-9', 'Genesis 1:1', 'Psalm 100', 'Jude 1'], 'A', 'intermediate'),
  Q('en-i8', 'Who founded Theosophy (1875), a root of the New Age?', ['Helena Blavatsky', 'Joseph Smith', 'Charles Russell', 'Mary Baker Eddy'], 'A', 'intermediate'),
  Q('en-i9', 'Deuteronomy 18:10-12 forbids:', ['Divination, sorcery, and consulting mediums', 'Eating pork', 'Praying', 'Farming'], 'A', 'intermediate'),
]

const ADVANCED = [
  Q('en-a1', 'Advaita Vedanta (Shankara) teaches:', ['Ultimate reality is non-dual, and the self is identical with Brahman', 'God is separate from creation', 'Creation is good', 'Sin is rebellion'], 'A', 'advanced', 'The Creator-creature distinction answers it.'),
  Q('en-a2', 'The Buddhist doctrine of *anatta* denies:', ['A permanent self', 'Suffering', 'Rebirth', 'Karma'], 'A', 'advanced', "Scripture teaches persons made in God's image."),
  Q('en-a3', 'What does karma lack that the gospel offers?', ['Forgiveness through a substitute', 'Justice', 'Consequences', 'Morality'], 'A', 'advanced'),
  Q('en-a4', '"All religions lead to the same God" is answered by:', ['Acts 4:12 and the law of non-contradiction', 'Genesis 1', 'Psalm 1', 'Jude 1'], 'A', 'advanced'),
  Q('en-a5', 'The Mahayana *bodhisattva* ideal compares with Christ as mediator in that:', ['1 Timothy 2:5 teaches only one mediator, who has fully accomplished salvation', 'Many mediators are needed', 'Christ is a bodhisattva', 'Christ failed'], 'A', 'advanced'),
  Q('en-a6', 'How does Scripture treat suffering differently from Buddhism?', ['It traces it to the fall and promises its end, not an illusion to escape (Romans 8:18-23; Revelation 21:4)', 'It denies suffering', 'It says suffering is desire', 'It is silent'], 'A', 'advanced'),
  Q('en-a7', 'Colossians 2:8 warns about:', ['"Philosophy and empty deceit" according to human tradition', 'Praying', 'Fasting', 'Baptism'], 'A', 'advanced'),
  Q('en-a8', 'New Age claims of secret knowledge resemble:', ['Gnosticism, which John addresses (1 John 4:1-3)', 'Nicene theology', 'The Reformation', 'Judaism'], 'A', 'advanced'),
]

export const EASTERN_RELIGIONS_NEW_AGE: CurriculumTopic = {
  id: 'eastern-religions-new-age',
  title: 'Hinduism, Buddhism, and the New Age',
  description:
    'Survey Hindu, Buddhist, and New Age accounts of reality, sin, and salvation — with biblical responses on karma, monism, exclusivity of Christ, and respectful engagement.',
  objectives: [
    'Explain how Eastern systems differ from Christianity on God, self, and salvation.',
    'Define karma, samsara, nirvana, and moksha and respond with Scripture.',
    'Address monism, pantheism, and religious pluralism fairly.',
    'Use Paul’s approach in Acts 17 with gospel clarity.',
  ],
  estimatedMinutes: 75,
  prerequisites: ['gospel-foundations'],
  framework: 'reformed',
  domain: 'evangelism-apologetics',
  contentStatus: 'full',
  version: 1,
  sources: [
    { ...SOURCE_FRAME_SUP, note: 'Worldview analysis and Creator-creature distinction — themes only.' },
    { ...SOURCE_SPROUL_EVANG, note: 'Christ’s exclusivity — paraphrase only.' },
  ],
  lessons: [
    {
      id: 'en-hindu-buddhist-origins',
      order: 1,
      title: 'Hindu and Buddhist Origins',
      estimatedMinutes: 25,
      objectives: [
        'Introduce Vedas, Brahman, karma, and samsara.',
        'Summarize Four Noble Truths and Eightfold Path.',
        'Avoid treating all Eastern traditions as identical.',
      ],
      primaryPassages: [passage('genesis', 'Genesis', 1, 1, 1)],
      supportingPassages: [passage('hebrews', 'Hebrews', 9, 27, 27)],
      content: [
        {
          kind: 'teaching',
          title: 'Hinduism',
          body:
            'Hinduism has no single founder. Texts include the Vedas, Upanishads, and *Bhagavad Gita*. Teachings include Brahman (ultimate reality), atman (self), karma, samsara (rebirth cycle), and moksha (liberation). Many gods and paths appear within Hindu diversity.',
        },
        {
          kind: 'teaching',
          title: 'Buddhism',
          body:
            'Siddhartha Gautama taught Four Noble Truths (suffering, craving as cause, cessation, path) and the Eightfold Path toward nirvana. Branches include Theravada, Mahayana, and Vajrayana. Theravada often does not teach a creator God.',
        },
        {
          kind: 'distinction',
          biblical: 'Genesis 1:1 teaches a personal Creator; Hebrews 9:27 teaches one death then judgment.',
          interpretation: 'Christianity denies endless rebirth and self-salvation by works alone.',
          disagreement: 'Western “spiritual but not religious” blends differ from village Hinduism or monastic Buddhism — listen first.',
        },
        { kind: 'attribution', teacherId: 'frame', work: 'Apologetics writings (themes)', note: 'Worldview comparison — paraphrase only.' },
      ],
      questions: BEGINNER,
      reflectionPrompts: ['Ask God for respect toward cultural and family ties your friends hold.'],
      furtherStudy: ['Read Acts 17:22–31 outline in your Bible.'],
    },
    {
      id: 'en-beliefs-response',
      order: 2,
      title: 'Beliefs and Biblical Response',
      estimatedMinutes: 25,
      objectives: [
        'Contrast karma with forgiveness in Christ.',
        'Explain New Age monism and occult warnings.',
        'Use Ephesians 2 and Acts 17 in response.',
      ],
      primaryPassages: [passage('ephesians', 'Ephesians', 2, 8, 9)],
      supportingPassages: [passage('deuteronomy', 'Deuteronomy', 18, 10, 12)],
      content: [
        {
          kind: 'teaching',
          title: 'Comparison table (summary)',
          body:
            'Hinduism: impersonal Brahman and rebirth — Scripture: one personal Creator (Isaiah 45:5–7). Buddhism: suffering from craving, no permanent self — Scripture: image of God, grace not self-effort (Ephesians 2:8–9), suffering from the fall (Romans 8:18–23). New Age: all is one, human divinity — Scripture: serpent’s lie (Genesis 3:5), Jesus only way (John 14:6; Acts 4:12). Karma repays across lives; the gospel offers forgiveness because Christ bore sin (Romans 3:25–26; Colossians 2:13–14).',
        },
        {
          kind: 'teaching',
          title: 'Occult practices',
          body:
            'Mediums, astrology, and divination are forbidden (Deuteronomy 18:10–12; Isaiah 8:19). Engage the longing for peace and justice; ask what happens to wrongs karma cannot repay.',
        },
        {
          kind: 'distinction',
          biblical: 'Acts 17:24–29 begins with Creator; Ephesians 2 contrasts grace with works.',
          interpretation: 'Do not dismiss Eastern critiques of materialism — then point to Christ and resurrection.',
          disagreement: 'Advaita Vedanta teaches non-dual identity with Brahman — answered by Creator-creature distinction.',
        },
        { kind: 'attribution', teacherId: 'sproul', work: 'Published Ligonier teaching (themes)', note: 'Exclusivity of Christ — paraphrase only.' },
      ],
      questions: INTERMEDIATE,
      reflectionPrompts: ['How could you ask a karma-believing friend about forgiveness for past wrongs?'],
      furtherStudy: ['Read Colossians 2:8 and list what Paul warns against.'],
    },
    {
      id: 'en-pluralism-engage',
      order: 3,
      title: 'Pluralism, Suffering, and Engagement',
      estimatedMinutes: 25,
      objectives: [
        'Answer “all paths” with Acts 4:12 and non-contradiction.',
        'Contrast Buddhist escape from suffering with biblical hope.',
        'Recognize New Age parallels to Gnosticism.',
      ],
      primaryPassages: [passage('acts', 'Acts', 4, 12, 12)],
      supportingPassages: [passage('1john', '1 John', 4, 1, 3)],
      content: [
        {
          kind: 'teaching',
          title: 'Pluralism and suffering',
          body:
            'Religions make contradictory claims — loving neighbors requires honesty about differences. Buddhism treats suffering as something to escape through discipline; Scripture traces suffering to the fall and promises renewal (Romans 8:18–23; Revelation 21:4). Only one mediator fully accomplished salvation (1 Timothy 2:5).',
        },
        {
          kind: 'teaching',
          title: 'How to engage',
          body:
            'Listen for longing for peace and meaning; use questions; contrast karma’s lack of forgiveness with the cross; follow Paul in Acts 17 from Creator to Christ and resurrection; avoid caricature; keep the gospel central.',
          level: 'advanced',
        },
        {
          kind: 'distinction',
          biblical: '1 John 4:1–3 tests spirits; Acts 4:12 names salvation in no other name.',
          interpretation: 'New Age “secret knowledge” resembles Gnosticism John confronts.',
          disagreement: 'Mahayana bodhisattva ideals admire compassion — yet Christ alone is sufficient mediator.',
        },
        { kind: 'attribution', teacherId: 'grudem', work: 'Systematic Theology (themes)', note: 'Sin, salvation, and Christ — paraphrase only.' },
      ],
      questions: ADVANCED,
      reflectionPrompts: ['Pray for wisdom to speak truth without dismissing a friend’s search for peace.'],
      furtherStudy: ['Read Romans 8:18–25 on creation’s groaning and hope.'],
    },
  ],
}
