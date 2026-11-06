import type { CurriculumTopic } from '../types'
import type { QuizQuestion } from '../../planQuizzes'
import {
  PRIMARY_1_CLEMENT,
  PRIMARY_APOSTLES_CREED,
  PRIMARY_ATHANASIUS_INCARNATION,
  PRIMARY_NICENE_CREED,
  SOURCE_GONZALEZ_SUP,
  SOURCE_NEEDHAM_SUP,
  SOURCE_SCHAFF_ORG,
} from '../historySources'
import { mc, passage } from './_helpers'

const CH1_QUESTIONS: QuizQuestion[] = [
  mc(
    'early-apostolic-b1',
    'Which language was most widely spoken across the Roman East and used for the New Testament?',
    ['Latin', 'Koine Greek', 'Hebrew only', 'Aramaic only'],
    1,
    'The New Testament was written in Koine Greek — the common language of trade and discourse in the eastern Mediterranean.',
    'beginner',
  ),
  mc(
    'early-apostolic-b2',
    'The earliest Christian communities were primarily:',
    [
      'Jewish disciples of Jesus within a Greco-Roman world',
      'A fourth-century imperial invention with no Jewish roots',
      'A purely philosophical school with no worship',
      'A medieval monastic order',
    ],
    0,
    'Acts and the epistles show the church born among Jewish believers who confess Jesus as Messiah while spreading through Greek cities and Roman roads.',
    'beginner',
  ),
  mc(
    'early-apostolic-i1',
    'What did the Jerusalem Council (Acts 15) decide about Gentile believers?',
    [
      'Gentiles must be circumcised and keep the whole Mosaic law to be saved',
      'Gentiles are saved by grace through faith without requiring circumcision for justification',
      'Paul was expelled from the church permanently',
      'Peter was declared the infallible head of all churches',
    ],
    1,
    'Acts 15 preserves the apostolic verdict: Gentiles are not burdened with circumcision as a condition of salvation, while urging holiness and considerate love.',
    'intermediate',
  ),
  mc(
    'early-apostolic-i2',
    'The Septuagint is best described as:',
    [
      'Jerome\'s Latin Vulgate',
      'A Greek translation of the Hebrew Scriptures used widely in the diaspora',
      'The New Testament canon list',
      'An early baptismal creed from Rome',
    ],
    1,
    'The Septuagint carried Old Testament Scripture into Greek-speaking synagogues and cities — many New Testament citations reflect its wording.',
    'intermediate',
  ),
  mc(
    'early-apostolic-a1',
    'Galatians 4:4 ("when the fullness of time had come") suggests God prepared the world through factors such as:',
    [
      'Roman peace, Greek language, synagogues, and roads — without making Rome the savior',
      'The absence of any Jewish expectation of Messiah',
      'Complete isolation of Christians from Gentiles',
      'The temple\'s destruction before Christ was born',
    ],
    0,
    'Paul\'s phrase highlights divine timing: the gospel spread through real historical networks under God\'s providence.',
    'advanced',
  ),
  mc(
    'early-apostolic-a2',
    'Historians often note that the destruction of Jerusalem and the temple in AD 70:',
    [
      'Ended the sacrificial system and sharpened the distinction between synagogue and church',
      'Proved Christianity was a Roman civil religion from the start',
      'Eliminated all Jewish believers in Jesus overnight',
      'Made the New Testament unnecessary',
    ],
    0,
    'AD 70 is a watershed in Jewish and church history; it did not erase Jewish Christianity but changed worship and controversy patterns.',
    'advanced',
  ),
]

