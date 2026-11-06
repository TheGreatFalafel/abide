import type { CurriculumTopic } from '../types'
import { SOURCE_SPROUL_EVANG } from '../evangelismSources'
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
  Q('jw-b1', 'Who founded the Watch Tower movement?', ['Joseph Smith', 'Charles Taze Russell', 'Martin Luther', 'William Miller'], 'B', 'beginner'),
  Q('jw-b2', 'What is the JW Bible translation called?', ['The New World Translation', 'The King James Version', 'The Amplified Bible', 'The Septuagint'], 'A', 'beginner'),
  Q('jw-b3', 'Where do JW congregations meet?', ['Cathedrals', 'Mosques', 'Kingdom Halls', 'Temples'], 'C', 'beginner'),
  Q('jw-b4', 'What name do JWs insist on for God?', ['Allah', 'Jehovah', 'Elohim only', 'Christ'], 'B', 'beginner'),
  Q('jw-b5', 'JWs teach that Jesus is:', ['God the Son', 'Michael the archangel, a created being', 'A myth', 'A prophet only'], 'B', 'beginner'),
  Q('jw-b6', 'Which verse says "the Word was God"?', ['John 1:1', 'John 3:16', 'Acts 1:8', 'Romans 3:23'], 'A', 'beginner'),
  Q('jw-b7', 'Which do JWs generally avoid celebrating?', ['Weddings', 'Birthdays and Christmas', 'Funerals', 'Meals'], 'B', 'beginner'),
  Q('jw-b8', 'What do JWs teach about hell?', ['Eternal conscious torment', 'The common grave; no conscious torment', 'Purgatory', 'Reincarnation'], 'B', 'beginner'),
]

const INTERMEDIATE = [
  Q('jw-i1', 'JWs teach that the Holy Spirit is:', ['A person', 'An impersonal active force', 'An angel', 'Jesus'], 'B', 'intermediate'),
  Q('jw-i2', 'What do JWs teach about the 144,000?', ['They are the only ones who go to heaven', 'They are all believers', 'They are the angels', 'They are the Gentiles'], 'A', 'intermediate'),
  Q('jw-i3', "The Watch Tower's teaching about 1914 is that:", ['Christ began ruling invisibly in heaven', 'The world ended', 'The Reformation began', 'The Watchtower was founded'], 'A', 'intermediate'),
  Q('jw-i4', 'Acts 15:20 and the blood prohibition are best understood as:', ['A prohibition of eating blood in the context of pagan practices', 'A medical command', 'A ban on surgery', 'A call to give blood'], 'A', 'intermediate'),
  Q('jw-i5', 'How does the NWT render John 1:1?', ['"The Word was God"', '"The Word was a god"', '"The Word was divine only"', '"The Word was an angel"'], 'B', 'intermediate'),
  Q('jw-i6', 'Which verse shows the Holy Spirit is God?', ['Acts 5:3-4', 'Genesis 1:1', 'Psalm 1:1', 'Isaiah 53'], 'A', 'intermediate'),
  Q('jw-i7', 'Col 1:15 calls Christ "firstborn of all creation"; this means:', ['He was the first thing created', 'He holds the rank and inheritance of the firstborn, and He created all things (v. 16)', 'He is an angel', 'He is not divine'], 'B', 'intermediate'),
  Q('jw-i8', "Thomas's confession in John 20:28 is:", ['"My Lord and my God"', '"Blessed is he"', '"You are a prophet"', '"Rabbi"'], 'A', 'intermediate'),
  Q('jw-i9', 'JWs hold that God communicates through:', ['Each believer directly', 'The Governing Body', 'The pope', 'Councils'], 'B', 'intermediate'),
]

