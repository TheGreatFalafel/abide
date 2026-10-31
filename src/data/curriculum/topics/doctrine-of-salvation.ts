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
/* Lesson 1 — Election and Effectual Calling                                  */
/* -------------------------------------------------------------------------- */

const L1_QUESTIONS: QuizQuestion[] = [
  mc(
    'sec-1-eph1',
    'Ephesians 1:3–6 says believers were chosen in Christ…',
    [
      'After the foundation of the world, once He foresaw their good works',
      'Before the foundation of the world, according to God’s gracious purpose and will',
      'Only as a group, with no individual choice ever described',
      'Because they first chose Him without any divine initiative',
    ],
    1,
    'Paul locates the choosing before creation itself and roots it in God’s own purpose and pleasure, not in something believers first contributed.',
  ),
  mc(
    'sec-1-rom9',
    'Romans 9:14–24 defends God’s right to show mercy to whomever He wills chiefly by appealing to…',
    [
      'Human fairness standards that judge God',
      'God’s own sovereign freedom as Creator, like a potter over clay',
      'A vote taken among the patriarchs',
      'The idea that God has no real say in salvation',
    ],
    1,
    'Paul answers the fairness objection not by softening God’s sovereignty but by asserting the Creator’s right to dispose of His creation as He wills, while still calling that mercy.',
  ),
  mc(
    'sec-1-calling',
    'This lesson distinguishes the "general call" of the gospel from "effectual calling" by saying the general call…',
    [
      'Goes out to everyone who hears the gospel, while effectual calling is the Spirit’s inward work that brings the elect to respond',
      'Is only given to a few people, while effectual calling goes to everyone',
      'Guarantees salvation for every hearer automatically',
      'Has nothing to do with the preaching of the gospel',
    ],
    0,
    'The external, general call is the open invitation of gospel preaching to all; effectual calling is the Spirit’s internal work that overcomes resistance in those God has chosen, producing an actual response of faith.',
  ),
  mc(
    'sec-1-john6',
    'John 6:37–44 teaches that those who come to Jesus are…',
    [
      'Entirely self-generated seekers with no divine involvement',
      'Given to Him by the Father and drawn by the Father, and He will never cast them out',
      'Random, with no connection between the Father’s will and who comes',
      'Guaranteed to come whether or not the Father is involved',
    ],
    1,
    'Jesus explicitly ties who comes to Him to the Father’s giving and drawing, while also promising that every single one who does come will be kept, not rejected.',
  ),
  open(
    'sec-1-open',
    'How does knowing that God’s choice of you did not depend on your own foreseen goodness change how secure or how humble you feel about your salvation?',
  ),
]

/* -------------------------------------------------------------------------- */
/* Lesson 2 — Regeneration and Conversion                                     */
/* -------------------------------------------------------------------------- */

const L2_QUESTIONS: QuizQuestion[] = [
  mc(
    'src-2-john3',
    'In John 3:3–8, Jesus tells Nicodemus that to see the kingdom of God a person must…',
    [
      'Simply try harder to keep the law',
      'Be born again, a work Jesus compares to the Spirit’s mysterious, sovereign action like the wind',
      'Be born into the right ethnic family',
      'Wait for a future resurrection before any change can happen',
    ],
    1,
    'Jesus describes new birth as necessary and as the Spirit’s own doing—unpredictable and sovereign like wind, not a technique a person masters.',
  ),
  mc(
    'src-2-ezek36',
    'Ezekiel 36:26–27 promises that God will…',
    [
      'Leave the heart unchanged but improve behavior',
      'Give a new heart and a new spirit, removing the heart of stone and giving a heart of flesh, and put His Spirit within',
      'Punish the heart without ever renewing it',
      'Give a new heart only to those who first perfect themselves',
    ],
    1,
    'The promise is an internal transformation worked by God Himself—a new heart and indwelling Spirit—not merely external reform.',
  ),
  mc(
    'src-2-order',
    'This lesson’s Reformed ordering of regeneration and faith teaches that…',
    [
      'Faith produces regeneration; a person believes first and is then born again',
      'Regeneration is the Spirit’s sovereign work that enables and precedes the sinner’s first act of saving faith',
      'Regeneration and faith are entirely unrelated events',
      'Regeneration only happens after a lifetime of good works',
    ],
    1,
    'Reformed theology holds that spiritually dead sinners cannot generate saving faith on their own; the Spirit’s regenerating work gives the new life from which genuine faith and repentance spring.',
  ),
  mc(
    'src-2-acts2',
    'Acts 2:37–38 shows that true conversion involves both…',
    [
      'Repentance and faith expressed in a changed life, not mere curiosity',
      'Only intellectual agreement with facts about Jesus',
      'Baptism alone, without any inward change',
      'A private feeling with no outward response at all',
    ],
    0,
    'The crowd’s cut-to-the-heart conviction leads to the call to repent—turning from sin—and to be baptized in response to faith, showing conversion as a whole-person turning, not a bare mental assent.',
  ),
  open(
    'src-2-open',
    'Can you point to evidence in your own life of a "new heart"—a change in desires, not just behavior? Describe it, or describe what you long for God to change.',
  ),
]

/* -------------------------------------------------------------------------- */
/* Lesson 3 — Justification by Faith                                         */
/* -------------------------------------------------------------------------- */

