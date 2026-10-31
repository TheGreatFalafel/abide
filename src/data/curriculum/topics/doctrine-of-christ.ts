import type { QuizQuestion } from '../../planQuizzes'
import type { CurriculumTopic } from '../types'
import {
  passage,
  mc,
  open,
  SOURCE_GRUDEM_ORG,
  SOURCE_SPROUL_SUP,
  SOURCE_MACARTHUR_SUP,
} from './_helpers'

/* -------------------------------------------------------------------------- */
/* Lesson 1 — The Person of Christ: One Person, Two Natures                   */
/* -------------------------------------------------------------------------- */

const L1_QUESTIONS: QuizQuestion[] = [
  mc(
    'coc-1-john1',
    'John 1:1–14 teaches that "the Word" who was with God and was God…',
    [
      'Was a created angelic being',
      'Became flesh and lived among us while remaining fully God',
      'Was only a symbol for God’s wisdom, not a person',
      'Ceased being divine the moment He was born',
    ],
    1,
    'John identifies the eternal Word as God Himself, then says this same Word "became flesh"—true deity taking on true humanity without loss of deity.',
  ),
  mc(
    'coc-1-col2',
    'Colossians 2:9 says that in Christ…',
    [
      'A portion of deity dwells symbolically',
      'The whole fullness of deity dwells bodily',
      'Deity dwells only during His miracles',
      'Deity and humanity alternate depending on the moment',
    ],
    1,
    'Paul’s language is deliberately total: the entire fullness of God’s nature is present in Christ’s actual body, not partially or occasionally.',
  ),
  mc(
    'coc-1-chalcedon',
    'The Reformed restatement of the historic Chalcedonian pattern in this lesson affirms that Christ is…',
    [
      'Two persons cooperating closely',
      'One nature that looks divine and human by turns',
      'One person with two complete natures, divine and human, united without confusion or division',
      'A divine person who only appeared to have a body',
    ],
    2,
    'Chalcedon’s enduring contribution is the "one person, two natures" grammar: the natures are not mixed into a third thing, nor is Christ split into two separate persons.',
  ),
  mc(
    'coc-1-errors',
    'Which pairing correctly matches a historic error with what it denied or confused?',
    [
      'Arianism denied Christ’s full deity; Docetism denied Christ’s full humanity',
      'Arianism denied Christ’s full humanity; Docetism denied Christ’s full deity',
      'Nestorianism merged the two natures into one; Eutychianism split Christ into two persons',
      'All four ancient errors taught exactly the same thing',
    ],
    0,
    'Arianism treated the Son as a created, lesser being (denying full deity); Docetism treated Christ’s body as only an appearance (denying full humanity). Nestorianism and Eutychianism erred in the opposite direction on the union itself.',
  ),
  open(
    'coc-1-open',
    'Why does it matter for your salvation that Jesus is fully God and fully man at the same time, rather than one or the other?',
    'Consider what a Savior who is only human, or only divine and not truly human, would be unable to accomplish for you.',
  ),
]

/* -------------------------------------------------------------------------- */
/* Lesson 2 — Incarnation and Earthly Ministry                                */
/* -------------------------------------------------------------------------- */

const L2_QUESTIONS: QuizQuestion[] = [
  mc(
    'cil-2-luke1',
    'Luke 1:26–38 records that Mary conceived Jesus…',
    [
      'Through ordinary marital union with Joseph',
      'By the Holy Spirit’s power, without a human father',
      'By adopting a child already born',
      'As a purely symbolic, non-historical story',
    ],
    1,
    'The angel tells Mary that the Holy Spirit will come upon her; the virgin conception is presented as a genuine historical miracle, not a later legend.',
  ),
  mc(
    'cil-2-gal4',
    'Galatians 4:4–5 ties the incarnation ("born of a woman, born under the law") to the purpose of…',
    [
      'Demonstrating divine power with no rescue in view',
      'Redeeming those under the law so they could be adopted as children',
      'Replacing the law with a new law',
      'Proving that law-keeping saves',
    ],
    1,
    'Paul connects the timing and manner of Christ’s birth directly to redemption and adoption—the incarnation serves a saving purpose, not mere display.',
  ),
  mc(
    'cil-2-heb4',
    'Hebrews 4:15 says that Jesus, though tempted in every way as we are, remained…',
    ['Indifferent to temptation', 'Without sin', 'Partially sinful but forgiven', 'Unable to truly sympathize with us'],
    1,
    'The writer’s point is pastoral: a genuinely tempted yet sinless high priest can sympathize with weakness while still being a spotless mediator.',
  ),
  mc(
    'cil-2-reformed',
    'This lesson’s Reformed reading of Christ’s true humanity emphasizes that He…',
    [
      'Only appeared to grow, learn, and get tired',
      'Experienced real human development and limitation while never sinning',
      'Sinned occasionally like any other human',
      'Possessed a human body but not a human mind or will',
    ],
    1,
    'Luke 2:52 shows Jesus genuinely growing in wisdom and stature. Real humanity includes real development and dependence, without this ever requiring sin.',
  ),
  open(
    'cil-2-open',
    'How does picturing Jesus as a real child who grew, learned, and depended on His parents change the way you relate to Him as an adult believer?',
  ),
]

