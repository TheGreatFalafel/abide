import type { CurriculumTopic } from '../types'
import { SOURCE_NEEDHAM_SUP, SOURCE_SCHAFF_ORG } from '../historySources'
import { SOURCE_SPROUL_EVANG } from '../evangelismSources'
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
  Q('eo-b1', 'In what year did the traditional split between East and West occur?', ['325', '1054', '1517', '1870'], 'B', 'beginner'),
  Q('eo-b2', "What is the Orthodox term for sharing in God's life?", ['Transubstantiation', 'Justification', 'Theosis', 'Imputation'], 'C', 'beginner'),
  Q('eo-b3', 'What do the Orthodox and evangelicals share?', ['The pope', 'Icons', 'Seven sacraments', 'The Trinity and the deity of Christ'], 'D', 'beginner'),
  Q('eo-b4', 'Who is the "first among equals" in Orthodoxy?', ['The Ecumenical Patriarch of Constantinople', 'The pope', 'The archbishop of Canterbury', 'A council of laymen'], 'A', 'beginner'),
  Q('eo-b5', 'What are icons?', ['Painted sacred images used in worship', 'Bibles', 'Bread', 'Hymnbooks'], 'A', 'beginner'),
  Q('eo-b6', 'The main Orthodox worship service is called:', ['The Mass', 'The Divine Liturgy', 'A revival', 'A camp meeting'], 'B', 'beginner'),
  Q('eo-b7', 'Which verse says all Scripture is "God-breathed"?', ['John 3:16', 'Romans 8:1', '2 Timothy 3:16', 'Psalm 119:105'], 'C', 'beginner'),
  Q('eo-b8', 'How do the Orthodox typically baptize infants?', ['Sprinkling only', 'Triple immersion', 'They do not baptize infants', 'With wine'], 'B', 'beginner'),
]

const INTERMEDIATE = [
  Q('eo-i1', 'Where does Orthodoxy locate authority?', ['Scripture alone', 'Holy Tradition, with Scripture within it, and the ecumenical councils', 'The pope', 'Personal experience'], 'B', 'intermediate'),
  Q('eo-i2', 'How many ecumenical councils do the Orthodox recognize?', ['3', '21', '7', '12'], 'C', 'intermediate'),
  Q('eo-i3', 'On the *filioque* ("and the Son"), the Orthodox:', ['Accept it', 'Reject its addition to the creed', 'Wrote it', 'Do not know it'], 'B', 'intermediate'),
  Q('eo-i4', 'The Orthodox view of original sin is that we inherit:', ["Adam's guilt and corruption", 'Death and corruption but not Adam\'s guilt', 'Nothing', 'Only a bad example'], 'B', 'intermediate'),
  Q('eo-i5', 'Which commandment do Protestants cite against icon veneration?', ['Exodus 20:4-5', 'Exodus 20:12', 'Exodus 20:15', 'Exodus 20:17'], 'A', 'intermediate'),
  Q('eo-i6', 'Protestants read "partakers of the divine nature" (2 Peter 1:4) as:', ['Becoming God in essence', "Sharing in God's moral character and new life through Christ, not becoming divine", 'Reincarnation', 'A myth'], 'B', 'intermediate'),
  Q('eo-i7', 'The Orthodox teaching on the Eucharist affirms:', ["Christ's real presence without defining the mechanism", 'A bare symbol', 'Transubstantiation as a formula', 'That it is optional'], 'A', 'intermediate'),
  Q('eo-i8', 'Orthodox salvation is best described as:', ['A one-time declaration', 'A lifelong process of synergy and transformation', 'Predestination only', 'Works only'], 'B', 'intermediate'),
  Q('eo-i9', 'Orthodox clergy practice:', ['No priest may marry', 'Only monks marry', 'All bishops marry', 'Priests may marry before ordination; bishops are chosen from the celibate'], 'D', 'intermediate'),
]