const L3_QUESTIONS: QuizQuestion[] = [
  mc(
    'sj-3-rom3',
    'Romans 3:21–26 describes justification as a righteousness that comes…',
    [
      'Through keeping the law perfectly',
      'As a gift, through faith in Jesus Christ, apart from the law, to all who believe',
      'Only to those born into a particular nation',
      'Through human effort that eventually earns God’s favor',
    ],
    1,
    'Paul is emphatic that this righteousness is received as a gift through faith, explicitly apart from law-keeping as the ground of acceptance with God.',
  ),
  mc(
    'sj-3-rom5',
    'Romans 5:1 says that because believers are justified by faith, they have…',
    ['Continued hostility toward God', 'Peace with God through our Lord Jesus Christ', 'A probationary truce pending further good works', 'No real change in their standing before God'],
    1,
    'Justification produces an actual change of legal standing—from condemned to at peace with God—not a temporary ceasefire awaiting further proof.',
  ),
  mc(
    'sj-3-forensic',
    'This lesson describes justification as "forensic," meaning it is…',
    [
      'A gradual moral transformation over a lifetime',
      'A legal declaration of righteous status before God’s court, based on Christ’s righteousness, not a description of a process of becoming righteous',
      'Something earned slowly through religious ritual',
      'Unrelated to any legal or courtroom imagery in Scripture',
    ],
    1,
    '"Forensic" points to a courtroom declaration: God the Judge declares the believer righteous based on Christ’s righteousness credited to them, distinct from the ongoing moral change of sanctification.',
  ),
  mc(
    'sj-3-gal2',
    'Galatians 2:16 teaches that a person is justified…',
    [
      'By works of the law',
      'By faith in Jesus Christ, not by works of the law',
      'By a combination of law-keeping and faith in equal measure',
      'By ancestry alone',
    ],
    1,
    'Paul states the alternative directly: not works of the law, but faith in Christ, as the means of being declared righteous before God.',
  ),
  open(
    'sj-3-open',
    'If justification is a legal declaration already settled rather than a process still underway, how should that affect the way you handle guilt over a specific past failure?',
  ),
]

/* -------------------------------------------------------------------------- */
/* Lesson 4 — Adoption                                                        */
/* -------------------------------------------------------------------------- */

const L4_QUESTIONS: QuizQuestion[] = [
  mc(
    'sad-4-rom8',
    'Romans 8:14–17 says that those led by the Spirit of God are…',
    [
      'Still slaves with no family status',
      'Sons of God who have received the Spirit of adoption, enabling them to cry "Abba, Father"',
      'Merely servants with no inheritance',
      'Strangers kept at a permanent distance from God',
    ],
    1,
    'Paul contrasts the "spirit of slavery" with the "Spirit of adoption," showing that believers are given a genuine family relationship with intimate access to God as Father.',
  ),
  mc(
    'sad-4-gal4',
    'Galatians 4:4–7 connects Christ’s incarnation and redemption directly to believers receiving…',
    [
      'Temporary servant status only',
      'Adoption as sons, along with the Spirit and the status of an heir',
      'No change in legal status at all',
      'A status that must still be earned through further obedience',
    ],
    1,
    'Paul traces a direct line from Christ’s redemptive work to believers’ adoption as sons and heirs, a status given, not earned.',
  ),
  mc(
    'sad-4-distinct',
    'This lesson distinguishes adoption from justification by saying adoption emphasizes…',
    [
      'The same legal acquittal that justification describes, with no new content',
      'The relational and familial privilege of belonging to God’s family, alongside the legal acquittal of justification',
      'A status believers lose and regain repeatedly',
      'Something only angels receive',
    ],
    1,
    'Justification answers "Am I guilty or innocent before the Judge?" Adoption answers a further question: "Do I belong, and am I loved as a child?" Both are real, distinct gifts received together through union with Christ.',
  ),
  mc(
    'sad-4-1john3',
    '1 John 3:1–2 responds to the truth that believers are called children of God with…',
    [
      'Indifference, since the title changes nothing practical',
      'Wonder at the kind of love that grants this status, plus hope for future transformation',
      'Fear that the status might be revoked without warning',
      'A claim that no one can actually know this status now',
    ],
    1,
    'John marvels at the Father’s love behind this title and anchors present identity in a confident hope of future, complete Christlikeness.',
  ),
  open(
    'sad-4-open',
    'Do you relate to God more like a nervous employee trying to keep a job, or a beloved child who belongs in the family no matter what? What would change if you believed the second posture fully?',
  ),
]

/* -------------------------------------------------------------------------- */
/* Lesson 5 — Sanctification                                                  */
/* -------------------------------------------------------------------------- */

