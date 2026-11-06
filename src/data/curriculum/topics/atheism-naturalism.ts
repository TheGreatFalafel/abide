import type { CurriculumTopic } from '../types'
import {
  PRIMARY_HUME_DIALOGUES,
  SOURCE_FRAME_SUP,
  SOURCE_SPROUL_EVANG,
} from '../evangelismSources'
import { SOURCE_MACARTHUR_SUP, mc, passage } from './_helpers'

const BEGINNER = [
  mc('an-b1', 'What does "atheism" mean?', ['Belief that no god exists', 'Belief in many gods', 'Doubt only', 'Belief in nature spirits'], 0, 'Belief that no god exists', 'beginner'),
  mc('an-b2', 'According to Psalm 14:1, who says "there is no God"?', ['The fool', 'The king', 'The priest', 'The prophet'], 0, 'The fool', 'beginner'),
  mc('an-b3', "Which verse says God's invisible attributes are clearly seen in creation?", ['Romans 1:20', 'John 3:16', 'Genesis 3:15', 'Acts 2:38'], 0, 'Romans 1:20', 'beginner'),
  mc('an-b4', 'An agnostic is someone who:', ["Says God's existence is unknown or unknowable", 'Denies God', 'Worships idols', 'Studies the Bible daily'], 0, 'Says God\'s existence is unknown or unknowable', 'beginner'),
  mc('an-b5', 'Which attitude does 1 Peter 3:15 call for?', ['Gentleness and respect', 'Anger', 'Silence', 'Mockery'], 0, 'Gentleness and respect', 'beginner'),
  mc('an-b6', 'Who wrote *The God Delusion*?', ['Richard Dawkins', 'C.S. Lewis', 'Charles Spurgeon', 'John Calvin'], 0, 'Richard Dawkins', 'beginner'),
  mc('an-b7', 'How does Genesis 1:1 treat the existence of God?', ['It assumes and declares Him from the start', 'It argues for Him in detail', 'It questions Him', 'It leaves Him out'], 0, 'It assumes and declares Him from the start', 'beginner'),
  mc('an-b8', 'Which psalm says "The heavens declare the glory of God"?', ['Psalm 19', 'Psalm 1', 'Psalm 23', 'Psalm 51'], 0, 'Psalm 19', 'beginner'),
]

const INTERMEDIATE = [
  mc('an-i1', '"Naturalism" is the view that:', ['Only natural, material causes exist', 'Nature is God', 'Miracles are common', 'God made nature'], 0, 'Only natural, material causes exist', 'intermediate'),
  mc('an-i2', 'Romans 1:18 says unbelievers do what with the truth?', ['Suppress it', 'Love it', 'Never hear it', 'Teach it'], 0, 'Unbelief is moral and spiritual as well as intellectual.', 'intermediate'),
  mc('an-i3', 'Which is a philosophical claim and not a scientific method?', ['Metaphysical naturalism', 'Methodological naturalism', 'Experiments', 'Observation'], 0, undefined, 'intermediate'),
  mc('an-i4', 'Nietzsche\'s "God is dead" was mainly:', ['A diagnosis that Western culture was losing belief in God and its moral foundation', 'A proof that God did not exist', 'A prayer', 'A joke'], 0, undefined, 'intermediate'),
  mc('an-i5', 'The cosmological argument reasons that:', ['The universe needs a cause', 'The universe is eternal', 'Morality is relative', 'God is unknowable'], 0, 'The universe needs a cause', 'intermediate'),
  mc('an-i6', 'The design (teleological) argument was famously illustrated by:', ["Paley's watchmaker", "Pascal's wager", "Hume's fork", "Russell's teapot"], 0, 'William Paley, *Natural Theology* (1802).', 'intermediate'),
  mc('an-i7', 'The moral argument says:', ['Objective moral values point to a moral lawgiver', 'Morality is invented', 'God is unnecessary', 'Evil is an illusion'], 0, undefined, 'intermediate'),
  mc('an-i8', 'How does Christianity answer the problem of evil at its deepest level?', ["The fall, God's purposes, and the cross", 'Evil is not real', 'God is not powerful', 'God is not good'], 0, 'The fall, God\'s purposes, and the cross', 'intermediate'),
  mc('an-i9', 'Which is NOT one of the "New Atheists"?', ['Charles Spurgeon', 'Richard Dawkins', 'Christopher Hitchens', 'Sam Harris'], 0, 'Charles Spurgeon', 'intermediate'),
]