const ADVANCED = [
  Q('jw-a1', 'Why do Greek scholars reject "a god" in John 1:1?', ['The anarthrous predicate *theos* before the verb is qualitative or definite (Colwell; Wallace), and John 1:3 and 1:18 affirm Christ\'s deity', 'Greek lacks the article', 'Because of tradition', 'The verse is a later addition'], 'A', 'advanced'),
  Q('jw-a2', 'The NWT of Colossians 1:16-20 inserts "[other]" before "things." What is the problem?', ['There is no corresponding word in the Greek', 'It improves the sense', 'It is in the Septuagint', 'It is correct'], 'A', 'advanced'),
  Q('jw-a3', 'Which passages show that the Son is not the archangel?', ['Hebrews 1:5-14 and Jude 9', 'Genesis 1', 'Romans 8', 'Psalm 23'], 'A', 'advanced'),
  Q('jw-a4', 'Which are failed Watch Tower predictions?', ['1914, 1925, and 1975 expectations', 'The Reformation', '1517', '2000 only'], 'A', 'advanced', 'Deuteronomy 18:20-22 gives the test.'),
  Q('jw-a5', 'The JW view of salvation conflicts with:', ['Ephesians 2:8-9 and Romans 11:6', 'Genesis 1', 'Psalm 23', 'Jude 1'], 'A', 'advanced'),
  Q('jw-a6', 'The 1931 name "Jehovah\'s Witnesses" is based on:', ['Isaiah 43:10-12', 'Matthew 28:19', 'Acts 11:26', 'Genesis 1:1'], 'A', 'advanced'),
  Q('jw-a7', 'How does church discipline in the New Testament differ from JW shunning?', ['Discipline aims at repentance and restoration (Matthew 18:15-17; 2 Corinthians 2:5-8; Galatians 6:1)', 'It aims at permanent shunning', 'It is optional', 'It never happens'], 'A', 'advanced'),
  Q('jw-a8', 'John 8:58 ("before Abraham was, I am") is significant because:', ['It echoes God\'s name in Exodus 3:14, and the Jews tried to stone Jesus for it', 'It is a mistranslation', 'It refers to Abraham', 'It has no parallel'], 'A', 'advanced'),
]