const L5_QUESTIONS: QuizQuestion[] = [
  mc(
    'ssa-5-1thess4',
    '1 Thessalonians 4:3–8 says God’s will for believers is their…',
    [
      'Indifference to moral conduct',
      'Sanctification, including abstaining from sexual immorality and living in holiness and honor',
      'Complete freedom from any moral expectation',
      'Salvation without any accompanying change in conduct',
    ],
    1,
    'Paul names sanctification directly as God’s will, with concrete, practical implications for how believers live, not an abstract or optional add-on.',
  ),
  mc(
    'ssa-5-rom6',
    'Romans 6:1–14 argues that believers should not keep sinning because they…',
    [
      'Have no real power over sin yet',
      'Have died to sin and been united to Christ’s death and resurrection, so sin should no longer reign over them',
      'Are no longer capable of sinning at all',
      'Must earn their union with Christ through sinless living',
    ],
    1,
    'Paul grounds the call to holy living in a settled fact—union with Christ in His death and resurrection—not in willpower alone or in sinlessness already achieved.',
  ),
  mc(
    'ssa-5-definitive-progressive',
    'This lesson distinguishes "definitive" from "progressive" sanctification by saying definitive sanctification is…',
    [
      'The believer’s gradual lifelong growth in holiness',
      'The decisive break from sin’s dominion that happens at conversion through union with Christ, distinct from the ongoing, lifelong process of growth',
      'Something that happens only at death',
      'Identical in every way to justification',
    ],
    1,
    'Definitive sanctification names the once-for-all break from sin’s ruling power at conversion; progressive sanctification names the ongoing, Spirit-empowered growth in holiness that follows across a lifetime.',
  ),
  mc(
    'ssa-5-phil2',
    'Philippians 2:12–13 holds together believers’ responsibility to "work out" their salvation with the truth that…',
    [
      'God does nothing, leaving it entirely to human effort',
      'God is at work in them, enabling both their willing and their working',
      'Working out salvation means earning it from scratch',
      'Effort and God’s grace are mutually exclusive and cannot be held together',
    ],
    1,
    'Paul commands real human effort while grounding that very effort in God’s prior, enabling work—responsibility and grace are not competitors here but partners.',
  ),
  open(
    'ssa-5-open',
    'Name one specific area where you want to see real growth this year, and describe what depending on God’s enabling grace (rather than sheer willpower) might look like in that area.',
  ),
]

/* -------------------------------------------------------------------------- */
/* Lesson 6 — Perseverance and Glorification                                  */
/* -------------------------------------------------------------------------- */

const L6_QUESTIONS: QuizQuestion[] = [
  mc(
    'spg-6-john10',
    'John 10:27–29 teaches that Jesus’ sheep…',
    [
      'May be snatched out of His hand by any sufficiently strong force',
      'Hear His voice, are known by Him, and are given eternal life, and no one will snatch them out of His hand',
      'Have no real security and must keep re-earning salvation daily',
      'Are kept only if they never sin again',
    ],
    1,
    'Jesus states the security of His sheep in the strongest possible terms—given eternal life, held by Him, and safe from being snatched away by any outside force.',
  ),
  mc(
    'spg-6-rom8',
    'Romans 8:38–39 lists a series of hostile powers and concludes that none of them can…',
    [
      'Separate believers from the love of God in Christ Jesus',
      'Ever be defeated by Christ',
      'Affect believers at all, since Christians never suffer',
      'Be named, since Paul leaves the list incomplete on purpose',
    ],
    0,
    'Paul’s sweeping list of possible threats ends in one conclusion: none of them is strong enough to separate a believer from God’s love secured in Christ.',
  ),
  mc(
    'spg-6-perseverance',
    'This lesson describes "perseverance of the saints" as the teaching that…',
    [
      'Anyone who ever prayed a prayer is guaranteed heaven regardless of ongoing faith',
      'True believers, preserved by God’s power, will continue in faith to the end, so that perseverance is both God’s preserving work and the believer’s ongoing, genuine walk of faith',
      'Perseverance depends entirely on human willpower with no divine help',
      'Every person who professes faith will necessarily persevere, with no place for examining the genuineness of someone’s faith',
    ],
    1,
    'Reformed teaching holds these together: God preserves His own, and that preservation is expressed through, not apart from, the believer’s ongoing, real (even if imperfect) perseverance in faith.',
  ),
  mc(
    'spg-6-phil1',
    'Philippians 1:6 expresses confidence that God…',
    [
      'Began a good work in believers but may abandon it',
      'Will bring to completion the good work He began, until the day of Christ',
      'Never actually begins any work in a person',
      'Completes His work only in especially gifted believers',
    ],
    1,
    'Paul’s confidence rests on God’s own faithfulness to finish what He started—grounding assurance in God’s character, not in the believer’s performance.',
  ),
  mc(
    'spg-6-glorification',
    '1 Peter 1:3–5 connects believers’ "living hope" to an inheritance that is…',
    [
      'Perishable and likely to fade before it is received',
      'Imperishable, unfading, and kept in heaven, guarded by God’s power',
      'Already fully experienced with nothing left to anticipate',
      'Dependent entirely on the believer’s own strength to guard',
    ],
    1,
    'Peter describes glorification as a secure future inheritance, kept safe by God’s power rather than the believer’s own strength, grounding hope rather than anxiety.',
  ),
  open(
    'spg-6-open',
    'Reformed teaching distinguishes real assurance (resting in God’s preserving grace) from presumption (assuming salvation while showing no interest in following Christ). Where do you see evidence of genuine, ongoing faith in your own life right now?',
  ),
]

/**
 * Third complete theology topic: the doctrine of salvation, organized around
 * the ordo salutis (Grudem-organized soteriology, with original lesson writing).
 */