/* -------------------------------------------------------------------------- */
/* Lesson 3 — The Atonement                                                   */
/* -------------------------------------------------------------------------- */

const L3_QUESTIONS: QuizQuestion[] = [
  mc(
    'ca-3-isa53',
    'Isaiah 53:4–6 describes the suffering servant as one who…',
    [
      'Suffered for His own wrongdoing',
      'Was pierced and crushed for the iniquities of others, who are healed by His wounds',
      'Avoided all suffering by divine protection',
      'Suffered merely as a moral example with no substitutionary role',
    ],
    1,
    'Isaiah’s language is substitutionary: the servant bears what others deserved, and their healing comes through His wounds, not merely His example.',
  ),
  mc(
    'ca-3-2cor5',
    '2 Corinthians 5:21 teaches that God made Christ, who did not sin, to…',
    [
      'Become an example of righteous living',
      'Become sin for us, so that we might become the righteousness of God in Him',
      'Suffer without any purpose or exchange',
      'Share equally in guilt that He himself committed',
    ],
    1,
    'Paul describes a double exchange: our sin is reckoned to the sinless Christ, and His righteousness is reckoned to those united to Him by faith.',
  ),
  mc(
    'ca-3-ps',
    'This lesson’s Reformed emphasis describes "penal substitution" as the teaching that Christ…',
    [
      'Bore the legal penalty sinners deserved, satisfying God’s justice in their place',
      'Merely modeled courageous suffering for others to imitate',
      'Defeated evil powers but did not bear any penalty',
      'Paid a ransom to Satan rather than to God’s justice',
    ],
    0,
    'Penal substitution holds that the cross is first and foundationally a legal transaction: Christ bears the punishment sin deserves so that justice and mercy meet.',
  ),
  mc(
    'ca-3-motifs',
    'According to this lesson, how should Christus Victor (Christ’s triumph over evil powers) and penal substitution be related?',
    [
      'They contradict each other and only one can be true',
      'Christus Victor is the only biblical motif and penal substitution is a later invention',
      'They are complementary biblical pictures, with penal substitution providing the foundation that explains why the victory is just',
      'Neither motif has any scriptural support',
    ],
    2,
    'Scripture presents several true pictures of the cross—victory, ransom, reconciliation, sacrifice—held together. Reformed theology treats penal substitution as the logical and legal foundation beneath the others, not their replacement.',
  ),
  open(
    'ca-3-open',
    'Which picture of the cross—substitute bearing your penalty, victor defeating evil, or peacemaker reconciling enemies—speaks most to your own life right now, and why?',
  ),
]

/* -------------------------------------------------------------------------- */
/* Lesson 4 — Resurrection and Ascension                                      */
/* -------------------------------------------------------------------------- */

const L4_QUESTIONS: QuizQuestion[] = [
  mc(
    'cra-4-1cor15',
    '1 Corinthians 15:3–8 presents the resurrection of Christ as…',
    [
      'A private vision seen by one person only',
      'An event attested by multiple named and grouped eyewitnesses, central to the gospel Paul received and passed on',
      'A later legend Paul explicitly rejects',
      'A purely spiritual event with no bodily dimension at all',
    ],
    1,
    'Paul lists Peter, the Twelve, more than five hundred believers, James, and himself—treating the resurrection as public, verifiable history foundational to the gospel.',
  ),
  mc(
    'cra-4-bodily',
    'This lesson’s Reformed reading of the resurrection insists that Christ rose…',
    [
      'As a disembodied spirit only',
      'Bodily, in a real though transformed and glorified body',
      'Symbolically, meaning His teaching simply "lived on"',
      'Only in the private faith-experience of the disciples',
    ],
    1,
    '1 Corinthians 15:20–23 treats Christ’s bodily resurrection as the "firstfruits" guaranteeing believers’ own future bodily resurrection—a merely spiritual rising could not ground that hope.',
  ),
  mc(
    'cra-4-acts1',
    'Acts 1:1–11 describes the ascension as Christ…',
    [
      'Disappearing with no visible process',
      'Being bodily taken up into heaven while the disciples watched, with a promise of His return',
      'Dying a second, final death',
      'Remaining permanently and visibly on earth',
    ],
    1,
    'Luke narrates a real, witnessed departure into heaven, paired with the angelic promise that Christ will return in the same way—anchoring future hope to a historical event.',
  ),
  mc(
    'cra-4-rom1',
    'Romans 1:4 connects the resurrection to Christ being…',
    [
      'Declared Son of God in power',
      'Demoted from His prior status',
      'Made divine for the first time at that moment',
      'Proven to be merely a good teacher',
    ],
    0,
    'The resurrection publicly vindicates and declares what was always true of the eternal Son—it does not create His divine sonship but confirms it in power before the world.',
  ),
  open(
    'cra-4-open',
    'If Christ’s resurrection is historical fact rather than metaphor, how should that change the way you face your own mortality or a current fear?',
  ),
]