const CH2_QUESTIONS: QuizQuestion[] = [
  mc(
    'early-persecution-b1',
    'Why were early Christians often persecuted by Roman authorities and neighbors?',
    [
      'They refused to worship the traditional gods and the imperial cult',
      'They refused all taxation and civic duties universally',
      'They were exclusively slaves with no legal rights',
      'They attacked Roman armies in every province',
    ],
    0,
    'Refusal to honor gods and emperor looked like atheism and disloyalty — even when Christians were otherwise law-abiding.',
    'beginner',
  ),
  mc(
    'early-persecution-b2',
    'Nero blamed Christians for the fire of Rome in:',
    ['AD 64', 'AD 313', 'AD 325', 'AD 1054'],
    0,
    'Tacitus (*Annals* 15.44) reports Nero shifting blame to Christians after the fire — an early imperial scapegoating episode.',
    'beginner',
  ),
  mc(
    'early-persecution-i1',
    'The Edict of Milan (313) did what?',
    [
      'Granted toleration to Christians — it did not instantly make Christianity Rome\'s only legal religion',
      'Launched Diocletian\'s Great Persecution',
      'Banned Judaism across the empire',
      'Declared all emperors bishops',
    ],
    0,
    'Constantine and Licinius ended systematic legal hostility in 313; favored status developed later.',
    'intermediate',
  ),
  mc(
    'early-persecution-i2',
    'Pliny\'s correspondence with Trajan (c. 112) illustrates that persecution was often:',
    [
      'Local and policy-driven rather than identical in every province and decade',
      'Continuous empire-wide from Pentecost onward',
      'Directed only against bishops, never laypeople',
      'Approved by every apostle in writing',
    ],
    0,
    'Governors asked how to handle accused Christians; Trajan advised measured response — not a perpetual universal hunt.',
    'intermediate',
  ),
  mc(
    'early-persecution-a1',
    'The *lapsi* were Christians who:',
    [
      'Denied the faith under persecution, raising questions about discipline and restoration',
      'Translated the Bible into Greek',
      'Founded the monastic movement exclusively',
      'Drafted the Nicene homoousios clause',
    ],
    0,
    'The lapsi fed Novatianist rigor and Donatist disputes over whether apostates could be readmitted.',
    'advanced',
  ),
  mc(
    'early-persecution-a2',
    'Polycarp of Smyrna (martyred c. 155–156) is remembered because:',
    [
      'His martyrdom account shows an elderly disciple refusing to recant Christ',
      'He wrote the Nicene Creed at Nicaea',
      'He was the first pope in Rome',
      'He denied the humanity of Christ',
    ],
    0,
    'The *Martyrdom of Polycarp* is a key early document for how churches honored witness unto death.',
    'advanced',
  ),
]

const CH3_QUESTIONS: QuizQuestion[] = [
  mc(
    'early-fathers-b1',
    'Which early leader wrote letters on his way to martyrdom in Rome?',
    ['Ignatius of Antioch', 'Augustine of Hippo', 'John Calvin', 'Thomas Aquinas'],
    0,
    'Ignatius\' seven letters (c. 110) stress unity, Christ\'s true humanity, and faithful endurance.',
    'beginner',
  ),
  mc(
    'early-fathers-b2',
    'The "Apostolic Fathers" are best defined as:',
    [
      'Post-apostolic Christian writers near the end of the first and early second century',
      'The twelve apostles who wrote the New Testament',
      'Medieval scholastics at Paris',
      'Reformation pastors in Geneva',
    ],
    0,
    'They stand historically after the apostles; Protestants do not treat them as inspired Scripture.',
    'beginner',
  ),
  mc(
    'early-fathers-i1',
    'The Didache is:',
    [
      'An early manual of teaching and church practice',
      'A lost Gospel equal to Matthew',
      'The decree of the Council of Chalcedon',
      'A Roman tax register',
    ],
    0,
    'The Didache instructs on the two ways, baptism, prayer, and order — valuable for historical study, not canonical authority.',
    'intermediate',
  ),
  mc(
    'early-fathers-i2',
    '1 Clement (c. 96) is especially useful because it:',
    [
      'Shows late-first-century pastoral conflict at Corinth and appeals to unity',
      'Defines the Trinity at Nicaea',
      'Is part of the Protestant New Testament',
      'Was written by Thomas Aquinas',
    ],
    0,
    'Clement\'s letter from Rome to Corinth models exhortation from Scripture and early tradition under crisis.',
    'intermediate',
  ),
  mc(
    'early-fathers-a1',
    'Why are the Apostolic Fathers not considered Scripture?',
    [
      'They lack apostolic authority and were not recognized as canonical by the church\'s Spirit-guided reception of the New Testament',
      'They were all written after AD 500',
      'They contradict every New Testament book',
      'No copies survive in any language',
    ],
    0,
    'Jude 3\'s "faith once delivered" anchors the canon; later fathers are historical witnesses, not a second Bible.',
    'advanced',
  ),
  mc(
    'early-fathers-a2',
    'Reformed readers (Sproul, Beeke) value the Apostolic Fathers but insist:',
    [
      'Scripture alone is the final authority — fathers are read gratefully and critically',
      'Fathers outrank Paul when they disagree',
      'Ignatius\' bishop language must be copied without question',
      'The Didache replaces Romans for ethics',
    ],
    0,
    'Historical piety does not override sola Scriptura; development toward elevated episcopacy is noted, not automatically normative.',
    'advanced',
  ),
]