const ADVANCED = [
  Q('eo-a1', 'Gregory Palamas (14th century) defended the distinction between:', ['Faith and works', "God's essence (unknowable) and energies (knowable)", 'Law and gospel', 'Church and state'], 'B', 'advanced'),
  Q('eo-a2', 'Romans 5:12 becomes a point of dispute because:', ['The Greek *eph\' hō* can be read "because all sinned," and Orthodox often prefer that, while Protestants point to 5:18-19', 'The verse is missing', 'Only the Latin matters', 'It concerns baptism'], 'A', 'advanced'),
  Q('eo-a3', 'The Orthodox Old Testament canon, compared with the Protestant:', ['Is the same', 'Includes additional books from the Septuagint tradition', 'Is shorter', 'Excludes the Psalms'], 'B', 'advanced'),
  Q('eo-a4', 'The iconoclast controversy was settled in 843 by:', ['The Triumph of Orthodoxy restoring icons', 'The Reformation', 'Trent', 'The pope'], 'A', 'advanced'),
  Q('eo-a5', 'The Fourth Crusade (1204):', ['Reunited East and West', 'Sacked Constantinople and deepened the schism', 'Defeated Islam', 'Founded Orthodoxy'], 'B', 'advanced'),
  Q('eo-a6', 'Why do evangelicals resist making Tradition equal to Scripture?', ["Jesus rebuked traditions that make void God's Word (Mark 7:6-13; Colossians 2:8)", 'Tradition is always evil', 'The apostles forbade councils', 'It conflicts with Latin'], 'A', 'advanced'),
  Q('eo-a7', 'The Protestant doctrine of justification differs from Orthodoxy\'s in that Protestants teach:', ['A process of becoming righteous', 'Sacramental infusion', 'A forensic declaration of righteousness received by faith (Romans 4:5)', 'Baptismal regeneration'], 'C', 'advanced'),
  Q('eo-a8', 'Constantinople fell to the Ottoman Turks in:', ['1204', '1453', '1054', '1517'], 'B', 'advanced'),
]

