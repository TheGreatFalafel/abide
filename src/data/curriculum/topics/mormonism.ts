import type { CurriculumTopic } from '../types'
import { SOURCE_GRUDEM_EVANG, SOURCE_SPROUL_EVANG } from '../evangelismSources'
import { SOURCE_MACARTHUR_SUP, mc, passage } from './_helpers'

const B = (n: number, prompt: string, choices: string[], exp?: string) =>
  mc(`mo-b${n}`, prompt, choices, 0, exp, 'beginner')
const I = (n: number, prompt: string, choices: string[], exp?: string) =>
  mc(`mo-i${n}`, prompt, choices, 0, exp, 'intermediate')
const A = (n: number, prompt: string, choices: string[], exp?: string) =>
  mc(`mo-a${n}`, prompt, choices, 0, exp, 'advanced')

const BEGINNER = [
  B(1, 'Who founded the LDS Church?', ['Joseph Smith', 'Brigham Young', 'Charles Russell', 'Martin Luther']),
  B(2, 'Which book do Latter-day Saints call "another testament of Jesus Christ"?', ['The Book of Mormon', 'The Talmud', 'The Quran', 'The Didache']),
  B(3, "What is the church's official name?", ['The Church of Jesus Christ of Latter-day Saints', 'The Mormon Fellowship', 'The Restored Orthodox Church', 'The Watchtower Society']),
  B(4, 'Where did Smith say he found the golden plates?', ['Near Palmyra, New York', 'Salt Lake City', 'Jerusalem', 'Rome']),
  B(5, 'Which verse says "God is spirit"?', ['John 4:24', 'Genesis 1:1', 'Psalm 23:1', 'Romans 3:23']),
  B(6, 'Isaiah 43:10 says before God no god was formed. What does that conflict with?', ['LDS teaching that many gods exist', 'The Trinity', 'The cross', 'Baptism']),
  B(7, 'According to LDS teaching, who are Jesus and Lucifer?', ['Spirit brothers', 'Father and son', 'Prophets', 'Angels only']),
  B(8, 'Revelation 22:18-19 and Galatians 1:8 warn against:', ["Adding to or changing God's message", 'Translating the Bible', 'Church music', 'Fasting']),
]

const INTERMEDIATE = [
  I(1, 'Which of these is NOT an LDS standard work?', ['The Apocrypha', 'The Book of Mormon', 'Doctrine and Covenants', 'The Pearl of Great Price']),
  I(2, '"As man now is, God once was; as God now is, man may become" refers to:', ['Eternal progression', 'The Trinity', 'The incarnation', 'Original sin']),
  I(3, 'The three LDS degrees of glory are:', ['Celestial, terrestrial, telestial', 'Heaven, earth, hell', 'Gold, silver, bronze', 'Father, Son, Spirit']),
  I(4, 'Hebrews 9:27 addresses baptism for the dead by teaching that:', ['Judgment follows death once', 'The dead can be baptized', 'There is purgatory', 'Souls reincarnate']),
  I(5, 'The "Great Apostasy" is the claim that:', ['The true church was lost until Joseph Smith restored it', 'The Pharisees fell', 'Israel was scattered', 'The apostles taught error'], 'Matthew 16:18 and 28:20 answer it.'),
  I(6, '2 Nephi 25:23 ("after all we can do") conflicts with which passage?', ['Ephesians 2:8-9', 'Genesis 1:1', 'Psalm 100', 'Acts 1:8']),
  I(7, 'Which passage gives a test for a false prophet?', ['Deuteronomy 18:20-22', 'Genesis 22', 'Psalm 119', 'Ruth 1']),
  I(8, 'Galatians 1:8-9 is relevant because:', ['It warns that even an angel preaching another gospel is accursed', 'It affirms new scripture', 'It only concerns Galatia', 'It is about baptism']),
  I(9, 'Why ask LDS friends to define terms?', ['Shared words (God, Christ, saved) have different meanings', 'To win', 'To avoid the Bible', 'For fun']),
]

