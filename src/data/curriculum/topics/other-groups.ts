import type { CurriculumTopic } from '../types'
import { SOURCE_GRUDEM_EVANG, SOURCE_SPROUL_EVANG } from '../evangelismSources'
import { SOURCE_MACARTHUR_SUP, mc, passage } from './_helpers'

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
  Q('og-b1', 'Which day do Seventh-day Adventists observe as the Sabbath?', ['Saturday', 'Sunday', 'Friday', 'Monday'], 'A', 'beginner'),
  Q('og-b2', 'Who founded Christian Science?', ['Mary Baker Eddy', 'Ellen White', 'Joseph Smith', 'Charles Russell'], 'A', 'beginner'),
  Q('og-b3', 'The prosperity gospel teaches that:', ['God wants believers healthy and wealthy', 'Suffering is always good', 'Money is evil', 'Faith is useless'], 'A', 'beginner'),
  Q('og-b4', '"Oneness" Pentecostals deny:', ['The Trinity', 'The resurrection', 'Prayer', 'Baptism'], 'A', 'beginner'),
  Q('og-b5', 'Which verse says Jesus is the way, the truth, and the life?', ['John 14:6', 'John 3:16', 'Psalm 23', 'Genesis 1'], 'A', 'beginner'),
  Q('og-b6', 'Does Unitarian Universalism require belief in the deity of Christ?', ['No', 'Yes', 'Only on Sundays', 'Only for clergy'], 'A', 'beginner'),
  Q('og-b7', 'Which group began in 1844 with an expectation of Christ\'s return?', ['Adventism', 'Mormonism', 'Islam', 'Judaism'], 'A', 'beginner'),
  Q('og-b8', '1 Timothy 6:10 says the love of money is:', ['A root of all kinds of evil', 'A blessing', 'A command', 'Neutral'], 'A', 'beginner'),
]

const INTERMEDIATE = [
  Q('og-i1', 'The SDA "investigative judgment" teaches that:', ['In 1844 Christ began a final phase of judgment in heaven', 'Christ returned in 1844', 'Everyone is judged at death', 'There is no judgment'], 'A', 'intermediate'),
  Q('og-i2', 'Christian Science claims that:', ['Sin and sickness are illusions', 'Sin is real and damning', 'Medicine is commanded', 'Jesus is God'], 'A', 'intermediate'),
  Q('og-i3', 'Hebrews 10:12-14 contradicts SDA teaching that:', ["Christ's work in heaven must still be completed in an investigative judgment", 'Christ died', 'Christ rose', 'Christ ascended'], 'A', 'intermediate'),
  Q('og-i4', 'Which verse is used against requiring the Saturday Sabbath?', ['Colossians 2:16-17', 'Genesis 1:1', 'Psalm 1:1', 'Jude 1'], 'A', 'intermediate'),
  Q('og-i5', 'Oneness Pentecostals say baptism must be:', ['In the name of Jesus only', 'In the name of the Father, Son, and Spirit', 'Not required', 'By sprinkling only'], 'A', 'intermediate'),
  Q('og-i6', "Matthew 3:16-17 (Jesus' baptism) is used against modalism because:", ['The Son, the Spirit, and the Father are all present and distinct at once', 'Jesus was alone', 'The Spirit is absent', "The voice was Jesus'"], 'A', 'intermediate'),
  Q('og-i7', 'The prosperity gospel is answered by:', ["2 Corinthians 8:9 and the example of Paul's sufferings (2 Corinthians 11:23-28)", 'Genesis 1', 'Psalm 23', 'Jude 1'], 'A', 'intermediate'),
  Q('og-i8', 'Unitarian Universalism formed in:', ['1961', '1517', '1844', '1930'], 'A', 'intermediate'),
  Q('og-i9', 'The founder of Seventh-day Adventism\'s prophetic authority is:', ['Ellen G. White', 'Mary Baker Eddy', 'Joseph Smith', 'Charles Russell'], 'A', 'intermediate'),
]

