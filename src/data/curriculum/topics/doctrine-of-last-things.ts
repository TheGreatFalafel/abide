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

const L1_QUESTIONS: QuizQuestion[] = [
  mc(
    'lot-1-origin',
    'Genesis 3:19 and Romans 5:12 teach that physical death entered the human story as…',
    [
      'Part of God’s original “very good” design',
      'A consequence of sin, God’s just judgment on human rebellion',
      'An illusion to be overcome by willpower',
      'Something only unbelievers experience',
    ],
    1,
    'Death is not presented as a neutral, natural cycle in Scripture’s storyline but as judgment entering through sin—which is exactly why Christ’s resurrection is such good news.',
  ),
  mc(
    'lot-1-depart',
    'Philippians 1:23 and 2 Corinthians 5:8 teach that for the believer, to depart this life means to be…',
    [
      'Unconscious until the resurrection',
      'Immediately present with Christ',
      'Annihilated entirely',
      'Reincarnated into a new body on earth',
    ],
    1,
    'Paul describes departing and being “with Christ” as “far better” (Phil 1:23) and being “away from the body” as being “at home with the Lord” (2 Cor 5:8)—language of immediate, conscious presence.',
  ),
  mc(
    'lot-1-state',
    'This lesson’s Reformed view of the intermediate state holds that departed believers are…',
    [
      'Consciously with Christ, awaiting the future bodily resurrection',
      'Asleep and unaware of anything until judgment day',
      'Already fully glorified in resurrection bodies',
      'Purified through suffering before entering God’s presence',
    ],
    0,
    'Reformed theology teaches conscious fellowship with Christ immediately at death, while still awaiting and longing for the future resurrection of the body—the intermediate state is real but not final.',
  ),
  open(
    'lot-1-open',
    'How does the hope of being “at home with the Lord” shape how you think about your own death or that of a believing loved one?',
  ),
]

const L2_QUESTIONS: QuizQuestion[] = [
  mc(
    'lot-2-visible',
    'Acts 1:11 promises that Jesus will return…',
    [
      'Secretly, so that no one notices',
      'In the same way the disciples saw Him go—visibly and personally',
      'Only in a spiritual, non-bodily sense',
      'As a different person than the one who ascended',
    ],
    1,
    'The angels’ words tie Christ’s future coming directly to the manner of His visible ascension, ruling out a purely secret or merely symbolic return.',
  ),
  mc(
    'lot-2-timing',
    'Matthew 24:36 teaches that the timing of Christ’s return is…',
    [
      'Calculable from world events by careful students',
      'Known only to the Father, not to be date-set by anyone',
      'Already past and fulfilled',
      'Irrelevant to how believers should live',
    ],
    1,
    'Jesus explicitly says “concerning that day and hour no one knows”—a statement meant to produce watchfulness, not speculative timelines.',
  ),
  mc(
    'lot-2-debate',
    'According to this lesson, Christians who equally affirm Scripture’s authority nevertheless differ on…',
    [
      'Whether Christ will return at all',
      'How the “catching up” described in 1 Thessalonians 4 relates to a future tribulation period',
      'Whether the dead in Christ will be raised',
      'Whether Christ’s return will be visible',
    ],
    1,
    'Pretribulational, midtribulational, and posttribulational readings all affirm Christ’s certain return and the resurrection of believers; they differ on the sequencing of the “rapture” relative to a future tribulation.',
  ),
  open(
    'lot-2-open',
    'How should the certainty—but not the timing—of Christ’s return shape a decision or habit you’re working on this week?',
  ),
]