export const JEHOVAHS_WITNESSES: CurriculumTopic = {
  id: 'jehovahs-witnesses',
  title: "Jehovah's Witnesses",
  description:
    'Watch Tower history, the New World Translation, and JW teaching on God, Christ, and salvation — with a respectful biblical response and practical conversation guidance.',
  objectives: [
    'Outline Russell, Rutherford, Kingdom Halls, and the Governing Body.',
    'Compare JW teaching on Trinity, Christ, Spirit, hell, and salvation with Scripture.',
    'Handle NWT issues, failed prophecies, and shunning with gentleness.',
    'Show love to sincere Witnesses while proclaiming Christ’s deity.',
  ],
  estimatedMinutes: 75,
  prerequisites: ['gospel-foundations'],
  framework: 'reformed',
  domain: 'evangelism-apologetics',
  contentStatus: 'full',
  version: 1,
  sources: [
    { ...SOURCE_SPROUL_EVANG, note: 'Supplementary christological clarity — paraphrase only.' },
    { ...SOURCE_MACARTHUR_SUP, note: 'Deity of Christ and gospel themes — paraphrase only.' },
  ],
  lessons: [
    {
      id: 'jw-origins-organization',
      order: 1,
      title: 'Origins and Organization',
      estimatedMinutes: 25,
      objectives: [
        'Summarize Russell, Rutherford, and the 1931 name.',
        'Describe Kingdom Halls and the Governing Body.',
        'Treat Witnesses with respect at the door.',
      ],
      primaryPassages: [passage('isaiah', 'Isaiah', 43, 10, 12)],
      supportingPassages: [passage('acts', 'Acts', 1, 11, 11)],
      content: [
        {
          kind: 'teaching',
          title: 'Origins',
          body:
            'Charles Taze Russell (1852–1916) began Bible studies in Pittsburgh and founded Zion’s Watch Tower Tract Society (1881). Joseph Rutherford adopted the name Jehovah’s Witnesses in 1931 from Isaiah 43:10–12. The New World Translation (1961) is their English Bible. A Governing Body in New York directs the movement as God’s channel (the “faithful and discreet slave”). Congregations meet in Kingdom Halls with door-to-door evangelism.',
        },
        {
          kind: 'teaching',
          title: 'Classification and tone',
          body:
            'The app teaches that Jehovah’s Witnesses deny the Trinity and deity of Christ — treated as a non-Christian religion at those points — while individuals deserve respect. Many Witnesses are sincere and sacrificial.',
        },
        {
          kind: 'distinction',
          biblical: 'Isaiah 43:10–12 is their namesake text; Scripture elsewhere teaches Christ’s deity (John 1:1; 20:28).',
          interpretation: 'Engage from Scripture, not tradition alone; be kind at the door.',
          disagreement: 'Witnesses reject birthdays and Christmas; know practice without mocking sincerity.',
        },
        { kind: 'attribution', teacherId: 'macarthur', work: 'Published biblical teaching (themes)', note: 'Christological focus — paraphrase only.' },
      ],
      questions: BEGINNER,
      reflectionPrompts: ['Pray for patience the next time Witnesses visit.'],
      furtherStudy: ['Read Isaiah 43:10–12 and John 20:28 in parallel.'],
    },
    {
      id: 'jw-beliefs-scripture',
      order: 2,
      title: 'Beliefs and Scripture’s Response',
      estimatedMinutes: 25,
      objectives: [
        'Contrast JW Christology and pneumatology with Nicene faith.',
        'Explain annihilationism and the 144,000 teaching.',
        'Use Colossians 1 and John 1 in conversation.',
      ],
      primaryPassages: [passage('colossians', 'Colossians', 1, 15, 20)],
      supportingPassages: [passage('john', 'John', 1, 1, 3)],
      content: [
        {
          kind: 'teaching',
          title: 'Core teachings',
          body:
            'JWs reject the Trinity; God is Jehovah alone. Jesus is Michael the archangel, a created “god.” The Spirit is an impersonal force. Hell is the grave; the wicked are annihilated. 144,000 anointed go to heaven; the great crowd hope for paradise earth. Salvation requires faith, obedience, and loyalty to the organization without assurance. Christ’s return is taught as invisible in 1914; Acts 1:11 and Revelation 1:7 point to visibility.',
        },
        {
          kind: 'teaching',
          title: 'Scripture',
          body:
            'Scripture teaches one God in three persons (Matthew 28:19), Jesus as God (John 1:1; 8:58; 20:28; Titus 2:13), the Spirit as personal (Acts 5:3–4; John 16:13–14), conscious judgment (Luke 16:23–24; Matthew 25:46), and salvation by grace with assurance (Ephesians 2:8–9; 1 John 5:13). Blood in Acts 15:20 concerns eating in idol feasts, not medical transfusion as such.',
        },
        {
          kind: 'distinction',
          biblical: 'John 20:28 and Colossians 1:16–17 affirm deity and creatorship of the Son.',
          interpretation: 'Read from their NWT when helpful, yet explain Greek and context for John 1:1 and Colossians 1.',
          disagreement: '144,000 interpretation divides Revelation 7 — show the great multitude alongside sealed Israelites.',
        },
        { kind: 'attribution', teacherId: 'sproul', work: 'Published Ligonier teaching (themes)', note: 'Trinity and Christology — paraphrase only.' },
      ],
      questions: INTERMEDIATE,
      reflectionPrompts: ['Ask a Witness friend how they know they are saved — listen, do not trap.'],
      furtherStudy: ['Memorize Colossians 1:15–20 for gentle discussion.'],
    },
    {
      id: 'jw-nwt-engage',
      order: 3,
      title: 'NWT, Prophecy, and Engagement',
      estimatedMinutes: 25,
      objectives: [
        'Note NWT renderings and inserted words fairly.',
        'Apply Deuteronomy 18 to failed date predictions.',
        'Contrast shunning with biblical discipline aimed at restoration.',
      ],
      primaryPassages: [passage('deuteronomy', 'Deuteronomy', 18, 20, 22)],
      supportingPassages: [passage('matthew', 'Matthew', 18, 15, 17)],
      content: [
        {
          kind: 'teaching',
          title: 'Translation and prophecy',
          body:
            'The NWT renders John 1:1 as “a god” and inserts “other” in Colossians 1:16 without Greek support — issues Greek grammarians often dispute. Watch Tower expectations around 1914, 1925, and 1975 failed publicly; Deuteronomy 18:20–22 tests prophets.',
        },
        {
          kind: 'teaching',
          title: 'How to engage',
          body:
            'Be kind; listen; read their NWT; ask about assurance; explore Colossians 1:15–20 and John 20:28; avoid long hostile arguments; pray. Leaving can cost family relationships through disfellowshipping — show compassion. Biblical discipline seeks repentance (Matthew 18:15–17; 2 Corinthians 2:5–8).',
          level: 'advanced',
        },
        {
          kind: 'distinction',
          biblical: 'John 8:58 echoes Exodus 3:14; Matthew 18 aims at restoration, not permanent exile.',
          interpretation: 'Do not attack the Governing Body harshly in front of members; build trust.',
          disagreement: 'JW scholars defend NWT choices — you can note dispute without personal insult.',
        },
        { kind: 'attribution', teacherId: 'frame', work: 'Apologetics writings (themes)', note: 'Scripture as authority in translation debates — paraphrase only.' },
      ],
      questions: ADVANCED,
      reflectionPrompts: ['Pray for Witnesses who risk family loss to follow Christ.'],
      furtherStudy: ['Read 2 Corinthians 2:5–11 on restoration after discipline.'],
    },
  ],
}