/* -------------------------------------------------------------------------- */
/* Lesson 5 — Christ’s Present Ministry: Session, Intercession, Lordship      */
/* -------------------------------------------------------------------------- */

const L5_QUESTIONS: QuizQuestion[] = [
  mc(
    'cpm-5-heb7',
    'Hebrews 7:23–25 teaches that because Christ continues forever, He is able to…',
    [
      'Offer repeated sacrifices every year',
      'Save completely those who come to God through Him, always living to intercede for them',
      'Retire from His priestly role after the resurrection',
      'Intercede only for a limited time',
    ],
    1,
    'Unlike the Levitical priests who died and were replaced, Christ’s permanent priesthood means His intercession for His people never lapses.',
  ),
  mc(
    'cpm-5-heb4',
    'Hebrews 4:14–16 encourages believers to approach God’s throne with confidence because…',
    [
      'God no longer cares about sin',
      'They have a great high priest, Jesus, who sympathizes with weakness and offers mercy and grace in time of need',
      'Prayer is unnecessary now that Christ has ascended',
      'Only priests may approach God',
    ],
    1,
    'Christ’s ongoing sympathy as a tested yet sinless high priest is the basis for bold, confident prayer—not a reason to avoid approaching God.',
  ),
  mc(
    'cpm-5-session',
    'In this lesson, Christ’s "session" (sitting at the right hand of the Father) is best understood as…',
    [
      'A literal chair located somewhere in physical space',
      'Enthronement language describing His exalted authority and completed priestly work, not a location to be pinpointed',
      'Proof that Christ stopped being active after the ascension',
      'A temporary position He will soon vacate permanently',
    ],
    1,
    '"Sitting" after a priest’s work signaled the work was finished (unlike standing priests who repeated sacrifices); the "right hand" is royal, authoritative language, not a spatial coordinate.',
  ),
  mc(
    'cpm-5-eph1',
    'Ephesians 1:20–23 describes the ascended Christ as…',
    [
      'Subject to every authority in creation',
      'Seated far above every rule and authority, head over all things for the sake of the church',
      'Limited in His present authority until His second coming',
      'Disconnected from the church’s present life',
    ],
    1,
    'Paul describes Christ’s present reign in cosmic terms—already exercising supreme authority now, exercised specifically for His church’s good.',
  ),
  open(
    'cpm-5-open',
    'How does knowing that the risen Christ is right now interceding for you change how you pray when you feel too ashamed or tired to pray well?',
  ),
]

/**
 * Second complete theology topic: the person and work of Jesus Christ
 * (Grudem-organized Christology, with original lesson writing).
 */
