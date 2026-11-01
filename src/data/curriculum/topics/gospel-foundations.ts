import type { CurriculumTopic } from '../types'
import {
  SOURCE_GRUDEM_EVANG,
  SOURCE_PACKER_ORG,
  SOURCE_SPROUL_EVANG,
} from '../evangelismSources'
import { mc, open, passage } from './_helpers'

/** Section A — Understanding the Gospel (foundational, condensed). */
export const GOSPEL_FOUNDATIONS: CurriculumTopic = {
  id: 'gospel-foundations',
  title: 'Understanding the Gospel',
  description:
    'The biblical gospel in coherent order: God and creation, sin and judgment, Christ crucified and risen, repentance and faith, justification by grace, and the exclusive claim of Jesus — for clear, humble witness.',
  objectives: [
    'Explain who God is and what creation reveals about humanity’s purpose.',
    'Define sin and why mercy never cancels God’s justice.',
    'Confess the person and saving work of Jesus Christ.',
    'Distinguish repentance and faith from mere religious self-improvement.',
    'State why Christians confess Christ as the only Savior.',
  ],
  estimatedMinutes: 80,
  prerequisites: [],
  framework: 'reformed',
  domain: 'evangelism-apologetics',
  version: 1,
  sources: [
    {
      ...SOURCE_GRUDEM_EVANG,
      note:
        'Organizational map for gospel loci (God, man, Christ, salvation). Lesson prose is original; not a chapter reproduction.',
    },
    {
      ...SOURCE_PACKER_ORG,
      note:
        'Organizational emphasis that evangelism rests on God’s character and the finished work of Christ — themes only.',
    },
    {
      ...SOURCE_SPROUL_EVANG,
      note:
        'Supplementary clarity on holiness, justification, and gospel vocabulary — paraphrase only.',
    },
  ],
  lessons: [
    {
      id: 'gospel-god-creation-fall',
      order: 1,
      title: 'God, Creation, and the Fall',
      estimatedMinutes: 18,
      objectives: [
        'Confess God’s holiness and sovereignty from Scripture.',
        'Explain humanity as created in God’s image and fallen in Adam.',
        'State why the gospel begins with God, not with felt needs alone.',
      ],
      primaryPassages: [passage('genesis', 'Genesis', 1, 26, 28)],
      supportingPassages: [
        passage('romans', 'Romans', 1, 18, 25),
        passage('romans', 'Romans', 5, 12, 19),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Start with God',
          body:
            'The gospel is good news about God before it is advice about us. Scripture reveals the holy, sovereign Creator who made humans in his image for worship, love, and stewardship. Apart from that frame, “sin,” “Savior,” and “salvation” shrink into vague spirituality.',
        },
        {
          kind: 'concept',
          term: 'Image of God',
          explanation:
            'Humans uniquely reflect God as personal, moral, relational beings accountable to him — dignity that remains even after the fall, though now corrupted by sin.',
        },
        {
          kind: 'teaching',
          title: 'The fall',
          body:
            'Genesis and Romans teach that sin entered through human disobedience, bringing guilt, corruption, and death. The problem is not only ignorance or social brokenness; it is rebellion against God that we cannot self-repair.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('romans', 'Romans', 1, 20, 23),
          note:
            'Interpretation: Paul teaches that people suppress truth about God revealed in creation, exchanging glory for idols — a diagnosis of the human heart, not a denial of real cultural goods.',
        },
        {
          kind: 'distinction',
          biblical:
            'Genesis presents God as Creator; humans as image-bearers; and the fall as disobedience with cosmic consequences. Romans connects Adam’s sin to universal death and condemnation.',
          interpretation:
            'Reformed evangelicals confess original sin and total inability to save ourselves, while affirming remaining human dignity. Evangelism therefore calls for repentance toward God, not mere lifestyle coaching.',
          disagreement:
            'Some traditions minimize original guilt or treat the fall mainly as a mythic metaphor. Secular views often locate the human problem only in ignorance, oppression, or biology. Represent those views fairly before answering from Scripture.',
        },
        {
          kind: 'attribution',
          teacherId: 'grudem',
          work: 'Systematic Theology',
          note:
            'Organizational cue: gospel teaching commonly begins with the doctrine of God and man before Christ and salvation.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'order',
          prompt: 'Order these gospel “storyline” pieces as Scripture unfolds them.',
          items: [
            'God creates humans in his image',
            'Humanity falls into sin and death',
            'God promises and sends Christ the Redeemer',
            'Sinners repent and believe for salvation',
          ],
          answerOrder: [0, 1, 2, 3],
          explanation:
            'Creation and fall explain why redemption is needed; Christ and faith are the answer — not the reverse.',
        },
      ],
      questions: [
        mc(
          'gospel-fall-q1',
          'According to this lesson, the gospel begins with:',
          [
            'Marketing felt needs without God',
            'The holy Creator and our created purpose',
            'Tips for happier relationships only',
            'Denying that anyone is accountable',
          ],
          1,
          'God’s character and creation frame every later gospel word.',
        ),
        mc(
          'gospel-fall-q2',
          'The Reformed confession of the fall emphasizes that sin is:',
          [
            'Only social inconvenience',
            'Rebellion against God bringing guilt and corruption',
            'An illusion to ignore',
            'Limited to a few unusually evil people',
          ],
          1,
          'Romans and Genesis describe real guilt and corruption before God.',
        ),
        open('gospel-fall-open', 'In one sentence, why must evangelism talk about God before “tips for life”?'),
      ],
      reflectionPrompts: [
        'Praise God as Creator, confess where you have lived as if you were your own god, and ask for a clearer love for his holiness.',
      ],
      furtherStudy: [
        'Read Genesis 1–3 and Romans 5:12–21; list what each says about Adam and Christ.',
      ],
    },
    {
      id: 'gospel-christ-cross-resurrection',
      order: 2,
      title: 'Christ: Incarnation, Cross, and Resurrection',
      estimatedMinutes: 20,
      objectives: [
        'Confess who Jesus is as true God and true man.',
        'Explain the cross as atonement, not merely moral example.',
        'State why the bodily resurrection is essential to the gospel.',
      ],
      primaryPassages: [passage('1corinthians', '1 Corinthians', 15, 1, 8)],
      supportingPassages: [
        passage('john', 'John', 1, 1, 14),
        passage('romans', 'Romans', 3, 21, 26),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'The heart of the good news',
          body:
            'The gospel centers on Jesus Christ: the eternal Son who took true humanity, obeyed, died for sinners, and rose bodily. Without incarnation, cross, and resurrection, “Christianity” becomes ethics without a Savior.',
        },
        {
          kind: 'concept',
          term: 'Atonement',
          explanation:
            'Christ’s sacrificial death deals with sin before God — satisfying justice and securing mercy for all who believe. Exact models (e.g., penal substitution) are confessed carefully from Scripture, not as slogans emptied of biblical context.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('1corinthians', '1 Corinthians', 15, 3, 4),
          note:
            'Interpretation: Paul summarizes the gospel as Christ dying for our sins and rising according to the Scriptures — historical and theological claims together.',
        },
        {
          kind: 'distinction',
          biblical:
            'The New Testament proclaims Jesus as the incarnate Son who died for sins and rose on the third day, appearing to witnesses.',
          interpretation:
            'Reformed evangelicals receive the cross as substitutionary and the resurrection as bodily and historical. Evangelism therefore proclaims a Person and finished work, not vague spirituality.',
          disagreement:
            'Some views treat the cross as only moral influence, or the resurrection as only “spiritual.” Represent those claims accurately, then show why Paul says that if Christ has not been raised, faith is futile (1 Cor 15).',
        },
        {
          kind: 'attribution',
          teacherId: 'sproul',
          work: 'Published teaching on the cross & resurrection',
          note:
            'Supplementary emphasis on the necessity of a real atonement and empty tomb — themes only.',
        },
      ],
      questions: [
        mc(
          'gospel-christ-q1',
          'In 1 Corinthians 15, Paul treats the resurrection as:',
          [
            'Optional poetry',
            'Essential to the gospel he preached',
            'A later medieval invention',
            'Proof that bodies do not matter',
          ],
          1,
          'Paul places death-for-sins and resurrection at the center of the gospel.',
        ),
        mc(
          'gospel-christ-q2',
          'Calling the cross “atonement” means at least that:',
          [
            'Jesus only modeled kindness with no dealing with guilt',
            'Christ’s death addresses sin before the holy God',
            'Christians need no repentance',
            'History is irrelevant to faith',
          ],
          1,
          'Biblical atonement language ties the cross to sin, justice, and mercy.',
        ),
      ],
      reflectionPrompts: [
        'Thank Jesus for the cross and resurrection, and name one way you are tempted to reduce him to a mere example.',
      ],
      furtherStudy: ['Memorize 1 Corinthians 15:3–4 and explain each phrase in your own words.'],
      reviewFromLessonIds: ['gospel-god-creation-fall'],
    },
    {
      id: 'gospel-repentance-faith-justification',
      order: 3,
      title: 'Repentance, Faith, and Justification',
      estimatedMinutes: 20,
      objectives: [
        'Define repentance and faith without equating them to perfection.',
        'Explain justification by faith alone as God’s declaring verdict.',
        'Distinguish grace from earned religious performance.',
      ],
      primaryPassages: [passage('ephesians', 'Ephesians', 2, 8, 10)],
      supportingPassages: [
        passage('acts', 'Acts', 17, 30, 31),
        passage('romans', 'Romans', 5, 1, 2),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'How sinners receive Christ',
          body:
            'God commands all people to repent and believe. Repentance turns from sin to God; faith trusts Christ alone. Justification is God’s gracious verdict that the believer is righteous in Christ — not the result of accumulating enough moral improvement first.',
        },
        {
          kind: 'concept',
          term: 'Justification by faith alone',
          explanation:
            'God counts sinners righteous through faith in Christ, based on Christ’s obedience and atonement — received, not earned. Good works follow as fruit, not as the root of acceptance.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('ephesians', 'Ephesians', 2, 8, 9),
          note:
            'Interpretation: Salvation is by grace through faith, not from works, so that no one may boast — while verse 10 immediately frames believers as created for good works.',
        },
        {
          kind: 'distinction',
          biblical:
            'Acts calls for repentance; Paul teaches justification by faith apart from works of the law, and insists that faith works through love.',
          interpretation:
            'Reformed evangelicals refuse both works-righteousness and antinomian “faith” that never turns. Evangelism invites trust in Christ, not self-salvation projects.',
          disagreement:
            'Some religious systems treat acceptance with God as cooperation that merits grace. Represent those claims carefully; answer with Scripture rather than mockery.',
        },
        {
          kind: 'attribution',
          teacherId: 'packer',
          work: 'Evangelism and the Sovereignty of God',
          note:
            'Organizational reminder that calling people to repent and believe rests on God’s gospel, not on clever technique.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'true_false',
          prompt:
            'Justification by faith alone means Christians may ignore obedience because works never matter.',
          answer: false,
          explanation:
            'Faith alone justifies; the faith that justifies is never alone — Ephesians 2:10 and James insist on fruit without making fruit the basis of justification.',
        },
      ],
      questions: [
        mc(
          'gospel-faith-q1',
          'Repentance, in biblical evangelism, primarily means:',
          [
            'Feeling sad without changing direction',
            'Turning from sin toward God in light of the gospel',
            'Joining a political party',
            'Paying for forgiveness with money',
          ],
          1,
          'Repentance is a Godward turn, not mere regret.',
        ),
        mc(
          'gospel-faith-q2',
          '“Faith alone” justifies because:',
          [
            'Faith earns wages from God',
            'Faith receives Christ and his finished work',
            'Faith replaces the need for Christ',
            'Faith is identical to church membership paperwork',
          ],
          1,
          'Faith is the empty hand that receives the Savior.',
        ),
      ],
      reflectionPrompts: [
        'Ask God to deepen repentance and simple trust in Christ, not confidence in your religious résumé.',
      ],
      furtherStudy: ['Read Ephesians 2:1–10 aloud; mark grace, faith, and works in different colors.'],
      reviewFromLessonIds: ['gospel-christ-cross-resurrection'],
    },
    {
      id: 'gospel-grace-exclusivity',
      order: 4,
      title: 'Grace, New Life, and the Exclusivity of Christ',
      estimatedMinutes: 18,
      objectives: [
        'Describe sanctification as Spirit-empowered growth, not self-salvation.',
        'Explain why Christians confess Jesus as the only way to the Father.',
        'Practice humility when stating exclusive claims.',
      ],
      primaryPassages: [passage('john', 'John', 14, 6, 6)],
      supportingPassages: [
        passage('acts', 'Acts', 4, 12, 12),
        passage('titus', 'Titus', 2, 11, 14),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Saved for a new life',
          body:
            'Grace not only justifies; it trains believers for godliness. Sanctification is real growth by the Spirit through the Word, church, and obedience — never a second ladder to climb into God’s favor.',
        },
        {
          kind: 'concept',
          term: 'Exclusivity of Christ',
          explanation:
            'Jesus alone is the mediator who reconciles sinners to God. This claim is particular, not rude by necessity: it is either true or false. Christians must state it with tears and clarity, never with sneering pride.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('john', 'John', 14, 6, 6),
          note:
            'Interpretation: Jesus claims to be the way, truth, and life — exclusive access to the Father through himself, not through generic religiosity.',
        },
        {
          kind: 'distinction',
          biblical:
            'Jesus and the apostles claim unique saving mediation in Christ (John 14:6; Acts 4:12).',
          interpretation:
            'Reformed evangelicals hold that salvation is in Christ alone while affirming common grace goods outside the church. Evangelism warns and invites without pretending all religions teach the same gospel.',
          disagreement:
            'Pluralist views hold that many paths equally reconcile to God. Represent pluralism accurately as a serious claim; answer with Christ’s own words and the apostolic gospel, not with contempt for neighbors.',
        },
        {
          kind: 'attribution',
          teacherId: 'macarthur',
          work: 'Published biblical teaching on the uniqueness of Christ',
          note:
            'Supplementary emphasis on clear confession of Christ’s exclusive saving work — original paraphrase only.',
        },
      ],
      questions: [
        mc(
          'gospel-excl-q1',
          'John 14:6, on its face, teaches that:',
          [
            'All spiritual paths equally reach the Father',
            'Jesus himself is the way to the Father',
            'Doctrine does not matter',
            'Only angels mediate salvation',
          ],
          1,
          'Jesus identifies himself as the way, truth, and life.',
        ),
        mc(
          'gospel-excl-q2',
          'Humble exclusivism means Christians should:',
          [
            'Mock other people as stupid',
            'State Christ’s uniqueness with clarity and love',
            'Hide the gospel to keep peace at any cost',
            'Deny the resurrection when pressed',
          ],
          1,
          'Truthfulness and love belong together in witness.',
        ),
      ],
      reflectionPrompts: [
        'Pray for a friend who does not know Christ — ask for boldness without arrogance, and for your own deeper gratitude for grace.',
      ],
      furtherStudy: ['Compare John 14:6 with Acts 4:12; write a short paragraph suitable for a gentle conversation.'],
      reviewFromLessonIds: [
        'gospel-god-creation-fall',
        'gospel-christ-cross-resurrection',
        'gospel-repentance-faith-justification',
      ],
    },
  ],
}