const CH4_QUESTIONS: QuizQuestion[] = [
  mc(
    'early-creeds-b1',
    'The word "creed" comes from the Latin *credo*, meaning:',
    ['"I believe"', '"I pray"', '"I follow"', '"I love"'],
    0,
    'Creeds are confessions of faith — often baptismal — summarizing what Christians believe.',
    'beginner',
  ),
  mc(
    'early-creeds-b2',
    'Early creeds primarily functioned to:',
    [
      'Summarize apostolic faith and guard against false teaching',
      'Replace reading Scripture in worship',
      'Register citizens with Rome',
      'Collect temple taxes in Jerusalem',
    ],
    0,
    'Short summaries helped catechize converts and fence public confession against Gnostic and Marcionite distortions.',
    'beginner',
  ),
  mc(
    'early-creeds-i1',
    'The "Rule of Faith" in Irenaeus (c. 180) is:',
    [
      'An early shorthand summary of core gospel truth used in teaching and discernment',
      'The Roman civil code',
      'A list of approved emperors',
      'The Septuagint table of contents only',
    ],
    0,
    'Irenaeus articulates a Trinitarian, creation-affirming storyline against Gnostic denials of the Creator and true incarnation.',
    'intermediate',
  ),
  mc(
    'early-creeds-i2',
    'Marcion (c. 140) pressured the church to clarify Scripture by:',
    [
      'Rejecting the Old Testament and editing the Gospels to fit his dualistic system',
      'Translating the Bible into Greek for the first time',
      'Affirming every writing attributed to apostles without question',
      'Banning all creeds and baptism',
    ],
    0,
    'Marcion\'s canon challenge forced clearer boundaries on what counts as apostolic Scripture — including the Old Testament.',
    'intermediate',
  ),
  mc(
    'early-creeds-a1',
    'The Apostles\' Creed in its received form:',
    [
      'Developed over time as a Western baptismal confession — "Apostles\'" signals apostolic content, not stenography by the Twelve',
      'Was dictated in English by the apostles at Pentecost',
      'Was rejected by all Protestant churches',
      'Added the homoousios clause at Nicaea in 325',
    ],
    0,
    'Historical development does not erase its value as a ministerial summary under Scripture.',
    'advanced',
  ),
  mc(
    'early-creeds-a2',
    '1 Timothy 3:16 and 1 Corinthians 15:3–8 show that:',
    [
      'Compact, ordered gospel summaries already appear within inspired Scripture',
      'Creeds are unbiblical innovations with no precedent',
      'Paul forbade any confession besides the Shema',
      'Resurrection was optional in the earliest church',
    ],
    0,
    'Creeds echo a biblical pattern of handing on the faith in memorable lines — they serve the Word, not replace it.',
    'advanced',
  ),
]

const CH5_QUESTIONS: QuizQuestion[] = [
  mc(
    'early-nicaea-b1',
    'What did Arius teach about the Son?',
    [
      'That the Son was a created being and not eternal God — "there was a time when He was not"',
      'That Jesus was only a moral teacher with no divine status',
      'That the Father, Son, and Spirit are one person in three modes',
      'That Jesus never existed historically',
    ],
    0,
    'Arius exalted the Son above creatures yet denied His full deity — destroying the basis of true salvation.',
    'beginner',
  ),
  mc(
    'early-nicaea-b2',
    'The Council of Nicaea (325) was convened to address:',
    [
      'The Arian crisis over the Son\'s relationship to the Father',
      'The date of Easter only, with no doctrinal content',
      'The Protestant Reformation',
      'The canon of the New Testament at Carthage',
    ],
    0,
    'Emperor Constantine called bishops to restore unity threatened by Alexandrian controversy over Christ\'s deity.',
    'beginner',
  ),
  mc(
    'early-nicaea-i1',
    '*Homoousios* at Nicaea means the Son is:',
    [
      'Of the same substance/essence with the Father',
      'Of similar but lesser substance (*homoiousios*)',
      'A created demigod beneath the Father',
      'Identical to the Father with no personal distinction',
    ],
    0,
    'Same substance guards true deity; semi-Arian "similar substance" was rejected.',
    'intermediate',
  ),
  mc(
    'early-nicaea-i2',
    'Which council reaffirmed Nicaea and expanded confession of the Holy Spirit in the creed commonly used today?',
    [
      'Constantinople (381)',
      'Chalcedon (451) alone',
      'Ephesus (431) alone',
      'Trent (1545)',
    ],
    0,
    'The Niceno-Constantinopolitan Creed reflects fourth-century consolidation; 381 is the usual association for the expanded form.',
    'intermediate',
  ),
  mc(
    'early-nicaea-a1',
    'Athanasius argued in *On the Incarnation* that:',
    [
      'Only God could save; therefore the Savior must be fully God and fully man',
      'Christ\'s deity was optional for salvation',
      'Arius was correct but imprecise',
      'The Spirit is not divine',
    ],
    0,
    'Christology and soteriology stand together: a creature cannot bear the weight of divine atonement.',
    'advanced',
  ),
  mc(
    'early-nicaea-a2',
    '*Homoiousios* ("similar substance") was the hallmark of:',
    [
      'Semi-Arian positions rejected at Nicaea',
      'Nicene orthodoxy',
      'Modalism',
      'Docetism',
    ],
    0,
    'The iota difference mattered: similar substance stops short of full deity with the Father.',
    'advanced',
  ),
]