export const DOCTRINE_OF_CHRIST: CurriculumTopic = {
  id: 'doctrine-of-christ',
  title: 'The Doctrine of Christ',
  description:
    'A Reformed study of who Jesus Christ is and what He has done: His eternal deity united to true humanity in one person, His incarnation and sinless life, His atoning death, His bodily resurrection and ascension, and His present reign and intercession as risen Lord.',
  objectives: [
    'Confess from Scripture that Jesus Christ is one person with two complete natures, fully God and fully man.',
    'Describe the incarnation and Christ’s true, sinless humanity without denying His full deity.',
    'Explain penal substitutionary atonement as the Reformed center of the cross while recognizing other true biblical pictures of what the cross accomplished.',
    'Affirm the bodily resurrection and ascension of Christ as historical realities that ground Christian hope.',
    'Describe Christ’s present priestly intercession and reigning lordship, and its relevance to prayer and daily life.',
  ],
  estimatedMinutes: 95,
  prerequisites: ['doctrine-of-god'],
  framework: 'reformed',
  version: 1,
  sources: [
    {
      ...SOURCE_GRUDEM_ORG,
      note:
        'Topic order and major headings follow the standard systematic sequence for Christology (person of Christ; incarnation; atonement; resurrection/ascension; present ministry) as a map for original lesson writing—not as reproduced textbook text.',
    },
    {
      ...SOURCE_SPROUL_SUP,
      note:
        'Sproul’s well-known public emphasis on the necessity and justice of the cross and on Christ’s active, present lordship supplements the lessons on the atonement and on Christ’s current reign. Claims here are original paraphrase of widely known themes, not quoted material.',
    },
    {
      ...SOURCE_MACARTHUR_SUP,
      note:
        'MacArthur’s Scripture-centered pastoral stress on the historicity of the incarnation, resurrection, and Christ’s present lordship over believers supplements application sections. No sermon transcripts are reproduced.',
    },
  ],
  lessons: [
    {
      id: 'christ-person-natures',
      order: 1,
      title: 'The Person of Christ: One Person, Two Natures',
      estimatedMinutes: 20,
      objectives: [
        'State from John 1 and Colossians 2 that Jesus Christ is fully God.',
        'Explain, in original words, the classic "one person, two natures" pattern for understanding Christ’s identity.',
        'Identify ancient errors about Christ’s person and what each denied or confused.',
      ],
      primaryPassages: [
        passage('john', 'John', 1, 1, 14),
        passage('colossians', 'Colossians', 2, 9, 9),
        passage('philippians', 'Philippians', 2, 6, 11),
      ],
      supportingPassages: [
        passage('isaiah', 'Isaiah', 9, 6, 6),
        passage('john', 'John', 20, 28, 28),
        passage('hebrews', 'Hebrews', 1, 1, 3),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Why the person of Christ anchors everything else',
          body:
            'Every later claim in this topic—what the cross accomplished, why the resurrection matters, why His intercession helps you—depends on who Jesus actually is. Scripture answers that question in a way that is easy to state but hard to exhaust: the man Jesus of Nazareth is Himself the eternal God, without His humanity being reduced or His deity being diminished.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('john', 'John', 1, 1, 14),
          note:
            'Interpretation: John opens by identifying "the Word" as eternally existing, personally distinct, and fully God, then states that this same Word became flesh and lived among people. The move from eternal deity to genuine, visible humanity is the heart of incarnational Christology.',
        },
        {
          kind: 'concept',
          term: 'Hypostatic union',
          explanation:
            'The theological term for the union of a fully divine nature and a fully human nature in the single person of Jesus Christ. "Hypostasis" means a distinct personal reality; the word signals that one person—not two, and not a blend—possesses two complete natures.',
        },
        {
          kind: 'distinction',
          biblical:
            'John 1 calls the Word fully God and says the Word became flesh. Colossians 2:9 says the whole fullness of deity dwells bodily in Christ. Philippians 2:6–11 says He existed in the form of God yet took the form of a servant, becoming human.',
          interpretation:
            'Reformed Christology reads these texts together as teaching one person who possesses, without mixture or division, a complete divine nature and a complete human nature. Neither nature swallows the other; the properties proper to deity (eternity, omniscience, omnipotence) and the properties proper to humanity (a body, growth, hunger, death) both belong to the one person, Jesus Christ.',
          disagreement:
            'Several ancient movements got this wrong in different directions. Arianism denied that the Son was fully, eternally God, treating Him as a supreme created being. Docetism denied that Christ had a real physical body, treating His humanity as only an appearance. Nestorianism was accused of so dividing the two natures that it effectively produced two persons loosely joined. Eutychianism blended the two natures into a single new nature that was neither fully divine nor fully human. The historic church rejected all four as inadequate to the biblical data; this curriculum restates, in its own words, the "one person, two natures, without confusion and without division" pattern that the wider church settled on at the Council of Chalcedon in AD 451 as a faithful summary of Scripture’s teaching, not as Scripture’s equal.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('colossians', 'Colossians', 2, 9, 9),
          note:
            'Interpretation: Paul’s wording is deliberately total—not a fraction or an occasional visitation of deity, but the entire fullness of God’s nature dwelling in a real human body. This rules out any reading that treats Jesus as merely God-inspired or God-empowered rather than God Himself incarnate.',
        },
        {
          kind: 'teaching',
          title: 'A pattern to hold, not a puzzle to fully solve',
          body:
            'Reformed theology does not claim to explain every mechanical detail of how two natures unite in one person; it claims that Scripture requires us to affirm both truths fully and simultaneously, resisting the temptation to relieve the tension by quietly diminishing one side. Worship, not mere explanation, is the fitting response to this mystery.',
        },
        {
          kind: 'attribution',
          teacherId: 'grudem',
          work: 'Systematic Theology',
          note:
            'Organizational cue: Grudem’s Christology begins with the person of Christ—deity, humanity, and their union—before addressing the work of Christ. This lesson follows that same logical starting point with original explanations.',
        },
      ],
      questions: L1_QUESTIONS,
      reflectionPrompts: [
        'Write one sentence in your own words describing why a Savior who is less than fully God, or less than fully human, could not actually save you.',
      ],
      furtherStudy: [
        'Read John 20:24–29 and notice how Thomas responds to the risen Christ with the words "my Lord and my God."',
        'Compare Isaiah 9:6 with Philippians 2:6–11 on the paradox of a ruling, divine child who takes the form of a servant.',
      ],
    },
    {
      id: 'christ-incarnation-life',
      order: 2,
      title: 'The Incarnation and Earthly Ministry',
      estimatedMinutes: 18,
      objectives: [
        'Describe the virgin conception as a real historical miracle with theological purpose.',
        'Explain how Christ’s true, developing humanity coexisted with His sinlessness.',
        'Summarize the purpose of Christ’s earthly ministry of teaching, healing, and announcing the kingdom.',
      ],
      primaryPassages: [
        passage('luke', 'Luke', 1, 26, 38),
        passage('luke', 'Luke', 2, 1, 20),
        passage('galatians', 'Galatians', 4, 4, 5),
        passage('hebrews', 'Hebrews', 4, 15, 15),
      ],
      supportingPassages: [
        passage('luke', 'Luke', 2, 52, 52),
        passage('matthew', 'Matthew', 4, 1, 11),
        passage('john', 'John', 1, 14, 14),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'God enters ordinary history',
          body:
            'The incarnation is not a myth dressed up as history; Luke narrates it with the texture of ordinary life—a betrothed young woman, a journey, a census, a manger. The eternal Son entered the world the way every human life begins, through birth, while entering in a way no other life ever began, through a virgin conception.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('luke', 'Luke', 1, 26, 38),
          note:
            'Interpretation: the angel explains the conception as the Holy Spirit’s direct work, so that the child will be called holy and the Son of God. The virgin conception safeguards both truths this topic is built on: a genuinely new human life, and a sinless beginning untouched by the ordinary transmission of guilt.',
        },
        {
          kind: 'concept',
          term: 'Virgin conception',
          explanation:
            'The miracle by which Mary conceived Jesus through the Holy Spirit’s power without a human father. It is the means by which the eternal Son assumed a genuinely human nature while entering the world without inherited guilt.',
        },
        {
          kind: 'distinction',
          biblical:
            'Luke presents the virgin conception as a specific historical event, explained in advance by an angel and later recalled by eyewitnesses. Galatians 4:4 says the Son was "born of a woman, born under the law," entering fully into the human condition and the obligations of the law.',
          interpretation:
            'Historic Christian orthodoxy, including Reformed theology, affirms the virgin conception as literal history, not a later legend added to dignify Jesus. It is theologically necessary in this framework: it marks the entrance of a truly new, sinless human life into a fallen human line, accomplishing redemption from within humanity rather than from outside it.',
          disagreement:
            'Some modern theological approaches treat the virgin birth narratives as devotional legend or later theological symbol rather than historical fact, often because they start by assuming such a miracle could not occur. This curriculum treats the Gospel accounts as reliable history and the miracle as consistent with a God who can and does act within creation, while acknowledging that this is a point where the historic church and modern skepticism genuinely diverge.',
        },
        {
          kind: 'teaching',
          title: 'A real childhood, a sinless life',
          body:
            'Luke 2:52 says Jesus grew in wisdom and stature—ordinary, observable human development. Hebrews 4:15 says He was tempted in every way as we are, yet without sin. Together these texts describe genuine humanity (growth, limitation, real temptation) joined to unbroken moral perfection. Reformed theology resists two opposite errors: treating Jesus as essentially divine with humanity as a thin costume, and treating His sinlessness as making His humanity somehow unreal or untestable.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('hebrews', 'Hebrews', 4, 15, 15),
          note:
            'Interpretation: the writer’s pastoral aim is comfort—believers have a high priest who truly understands weakness from the inside, yet who never caved to sin, so His sympathy and His righteousness can both be trusted.',
        },
        {
          kind: 'teaching',
          title: 'A ministry that announced the kingdom',
          body:
            'Christ’s teaching, miracles, and compassion toward the suffering were not a separate project from His saving work; they announced that God’s promised kingdom was breaking into history in His own person, while also revealing the character of the king who would soon lay down His life for His people.',
        },
        {
          kind: 'attribution',
          teacherId: 'macarthur',
          work: 'Biblical teaching on the life and ministry of Christ',
          note:
            'Supplementary pastoral stress: the Gospels are read as careful historical narrative, not devotional embellishment, grounding confidence that the earthly Jesus of the Gospels is the same Lord believers now trust.',
        },
      ],
      questions: L2_QUESTIONS,
      reflectionPrompts: [
        'Where do you tend to think of Jesus as "too divine" to have really understood ordinary human struggle? Bring one current struggle to Him in prayer this week.',
      ],
      furtherStudy: [
        'Read Matthew 4:1–11 and note how Jesus answers each temptation from Scripture rather than from raw willpower.',
      ],
      reviewFromLessonIds: ['christ-person-natures'],
    },
    {
      id: 'christ-atonement',
      order: 3,
      title: 'The Atonement: What the Cross Accomplished',
      estimatedMinutes: 20,
      objectives: [
        'Explain penal substitution as the Reformed understanding of the center of the cross.',
        'Identify at least two other biblical pictures of the atonement and relate them fairly to penal substitution.',
        'State the historic Reformed position on the extent of the atonement and note the Arminian alternative fairly.',
      ],
      primaryPassages: [
        passage('isaiah', 'Isaiah', 53, 4, 6),
        passage('romans', 'Romans', 3, 21, 26),
        passage('2corinthians', '2 Corinthians', 5, 21, 21),
        passage('1peter', '1 Peter', 2, 24, 24),
      ],
      supportingPassages: [
        passage('mark', 'Mark', 10, 45, 45),
        passage('colossians', 'Colossians', 2, 13, 15),
        passage('john', 'John', 3, 16, 16),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Why the cross needs a legal answer, not just an emotional one',
          body:
            'Scripture treats sin not merely as a wound to be felt or a habit to be broken, but as guilt before a just God. Any account of the cross has to answer a legal question: how can a just God forgive guilty people without compromising His justice? The atonement is Scripture’s answer.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('isaiah', 'Isaiah', 53, 4, 6),
          note:
            'Interpretation: the servant’s suffering is explicitly substitutionary—He is pierced and crushed for sins that are not His own, and the healing of others flows from wounds He receives in their place. This is the Old Testament backbone beneath the New Testament’s teaching on the cross.',
        },
        {
          kind: 'concept',
          term: 'Penal substitution',
          explanation:
            'The teaching that Christ bore, in the place of sinners, the just penalty their sin deserved, so that God’s justice is fully satisfied and His mercy is freely extended to all who trust in Christ. "Penal" points to a deserved penalty; "substitution" points to Christ bearing it instead of the sinner.',
        },
        {
          kind: 'distinction',
          biblical:
            '2 Corinthians 5:21 says God made the sinless Christ "to be sin" for us, so that in Him we become the righteousness of God. 1 Peter 2:24 says Christ bore our sins in His body. Romans 3:25–26 explicitly connects Christ’s death to God’s justice being shown, so that He can justify sinners while remaining just.',
          interpretation:
            'Reformed theology reads these texts as teaching a real legal exchange: guilt reckoned to the sinless Christ, righteousness reckoned to those united to Him by faith. This is the foundational "mechanism" that makes the cross just and effective rather than a display without legal substance.',
          disagreement:
            'Not every Christian tradition gives penal substitution the same weight. Some emphasize "moral influence" (the cross primarily moves sinners to repentance by displaying God’s love), "Christus Victor" (the cross primarily defeats sin, death, and the devil), or "ransom" (the cross primarily pays a price to free captives). Scripture contains real support for each picture. This curriculum, following the historic Reformed position, treats these as true and complementary biblical emphases while holding that penal substitution supplies the legal foundation that explains why Christ’s victory, ransom, and moral example are just and effective rather than arbitrary.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('romans', 'Romans', 3, 21, 26),
          note:
            'Interpretation: Paul explicitly states the problem this passage solves—how God can be "just and the justifier" of those who believe. The propitiation language ties forgiveness to a satisfied justice, not to justice being overlooked.',
        },
        {
          kind: 'teaching',
          title: 'The extent of the atonement',
          body:
            'A separate historic debate concerns the intended scope of Christ’s atoning death: did Christ die with the specific intention of securing the salvation of His elect (often called "particular" or "limited" atonement), or did He die to make salvation generally available to all without guaranteeing anyone’s response ("general" or "unlimited" atonement)?',
        },
        {
          kind: 'distinction',
          biblical:
            'Some texts speak of Christ dying "for the world" or "for all" (e.g., John 3:16; 1 Timothy 2:6); other texts speak of Christ laying down His life specifically "for His sheep" or "for the church" (e.g., John 10:11, 15; Acts 20:28; Ephesians 5:25).',
          interpretation:
            'The Reformed tradition typically holds "particular redemption": Christ’s death is sufficient for all and genuinely offered to all in the gospel call, but it is specifically intended and effectively applied to secure the salvation of the elect, consistent with the unconditional election taught elsewhere in this curriculum.',
          disagreement:
            'Arminian theology and some other traditions hold "unlimited" or "general" atonement: Christ died equally for every person without exception, and the difference between who is saved and who is not rests on each person’s free response rather than on God’s particular intent in the cross. Thoughtful believers in both camps affirm the full sufficiency of Christ’s death and the genuine, universal invitation of the gospel; the disagreement concerns God’s intent in the cross, not the value of Christ’s sacrifice.',
        },
        {
          kind: 'attribution',
          teacherId: 'sproul',
          work: 'Teaching on the holiness of God and the necessity of the cross',
          note:
            'Supplementary emphasis: because God is infinitely holy, sin cannot simply be waived; it must be dealt with justly. This widely known theme supplements the lesson’s legal framing of the atonement. Original paraphrase only—no sermon text reproduced.',
        },
      ],
      questions: L3_QUESTIONS,
      reflectionPrompts: [
        'Spend a few minutes thanking God specifically for the legal exchange of the cross: your guilt for Christ’s righteousness. Name one guilt you are still carrying as though it were unpaid.',
      ],
      furtherStudy: [
        'Read Colossians 2:13–15 and note the imagery of a cancelled debt and disarmed rulers and authorities in the same passage.',
      ],
      reviewFromLessonIds: ['christ-person-natures', 'christ-incarnation-life'],
    },
    {
      id: 'christ-resurrection-ascension',
      order: 4,
      title: 'Resurrection and Ascension',
      estimatedMinutes: 18,
      objectives: [
        'Explain why 1 Corinthians 15 treats the resurrection as verifiable, public history rather than private experience.',
        'State why Reformed theology insists on a bodily, not merely spiritual, resurrection.',
        'Describe the ascension and its connection to Christ’s present reign and promised return.',
      ],
      primaryPassages: [
        passage('1corinthians', '1 Corinthians', 15, 3, 8),
        passage('1corinthians', '1 Corinthians', 15, 20, 23),
        passage('acts', 'Acts', 1, 1, 11),
        passage('romans', 'Romans', 1, 4, 4),
      ],
      supportingPassages: [
        passage('luke', 'Luke', 24, 36, 43),
        passage('john', 'John', 20, 24, 29),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'A claim staked on public evidence',
          body:
            'Paul does not ask the Corinthians to take the resurrection on blind faith; he appeals to a list of named and grouped eyewitnesses, many of whom were still alive and could be questioned. The resurrection is presented as the kind of claim that could, in principle, be investigated and falsified—and the early church staked everything on it standing up to scrutiny.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('1corinthians', '1 Corinthians', 15, 3, 8),
          note:
            'Interpretation: Paul recites what he "received"—an early, settled tradition—then lists Peter, the Twelve, more than five hundred believers at once, James, and finally himself. This is the structure of a historical argument, not a private vision report.',
        },
        {
          kind: 'concept',
          term: 'Bodily resurrection',
          explanation:
            'The teaching that Jesus was raised with a real, physical body—transformed and glorified, yet continuous with the body that was crucified and buried—rather than rising only as a spirit or surviving only in the memory and teaching of His followers.',
        },
        {
          kind: 'distinction',
          biblical:
            'Luke 24 shows the risen Christ eating and inviting His disciples to touch Him; 1 Corinthians 15:20–23 calls Christ’s resurrection the "firstfruits" that guarantees the future bodily resurrection of believers.',
          interpretation:
            'Reformed theology insists the resurrection was bodily, not merely spiritual or symbolic, because the logic of 1 Corinthians 15 depends on it: if Christ’s own resurrection were not a real bodily event, it could not serve as the pattern and guarantee of believers’ own future bodily resurrection, and Paul says faith would then be in vain.',
          disagreement:
            'Some modern interpreters propose that the resurrection accounts describe a subjective experience, vision, or the ongoing influence of Jesus’ teaching rather than a literal bodily event. This curriculum holds, with the historic church, that the New Testament authors intend bodily, historical resurrection and that the argument of 1 Corinthians 15 only works on that reading, while recognizing that this is a point of real disagreement with more skeptical scholarship.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('acts', 'Acts', 1, 1, 11),
          note:
            'Interpretation: Luke narrates a visible, bodily ascension witnessed by the disciples, paired with the promise that Christ will return "in the same way." The ascension is not Christ’s disappearance but His enthronement, with a future return already promised at the moment of His departure.',
        },
        {
          kind: 'teaching',
          title: 'From empty tomb to occupied throne',
          body:
            'Resurrection and ascension belong together as one movement: God vindicates His Son by raising Him from death, then exalts Him to the highest place of authority. Romans 1:4 says the resurrection "declares" Christ to be Son of God in power—not creating a new status, but publicly confirming, in history, what had always been true of Him.',
        },
        {
          kind: 'attribution',
          teacherId: 'macarthur',
          work: 'Biblical teaching on the resurrection as historical fact',
          note:
            'Supplementary pastoral stress: the resurrection is taught as verifiable history on which the entire gospel stands or falls, not as an optional devotional metaphor.',
        },
      ],
      questions: L4_QUESTIONS,
      reflectionPrompts: [
        'Name one way the certainty of your own future bodily resurrection should change how you think about aging, illness, or grief.',
      ],
      furtherStudy: [
        'Read John 20:24–29 and consider why Thomas’s doubt and eventual confession are included in the Gospel record.',
      ],
      reviewFromLessonIds: ['christ-person-natures', 'christ-atonement'],
    },
    {
      id: 'christ-present-ministry',
      order: 5,
      title: 'Christ’s Present Ministry: Session, Intercession, and Lordship',
      estimatedMinutes: 18,
      objectives: [
        'Explain what it means that Christ is seated at the right hand of the Father.',
        'Describe Christ’s present priestly intercession for believers and its effect on prayer.',
        'Articulate Christ’s present lordship over the church and creation, and one historic debate connected to His ascended humanity.',
      ],
      primaryPassages: [
        passage('hebrews', 'Hebrews', 7, 23, 25),
        passage('hebrews', 'Hebrews', 4, 14, 16),
        passage('romans', 'Romans', 8, 34, 34),
        passage('ephesians', 'Ephesians', 1, 20, 23),
      ],
      supportingPassages: [
        passage('1peter', '1 Peter', 3, 21, 22),
        passage('colossians', 'Colossians', 3, 1, 4),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'The ascension did not end Christ’s active ministry',
          body:
            'It is tempting to treat the ascension as the point where Jesus becomes inactive until His return—present in heaven, but not doing anything in particular. Scripture teaches the opposite: the ascended Christ is presently reigning, interceding, and ruling, with direct, ongoing effect on believers’ lives right now.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('hebrews', 'Hebrews', 7, 23, 25),
          note:
            'Interpretation: because Christ’s priesthood never ends, His intercession for His people never lapses. The argument is comfort-driven: a priest who dies has to be replaced; a permanent priest offers permanent, uninterrupted help.',
        },
        {
          kind: 'concept',
          term: 'Session',
          explanation:
            '"Session" names the truth that Christ is seated at the Father’s right hand. The posture of sitting signals completed, finished priestly work (unlike the standing Old Testament priests who repeated sacrifices endlessly); the "right hand" is royal, enthronement language describing supreme authority, not a literal location to be mapped in space.',
        },
        {
          kind: 'distinction',
          biblical:
            'Romans 8:34 says Christ "is at the right hand of God" interceding; Ephesians 1:20–23 says He is seated far above every rule and authority, head over all things for the church’s sake.',
          interpretation:
            'Reformed theology reads "right hand" as enthronement imagery describing Christ’s supreme, exercised authority right now—not a claim about a physical place to be located in heaven. His humanity remains real and localized in a glorified body; His divine rule, by contrast, is exercised everywhere, through the Spirit, without requiring His human body to be physically present on earth.',
          disagreement:
            'This distinction connects to a real historic debate about Christ’s presence in the Lord’s Supper. Reformed theology (sometimes using the phrase "extra Calvinisticum") holds that Christ’s glorified human body remains in heaven even while He is spiritually present with His people in the Supper by the Holy Spirit. Lutheran theology affirms a mode of bodily presence "in, with, and under" the elements tied to the divine nature’s communication to the human nature; Roman Catholic theology teaches that the bread and wine are transformed into Christ’s literal body and blood (transubstantiation). All three traditions affirm Christ is truly present to believers in the Supper; they differ on how His ascended humanity relates to that presence, and this curriculum notes the difference without adjudicating every detail here.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('hebrews', 'Hebrews', 4, 14, 16),
          note:
            'Interpretation: the writer moves directly from Christ’s priestly sympathy to a command—"let us then with confidence draw near." Christ’s present ministry is meant to produce bold, unashamed prayer, not hesitant, fearful prayer.',
        },
        {
          kind: 'teaching',
          title: 'Lordship with a purpose',
          body:
            'Ephesians 1 does not describe Christ’s present authority as abstract cosmic power; it is authority exercised specifically "for the church." The reigning Christ is not distant from ordinary believers—His rule over all things is presently being directed toward their good and His church’s growth.',
        },
        {
          kind: 'attribution',
          teacherId: 'sproul',
          work: 'Teaching on the present reign of Christ',
          note:
            'Supplementary emphasis: the ascended Christ’s active, present lordship is a widely known Reformed theme, applied here to ordinary confidence in prayer. Original paraphrase only.',
        },
      ],
      questions: L5_QUESTIONS,
      reflectionPrompts: [
        'Bring one situation you feel too weak or ashamed to pray about, and pray it anyway, resting on Christ’s present intercession rather than on how well you think you are praying.',
      ],
      furtherStudy: [
        'Read Colossians 3:1–4 and notice how Paul grounds everyday holiness in the fact that believers’ lives are now "hidden with Christ" in His present exalted position.',
      ],
      reviewFromLessonIds: [
        'christ-person-natures',
        'christ-atonement',
        'christ-resurrection-ascension',
      ],
    },
  ],
}
