import type { CurriculumTopic } from '../types'
import { SOURCE_SPROUL_EVANG } from '../evangelismSources'
import { SOURCE_GRUDEM_ORG, SOURCE_MACARTHUR_SUP, mc, passage } from './_helpers'

const ans = (letter: string) => ({ A: 0, B: 1, C: 2, D: 3 }[letter]!)
const B = (n: number, prompt: string, choices: string[], letter: string, exp?: string) =>
  mc(`rc-b${n}`, prompt, choices, ans(letter), exp, 'beginner')
const I = (n: number, prompt: string, choices: string[], letter: string, exp?: string) =>
  mc(`rc-i${n}`, prompt, choices, ans(letter), exp, 'intermediate')
const A = (n: number, prompt: string, choices: string[], letter: string, exp?: string) =>
  mc(`rc-a${n}`, prompt, choices, ans(letter), exp, 'advanced')

const BEGINNER = [
  B(1, 'Which council (1545-1563) answered the Reformation?', ['Trent', 'Nicaea', 'Chalcedon', 'Carthage'], 'A'),
  B(2, 'Catholics and Protestants agree on:', ['The Trinity and the deity of Christ', 'The pope', 'Purgatory', 'Seven sacraments'], 'A'),
  B(3, 'Who is the head of the Catholic Church on earth, according to Catholic teaching?', ['The pope', 'A patriarch', 'A council', 'A bishop alone'], 'A'),
  B(4, 'Which verse says there is one mediator between God and men?', ['1 Timothy 2:5', 'John 1:1', 'Genesis 1:1', 'Acts 1:8'], 'A'),
  B(5, 'How many sacraments does the Catholic Church teach?', ['Seven', 'Two', 'Three', 'Twelve'], 'A'),
  B(6, 'The Protestant Reformation began with whose Ninety-Five Theses (1517)?', ['Martin Luther', 'John Calvin', 'John Wesley', 'William Tyndale'], 'A'),
  B(7, '*Sola fide* means:', ['Faith alone', 'Scripture alone', 'Grace alone', 'Christ alone'], 'A'),
  B(8, 'Which verse says we are saved by grace through faith, not by works?', ['Ephesians 2:8-9', 'John 1:1', 'Psalm 1:1', 'Exodus 20:3'], 'A'),
]

const INTERMEDIATE = [
  I(1, 'Catholic teaching on authority includes:', ['Scripture, Sacred Tradition, and the Magisterium', 'Scripture alone', 'The pope alone', 'Councils alone'], 'A'),
  I(2, 'In Catholic teaching, justification is:', ['A process in which grace is infused', 'A once-for-all legal declaration', 'Unnecessary', 'Earned only by works'], 'A'),
  I(3, 'Transubstantiation teaches that:', ["The bread and wine become Christ's body and blood in substance", 'The bread only symbolizes Christ', 'Christ is present by faith only', 'The Supper is optional'], 'A'),
  I(4, 'Hebrews 10:10-14 is cited against:', ['The Mass as a continuing sacrifice', 'The cross', 'Baptism', 'The resurrection'], 'A'),
  I(5, 'Papal infallibility was defined at:', ['Vatican I (1870)', 'Nicaea', 'Trent', 'Vatican II'], 'A'),
  I(6, 'The Immaculate Conception teaches that:', ['Mary was conceived without original sin', 'Jesus was born of a virgin', 'Mary never died', 'Mary is divine'], 'A', 'Luke 1:47 and Romans 3:23 are used in response.'),
  I(7, 'Purgatory is:', ['A place of purification after death in Catholic teaching', 'A place in the Bible', 'The Millennium', 'The eternal state'], 'A'),
  I(8, 'Which passage is commonly used for papal primacy?', ['Matthew 16:18-19', 'John 3:16', 'Genesis 3:15', 'Romans 1:16'], 'A'),
  I(9, 'Protestants read "on this rock" in Matthew 16:18 as referring to:', ["Peter's confession of Christ (or Christ Himself), not the papacy", 'A building', 'Rome', 'The pope'], 'A'),
]

