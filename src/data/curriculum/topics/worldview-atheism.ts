import type { CurriculumTopic } from '../types'
import {
  PRIMARY_HUME_DIALOGUES,
  SOURCE_FRAME_SUP,
  SOURCE_PACKER_ORG,
  SOURCE_SPROUL_EVANG,
} from '../evangelismSources'
import { mc, open, passage } from './_helpers'

/**
 * First complete comparative worldview course.
 * Selected because: (1) clear educational scope for apologetics overlap,
 * (2) public-domain philosophical sources available for careful citation,
 * (3) avoids rushing misrepresentation of complex living religious traditions.
 */
export const WORLDVIEW_ATHEISM: CurriculumTopic = {
  id: 'worldview-atheism',
  title: 'Understanding Atheism',
  description:
    'A fair introduction to atheist and related non-theistic outlooks — diversity within atheism, views of reality and meaning, common objections, and a respectful Reformed evangelical response grounded in Scripture.',
  objectives: [
    'Define atheism carefully and distinguish related positions.',
    'Describe common atheist accounts of reality, morality, and meaning without caricature.',
    'Engage objections about evil, science, and hypocrisy with honesty.',
    'Respond with the gospel in clarity and respect.',
  ],
  estimatedMinutes: 85,
  prerequisites: ['gospel-foundations'],
  framework: 'reformed',
  domain: 'evangelism-apologetics',
  version: 1,
  sources: [
    {
      ...SOURCE_FRAME_SUP,
      note:
        'Supplementary map for apologetic method (listening, worldview comparison) — themes only, no chapter reproduction.',
    },
    {
      ...SOURCE_SPROUL_EVANG,
      note: 'Supplementary classical theism / gospel clarity themes — paraphrase only.',
    },
    {
      ...SOURCE_PACKER_ORG,
      note: 'Organizational reminder that apologetics serves evangelism under God’s Word.',
    },
  ],
  lessons: [
    {
      id: 'atheism-definitions-diversity',
      order: 1,
      title: 'What Atheism Is — and Isn’t',
      estimatedMinutes: 18,
      objectives: [
        'Distinguish atheism, agnosticism, and related terms.',
        'Acknowledge diversity among atheists (philosophical, “new,” cultural).',
        'Avoid strawman definitions.',
      ],
      primaryPassages: [passage('psalms', 'Psalms', 14, 1, 1)],
      supportingPassages: [passage('romans', 'Romans', 1, 18, 23)],
      content: [
        {
          kind: 'teaching',
          title: 'Define before you debate',
          body:
            'Atheism, in common philosophical use, is the view that God (or gods) do not exist — or, in weaker forms, a lack of belief in God. Agnosticism claims we do not (or cannot) know. Many people mix these in ordinary speech. Good witness asks which meaning someone intends.',
        },
        {
          kind: 'concept',
          term: 'Atheism',
          explanation:
            'Typically: denial of God’s existence, or (in some modern usage) absence of belief in God. Always clarify the speaker’s definition before answering.',
        },
        {
          kind: 'concept',
          term: 'Agnosticism',
          explanation:
            'The claim that God’s existence is unknown or unknowable. Overlaps with atheism in practice for some people, but is not identical.',
        },
        {
          kind: 'teaching',
          title: 'Internal diversity',
          body:
            'Atheists disagree about morality, politics, the value of religion, and whether “New Atheism” rhetoric helps. Some are quiet; some are activist. Never treat one YouTube clip as the official creed of all non-theists.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('psalms', 'Psalms', 14, 1, 1),
          note:
            'Interpretation: The psalm speaks morally of the fool who lives as if God were irrelevant — not a license to call every atheist stupid. Use it as theology of the heart, not as a debate insult.',
        },
        {
          kind: 'distinction',
          biblical:
            'Scripture assumes God’s reality and diagnoses suppression of truth (Romans 1); it also commands truthful speech about neighbors.',
          interpretation:
            'Reformed evangelicals can say atheism is false while still describing atheists’ actual claims accurately and treating persons with dignity.',
          disagreement:
            'Some Christians caricature all atheists as secretly knowing better and merely loving sin. Some atheists caricature all believers as anti-science. Refuse both cartoons.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'match',
          prompt: 'Match the label to the careful definition.',
          target: 'Agnosticism',
          choices: [
            'Denial that any gods exist (typical strong sense)',
            'Claim that God’s existence is unknown/unknowable',
            'Belief in many gods',
            'Belief that Jesus is Lord',
          ],
          answer: 1,
          explanation:
            'Agnosticism centers on knowledge claims; atheism centers on (dis)belief regarding God’s existence — ask which someone means.',
        },
      ],
      questions: [
        mc(
          'atheism-def-q1',
          'Before answering an atheist interlocutor, a wise first step is to:',
          [
            'Assume their exact view from a stereotype',
            'Ask how they define atheism or unbelief',
            'Refuse to talk until they convert',
            'Pretend you agree that God does not exist',
          ],
          1,
          'Definitions vary; clarify before you respond.',
        ),
        mc(
          'atheism-def-q2',
          'Saying “all atheists believe X” is usually:',
          [
            'Safe because atheism is a single denomination',
            'Risky because atheists hold diverse further beliefs',
            'Required by Romans 1',
            'Impossible to avoid in any conversation',
          ],
          1,
          'Atheism answers a God-question; it does not settle every other question.',
        ),
      ],
      reflectionPrompts: [
        'Ask God for patience to understand people before answering them, and for courage to speak of him without contempt.',
      ],
      furtherStudy: [
        'Write two columns: “Claims some atheists make” vs “Claims I must not attribute to every atheist.”',
      ],
    },
    {
      id: 'atheism-reality-meaning-morality',
      order: 2,
      title: 'Reality, Meaning, and Morality',
      estimatedMinutes: 20,
      objectives: [
        'Summarize common atheist accounts of the universe and human significance.',
        'Ask fair questions about moral obligation without sneering.',
        'Contrast the Christian claim that meaning is grounded in God.',
      ],
      primaryPassages: [passage('acts', 'Acts', 17, 24, 31)],
      supportingPassages: [
        passage('genesis', 'Genesis', 1, 27, 28),
        passage('romans', 'Romans', 2, 14, 16),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Worldview questions',
          body:
            'Many atheists affirm a naturalistic picture: the universe (or multiverse) is all there is; humans are the product of unguided processes; meaning and morals are human constructions or evolutionary byproducts. Others hold different combinations. Listen for which package you are hearing.',
        },
        {
          kind: 'teaching',
          title: 'Moral seriousness',
          body:
            'Atheists often care deeply about justice. Do not pretend otherwise. The apologetic question is not “Do you have feelings about right and wrong?” but “What ultimately grounds moral obligation and human dignity?” Ask sincerely.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('acts', 'Acts', 17, 24, 28),
          note:
            'Interpretation: Paul proclaims the Creator who gives life and breath to all, in whom we live and move — a theistic frame for meaning and accountability.',
        },
        {
          kind: 'primary_source',
          authorOrBody: PRIMARY_HUME_DIALOGUES.authorOrBody,
          work: PRIMARY_HUME_DIALOGUES.work,
          approxDate: PRIMARY_HUME_DIALOGUES.approxDate,
          context:
            'Hume’s dialogues explore arguments about natural religion and the limits of inferring God’s nature from the world. Later atheists and skeptics often draw on related themes about evidence and design. Use PD text carefully; do not pretend Hume speaks for every modern atheist.',
          significance:
            'Shows a historically influential skeptical challenge to natural theology. Christians should understand the challenge before answering with Scripture and reason.',
          rightsNote: PRIMARY_HUME_DIALOGUES.rightsNote,
          reference: PRIMARY_HUME_DIALOGUES.reference,
        },
        {
          kind: 'distinction',
          biblical:
            'Acts 17 presents God as Creator and Judge who commands repentance; Genesis grounds human dignity in the image of God.',
          interpretation:
            'Reformed evangelicals argue that personal meaning and objective moral duty fit creation by a personal God — while acknowledging atheists may live with borrowed moral capital.',
          disagreement:
            'Secular moral realists try to ground ethics without God; error theorists deny objective morals. Represent the option your friend actually holds.',
        },
      ],
      questions: [
        mc(
          'atheism-meaning-q1',
          'A fair question about morality in conversation is:',
          [
            'Why are you evil for caring about justice?',
            'What do you think makes something truly obligatory?',
            'Why can’t you just admit you worship Satan?',
            'Why read any books at all?',
          ],
          1,
          'Ask about grounding without denying their moral concern.',
        ),
        mc(
          'atheism-meaning-q2',
          'Paul in Acts 17 primarily frames human life as:',
          [
            'Self-created meaning with no Creator',
            'Dependent on the God who made and sustains all',
            'Irrelevant to repentance',
            'Proof that idols are true gods',
          ],
          1,
          'Paul proclaims the Creator in whom we live and move.',
        ),
      ],
      reflectionPrompts: [
        'Thank God that your life has meaning in him, and pray for wisdom to ask better questions of friends who disagree.',
      ],
      furtherStudy: [
        'Skim a public-domain excerpt of Hume’s Dialogues and note one skeptical challenge in your own words (no long copyrighted commentary).',
      ],
      reviewFromLessonIds: ['atheism-definitions-diversity'],
    },
    {
      id: 'atheism-objections-evil-science',
      order: 3,
      title: 'Objections: Evil, Science, and Hypocrisy',
      estimatedMinutes: 22,
      objectives: [
        'State the problem of evil fairly.',
        'Avoid overclaiming what science does or does not settle about God.',
        'Respond to church hypocrisy with honesty and the gospel.',
      ],
      primaryPassages: [passage('romans', 'Romans', 8, 18, 23)],
      supportingPassages: [
        passage('job', 'Job', 38, 1, 7),
        passage('1peter', '1 Peter', 2, 21, 24),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'The problem of evil',
          body:
            'If God is all-good and all-powerful, why is there profound suffering? This is a weighty objection. Christians should not pretend easy slogans erase tears. Scripture points to God’s purposes, human sin, Christ’s suffering, and future renewal — while leaving mystery where God has not spoken.',
        },
        {
          kind: 'teaching',
          title: 'Science and God',
          body:
            'Science describes regularities in the created order; it does not by itself answer why there is a rational, law-like cosmos or who (if anyone) is God. Some atheists claim science has replaced God; some Christians wrongly treat every scientific theory as a threat. Aim for precision: distinguish data, theories, and metaphysical conclusions.',
        },
        {
          kind: 'teaching',
          title: 'Hypocrisy',
          body:
            'When churches wound people, repent of defensiveness. The gospel itself judges hypocrisy. Point to Christ, not to a fantasy of a spotless Christian subculture.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('romans', 'Romans', 8, 18, 23),
          note:
            'Interpretation: Present suffering is real; creation groans; hope rests in future redemption secured in Christ — not in denial of pain.',
        },
        {
          kind: 'distinction',
          biblical:
            'Job and Romans acknowledge unexplained suffering under God’s sovereignty; the cross shows God entering suffering; Scripture condemns religious hypocrisy.',
          interpretation:
            'Reformed answers to evil include providence, fall, cross, and eschatological hope — offered with humility, not as a dismissive “shut up.”',
          disagreement:
            'Some atheists treat evil as decisive disproof of God; some theists offer callous answers. Represent the strongest form of the objection you can.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'true_false',
          prompt:
            'A faithful Christian response to suffering should usually begin by denying that the sufferer’s pain is serious.',
          answer: false,
          explanation:
            'Scripture weeps with those who weep. Minimizing pain is not apologetics.',
        },
      ],
      questions: [
        mc(
          'atheism-evil-q1',
          'When someone raises the problem of evil, a wise posture is to:',
          [
            'Mock them for feeling pain',
            'Acknowledge the weight of the question before answering',
            'Change the subject to sports immediately',
            'Claim Christians never suffer',
          ],
          1,
          'Honesty about suffering is part of truthful witness.',
        ),
        mc(
          'atheism-evil-q2',
          'On science and God, this lesson urges you to:',
          [
            'Collapse every scientific claim into atheism',
            'Distinguish scientific description from metaphysical conclusions',
            'Reject all medicine as unbelief',
            'Pretend Genesis forbids learning about the natural world',
          ],
          1,
          'Precision protects both science and theology from category mistakes.',
        ),
      ],
      reflectionPrompts: [
        'Bring a personal sorrow to God honestly, and ask how the cross shapes your words to others who suffer.',
      ],
      furtherStudy: ['Read Romans 8:18–39 and list every hope Paul names amid suffering.'],
      reviewFromLessonIds: ['atheism-reality-meaning-morality'],
    },
    {
      id: 'atheism-gospel-response',
      order: 4,
      title: 'A Respectful Gospel Response',
      estimatedMinutes: 22,
      objectives: [
        'Summarize a Reformed evangelical response to atheism.',
        'Practice a conversation that listens and points to Christ.',
        'Know when to continue later rather than force a close.',
      ],
      primaryPassages: [passage('acts', 'Acts', 17, 30, 34)],
      supportingPassages: [
        passage('1corinthians', '1 Corinthians', 15, 12, 20),
        passage('1peter', '1 Peter', 3, 15, 16),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Witness, not combat sport',
          body:
            'Your goal is not to humiliate an atheist friend. It is to commend the truth: the God who is there, the Christ who died and rose, and the call to repent and believe. Use reasons as servants of the Word. Leave room for the Spirit. Accept that some conversations end with “we should talk again.”',
        },
        {
          kind: 'scripture_focus',
          passage: passage('acts', 'Acts', 17, 30, 31),
          note:
            'Interpretation: Paul proclaims repentance because God has fixed a day of judgment by the risen man he appointed — gospel announcement with historical claim.',
        },
        {
          kind: 'distinction',
          biblical:
            'Acts 17 models proclamation to pagan philosophers with both critique of idols and invitation to repent in light of the resurrection.',
          interpretation:
            'Reformed evangelicals combine worldview challenge with gospel invitation, refusing both intimidation and syncretism.',
          disagreement:
            'Some apologists prioritize winning debates; some pietists refuse all arguments. Scripture shows Paul reasoning and proclaiming.',
        },
        {
          kind: 'attribution',
          teacherId: 'frame',
          work: 'Apologetics writings (selected themes)',
          note:
            'Supplementary methodological reminder: listen to the alternative worldview and bring the lordship of Christ to bear — themes only.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'conversation',
          prompt: 'Conversation practice',
          scenario:
            'A friend who identifies as an atheist says science has buried God and that faith is belief without evidence. Practice truthful, respectful replies.',
          partnerName: 'Alex',
          steps: [
            {
              partnerLine:
                'Science has made God unnecessary. Faith is just believing things without evidence.',
              choices: [
                {
                  text: 'Scientists are all idiots in a conspiracy.',
                  quality: 'hostile',
                  explanation:
                    'Insulting science and scientists is false and needlessly offensive.',
                },
                {
                  text: 'I respect science as a gift for studying the world. I’m asking about bigger questions science alone may not settle — like why there is a rational universe, and who Jesus is in history.',
                  quality: 'helpful',
                  explanation:
                    'You honor science, clarify categories, and open toward Christ without contempt.',
                },
                {
                  text: 'You’re right; evidence never matters for Christians.',
                  quality: 'inaccurate',
                  explanation:
                    'Historic Christianity makes public claims about Christ and creation; this misrepresents faith.',
                },
              ],
            },
            {
              partnerLine: 'Okay — but why should the resurrection matter to me?',
              choices: [
                {
                  text: 'If Jesus rose, then God has spoken in history and calls everyone to repent — including me. Can I share why I find the apostles’ testimony compelling?',
                  quality: 'helpful',
                  explanation:
                    'You connect resurrection to God’s claim on us and invite dialogue rather than a dunk.',
                },
                {
                  text: 'Believe or else you’re trash.',
                  quality: 'hostile',
                  explanation:
                    'Contempt is not 1 Peter 3:15.',
                },
                {
                  text: 'It doesn’t matter; just be nice.',
                  quality: 'incomplete',
                  explanation:
                    'Kindness matters, but it is not the gospel Paul preached in Acts 17.',
                },
              ],
            },
          ],
        },
      ],
      questions: [
        mc(
          'atheism-response-q1',
          'In Acts 17, Paul’s proclamation to philosophers includes:',
          [
            'Only lifestyle tips with no repentance',
            'A call to repent grounded in the risen Judge',
            'A denial that idols are false',
            'A claim that all religions are equal',
          ],
          1,
          'Paul announces repentance because of the resurrection and judgment.',
        ),
        open(
          'atheism-response-open',
          'Write three sentences you could say to an atheist friend that include listening, one clarifying question, and one clear gospel sentence.',
        ),
      ],
      reflectionPrompts: [
        'Pray for an atheist or skeptical friend by name. Ask for love, clarity, and patience for a long obedience in friendship.',
      ],
      furtherStudy: [
        'Re-read Acts 17:16–34; note where Paul listens to culture, critiques idols, and proclaims Christ.',
      ],
      reviewFromLessonIds: [
        'atheism-definitions-diversity',
        'atheism-reality-meaning-morality',
        'atheism-objections-evil-science',
      ],
    },
  ],
}