const ADVANCED = [
  Q('og-a1', 'Why do many Reformed teachers consider the SDA investigative judgment problematic?', ["It implies Christ's work and the believer's assurance are not complete, against Hebrews 10:14", 'It is too old', 'It denies the Trinity', 'It denies the resurrection'], 'A', 'advanced'),
  Q('og-a2', 'Which Christian Science teaching conflicts most directly with Hebrews 9:22?', ['That sin is an illusion and no real atonement is needed', 'That Christ lived', 'That prayer heals', 'That the Bible matters'], 'A', 'advanced'),
  Q('og-a3', 'Modalism was condemned historically at:', ["The church's rejection of Sabellius in the third century", 'Nicaea only', 'Trent', 'Chalcedon only'], 'A', 'advanced'),
  Q('og-a4', 'The "Word of Faith" teaching that believers are "little gods" conflicts with:', ['The Creator-creature distinction (Isaiah 46:9; Acts 17:24-29)', 'Genesis 1:26', 'Psalm 23', 'John 1:1'], 'A', 'advanced'),
  Q('og-a5', 'Why is Acts 2:38 not a formula for baptizing only "in Jesus\' name"?', ['It is descriptive, and Matthew 28:19 gives the Trinitarian name', 'It forbids baptism', 'It is spurious', 'It is about circumcision'], 'A', 'advanced'),
  Q('og-a6', 'Which statement fairly describes the SDA doctrine of God?', ['They affirm the Trinity and the deity of Christ', 'They deny the Trinity', 'They deny Christ\'s deity', 'They deny creation'], 'A', 'advanced'),
  Q('og-a7', 'The word "gospel" (*euangelion*) in Galatians 1:8 implies:', ["A specific message about Christ's death and resurrection that cannot be changed", 'A flexible message', 'Law-keeping', 'Prosperity'], 'A', 'advanced'),
  Q('og-a8', 'How should we respond to individuals in these groups?', ['With truth and love, listening and giving the gospel', 'With mockery', 'With silence', 'With agreement'], 'A', 'advanced'),
]