const ADVANCED = [
  A(1, "Trent's Session 6 (1547) on justification:", ['Condemned the doctrine of faith alone', 'Affirmed faith alone', 'Was silent', 'Defined original sin only'], 'A'),
  A(2, 'What is *ex opere operato*?', ['The sacrament works by the act performed, not by the recipient\'s faith', "By the priest's merits", "By the believer's faith", "By the church's prayer"], 'A'),
  A(3, 'The Council of Trent defined the biblical canon to include:', ['The deuterocanonical books', 'Only 66 books', 'The Didache', 'The Gospel of Thomas'], 'A'),
  A(4, 'Why do evangelicals reject adding Tradition as an equal authority?', ["Jesus rebuked traditions that nullify God's Word (Mark 7:6-13)", 'Tradition is always false', 'The Bible is silent', 'Councils never met'], 'A'),
  A(5, 'Catholic theology calls Mary *Theotokos*, "God-bearer." This title:', ["Was defined at Ephesus (431) to protect the unity of Christ's person", 'Means Mary is divine', 'Was invented in the Middle Ages', 'Is rejected by all Christians'], 'A'),
  A(6, 'Vatican II (1962-1965) did what?', ['Used the language of "separated brethren" and promoted ecumenism without changing the doctrines of Trent', 'Reversed Trent', 'Abolished the papacy', 'Canonized Luther'], 'A'),
  A(7, 'Which Reformation "sola" is directly opposed by the Catholic claim of Scripture plus Tradition?', ['*Sola scriptura*', '*Sola fide*', '*Soli Deo gloria*', '*Sola gratia*'], 'A'),
  A(8, 'The doctrine of imputation (Reformation) holds:', ["Christ's righteousness is counted to believers", 'Righteousness is poured into them', 'Righteousness is earned', 'Faith is the cause'], 'A'),
]

