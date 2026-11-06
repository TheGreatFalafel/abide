import type { QuizQuestion } from '../../planQuizzes'
import type { CurriculumTopic } from '../types'
import {
  SOURCE_GONZALEZ_SUP,
  SOURCE_NEEDHAM_SUP,
  SOURCE_SCHAFF_ORG,
} from '../historySources'
import { mc, passage } from './_helpers'

function five(
  prefix: string,
  items: Array<[string, string[], number, string, 'beginner' | 'intermediate' | 'advanced']>,
): QuizQuestion[] {
  return items.map(([prompt, choices, answer, explanation, difficulty], i) =>
    mc(`${prefix}-q${i + 1}`, prompt, choices, answer, explanation, difficulty),
  )
}

export const MODERN_CHRISTIANITY: CurriculumTopic = {
  id: 'modern-christianity',
  title: 'The Modern Church',
  description:
    'Pietism and awakenings, modern missions, Spurgeon and Downgrade, liberalism and inerrancy, and the global church today (c. 1650–present).',
  objectives: [
    'Describe Pietism and the Great Awakening.',
    'Outline the modern missions movement.',
    'Explain Spurgeon’s Downgrade concern.',
    'Contrast liberalism with fundamental/evangelical inerrancy responses.',
    'Recognize the global church’s growth and challenges.',
  ],
  estimatedMinutes: 90,
  prerequisites: ['reformation'],
  framework: 'reformed',
  domain: 'church-history',
  era: 'modern',
  eraLabel: 'Modern Church (c. 1650–today)',
  contentStatus: 'full',
  version: 1,
  sources: [
    {
      ...SOURCE_SCHAFF_ORG,
      note: 'Organizational modern-era chronology where PD editions reach; paraphrase only.',
    },
    {
      ...SOURCE_NEEDHAM_SUP,
      note: 'Supplementary modern church narrative themes.',
    },
    {
      ...SOURCE_GONZALEZ_SUP,
      note: 'Supplementary global Christianity survey themes.',
    },
  ],
  lessons: [
    {
      id: 'mod-pietism-awakening',
      order: 1,
      title: 'Pietism and the Great Awakening',
      estimatedMinutes: 18,
      objectives: [
        'Define Pietism’s call to heart religion.',
        'Name Awakening emphases on conversion and preaching.',
      ],
      primaryPassages: [passage('john', 'John', 3, 1, 8), passage('acts', 'Acts', 2, 37, 42)],
      supportingPassages: [passage('ephesians', 'Ephesians', 2, 1, 10)],
      content: [
        {
          kind: 'teaching',
          body:
            'Pietism pressed living faith against dead orthodoxy. The Great Awakening (18th century) featured powerful preaching, conversions, and new evangelical networks (Edwards, Whitefield, and others). Abide affirms new birth and Word-driven awakening while cautioning against emotionalism detached from doctrine.',
        },
        {
          kind: 'distinction',
          biblical:
            'Jesus teaches new birth by the Spirit (John 3); Pentecost hearers are cut to the heart and devote themselves to apostolic teaching (Acts 2).',
          interpretation:
            'True revival joins Spirit-wrought conversion with Scripture and the church’s ordinary means of grace.',
          disagreement:
            'Historians debate Awakening excesses; describe fruit and folly without cynicism or naivete.',
        },
      ],
      questions: five('mod1', [
        ['Pietism emphasized:', ['Living personal faith', 'Denial of Scripture', 'Abolishing preaching', 'Papal indulgences'], 0, 'Heart religion against dead form.', 'beginner'],
        ['John 3 teaches the necessity of:', ['New birth by the Spirit', 'Buying salvation', 'Political power', 'Silence'], 0, 'Regeneration is essential.', 'beginner'],
        ['The Great Awakening is associated with:', ['Widespread evangelical preaching and conversions', 'The fall of Rome', 'Trent alone', 'The Crusades'], 0, '18th-century awakenings reshaped Protestantism.', 'intermediate'],
        ['Acts 2 converts devoted themselves to:', ['Apostles’ teaching, fellowship, breaking bread, prayers', 'Entertainment only', 'Rejecting all teachers', 'Private visions only'], 0, 'Ordinary means accompany awakening.', 'intermediate'],
        ['A wise caution about revival is:', ['Emotion without doctrine is not the goal', 'Doctrine without life is ideal', 'Preaching should stop', 'Conversion is unnecessary'], 0, 'Truth and life belong together.', 'advanced'],
      ]),
      reflectionPrompts: [
        'Where do you need fresh repentance, not only correct opinions?',
        'How can you pursue both warmth and sound doctrine?',
      ],
      furtherStudy: ['Jonathan Edwards, “Religious Affections” (PD) — sample themes.'],
    },
    {
      id: 'mod-missions',
      order: 2,
      title: 'The Modern Missions Movement',
      estimatedMinutes: 18,
      objectives: [
        'Connect the Great Commission to modern missionary expansion.',
        'Note key figures and the shift toward a global church.',
      ],
      primaryPassages: [passage('matthew', 'Matthew', 28, 18, 20), passage('romans', 'Romans', 10, 13, 17)],
      supportingPassages: [passage('acts', 'Acts', 13, 1, 3)],
      content: [
        {
          kind: 'teaching',
          body:
            'From Carey and onward, Protestants organized societies to take the gospel across cultures. Missions expanded Scripture translation, churches, and schools — mixed with colonial complications that require honest history. The New Testament pattern remains: send, preach, plant, disciple.',
        },
        {
          kind: 'distinction',
          biblical:
            'Christ commands disciple-making of the nations (Matthew 28); faith comes by hearing the word of Christ (Romans 10).',
          interpretation:
            'Mission is obedience to Christ, not Western cultural export as such — the gospel creates indigenous churches under Scripture.',
          disagreement:
            'Methods and colonial entanglements are debated; do not deny either gospel fruit or real harms.',
        },
      ],
      questions: five('mod2', [
        ['Matthew 28 commands the church to:', ['Make disciples of all nations', 'Conquer by force', 'Avoid foreigners', 'Translate nothing'], 0, 'The Great Commission drives mission.', 'beginner'],
        ['Faith comes by:', ['Hearing the word of Christ', 'Silence', 'Wealth', 'Nationality'], 0, 'Romans 10 ties faith to the preached word.', 'beginner'],
        ['William Carey is often called a pioneer of:', ['Modern Protestant missions', 'The Crusades', 'Trent', 'Gnosticism'], 0, 'Carey symbolizes organized modern mission.', 'intermediate'],
        ['Acts 13 shows a local church:', ['Sending workers after prayer and fasting', 'Forbidding mission', 'Replacing Scripture', 'Electing a pope'], 0, 'Missionary sending is congregational and Spirit-led.', 'intermediate'],
        ['A fair missions history includes:', ['Gospel advance and hard questions about colonial entanglement', 'Only triumph with no problems', 'Only failure', 'Denial that churches were planted'], 0, 'Honesty serves future mission.', 'advanced'],
      ]),
      reflectionPrompts: [
        'How are you participating in disciple-making — near or far?',
        'What would “hearing the word of Christ” look like for someone you know?',
      ],
      furtherStudy: ['Read Matthew 28:18-20 and list every verb of obedience.'],
      reviewFromLessonIds: ['mod-pietism-awakening'],
    },
    {
      id: 'mod-spurgeon-downgrade',
      order: 3,
      title: 'Spurgeon and the Downgrade Controversy',
      estimatedMinutes: 18,
      objectives: [
        'Identify Spurgeon as a gospel preacher defending orthodoxy.',
        'Explain “Downgrade” as concern over doctrinal decline.',
      ],
      primaryPassages: [passage('jude', 'Jude', 1, 3, 4), passage('2timothy', '2 Timothy', 4, 1, 5)],
      supportingPassages: [passage('galatians', 'Galatians', 1, 6, 10)],
      content: [
        {
          kind: 'teaching',
          body:
            'Charles Spurgeon preached Christ crucified with evangelistic power. In the Downgrade Controversy he warned that Baptist circles were sliding from biblical doctrine. Contending for the faith is not cruelty; abandoning the gospel is. Use Spurgeon as a historical witness, not as a final authority above Scripture.',
        },
        {
          kind: 'distinction',
          biblical:
            'Contend for the faith once for all delivered (Jude 3); preach the word; people will turn from sound teaching (2 Timothy 4).',
          interpretation:
            'Pastors must guard doctrine and keep evangelistic warmth together.',
          disagreement:
            'Contemporaries disputed Spurgeon’s severity; Abide affirms his gospel concern without treating every judgment as infallible.',
        },
      ],
      questions: five('mod3', [
        ['Spurgeon is best known as:', ['A gospel preacher in London', 'A pope', 'A Jesuit founder', 'A denialist of Scripture'], 0, 'The “Prince of Preachers” label reflects his ministry.', 'beginner'],
        ['Jude 3 calls believers to:', ['Contend for the once-for-all faith', 'Invent new gospels', 'Avoid all teaching', 'Trust feelings only'], 0, 'The faith is delivered, not redesigned.', 'beginner'],
        ['“Downgrade” referred to:', ['Doctrinal decline Spurgeon opposed', 'A building project only', 'A hymn tune', 'A Bible translation'], 0, 'It named a slide from orthodoxy.', 'intermediate'],
        ['2 Timothy 4 warns that people will:', ['Turn from sound teaching to suit their desires', 'Always love hard sermons', 'Never need Scripture', 'Reject all emotion'], 0, 'Itching ears remain a danger.', 'intermediate'],
        ['A right use of Spurgeon in Abide is:', ['Historical gospel witness under Scripture’s authority', 'A replacement for the Bible', 'An excuse for cruelty', 'A denial of doctrine'], 0, 'He is secondary to Scripture.', 'advanced'],
      ]),
      reflectionPrompts: [
        'Where are you tempted to soft-pedal truth to keep peace?',
        'How can you contend for the faith with gentleness?',
      ],
      furtherStudy: ['Spurgeon sermons (PD) — verify titles; paraphrase themes only.'],
      reviewFromLessonIds: ['mod-missions'],
    },
    {
      id: 'mod-liberalism-inerrancy',
      order: 4,
      title: 'Liberalism, the Fundamentals, and Inerrancy',
      estimatedMinutes: 18,
      objectives: [
        'Define theological liberalism’s accommodation to modern criticism.',
        'Explain fundamentalist/evangelical defense of Scripture’s truthfulness.',
      ],
      primaryPassages: [passage('john', 'John', 17, 17, 17), passage('matthew', 'Matthew', 5, 17, 18)],
      supportingPassages: [passage('2peter', '2 Peter', 1, 16, 21)],
      content: [
        {
          kind: 'teaching',
          body:
            'Nineteenth- and twentieth-century liberalism often redefined miracles, Christ’s person, and Scripture to fit modern assumptions. The Fundamentals and later evangelical scholarship defended historic doctrines and the Bible’s truthfulness. TMS teaches plenary verbal inspiration and inerrancy in the original documents. Abide teaches that position and describes critical alternatives as other views.',
        },
        {
          kind: 'distinction',
          biblical:
            'God’s word is truth (John 17:17); Jesus upholds Scripture’s lasting authority (Matthew 5:17-18); prophetic Scripture is Spirit-borne (2 Peter 1).',
          interpretation:
            'Inerrancy means Scripture does not err in all it affirms; it is not a claim that every copyist mark is magical.',
          disagreement:
            'Limited inerrancy and neo-orthodox views differ; describe fairly while teaching full inerrancy.',
        },
      ],
      questions: five('mod4', [
        ['Theological liberalism typically:', ['Accommodates Christian claims to modern critical assumptions', 'Affirms every miracle without question', 'Invented the printing press', 'Wrote the Westminster Confession'], 0, 'Accommodation is the pattern.', 'beginner'],
        ['John 17:17 says God’s word is:', ['Truth', 'Optional', 'Myth only', 'Private opinion'], 0, 'Truthfulness grounds trust.', 'beginner'],
        ['TMS teaches Scripture is:', ['Inerrant in the original documents', 'Errant in doctrine', 'Only inspirational poetry', 'Equal to church tradition'], 0, 'Plenary verbal inspiration and inerrancy.', 'intermediate'],
        ['“The Fundamentals” were associated with:', ['Defending historic doctrines', 'Denying the resurrection', 'Abolishing missions', 'Ending Bible translation'], 0, 'Early 20th-century orthodox defense.', 'intermediate'],
        ['Inerrancy properly claims:', ['Scripture does not err in all it affirms', 'Every translation is word-perfect identically', 'Textual criticism is sinful', 'Human authors were dictation machines with no personality'], 0, 'Affirmations of Scripture are true; dual authorship remains.', 'advanced'],
      ]),
      reflectionPrompts: [
        'Where do modern assumptions quietly edit Jesus’ words in your mind?',
        'How does trusting Scripture’s truthfulness change how you read hard passages?',
      ],
      furtherStudy: ['Chicago Statement on Biblical Inerrancy (1978) — public statement text.'],
      reviewFromLessonIds: ['mod-spurgeon-downgrade'],
    },
    {
      id: 'mod-global-church',
      order: 5,
      title: 'The Global Church Today',
      estimatedMinutes: 18,
      objectives: [
        'Recognize Christianity’s demographic shift toward the Global South.',
        'Commit to humble partnership and doctrinal faithfulness worldwide.',
      ],
      primaryPassages: [passage('revelation', 'Revelation', 7, 9, 12), passage('ephesians', 'Ephesians', 2, 11, 22)],
      supportingPassages: [passage('matthew', 'Matthew', 24, 14, 14)],
      content: [
        {
          kind: 'teaching',
          body:
            'The majority of Christians now live outside the historic West. Revelation’s vision of every nation worshiping the Lamb frames hope. Challenges include persecution, syncretism, prosperity errors, and Western pride. The task is the same: preach Christ, plant churches, love the truth, and refuse ethnocentrism.',
        },
        {
          kind: 'distinction',
          biblical:
            'A multitude from every nation worships (Revelation 7); Jew and Gentile are one new humanity in Christ (Ephesians 2).',
          interpretation:
            'The church’s catholicity is gospel-created, not Western cultural uniformity.',
          disagreement:
            'Strategies for partnership differ; unity in the apostolic gospel remains non-negotiable.',
        },
      ],
      questions: five('mod5', [
        ['Revelation 7 shows worshipers from:', ['Every nation, tribe, people, and language', 'One ethnicity only', 'Angels alone', 'Israel without the nations'], 0, 'Global worship is the biblical horizon.', 'beginner'],
        ['Ephesians 2 teaches Jew and Gentile are:', ['One new humanity in Christ', 'Permanently two gospels', 'Unable to share a church', 'Saved by ethnicity'], 0, 'Christ creates unity.', 'beginner'],
        ['A major modern reality is:', ['Christianity’s growth across the Global South', 'Christianity existing only in Europe', 'The end of all churches', 'No Bible translations left'], 0, 'Demographics have shifted.', 'intermediate'],
        ['Matthew 24:14 ties gospel proclamation to:', ['All nations', 'One city only', 'Private clubs', 'Silent retreats only'], 0, 'Witness to the nations continues.', 'intermediate'],
        ['Faithful global partnership requires:', ['Doctrinal clarity and humble cross-cultural love', 'Western cultural dominance', 'Abandoning Scripture', 'Ignoring false teaching'], 0, 'Truth and humility travel together.', 'advanced'],
      ]),
      reflectionPrompts: [
        'How can you learn from believers outside your culture?',
        'What is one concrete way to support gospel work among the nations?',
      ],
      furtherStudy: ['Pray through Revelation 7:9-12 for the global church.'],
      reviewFromLessonIds: ['mod-liberalism-inerrancy'],
    },
  ],
}