export const OTHER_GROUPS: CurriculumTopic = {
  id: 'other-groups',
  title: 'Other Groups at a Glance',
  description:
    'Short profiles of Seventh-day Adventism, Christian Science, Oneness Pentecostalism, the prosperity gospel, and Unitarian Universalism — with Scripture responses and loving engagement.',
  objectives: [
    'Identify origins and key claims of five movements.',
    'Apply Scripture to Sabbath, atonement, Trinity, health/wealth, and pluralism.',
    'Distinguish SDA Trinitarianism from investigative judgment errors.',
    'Respond to individuals with truth and love.',
  ],
  estimatedMinutes: 75,
  prerequisites: ['gospel-foundations'],
  framework: 'reformed',
  domain: 'evangelism-apologetics',
  contentStatus: 'full',
  version: 1,
  sources: [
    { ...SOURCE_GRUDEM_EVANG, note: 'Gospel and Christology loci — themes only.' },
    { ...SOURCE_SPROUL_EVANG, note: 'Trinity and justification themes — paraphrase only.' },
    { ...SOURCE_MACARTHUR_SUP, note: 'Gospel clarity — paraphrase only.' },
  ],
  lessons: [
    {
      id: 'og-adventism-science',
      order: 1,
      title: 'Adventism and Christian Science',
      estimatedMinutes: 25,
      objectives: [
        'Outline 1844, Ellen White, and investigative judgment.',
        'Summarize Mary Baker Eddy on matter and sin.',
        'Use Hebrews on finished work of Christ.',
      ],
      primaryPassages: [passage('hebrews', 'Hebrews', 10, 12, 14)],
      supportingPassages: [passage('colossians', 'Colossians', 2, 16, 17)],
      content: [
        {
          kind: 'teaching',
          title: 'Seventh-day Adventists',
          body:
            'William Miller’s 1844 expectation (Great Disappointment) shaped Adventism; Ellen G. White (1827–1915) exercised prophetic authority. SDAs observe Saturday Sabbath, teach investigative judgment from 1844, soul sleep and annihilation. They affirm Trinity and Christ’s deity — yet investigative judgment and Sabbath requirements differ from Scripture (Colossians 2:16–17; Romans 14:5; Hebrews 9:11–12; 10:12–14).',
        },
        {
          kind: 'teaching',
          title: 'Christian Science',
          body:
            'Mary Baker Eddy’s *Science and Health* (1875) teaches matter, sin, sickness, and death as illusions; Jesus not truly God; no substitutionary atonement. Scripture affirms incarnation (John 1:14), real sin (Romans 3:23; 1 John 1:8), and blood atonement (Hebrews 9:22; 1 Corinthians 15:3–4).',
        },
        {
          kind: 'distinction',
          biblical: 'Hebrews 10:12–14 declares Christ’s work finished; 1 John 1:8 denies sinless self-deception.',
          interpretation: 'Fairness: SDAs are Trinitarian — critique specific doctrines, not imaginary pagan labels.',
          disagreement: 'Galatians 1:8–9 warns against another gospel — apply carefully, not as a conversation club.',
        },
        { kind: 'attribution', teacherId: 'grudem', work: 'Systematic Theology (themes)', note: 'Christ and salvation — paraphrase only.' },
      ],
      questions: BEGINNER,
      reflectionPrompts: ['Pray for SDA friends who sincerely love Scripture.'],
      furtherStudy: ['Read Hebrews 9:11–14 on once-for-all entry and sacrifice.'],
    },
    {
      id: 'og-oneness-prosperity',
      order: 2,
      title: 'Oneness Pentecostalism and Prosperity Teaching',
      estimatedMinutes: 25,
      objectives: [
        'Explain modalism and baptism formulas.',
        'Contrast Word of Faith with Paul’s sufferings and contentment.',
        'Use Matthew 3 and 28 in Trinity discussion.',
      ],
      primaryPassages: [passage('matthew', 'Matthew', 28, 19, 19)],
      supportingPassages: [passage('2corinthians', '2 Corinthians', 8, 9, 9)],
      content: [
        {
          kind: 'teaching',
          title: 'Oneness Pentecostalism',
          body:
            'Arose c. 1913 in the Pentecostal movement (United Pentecostal Church International). Modalism: one person manifesting as Father, Son, Spirit; baptism in Jesus’ name only; tongues required for salvation. Matthew 3:16–17 shows Father, Son, and Spirit distinct at once; Matthew 28:19 gives the Trinitarian name (singular) of the three.',
        },
        {
          kind: 'teaching',
          title: 'Prosperity gospel',
          body:
            'Word of Faith (Kenyon, Hagin) teaches health and wealth as rights, positive confession, believers as “little gods.” Scripture answers with Christ’s poverty (2 Corinthians 8:9), warnings on greed (1 Timothy 6:3–10), Paul’s contentment (Philippians 4:11–13), and normal suffering in godliness (2 Timothy 3:12; Luke 9:23).',
        },
        {
          kind: 'distinction',
          biblical: 'Acts 2:38 is descriptive; Matthew 28:19 normative for baptism’s name.',
          interpretation: 'Modalism was rejected with Sabellius — historic Trinitarianism is not nitpicking.',
          disagreement: 'Some charismatics are Trinitarian and reject prosperity — do not merge all Pentecostals with Oneness or Word of Faith.',
        },
        { kind: 'attribution', teacherId: 'sproul', work: 'Published Ligonier teaching (themes)', note: 'Trinity — paraphrase only.' },
      ],
      questions: INTERMEDIATE,
      reflectionPrompts: ['Examine your own heart for love of money (1 Timothy 6:10).'],
      furtherStudy: ['Read 2 Corinthians 11:23–28 on Paul’s hardships.'],
    },
    {
      id: 'og-uua-engage',
      order: 3,
      title: 'Unitarian Universalism and Loving Response',
      estimatedMinutes: 25,
      objectives: [
        'Describe UU merger and no-creed stance.',
        'Answer pluralism with John 14:6 and Acts 4:12.',
        'Summarize engagement across all five profiles.',
      ],
      primaryPassages: [passage('john', 'John', 14, 6, 6)],
      supportingPassages: [passage('galatians', 'Galatians', 1, 8, 8)],
      content: [
        {
          kind: 'teaching',
          title: 'Unitarian Universalism',
          body:
            'Merger of Unitarian and Universalist churches in 1961; no required creed; Trinity and Christ’s deity rejected; many paths treated as acceptable. Christianity confesses Jesus as the way, truth, and life (John 14:6) and salvation in no other name (Acts 4:12).',
        },
        {
          kind: 'teaching',
          title: 'How to respond to all five',
          body:
            'Speak truth in love; listen; give the gospel; avoid mockery. SDAs: finished work of Christ. Christian Science: real sin and cross. Oneness: Trinity at baptism. Prosperity: carry cross. UU: gracious exclusivity of Christ. Classification follows Part 11 — differences from historic biblical Christianity at named points.',
          level: 'advanced',
        },
        {
          kind: 'distinction',
          biblical: 'Galatians 1:8 guards the defined gospel of Christ’s death and resurrection.',
          interpretation: 'Little-gods language violates Creator-creature distinction (Isaiah 46:9; Acts 17:24–29).',
          disagreement: 'Individuals in these groups may be searching — treat persons better than their systems.',
        },
        { kind: 'attribution', teacherId: 'macarthur', work: 'Published biblical teaching (themes)', note: 'Gospel definition — paraphrase only.' },
      ],
      questions: ADVANCED,
      reflectionPrompts: ['Who in these groups could you serve practically this month?'],
      furtherStudy: ['Read Galatians 1:6–9 and list what “another gospel” means.'],
    },
  ],
}