export const DOCTRINE_OF_SALVATION: CurriculumTopic = {
  id: 'doctrine-of-salvation',
  title: 'The Doctrine of Salvation',
  description:
    'A Reformed study of how sinners come to be saved and kept, following the classic order of salvation: God’s unconditional election and effectual calling, the Spirit’s regenerating work and the sinner’s repentance and faith, justification by faith alone, adoption into God’s family, lifelong sanctification, and the sure hope of perseverance and future glorification.',
  objectives: [
    'Describe unconditional election and effectual calling, and state the Arminian alternative fairly.',
    'Explain regeneration as the Spirit’s sovereign work that enables genuine repentance and saving faith.',
    'State justification by faith alone as a legal declaration grounded in Christ’s righteousness, distinct from ongoing moral change.',
    'Explain adoption as believers’ relational standing as God’s beloved children.',
    'Distinguish definitive and progressive sanctification and relate grace to effort without pitting them against each other.',
    'Articulate the perseverance of the saints and the hope of glorification, grounded in God’s preserving power rather than human performance.',
  ],
  estimatedMinutes: 110,
  prerequisites: ['doctrine-of-christ'],
  framework: 'reformed',
  version: 1,
  sources: [
    {
      ...SOURCE_GRUDEM_ORG,
      note:
        'Topic order and major headings follow the classic ordo salutis sequence used in systematic theology (election/calling; regeneration/conversion; justification; adoption; sanctification; perseverance/glorification) as a map for original lesson writing—not as reproduced textbook text.',
    },
    {
      ...SOURCE_SPROUL_SUP,
      note:
        'Sproul’s well-known public emphasis on the sovereignty of grace in salvation and on the assurance believers have in God’s preserving power supplements the lessons on election and perseverance. Claims here are original paraphrase of widely known themes, not quoted material.',
    },
    {
      ...SOURCE_MACARTHUR_SUP,
      note:
        'MacArthur’s Scripture-centered pastoral stress on genuine repentance, the fruit of true conversion, and the call to ongoing holiness supplements the lessons on conversion and sanctification. No sermon transcripts are reproduced.',
    },
  ],
  lessons: [
    {
      id: 'salvation-election-calling',
      order: 1,
      title: 'Election and Effectual Calling',
      estimatedMinutes: 20,
      objectives: [
        'State the Reformed doctrine of unconditional election from Ephesians 1 and Romans 9.',
        'Distinguish the general gospel call from the Spirit’s effectual calling.',
        'Summarize the Arminian alternative view of conditional election fairly.',
      ],
      primaryPassages: [
        passage('ephesians', 'Ephesians', 1, 3, 6),
        passage('romans', 'Romans', 8, 28, 30),
        passage('romans', 'Romans', 9, 14, 24),
        passage('john', 'John', 6, 37, 44),
      ],
      supportingPassages: [
        passage('2thessalonians', '2 Thessalonians', 2, 13, 14),
        passage('matthew', 'Matthew', 22, 1, 14),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Starting where salvation starts: in God',
          body:
            'The doctrine of salvation begins not with a human decision but with God’s own eternal purpose. Before looking at what happens inside a person at conversion, Scripture directs attention further back—to God’s choice, made before the world existed, to save a people for Himself.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('ephesians', 'Ephesians', 1, 3, 6),
          note:
            'Interpretation: Paul explicitly places God’s choosing "before the foundation of the world" and roots it in God’s own purpose and pleasure, not in anything believers would do or become. The praise that follows ("to the praise of his glorious grace") shows this truth is meant to produce worship, not anxiety or pride.',
        },
        {
          kind: 'concept',
          term: 'Unconditional election',
          explanation:
            'The teaching that God chose, before creation, specific individuals to be saved, based on His own gracious purpose rather than on any foreseen faith, merit, or goodness in those individuals. "Unconditional" means the choice does not depend on a condition met by the person chosen.',
        },
        {
          kind: 'distinction',
          biblical:
            'Ephesians 1:4–5 says God chose believers "before the foundation of the world" and predestined them "according to the purpose of his will." Romans 9 defends God’s freedom to show mercy to whom He wills, comparing God to a potter with authority over the clay.',
          interpretation:
            'Reformed theology concludes that election is unconditional: grounded in God’s sovereign will and grace, not in foreseen human faith or merit, since Scripture never cites a human condition as the reason for God’s choice and explicitly denies that it rests on "works" (Romans 9:11–12).',
          disagreement:
            'Arminian theology holds "conditional election": God chooses to save those whom He foresees will freely believe, so the ultimate deciding factor is the individual’s foreseen free response rather than an unconditional divine decree. Thoughtful believers who hold this view affirm the same high view of God’s grace and the same confidence that salvation is undeserved; they locate the deciding factor differently than Reformed theology does. This curriculum teaches the Reformed position while representing the alternative accurately rather than caricaturing it.',
        },
        {
          kind: 'concept',
          term: 'Effectual calling',
          explanation:
            'The Spirit’s inward, powerful work that brings a chosen sinner to actually respond to the outward, general call of the gospel with faith. It is distinguished from the "general call"—the open, external invitation of gospel preaching, which goes out to everyone who hears but which not everyone embraces.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('john', 'John', 6, 37, 44),
          note:
            'Interpretation: Jesus ties who comes to Him to the Father’s giving and drawing, while promising unbreakable security to everyone who does come. The passage holds together divine initiative and a real, personal act of coming to Christ.',
        },
        {
          kind: 'teaching',
          title: 'Why this matters pastorally, not just academically',
          body:
            'Election is easy to turn into a cold debate, but Scripture presents it as a source of comfort: your salvation does not finally rest on the stability of your own choice, but on God’s unchanging purpose, settled before you existed. That should produce humility (you did not out-choose anyone) and security (God will not revise His mind about you).',
        },
        {
          kind: 'attribution',
          teacherId: 'grudem',
          work: 'Systematic Theology',
          note:
            'Organizational cue: Grudem’s soteriology begins the ordo salutis with election and effectual calling before regeneration and conversion. This lesson follows that same logical starting point with original explanations.',
        },
      ],
      questions: L1_QUESTIONS,
      reflectionPrompts: [
        'Write a short prayer of thanks that does not mention anything you did to deserve being chosen—only what God did.',
      ],
      furtherStudy: [
        'Read Matthew 22:1–14 and notice how the parable holds together a wide, public invitation and a smaller number who are specifically described as "chosen."',
      ],
    },
    {
      id: 'salvation-regeneration-conversion',
      order: 2,
      title: 'Regeneration and Conversion',
      estimatedMinutes: 18,
      objectives: [
        'Explain regeneration as the Spirit’s sovereign act of giving spiritual life.',
        'Describe repentance and faith as the twin responses that make up genuine conversion.',
        'State the Reformed view that regeneration precedes and enables saving faith, noting the synergistic alternative fairly.',
      ],
      primaryPassages: [
        passage('john', 'John', 3, 3, 8),
        passage('titus', 'Titus', 3, 5, 5),
        passage('ezekiel', 'Ezekiel', 36, 26, 27),
        passage('acts', 'Acts', 2, 37, 38),
      ],
      supportingPassages: [
        passage('ephesians', 'Ephesians', 2, 4, 5),
        passage('2corinthians', '2 Corinthians', 5, 17, 17),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'From chosen to changed',
          body:
            'Election describes what God decided in eternity; regeneration describes what God does inside a person in time. Where election answers "why was I saved," regeneration answers "how did I actually become alive to God."',
        },
        {
          kind: 'scripture_focus',
          passage: passage('john', 'John', 3, 3, 8),
          note:
            'Interpretation: Jesus insists that seeing God’s kingdom requires being "born again"—language of a new beginning, not self-improvement. He compares the Spirit’s work to the wind: real, perceptible in its effects, but not produced or controlled by the person it moves.',
        },
        {
          kind: 'concept',
          term: 'Regeneration',
          explanation:
            'The Spirit’s sovereign act of giving spiritual life to someone who was spiritually dead, producing a new inner disposition toward God. It is often pictured in Scripture as a new birth or a new heart replacing a heart of stone.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('ezekiel', 'Ezekiel', 36, 26, 27),
          note:
            'Interpretation: God promises to personally remove a resistant "heart of stone" and give a responsive "heart of flesh," along with His own indwelling Spirit. This is an unconditional divine promise of inner transformation, not a description of self-generated reform.',
        },
        {
          kind: 'distinction',
          biblical:
            'Titus 3:5 says God saved us "not because of works done by us... but according to his own mercy, by the washing of regeneration." Ephesians 2:4–5 says God made us alive "even when we were dead in our trespasses."',
          interpretation:
            'Reformed theology concludes that regeneration logically precedes and enables saving faith: spiritually dead sinners cannot generate the very faith that responds to the gospel; the Spirit’s regenerating work gives the new life from which repentance and faith genuinely spring, as the sinner’s own free act.',
          disagreement:
            'Some traditions hold a more synergistic order, in which a person’s will cooperates with prevenient (enabling) grace to choose faith, and regeneration follows that free choice as its result rather than preceding it. Both views affirm that grace is necessary and that no one is saved by unaided human effort; they differ on the exact order between the Spirit’s inward work and the sinner’s first act of faith.',
        },
        {
          kind: 'concept',
          term: 'Conversion',
          explanation:
            'The sinner’s conscious response to the gospel, made up of two inseparable parts: repentance (a genuine turning away from sin toward God) and faith (trusting personally in Christ for salvation). Conversion is the visible, experienced side of what regeneration accomplishes invisibly.',
        },
        {
          kind: 'teaching',
          title: 'Real change, not just relief',
          body:
            'Acts 2 shows conversion as more than relief from guilt—it is a whole-person turning, marked by conviction, repentance, and a changed direction of life. Genuine regeneration always produces some real, if imperfect, fruit; it is not merely an invisible status with no observable effect.',
        },
        {
          kind: 'attribution',
          teacherId: 'macarthur',
          work: 'Biblical teaching on repentance and genuine conversion',
          note:
            'Supplementary pastoral stress: true conversion is marked by actual, observable repentance and changed desires, not merely a one-time decision with no accompanying life change.',
        },
      ],
      questions: L2_QUESTIONS,
      reflectionPrompts: [
        'Describe, as concretely as you can, one desire or affection that is different now than before you trusted Christ (or that you long to see change if you are early in your faith).',
      ],
      furtherStudy: [
        'Read 2 Corinthians 5:17 and consider what "new creation" implies beyond mere behavior modification.',
      ],
      reviewFromLessonIds: ['salvation-election-calling'],
    },
    {
      id: 'salvation-justification',
      order: 3,
      title: 'Justification by Faith',
      estimatedMinutes: 20,
      objectives: [
        'Define justification as a forensic, legal declaration rather than a gradual process.',
        'Explain the role of Christ’s imputed righteousness in justification.',
        'State the historic Roman Catholic alternative view fairly and identify the Reformation dividing line.',
      ],
      primaryPassages: [
        passage('romans', 'Romans', 3, 21, 26),
        passage('romans', 'Romans', 5, 1, 1),
        passage('galatians', 'Galatians', 2, 16, 16),
        passage('2corinthians', '2 Corinthians', 5, 21, 21),
      ],
      supportingPassages: [
        passage('philippians', 'Philippians', 3, 8, 9),
        passage('romans', 'Romans', 4, 4, 8),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'The question behind the doctrine',
          body:
            'If regeneration explains how a sinner becomes spiritually alive, justification answers a different, equally urgent question: how can a guilty sinner stand accepted before a perfectly just God? Scripture’s answer is not "by becoming good enough" but "by faith in what Christ has done."',
        },
        {
          kind: 'scripture_focus',
          passage: passage('romans', 'Romans', 3, 21, 26),
          note:
            'Interpretation: Paul presents a righteousness that comes as a gift through faith, "apart from the law," because it is grounded in Christ’s atoning death. The passage explicitly frames the problem as God needing to be "just and the justifier" at the same time—justification solves that tension.',
        },
        {
          kind: 'concept',
          term: 'Justification',
          explanation:
            'God’s legal declaration that a believing sinner is righteous in His sight, based not on their own performance but on Christ’s righteousness credited (imputed) to them through faith. It changes a person’s standing before God’s judgment, not merely their feelings or future behavior.',
        },
        {
          kind: 'distinction',
          biblical:
            'Romans 5:1 says believers "have been justified by faith" and as a result "have peace with God"—stated as an accomplished fact. 2 Corinthians 5:21 describes a double exchange: our sin credited to the sinless Christ, His righteousness credited to us.',
          interpretation:
            'Reformed theology describes justification as "forensic"—a legal, once-for-all declaration of righteous status, distinct from sanctification (the ongoing process of becoming more righteous in actual conduct). The ground of justification is entirely Christ’s righteousness, received through faith alone, not infused merit gradually earned over a lifetime.',
          disagreement:
            'Historic Roman Catholic teaching has described justification differently: as a process in which a person is not merely declared righteous but is actually made inwardly righteous through infused grace, cooperated with over time through faith and good works, such that final justification can be spoken of as still underway or dependent on a life of grace-assisted merit. This difference—a legal declaration received by faith alone versus a lifelong process of being made righteous—was a central, church-dividing issue at the Reformation. This curriculum teaches the Reformation’s "faith alone" (sola fide) position while describing the historic alternative accurately rather than dismissively.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('galatians', 'Galatians', 2, 16, 16),
          note:
            'Interpretation: Paul states the alternative directly and personally—not justified by works of the law, but by faith in Jesus Christ—applying the doctrine to a real, contested first-century dispute about how Jewish and Gentile believers are accepted by God.',
        },
        {
          kind: 'teaching',
          title: 'Settled status, ongoing growth',
          body:
            'Because justification is a legal declaration rather than a process, it is complete the moment someone trusts Christ—it does not grow stronger over a lifetime of obedience, nor does it weaken when a believer stumbles. Growth in actual holiness is real and important, but it belongs to sanctification (Lesson 5), not to the settled legal verdict of justification.',
        },
        {
          kind: 'attribution',
          teacherId: 'sproul',
          work: 'Teaching on justification by faith alone',
          note:
            'Supplementary emphasis: justification as a legal declaration received by faith, distinct from the believer’s ongoing moral transformation, is a widely known Reformation theme applied here to everyday assurance. Original paraphrase only.',
        },
      ],
      questions: L3_QUESTIONS,
      reflectionPrompts: [
        'Identify one way you tend to treat your standing with God as something you must keep re-earning through good behavior, and bring that specific pattern to God in prayer.',
      ],
      furtherStudy: [
        'Read Philippians 3:8–9 and notice how Paul describes trading his own prior religious credentials for "the righteousness... that comes through faith in Christ."',
      ],
      reviewFromLessonIds: ['salvation-election-calling', 'salvation-regeneration-conversion'],
    },
    {
      id: 'salvation-adoption',
      order: 4,
      title: 'Adoption',
      estimatedMinutes: 16,
      objectives: [
        'Describe adoption as believers’ relational standing as God’s beloved children.',
        'Distinguish adoption from justification as a related but distinct benefit of union with Christ.',
        'Apply the truth of adoption to assurance and prayer.',
      ],
      primaryPassages: [
        passage('romans', 'Romans', 8, 14, 17),
        passage('galatians', 'Galatians', 4, 4, 7),
        passage('ephesians', 'Ephesians', 1, 5, 5),
        passage('1john', '1 John', 3, 1, 2),
      ],
      supportingPassages: [
        passage('romans', 'Romans', 8, 23, 23),
        passage('john', 'John', 1, 12, 12),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Not just acquitted—welcomed',
          body:
            'Justification settles the legal question of guilt. Adoption answers a further, relational question: once declared not guilty, what is a believer’s actual standing in God’s household? Scripture’s answer is startling: full family membership, not merely a cleared record.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('romans', 'Romans', 8, 14, 17),
          note:
            'Interpretation: Paul contrasts the "spirit of slavery," which produces fear, with the "Spirit of adoption," which produces the intimate cry "Abba, Father." Believers are explicitly called "heirs," sharing in Christ’s own inheritance.',
        },
        {
          kind: 'concept',
          term: 'Adoption',
          explanation:
            'The gracious act by which God brings believers, who were formerly outside His family, into full standing as His own beloved children, with all the relational privileges, intimacy, and inheritance rights that status implies.',
        },
        {
          kind: 'distinction',
          biblical:
            'Galatians 4:4–7 moves directly from Christ’s redemptive work to receiving "the Spirit of his Son" and the status of "son" and "heir." 1 John 3:1–2 marvels that believers are actually called children of God, with future transformation still to come.',
          interpretation:
            'Reformed theology treats adoption as a distinct benefit of salvation, received together with justification through union with Christ, but answering a different question: justification addresses legal guilt, while adoption addresses relational belonging and inheritance. Holding both together prevents either a cold, merely legal view of salvation or a vague, merely emotional one.',
          disagreement:
            'Not every theological tradition gives adoption separate, extended treatment; some fold its themes into justification or into the broader category of union with Christ without treating it as its own distinct locus. This curriculum, following common Reformed systematic treatments, gives adoption its own lesson because of how directly Scripture ties believers’ identity and confidence in prayer to this specific image, while recognizing other faithful teachers organize the same material differently.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('ephesians', 'Ephesians', 1, 5, 5),
          note:
            'Interpretation: Paul places adoption inside the same eternal plan described in Lesson 1—"he predestined us for adoption"—showing that God’s eternal choice and believers’ present family status are part of one unified purpose, not two unrelated topics.',
        },
        {
          kind: 'teaching',
          title: 'What this changes',
          body:
            'A believer who only knows justification may relate to God like a defendant relieved to be acquitted—grateful, but distant. A believer who grasps adoption relates to God as a child relates to a loving father: secure, free to ask, free to fail and be received, not performing for approval but resting in a love already given.',
        },
        {
          kind: 'attribution',
          teacherId: 'grudem',
          work: 'Systematic Theology',
          note:
            'Organizational cue: adoption is treated here as its own step in the ordo salutis, following justification, consistent with standard systematic sequencing. Original explanation for learners.',
        },
      ],
      questions: L4_QUESTIONS,
      reflectionPrompts: [
        'Try praying "Abba, Father" slowly, and notice what resistance or relief that brings up in you.',
      ],
      furtherStudy: [
        'Read Romans 8:23 and consider how "adoption" is spoken of as something believers still await in its fullness, alongside what they already possess now.',
      ],
      reviewFromLessonIds: ['salvation-justification', 'salvation-regeneration-conversion'],
    },
    {
      id: 'salvation-sanctification',
      order: 5,
      title: 'Sanctification',
      estimatedMinutes: 18,
      objectives: [
        'Distinguish definitive sanctification (a decisive break from sin’s dominion) from progressive sanctification (lifelong growth).',
        'Explain how grace and effort cooperate in the believer’s pursuit of holiness.',
        'State a historic perfectionist alternative view fairly and explain the typical Reformed response.',
      ],
      primaryPassages: [
        passage('1thessalonians', '1 Thessalonians', 4, 3, 8),
        passage('romans', 'Romans', 6, 1, 14),
        passage('philippians', 'Philippians', 2, 12, 13),
        passage('2corinthians', '2 Corinthians', 3, 18, 18),
      ],
      supportingPassages: [
        passage('galatians', 'Galatians', 5, 16, 25),
        passage('hebrews', 'Hebrews', 12, 14, 14),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Adopted, and being made like the Father',
          body:
            'Family belonging (adoption) does not leave a believer unchanged; children of God are meant to grow to resemble their Father. Sanctification is the process by which the Spirit makes a justified, adopted believer increasingly holy in actual thought, desire, and conduct.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('1thessalonians', '1 Thessalonians', 4, 3, 8),
          note:
            'Interpretation: Paul calls sanctification God’s revealed "will" for believers, with specific, practical content—not an abstract ideal detached from everyday choices.',
        },
        {
          kind: 'concept',
          term: 'Definitive sanctification',
          explanation:
            'The decisive break from sin’s ruling power that happens at conversion through union with Christ’s death and resurrection (Romans 6). It is a settled, past-tense reality: sin no longer reigns as master over the believer, even though it still remains and must be fought.',
        },
        {
          kind: 'concept',
          term: 'Progressive sanctification',
          explanation:
            'The ongoing, lifelong process by which the Spirit conforms a believer increasingly into Christ’s likeness in actual character and conduct, marked by real but gradual, sometimes uneven, growth rather than instant perfection.',
        },
        {
          kind: 'distinction',
          biblical:
            'Romans 6 speaks of believers as having already "died to sin" so that sin "will have no dominion" over them—settled, decisive language. Philippians 2:12–13 commands believers to "work out" their salvation "with fear and trembling," because God is at work in them—ongoing, active language.',
          interpretation:
            'Reformed theology holds both emphases together: a decisive, once-for-all break from sin’s mastery (definitive sanctification) and a real, ongoing, cooperative process of growth that requires genuine human effort empowered by God’s grace (progressive sanctification). Grace does not make effort unnecessary; grace is what makes faithful effort possible and fruitful.',
          disagreement:
            'Some traditions, often associated with certain strands of the Wesleyan "entire sanctification" or "Christian perfection" teaching, hold that believers can reach a state in this life marked by freedom from ongoing conscious sin or inward rebellion against God. Reformed theology typically holds that Scripture (e.g., 1 John 1:8; Philippians 3:12) describes sanctification as real but incomplete in this life, with believers genuinely growing yet still contending with remaining sin until glorification. Both positions take holiness seriously; they differ on how much victory over sin Scripture promises before death or Christ’s return.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('2corinthians', '2 Corinthians', 3, 18, 18),
          note:
            'Interpretation: Paul pictures believers being transformed "from one degree of glory to another," explicitly gradual language ("from... to another") describing the Spirit’s ongoing work rather than instantaneous completion.',
        },
        {
          kind: 'teaching',
          title: 'Grace-fueled effort',
          body:
            'Philippians 2:12–13 refuses to let "grace" become an excuse for passivity, and refuses to let "effort" become self-reliant moralism. Believers pursue holiness energetically, precisely because God Himself is working in them to supply both the desire and the power to do so.',
        },
        {
          kind: 'attribution',
          teacherId: 'macarthur',
          work: 'Biblical teaching on practical holiness',
          note:
            'Supplementary pastoral stress: genuine sanctification shows up in observable, practical obedience, not merely in theological knowledge about grace.',
        },
      ],
      questions: L5_QUESTIONS,
      reflectionPrompts: [
        'Identify one concrete habit of obedience you will practice this week, and name specifically how you are depending on the Spirit’s power rather than sheer willpower to do it.',
      ],
      furtherStudy: [
        'Read Galatians 5:16–25 and compare the "works of the flesh" with the "fruit of the Spirit" as two opposite directions of growth.',
      ],
      reviewFromLessonIds: ['salvation-justification', 'salvation-adoption'],
    },
    {
      id: 'salvation-perseverance-glorification',
      order: 6,
      title: 'Perseverance and Glorification',
      estimatedMinutes: 18,
      objectives: [
        'Explain the perseverance of the saints as grounded in God’s preserving power, not merely human willpower.',
        'Distinguish biblical assurance from presumption.',
        'Describe glorification as the completion of salvation in resurrection and full Christlikeness.',
      ],
      primaryPassages: [
        passage('john', 'John', 10, 27, 29),
        passage('romans', 'Romans', 8, 28, 30),
        passage('philippians', 'Philippians', 1, 6, 6),
        passage('1peter', '1 Peter', 1, 3, 5),
      ],
      supportingPassages: [
        passage('romans', 'Romans', 8, 38, 39),
        passage('1john', '1 John', 2, 19, 19),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Closing the loop with election',
          body:
            'This topic began with God’s unconditional choice before creation. It ends with the promise that those God chose, called, justified, and adopted will in fact be kept to the end and finally glorified. Perseverance is not a separate doctrine bolted on at the finish line; it is election’s own guaranteed outcome.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('romans', 'Romans', 8, 28, 30),
          note:
            'Interpretation: Paul’s chain—foreknown, predestined, called, justified, glorified—moves from eternity past to future certainty without a single broken link. Those God begins with, He finishes with.',
        },
        {
          kind: 'concept',
          term: 'Perseverance of the saints',
          explanation:
            'The teaching that true believers, preserved by God’s own power, will continue in genuine faith to the end and will not finally and fully fall away from salvation. It describes both God’s preserving work and the believer’s real, ongoing (though imperfect) walk of faith as two sides of one reality.',
        },
        {
          kind: 'distinction',
          biblical:
            'John 10:27–29 says no one will snatch Christ’s sheep out of His hand. Yet 1 John 2:19 says of some who left the faith that "they were not of us," implying that not every outward professor was ever truly regenerate to begin with.',
          interpretation:
            'Reformed theology holds that genuinely regenerate believers will be preserved by God to final salvation, while recognizing that some who outwardly profess faith and later abandon it entirely may never have been truly born again. Perseverance is not a claim that every emotional decision guarantees heaven regardless of a life lived in open, unrepentant rejection of Christ; it is a claim that God’s own people will not be lost.',
          disagreement:
            'Arminian theology typically holds that a genuinely regenerate believer can, through decisively turning away in unbelief, forfeit salvation and finally be lost (apostasy as a real loss of a once-genuine salvation), rather than concluding that such a person was never truly regenerate. Both views take warnings against falling away with full seriousness and agree such warnings are not empty; they differ on what explains someone who was once a visible, apparently sincere believer and later definitively abandons the faith.',
        },
        {
          kind: 'concept',
          term: 'Glorification',
          explanation:
            'The final stage of salvation, in which believers are raised bodily, fully freed from sin, and completely conformed to Christ’s likeness—the completion of what justification declared, adoption welcomed, and sanctification began.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('1peter', '1 Peter', 1, 3, 5),
          note:
            'Interpretation: Peter grounds present "living hope" in a future inheritance described as imperishable and "kept in heaven," guarded by God’s power rather than the believer’s own strength—security located in God, not in self.',
        },
        {
          kind: 'teaching',
          title: 'Assurance without presumption',
          body:
            'Real assurance rests on God’s character and promises, confirmed by the ongoing, even if imperfect, fruit of a changed life. Presumption claims the comfort of assurance while showing no actual interest in following Christ. This lesson’s hope is meant to strengthen genuine faith, not excuse indifference toward it.',
        },
        {
          kind: 'attribution',
          teacherId: 'sproul',
          work: 'Teaching on the assurance of salvation',
          note:
            'Supplementary emphasis: assurance resting on God’s preserving grace rather than on the believer’s fluctuating performance is a widely known Reformed theme, applied here as the capstone of the ordo salutis. Original paraphrase only.',
        },
      ],
      questions: L6_QUESTIONS,
      reflectionPrompts: [
        'Write a short prayer thanking God that your final salvation depends on His power to keep you rather than on your power to hold on, and ask Him to grow one specific fruit of genuine faith in you this season.',
      ],
      furtherStudy: [
        'Read Romans 8:31–39 as a whole and notice how the chapter moves from the Spirit’s present help to an unshakable future confidence.',
      ],
      reviewFromLessonIds: [
        'salvation-election-calling',
        'salvation-justification',
        'salvation-sanctification',
      ],
    },
  ],
}
