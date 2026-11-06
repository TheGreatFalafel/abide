import type { QuizQuestion } from '../../planQuizzes'
import type { CurriculumTopic } from '../types'
import {
  SOURCE_GONZALEZ_SUP,
  SOURCE_NEEDHAM_SUP,
  SOURCE_SCHAFF_ORG,
} from '../historySources'
import { mc, passage } from './_helpers'

function five(
  prefix: string,
  items: Array<[string, string[], number, string, 'beginner' | 'intermediate' | 'advanced']>,
): QuizQuestion[] {
  return items.map(([prompt, choices, answer, explanation, difficulty], i) =>
    mc(`${prefix}-q${i + 1}`, prompt, choices, answer, explanation, difficulty),
  )
}

export const MEDIEVAL_CHURCH: CurriculumTopic = {
  id: 'medieval-church',
  title: 'The Medieval Church',
  description:
    'From Augustine and the fall of Rome through monasticism, the papacy and East-West split, scholasticism, and pre-Reformation voices (c. 400–1400).',
  objectives: [
    'Explain Augustine’s influence after the fall of Rome.',
    'Describe monasticism and Benedict’s rule.',
    'Outline the rise of the papacy and the East-West schism.',
    'Summarize scholastic method and pre-Reformation protests.',
  ],
  estimatedMinutes: 90,
  prerequisites: ['early-church'],
  framework: 'reformed',
  domain: 'church-history',
  era: 'medieval',
  eraLabel: 'Medieval Church (c. 400–1400)',
  contentStatus: 'full',
  version: 1,
  sources: [
    {
      ...SOURCE_SCHAFF_ORG,
      note: 'Organizational chronology for medieval eras — paraphrase themes only; use PD editions.',
    },
    {
      ...SOURCE_NEEDHAM_SUP,
      note: 'Supplementary narrative themes on monasticism, papacy, and schism.',
    },
    {
      ...SOURCE_GONZALEZ_SUP,
      note: 'Supplementary survey of medieval theology and reform voices.',
    },
  ],
  lessons: [
    {
      id: 'med-augustine-rome',
      order: 1,
      title: 'Augustine and the Fall of Rome',
      estimatedMinutes: 18,
      objectives: [
        'Identify Augustine’s City of God as a Christian response to Rome’s crisis.',
        'Distinguish earthly and heavenly cities in Augustine’s framework.',
      ],
      primaryPassages: [passage('psalms', 'Psalms', 46, 1, 11), passage('hebrews', 'Hebrews', 11, 13, 16)],
      supportingPassages: [passage('revelation', 'Revelation', 21, 1, 4)],
      content: [
        {
          kind: 'teaching',
          body:
            'When Rome was sacked (AD 410), critics blamed Christianity. Augustine (354–430) answered in The City of God: history is the story of two loves — love of God and love of self — forming two cities. The earthly city is temporary; the heavenly city is the pilgrim people of God. Augustine’s teaching on grace, original sin, and the church shaped Western theology for centuries.',
        },
        {
          kind: 'distinction',
          biblical:
            'Scripture calls believers strangers and exiles who seek a better country (Hebrews 11) and finds refuge in God when nations rage (Psalm 46).',
          interpretation:
            'Augustine’s two cities is a theological reading of history under providence, not a call to abandon civic life. The church’s hope is not Rome’s permanence.',
          disagreement:
            'Later readers debate how closely church and empire should be tied; Abide teaches pilgrim hope without denying civil responsibility.',
        },
      ],
      questions: five('med1', [
        [
          'Augustine wrote The City of God mainly to:',
          ['Defend Christianity after Rome’s crisis', 'Invent monasticism', 'Split East and West', 'Translate the Vulgate'],
          0,
          'The work answers pagan blame after the sack of Rome.',
          'beginner',
        ],
        [
          'In Augustine’s frame, the two cities are formed by:',
          ['Two loves (God vs self)', 'Two empires', 'Two languages', 'Two sacraments only'],
          0,
          'Love of God and love of self organize his history.',
          'beginner',
        ],
        [
          'Hebrews 11 describes the faithful as:',
          ['Strangers seeking a better country', 'Builders of permanent Rome', 'Rejecters of all cities', 'Angels'],
          0,
          'Pilgrim language matches Augustine’s heavenly city theme.',
          'intermediate',
        ],
        [
          'Augustine’s influence on the West included teaching on:',
          ['Grace and original sin', 'Denial of the Trinity', 'Rejection of Scripture', 'Arian Christology'],
          0,
          'His anti-Pelagian and trinitarian work shaped Latin theology.',
          'intermediate',
        ],
        [
          'The fall of Rome (410) showed that:',
          ['Earthly empires are not the church’s ultimate security', 'God abandoned history', 'Scripture failed', 'Monasticism ended'],
          0,
          'Augustine redirects hope from Rome to God’s city.',
          'advanced',
        ],
      ]),
      reflectionPrompts: [
        'Where are you tempted to treat a nation or institution as ultimate security?',
        'How does pilgrim hope shape how you serve your city now?',
      ],
      furtherStudy: ['Augustine, City of God (public-domain translations; sample books, do not paste copyrighted editions).'],
    },
    {
      id: 'med-monasticism',
      order: 2,
      title: 'Monasticism and Benedict',
      estimatedMinutes: 18,
      objectives: [
        'Explain why monastic communities arose.',
        'Summarize Benedict’s Rule as ordered prayer and work.',
      ],
      primaryPassages: [passage('1timothy', '1 Timothy', 4, 1, 5), passage('colossians', 'Colossians', 3, 16, 17)],
      supportingPassages: [passage('psalms', 'Psalms', 119, 1, 16)],
      content: [
        {
          kind: 'teaching',
          body:
            'After persecution eased, some Christians sought radical devotion in deserts and communities. Benedict of Nursia (c. 480–547) wrote a Rule balancing prayer, work, and stability. Monasteries preserved learning, copied manuscripts, and shaped Western piety — with both fruit and later abuses that Reformers would criticize.',
        },
        {
          kind: 'distinction',
          biblical:
            'Scripture calls for devotion, mutual teaching, and doing all in Christ’s name (Colossians 3), while warning against forbidding marriage and foods as if holiness were mere abstinence (1 Timothy 4).',
          interpretation:
            'Monastic discipline can serve Scripture meditation and charity, but holiness is not identical with withdrawal, and vows must not replace the gospel.',
          disagreement:
            'Traditions differ on monastic vows; Reformed churches generally do not require them while still valuing ordered devotion.',
        },
      ],
      questions: five('med2', [
        [
          'Benedict is best known for:',
          ['A rule for monastic life', 'The Ninety-Five Theses', 'The Nicene Creed', 'The King James Bible'],
          0,
          'His Rule ordered Western monasticism.',
          'beginner',
        ],
        [
          'Monasteries often helped by:',
          ['Copying manuscripts and preserving learning', 'Rejecting all prayer', 'Ending literacy', 'Abolishing the church'],
          0,
          'Scriptoria and schools were major medieval contributions.',
          'beginner',
        ],
        [
          '1 Timothy 4 warns against treating holiness as:',
          ['Mere abstinence rules that forbid God’s gifts', 'Prayer', 'Scripture reading', 'Love of neighbor'],
          0,
          'Ascetic rules can become false religion when they replace grace.',
          'intermediate',
        ],
        [
          'Benedict’s balance is often summarized as:',
          ['Prayer and work', 'War and trade', 'Silence only', 'Politics only'],
          0,
          'Ora et labora captures the Rule’s rhythm.',
          'intermediate',
        ],
        [
          'A Reformed caution about monasticism is that:',
          ['Vows and withdrawal must not replace the gospel or ordinary callings', 'Prayer is useless', 'Learning is sinful', 'Scripture should not be copied'],
          0,
          'Reformers criticized meritorious monasticism while affirming devotion.',
          'advanced',
        ],
      ]),
      reflectionPrompts: [
        'What ordered habits of prayer and work would help you now?',
        'Where might “spiritual” rules quietly replace grace in your life?',
      ],
      furtherStudy: ['Benedict’s Rule (public-domain English translations).'],
      reviewFromLessonIds: ['med-augustine-rome'],
    },
    {
      id: 'med-papacy-schism',
      order: 3,
      title: 'The Papacy and the East-West Split',
      estimatedMinutes: 18,
      objectives: [
        'Describe the growth of papal claims in the West.',
        'State key factors in the 1054 East-West schism including the filioque.',
      ],
      primaryPassages: [passage('matthew', 'Matthew', 16, 13, 20), passage('1peter', '1 Peter', 5, 1, 4)],
      supportingPassages: [passage('ephesians', 'Ephesians', 2, 19, 22)],
      content: [
        {
          kind: 'teaching',
          body:
            'Western bishops of Rome gained growing prestige and jurisdictional claims. Eastern churches emphasized conciliar equality of patriarchates. The filioque clause (“and the Son”) in the Western creed, papal authority, and political rivalry contributed to the formal schism of 1054. The app teaches the filioque with TMS; Orthodoxy rejects the unilateral addition — describe both honestly.',
        },
        {
          kind: 'distinction',
          biblical:
            'Peter confesses Christ (Matthew 16); elders shepherd by example, not as lords (1 Peter 5); the church is built on apostolic foundation with Christ as cornerstone (Ephesians 2).',
          interpretation:
            'Reformed theology rejects a perpetual papal supremacy as necessary for the church’s being, while acknowledging Rome’s historic influence.',
          disagreement:
            'Roman Catholic and Orthodox accounts of primacy and the filioque differ; Abide teaches TMS on the filioque and describes other views.',
        },
      ],
      questions: five('med3', [
        [
          'The formal East-West schism is traditionally dated:',
          ['1054', '325', '1517', '410'],
          0,
          'Mutual excommunications mark 1054 as a symbolic break.',
          'beginner',
        ],
        [
          'Filioque means the Spirit proceeds from:',
          ['The Father and the Son (Western creed)', 'The church alone', 'Angels', 'Mary'],
          0,
          'The Western addition is a major Orthodox objection.',
          'beginner',
        ],
        [
          '1 Peter 5 instructs elders to shepherd:',
          ['Not as lords over those in their charge', 'As absolute monarchs', 'Only by wealth', 'Without teaching'],
          0,
          'Pastoral leadership is example-shaped, not domineering.',
          'intermediate',
        ],
        [
          'A factor in the schism besides theology was:',
          ['Political and cultural rivalry between East and West', 'The invention of printing', 'The American Revolution', 'Darwinism'],
          0,
          'Empire, language, and power deepened the divide.',
          'intermediate',
        ],
        [
          'Reformed teaching on Matthew 16 typically holds that:',
          ['Christ builds His church on the apostolic confession, not a perpetual papal office as Rome defines it', 'Peter was never an apostle', 'There is no church', 'Only Rome can baptize'],
          0,
          'Confession of Christ is central; papal supremacy is rejected.',
          'advanced',
        ],
      ]),
      reflectionPrompts: [
        'How do you pursue unity without ignoring real doctrinal disagreements?',
        'Where does Christlike shepherding challenge worldly models of power?',
      ],
      furtherStudy: ['Schaff, History of the Christian Church (PD) on the schism — themes only.'],
      reviewFromLessonIds: ['med-augustine-rome', 'med-monasticism'],
    },
    {
      id: 'med-scholasticism',
      order: 4,
      title: 'Scholasticism',
      estimatedMinutes: 18,
      objectives: [
        'Define scholastic method as ordered theological reasoning.',
        'Name Anselm and Aquinas as major figures without requiring agreement on every conclusion.',
      ],
      primaryPassages: [passage('romans', 'Romans', 12, 1, 2), passage('colossians', 'Colossians', 2, 1, 8)],
      supportingPassages: [passage('proverbs', 'Proverbs', 1, 1, 7)],
      content: [
        {
          kind: 'teaching',
          body:
            'Medieval universities developed scholastic theology: careful questions, distinctions, and answers (Anselm’s “faith seeking understanding”; Aquinas’s Summa). The method can serve Scripture, but it can also drift into speculation. Reformers later insisted Scripture’s clarity and authority must rule philosophical systems.',
        },
        {
          kind: 'distinction',
          biblical:
            'Believers renew their minds (Romans 12) and are warned not to be taken captive by empty philosophy not according to Christ (Colossians 2).',
          interpretation:
            'Reason is a gift under Scripture, not a rival authority. Scholastic clarity helps; speculation that overrides the text harms.',
          disagreement:
            'Christians differ on how far natural theology can go; TMS teaches Scripture as the only infallible rule.',
        },
      ],
      questions: five('med4', [
        [
          'Scholasticism is best described as:',
          ['Ordered theological questioning and distinction', 'Denial of reason', 'Abolishing universities', 'Only poetry'],
          0,
          'It is a method, not one single doctrine.',
          'beginner',
        ],
        [
          'Anselm is associated with the phrase:',
          ['Faith seeking understanding', 'Faith seeking silence', 'Reason without faith', 'No creed'],
          0,
          'Fides quaerens intellectum summarizes his approach.',
          'beginner',
        ],
        [
          'Colossians 2 warns against philosophy that is:',
          ['Not according to Christ', 'Always useful', 'Identical to Proverbs', 'Required by Moses'],
          0,
          'Christ is the measure of true wisdom.',
          'intermediate',
        ],
        [
          'Thomas Aquinas is known for:',
          ['The Summa Theologica', 'The Ninety-Five Theses', 'Pilgrim’s Progress', 'Institutes of the Christian Religion'],
          0,
          'His Summa is a major scholastic synthesis.',
          'intermediate',
        ],
        [
          'A Reformation critique of late scholasticism was that:',
          ['Human systems must not outrank Scripture’s authority and clarity', 'Thinking is sinful', 'Universities must close', 'Latin must never be used'],
          0,
          'Sola Scriptura reorders authority without ending careful theology.',
          'advanced',
        ],
      ]),
      reflectionPrompts: [
        'How can careful thinking serve love of God rather than pride?',
        'Where do you need Scripture to correct your assumptions?',
      ],
      furtherStudy: ['Anselm, Proslogion (PD translations) — short excerpts only.'],
      reviewFromLessonIds: ['med-papacy-schism'],
    },
    {
      id: 'med-pre-reformation',
      order: 5,
      title: 'Pre-Reformation Voices',
      estimatedMinutes: 18,
      objectives: [
        'Identify Wycliffe, Hus, and related calls for Scripture and reform.',
        'Explain how medieval abuses prepared for the Reformation without romanticizing every critic.',
      ],
      primaryPassages: [passage('psalms', 'Psalms', 119, 105, 105), passage('2timothy', '2 Timothy', 3, 14, 17)],
      supportingPassages: [passage('acts', 'Acts', 17, 10, 12)],
      content: [
        {
          kind: 'teaching',
          body:
            'Before 1517, voices such as John Wycliffe (England) and Jan Hus (Bohemia) pressed for Scripture’s authority, vernacular access, and reform of clerical corruption. They were not identical to later Protestants, but they show that Scripture-centered protest did not begin overnight. God prepared the Reformation through many streams.',
        },
        {
          kind: 'distinction',
          biblical:
            'God’s word is a lamp (Psalm 119:105); Scripture equips for every good work (2 Timothy 3:16-17); Bereans examine the Scriptures (Acts 17).',
          interpretation:
            'Pre-Reformation calls for the Bible’s supremacy anticipate sola Scriptura, even when their systems were incomplete.',
          disagreement:
            'Historians debate continuity between Wycliffe/Hus and Luther; Abide notes preparation without forcing identical theology.',
        },
      ],
      questions: five('med5', [
        [
          'John Wycliffe is associated with:',
          ['English Scripture access and critique of church abuses', 'Founding Jesuit missions', 'Writing the Nicene Creed', 'The Council of Trent'],
          0,
          'He pressed vernacular Scripture and reform.',
          'beginner',
        ],
        [
          'Jan Hus preached reform in:',
          ['Bohemia', 'Spain', 'Ethiopia', 'Japan'],
          0,
          'Hus’s Bohemian reform preceded Luther.',
          'beginner',
        ],
        [
          '2 Timothy 3:16-17 teaches Scripture is profitable so that the believer may be:',
          ['Equipped for every good work', 'Saved by knowledge alone without Christ', 'Free from all teaching', 'Above correction'],
          0,
          'Sufficiency language fuels reform instincts.',
          'intermediate',
        ],
        [
          'Pre-Reformation voices show that:',
          ['Calls for Scripture and reform existed before 1517', 'No one cared about the Bible until Luther', 'The Middle Ages had no churches', 'Printing caused the fall of Rome'],
          0,
          '1517 is a climax, not the first spark.',
          'intermediate',
        ],
        [
          'A fair historical caution is that:',
          ['Earlier reformers were not identical to later confessional Protestants in every doctrine', 'Hus denied Scripture', 'Wycliffe invented the papacy', 'No manuscripts existed'],
          0,
          'Continuity and difference both matter.',
          'advanced',
        ],
      ]),
      reflectionPrompts: [
        'How does access to Scripture in your language shape your discipleship?',
        'What reform might God want in your own habits, not only in “the church out there”?',
      ],
      furtherStudy: ['Schaff (PD) on Wycliffe and Hus — narrative themes.'],
      reviewFromLessonIds: ['med-scholasticism'],
    },
  ],
}