const L3_QUESTIONS: QuizQuestion[] = [
  mc(
    'lot-3-body',
    '1 Corinthians 15:42–44 teaches that the resurrection body is raised…',
    [
      'Identical in every way, with no change at all',
      'Imperishable, in glory and power, a Spirit-empowered body continuous with yet transformed from the present one',
      'As a purely spiritual existence with no body',
      'Only for some believers, not all',
    ],
    1,
    'Paul’s seed analogy (what is sown is not what is raised, yet it is the same plant) pictures real continuity with real transformation—glorification, not replacement.',
  ),
  mc(
    'lot-3-judgment',
    'Revelation 20:11–15 describes final judgment as being rendered according to…',
    [
      'Random selection',
      'Deeds recorded in the books, and whether one’s name is written in the book of life',
      'National or ethnic identity alone',
      'Church membership records',
    ],
    1,
    'The scene combines evaluation according to deeds with the decisive question of whether a person’s name is written in the Lamb’s book of life.',
  ),
  mc(
    'lot-3-nocondemnation',
    'According to Romans 8:1, believers’ relationship to final judgment should be understood as…',
    [
      'Escaping judgment’s reality altogether, with no evaluation at all',
      'No condemnation in Christ Jesus, while Spirit-wrought works are still evaluated and acknowledged',
      'Uncertain until judgment day reveals the verdict',
      'Earned through a lifetime of good deeds',
    ],
    1,
    'Union with Christ secures believers against condemnation, while texts like 1 Corinthians 3:12–15 and 2 Corinthians 5:10 still describe an evaluation of works for reward, not for salvation’s basis.',
  ),
  open(
    'lot-3-open',
    'How does the hope of a transformed resurrection body change the way you think about present suffering or physical weakness?',
  ),
]

const L4_QUESTIONS: QuizQuestion[] = [
  mc(
    'lot-4-premill',
    'Premillennialism teaches that Christ returns…',
    [
      'After a thousand-year golden age produced by the gospel’s cultural influence',
      'Before a future earthly reign described using Revelation 20’s “thousand years”',
      'At the exact same moment as His ascension',
      'Only in a spiritual sense with no visible return',
    ],
    1,
    'Premillennialists (in historic and dispensational forms) read Revelation 20 as describing a future, visible, earthly reign of Christ beginning at His return.',
  ),
  mc(
    'lot-4-amill',
    'Amillennialism, long associated with Reformed confessions, understands the “thousand years” of Revelation 20 as…',
    [
      'A literal future thousand-year calendar period on earth',
      'A symbolic description of the present church age, during which Christ reigns and Satan’s power to deceive the nations is restrained',
      'A period that has already fully passed with no remaining significance',
      'Equivalent to the eternal state itself',
    ],
    1,
    'Amillennialism reads Revelation’s apocalyptic genre as picturing the entire period between Christ’s first and second comings, during which the gospel advances among the nations despite ongoing conflict.',
  ),
  mc(
    'lot-4-postmill',
    'Postmillennialism distinctively expects that…',
    [
      'The world will grow uniformly worse until Christ returns to rescue a tiny remnant',
      'The gospel will progressively transform culture through ordinary means of grace before Christ’s return',
      'Christ already returned invisibly in the first century and nothing more is expected',
      'There will be no final judgment',
    ],
    1,
    'Postmillennialism anticipates gradual, Spirit-empowered gospel advance leading to widespread (though not universal) transformation prior to Christ’s visible return.',
  ),
  open(
    'lot-4-open',
    'Why might charitable humility be especially important when discussing millennial views with other believers, compared to how we discuss core gospel doctrines?',
  ),
]

const L5_QUESTIONS: QuizQuestion[] = [
  mc(
    'lot-5-dwell',
    'Revelation 21:3–4 describes the new creation’s central blessing as…',
    [
      'Unlimited material wealth',
      'God Himself dwelling with His people, wiping away every tear, with death and mourning no more',
      'A return to a disembodied, spiritual-only existence',
      'The abolition of all physical creation with nothing replacing it',
    ],
    1,
    'The climax of redemptive history is not escape from the physical world but God dwelling face-to-face with His renewed people in a renewed creation.',
  ),
  mc(
    'lot-5-creation',
    'Romans 8:19–23 teaches that creation itself will be…',
    [
      'Destroyed with no future at all',
      'Set free from its bondage to corruption into the freedom of the glory of God’s children',
      'Left permanently groaning with no resolution',
      'Irrelevant to the believer’s hope',
    ],
    1,
    'Paul pictures creation as a woman in labor, groaning toward a liberation tied to believers’ own future glorification—creation’s future, like ours, is renewal, not annihilation.',
  ),
  mc(
    'lot-5-renewal',
    'This lesson’s Reformed reading of 2 Peter 3 and Romans 8 together favors understanding the new heavens and new earth as…',
    [
      'A renewed and purified creation continuous with the present one, not an annihilated creation replaced from nothing',
      'A return to Eden with no final judgment',
      'Purely symbolic language with no real future creation at all',
      'A second, unrelated creation with no connection to this one',
    ],
    0,
    'Reading 2 Peter 3’s purifying “fire” imagery alongside Romans 8’s liberation imagery and the resurrection-body pattern (transformation, not replacement) favors renewal over annihilation, while this lesson also notes other believers read 2 Peter 3 more literally.',
  ),
  open(
    'lot-5-open',
    'How does picturing eternity as embodied life in a renewed creation—rather than a disembodied, ethereal existence—change what you look forward to?',
  ),
]

