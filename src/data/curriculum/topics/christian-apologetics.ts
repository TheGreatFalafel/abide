import type { CurriculumTopic } from '../types'
import {
  PRIMARY_AQUINAS_SUMMA,
  PRIMARY_HUME_DIALOGUES,
  PRIMARY_TACITUS_ANNALS,
  SOURCE_FRAME_SUP,
  SOURCE_PACKER_ORG,
  SOURCE_SPROUL_EVANG,
} from '../evangelismSources'
import { mc, open, passage } from './_helpers'

/**
 * Phase 6 — dedicated Christian Apologetics topic (Witness).
 * Eight sections: God, Scripture, resurrection, evil, science, morality,
 * exclusivity, and difficult objections. Conversation practice on hard talks.
 */
export const CHRISTIAN_APOLOGETICS: CurriculumTopic = {
  id: 'christian-apologetics',
  title: 'Christian Apologetics',
  description:
    'Reasons for Christian faith under Scripture: God’s existence, the trustworthiness of the Bible, the resurrection, evil and suffering, science and faith, morality and dignity, religious exclusivity, and difficult objections — with fair objections and humble, clear responses.',
  objectives: [
    'State major theistic arguments and their limits without overclaiming.',
    'Explain why Christians trust Scripture’s transmission and message.',
    'Summarize historical considerations for Jesus’ resurrection.',
    'Engage the problem of evil and science/faith questions with honesty.',
    'Ground morality and human dignity in the God of Scripture.',
    'Explain Christian exclusivity without contempt for neighbors.',
    'Practice respectful replies to hypocrisy, hiddenness, and hard OT questions.',
  ],
  estimatedMinutes: 170,
  prerequisites: ['gospel-foundations'],
  framework: 'reformed',
  domain: 'evangelism-apologetics',
  version: 1,
  sources: [
    {
      ...SOURCE_FRAME_SUP,
      note:
        'Organizational map for apologetic method: listen to the alternative, bring Christ’s lordship to bear, refuse both intimidation and syncretism — themes only.',
    },
    {
      ...SOURCE_SPROUL_EVANG,
      note:
        'Supplementary classical theism, Scripture, and gospel clarity themes — paraphrase only; no chapter reproduction.',
    },
    {
      ...SOURCE_PACKER_ORG,
      note:
        'Organizational reminder that apologetics serves evangelism under God’s Word, not debate sport — themes only.',
    },
  ],
  lessons: [
    {
      id: 'apologetics-god-exists',
      order: 1,
      title: 'Does God Exist?',
      estimatedMinutes: 22,
      objectives: [
        'State cosmological, fine-tuning, moral, and historical lines of argument carefully.',
        'Name common objections without strawmen.',
        'Distinguish what an argument can support from what only the gospel reveals.',
      ],
      primaryPassages: [passage('romans', 'Romans', 1, 18, 23)],
      supportingPassages: [
        passage('psalms', 'Psalms', 19, 1, 4),
        passage('acts', 'Acts', 17, 22, 31),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Reasons, not replacements for the Word',
          body:
            'Christians give reasons for hope (1 Peter 3:15). Classical lines of argument ask why there is a contingent cosmos, why the universe appears finely structured for life, why moral obligation feels binding, and who Jesus was in history. These can remove obstacles and commend theism; they do not replace Scripture’s revelation of the Triune God or the call to repent and believe.',
        },
        {
          kind: 'concept',
          term: 'Cosmological argument (broad sense)',
          explanation:
            'If contingent things exist, their existence presses the question of an ultimate sufficient reason or uncaused cause. Forms differ (causal, contingency, kalām). Critics challenge premises about causation, infinity, or why “God” follows.',
        },
        {
          kind: 'concept',
          term: 'Fine-tuning',
          explanation:
            'Observations that many physical constants and initial conditions appear finely set for a life-permitting universe. Theists often infer design; critics propose multiverse hypotheses, necessity, or anthropic selection. Science describes parameters; metaphysics interprets them.',
        },
        {
          kind: 'concept',
          term: 'Moral argument',
          explanation:
            'If objective moral duties and values are real, what grounds them? Theists often point to God’s character; critics offer evolutionary or constructivist accounts. Represent the strongest secular option your friend holds.',
        },
        {
          kind: 'primary_source',
          ...PRIMARY_AQUINAS_SUMMA,
          context:
            'Medieval scholastic summary of ways people reason from motion, causation, contingency, degrees, and teleology toward a first cause — classical theism’s textbook locus.',
          significance:
            'Shows that “arguments for God” are old, careful, and contested — not a modern internet invention. Use as history of argument, not as a magic proof.',
          excerpt:
            'Summary (not a modern translation paste): Aquinas outlines five ways from observed features of the world toward a first mover / first cause / necessary being / maximal goodness / intelligent director — then identifies this with what is called God.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('romans', 'Romans', 1, 19, 20),
          note:
            'Interpretation: Paul teaches that God’s eternal power and divine nature are perceived in what has been made, leaving people without excuse for suppressing truth — general revelation, not a full gospel summary.',
        },
        {
          kind: 'distinction',
          biblical:
            'Scripture assumes God’s reality, appeals to creation (Psalm 19; Romans 1; Acts 17), and centers saving knowledge in Christ.',
          interpretation:
            'Reformed evangelicals affirm general revelation and the usefulness of arguments, while insisting special revelation and the Spirit are necessary for saving faith.',
          disagreement:
            'Some evidentialists treat arguments as nearly decisive; some fideists refuse all arguments. Fair atheists may accept fine-tuning data yet deny a Designer. Do not caricature either.',
        },
        {
          kind: 'attribution',
          teacherId: 'sproul',
          work: 'Published Ligonier teaching on the gospel & apologetics (themes)',
          note: 'Supplementary cue: classical theism and the Creator/creature distinction frame arguments for God — paraphrase themes only.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'match',
          prompt: 'Match the argument family to its focus.',
          target: 'Fine-tuning',
          choices: [
            'Why contingent things exist at all',
            'Why physical constants appear life-permitting',
            'Why Jesus rose from the dead',
            'Why churches sometimes fail ethically',
          ],
          answer: 1,
          explanation:
            'Fine-tuning concerns life-permitting parameters; cosmology asks about existence/cause; resurrection is historical; hypocrisy is moral/pastoral.',
        },
        {
          kind: 'true_false',
          prompt:
            'A strong theistic argument can replace the need to proclaim Christ crucified and risen.',
          answer: false,
          explanation:
            'Arguments may clear fog; the gospel remains the power of God for salvation (Romans 1:16).',
        },
      ],
      questions: [
        mc(
          'apol-god-q1',
          'When a friend says “Who designed the Designer?”, a careful reply often:',
          [
            'Pretends the question is illegal',
            'Clarifies that classical theism claims an uncaused necessary being, not an infinite regress of designers',
            'Agrees that God also needs a designer',
            'Changes the subject to sports',
          ],
          1,
          'The question usually assumes God is one more contingent thing in the series.',
        ),
        mc(
          'apol-god-q2',
          'Which statement best fits this lesson’s caution?',
          [
            'Science has mathematically proven God exists',
            'Arguments can commend theism but should not overclaim certainty where premises are disputed',
            'Only hostile dunking converts people',
            'Psalm 19 forbids noticing the heavens',
          ],
          1,
          'Honesty about disputed premises is part of truthful witness.',
        ),
        open(
          'apol-god-open',
          'In two sentences, state one theistic argument and one fair objection to it.',
        ),
      ],
      reflectionPrompts: [
        'Thank God that he has not left himself without witness, and ask for humility when your arguments fall short.',
      ],
      furtherStudy: [
        'Read Romans 1:18–25 and Acts 17:22–31; list how Paul uses creation without reducing the gospel to a philosophy class.',
      ],
    },
    {
      id: 'apologetics-trust-bible',
      order: 2,
      title: 'Can We Trust the Bible?',
      estimatedMinutes: 22,
      objectives: [
        'Explain manuscript transmission and textual criticism at a basic level.',
        'Distinguish canon formation from “the church invented Jesus.”',
        'Respond to alleged contradictions without panic or denialism.',
      ],
      primaryPassages: [passage('2timothy', '2 Timothy', 3, 14, 17)],
      supportingPassages: [
        passage('luke', 'Luke', 1, 1, 4),
        passage('isaiah', 'Isaiah', 40, 8, 8),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Transmission is not telepathy',
          body:
            'Christians do not claim every handwritten copy was identical. We claim that God spoke through prophets and apostles, and that the text has been preserved with extraordinary richness of manuscript evidence. Textual criticism compares manuscripts to recover the earliest attainable wording. Variants are real; most are minor; a few are discussed in study Bibles. Honesty about variants builds trust.',
        },
        {
          kind: 'concept',
          term: 'Textual criticism',
          explanation:
            'The scholarly comparison of manuscripts (and versions) to evaluate which readings are most likely original. Abundance of copies helps, rather than automatically destroying, confidence.',
        },
        {
          kind: 'concept',
          term: 'Canon',
          explanation:
            'The recognized collection of inspired books. For the NT, churches recognized apostolic / prophetic authority over time; they did not invent Jesus in the fourth century. OT canon debates (e.g., Protestant vs. Catholic deuterocanon) should be stated accurately.',
        },
        {
          kind: 'teaching',
          title: 'Archaeology and contradictions',
          body:
            'Archaeology sometimes illuminates places, titles, and customs; it does not “prove” every miracle. Alleged contradictions often dissolve with genre, chronology, or complementary perspectives — but some difficulties remain debated among honest scholars. Do not invent forced harmonies that ignore the text.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('luke', 'Luke', 1, 1, 4),
          note:
            'Interpretation: Luke claims careful investigation and orderly account so Theophilus may have certainty — a historical posture, not mythic indifference to fact.',
        },
        {
          kind: 'distinction',
          biblical:
            'Scripture presents itself as God’s Word and as history involving real people and events; copyists preserved and sometimes introduced variants.',
          interpretation:
            'Reformed evangelicals affirm inspiration and inerrancy of the original text, and the practical reliability of the received Scriptures for faith and life, while welcoming careful textual work.',
          disagreement:
            'Critics may treat variants as fatal; some believers deny any difficult variants. Represent manuscript reality accurately before theological evaluation.',
        },
        {
          kind: 'attribution',
          teacherId: 'frame',
          work: 'Apologetics writings (selected themes)',
          note:
            'Supplementary methodological cue: Scripture’s authority is theological; historical and textual questions still deserve honest answers — themes only.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'order',
          prompt: 'Order a wise response path when someone cites “Bible contradictions.”',
          items: [
            'Ask which passages and what the alleged conflict is',
            'Check genre, context, and whether complementary details are being forced into conflict',
            'Admit remaining difficulty if needed; return to the gospel’s center',
          ],
          answerOrder: [0, 1, 2],
          explanation:
            'Clarify the claim, examine the text carefully, then stay honest — never open with contempt.',
        },
      ],
      questions: [
        mc(
          'apol-bible-q1',
          'A large number of NT manuscripts primarily means:',
          [
            'That every copy is identical word-for-word',
            'That scholars have abundant data for comparing readings',
            'That archaeology has ended all faith',
            'That the canon was invented in the 1800s',
          ],
          1,
          'More manuscripts mean more comparative evidence, including variants to weigh.',
        ),
        mc(
          'apol-bible-q2',
          'Which claim is too strong for careful apologetics?',
          [
            'Luke presents his work as investigated history',
            'Archaeology sometimes corroborates biblical settings',
            'Archaeology has scientifically proven every miracle in Scripture',
            'Some alleged contradictions involve complementary perspectives',
          ],
          2,
          'Miracles are not established by pottery sherds alone; avoid overclaim.',
        ),
      ],
      reflectionPrompts: [
        'Ask God for confidence in his Word that does not need dishonest shortcuts.',
      ],
      furtherStudy: [
        'Open a study Bible notes page on a well-known variant (e.g., Mark 16:9–20 or John 7:53–8:11) and note how transparency serves trust.',
      ],
      reviewFromLessonIds: ['apologetics-god-exists'],
    },
    {
      id: 'apologetics-resurrection',
      order: 3,
      title: 'The Resurrection of Jesus',
      estimatedMinutes: 22,
      objectives: [
        'State minimal historical claims commonly discussed about Jesus’ death and the early proclamation.',
        'Evaluate alternative explanations fairly.',
        'Connect the resurrection to the gospel’s meaning, not mere curiosity.',
      ],
      primaryPassages: [passage('1corinthians', '1 Corinthians', 15, 1, 11)],
      supportingPassages: [
        passage('acts', 'Acts', 2, 22, 36),
        passage('luke', 'Luke', 24, 36, 43),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'History under the gospel',
          body:
            'Paul treats the resurrection as public good news: Christ died, was buried, was raised, and appeared to many (1 Corinthians 15). Historians debate method and conclusions, but the early Christian movement centered on Jesus’ death under Pilate and the claim that God raised him. Alternatives (theft, wrong tomb, hallucination, legendary growth) should be stated in their strongest form before critique.',
        },
        {
          kind: 'concept',
          term: 'Minimal facts approach (description)',
          explanation:
            'A pedagogical strategy that starts from widely granted historical points (e.g., Jesus’ death by crucifixion; early belief that he appeared) and asks which explanation fits best. It is a teaching tool, not a claim that every scholar grants every Christian conclusion.',
        },
        {
          kind: 'primary_source',
          ...PRIMARY_TACITUS_ANNALS,
          context:
            'Tacitus reports Nero’s persecution after the Rome fire and mentions Christus executed under Pontius Pilate — a hostile Roman notice of Christian origins.',
          significance:
            'Supports that early Christians were known, and that Jesus’ execution under Pilate was treated as historical by a non-Christian historian. It does not by itself prove the resurrection.',
          excerpt:
            'Summary of Annals 15.44 (PD tradition): Tacitus notes that Christus, from whom the name Christian derived, suffered the extreme penalty under Tiberius at the hands of Pontius Pilatus, and that a deadly superstition broke out again in Judea and Rome.',
        },
        {
          kind: 'teaching',
          title: 'What alternatives must explain',
          body:
            'Any alternative must account for the crucifixion, the rise of resurrection proclamation among Jews for whom “Messiah crucified” was scandalous, and the transformation of early witnesses. Hallucination theories struggle with group claims and empty-tomb traditions; legend theories struggle with early creedal material (1 Corinthians 15). Still, honest doubt deserves patience, not scorn.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('1corinthians', '1 Corinthians', 15, 14, 19),
          note:
            'Interpretation: Paul stakes Christian faith on bodily resurrection — if Christ is not raised, preaching and faith are empty. Apologetics here serves gospel reality, not trivia.',
        },
        {
          kind: 'distinction',
          biblical:
            'The NT proclaims Jesus’ bodily resurrection as God’s vindication and the ground of salvation hope.',
          interpretation:
            'Reformed evangelicals confess the bodily resurrection as historical and salvific, using historical reasoning as a servant of the Word.',
          disagreement:
            'Liberal theologies may spiritualize resurrection; skeptics may grant Jesus’ death yet deny appearances. Represent those views before answering.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'match',
          prompt: 'Match the alternative explanation to a fair challenge it faces.',
          target: 'Group hallucination of the risen Jesus',
          choices: [
            'Usually fails to explain coordinated group experiences and empty-tomb reports',
            'Automatically proves every medieval relic',
            'Means Tacitus wrote the Gospels',
            'Requires denying that Jesus was crucified',
          ],
          answer: 0,
          explanation:
            'Hallucination hypotheses are debated; a fair challenge concerns group claims and related data — without pretending the case is trivial.',
        },
      ],
      questions: [
        mc(
          'apol-res-q1',
          'According to 1 Corinthians 15, if Christ has not been raised:',
          [
            'Christian faith is still equally true as metaphor only, per Paul',
            'Preaching and faith are futile',
            'Only Gentiles are affected',
            'The law of Moses is abolished automatically',
          ],
          1,
          'Paul treats the resurrection as non-negotiable for the gospel.',
        ),
        mc(
          'apol-res-q2',
          'Tacitus Annals 15.44 is best used to show that:',
          [
            'Rome officially endorsed the Trinity',
            'A hostile historian linked Christians to Christus executed under Pilate',
            'The resurrection is scientifically proven',
            'All Roman sources deny Jesus existed',
          ],
          1,
          'Use classical sources for what they actually say — not more.',
        ),
      ],
      reflectionPrompts: [
        'Worship the risen Christ, and ask for courage to speak of the resurrection without bluffing evidence you have not studied.',
      ],
      furtherStudy: [
        'Memorize 1 Corinthians 15:3–8 and note how early the creed Paul “received” must be.',
      ],
      reviewFromLessonIds: ['apologetics-trust-bible'],
    },
    {
      id: 'apologetics-problem-of-evil',
      order: 4,
      title: 'The Problem of Evil',
      estimatedMinutes: 22,
      objectives: [
        'State logical and existential forms of the problem of evil fairly.',
        'Relate free agency, providence, the cross, and future hope without callous slogans.',
        'Practice a conversation that listens before explaining.',
      ],
      primaryPassages: [passage('romans', 'Romans', 8, 18, 25)],
      supportingPassages: [
        passage('job', 'Job', 38, 1, 7),
        passage('habakkuk', 'Habakkuk', 1, 2, 4),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Name the objection at full strength',
          body:
            'If God is all-good and all-powerful, why is there horrendous suffering? The logical form asks whether God and evil can coexist; the evidential form asks whether the amount and kinds of evil make God’s existence unlikely; the existential form is a cry of pain. Christians must not answer tears with a smirk.',
        },
        {
          kind: 'concept',
          term: 'Theodicy / defense',
          explanation:
            'A theodicy attempts a positive account of God’s reasons; a defense shows that God and evil are not logically incompatible. Reformed theology emphasizes God’s sovereignty, human responsibility, the fall, the cross, and eschatological justice — and admits mystery where God has not spoken (Job).',
        },
        {
          kind: 'teaching',
          title: 'What not to say',
          body:
            'Avoid: “It was for the best” as a first response to trauma; “God needed another angel”; blaming every illness on the sufferer’s secret sin; or treating free will as a complete solution to natural disasters. Prefer presence, lament, the crucified God, and honest limits.',
        },
        {
          kind: 'primary_source',
          ...PRIMARY_HUME_DIALOGUES,
          context:
            'Hume’s Dialogues famously press design and evil-related challenges to natural theology.',
          significance:
            'A classic skeptical voice: take the objection seriously as philosophy, then answer as Christians under Scripture — not by insulting Hume’s readers.',
          excerpt:
            'Summary only: interlocutors debate whether natural evil and disorder undermine inferences to a wise, good designer. Use as a prompt to state the problem fairly.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('romans', 'Romans', 8, 18, 23),
          note:
            'Interpretation: Present suffering is real; creation groans; hope looks to redemption secured in Christ — not denial of pain.',
        },
        {
          kind: 'distinction',
          biblical:
            'Job, Habakkuk, Psalms, and Romans show lament under God’s sovereignty; the cross shows God entering suffering; final judgment promises justice.',
          interpretation:
            'Reformed answers include providence, fall, cross, and hope — offered with humility. God’s goodness is not proven by our ability to explain every case.',
          disagreement:
            'Some atheists treat evil as decisive disproof; some theists offer brittle answers. Represent the strongest form of the objection.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'conversation',
          prompt: 'Conversation practice',
          scenario:
            'A friend whose sibling died of cancer says a good God would not allow this. Your aim is truthful, compassionate witness — not winning a philosophy match.',
          partnerName: 'Sam',
          steps: [
            {
              partnerLine:
                'If God were good and powerful, my sibling would still be alive. Your “answers” feel like insults.',
              choices: [
                {
                  text: 'You’re just emotional; calm down and accept my syllogism.',
                  quality: 'hostile',
                  explanation:
                    'Dismissing grief as irrational is cruel and closes ears.',
                },
                {
                  text: 'I’m so sorry. You’re right that slogans are not enough. May I sit with the pain with you, and later share why I still trust a God who entered suffering at the cross?',
                  quality: 'helpful',
                  explanation:
                    'You honor grief, refuse cheap answers, and keep a door open to Christ without forcing it.',
                },
                {
                  text: 'Everything happens for a reason, so smile.',
                  quality: 'incomplete',
                  explanation:
                    'Even if providence is real, this line usually harms more than it helps as a first reply.',
                },
                {
                  text: 'Actually cancer proves God is evil, so we should both abandon hope.',
                  quality: 'inaccurate',
                  explanation:
                    'That concludes against Christian theism without hearing the gospel’s claim about the cross and resurrection.',
                },
              ],
            },
            {
              partnerLine: 'Fine — but why pray if God already decided everything?',
              choices: [
                {
                  text: 'Prayer is pointless theater; I only pretend.',
                  quality: 'inaccurate',
                  explanation:
                    'Scripture commands prayer as a real means God uses under his sovereignty.',
                },
                {
                  text: 'Because God ordains ends and means — he invites us to ask, and he cares. I don’t claim to map every decree; I claim Jesus taught us to pray.',
                  quality: 'helpful',
                  explanation:
                    'You hold sovereignty and prayer together without pretending exhaustive explanation.',
                },
                {
                  text: 'Stop asking hard questions.',
                  quality: 'hostile',
                  explanation: 'Shutting down questions is not apologetics.',
                },
              ],
            },
          ],
        },
      ],
      questions: [
        mc(
          'apol-evil-q1',
          'A wise first move with someone in grief who raises evil is usually to:',
          [
            'Launch a full theodicy before listening',
            'Acknowledge the weight of suffering before offering theology',
            'Deny that anything bad happened',
            'Mock their tears as unbelief',
          ],
          1,
          'Presence precedes explanation.',
        ),
        mc(
          'apol-evil-q2',
          'In Job, God’s response from the whirlwind primarily:',
          [
            'Gives Job a complete flowchart of every reason for each pain',
            'Confronts Job with the Creator’s wisdom beyond full human mapping',
            'Agrees that God does not exist',
            'Blames Job’s friends for inventing monotheism',
          ],
          1,
          'Job models mystery under sovereignty, not a dismissive shrug.',
        ),
      ],
      reflectionPrompts: [
        'Bring a personal sorrow to God honestly, and ask how the cross shapes your words to sufferers.',
      ],
      furtherStudy: ['Read Romans 8:18–39 and list every hope Paul names amid suffering.'],
      reviewFromLessonIds: ['apologetics-resurrection'],
    },
    {
      id: 'apologetics-science-faith',
      order: 5,
      title: 'Science and Christianity',
      estimatedMinutes: 20,
      objectives: [
        'Distinguish scientific description from metaphysical conclusions.',
        'Discuss origins and miracles without false binaries.',
        'Avoid both anti-science panic and scientism.',
      ],
      primaryPassages: [passage('genesis', 'Genesis', 1, 1, 3)],
      supportingPassages: [
        passage('psalms', 'Psalms', 104, 24, 30),
        passage('colossians', 'Colossians', 1, 15, 17),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Two books, one Author',
          body:
            'Christians historically confessed that the God who inspired Scripture also ordered the world we study. Science investigates secondary causes and regularities; it does not by itself settle whether God exists or whether miracles can occur. Conflicts often arise from bad philosophy attached to science — or from Christians treating every theory as an attack.',
        },
        {
          kind: 'concept',
          term: 'Scientism',
          explanation:
            'The claim that only scientific methods yield real knowledge. Self-refuting if stated as a non-scientific absolute, and hostile to moral, historical, and theological knowledge.',
        },
        {
          kind: 'teaching',
          title: 'Origins and miracles',
          body:
            'Within orthodoxy, Christians differ on the age of the earth and mechanisms of creation while confessing God as Creator. Evolution as a biological model is not identical to atheistic naturalism. Miracles are not “violations” that science forbids a priori; if God exists, he may act. Still, miracle claims need historical and theological care — not every viral story is Exodus.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('colossians', 'Colossians', 1, 16, 17),
          note:
            'Interpretation: All things were created through and for Christ and hold together in him — a metaphysical claim science neither proves nor disproves by lab method alone.',
        },
        {
          kind: 'distinction',
          biblical:
            'Genesis and Psalms celebrate God as Creator; the NT proclaims Christ’s cosmic lordship; Scripture also records miracles as signs within history.',
          interpretation:
            'Reformed evangelicals affirm creation and providence; scientific models are evaluated without treating methodological naturalism in the lab as a worldview that excludes God.',
          disagreement:
            'Young-earth, old-earth, and evolutionary-creation views debate mechanisms among believers. Atheists may equate science with naturalism. State which debate you are in.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'true_false',
          prompt:
            'If a scientific theory correctly describes a natural mechanism, it automatically proves that God does not exist.',
          answer: false,
          explanation:
            'Describing how something works does not settle who (if anyone) authored and sustains the system.',
        },
        {
          kind: 'mc',
          prompt: 'Which reply best resists scientism without rejecting science?',
          choices: [
            'All scientists hate God, so ignore medicine',
            'Science is a gift for studying God’s world; it is not the only kind of truth',
            'Miracles happen every time I lose my keys',
            'Genesis forbids looking through telescopes',
          ],
          answer: 1,
          explanation:
            'Honor science as vocation under God; refuse the claim that only lab methods know reality.',
        },
      ],
      questions: [
        mc(
          'apol-sci-q1',
          'A category mistake about science and God is to:',
          [
            'Treat a lab description of a process as an automatic atheism proof',
            'Thank God for medical research',
            'Study biology as stewardship',
            'Distinguish data from worldview spin',
          ],
          0,
          'Mechanism talk ≠ metaphysics.',
        ),
        mc(
          'apol-sci-q2',
          'On origins debates among Christians, this lesson urges you to:',
          [
            'Excommunicate anyone who differs on earth’s age immediately',
            'Confess God as Creator while noting intramural debates about mechanisms',
            'Pretend Genesis is only pagan myth with no theological claim',
            'Claim science has photographed the Trinity',
          ],
          1,
          'Keep Creator confession central; argue mechanisms carefully.',
        ),
      ],
      reflectionPrompts: [
        'Thank God for one scientific gift (medicine, agriculture, engineering) and ask how to speak of faith without fearmongering.',
      ],
      furtherStudy: [
        'Read Psalm 104 slowly as a creation hymn — note wonder without forcing a modern scientific paper into every line.',
      ],
      reviewFromLessonIds: ['apologetics-problem-of-evil'],
    },
    {
      id: 'apologetics-morality-dignity',
      order: 6,
      title: 'Morality and Human Value',
      estimatedMinutes: 20,
      objectives: [
        'Explain why objective morality and human dignity press worldview questions.',
        'Represent competing secular accounts fairly.',
        'Connect the image of God to ethics and neighbor-love.',
      ],
      primaryPassages: [passage('genesis', 'Genesis', 1, 26, 28)],
      supportingPassages: [
        passage('romans', 'Romans', 2, 14, 16),
        passage('micah', 'Micah', 6, 8, 8),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Obligation needs a ground',
          body:
            'People live as if some things are truly wrong — not merely unpopular. If moral duties are objective, what makes them binding? Evolutionary psychology may describe tendencies; it does not by itself create obligation. Social contracts may coordinate behavior; they struggle to condemn a majority when the majority is cruel.',
        },
        {
          kind: 'concept',
          term: 'Image of God',
          explanation:
            'Humans bear unique dignity as God’s image-bearers — the deep Christian ground for justice, equality of worth, and neighbor-love, even toward enemies.',
        },
        {
          kind: 'teaching',
          title: 'Fair secular options',
          body:
            'Secular moral realists try to ground ethics in reason, flourishing, or irreducible moral facts. Error theorists deny objective morals. Expressivists reduce morals to attitudes. Ask which view your friend holds before arguing. Do not claim every atheist is secretly amoral — many care deeply about justice.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('romans', 'Romans', 2, 14, 15),
          note:
            'Interpretation: Paul teaches that Gentiles show the work of the law on their hearts — conscience as witness — while still needing the gospel.',
        },
        {
          kind: 'distinction',
          biblical:
            'Genesis grounds human dignity in the image of God; the prophets and Jesus demand justice and mercy; Paul speaks of conscience and universal accountability.',
          interpretation:
            'Reformed ethics roots obligation in God’s character and revealed will, with natural law themes, while insisting salvation is by grace through faith.',
          disagreement:
            'Utilitarians, Kantians, and evolutionary ethicists disagree among themselves. Represent the actual view on the table.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'match',
          prompt: 'Match the view to a careful description.',
          target: 'Image of God (Christian)',
          choices: [
            'Human worth grounded in being made to reflect God',
            'Morality is only a preference like ice cream flavors',
            'Only the strong define right by force',
            'Ethics is impossible to discuss',
          ],
          answer: 0,
          explanation:
            'Imago Dei is the Christian dignity claim — distinct from mere preference or might-makes-right.',
        },
      ],
      questions: [
        mc(
          'apol-moral-q1',
          'A fair question to ask a friend who condemns injustice is:',
          [
            'Why are you evil for caring?',
            'What makes something truly obligatory, not just preferred?',
            'Why can’t you admit you worship Satan?',
            'Why read any books?',
          ],
          1,
          'Press grounding without denying their moral concern.',
        ),
        mc(
          'apol-moral-q2',
          'Christian human dignity is primarily rooted in:',
          [
            'Net worth and productivity',
            'The image of God',
            'Social media follower counts',
            'Ethnic superiority',
          ],
          1,
          'Genesis 1 frames dignity theologically.',
        ),
      ],
      reflectionPrompts: [
        'Confess one place you treated an image-bearer as less than human, and ask God for repentance that shows in action.',
      ],
      furtherStudy: ['Read Genesis 9:6 and James 3:9; note how image language grounds speech and justice.'],
      reviewFromLessonIds: ['apologetics-science-faith'],
    },
    {
      id: 'apologetics-exclusivity',
      order: 7,
      title: 'Religious Exclusivity',
      estimatedMinutes: 20,
      objectives: [
        'Explain why “all religions teach the same thing” fails as history.',
        'State Jesus’ exclusive claims without arrogance of tone.',
        'Practice a pluralism conversation that listens and clarifies.',
      ],
      primaryPassages: [passage('john', 'John', 14, 1, 7)],
      supportingPassages: [
        passage('acts', 'Acts', 4, 8, 12),
        passage('1timothy', '1 Timothy', 2, 3, 6),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Pluralism vs. particular claims',
          body:
            'Religions disagree about God, ultimate reality, the human problem, and the path of rescue. Saying they “all say the same” usually erases those differences. Christian exclusivity means Jesus is the only Savior — not that Christians are morally superior or that neighbors lack dignity.',
        },
        {
          kind: 'concept',
          term: 'Religious pluralism (popular sense)',
          explanation:
            'The claim that all (or many) religions are equally valid paths to God / ultimate reality. Distinct from legal religious freedom and from civil respect.',
        },
        {
          kind: 'teaching',
          title: 'Jesus’ claims',
          body:
            'Jesus claims unique sonship and exclusive access to the Father (John 14:6). The apostles preach salvation in no other name (Acts 4:12). Softening these into vague spirituality is not honest interpretation. Softening your tone into contempt is not Christian obedience.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('john', 'John', 14, 6, 6),
          note:
            'Interpretation: Jesus identifies himself as the way, truth, and life — a particular claim that relativizes rival paths without authorizing cruelty.',
        },
        {
          kind: 'distinction',
          biblical:
            'Scripture presents one God and one mediator, Christ Jesus, while commanding love of neighbor and enemy.',
          interpretation:
            'Reformed evangelicals confess sola Christus for salvation while affirming common grace goods and truthful representation of other faiths.',
          disagreement:
            'Inclusivists and pluralists within broader Christianity debate destiny of the unevangelized. Represent their views fairly; this course holds historic Reformed exclusivism with humility of manner.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'conversation',
          prompt: 'Conversation practice',
          scenario:
            'A classmate says all religions lead to God and that exclusive claims are arrogant. Practice clarity with respect.',
          partnerName: 'Riley',
          steps: [
            {
              partnerLine:
                'All religions basically teach love. Claiming Jesus is the only way is arrogant.',
              choices: [
                {
                  text: 'Your religion is stupid and you’re going to hell, idiot.',
                  quality: 'hostile',
                  explanation:
                    'Contempt and insults are not faithfulness to 1 Peter 3:15.',
                },
                {
                  text: 'I hear the concern about arrogance. Can we separate tone from truth-claims? Religions disagree on God and salvation — and Jesus made a particular claim I believe. I’d love to understand what you mean by “lead to God.”',
                  quality: 'helpful',
                  explanation:
                    'You honor the person, clarify categories, and open honest dialogue about Jesus’ claim.',
                },
                {
                  text: 'You’re right — every path is equally true, including contradictions.',
                  quality: 'inaccurate',
                  explanation:
                    'That abandons Jesus’ exclusive claim and logical coherence.',
                },
                {
                  text: 'Yeah, exclusivity is awkward…',
                  quality: 'incomplete',
                  explanation:
                    'Empathy alone never explains why Christians confess Acts 4:12.',
                },
              ],
            },
          ],
        },
      ],
      questions: [
        mc(
          'apol-excl-q1',
          '“All religions teach the same thing” fails primarily because:',
          [
            'Religions make incompatible claims about God and salvation',
            'No religion ever mentions ethics',
            'Only Christians ever talk about love',
            'History books forbid comparing beliefs',
          ],
          0,
          'Particular claims conflict; erase neither them nor neighbor dignity.',
        ),
        mc(
          'apol-excl-q2',
          'Christian exclusivity, rightly held, means:',
          [
            'Christians may treat non-Christians as worthless',
            'Jesus is the only Savior, while neighbors retain dignity and deserve respect',
            'Civil religious freedom must be abolished',
            'Apologetics should maximize insults',
          ],
          1,
          'Exclusive Savior, inclusive neighbor-love.',
        ),
      ],
      reflectionPrompts: [
        'Pray for one person of another faith by name — for their good, and for your gentleness.',
      ],
      furtherStudy: [
        'Compare John 14:6 and Acts 4:12 with 1 Timothy 2:1–6; note exclusivity and God’s desire for people to be saved held together.',
      ],
      reviewFromLessonIds: ['apologetics-morality-dignity'],
    },
    {
      id: 'apologetics-difficult-objections',
      order: 8,
      title: 'Difficult Questions and Objections',
      estimatedMinutes: 22,
      objectives: [
        'Respond to hypocrisy, unanswered prayer, and divine hiddenness with honesty.',
        'Approach OT violence passages with careful reading, not denial or rage.',
        'Know when to continue a conversation another day.',
      ],
      primaryPassages: [passage('psalms', 'Psalms', 13, 1, 6)],
      supportingPassages: [
        passage('matthew', 'Matthew', 23, 23, 28),
        passage('deuteronomy', 'Deuteronomy', 9, 4, 6),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Hypocrisy and hiddenness',
          body:
            'Church hypocrisy is real; Jesus judged it fiercely (Matthew 23). Point to Christ, not to a fantasy of spotless Christians. Divine hiddenness and unanswered prayer are also real experiences — the Psalms model lament. Do not pretend every prayer is “yes,” or that God is obligated to perform on demand.',
        },
        {
          kind: 'teaching',
          title: 'Violence in the Old Testament',
          body:
            'Passages about conquest and judgment are difficult. Read them in canonical context: God’s holiness, the wickedness Scripture attributes to the nations (and to Israel), progressive revelation climaxing in Christ, and the difference between descriptive narrative and a blank check for modern violence. Avoid both “God is a moral monster” cartoons and scrubbed Sunday-school denial. Some questions remain hard; say so.',
        },
        {
          kind: 'concept',
          term: 'Divine hiddenness',
          explanation:
            'The objection that a loving God would make his existence more unmistakable. Christians point to general revelation, the incarnation, Scripture, and the Spirit — while admitting God does not satisfy every demand for spectacle (cf. Luke 16:31).',
        },
        {
          kind: 'scripture_focus',
          passage: passage('psalms', 'Psalms', 13, 1, 2),
          note:
            'Interpretation: Faithful lament asks “How long?” — Scripture itself makes space for the felt absence of God without atheism as the only option.',
        },
        {
          kind: 'distinction',
          biblical:
            'Jesus condemns hypocrisy; Psalms lament unanswered distress; Deuteronomy frames conquest as judgment, not Israel’s racial superiority.',
          interpretation:
            'Reformed apologetics confesses God’s justice and mercy, the church’s sins, and Christ’s cross as the deepest answer to violence and guilt — without pretending every text is easy.',
          disagreement:
            'Critics may treat OT herem texts as decisive moral defeaters; some Christians over-allegorize. Engage the text and the moral intuition honestly.',
        },
        {
          kind: 'attribution',
          teacherId: 'packer',
          work: 'Evangelism and the Sovereignty of God (selected themes)',
          note:
            'Organizational reminder: hard questions belong under God’s sovereignty and the call to faithful witness — themes only.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'conversation',
          prompt: 'Conversation practice',
          scenario:
            'Someone hurt by church leaders says Christians are hypocrites and that OT violence proves God is cruel. Practice listening and truthful, non-defensive replies.',
          partnerName: 'Jordan',
          steps: [
            {
              partnerLine:
                'Church people ruined my trust. And your God ordered killings in the Old Testament. Why should I listen?',
              choices: [
                {
                  text: 'You’re just bitter. Real churches never hurt anyone, and the OT is fine — stop whining.',
                  quality: 'hostile',
                  explanation:
                    'Denial of wounds and contempt for the questioner is anti-gospel.',
                },
                {
                  text: 'I’m grieved you were hurt — that should not have happened. Hypocrisy is real, and Jesus judges it. The OT judgment texts are hard; I won’t pretend they’re cute. Can I ask what happened, and also share why I still cling to a God who judged evil and bore judgment at the cross?',
                  quality: 'helpful',
                  explanation:
                    'You validate harm, refuse scrubbed answers, and keep the door open to Christ.',
                },
                {
                  text: 'Yeah, religion is mostly control.',
                  quality: 'incomplete',
                  explanation:
                    'Partial empathy that never distinguishes Christ from abuse abandons the gospel.',
                },
                {
                  text: 'The OT never happened; ignore it.',
                  quality: 'inaccurate',
                  explanation:
                    'Evading Scripture is not a Reformed answer and usually fails historically.',
                },
              ],
            },
            {
              partnerLine: 'I prayed for years and heard nothing. Hidden enough for you?',
              choices: [
                {
                  text: 'You didn’t pray hard enough; faith is a vending machine.',
                  quality: 'hostile',
                  explanation:
                    'Blame-the-victim piety contradicts the Psalms’ lament.',
                },
                {
                  text: 'That silence is heavy. Scripture has laments for unanswered cries. I won’t claim I can explain your years. I can say God has spoken in Christ — and I’m willing to keep walking with you even when answers are slow.',
                  quality: 'helpful',
                  explanation:
                    'You honor the experience, point to Christ without formula, and offer presence.',
                },
                {
                  text: 'God always says yes if you visualize harder.',
                  quality: 'inaccurate',
                  explanation: 'Prosperity formulas are not biblical prayer.',
                },
              ],
            },
          ],
        },
        {
          kind: 'true_false',
          prompt:
            'A faithful apologetic reply to church harm should usually begin by denying that the harm occurred.',
          answer: false,
          explanation:
            'Truthfulness and compassion require acknowledging real wounds.',
        },
      ],
      questions: [
        mc(
          'apol-diff-q1',
          'When someone cites church hypocrisy, a wise Christian response is to:',
          [
            'Deny every abuse claim automatically',
            'Acknowledge real sin, note that Jesus judges hypocrisy, and point to Christ',
            'Argue that ethics do not matter',
            'Change the subject to sports permanently',
          ],
          1,
          'Honesty plus the gospel beats defensiveness.',
        ),
        mc(
          'apol-diff-q2',
          'On difficult OT judgment texts, this lesson recommends:',
          [
            'Either rage-quit the Bible or pretend the texts are cuddly',
            'Read them in canonical context with humility about remaining hardness',
            'Use them to justify personal revenge today',
            'Claim they teach ethnic supremacy',
          ],
          1,
          'Careful reading and humility beat both denial and weaponization.',
        ),
        open(
          'apol-diff-open',
          'Write two sentences you could say to someone hurt by the church that are truthful and non-defensive.',
        ),
      ],
      reflectionPrompts: [
        'Ask God to make you a safe person for someone wounded by religious hypocrisy.',
      ],
      furtherStudy: [
        'Pray Psalm 13 aloud; notice how lament and trust can share a page.',
      ],
      reviewFromLessonIds: [
        'apologetics-exclusivity',
        'apologetics-problem-of-evil',
      ],
    },
  ],
}