const ADVANCED = [
  A(1, 'The LDS 8th Article of Faith says the Bible is true "as far as it is translated correctly." Which fact best answers wholesale corruption?', ['The vast number of ancient manuscripts and the Dead Sea Scrolls confirm the text\'s stability', 'No manuscripts exist', 'Translations are all identical', 'The Bible was written last']),
  A(2, 'The *Book of Abraham* controversy concerns:', ['Egyptian papyri that Smith said he translated, which Egyptologists identify as ordinary funerary texts', 'A lost Gospel', 'The Dead Sea Scrolls', 'The Septuagint']),
  A(3, 'Which statement about the *Book of Mormon* and archaeology is fair?', ['Mainstream archaeologists find no verified confirmation of its peoples and cities, though LDS scholars dispute this', 'It is universally confirmed', 'No one has studied it', 'It has been proven false by Egypt']),
  A(4, 'The LDS doctrine of God is best described as:', ['A Godhead of three separate beings united in purpose', 'One God in three persons of one essence', 'One person in three modes', 'One god alone']),
  A(5, 'Isaiah 44:6-8 is cited against:', ['Polytheism and exaltation to godhood', 'Monotheism', 'Prophecy', 'The Trinity']),
  A(6, 'Hebrews 10:14 conflicts with:', ['A salvation requiring ongoing works for exaltation', 'Justification by faith', 'The resurrection', 'Substitution']),
  A(7, 'The LDS "testimony" that rests on a feeling (Moroni 10:4-5) is best tested by:', ['Scripture (Acts 17:11; Jeremiah 17:9; 1 John 4:1)', 'More feeling', 'Tradition', 'Authority']),
  A(8, 'LDS leaders lifted the priesthood ban on men of black African descent in:', ['1978', '1830', '1890', '2018'], 'Official Declaration 2.'),
]

