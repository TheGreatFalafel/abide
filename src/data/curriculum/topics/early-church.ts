import type { CurriculumTopic } from '../types'
import {
  PRIMARY_1_CLEMENT,
  PRIMARY_APOSTLES_CREED,
  PRIMARY_ATHANASIUS_INCARNATION,
  PRIMARY_NICENE_CREED,
  SOURCE_GONZALEZ_SUP,
  SOURCE_NEEDHAM_SUP,
  SOURCE_SCHAFF_ORG,
} from '../historySources'
import { mc, open, passage } from './_helpers'

/**
 * Early Church (c. 30–500) — first Church History era topic.
 * Content is original Abide teaching. Primary excerpts are verified public-domain
 * creed/liturgical wording or summary-only references to PD editions.
 */
export const EARLY_CHURCH: CurriculumTopic = {
  id: 'early-church',
  title: 'Early Church (c. 30–500)',
  description:
    'A chronological introduction to the apostolic church, persecution and expansion, the Apostolic Fathers, the rise of creeds, and the Council of Nicaea with the Arian controversy — taught from a historic Reformed evangelical perspective while naming other Christian readings fairly.',
  objectives: [
    'Locate the apostolic church in its first-century Jewish and Greco-Roman setting.',
    'Explain how persecution and mission shaped Christian identity and expansion.',
    'Identify the Apostolic Fathers and what their letters reveal about post-apostolic churches.',
    'Trace why early creeds developed as summaries of apostolic faith.',
    'Explain the Arian controversy and the Nicene confession that Jesus is true God of true God.',
  ],
  estimatedMinutes: 100,
  prerequisites: [],
  framework: 'reformed',
  domain: 'church-history',
  era: 'early',
  eraLabel: 'Early Church (c. 30–500)',
  version: 1,
  sources: [
    {
      ...SOURCE_SCHAFF_ORG,
      note:
        'Organizational map for chronological eras, councils, and primary-document orientation. Lesson prose is original; Schaff’s public-domain narrative is used as a historical scaffold, not copied.',
      approxDate: '19th century (PD editions)',
      rightsNote: 'Older Schaff editions are public domain; modern reprints with new notes may still be copyrighted.',
    },
    {
      ...SOURCE_NEEDHAM_SUP,
      note:
        'Supplementary evangelical storytelling emphasis for people, controversies, and pastoral significance. Themes only — no chapter reproduction.',
    },
    {
      ...SOURCE_GONZALEZ_SUP,
      note:
        'Supplementary reminder to present Catholic, Orthodox, and Protestant receptions of early history without caricature. Themes only — no chapter reproduction.',
    },
  ],
  lessons: [
    {
      id: 'early-apostolic-setting',
      order: 1,
      title: 'The Apostolic Church and Its Setting',
      estimatedMinutes: 18,
      objectives: [
        'Describe the Jewish roots and Greco-Roman setting of the first Christian communities.',
        'Explain how Acts portrays the church’s earliest mission under apostolic leadership.',
        'Distinguish New Testament narrative from later institutional developments.',
      ],
      primaryPassages: [passage('acts', 'Acts', 2, 41, 47)],
      supportingPassages: [
        passage('acts', 'Acts', 15, 1, 11),
        passage('galatians', 'Galatians', 2, 1, 10),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Why begin here',
          body:
            'Church history does not replace Scripture; it asks how Christians lived, taught, suffered, and organized after the resurrection of Jesus. The apostolic age (roughly the lifetime of the apostles) is the hinge: the gospel goes from Jerusalem into the wider Mediterranean world under the Spirit’s power and apostolic witness.',
        },
        {
          kind: 'teaching',
          title: 'Historical setting',
          body:
            'The first believers were overwhelmingly Jewish, worshiping the God of Israel while confessing Jesus as Messiah and Lord. They lived under Roman imperial order, Greek language and cities, synagogue networks, and household structures that shaped travel, hospitality, and gathering. Understanding that setting helps explain why controversies about Law, Gentile inclusion, and idolatry appear so quickly.',
        },
        {
          kind: 'concept',
          term: 'Apostolic age',
          explanation:
            'The period of the apostles’ living witness and foundational teaching — roughly the mid–late first century — before the church’s later episcopal and conciliar developments become the main storyline.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('acts', 'Acts', 2, 42, 47),
          note:
            'Interpretation: Luke summarizes a Spirit-formed community devoted to apostolic teaching, fellowship, breaking of bread, and prayers — a biblical pattern for church life, not a complete constitution for every later polity.',
        },
        {
          kind: 'distinction',
          biblical:
            'Acts narrates Pentecost, apostolic preaching, shared life, and the gospel’s advance from Jerusalem toward the nations under the risen Christ’s commission.',
          interpretation:
            'Reformed evangelicals receive Acts as inspired history and theology: Christ builds his church by Word and Spirit. Later bishops, councils, and traditions are measured by apostolic Scripture rather than treated as equal authorities beside it.',
          disagreement:
            'Roman Catholic and Eastern Orthodox Christians often emphasize unbroken episcopal succession and sacred tradition as living with Scripture. Some critical scholars treat Acts as idealized memory more than straightforward reportage. This curriculum affirms Luke’s trustworthiness while acknowledging that historians debate chronology and emphasis in places.',
        },
        {
          kind: 'attribution',
          teacherId: 'schaff',
          work: 'History of the Christian Church',
          note:
            'Organizational cue: Schaff’s early volumes open with the apostolic age as the seedbed of later catholic Christianity — useful chronology, not a substitute for Acts.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'order',
          prompt: 'Place these early milestones in chronological order (relative sequence).',
          items: [
            'Jesus’ death and resurrection in Jerusalem',
            'Pentecost and the growth of the Jerusalem church (Acts 2)',
            'Gentile mission controversies and the Jerusalem Council (Acts 15)',
            'Spread of churches across the Mediterranean under apostolic ministry',
          ],
          answerOrder: [0, 1, 2, 3],
          explanation:
            'The church’s story begins with Christ’s finished work, then Spirit-empowered witness in Jerusalem, then hard questions about Gentile inclusion, then widening mission — not the reverse.',
        },
      ],
      questions: [
        mc(
          'early-apostolic-q1',
          'The earliest Christian communities were primarily:',
          [
            'A Roman civil religion invented in the fourth century',
            'Jewish believers confessing Jesus as Messiah within a Greco-Roman world',
            'A medieval monastic order',
            'A purely philosophical school with no worship gatherings',
          ],
          1,
          'The New Testament places the church’s beginning among Jewish disciples in a Greco-Roman setting.',
        ),
        mc(
          'early-apostolic-q2',
          'In Reformed evangelical reading, later church traditions are finally measured by:',
          [
            'Imperial edicts alone',
            'Apostolic Scripture as the final authority',
            'Whatever the majority culture prefers',
            'Only unwritten oral lore without a text',
          ],
          1,
          'Sola Scriptura does not deny history’s value; it insists Scripture remains the final court of appeal.',
        ),
        open(
          'early-apostolic-open',
          'Name one feature of the Greco-Roman or Jewish setting that shaped early Christian mission.',
        ),
      ],
      reflectionPrompts: [
        'Thank God for the apostolic witness in Acts, and name one way the church today should still prioritize apostolic teaching over cultural fashion.',
      ],
      furtherStudy: [
        'Read Acts 1–2 and list what Luke emphasizes about the church’s earliest habits.',
        'Skim a public-domain overview of the apostolic age (e.g., Schaff) and note where narrative history goes beyond what Acts itself states.',
      ],
    },
    {
      id: 'early-persecution-expansion',
      order: 2,
      title: 'Persecution and Expansion',
      estimatedMinutes: 18,
      objectives: [
        'Explain why Roman authorities sometimes persecuted Christians.',
        'Describe how suffering and mission interacted in the church’s growth.',
        'Identify martyrdom’s theological meaning without romanticizing violence.',
      ],
      primaryPassages: [passage('1peter', '1 Peter', 4, 12, 16)],
      supportingPassages: [
        passage('acts', 'Acts', 8, 1, 4),
        passage('revelation', 'Revelation', 2, 8, 11),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Pressure and witness',
          body:
            'From local synagogue conflicts to imperial suspicion, early Christians faced social stigma and, at times, lethal persecution. Rome did not always hunt Christians systematically; persecution was often local, episodic, and tied to charges of atheism (rejecting the gods), disloyalty, or social disruption. Yet the blood of martyrs became a powerful testimony — and a temptation to treat suffering as automatic proof of truth.',
        },
        {
          kind: 'concept',
          term: 'Martyr',
          explanation:
            'From the Greek for “witness”: a Christian who seals testimony to Christ with death. Martyrdom is honored in Scripture and early tradition, but it is not a sacrament that saves; Christ alone saves.',
        },
        {
          kind: 'teaching',
          title: 'Expansion alongside suffering',
          body:
            'Acts already links persecution with wider preaching (e.g., believers scattered after Stephen’s death). Over the second and third centuries, Christianity spread through households, trade routes, cities, and patient catechesis — not only through dramatic arena scenes. Growth was uneven by region and decade.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('1peter', '1 Peter', 4, 12, 16),
          note:
            'Interpretation: Peter prepares believers for fiery trials as participation in Christ’s sufferings, calling them to glorify God — neither seeking persecution nor denying Christ to escape it.',
        },
        {
          kind: 'distinction',
          biblical:
            '1 Peter and Acts record real hostility against Christians and call for faithful endurance; Revelation comforts churches under pressure with Christ’s victory.',
          interpretation:
            'Reformed reading treats persecution as expected in a fallen world opposed to Christ’s lordship, while refusing to equate every political setback with the mark of the true church. Faithfulness is measured by adherence to the gospel, not by body count.',
          disagreement:
            'Some traditions emphasize martyr cults and relics more heavily; others spiritualize suffering. Secular historians may explain expansion mainly by social networks and demographics — insights that can complement, but not replace, theological confession of the Spirit’s work.',
        },
        {
          kind: 'attribution',
          teacherId: 'needham',
          work: '2,000 Years of Christ’s Power',
          note:
            'Supplementary emphasis: evangelical narrative histories often linger on persecution stories to stir courage — useful devotionally when tethered to Scripture rather than legend alone.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'true_false',
          prompt:
            'Roman persecution of Christians was continuous, empire-wide, and identically intense in every decade of the first three centuries.',
          answer: false,
          explanation:
            'Historians generally describe persecution as intermittent and often local. Treating every decade as the same “Age of Martyrs” flattens the evidence.',
        },
      ],
      questions: [
        mc(
          'early-persecution-q1',
          'A common Roman accusation against Christians was that they were “atheists” because they:',
          [
            'Denied the existence of any spiritual realm',
            'Refused to honor the traditional gods and imperial cult',
            'Rejected all moral teaching',
            'Worshiped only the emperor',
          ],
          1,
          'Refusal to participate in civic cults looked like atheism and disloyalty to pagan neighbors and officials.',
        ),
        mc(
          'early-persecution-q2',
          'According to this lesson, martyrdom:',
          [
            'Automatically saves the martyr apart from Christ',
            'Is a witness sealed by death, honored but not a second gospel',
            'Proves Rome was always theologically Christian',
            'Means the church should seek death as a goal',
          ],
          1,
          'Martyrs witness; they do not replace Christ’s atonement.',
        ),
      ],
      reflectionPrompts: [
        'Ask the Lord for courage to confess Christ where it costs you reputation, and for wisdom not to confuse every conflict with persecution for righteousness.',
      ],
      furtherStudy: [
        'Compare Acts 8:1–4 with 1 Peter 4:12–19: how does Scripture relate scattering, suffering, and witness?',
      ],
      reviewFromLessonIds: ['early-apostolic-setting'],
    },
    {
      id: 'early-apostolic-fathers',
      order: 3,
      title: 'The Apostolic Fathers',
      estimatedMinutes: 20,
      objectives: [
        'Define who the Apostolic Fathers were and why they matter historically.',
        'Summarize the pastoral concerns of 1 Clement without inventing quotations.',
        'Distinguish inspired Scripture from valuable early Christian writings.',
      ],
      primaryPassages: [passage('jude', 'Jude', 1, 3, 4)],
      supportingPassages: [
        passage('2timothy', '2 Timothy', 1, 13, 14),
        passage('hebrews', 'Hebrews', 13, 7, 9),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'After the apostles',
          body:
            'The “Apostolic Fathers” is a modern label for a cluster of late-first and early-second-century Christian writings associated with leaders who stood near the apostolic generation — including 1 Clement, the letters of Ignatius, Polycarp’s letter and martyrdom tradition, the Didache, and others. They are windows into church life, conflict, and teaching after the New Testament period.',
        },
        {
          kind: 'concept',
          term: 'Apostolic Fathers',
          explanation:
            'Early post-apostolic Christian writers and documents valued for history and piety, but not received as inspired Scripture in the Protestant canon.',
        },
        {
          kind: 'primary_source',
          authorOrBody: PRIMARY_1_CLEMENT.authorOrBody,
          work: PRIMARY_1_CLEMENT.work,
          approxDate: PRIMARY_1_CLEMENT.approxDate,
          context:
            'Written from the Roman church to Corinth amid strife over church leadership, 1 Clement urges repentance, humility, and orderly love. It shows how a late-first-century church reasoned from Old Testament examples and Christian exhortation.',
          significance:
            'Histororians prize 1 Clement for early evidence of Roman–Corinthian relations, appeals to unity, and the use of Scripture in pastoral conflict. Reformed readers can learn from its moral earnestness while keeping the New Testament as the final norm.',
          rightsNote: PRIMARY_1_CLEMENT.rightsNote,
          reference: PRIMARY_1_CLEMENT.reference,
        },
        {
          kind: 'teaching',
          title: 'How to read them well',
          body:
            'These writings can correct romantic myths (the early church was not conflict-free) and warn against later anachronisms. They also show development: Ignatius stresses bishops in ways the New Testament describes with different vocabulary and density. Use them as historical witnesses, not as a second canon.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('jude', 'Jude', 1, 3, 3),
          note:
            'Interpretation: Jude calls the church to contend for the faith once for all delivered — a biblical warrant for guarding apostolic gospel even as later teachers write helpful letters.',
        },
        {
          kind: 'distinction',
          biblical:
            'Jude and the Pastoral Epistles urge the church to guard the delivered faith and sound pattern of words against distortion.',
          interpretation:
            'Reformed evangelicalism receives the Apostolic Fathers as historically important and often spiritually nourishing, yet subordinate to canonical Scripture. Where later practices exceed or obscure the New Testament, Scripture wins.',
          disagreement:
            'Some Catholic and Orthodox accounts weigh these fathers more heavily as tradition. Some Protestants ignore them entirely and lose valuable history. This curriculum reads them gratefully and critically.',
        },
        {
          kind: 'attribution',
          teacherId: 'schaff',
          work: 'History of the Christian Church / ANF orientation',
          note:
            'Organizational cue: standard Protestant church histories introduce the Apostolic Fathers immediately after the apostolic age as the first literary layer beyond the canon.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'match',
          prompt: 'Which description best fits the Apostolic Fathers?',
          target: 'Apostolic Fathers',
          choices: [
            'Inspired New Testament authors',
            'Post-apostolic Christian writers near the apostolic age',
            'Medieval scholastic theologians',
            'Nineteenth-century revival preachers',
          ],
          answer: 1,
          explanation:
            'They are early post-apostolic witnesses — valuable historically, not a Protestant third Testament.',
        },
      ],
      questions: [
        mc(
          'early-fathers-q1',
          '1 Clement is especially useful historically because it:',
          [
            'Is part of the Protestant New Testament canon',
            'Shows late-first-century pastoral conflict and appeals to unity',
            'Was written by Thomas Aquinas',
            'Defines the Nicene homoousios formula',
          ],
          1,
          '1 Clement addresses strife at Corinth and models early pastoral exhortation.',
        ),
        mc(
          'early-fathers-q2',
          'For Reformed evangelicals, the Apostolic Fathers should be treated as:',
          [
            'Equal in authority to Paul and John',
            'Historically valuable and spiritually useful, yet under Scripture',
            'Worthless forgeries with no historical value',
            'The only source for Christian doctrine',
          ],
          1,
          'Helpful witnesses remain under the final authority of Scripture.',
        ),
      ],
      reflectionPrompts: [
        'Ask God for humility to learn from earlier Christians and for discernment to test every tradition by Scripture.',
      ],
      furtherStudy: [
        'Read a public-domain translation of 1 Clement 1–3 and note how the author describes Corinth’s former reputation versus present strife.',
      ],
      reviewFromLessonIds: ['early-apostolic-setting', 'early-persecution-expansion'],
    },
    {
      id: 'early-creeds',
      order: 4,
      title: 'Early Creeds and the Rule of Faith',
      estimatedMinutes: 20,
      objectives: [
        'Explain why short confessions of faith arose in the early church.',
        'Distinguish the Apostles’ Creed’s role as a baptismal summary from later conciliar definitions.',
        'Connect creed-making to Scripture’s call to hold fast sound teaching.',
      ],
      primaryPassages: [passage('1timothy', '1 Timothy', 3, 14, 16)],
      supportingPassages: [
        passage('1corinthians', '1 Corinthians', 15, 1, 8),
        passage('2timothy', '2 Timothy', 1, 13, 14),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Why creeds?',
          body:
            'As the church catechized converts and answered distorted teachings, short summaries of the faith — often tied to baptism — helped believers confess Father, Son, and Spirit in brief, memorable form. Creeds did not aim to replace Scripture; they aimed to fence the church’s public confession against rivals.',
        },
        {
          kind: 'concept',
          term: 'Rule of faith',
          explanation:
            'An early shorthand for the church’s core apostolic gospel summary used in teaching and discernment — overlapping with what later generations call creed or confession.',
        },
        {
          kind: 'primary_source',
          authorOrBody: PRIMARY_APOSTLES_CREED.authorOrBody,
          work: PRIMARY_APOSTLES_CREED.work,
          approxDate: PRIMARY_APOSTLES_CREED.approxDate,
          context:
            'The Apostles’ Creed grew in the Western church as a baptismal confession. Its final received form is later than the apostles themselves; the name signals apostolic content, not apostolic authorship of every clause.',
          excerpt:
            'I believe in God the Father Almighty, Maker of heaven and earth: And in Jesus Christ his only Son our Lord… I believe in the Holy Ghost; the holy catholic Church; the communion of saints; the forgiveness of sins; the resurrection of the body; and the life everlasting.',
          significance:
            'It remains a shared summary across many Protestant and Catholic churches. Reformed churches often retain it as a faithful echo of biblical teaching while insisting Scripture alone binds the conscience ultimately.',
          rightsNote: PRIMARY_APOSTLES_CREED.rightsNote,
          reference: PRIMARY_APOSTLES_CREED.reference,
        },
        {
          kind: 'scripture_focus',
          passage: passage('1timothy', '1 Timothy', 3, 16, 16),
          note:
            'Interpretation: Paul cites a compact confession of Christ’s incarnation, vindication, proclamation, and glory — biblical precedent for summarizing the gospel in ordered lines.',
        },
        {
          kind: 'distinction',
          biblical:
            'The New Testament already contains creed-like summaries (e.g., 1 Corinthians 15; 1 Timothy 3:16) and commands the church to guard sound teaching.',
          interpretation:
            'Reformed evangelicalism welcomes ancient creeds insofar as they faithfully summarize Scripture. Creeds are ministerial (serving the Word), not magisterial beside the Word.',
          disagreement:
            'Some free-church traditions minimize all creeds fearing traditionalism. Some catholic traditions treat creed and magisterium as living authorities that may define doctrine beyond explicit biblical wording. This curriculum treats creeds as accountable summaries.',
        },
        {
          kind: 'attribution',
          teacherId: 'gonzalez',
          work: 'The Story of Christianity',
          note:
            'Supplementary reminder: narrative histories often show creed development as pastoral and polemical — formed in worship and conflict, not in a vacuum.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'true_false',
          prompt:
            'The Apostles’ Creed was written clause-by-clause by the twelve apostles in the first century in its present English form.',
          answer: false,
          explanation:
            'The received form developed over time as a Western baptismal creed. “Apostles’” signals apostolic content, not stenography by the Twelve.',
        },
      ],
      questions: [
        mc(
          'early-creeds-q1',
          'Early creeds primarily functioned as:',
          [
            'Replacements for reading Scripture',
            'Short public summaries of the faith for teaching and baptism',
            'Imperial tax codes',
            'Private mystical poems with no doctrinal content',
          ],
          1,
          'Creeds served catechesis and confession, especially around baptism.',
        ),
        mc(
          'early-creeds-q2',
          'In a Reformed view, a creed is best described as:',
          [
            'Equal to Scripture in authority',
            'A ministerial summary under Scripture’s final authority',
            'Useless for modern churches',
            'Binding only when the state enforces it',
          ],
          1,
          'Creeds serve the Word; they do not sit beside it as a second Bible.',
        ),
      ],
      reflectionPrompts: [
        'Pray through a line of the Apostles’ Creed slowly, asking God to make its biblical truths precious rather than merely familiar.',
      ],
      furtherStudy: [
        'Compare 1 Corinthians 15:1–8 with the Apostles’ Creed: which gospel elements overlap?',
      ],
      reviewFromLessonIds: ['early-apostolic-fathers'],
    },
    {
      id: 'early-nicaea-arian',
      order: 5,
      title: 'Nicaea and the Arian Controversy',
      estimatedMinutes: 22,
      objectives: [
        'State Arius’s basic claim about the Son and why the church judged it disastrous.',
        'Explain what the Council of Nicaea (325) confessed about the Son’s deity.',
        'Distinguish historical facts about the council from later legends and from later Constantinopolitan expansions.',
      ],
      primaryPassages: [passage('john', 'John', 1, 1, 3)],
      supportingPassages: [
        passage('colossians', 'Colossians', 1, 15, 20),
        passage('hebrews', 'Hebrews', 1, 1, 4),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'What was at stake',
          body:
            'In the early fourth century, Arius (a presbyter in Alexandria) taught in ways that made the Son a created being — exalted above all creatures, yet not eternal God. If the Son is a creature, then the One who saves is not truly God with us. The controversy forced the church to clarify biblical confession of Christ’s deity with precise language.',
        },
        {
          kind: 'concept',
          term: 'Homoousios',
          explanation:
            'Greek for “of one substance/essence” with the Father — Nicene language affirming that the Son is true God, not a semi-divine creature.',
        },
        {
          kind: 'concept',
          term: 'Arianism',
          explanation:
            'The family of teachings associated with Arius denying the full, eternal deity of the Son. Exact reconstructions of Arius’s words are debated; the pastoral issue was whether the Son is created.',
        },
        {
          kind: 'teaching',
          title: 'The Council of Nicaea (325)',
          body:
            'Emperor Constantine convened bishops at Nicaea to address the crisis threatening church unity. The council condemned Arius’s teaching and confessed the Son as begotten, not made, consubstantial with the Father. Political pressure and later debates continued for decades; Nicaea was a decisive milestone, not the end of all argument. The fuller Niceno-Constantinopolitan Creed associated with 381 expands and clarifies related Trinitarian confession.',
        },
        {
          kind: 'primary_source',
          authorOrBody: PRIMARY_NICENE_CREED.authorOrBody,
          work: PRIMARY_NICENE_CREED.work,
          approxDate: PRIMARY_NICENE_CREED.approxDate,
          context:
            'The creed’s received liturgical form reflects Nicene faith as reaffirmed and expanded in the later fourth century. It remains a baseline confession of Trinity and incarnation for catholic Christianity.',
          excerpt:
            'We believe in one God, the Father Almighty, Maker of heaven and earth, and of all things visible and invisible. And in one Lord Jesus Christ, the only-begotten Son of God, begotten of the Father before all worlds; God of God, Light of Light, very God of very God; begotten, not made, being of one substance with the Father…',
          significance:
            'This confession guards the gospel: only if the Son is true God does his incarnation and cross reconcile us to God. Reformed churches receive Nicene Christology as biblical while retaining Scripture as the final authority for all doctrine.',
          rightsNote: PRIMARY_NICENE_CREED.rightsNote,
          reference: PRIMARY_NICENE_CREED.reference,
        },
        {
          kind: 'primary_source',
          authorOrBody: PRIMARY_ATHANASIUS_INCARNATION.authorOrBody,
          work: PRIMARY_ATHANASIUS_INCARNATION.work,
          approxDate: PRIMARY_ATHANASIUS_INCARNATION.approxDate,
          context:
            'Athanasius became the leading episcopal defender of Nicene faith. On the Incarnation explains why the Word became flesh for our salvation. Exact dating is debated; its theology shaped later orthodoxy.',
          significance:
            'Athanasius helps readers see that Christology is soteriology: who Christ is determines whether he can save. Read him in public-domain NPNF editions rather than assuming every popular paraphrase is exact.',
          rightsNote: PRIMARY_ATHANASIUS_INCARNATION.rightsNote,
          reference: PRIMARY_ATHANASIUS_INCARNATION.reference,
        },
        {
          kind: 'scripture_focus',
          passage: passage('john', 'John', 1, 1, 3),
          note:
            'Interpretation: John identifies the Word as God and as the agent of creation — biblical ground for denying that the Son is a mere creature.',
        },
        {
          kind: 'distinction',
          biblical:
            'John 1 and related passages present the Son as eternal Word who is God and through whom all things were made.',
          interpretation:
            'Reformed evangelicals affirm Nicene homoousios as a faithful conceptual guardrail for biblical teaching, not as a philosophical upgrade that replaces Scripture.',
          disagreement:
            'Arians (historic and modernizing variants) subordinate the Son’s deity. Oneness Pentecostal and some unitarian groups deny classic Trinitarian distinctions. Eastern Orthodox, Roman Catholic, and confessional Protestants broadly share Nicene faith while differing on later authority questions. Legends that Constantine “invented” Christ’s deity ignore pre-Nicene Christian worship of Jesus and the biblical texts themselves.',
        },
        {
          kind: 'attribution',
          teacherId: 'schaff',
          work: 'History of the Christian Church',
          note:
            'Organizational cue: Schaff’s fourth-century volumes center the Arian controversy and Nicene settlement as the doctrinal hinge of the era — a chronology this lesson follows without copying his prose.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'order',
          prompt: 'Order these items in the controversy’s relative sequence.',
          items: [
            'Arius teaches in ways that treat the Son as a created being',
            'Council of Nicaea (325) confesses the Son as consubstantial with the Father',
            'Ongoing conflict and clarification through the later fourth century',
            'Received Niceno-Constantinopolitan creed form associated with 381',
          ],
          answerOrder: [0, 1, 2, 3],
          explanation:
            'Nicaea answers the outbreak; decades of conflict follow; the 381-associated form reflects further consolidation of Trinitarian confession.',
        },
        {
          kind: 'match',
          prompt: 'Match the term to its meaning in the Nicene settlement.',
          target: 'homoousios',
          choices: [
            'Of one substance/essence with the Father',
            'A created demigod beneath the Father',
            'A denial that Jesus was truly human',
            'A medieval papal decree about indulgences',
          ],
          answer: 0,
          explanation:
            'Homoousios affirms the Son’s full deity with the Father — “very God of very God,” not a creature.',
        },
      ],
      questions: [
        mc(
          'early-nicaea-q1',
          'Arius’s teaching was condemned because it effectively made the Son:',
          [
            'Truly man and truly God',
            'A created being rather than eternal God',
            'Identical to the Father with no personal distinction',
            'A political symbol only',
          ],
          1,
          'The heart of the crisis was the Son’s full deity versus a supreme creature.',
        ),
        mc(
          'early-nicaea-q2',
          'The Nicene confession that the Son is “of one substance with the Father” mainly guards:',
          [
            'That only the Father may be worshiped',
            'That the Son is true God, not a creature',
            'That bishops outrank Scripture',
            'That Constantine authored the New Testament',
          ],
          1,
          'Homoousios protects biblical deity of Christ against Arian reduction.',
        ),
      ],
      reflectionPrompts: [
        'Worship the Son as true God, and ask for discernment to reject any teaching that makes Jesus a mere creature or moral example alone.',
      ],
      furtherStudy: [
        'Read John 1:1–18 and list every claim about the Word’s deity and incarnation.',
        'In a public-domain NPNF edition, skim Athanasius’s On the Incarnation §§1–9 for his stated reason the Word became flesh (summary notes only if using a modern copyrighted translation).',
      ],
      reviewFromLessonIds: ['early-creeds', 'early-apostolic-fathers'],
    },
  ],
}