const ADVANCED = [
  mc('an-a1', 'Presuppositional apologetics (Van Til, Bahnsen) holds that:', ['Christianity is the precondition of intelligibility, so there is no neutral ground', 'Proofs must be granted neutral first', 'Evidence is irrelevant', 'Faith is irrational'], 0, 'Christianity is the precondition of intelligibility, so there is no neutral ground', 'advanced'),
  mc('an-a2', "Which approach argues for God's existence with reason before moving to evidences for Christianity?", ['Classical', 'Fideism', 'Pragmatism', 'Mysticism'], 0, 'Associated with Sproul, Gerstner, and Lawhead.', 'advanced'),
  mc('an-a3', 'The Kalam cosmological argument has roots in:', ['Medieval Islamic theology (al-Ghazali) and was popularized by William Lane Craig', 'Ancient Egypt', 'The Reformation', 'The Enlightenment only'], 0, undefined, 'advanced'),
  mc('an-a4', "Hume's argument against miracles says:", ['Testimony for a miracle rarely outweighs uniform experience; critics say it assumes miracles cannot happen', 'Miracles are common', 'Miracles prove God', 'Science confirms miracles'], 0, 'Testimony for a miracle rarely outweighs uniform experience; critics say it assumes miracles cannot happen', 'advanced'),
  mc('an-a5', '"You only believe because you want comfort" (Freud) commits which fallacy?', ['The genetic fallacy: how a belief arose does not decide whether it is true', 'Straw man', 'Slippery slope', 'Circular reasoning'], 0, 'The genetic fallacy: how a belief arose does not decide whether it is true', 'advanced'),
  mc('an-a6', '"Borrowed capital" in apologetics means:', ['Atheists rely on logic, morality, and meaning that make sense on a theistic worldview', 'Atheists borrow money', 'Christians borrow arguments', 'Nothing'], 0, 'Atheists rely on logic, morality, and meaning that make sense on a theistic worldview', 'advanced'),
  mc('an-a7', 'The 1985 debate "Does God Exist?" featured presuppositionalist Greg Bahnsen and which opponent?', ['Gordon Stein', 'Richard Dawkins', 'Bertrand Russell', 'Christopher Hitchens'], 0, 'Gordon Stein', 'advanced'),
  mc('an-a8', 'Which is part of the "minimal facts" case for the resurrection (Habermas)?', ['The conversion of Paul, a former persecutor', 'The Council of Nicaea', 'The writings of Josephus alone', 'The canon'], 0, 'The conversion of Paul, a former persecutor', 'advanced'),
]