export const MORMONISM: CurriculumTopic = {
  id: 'mormonism',
  title: 'Mormonism (Latter-day Saints)',
  description:
    'Origins and official LDS teaching on God, Christ, salvation, and authority — described fairly from LDS sources, with a clear biblical response and respectful engagement.',
  objectives: [
    'Summarize Joseph Smith, LDS scripture, and restoration claims.',
    'Compare LDS teaching with Scripture on God, Christ, salvation, and authority.',
    'Discuss the Book of Mormon, Great Apostasy claim, and conversation strategy.',
    'Engage LDS friends with kindness while clarifying the gospel of grace.',
  ],
  estimatedMinutes: 75,
  prerequisites: ['gospel-foundations'],
  framework: 'reformed',
  domain: 'evangelism-apologetics',
  contentStatus: 'full',
  version: 1,
  sources: [
    { ...SOURCE_GRUDEM_EVANG, note: 'Organizational map for doctrine of God and salvation — themes only.' },
    { ...SOURCE_SPROUL_EVANG, note: 'Supplementary clarity on justification and Scripture — paraphrase only.' },
    { ...SOURCE_MACARTHUR_SUP, note: 'Supplementary gospel-of-grace emphasis — paraphrase only.' },
  ],
  lessons: [
    {
      id: 'mo-origins-authority',
      order: 1,
      title: 'Origins, Scripture, and Authority',
      estimatedMinutes: 25,
      objectives: [
        'Outline Joseph Smith, the Book of Mormon, and LDS standard works.',
        'Explain the Great Apostasy and restoration claims.',
        'State why shared vocabulary can hide different meanings.',
      ],
      primaryPassages: [passage('jude', 'Jude', 1, 3, 3)],
      supportingPassages: [passage('matthew', 'Matthew', 16, 18, 18)],
      content: [
        {
          kind: 'teaching',
          title: 'Origins',
          body:
            'Joseph Smith (1805–1844) reported an 1820 vision and said the angel Moroni led him to golden plates near Palmyra, New York, published as the *Book of Mormon* (1830). Brigham Young led many Saints to Utah in 1847. The church asks to be called The Church of Jesus Christ of Latter-day Saints. Standard works: the Bible (KJV, “as far as it is translated correctly”), the *Book of Mormon*, *Doctrine and Covenants*, and the *Pearl of Great Price*.',
        },
        {
          kind: 'teaching',
          title: 'Apostasy and canon',
          body:
            'LDS teaching claims a Great Apostasy — the true church vanished until Joseph Smith restored it — alongside open canon and a living prophet. Scripture teaches Christ promised the church would not fail (Matthew 16:18; 28:20) and that the faith was “once for all delivered” (Jude 3). Galatians 1:8–9 warns against another gospel even from an angel.',
        },
        {
          kind: 'distinction',
          biblical: 'Jude 3 and Galatians 1:8–9 guard the apostolic message; Matthew 16:18 promises Christ builds his church.',
          interpretation:
            'The app teaches that Mormonism claims to be Christian but differs at central doctrines of God, Christ, and salvation — classification follows Part 11’s note.',
          disagreement:
            'LDS individuals vary in devotion and knowledge of official teaching. Describe what leaders teach in Gospel Topics and standard works.',
        },
        { kind: 'attribution', teacherId: 'grudem', work: 'Systematic Theology (themes)', note: 'Organizational cue: test every claim by Scripture’s doctrine of God and gospel — paraphrase only.' },
      ],
      questions: BEGINNER,
      reflectionPrompts: ['Pray for kindness toward LDS neighbors who are often warm and family-oriented.', 'Ask a LDS friend what “saved” means to them — and listen.'],
      furtherStudy: ['Read Jude 3 and Galatians 1:6–9; note the warning about another gospel.'],
    },
    {
      id: 'mo-beliefs-scripture',
      order: 2,
      title: 'What LDS Teaching Affirms — and Scripture’s Response',
      estimatedMinutes: 25,
      objectives: [
        'Compare LDS and biblical teaching on God, Christ, and human origins.',
        'Contrast LDS salvation and afterlife with grace in Scripture.',
        'Use key passages on monotheism and justification.',
      ],
      primaryPassages: [passage('john', 'John', 4, 24, 24)],
      supportingPassages: [passage('ephesians', 'Ephesians', 2, 8, 9)],
      content: [
        {
          kind: 'teaching',
          title: 'God and Christ',
          body:
            'LDS teaching describes God the Father with a physical body, many gods, and humans able to become gods (“as man now is, God once was”). Jesus and Lucifer are taught as spirit brothers; Jesus as exalted man. Scripture teaches God is spirit (John 4:24), one God (Isaiah 43:10; Deuteronomy 6:4), and Christ the eternal Creator (John 1:1–3; Colossians 1:15–17).',
        },
        {
          kind: 'teaching',
          title: 'Salvation and glory',
          body:
            'LDS salvation is described as grace “after all we can do” (2 Nephi 25:23), with exaltation requiring temple works and three degrees of glory. Scripture teaches salvation by grace through faith, not works (Ephesians 2:8–9; Romans 3:28; Hebrews 10:14) and judgment after death once (Hebrews 9:27).',
        },
        {
          kind: 'distinction',
          biblical: 'Isaiah 44:6–8 and John 4:24 anchor monotheism and God’s spiritual nature; Ephesians 2:8–9 anchors grace.',
          interpretation:
            'Reformed evangelicals classify LDS teaching as a non-Christian religion at the Trinity and Christ, while treating persons with love.',
          disagreement:
            'LDS writers use Christian vocabulary. Always define terms (“God,” “Christ,” “grace,” “saved”) before debating.',
        },
        { kind: 'attribution', teacherId: 'sproul', work: 'Published Ligonier teaching (themes)', note: 'Supplementary cue: justification by faith alone is the dividing line — paraphrase only.' },
      ],
      questions: INTERMEDIATE,
      reflectionPrompts: ['How could you explain grace without sounding dismissive of a friend’s sincerity?'],
      furtherStudy: ['Read Ephesians 2:8–9 and 2 Nephi 25:23 (summary in lesson); note the contrast.'],
    },
    {
      id: 'mo-engage-evidence',
      order: 3,
      title: 'Evidence, Tests, and Engagement',
      estimatedMinutes: 25,
      objectives: [
        'Discuss manuscript evidence, Book of Abraham, and archaeology fairly.',
        'Apply tests for prophets and inner testimony from Scripture.',
        'Avoid insults and internet rumors; keep the gospel central.',
      ],
      primaryPassages: [passage('acts', 'Acts', 17, 11, 11)],
      supportingPassages: [passage('deuteronomy', 'Deuteronomy', 18, 20, 22)],
      content: [
        {
          kind: 'teaching',
          title: 'How to engage',
          body:
            'Ask what friends mean by “God,” “Christ,” “saved,” and “grace.” Be kind; use the Bible; be wary of “burning in the bosom” tests (Moroni 10:4–5) and point to Acts 17:11, Jeremiah 17:9, and 1 John 4:1. Share the gospel of grace. Avoid insulting nicknames, rumors, and debate without good news.',
        },
        {
          kind: 'teaching',
          title: 'Evidence questions',
          body:
            'The eighth Article of Faith’s translation caveat is answered by vast manuscript evidence and the Dead Sea Scrolls. The *Book of Abraham* involves Egyptian papyri identified by Egyptologists as ordinary funerary texts. Archaeology and the *Book of Mormon* remain disputed — state mainstream findings fairly without mockery.',
          level: 'advanced',
        },
        {
          kind: 'distinction',
          biblical: 'Deuteronomy 18:20–22 and Acts 17:11 teach testing prophets and teachings by God’s Word.',
          interpretation: 'Feelings are not a final authority; Scripture is (1 John 4:1).',
          disagreement: 'LDS scholars dispute archaeological claims. You can note dispute without claiming you settled every historical question in one lesson.',
        },
        { kind: 'attribution', teacherId: 'macarthur', work: 'Published biblical teaching (themes)', note: 'Supplementary cue: proclaim Christ and grace clearly — paraphrase only.' },
      ],
      questions: ADVANCED,
      reflectionPrompts: ['Is there a LDS coworker or neighbor you can serve this week regardless of debate outcomes?'],
      furtherStudy: ['Read Acts 17:11 and 1 John 4:1–3 on testing teaching.'],
    },
  ],
}
