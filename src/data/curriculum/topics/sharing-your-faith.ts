import type { CurriculumTopic } from '../types'
import { SOURCE_PACKER_ORG, SOURCE_SPROUL_EVANG } from '../evangelismSources'
import { mc, open, passage } from './_helpers'
import { PART16_SHARING_BY_LESSON } from '../banks/part16-gospel-sharing'
import { appendOutlineBank } from '../banks/outlineBankHelper'

/** Section B — Sharing Your Faith (with conversation practice). */
export const SHARING_YOUR_FAITH: CurriculumTopic = {
  id: 'sharing-your-faith',
  title: 'Sharing Your Faith',
  description:
    'Why Christians evangelize, how to explain the gospel and a testimony clearly, and how to listen, ask questions, and respond with humility when people disagree.',
  objectives: [
    'Explain biblical motives for evangelism without pressure tactics.',
    'Outline a clear gospel and a brief personal testimony.',
    'Practice listening and asking honest questions.',
    'Choose replies that are truthful and kind under disagreement.',
  ],
  estimatedMinutes: 88,
  prerequisites: ['gospel-foundations'],
  framework: 'reformed',
  domain: 'evangelism-apologetics',
  contentStatus: 'full',
  version: 2,
  sources: [
    {
      ...SOURCE_PACKER_ORG,
      note:
        'Organizational map: God’s sovereignty fuels prayerful evangelism rather than anxious manipulation — themes only.',
    },
    {
      ...SOURCE_SPROUL_EVANG,
      note: 'Supplementary clarity on gospel vocabulary in conversation — paraphrase only.',
    },
  ],
  lessons: [
    {
      id: 'share-why-evangelize',
      order: 1,
      title: 'Why Christians Evangelize',
      estimatedMinutes: 16,
      objectives: [
        'Ground evangelism in Christ’s commission and God’s character.',
        'Reject both cowardly silence and coercive technique.',
        'Connect love of neighbor to speaking the gospel.',
      ],
      primaryPassages: [passage('matthew', 'Matthew', 28, 18, 20)],
      supportingPassages: [
        passage('romans', 'Romans', 10, 13, 17),
        passage('2corinthians', '2 Corinthians', 5, 18, 21),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Commissioned ambassadors',
          body:
            'Jesus sends his people to make disciples of all nations. Evangelism is not a personality contest; it is obedience fueled by love for God and neighbor. We speak because Christ is Lord and because people need reconciliation with God.',
        },
        {
          kind: 'concept',
          term: 'Evangelism',
          explanation:
            'Proclaiming the gospel of Jesus Christ with the aim that hearers would repent and believe — carried out with prayer, truthfulness, and respect.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('romans', 'Romans', 10, 14, 15),
          note:
            'Interpretation: Faith comes through hearing the word of Christ; messengers are ordinary means God uses.',
        },
        {
          kind: 'distinction',
          biblical:
            'Matthew 28 and Romans 10 assign the church a speaking mission; 2 Corinthians 5 describes reconciliation entrusted to ambassadors.',
          interpretation:
            'Reformed evangelicals insist God sovereignly saves while still commanding means: prayer, Word, and witness. Technique never replaces truth or love.',
          disagreement:
            'Some emphasize only lifestyle without words; others treat conversion as a closable sales process. Represent both errors fairly; Scripture requires both holy lives and clear gospel speech.',
        },
        {
          kind: 'attribution',
          teacherId: 'packer',
          work: 'Evangelism and the Sovereignty of God',
          note:
            'Organizational cue: divine sovereignty and human responsibility cooperate in evangelism — themes only.',
        },
      ],
      questions: appendOutlineBank('share-why-evangelize', [
        mc(
          'share-why-q1',
          'Biblical evangelism is primarily:',
          [
            'Winning arguments for ego',
            'Proclaiming Christ’s gospel in love and truth',
            'Forcing baptisms by threat',
            'Avoiding all verbal witness forever',
          ],
          1,
          'Ambassadors speak the message of reconciliation.',
        ),
        mc(
          'share-why-q2',
          'God’s sovereignty in salvation means Christians should:',
          [
            'Never speak because outcomes are fixed anyway',
            'Pray and speak, trusting God with results',
            'Manipulate people into praying a formula',
            'Hide hard truths to keep everyone comfortable',
          ],
          1,
          'Sovereignty fuels faithfulness in means, not silence.',
        ),
      ], PART16_SHARING_BY_LESSON),
      reflectionPrompts: [
        'Ask God to grow love for a specific person and courage to speak when he opens a door.',
      ],
      furtherStudy: ['Read Matthew 28:18–20 and list every verb Jesus assigns to disciples.'],
    },
    {
      id: 'share-gospel-and-testimony',
      order: 2,
      title: 'A Clear Gospel and a Honest Testimony',
      estimatedMinutes: 20,
      objectives: [
        'Outline the gospel in plain language.',
        'Distinguish testimony (your story) from the gospel (Christ’s work).',
        'Avoid exaggeration and self-centered storytelling.',
      ],
      primaryPassages: [passage('1peter', '1 Peter', 3, 15, 16)],
      supportingPassages: [
        passage('acts', 'Acts', 26, 12, 23),
        passage('colossians', 'Colossians', 4, 5, 6),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Clarity over cleverness',
          body:
            'A simple gospel outline helps: God, sin, Christ, response. Your testimony can illustrate grace, but it must not replace Christ’s cross and resurrection. Honesty beats dramatic inflation.',
        },
        {
          kind: 'concept',
          term: 'Testimony',
          explanation:
            'A truthful account of how you came to trust Christ and how he is changing you — always pointing beyond yourself to the Savior.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('1peter', '1 Peter', 3, 15, 16),
          note:
            'Interpretation: Be ready to explain your hope with gentleness and respect — readiness without rudeness.',
        },
        {
          kind: 'distinction',
          biblical:
            'Peter calls for a ready defense of hope with gentleness; Acts shows Paul recounting his conversion while centering Christ’s mission.',
          interpretation:
            'Reformed witness keeps the gospel objective (Christ for us) while gladly sharing subjective experience (Christ in us).',
          disagreement:
            'Some reduce evangelism to autobiography; others refuse any personal story. Both miss the biblical pattern of Word and witness.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'order',
          prompt: 'Order a simple gospel outline for a short conversation.',
          items: [
            'God is holy Creator',
            'We have sinned and face judgment',
            'Christ died and rose for sinners',
            'Repent and believe in him',
          ],
          answerOrder: [0, 1, 2, 3],
          explanation:
            'This is one faithful compression of the biblical storyline for clarity — not the only wording, but a coherent sequence.',
        },
      ],
      questions: appendOutlineBank('share-gospel-and-testimony', [
        mc(
          'share-clear-q1',
          'A Christian testimony should mainly:',
          [
            'Make you the hero of the story',
            'Point to Christ’s saving work with honesty',
            'Invent details for impact',
            'Avoid mentioning sin or grace',
          ],
          1,
          'Testimony serves the gospel; it does not replace it.',
        ),
        open(
          'share-clear-open',
          'Write three sentences: who God is, what Christ did, and how someone should respond.',
        ),
      ], PART16_SHARING_BY_LESSON),
      reflectionPrompts: [
        'Draft a two-minute testimony ending with Jesus, not with your improvement metrics. Pray it would be truthful.',
      ],
      furtherStudy: ['Practice your gospel outline with a trusted believer and invite correction.'],
      reviewFromLessonIds: ['share-why-evangelize'],
    },
    {
      id: 'share-listening-and-conversations',
      order: 3,
      title: 'Listening, Questions, and Hard Conversations',
      estimatedMinutes: 22,
      objectives: [
        'Practice listening before answering.',
        'Choose responses that clarify rather than crush.',
        'Recognize when to pause a conversation for another day.',
      ],
      primaryPassages: [passage('james', 'James', 1, 19, 20)],
      supportingPassages: [
        passage('proverbs', 'Proverbs', 18, 13, 13),
        passage('colossians', 'Colossians', 4, 5, 6),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Ears before answers',
          body:
            'Wise witness asks questions, listens for pain and assumptions, and refuses to punish honesty with contempt. You can disagree firmly without humiliating a person. Sometimes the godliest next step is, “I’d love to keep talking — can we meet again?”',
        },
        {
          kind: 'concept',
          term: 'Gentle defense',
          explanation:
            'From 1 Peter 3:15–16: explaining hope with gentleness and respect, keeping a clear conscience — not soft-pedaling truth, and not weaponizing it.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('james', 'James', 1, 19, 20),
          note:
            'Interpretation: Quick listening and slow anger protect witness; human anger does not produce God’s righteousness.',
        },
        {
          kind: 'distinction',
          biblical:
            'Scripture commands readiness to speak and readiness to listen; speech should be gracious and seasoned.',
          interpretation:
            'Reformed evangelicals reject both cowardly silence and hostile debater culture. The goal is the person’s good under God, not a highlight-reel victory.',
          disagreement:
            'Online culture often rewards dunking. Some Christians baptize that tone as “boldness.” Scripture’s boldness includes clarity and love.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'conversation',
          prompt: 'Conversation practice',
          scenario:
            'A coworker says religion has caused too much harm and that Christians just want control. Your aim is truthful, respectful witness — not winning a fight.',
          partnerName: 'Jordan',
          steps: [
            {
              partnerLine:
                'Honestly, I’m done with religion. It seems like a tool people use to control others.',
              choices: [
                {
                  text: 'You’re just ignorant. Real Christians never hurt anyone.',
                  quality: 'hostile',
                  explanation:
                    'This denies real sins of professing Christians and insults the person. It closes ears.',
                },
                {
                  text: 'That’s a serious concern. Can I ask what you’ve seen, and then share why I still follow Jesus?',
                  quality: 'helpful',
                  explanation:
                    'You honor the wound, invite their story, and keep the door open to the gospel.',
                },
                {
                  text: 'Well, all religions are basically the same anyway.',
                  quality: 'inaccurate',
                  explanation:
                    'That claim is neither true to historic Christianity nor helpful for gospel clarity.',
                },
                {
                  text: 'Yeah… church can be messy.',
                  quality: 'incomplete',
                  explanation:
                    'Empathy is good, but stopping here never points to Christ or distinguishes false religion from the gospel.',
                },
              ],
            },
            {
              partnerLine:
                'Fine — but why should I trust the Bible after everything churches have done?',
              choices: [
                {
                  text: 'Because if you don’t, you’ll burn — deal with it.',
                  quality: 'hostile',
                  explanation:
                    'Threat without gospel or patience is not the tone of 1 Peter 3:15.',
                },
                {
                  text: 'Church failure is real and grievous. The Bible itself judges hypocrisy — and it still centers on Jesus’ death and resurrection as public good news, not on our perfection.',
                  quality: 'helpful',
                  explanation:
                    'You acknowledge hypocrisy, use Scripture’s own critique, and return to Christ’s work.',
                },
                {
                  text: 'Just try my church; the vibes are better.',
                  quality: 'incomplete',
                  explanation:
                    'Hospitality matters, but “vibes” are not the gospel.',
                },
              ],
            },
          ],
        },
      ],
      questions: appendOutlineBank('share-listening-and-conversations', [
        mc(
          'share-listen-q1',
          'A wise first move when someone is angry at religion is often to:',
          [
            'Lecture immediately without questions',
            'Listen carefully and ask clarifying questions',
            'Match their anger volume',
            'Deny that any Christian has ever sinned',
          ],
          1,
          'Proverbs warns against answering before hearing.',
        ),
        mc(
          'share-listen-q2',
          'Hostile “gotcha” replies in evangelism are:',
          [
            'Always Spirit-filled boldness',
            'Usually unhelpful and against gentle defense',
            'Required by Matthew 28',
            'The only way atheists convert',
          ],
          1,
          'Gentleness and respect are commanded, not optional polish.',
        ),
      ], PART16_SHARING_BY_LESSON),
      reflectionPrompts: [
        'Confess any recent harsh speech about people who disagree with you, and ask God for a gentle, clear tongue.',
      ],
      furtherStudy: [
        'Role-play with a friend: one plays a hurt skeptic; practice listening for two full minutes before answering.',
      ],
      reviewFromLessonIds: ['share-gospel-and-testimony'],
    },
    {
      id: 'share-follow-up-patience',
      order: 4,
      title: 'Follow-Up, Patience, and Knowing When to Pause',
      estimatedMinutes: 16,
      objectives: [
        'Plan respectful follow-up after a gospel conversation.',
        'Recognize when to pause rather than force a decision.',
        'Keep friendship from becoming a project that erases the person.',
      ],
      primaryPassages: [passage('1corinthians', '1 Corinthians', 3, 5, 9)],
      supportingPassages: [
        passage('colossians', 'Colossians', 4, 5, 6),
        passage('2timothy', '2 Timothy', 2, 24, 26),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'God gives the growth',
          body:
            'Paul reminds the church that servants plant and water, but God gives the growth. That frees you from closing every conversation with a forced decision — and from abandoning people when they are not yet ready.',
        },
        {
          kind: 'concept',
          term: 'Patient witness',
          explanation:
            'Ongoing presence, prayer, clarity, and kindness over time — neither nagging nor neglect.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('2timothy', '2 Timothy', 2, 24, 25),
          note:
            'Interpretation: The Lord’s servant must be kind, able to teach, patiently enduring evil, correcting opponents with gentleness — God may grant repentance.',
        },
        {
          kind: 'distinction',
          biblical:
            '1 Corinthians 3 assigns growth to God; 2 Timothy commands gentle correction; Colossians urges gracious speech.',
          interpretation:
            'Reformed evangelicals reject both high-pressure closings and indifferent silence. Follow-up is stewardship under God’s sovereignty.',
          disagreement:
            'Some methods treat every chat as a sales funnel. Some Christians never follow up at all. Scripture models persistence without coercion.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'conversation',
          prompt: 'Conversation practice',
          scenario:
            'After a thoughtful talk, your friend says they need time. Practice ending well.',
          partnerName: 'Sam',
          steps: [
            {
              partnerLine:
                'I hear you. I’m not ready to decide anything about Jesus tonight.',
              choices: [
                {
                  text: 'Then you’re rejecting God and we’re done being friends.',
                  quality: 'hostile',
                  explanation:
                    'Ultimatums confuse friendship with conversion metrics.',
                },
                {
                  text: 'Thanks for listening. I’m glad to keep talking whenever you want — and I’ll be praying for you. No pressure tonight.',
                  quality: 'helpful',
                  explanation:
                    'You honor their pace, keep the door open, and entrust them to God.',
                },
                {
                  text: 'Sure — religion is optional trivia anyway.',
                  quality: 'inaccurate',
                  explanation:
                    'That undercuts the gospel you just shared.',
                },
              ],
            },
          ],
        },
      ],
      questions: appendOutlineBank('share-follow-up-patience', [
        mc(
          'share-follow-q1',
          'According to 1 Corinthians 3, growth in someone’s life ultimately comes from:',
          [
            'The cleverest Christian salesperson',
            'God who gives the growth',
            'Social media algorithms',
            'Never speaking again',
          ],
          1,
          'Planters and waterers serve; God gives growth.',
        ),
        mc(
          'share-follow-q2',
          'A wise follow-up after someone asks for time is often to:',
          [
            'Threaten them until they pray a prayer',
            'Offer continued friendship and conversation without coercion',
            'Ghost them permanently out of spite',
            'Publicly shame them online',
          ],
          1,
          'Patience and presence serve the gospel better than pressure.',
        ),
      ], PART16_SHARING_BY_LESSON),
      reflectionPrompts: [
        'Name one person you will pray for weekly this month, asking God for opportunities without scripting outcomes.',
      ],
      furtherStudy: [
        'Write a short follow-up text you could send after a gospel conversation that is warm, clear, and pressure-free.',
      ],
      reviewFromLessonIds: ['share-listening-and-conversations'],
    },
  ],
}