export const ATHEISM_NATURALISM: CurriculumTopic = {
  id: 'atheism-naturalism',
  title: 'Atheism and Naturalism',
  description:
    'Fair introduction to atheist, agnostic, and naturalist worldviews — common claims, Scripture’s response, major arguments, and gentle, gospel-centered engagement.',
  objectives: [
    'Define atheism, agnosticism, and naturalism and describe their historical backdrop.',
    'Answer common objections about evidence, science, evil, morality, and faith from Scripture.',
    'Summarize cosmological, design, and moral arguments and the problem of evil.',
    'Compare classical, evidential, and presuppositional methods and engage with love.',
  ],
  estimatedMinutes: 75,
  prerequisites: ['gospel-foundations'],
  framework: 'reformed',
  domain: 'evangelism-apologetics',
  contentStatus: 'full',
  version: 1,
  sources: [
    { ...SOURCE_FRAME_SUP, note: 'Organizational map for presuppositional themes and worldview analysis — paraphrase only.' },
    { ...SOURCE_SPROUL_EVANG, note: 'Supplementary classical theism and objections to atheism — themes only.' },
    { ...SOURCE_MACARTHUR_SUP, note: 'Supplementary emphasis on Romans 1 and gospel clarity — paraphrase only.' },
  ],
  lessons: [
    {
      id: 'an-origins-claims',
      order: 1,
      title: 'Origins, Terms, and Common Claims',
      estimatedMinutes: 25,
      objectives: [
        'Define atheism, agnosticism, naturalism, and secular humanism.',
        'Name major voices in modern atheism without caricature.',
        'Match common slogans to Scripture’s diagnosis and response.',
      ],
      primaryPassages: [passage('psalms', 'Psalms', 19, 1, 4)],
      supportingPassages: [passage('romans', 'Romans', 1, 18, 20)],
      content: [
        {
          kind: 'teaching',
          title: 'Origins and terms',
          body:
            'Atheism denies that God exists; agnosticism says God’s existence is unknown or unknowable; naturalism says only nature exists; secular humanism proposes human ethics without God. Modern atheism grew through the Enlightenment, Hume’s critique of miracles, Marx and Freud, Nietzsche’s cultural diagnosis in *The Gay Science*, and the New Atheists (Dawkins, Hitchens, Harris, Dennett).',
        },
        {
          kind: 'teaching',
          title: 'Claims and responses',
          body:
            'Neighbors often say there is no evidence for God, that science disproves God, that evil disproves a good God, that morality is evolution or culture, or that faith is belief without evidence. Scripture teaches that creation testifies (Psalm 19; Romans 1:19–20), that people suppress truth (Romans 1:18), that evil is explained through the fall, God’s purposes, and the cross, that moral law is written on the heart (Romans 2:14–15), and that biblical faith is trust grounded in God’s works (Hebrews 11:1, 6; Luke 1:1–4).',
        },
        {
          kind: 'scripture_focus',
          passage: passage('romans', 'Romans', 1, 19, 20),
          note: 'General revelation in creation leaves people without excuse — a pastoral starting point, not an insult.',
        },
        {
          kind: 'distinction',
          biblical: 'Scripture assumes God’s reality and teaches creation’s witness alongside human suppression of truth.',
          interpretation:
            'Reformed evangelicals answer objections honestly while insisting that only the Spirit gives saving sight (2 Corinthians 4:4–6).',
          disagreement:
            'Atheists differ among themselves on morality and meaning. Do not treat one internet debater as the official spokesperson for all non-theists.',
        },
        {
          kind: 'attribution',
          teacherId: 'sproul',
          work: 'If There\'s a God, Why Are There Atheists? (themes)',
          note: 'Supplementary cue: unbelief often involves moral suppression, not mere lack of data — paraphrase only.',
        },
      ],
      questions: BEGINNER,
      reflectionPrompts: [
        'Pray for humility before you answer someone who rejects God.',
        'Which slogan do you hear most often — and which passage will you study first?',
      ],
      furtherStudy: ['Read Romans 1:18–25 and list what Paul says about creation, conscience, and exchange of glory.'],
    },
    {
      id: 'an-arguments-evil',
      order: 2,
      title: 'Arguments, Evil, and Scripture',
      estimatedMinutes: 25,
      objectives: [
        'State cosmological, design, and moral arguments carefully.',
        'Distinguish metaphysical and methodological naturalism.',
        'Explain Christianity’s answer to evil at the level of the fall and the cross.',
      ],
      primaryPassages: [passage('genesis', 'Genesis', 3, 1, 15)],
      supportingPassages: [passage('romans', 'Romans', 2, 14, 16)],
      content: [
        {
          kind: 'teaching',
          title: 'Lines of reasoning',
          body:
            'The cosmological argument presses why contingent things exist. The design argument notices order and purpose (Paley’s watchmaker is a famous illustration). The moral argument asks what grounds objective moral duties. Metaphysical naturalism is a philosophical claim; science as a method does not by itself disprove a Creator.',
        },
        {
          kind: 'teaching',
          title: 'Evil and hope',
          body:
            'Evil is not a throwaway objection. Christianity traces it to the fall (Genesis 3), affirms God’s wise purposes (Genesis 50:20), and centers hope in the cross (Acts 2:23; 4:28). Arguments may clear fog; they do not replace the gospel.',
        },
        {
          kind: 'primary_source',
          ...PRIMARY_HUME_DIALOGUES,
          context: 'Enlightenment critique of natural religion and miracle testimony.',
          significance:
            'Shows why miracle claims became contested — use as historical background for fair dialogue, not as the final word.',
          excerpt:
            'Summary only: Hume argued uniform experience weighs against miracle reports — a challenge Christians answer with evidence and worldview, not mockery.',
        },
        {
          kind: 'distinction',
          biblical: 'Genesis 3 and Romans 5–8 teach real sin, death, and groaning creation awaiting redemption.',
          interpretation:
            'Reformed teachers hold that the problem of evil is answered most deeply at the cross, not by denying suffering.',
          disagreement:
            'Some evidentialists lean on historical proofs; some presuppositionalists stress worldview foundations. Represent both without overclaiming.',
        },
        {
          kind: 'attribution',
          teacherId: 'frame',
          work: 'Apologetics to the Glory of God (themes)',
          note: 'Organizational cue: bring every argument under Christ’s lordship — paraphrase only.',
        },
      ],
      questions: INTERMEDIATE,
      reflectionPrompts: [
        'Where has suffering raised honest questions for you or someone you love? How does the cross speak there?',
      ],
      furtherStudy: ['Compare Genesis 50:20 with Acts 4:27–28 on God’s purpose in evil events.'],
    },
    {
      id: 'an-engage-methods',
      order: 3,
      title: 'Engagement and Apologetic Methods',
      estimatedMinutes: 25,
      objectives: [
        'Practice listening, questioning, and gospel-centered witness.',
        'Name common mistakes in talking with atheists.',
        'Distinguish classical, evidential, and presuppositional approaches at a survey level.',
      ],
      primaryPassages: [passage('1peter', '1 Peter', 3, 15, 16)],
      supportingPassages: [passage('2timothy', '2 Timothy', 2, 24, 26)],
      content: [
        {
          kind: 'teaching',
          title: 'How to engage',
          body:
            'Ask how someone came to their view; listen first; look for conscience and longing for meaning; share the gospel and your testimony; hold arguments with humility because the heart resists God (Romans 8:7; 1 Corinthians 2:14). Avoid treating atheists as stupid, arguing without the gospel, or claiming proofs that convince everyone apart from the Spirit.',
        },
        {
          kind: 'teaching',
          title: 'Methods',
          body:
            'Presuppositional apologetics holds that Christianity is the precondition of intelligibility — no neutral ground. Classical apologetics argues for God’s existence with reason before moving to evidences for Christianity. Watch for the genetic fallacy when comfort or upbringing is used to dismiss belief. “Borrowed capital” names how critics often rely on logic and morality that fit a theistic worldview.',
          level: 'advanced',
        },
        {
          kind: 'distinction',
          biblical: '1 Peter 3:15 and 2 Timothy 2:24–25 command gentleness, respect, and patience in correction.',
          interpretation:
            'Reformed witness speaks truth in love (Ephesians 4:15) and keeps the gospel central rather than winning debates.',
          disagreement:
            'Some Christians avoid philosophy entirely; others treat argument as sufficient. Both miss love and Spirit-dependence.',
        },
        {
          kind: 'attribution',
          teacherId: 'macarthur',
          work: 'Published biblical teaching (selected themes)',
          note: 'Supplementary cue: proclaim Christ clearly; do not substitute rhetoric for the new birth — paraphrase only.',
        },
      ],
      questions: ADVANCED,
      reflectionPrompts: [
        'Pray for one atheist or agnostic neighbor by name this week.',
        'What question could you ask before offering an answer in your next conversation?',
      ],
      furtherStudy: ['Read 2 Corinthians 4:4–6 and note the Spirit’s role alongside your words.'],
    },
  ],
}