/** Third complete theology topic: the doctrine of last things (eschatology). */
export const DOCTRINE_OF_LAST_THINGS: CurriculumTopic = {
  id: 'doctrine-of-last-things',
  title: 'The Doctrine of Last Things',
  description:
    'A Reformed introduction to eschatology: what happens at death and in the intermediate state, the certainty and nature of Christ’s return, the resurrection and final judgment, the major millennial views, and the hope of the new heavens and new earth.',
  objectives: [
    'Explain the biblical teaching on death and the intermediate state for believers and unbelievers.',
    'Establish that Christ’s return is personal, visible, and certain, though its timing is unknown.',
    'Describe the general resurrection and final judgment and their basis in Scripture.',
    'Define the major millennial views (premillennial, postmillennial, amillennial) fairly, without declaring one the only legitimate Christian position.',
    'Articulate the hope of the new heavens and new earth as bodily, embodied, and relational, not merely ethereal.',
  ],
  estimatedMinutes: 96,
  prerequisites: ['doctrine-of-salvation'],
  framework: 'reformed',
  version: 1,
  sources: [
    {
      ...SOURCE_GRUDEM_ORG,
      note:
        'Topic order (death and the intermediate state, Christ’s return, resurrection, millennium, final judgment, new creation) follows the standard systematic-theology sequence for personal and general eschatology as an organizing map for original lesson writing—not reproduced textbook text. Grudem’s practice of surveying all three millennial views in turn shapes the structure of the millennium lesson.',
    },
    {
      ...SOURCE_SPROUL_SUP,
      note:
        'Sproul’s widely known emphasis on God’s sovereignty over history and the certainty of His purposes supplements the lessons on Christ’s return and final judgment. Claims here are original paraphrase of public themes, not quoted sermons.',
    },
    {
      ...SOURCE_MACARTHUR_SUP,
      note:
        'MacArthur’s published pastoral emphasis on eager expectation of Christ’s return and the urgency it creates for holy living supplements the return-of-Christ and new-creation lessons. No sermon transcripts are reproduced.',
    },
  ],
  lessons: [
    {
      id: 'last-death-intermediate',
      order: 1,
      title: 'Death and the Intermediate State',
      estimatedMinutes: 18,
      objectives: [
        'Explain death’s origin and meaning from Genesis 3 and Romans 5.',
        'Describe the biblical teaching on the intermediate state for believers.',
        'Distinguish the intermediate state from the final bodily resurrection.',
        'Apply biblical hope to grief and the fear of death.',
      ],
      primaryPassages: [
        passage('genesis', 'Genesis', 3, 17, 19),
        passage('philippians', 'Philippians', 1, 21, 23),
        passage('2corinthians', '2 Corinthians', 5, 1, 8),
      ],
      supportingPassages: [
        passage('luke', 'Luke', 23, 42, 43),
        passage('hebrews', 'Hebrews', 9, 27, 27),
        passage('1thessalonians', '1 Thessalonians', 4, 13, 14),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Why eschatology begins here',
          body:
            'Systematic theology typically studies “last things” in two movements: personal eschatology (what happens to an individual at death and beyond) and general eschatology (what happens to the whole world at Christ’s return and after). This topic follows that order, beginning with death because it is the next “last thing” most of us will personally face.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('genesis', 'Genesis', 3, 19, 19),
          note:
            'Interpretation: Death is pronounced as part of the judgment for sin—“to dust you shall return”—not presented as part of God’s original “very good” design in Genesis 1–2. Romans 5:12 confirms that death spread to all because all sinned.',
        },
        {
          kind: 'concept',
          term: 'Intermediate state',
          explanation:
            'The period between a person’s death and the future bodily resurrection, during which the soul exists consciously apart from the body—with Christ for believers, and in conscious separation from God’s saving favor for unbelievers, both awaiting the final resurrection and judgment.',
        },
        {
          kind: 'distinction',
          biblical:
            'Paul says that to depart and be with Christ is “far better” (Phil 1:23) and that to be “away from the body” is to be “at home with the Lord” (2 Cor 5:8). Jesus tells the dying thief, “today you will be with me in paradise” (Luke 23:43). Revelation pictures martyrs’ souls consciously crying out while awaiting vindication (Rev 6:9–11).',
          interpretation:
            'Reformed theology teaches that at death believers’ souls go immediately into Christ’s conscious presence, in true but incomplete blessedness, while awaiting the future resurrection of the body; unbelievers experience conscious separation from God awaiting final judgment.',
          disagreement:
            'Some Christian groups have historically taught “soul sleep” (psychopannychism)—that the soul is unconscious between death and resurrection. Historic Reformed confessions affirm conscious intermediate existence instead. This lesson teaches the conscious-intermediate-state view as the Reformed position while noting the alternate view exists among some sincere Christians.',
        },
        {
          kind: 'attribution',
          teacherId: 'grudem',
          work: 'Systematic Theology',
          note:
            'Grudem’s eschatology begins with personal eschatology—death and the intermediate state—before general eschatology. This lesson follows that organizational sequence with original explanations.',
        },
        {
          kind: 'teaching',
          title: 'Grieving with hope',
          body:
            '1 Thessalonians 4:13–14 does not forbid grief at death; it forbids grieving “as others do who have no hope.” Because Jesus died and rose, believers grieve real loss while trusting a real future reunion and resurrection. Hope reshapes grief; it does not erase it.',
        },
        {
          kind: 'attribution',
          teacherId: 'sproul',
          work: 'Published Ligonier teaching on the Christian’s hope in death',
          note:
            'Supplementary theme: confidence in God’s sovereign goodness steadies believers who face death and bereavement. Original paraphrase of a widely known theme, not a quoted sermon.',
        },
      ],
      questions: L1_QUESTIONS,
      reflectionPrompts: [
        'Bring a specific fear about death—your own or a loved one’s—to God in prayer, naming one truth from this lesson that meets that fear.',
      ],
      furtherStudy: [
        'Read Psalm 90 and note how it holds together human mortality and hope in God.',
        'Compare Luke 23:43 and 2 Corinthians 5:8 on where believers go immediately at death.',
      ],
    },
    {
      id: 'last-return-christ',
      order: 2,
      title: 'The Return of Christ',
      estimatedMinutes: 18,
      objectives: [
        'Establish from Scripture that Christ’s return is personal, visible, and certain.',
        'Explain why the timing of Christ’s return is unknown and what response that calls for.',
        'Introduce pretribulational, midtribulational, and posttribulational views fairly.',
        'Apply the hope of Christ’s return to holy living and perseverance.',
      ],
      primaryPassages: [
        passage('acts', 'Acts', 1, 9, 11),
        passage('matthew', 'Matthew', 24, 30, 31),
        passage('1thessalonians', '1 Thessalonians', 4, 16, 17),
      ],
      supportingPassages: [
        passage('matthew', 'Matthew', 24, 36, 36),
        passage('titus', 'Titus', 2, 13, 13),
        passage('revelation', 'Revelation', 1, 7, 7),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'The blessed hope',
          body:
            'Titus 2:13 calls Christ’s return “our blessed hope”—not a source of fear for believers, but the long-awaited completion of salvation. The New Testament consistently presents this return as personal (Christ Himself, not merely an influence or idea), visible (seen by all), and certain (promised repeatedly), even though its timing remains hidden.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('acts', 'Acts', 1, 11, 11),
          note:
            'Interpretation: The angels tell the disciples that “this Jesus… will come in the same way as you saw him go”—tying the future return directly to the visible, bodily nature of the ascension they had just witnessed.',
        },
        {
          kind: 'concept',
          term: 'Parousia',
          explanation:
            'A Greek term meaning “coming” or “presence,” used in the New Testament for Christ’s future, visible return in glory to raise the dead, judge the world, and consummate His kingdom.',
        },
        {
          kind: 'distinction',
          biblical:
            'Scripture affirms Christ will return visibly and bodily (Acts 1:11; Rev 1:7), that the dead in Christ will rise and living believers will be “caught up together with them” to meet the Lord (1 Thess 4:16–17), and that no one knows the day or hour (Matt 24:36).',
          interpretation:
            'Reformed theology affirms a single, personal, visible return of Christ that brings resurrection, judgment, and consummation. Interpreters differ on how the “catching up” in 1 Thessalonians 4 (often called “the rapture”) relates to the future tribulation period described especially in Revelation and Daniel.',
          disagreement:
            'Dispensational premillennialists often teach a pretribulational rapture distinct from and prior to Christ’s later visible return; other premillennialists hold midtribulational or posttribulational views, placing the rapture during or at the end of the tribulation. Many Reformed amillennialists and postmillennialists read 1 Thessalonians 4 as describing the one, final, visible return rather than a separate secret coming. This curriculum does not require one view here, exploring the broader millennial framework further in Lesson 4.',
        },
        {
          kind: 'attribution',
          teacherId: 'grudem',
          work: 'Systematic Theology',
          note:
            'Grudem discusses the return of Christ before treating the resurrection, millennium, and final judgment in turn, reflecting a common systematic ordering. This lesson follows that sequence with original explanations.',
        },
        {
          kind: 'teaching',
          title: 'Watchfulness, not speculation',
          body:
            'Mark 13:32–37 compares believers to servants who do not know when their master will return, and are therefore to stay alert and faithful at all times. The unknown timing of Christ’s return is meant to produce steady readiness and holy living, not anxious date-setting or speculative timelines.',
        },
        {
          kind: 'attribution',
          teacherId: 'macarthur',
          work: 'Published biblical teaching on the return of Christ',
          note:
            'Supplementary pastoral emphasis: eager expectation of Christ’s return should produce urgency in evangelism and personal holiness now, not passive speculation about dates. Paraphrased theme only.',
        },
      ],
      questions: L2_QUESTIONS,
      reflectionPrompts: [
        'Name one area of your life where “watchfulness” rather than either apathy or anxious speculation about the future would better honor Christ’s promised return.',
      ],
      furtherStudy: [
        'Read Mark 13:32–37 and list the attitudes Jesus commends in a watchful servant.',
        'Compare 1 Thessalonians 4:13–18 and 2 Thessalonians 2:1–4 on events surrounding Christ’s coming.',
      ],
      reviewFromLessonIds: ['last-death-intermediate'],
    },
    {
      id: 'last-resurrection-judgment',
      order: 3,
      title: 'Resurrection and Final Judgment',
      estimatedMinutes: 20,
      objectives: [
        'Explain the biblical teaching on the general bodily resurrection of all people.',
        'Describe the nature of the believer’s resurrection body from 1 Corinthians 15.',
        'Summarize the final judgment and its basis according to Scripture.',
        'Apply the certainty of judgment to present holiness and gospel assurance.',
      ],
      primaryPassages: [
        passage('john', 'John', 5, 28, 29),
        passage('1corinthians', '1 Corinthians', 15, 42, 44),
        passage('revelation', 'Revelation', 20, 11, 15),
      ],
      supportingPassages: [
        passage('daniel', 'Daniel', 12, 2, 2),
        passage('2corinthians', '2 Corinthians', 5, 10, 10),
        passage('romans', 'Romans', 8, 1, 1),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'More than souls floating',
          body:
            'The biblical hope is not merely the soul’s survival after death but the resurrection of the body—a hope central enough that Paul says if Christ has not been raised, Christian faith is futile (1 Cor 15:17). The resurrection is the capstone of personal eschatology and the gateway to the eternal state.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('1corinthians', '1 Corinthians', 15, 42, 44),
          note:
            'Interpretation: Paul’s seed analogy (sown perishable, raised imperishable; sown in weakness, raised in power) pictures real continuity between the earthly and resurrection body alongside real, glorious transformation.',
        },
        {
          kind: 'concept',
          term: 'Resurrection body',
          explanation:
            'The glorified, Spirit-empowered, imperishable body believers will receive at Christ’s return—genuinely continuous with the present body (as Christ’s own resurrection body bore His wounds, John 20:27) yet transformed beyond its present weakness and mortality.',
        },
        {
          kind: 'distinction',
          biblical:
            'John 5:28–29 and Daniel 12:2 teach a resurrection of all people, some to life and some to judgment; 2 Corinthians 5:10 and Revelation 20:11–15 describe all appearing before Christ’s judgment seat or throne, judged according to deeds, with those not found in the book of life facing final judgment.',
          interpretation:
            'Reformed theology teaches a future resurrection and judgment that will publicly vindicate God’s justice and openly display the fruit of grace in believers’ lives. Believers’ judgment, grounded in Romans 8:1, is not for condemnation but for the evaluation and reward of Spirit-wrought works (cf. 1 Cor 3:12–15).',
          disagreement:
            'Views differ, addressed further in the next lesson, on whether the resurrection of the just and unjust occur at the same moment or are separated by an intervening millennial kingdom. This lesson teaches the data common across the New Testament while flagging that timing question for the millennium lesson.',
        },
        {
          kind: 'attribution',
          teacherId: 'grudem',
          work: 'Systematic Theology',
          note:
            'Grudem treats the resurrection and final judgment as closely linked loci within general eschatology. This lesson follows that organizational pairing with original explanations.',
        },
        {
          kind: 'teaching',
          title: 'Judgment and assurance held together',
          body:
            'Romans 8:1’s “no condemnation” does not erase the reality of judgment; it secures believers within it. United to Christ by faith, believers can anticipate the judgment seat not with dread of condemnation but with sober expectation of having their Spirit-wrought faithfulness acknowledged and rewarded.',
        },
        {
          kind: 'attribution',
          teacherId: 'sproul',
          work: 'Published Ligonier teaching on the holiness and justice of God',
          note:
            'Supplementary theme: a high view of God’s holiness makes both the seriousness of judgment and the sufficiency of Christ’s righteousness more vivid. Original paraphrase of a widely known theme, not a quoted sermon.',
        },
      ],
      questions: L3_QUESTIONS,
      reflectionPrompts: [
        'Reflect on one way the certainty of future judgment, held together with “no condemnation in Christ,” should shape a choice you face today.',
      ],
      furtherStudy: [
        'Read 1 Corinthians 15 in full and outline Paul’s argument from Christ’s resurrection to ours.',
        'Compare Matthew 25:31–46 and Revelation 20:11–15 on the basis of final judgment.',
      ],
      reviewFromLessonIds: ['last-death-intermediate', 'last-return-christ'],
    },
    {
      id: 'last-millennium',
      order: 4,
      title: 'Millennium Perspectives',
      estimatedMinutes: 20,
      objectives: [
        'Define premillennialism, postmillennialism, and amillennialism accurately.',
        'Identify key texts each view appeals to, especially Revelation 20.',
        'Describe which views are most historically associated with Reformed theology, while affirming this is a debated, non-essential matter.',
        'Apply charity and humility in discussing eschatological timing differences with other believers.',
      ],
      primaryPassages: [
        passage('revelation', 'Revelation', 20, 1, 6),
        passage('matthew', 'Matthew', 13, 24, 30),
        passage('2thessalonians', '2 Thessalonians', 2, 1, 4),
      ],
      supportingPassages: [
        passage('romans', 'Romans', 11, 25, 26),
        passage('1corinthians', '1 Corinthians', 15, 24, 26),
        passage('psalms', 'Psalms', 2, 6, 9),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'One text, three readings',
          body:
            'Revelation 20 is the only passage in Scripture that explicitly names a “thousand years” (the Latin root of “millennium”). Because this single, admittedly apocalyptic text drives much of the debate, faithful interpreters who share the same high view of Scripture have reached different conclusions about how it relates to Christ’s return and the eternal state.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('revelation', 'Revelation', 20, 1, 6),
          note:
            'Interpretation: The passage describes Satan being bound, a resurrection and reign of “a thousand years,” and a final rebellion before the last judgment—details read quite differently depending on one’s overall interpretive framework for Revelation’s apocalyptic genre.',
        },
        {
          kind: 'concept',
          term: 'Premillennialism',
          explanation:
            'The view that Christ returns before a future reign—described using Revelation 20’s “thousand years”—after which comes the final rebellion, resurrection of the rest of the dead, and the eternal state. Historic premillennialism places the church through a future tribulation before this reign; dispensational premillennialism additionally holds to a pretribulational rapture and a future, distinct role for national Israel.',
        },
        {
          kind: 'concept',
          term: 'Postmillennialism',
          explanation:
            'The view that the gospel will progressively transform the world through ordinary means of grace—preaching, discipleship, and cultural influence—leading to a period of widespread (though not universal) righteousness and peace, often identified with or culminating in the “thousand years,” before Christ returns. Historically influential among many Puritan and later Reformed theologians, especially in eras of optimism about gospel advance.',
        },
        {
          kind: 'concept',
          term: 'Amillennialism',
          explanation:
            'The view that the “thousand years” symbolically describes the entire present church age, during which Christ reigns from heaven and Satan’s power to deceive the nations as he did before Christ’s first coming is restrained (Rev 20:3), with Christ’s return bringing the resurrection, final judgment, and eternal state directly, without an intervening earthly political kingdom.',
        },
        {
          kind: 'distinction',
          biblical:
            'Revelation 20:1–6 describes a binding of Satan, a resurrection and reign of “a thousand years,” and a final rebellion before the last judgment. Other texts are read differently depending on one’s framework: Matthew 13’s wheat and tares growing together until the harvest, 2 Thessalonians 2’s “man of lawlessness” preceding the day of the Lord, and Romans 11’s hope for the fullness of Israel.',
          interpretation:
            'Historic Reformed confessions and many Reformed theologians have held amillennial or postmillennial views, reading Revelation’s symbolism within its apocalyptic genre rather than requiring a future, literal thousand-year earthly political kingdom. Premillennialism, including dispensational forms, is also held by many Bible-believing Christians, including some within broader Reformed-influenced evangelicalism.',
          disagreement:
            'This is one of the most debated areas of eschatology among faithful, Bible-believing Christians. Scripture’s relative silence on precise sequencing outside Revelation’s challenging apocalyptic genre, along with differing understandings of how Israel and the church relate, accounts for much of the difference. Abide does not teach that any one millennial view is the only legitimate Christian position; it presents amillennialism and postmillennialism as most historically native to Reformed confessional theology while describing premillennialism accurately and respectfully as a view held by many faithful believers.',
        },
        {
          kind: 'attribution',
          teacherId: 'grudem',
          work: 'Systematic Theology',
          note:
            'Grudem’s systematic theology surveys all three millennial views in turn, with their supporting arguments and objections, before noting the author’s own leaning. This lesson follows that same fair-survey structure in original wording, without asserting any single author’s personal conviction as required teaching.',
        },
        {
          kind: 'attribution',
          teacherId: 'macarthur',
          work: 'Published biblical teaching on prophecy',
          note:
            'Supplementary note: broader evangelical teaching ministries, including dispensational premillennial traditions, have produced extensive popular teaching on prophetic texts. This lesson represents that reading fairly as one established evangelical option rather than the only one.',
        },
      ],
      questions: L4_QUESTIONS,
      reflectionPrompts: [
        'Write a short prayer asking God for humility and charity toward believers who hold a different millennial view than you find most persuasive.',
      ],
      furtherStudy: [
        'Read Revelation 19–21 in one sitting to see the millennium passage in its larger narrative context.',
        'Compare how Matthew 13:24–30, 36–43 and 2 Thessalonians 2:1–12 each describe good and evil coexisting before the end.',
      ],
      reviewFromLessonIds: ['last-return-christ', 'last-resurrection-judgment'],
    },
    {
      id: 'last-new-creation',
      order: 5,
      title: 'The New Heavens and New Earth',
      estimatedMinutes: 20,
      objectives: [
        'Describe the biblical hope of a renewed physical creation, not an escape from the material world.',
        'Explain the significance of God’s dwelling with His people in Revelation 21–22.',
        'Connect Romans 8’s picture of creation’s groaning to its final liberation.',
        'Apply the hope of the new creation to present perseverance, stewardship, and worship.',
      ],
      primaryPassages: [
        passage('revelation', 'Revelation', 21, 1, 5),
        passage('2peter', '2 Peter', 3, 10, 13),
        passage('romans', 'Romans', 8, 19, 23),
      ],
      supportingPassages: [
        passage('revelation', 'Revelation', 22, 1, 5),
        passage('isaiah', 'Isaiah', 65, 17, 19),
        passage('1corinthians', '1 Corinthians', 2, 9, 9),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'An ending that is a beginning',
          body:
            'Scripture’s story does not end with disembodied souls floating in an ethereal heaven; it ends with a renewed creation where God dwells with His people face-to-face. Eden’s garden becomes, in Revelation, a garden-city filled with the glory of God—redemption’s goal is restored and perfected creation, not creation’s abandonment.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('revelation', 'Revelation', 21, 1, 4),
          note:
            'Interpretation: John sees “a new heaven and a new earth” and hears that God’s dwelling place is now with man—with every tear wiped away and death, mourning, crying, and pain gone forever. The center of the new creation’s blessing is God’s own presence, not merely the absence of suffering.',
        },
        {
          kind: 'concept',
          term: 'New heavens and new earth',
          explanation:
            'The renewed, purified, and glorified creation that believers will inhabit bodily after Christ’s return—continuous with the present creation in the same way the resurrection body is continuous with the present body, yet freed from sin, decay, and death.',
        },
        {
          kind: 'distinction',
          biblical:
            '2 Peter 3:10–13 says the heavens will “pass away” and the elements will be “burned up” or dissolved, while also anticipating “new heavens and a new earth in which righteousness dwells.” Romans 8:19–23 says creation itself will be “set free from its bondage to corruption” and obtain “the freedom of the glory of the children of God.”',
          interpretation:
            'Reformed theology generally reads these texts together as teaching purifying transformation and renewal of the present creation—paralleling the resurrection body’s continuity-with-transformation pattern—rather than its utter annihilation and replacement by an unrelated creation made from nothing.',
          disagreement:
            'Some Christians read 2 Peter 3’s “burned up” and “dissolved” language more literally, emphasizing the complete destruction and re-creation of the physical universe. Others, often appealing to Romans 8 and the resurrection-body analogy, read it as purifying judgment that renews rather than annihilates. This lesson teaches the renewal-emphasis reading common in Reformed theology while noting the alternate reading exists among faithful believers.',
        },
        {
          kind: 'attribution',
          teacherId: 'grudem',
          work: 'Systematic Theology',
          note:
            'Grudem treats the new heavens and new earth as the capstone of general eschatology, following resurrection, millennium, and final judgment. This lesson follows that organizational placement with original explanations.',
        },
        {
          kind: 'teaching',
          title: 'Face-to-face fellowship, not escape',
          body:
            'Revelation 21:3 and 22:4 describe God dwelling with His people and His people seeing His face—language of restored, unhindered fellowship that Eden only foreshadowed. The goal of redemption was never escape from a physical world but renewed, embodied communion with God within a creation finally set right.',
        },
        {
          kind: 'attribution',
          teacherId: 'macarthur',
          work: 'Published biblical teaching on the believer’s future hope',
          note:
            'Supplementary pastoral emphasis: concrete hope in a real future inheritance motivates present faithfulness amid suffering, rather than functioning as mere escapism. Paraphrased theme only.',
        },
        {
          kind: 'teaching',
          title: 'Living in light of the end',
          body:
            'New creation hope reshapes ordinary life now: it dignifies work and creation care as previews of coming renewal, steadies believers through grief with the promise of no more tears, and fuels mission because the gospel is what brings people into this coming inheritance.',
        },
      ],
      questions: L5_QUESTIONS,
      reflectionPrompts: [
        'Name one ordinary task or relationship this week you can approach differently in light of the hope of a renewed, embodied creation.',
      ],
      furtherStudy: [
        'Read Revelation 21–22 in full and list every description of what will be absent (no more sea, death, mourning, curse) and present (God’s glory, the river of life, the tree of life).',
        'Compare Isaiah 65:17–25 with Revelation 21–22 and note the shared imagery of renewal.',
      ],
      reviewFromLessonIds: ['last-resurrection-judgment', 'last-millennium'],
    },
  ],
}