export const EASTERN_ORTHODOXY: CurriculumTopic = {
  id: 'eastern-orthodoxy',
  title: 'Eastern Orthodoxy',
  description:
    'Byzantine roots, councils, liturgy, theosis, and icons — what Orthodox Christians share with evangelicals and where Scripture leads Protestants to differ, with respectful engagement.',
  objectives: [
    'Locate Eastern Orthodoxy historically and describe its structure without the papacy.',
    'Compare authority, sin, salvation, and icons with biblical teaching.',
    'Explain theosis, ancestral sin, and filioque at a survey level.',
    'Engage Orthodox friends with appreciation and gospel clarity.',
  ],
  estimatedMinutes: 75,
  prerequisites: ['gospel-foundations'],
  framework: 'reformed',
  domain: 'evangelism-apologetics',
  contentStatus: 'full',
  version: 1,
  sources: [
    { ...SOURCE_SCHAFF_ORG, note: 'Historical scaffold for East-West schism and councils — themes only.' },
    { ...SOURCE_NEEDHAM_SUP, note: 'Supplementary narrative on Byzantine Christianity — paraphrase only.' },
    { ...SOURCE_SPROUL_EVANG, note: 'Supplementary Protestant response on justification — paraphrase only.' },
  ],
  lessons: [
    {
      id: 'eo-origins-worship',
      order: 1,
      title: 'Origins, Councils, and Worship',
      estimatedMinutes: 25,
      objectives: [
        'Outline the seven ecumenical councils and the 1054 schism.',
        'Describe Divine Liturgy, icons, and national churches.',
        'Affirm shared Nicene-Chalcedonian faith.',
      ],
      primaryPassages: [passage('2timothy', '2 Timothy', 3, 16, 17)],
      supportingPassages: [passage('john', 'John', 1, 1, 1)],
      content: [
        {
          kind: 'teaching',
          title: 'Origins',
          body:
            'Eastern Orthodoxy traces itself through the Byzantine world, recognizing seven ecumenical councils (Nicaea 325 through Nicaea II 787). The break with Rome is dated to 1054, deepened by the Fourth Crusade’s sack of Constantinople (1204). Constantinople fell in 1453. There is no pope; the Ecumenical Patriarch is first among equals among self-governing national churches.',
        },
        {
          kind: 'teaching',
          title: 'Worship and shared faith',
          body:
            'Worship centers on the Divine Liturgy, icons, and the church calendar. Orthodox and evangelicals share the Trinity and the deity of Christ confessed at Nicaea and Chalcedon. Differences appear on authority, salvation, and devotional practice.',
        },
        {
          kind: 'distinction',
          biblical: '2 Timothy 3:16–17 commends Scripture; Acts 17:11 models testing teaching.',
          interpretation:
            'Orthodoxy is not classified like Mormonism or Jehovah’s Witnesses, but differs on authority and justification compared with Scripture’s gospel.',
          disagreement:
            'Many Orthodox are culturally Orthodox more than devout. Do not mock liturgy; ask what they trust for acceptance before God.',
        },
        { kind: 'attribution', teacherId: 'schaff', work: 'History of the Christian Church (themes)', note: 'Chronology of schism and councils — paraphrase only.' },
      ],
      questions: BEGINNER,
      reflectionPrompts: ['Thank God for shared Trinitarian faith; ask for humility before unfamiliar worship forms.'],
      furtherStudy: ['Read the Nicene Creed and note christological affirmations shared across traditions.'],
    },
    {
      id: 'eo-beliefs-scripture',
      order: 2,
      title: 'Authority, Sin, Salvation, and Icons',
      estimatedMinutes: 25,
      objectives: [
        'Contrast Holy Tradition with *sola scriptura*.',
        'Compare ancestral sin and theosis with Romans and 2 Peter.',
        'Explain Protestant concerns about icon veneration.',
      ],
      primaryPassages: [passage('romans', 'Romans', 5, 12, 19)],
      supportingPassages: [passage('exodus', 'Exodus', 20, 4, 5)],
      content: [
        {
          kind: 'teaching',
          title: 'Authority and salvation',
          body:
            'Orthodoxy locates authority in Holy Tradition — Scripture within the church’s life, councils, and fathers. Protestants teach Scripture as final authority (2 Timothy 3:16–17; Mark 7:6–13). Salvation is described as *theosis* (deification) through lifelong synergy with grace. Scripture teaches justification by faith alone, imputed righteousness (Romans 3:28; 4:5; Ephesians 2:8–9); 2 Peter 1:4 speaks of sharing God’s moral nature, not becoming divine in essence.',
        },
        {
          kind: 'teaching',
          title: 'Sin and icons',
          body:
            'Orthodox teaching often describes ancestral sin: inherited death and corruption without Adam’s guilt credited. Protestants read Romans 5:12–19 as imputation of Adam’s sin. Icons are venerated, distinguished from worship (Nicaea II, 787). Protestants cite Exodus 20:4–5 and worship God alone.',
        },
        {
          kind: 'distinction',
          biblical: 'Romans 5:18–19 and Exodus 20:4–5 anchor Protestant readings on sin and worship.',
          interpretation: 'The filioque dispute is real but not the center of the gospel; Trinity remains common ground.',
          disagreement: 'Orthodox theology differs from Roman Catholic teaching on sin and grace — do not treat “Eastern” as “Catholic without the pope.”',
        },
        { kind: 'attribution', teacherId: 'needham', work: "2,000 Years of Christ's Power (themes)", note: 'Historical context for Byzantine theology — paraphrase only.' },
      ],
      questions: INTERMEDIATE,
      reflectionPrompts: ['Read Romans 3–5 with a friend and ask what gives assurance before God.'],
      furtherStudy: ['Compare Romans 5:12 with Orthodox readings of *eph\' hō* in commentaries.'],
    },
    {
      id: 'eo-engage-deeper',
      order: 3,
      title: 'Engagement and Deeper Topics',
      estimatedMinutes: 25,
      objectives: [
        'Appreciate martyrdom heritage and reverence without adopting syncretism.',
        'Survey Palamas, canon, and East-West history for advanced learners.',
        'Keep gospel and assurance central in conversation.',
      ],
      primaryPassages: [passage('1john', '1 John', 5, 13, 13)],
      supportingPassages: [passage('mark', 'Mark', 7, 6, 13)],
      content: [
        {
          kind: 'teaching',
          title: 'How to engage',
          body:
            'Appreciate what is good: Trinity, Chalcedon, reverence, martyrs. Ask about assurance (1 John 5:13). Read Romans 3–5 together. Avoid mocking liturgy. Remember nominal cultural Orthodoxy is common.',
        },
        {
          kind: 'teaching',
          title: 'Go deeper',
          body:
            'Gregory Palamas defended essence–energies distinction. The Fourth Crusade deepened schism. Orthodox OT canon follows Septuagint traditions with additional books. Icon restoration (Triumph of Orthodoxy, 843) ended iconoclasm.',
          level: 'advanced',
        },
        {
          kind: 'distinction',
          biblical: '1 John 5:13 invites assurance; Mark 7 warns traditions that void God’s Word.',
          interpretation: 'Forensic justification remains the evangelical gospel line alongside shared christology.',
          disagreement: 'Palamite theology is contested even among Orthodox scholars — describe, do not oversimplify.',
        },
        { kind: 'attribution', teacherId: 'sproul', work: 'Published Ligonier teaching (themes)', note: 'Supplementary Protestant response — paraphrase only.' },
      ],
      questions: ADVANCED,
      reflectionPrompts: ['Pray for an Orthodox friend’s knowledge of Christ, not only cultural identity.'],
      furtherStudy: ['Read 1 John 5:11–13 on eternal life and assurance.'],
    },
  ],
}