export const EARLY_CHURCH: CurriculumTopic = {
  id: 'early-church',
  title: 'Early Church (c. 30–500)',
  description:
    'A chronological introduction to the apostolic setting, persecution and expansion, the Apostolic Fathers, early creeds, and Nicaea with the Arian controversy — from a historic Reformed evangelical perspective with verified primary sources and fair notes on other Christian readings.',
  objectives: [
    'Locate the apostolic church in its Jewish and Greco-Roman setting (Acts, Galatians 4:4, Acts 15).',
    'Explain why Christians were persecuted and how the church still expanded.',
    'Use the Apostolic Fathers as historical witnesses under Scripture\'s final authority.',
    'Trace why creeds and the Rule of Faith arose to guard apostolic truth.',
    'Summarize the Arian controversy and Nicene confession that Jesus is true God of true God.',
  ],
  estimatedMinutes: 90,
  prerequisites: [],
  framework: 'reformed',
  domain: 'church-history',
  era: 'early',
  eraLabel: 'Early Church (c. 30–500)',
  contentStatus: 'full',
  version: 2,
  sources: [
    {
      ...SOURCE_SCHAFF_ORG,
      note:
        'Chronological scaffold for eras, councils, and primary-document orientation (Part 3 CH.1–CH.5). Lesson prose is original; Schaff is not copied.',
      approxDate: '19th century (PD editions)',
      rightsNote: 'Older Schaff editions are public domain; modern reprints with new notes may still be copyrighted.',
    },
    {
      ...SOURCE_NEEDHAM_SUP,
      note: 'Supplementary narrative emphasis on people, persecution, and pastoral courage — themes only.',
    },
    {
      ...SOURCE_GONZALEZ_SUP,
      note: 'Supplementary reminder to present Catholic, Orthodox, and Protestant receptions of early history without caricature.',
    },
  ],
  lessons: [
    {
      id: 'early-apostolic-setting',
      order: 1,
      title: 'The Apostolic Setting',
      estimatedMinutes: 18,
      objectives: {
        beginner: [
          'Describe the world into which Christianity came and why the gospel spread.',
        ],
        intermediate: [
          'Explain Roman roads, Koine Greek, the Septuagint, synagogues, and the Jerusalem Council (Acts 15).',
        ],
        advanced: [
          'Discuss Galatians 4:4, diaspora background, the Jewish–Gentile question, and effects of AD 70.',
        ],
      },
      primaryPassages: [
        passage('acts', 'Acts', 2, 41, 47),
        passage('galatians', 'Galatians', 4, 4, 4),
      ],
      supportingPassages: [
        passage('acts', 'Acts', 15, 1, 35),
        passage('romans', 'Romans', 1, 14, 16),
        passage('acts', 'Acts', 8, 1, 4),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'When the fullness of time came',
          body:
            'Paul says Christ came "when the fullness of time had come" (Galatians 4:4). Roman peace (*Pax Romana*), Koine Greek, roads and sea routes, and synagogues in cities across the empire gave apostles an audience already touched by Israel\'s Scriptures. The Septuagint (Greek Old Testament) carried the Bible to Gentile readers; many New Testament citations follow it.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('acts', 'Acts', 15, 1, 21),
          note:
            'Interpretation: The Jerusalem Council (c. AD 49) upheld salvation by grace for Gentiles without requiring circumcision for justification, while urging holiness and love for Jewish sensitivities.',
        },
        {
          kind: 'concept',
          term: 'Septuagint (LXX)',
          explanation:
            'A Greek translation of the Hebrew Scriptures used widely in the diaspora — a bridge language for preaching Christ from the Old Testament in the Greco-Roman world.',
        },
        {
          kind: 'distinction',
          biblical:
            'Acts narrates Pentecost, persecution scattering witness, and the gospel advancing to the nations under Christ\'s commission; Galatians 4:4–5 anchors the mission in God\'s timing.',
          interpretation:
            'Reformed evangelicals read Acts as trustworthy history and theology: Christ builds His church by Word and Spirit. Later polity developments are measured by apostolic Scripture.',
          disagreement:
            'Roman Catholic and Eastern Orthodox traditions emphasize episcopal succession and sacred tradition alongside Scripture. Some critical scholars treat Acts as idealized; this curriculum affirms Luke\'s reliability while noting historical debate on details.',
        },
        {
          kind: 'teaching',
          title: 'After AD 70',
          body:
            'The destruction of Jerusalem and the temple (AD 70) ended the sacrificial system and sharpened separation between synagogue and church — a major hinge in both Jewish and Christian history.',
          level: 'advanced',
        },
        {
          kind: 'attribution',
          teacherId: 'schaff',
          work: 'History of the Christian Church, vol. 1',
          note: 'Organizational chronology for the apostolic age — not a substitute for Acts.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'order',
          prompt: 'Place these milestones in relative chronological order.',
          items: [
            'Christ\'s death and resurrection in Jerusalem',
            'Pentecost and the Jerusalem church (Acts 2)',
            'Jerusalem Council on Gentile believers (Acts 15)',
            'Gospel spread across the Mediterranean under the apostles',
          ],
          answerOrder: [0, 1, 2, 3],
          explanation:
            'The story moves from Christ\'s finished work to Spirit-empowered witness, then Gentile inclusion, then widening mission.',
        },
      ],
      questions: CH1_QUESTIONS,
      reflectionPrompts: [
        'How has your culture made it easier or harder for people to hear the gospel? Pray for faithfulness like the apostles in Acts.',
      ],
      furtherStudy: [
        'Read Acts 1–2 and Acts 15 in one sitting and note Luke\'s themes.',
        'Skim Schaff or Gonzalez vol. 1 introduction to the apostolic age (public-domain editions).',
      ],
    },
    {
      id: 'early-persecution-expansion',
      order: 2,
      title: 'Persecution of Early Christians',
      estimatedMinutes: 18,
      objectives: {
        beginner: [
          'Explain why early Christians were persecuted and how they were called to respond.',
        ],
        intermediate: [
          'Place major persecutions in rough order and explain the Pliny–Trajan exchange.',
        ],
        advanced: [
          'Discuss the lapsi, Donatist tensions, and a biblical theology of martyrdom without romanticizing violence.',
        ],
      },
      primaryPassages: [passage('1peter', '1 Peter', 4, 12, 19)],
      supportingPassages: [
        passage('matthew', 'Matthew', 5, 10, 12),
        passage('acts', 'Acts', 8, 1, 4),
        passage('revelation', 'Revelation', 2, 8, 11),
        passage('john', 'John', 15, 18, 21),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Suspicion and witness',
          body:
            'Christians were accused of atheism (rejecting pagan gods), disloyalty to the imperial cult, and antisocial secrecy. Persecution was often local and episodic — Nero (AD 64), Domitian, Pliny and Trajan (c. 112), Polycarp (c. 155–156), Decius (250), Diocletian (303) — not one unbroken empire-wide hunt every year. The Edict of Milan (313) granted toleration.',
        },
        {
          kind: 'concept',
          term: 'Martyr',
          explanation:
            'From Greek *martys* ("witness"): one who seals testimony to Christ with death. Honored in Scripture and tradition, but martyrdom does not save — Christ alone saves.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('1peter', '1 Peter', 4, 12, 16),
          note:
            'Interpretation: Fiery trials can be fellowship in Christ\'s sufferings; believers glorify God whether they live or die faithfully.',
        },
        {
          kind: 'distinction',
          biblical:
            'Matthew 5:10–12, John 15:18–21, and Revelation 2:10 promise opposition and call for endurance; Acts 8:1–4 links scattering with wider preaching.',
          interpretation:
            'Reformed reading expects hostility where Christ is Lord, but not every political difficulty equals persecution for righteousness.',
          disagreement:
            'Some traditions emphasize martyr cults and relics heavily; secular historians stress social networks in expansion. Both can inform, but neither replaces theological confession of the Spirit\'s work.',
        },
        {
          kind: 'attribution',
          teacherId: 'needham',
          work: '2,000 Years of Christ\'s Power',
          note: 'Supplementary storytelling on persecution — tether devotion to Scripture, not legend alone.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'true_false',
          prompt:
            'Roman persecution of Christians was continuous, identical in intensity, and empire-wide in every decade of the first three centuries.',
          answer: false,
          explanation:
            'Historians describe intermittent, often local persecution — avoid flattening every decade into one undifferentiated "Age of Martyrs."',
        },
        {
          kind: 'order',
          prompt: 'Order these events in relative sequence (approximate dates).',
          items: [
            'Nero blames Christians after the fire of Rome (AD 64)',
            'Pliny asks Trajan how to handle accused Christians (c. 112)',
            'Great Persecution under Diocletian begins (303)',
            'Edict of Milan grants toleration (313)',
          ],
          answerOrder: [0, 1, 2, 3],
          explanation:
            'Persecution intensifies at points, then toleration arrives — growth continued through ordinary witness as well as heroic deaths.',
        },
      ],
      questions: CH2_QUESTIONS,
      reflectionPrompts: [
        'Ask God for courage to confess Christ where it costs reputation — and wisdom not to label every conflict as martyrdom.',
      ],
      furtherStudy: [
        'Read Tacitus, *Annals* 15.44 (Nero) and Pliny, *Epistle* 10.96 in a public-domain translation.',
        'Read the *Martyrdom of Polycarp* (short) for early church response to execution.',
      ],
      reviewFromLessonIds: ['early-apostolic-setting'],
    },
    {
      id: 'early-apostolic-fathers',
      order: 3,
      title: 'The Apostolic Fathers',
      estimatedMinutes: 18,
      objectives: {
        beginner: [
          'Name leaders who followed the apostles and what their writings show about early church life.',
        ],
        intermediate: [
          'Describe the genre and value of Apostolic Fathers writings (Clement, Ignatius, Didache, Polycarp).',
        ],
        advanced: [
          'Evaluate their teaching on grace, works, and church order under Scripture\'s final authority.',
        ],
      },
      primaryPassages: [passage('jude', 'Jude', 1, 3, 3)],
      supportingPassages: [
        passage('2timothy', '2 Timothy', 2, 2, 2),
        passage('philippians', 'Philippians', 1, 1, 1),
        passage('1timothy', '1 Timothy', 3, 1, 13),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'After the apostles',
          body:
            'The Apostolic Fathers (c. AD 95–150) include Clement of Rome (1 Clement, c. 96), Ignatius of Antioch (seven letters, c. 110), Polycarp, the Didache, Barnabas, Hermas, and Diognetus. They illuminate worship, conflict, and Christology after the New Testament — but are not inspired.',
        },
        {
          kind: 'primary_source',
          authorOrBody: PRIMARY_1_CLEMENT.authorOrBody,
          work: PRIMARY_1_CLEMENT.work,
          approxDate: PRIMARY_1_CLEMENT.approxDate,
          context:
            'Written from Rome to Corinth amid leadership strife, 1 Clement urges repentance, humility, and orderly love from Old Testament examples.',
          significance:
            'Early evidence of Roman–Corinthian relations and pastoral use of Scripture in conflict. Reformed readers learn from its moral earnestness while keeping the New Testament normative.',
          rightsNote: PRIMARY_1_CLEMENT.rightsNote,
          reference: PRIMARY_1_CLEMENT.reference,
        },
        {
          kind: 'concept',
          term: 'Apostolic Fathers',
          explanation:
            'Early post-apostolic writers valued for history and piety — not received as canonical Scripture in the Protestant canon.',
        },
        {
          kind: 'distinction',
          biblical:
            'Jude 3 and 2 Timothy 1:13–14 call the church to guard the delivered faith; Hebrews 13:7 honors past leaders.',
          interpretation:
            'Reformed evangelicals read these fathers gratefully and critically — subordinate to Scripture, attentive where practice develops beyond the New Testament pattern.',
          disagreement:
            'Catholic and Orthodox accounts weigh tradition more heavily; some Protestants ignore fathers entirely. This curriculum avoids both extremes.',
        },
        {
          kind: 'attribution',
          teacherId: 'schaff',
          work: 'Ante-Nicene Fathers orientation',
          note: 'Standard Protestant histories introduce this layer immediately after the apostolic age.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'match',
          prompt: 'Which description best fits the Apostolic Fathers?',
          target: 'Apostolic Fathers',
          choices: [
            'Inspired New Testament authors',
            'Post-apostolic writers near the apostolic generation',
            'Medieval scholastics',
            'Nineteenth-century revivalists',
          ],
          answer: 1,
          explanation:
            'Historical witnesses near the apostles — valuable, not a third Testament.',
        },
      ],
      questions: CH3_QUESTIONS,
      reflectionPrompts: [
        'Ask God for humility to learn from earlier Christians and discernment to test every tradition by Scripture.',
      ],
      furtherStudy: [
        'Read 1 Clement 1–3 in a public-domain ANF edition.',
        'Skim Ignatius\'s letter to the Smyrneans on Christ\'s flesh (anti-docetic theme).',
      ],
      reviewFromLessonIds: ['early-apostolic-setting', 'early-persecution-expansion'],
    },
    {
      id: 'early-creeds',
      order: 4,
      title: 'Early Christian Creeds',
      estimatedMinutes: 18,
      objectives: {
        beginner: [
          'Explain what a creed is and why the church wrote them.',
        ],
        intermediate: [
          'Describe the Rule of Faith and the development of the Apostles\' Creed.',
        ],
        advanced: [
          'Trace the Old Roman Creed, responses to Marcion and Gnosticism, and the relationship of creed to canon.',
        ],
      },
      primaryPassages: [
        passage('1corinthians', '1 Corinthians', 15, 3, 8),
        passage('1timothy', '1 Timothy', 3, 14, 16),
      ],
      supportingPassages: [
        passage('philippians', 'Philippians', 2, 5, 11),
        passage('jude', 'Jude', 1, 3, 3),
        passage('2john', '2 John', 1, 7, 11),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'I believe',
          body:
            '"Creed" comes from Latin *credo* ("I believe"). As the church catechized converts and answered Gnosticism (denying the good Creator and true humanity of Christ) and Marcion (rejecting the Old Testament and editing Gospels), leaders summarized the Rule of Faith — Father, Son, Spirit, creation, incarnation, resurrection, church, and coming judgment.',
        },
        {
          kind: 'primary_source',
          authorOrBody: PRIMARY_APOSTLES_CREED.authorOrBody,
          work: PRIMARY_APOSTLES_CREED.work,
          approxDate: PRIMARY_APOSTLES_CREED.approxDate,
          context:
            'Western baptismal confession growing from the Old Roman Creed; the title "Apostles\'" marks apostolic content, not authorship by the Twelve in the final form.',
          excerpt:
            'I believe in God the Father Almighty, Maker of heaven and earth: And in Jesus Christ his only Son our Lord… I believe in the Holy Ghost; the holy catholic Church; the communion of saints; the forgiveness of sins; the resurrection of the body; and the life everlasting.',
          significance:
            'Shared summary across many churches; Reformed bodies often retain it as ministerial, under Scripture\'s final authority.',
          rightsNote: PRIMARY_APOSTLES_CREED.rightsNote,
          reference: PRIMARY_APOSTLES_CREED.reference,
        },
        {
          kind: 'scripture_focus',
          passage: passage('1corinthians', '1 Corinthians', 15, 3, 4),
          note:
            'Interpretation: Paul "delivers" a compact gospel summary — death, burial, resurrection according to the Scriptures — a biblical precedent for creed-like forms.',
        },
        {
          kind: 'distinction',
          biblical:
            'The New Testament contains hymnic and confessional material (Phil 2:5–11; 1 Tim 3:16) and commands to guard sound teaching.',
          interpretation:
            'Reformed evangelicalism welcomes creeds as ministerial summaries faithful to Scripture — not magisterial beside the Word.',
          disagreement:
            'Some free-church groups avoid all creeds; some catholic traditions treat creed and magisterium as co-authoritative. This curriculum holds creeds accountable to Scripture.',
        },
        {
          kind: 'attribution',
          teacherId: 'gonzalez',
          work: 'The Story of Christianity',
          note: 'Creeds formed in worship and conflict, not in a vacuum — narrative history reminder.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'true_false',
          prompt:
            'The Apostles\' Creed was written in its present English form by the twelve apostles at Pentecost.',
          answer: false,
          explanation:
            'The received Western form developed over centuries as a baptismal confession.',
        },
      ],
      questions: CH4_QUESTIONS,
      reflectionPrompts: [
        'Pray through one line of the Apostles\' Creed slowly, asking God to make its biblical truths living rather than routine.',
      ],
      furtherStudy: [
        'Compare 1 Corinthians 15:1–8 with the Apostles\' Creed — what overlaps?',
        'Read Irenaeus, *Against Heresies* I.10 (Rule of Faith) in ANF.',
      ],
      reviewFromLessonIds: ['early-apostolic-fathers'],
    },
    {
      id: 'early-nicaea-arian',
      order: 5,
      title: 'Nicaea and the Arian Controversy',
      estimatedMinutes: 18,
      objectives: {
        beginner: [
          'State what Arius taught and why the church judged it incompatible with the gospel.',
        ],
        intermediate: [
          'Summarize Nicaea (325) and the meaning of homoousios.',
        ],
        advanced: [
          'Trace Athanasius, the Cappadocians, Constantinople (381), and homoousios versus homoiousios.',
        ],
      },
      primaryPassages: [
        passage('john', 'John', 1, 1, 3),
        passage('colossians', 'Colossians', 1, 15, 20),
      ],
      supportingPassages: [
        passage('hebrews', 'Hebrews', 1, 1, 4),
        passage('philippians', 'Philippians', 2, 5, 11),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'There was a time when He was not?',
          body:
            'Arius (c. 318, Alexandria) taught the Son as greatest creature — not eternal God. If the Savior is created, He cannot save. Alexander and Athanasius opposed him. Constantine convened Nicaea (325); bishops confessed the Son begotten, not made, homoousios with the Father. Debate continued for decades (*Athanasius contra mundum*). The Cappadocians (Basil, Gregory of Nazianzus, Gregory of Nyssa) clarified one ousia, three hypostases. Constantinople (381) reaffirmed and expanded Spirit confession — the creed commonly recited reflects this later form.',
        },
        {
          kind: 'primary_source',
          authorOrBody: PRIMARY_NICENE_CREED.authorOrBody,
          work: PRIMARY_NICENE_CREED.work,
          approxDate: PRIMARY_NICENE_CREED.approxDate,
          context:
            'Liturgical form reflects Nicene faith reaffirmed and expanded in the later fourth century.',
          excerpt:
            'We believe in one God, the Father Almighty… And in one Lord Jesus Christ, the only-begotten Son of God, begotten of the Father before all worlds; God of God, Light of Light, very God of very God; begotten, not made, being of one substance with the Father…',
          significance:
            'Guards the gospel: only if the Son is true God does incarnation and cross reconcile us to God. Reformed churches receive Nicene Christology while Scripture remains final authority.',
          rightsNote: PRIMARY_NICENE_CREED.rightsNote,
          reference: PRIMARY_NICENE_CREED.reference,
        },
        {
          kind: 'primary_source',
          authorOrBody: PRIMARY_ATHANASIUS_INCARNATION.authorOrBody,
          work: PRIMARY_ATHANASIUS_INCARNATION.work,
          approxDate: PRIMARY_ATHANASIUS_INCARNATION.approxDate,
          context:
            'Athanasius defends Nicene faith and explains why the Word became flesh for salvation.',
          significance:
            'Christology is soteriology: who Christ is determines whether He can save. Use public-domain NPNF editions for exact wording.',
          rightsNote: PRIMARY_ATHANASIUS_INCARNATION.rightsNote,
          reference: PRIMARY_ATHANASIUS_INCARNATION.reference,
        },
        {
          kind: 'concept',
          term: 'Homoousios',
          explanation:
            'Greek "of one substance" with the Father — Nicene guardrail that the Son is true God, not a semi-divine creature (*homoiousios*).',
        },
        {
          kind: 'distinction',
          biblical:
            'John 1:1–3 and Colossians 1:15–17 present the Son as eternal agent of creation and fully divine; Hebrews 1 contrasts Son with angels.',
          interpretation:
            'Reformed evangelicals affirm Nicene language as faithful conceptual summary of biblical teaching, not a replacement for Scripture.',
          disagreement:
            'Arians and modern subordinationist groups deny full deity. Legends that Constantine invented Christ\'s divinity ignore pre-Nicene worship of Jesus and the biblical text itself.',
        },
        {
          kind: 'attribution',
          teacherId: 'schaff',
          work: 'History of the Christian Church, vol. 3',
          note: 'Fourth-century doctrinal hinge — chronology followed, prose original.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'order',
          prompt: 'Order these items in the controversy\'s relative sequence.',
          items: [
            'Arius teaches the Son as created (c. 318)',
            'Council of Nicaea confesses homoousios (325)',
            'Ongoing conflict; Athanasius exiled multiple times',
            'Niceno-Constantinopolitan creed form associated with 381',
          ],
          answerOrder: [0, 1, 2, 3],
          explanation: 'Nicaea answers the outbreak; decades of clarification follow.',
        },
        {
          kind: 'match',
          prompt: 'Match the term to its Nicene meaning.',
          target: 'homoousios',
          choices: [
            'Of one substance with the Father',
            'Of similar but lesser substance',
            'A denial of Christ\'s humanity',
            'A medieval papal indulgence doctrine',
          ],
          answer: 0,
          explanation: 'Same substance — true deity with the Father, not supreme creature.',
        },
      ],
      questions: CH5_QUESTIONS,
      reflectionPrompts: [
        'Worship the Son as true God, and reject any teaching that makes Jesus merely the highest creature.',
      ],
      furtherStudy: [
        'Read John 1:1–18 and list claims about the Word\'s deity and incarnation.',
        'Skim Athanasius, *On the Incarnation* §§1–9 in NPNF (public domain).',
      ],
      reviewFromLessonIds: ['early-creeds', 'early-apostolic-fathers'],
    },
  ],
}