export const ROMAN_CATHOLICISM: CurriculumTopic = {
  id: 'roman-catholicism',
  title: 'Roman Catholicism',
  description:
    'Catholic origins, authority, justification, sacraments, and Marian doctrine — described from official sources, with a Reformed biblical response and gracious engagement.',
  objectives: [
    'State what Catholics and evangelicals share and where they differ on authority and salvation.',
    'Compare Catholic and biblical teaching on justification, Mass, Mary, and purgatory.',
    'Explain Trent, *sola fide*, and imputation at a survey level.',
    'Engage Catholic friends without caricature.',
  ],
  estimatedMinutes: 75,
  prerequisites: ['gospel-foundations'],
  framework: 'reformed',
  domain: 'evangelism-apologetics',
  contentStatus: 'full',
  version: 1,
  sources: [
    { ...SOURCE_GRUDEM_ORG, note: 'Organizational map for authority and salvation loci — themes only.' },
    { ...SOURCE_SPROUL_EVANG, note: 'Supplementary Reformation clarity on faith alone — paraphrase only.' },
    { ...SOURCE_MACARTHUR_SUP, note: 'Supplementary justification and gospel themes — paraphrase only.' },
  ],
  lessons: [
    {
      id: 'rc-origins-authority',
      order: 1,
      title: 'Origins, Authority, and Shared Faith',
      estimatedMinutes: 25,
      objectives: [
        'Outline key councils and the Catholic view of authority.',
        'Affirm shared Nicene-Chalcedonian christology.',
        'Introduce *sola scriptura* and the Reformation context.',
      ],
      primaryPassages: [passage('2timothy', '2 Timothy', 3, 16, 17)],
      supportingPassages: [passage('mark', 'Mark', 7, 6, 13)],
      content: [
        {
          kind: 'teaching',
          title: 'Origins and terms',
          body:
            'The Roman Catholic Church holds that Christ founded it on Peter and that the pope succeeds Peter. Key dates include Trent (1545–1563), Vatican I (1870, papal infallibility), definitions on Mary (1854, 1950), Vatican II (1962–1965), and the *Catechism of the Catholic Church* (1992). Catholics affirm the Nicene and Chalcedonian creeds. Authority is Scripture, Sacred Tradition, and the Magisterium together.',
        },
        {
          kind: 'teaching',
          title: 'Common ground and differences',
          body:
            'Catholics and Protestants agree on the Trinity and the deity of Christ. Evangelicals teach that Scripture alone is the final authority (2 Timothy 3:16–17; Mark 7:6–13; Acts 17:11), while Catholic teaching places Tradition and Magisterium alongside Scripture. The Reformation protest centered on how sinners are justified before God.',
        },
        {
          kind: 'distinction',
          biblical: 'Mark 7 warns against human traditions that nullify God’s Word; 2 Timothy 3 commends Scripture for teaching and correction.',
          interpretation:
            'The app teaches that Catholicism is not classified like Mormonism or Jehovah’s Witnesses, but differs on authority and the gospel as taught in Scripture.',
          disagreement:
            'Some Catholics trust Christ alone personally while their church’s official teaching on justification differs. Do not confuse individuals with Trent’s definitions.',
        },
        { kind: 'attribution', teacherId: 'sproul', work: 'Are We Together? / Faith Alone (themes)', note: 'Supplementary organizational cue on shared creeds vs justification — paraphrase only.' },
      ],
      questions: BEGINNER,
      reflectionPrompts: ['Thank God for shared confession of Christ’s deity; ask for grace in hard conversations.'],
      furtherStudy: ['Read Mark 7:6–13 and note what Jesus rebukes.'],
    },
    {
      id: 'rc-justification-sacraments',
      order: 2,
      title: 'Justification, Sacraments, and the Mass',
      estimatedMinutes: 25,
      objectives: [
        'Contrast infused cooperative justification with forensic justification by faith.',
        'Explain Catholic sacramental theology and the Mass.',
        'Use Hebrews on Christ’s once-for-all sacrifice.',
      ],
      primaryPassages: [passage('romans', 'Romans', 3, 28, 28)],
      supportingPassages: [passage('hebrews', 'Hebrews', 10, 10, 14)],
      content: [
        {
          kind: 'teaching',
          title: 'Justification',
          body:
            'Catholic teaching describes justification as a lifelong process with grace infused and faith cooperating with works (Trent, Session 6). Scripture teaches justification as a once-for-all declaration by faith alone (Romans 3:28; 4:5; 5:1; Galatians 2:16; Ephesians 2:8–9). Imputation counts Christ’s righteousness to believers rather than only pouring righteousness inward.',
        },
        {
          kind: 'teaching',
          title: 'Sacraments and Mass',
          body:
            'Seven sacraments are taught to convey grace *ex opere operato*. The Mass is described as re-presenting Christ’s sacrifice with transubstantiation. Protestants teach baptism and the Lord’s Supper as ordinances received by faith, and Hebrews insists Christ’s sacrifice was once for all (7:27; 9:25–28; 10:10–14).',
        },
        {
          kind: 'distinction',
          biblical: 'Romans 4:5 and Ephesians 2:8–9 emphasize faith and grace; Hebrews 10 completes the sacrifice.',
          interpretation: 'Reformed evangelicals hold *sola fide* as gospel, not a minor dispute.',
          disagreement: 'Catholic authors appeal to James 2 and tradition. Read James in context of living faith, not as contradicting Paul’s forensic language.',
        },
        { kind: 'attribution', teacherId: 'grudem', work: 'Systematic Theology (themes)', note: 'Organizational cue: justification and imputation — paraphrase only.' },
      ],
      questions: INTERMEDIATE,
      reflectionPrompts: ['Could you walk a friend through Romans 3–5 this month?'],
      furtherStudy: ['Read Romans 4:1–8 on Abraham and imputed righteousness.'],
    },
    {
      id: 'rc-mary-purgatory-engage',
      order: 3,
      title: 'Mary, Purgatory, and Engagement',
      estimatedMinutes: 25,
      objectives: [
        'Summarize Catholic teaching on Mary, saints, and purgatory.',
        'Respond from Scripture on mediation and assurance.',
        'Engage graciously without calling Catholics pagans.',
      ],
      primaryPassages: [passage('1timothy', '1 Timothy', 2, 5, 5)],
      supportingPassages: [passage('1john', '1 John', 1, 7, 7)],
      content: [
        {
          kind: 'teaching',
          title: 'Mary, saints, purgatory',
          body:
            'Catholic teaching includes Mary’s Immaculate Conception, perpetual virginity, Assumption, and prayer to saints; purgatory and indulgences address purification after death. Scripture honors Mary (Luke 1) yet records her need of a Savior (Luke 1:47); one mediator is Christ (1 Timothy 2:5). Christ’s blood cleanses from all sin (1 John 1:7; Hebrews 10:14); believers may be with the Lord at death (2 Corinthians 5:8).',
        },
        {
          kind: 'teaching',
          title: 'How to engage',
          body:
            'Many Catholics have not studied Trent or the *Catechism*. Ask what they trust for acceptance with God; show Romans 3–5; be gracious; avoid caricature; recognize shared Trinity and resurrection faith. Vatican II promoted ecumenical language without reversing Trent on justification.',
          level: 'advanced',
        },
        {
          kind: 'distinction',
          biblical: '1 Timothy 2:5 and Hebrews 4:14–16 center access through Christ alone.',
          interpretation: 'Honor persons; disagree with official teaching where it contradicts the gospel.',
          disagreement: 'The title *Theotokos* (Ephesus 431) protects Christ’s person, not Mary’s deity — explain fairly before critiquing popular devotions.',
        },
        { kind: 'attribution', teacherId: 'macarthur', work: 'Published biblical teaching (themes)', note: 'Supplementary cue: keep justification central — paraphrase only.' },
      ],
      questions: ADVANCED,
      reflectionPrompts: ['Repent of any contempt you have held toward Catholic neighbors.'],
      furtherStudy: ['Read 1 Timothy 2:5 and Luke 1:46–47 together.'],
    },
  ],
}
