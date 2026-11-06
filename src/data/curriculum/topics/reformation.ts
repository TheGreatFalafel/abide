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

export const REFORMATION: CurriculumTopic = {
  id: 'reformation',
  title: 'The Reformation',
  description:
    'Luther, Zwingli and Calvin, the English Reformation and Anabaptists, Trent’s response, and Puritans, Baptists, and Westminster (c. 1517–1650).',
  objectives: [
    'Explain Luther’s protest and justification by faith.',
    'Compare Reformed centers in Zurich and Geneva.',
    'Outline English Reformation and Anabaptist distinctives fairly.',
    'Describe Trent and later confessional developments.',
  ],
  estimatedMinutes: 90,
  prerequisites: ['medieval-church'],
  framework: 'reformed',
  domain: 'church-history',
  era: 'reformation',
  eraLabel: 'Reformation (c. 1517–1650)',
  contentStatus: 'full',
  version: 1,
  sources: [
    {
      ...SOURCE_SCHAFF_ORG,
      note: 'Organizational Reformation chronology — PD editions; paraphrase only.',
    },
    {
      ...SOURCE_NEEDHAM_SUP,
      note: 'Supplementary narrative on Luther, Calvin, and England.',
    },
    {
      ...SOURCE_GONZALEZ_SUP,
      note: 'Supplementary survey of Protestant families and Trent.',
    },
  ],
  lessons: [
    {
      id: 'ref-luther',
      order: 1,
      title: 'Luther and the Ninety-Five Theses',
      estimatedMinutes: 18,
      objectives: [
        'State why Luther protested indulgences in 1517.',
        'Explain justification by faith alone as the Reformation’s center.',
      ],
      primaryPassages: [passage('romans', 'Romans', 1, 16, 17), passage('romans', 'Romans', 3, 21, 28)],
      supportingPassages: [passage('galatians', 'Galatians', 2, 15, 21)],
      content: [
        {
          kind: 'teaching',
          body:
            'On 31 October 1517 Martin Luther posted Ninety-Five Theses challenging indulgence abuses. His deeper rediscovery was the gospel: the righteousness of God revealed in the gospel is received by faith (Romans 1:17). Justification is God’s legal declaration that sinners are righteous in Christ, not a process of infused merit. Sola Scriptura, sola fide, sola gratia, solus Christus, and soli Deo gloria summarize the Reformers’ recovery.',
        },
        {
          kind: 'distinction',
          biblical:
            'The righteous live by faith (Romans 1:17); God justifies the one who has faith in Jesus apart from works of the law (Romans 3:21-28).',
          interpretation:
            'Reformed Protestantism teaches forensic justification by faith alone in Christ alone, grounded in Scripture’s authority.',
          disagreement:
            'Rome at Trent rejected sola fide as Protestants defined it; Abide teaches the Reformation gospel and describes the Catholic alternative fairly.',
        },
      ],
      questions: five('ref1', [
        ['Luther’s Ninety-Five Theses (1517) first challenged:', ['Indulgence abuses', 'Infant baptism', 'The Trinity', 'The canon'], 0, 'Indulgences sparked the public protest.', 'beginner'],
        ['Romans 1:17 was central to Luther because it teaches:', ['The righteous live by faith', 'Works earn heaven', 'Law replaces gospel', 'Faith is optional'], 0, 'Gospel righteousness is received by faith.', 'beginner'],
        ['Justification in Reformation teaching is primarily:', ['A legal declaration based on Christ’s righteousness', 'Infusion of virtue by ritual alone', 'Self-improvement', 'Church membership alone'], 0, 'Forensic justification is the Reformation center.', 'intermediate'],
        ['Sola Scriptura means:', ['Scripture is the final infallible authority', 'Christians need no teachers', 'Tradition is equal to Scripture', 'Only pastors may read the Bible'], 0, 'Scripture norms all other authorities.', 'intermediate'],
        ['Trent’s response to sola fide:', ['Rejected the Protestant definition of justification by faith alone', 'Agreed fully with Luther', 'Abolished the Mass', 'Ended the papacy'], 0, 'The confessional divide was formalized at Trent.', 'advanced'],
      ]),
      reflectionPrompts: [
        'Where are you still tempted to trust your performance more than Christ’s righteousness?',
        'How does “the righteous shall live by faith” reshape a current fear?',
      ],
      furtherStudy: ['Luther, Freedom of a Christian (PD translations).'],
    },
    {
      id: 'ref-zwingli-calvin',
      order: 2,
      title: 'Zwingli, Calvin, and Geneva',
      estimatedMinutes: 18,
      objectives: [
        'Locate Zwingli’s reform in Zurich and Calvin’s in Geneva.',
        'Note Reformed emphases on God’s glory, Scripture, and church order.',
      ],
      primaryPassages: [passage('ephesians', 'Ephesians', 1, 3, 14), passage('1corinthians', '1 Corinthians', 14, 26, 40)],
      supportingPassages: [passage('acts', 'Acts', 20, 17, 28)],
      content: [
        {
          kind: 'teaching',
          body:
            'Ulrich Zwingli reformed Zurich with a strong Scripture principle. John Calvin’s Institutes and Geneva’s pastoral order shaped Reformed churches: God’s sovereignty and glory, Word-centered worship, and elder-led congregations. Differences with Luther on the Supper remained real; unity in the gospel was still prized.',
        },
        {
          kind: 'distinction',
          biblical:
            'Blessings in Christ are rooted in God’s eternal purpose (Ephesians 1); worship and church life should be orderly (1 Corinthians 14).',
          interpretation:
            'Reformed churches seek worship and polity regulated by Scripture for God’s glory and the flock’s good.',
          disagreement:
            'Lutheran and Reformed views of the Supper differ; Abide notes the debate without mockery.',
        },
      ],
      questions: five('ref2', [
        ['Calvin is closely associated with reform in:', ['Geneva', 'Wittenberg only', 'Rome', 'Canterbury only'], 0, 'Geneva became a Reformed training center.', 'beginner'],
        ['Zwingli’s reform center was:', ['Zurich', 'Paris', 'Moscow', 'Alexandria'], 0, 'Swiss reform began in Zurich.', 'beginner'],
        ['Ephesians 1 emphasizes salvation as:', ['God’s purposeful blessing in Christ', 'Human invention', 'Chance', 'National privilege alone'], 0, 'Election and grace are doxological.', 'intermediate'],
        ['Reformed worship historically stressed:', ['The central place of the Word', 'Entertainment first', 'Silence about Scripture', 'Private visions as equal to the Bible'], 0, 'Word and sacrament structure the assembly.', 'intermediate'],
        ['A lasting Lutheran–Reformed disagreement concerned:', ['Christ’s presence in the Lord’s Supper', 'Whether Jesus is Lord', 'Whether there is one God', 'Whether Scripture exists'], 0, 'Supper debates divided Protestant families.', 'advanced'],
      ]),
      reflectionPrompts: [
        'How does God’s glory (not your brand) shape how you serve?',
        'What would more Word-centered habits look like in your week?',
      ],
      furtherStudy: ['Calvin, Institutes (PD older translations) — sample book 1 themes.'],
      reviewFromLessonIds: ['ref-luther'],
    },
    {
      id: 'ref-english-anabaptists',
      order: 3,
      title: 'The English Reformation and the Anabaptists',
      estimatedMinutes: 18,
      objectives: [
        'Sketch England’s complicated path under Henry, Edward, Mary, and Elizabeth.',
        'Describe Anabaptist distinctives fairly, including where Abide differs.',
      ],
      primaryPassages: [passage('romans', 'Romans', 13, 1, 7), passage('acts', 'Acts', 5, 27, 29)],
      supportingPassages: [passage('matthew', 'Matthew', 28, 18, 20)],
      content: [
        {
          kind: 'teaching',
          body:
            'England’s Reformation mixed political rupture with genuine gospel recovery (Tyndale’s Bible; later Puritan pressures). Anabaptists stressed believers’ baptism, discipleship, and often separation from state churches. Some Anabaptist groups held errors; others suffered unjustly. Abide teaches credobaptist immersion with TMS while describing paedobaptist Reformed churches as fellow Protestants.',
        },
        {
          kind: 'distinction',
          biblical:
            'Governing authorities are God’s servants (Romans 13), yet we must obey God rather than men when commands conflict (Acts 5:29).',
          interpretation:
            'Christians honor civil authority without making the state the church’s head in matters of faith.',
          disagreement:
            'Anabaptist radicalism and magisterial reform disagreed on church-state ties and baptism; describe both accurately.',
        },
      ],
      questions: five('ref3', [
        ['William Tyndale is remembered for:', ['English Bible translation work', 'Writing Trent’s decrees', 'Founding Jesuit order', 'Inventing the printing press'], 0, 'Tyndale’s translation shaped English Scripture.', 'beginner'],
        ['Anabaptists typically emphasized:', ['Believers’ baptism', 'Papal supremacy', 'Denial of the Trinity', 'Rejection of all Bibles'], 0, 'Credobaptism was a defining mark.', 'beginner'],
        ['Acts 5:29 teaches that when authorities forbid gospel obedience:', ['We must obey God rather than men', 'We abandon all civil order', 'Faith is private only', 'Scripture is optional'], 0, 'Conscience under God limits unjust commands.', 'intermediate'],
        ['England’s Reformation is often called complicated because:', ['Politics and theology were intertwined', 'No one translated Scripture', 'Luther never existed', 'There were no monarchs'], 0, 'Royal policy and gospel motives both appear.', 'intermediate'],
        ['Abide’s baptismal position (TMS) is:', ['Immersion of believers', 'Baptismal regeneration as Trent defines it', 'No baptism at all', 'Baptism of bells'], 0, 'Credobaptist immersion is taught; other Protestant views described.', 'advanced'],
      ]),
      reflectionPrompts: [
        'Where must you honor authority — and where must you obey God first?',
        'How does your baptism (or desire for it) testify to the gospel?',
      ],
      furtherStudy: ['Foxe’s Book of Martyrs (PD) — selected English martyr narratives.'],
      reviewFromLessonIds: ['ref-zwingli-calvin'],
    },
    {
      id: 'ref-trent',
      order: 4,
      title: 'Trent and the Catholic Response',
      estimatedMinutes: 18,
      objectives: [
        'State Trent’s purpose as Catholic reform and doctrinal definition against Protestantism.',
        'Contrast Protestant and Tridentine views of justification and authority.',
      ],
      primaryPassages: [passage('galatians', 'Galatians', 1, 6, 9), passage('2timothy', '2 Timothy', 3, 14, 17)],
      supportingPassages: [passage('romans', 'Romans', 4, 1, 8)],
      content: [
        {
          kind: 'teaching',
          body:
            'The Council of Trent (1545–1563) reformed some abuses and defined Catholic doctrine against Protestant claims. It rejected sola fide as Protestants taught it, upheld a wider canon including the Apocrypha, and affirmed tradition with Scripture. Knowing Trent helps explain why the Reformation divide was not a misunderstanding of manners but of the gospel and authority.',
        },
        {
          kind: 'distinction',
          biblical:
            'Another gospel is under curse (Galatians 1); Scripture equips the man of God (2 Timothy 3); God counts faith as righteousness (Romans 4).',
          interpretation:
            'Abide teaches justification by faith alone and Scripture as the only infallible rule, describing Trent’s alternative without caricature.',
          disagreement:
            'Catholic and Protestant readings of justification and canon remain divided; state both sides fairly.',
        },
      ],
      questions: five('ref4', [
        ['The Council of Trent mainly:', ['Defined Catholic doctrine in response to Protestantism', 'Founded Geneva', 'Wrote the Augsburg Confession', 'Translated the KJV'], 0, 'Trent is the Catholic Counter-Reformation council.', 'beginner'],
        ['Trent’s stance on Protestant sola fide was:', ['Rejection of the Protestant definition', 'Full agreement', 'Silence', 'Adoption of Zwingli only'], 0, 'Justification remained a dividing line.', 'beginner'],
        ['Galatians 1 warns against:', ['A different gospel', 'Too much Bible reading', 'Baptism', 'Prayer'], 0, 'Gospel purity is non-negotiable.', 'intermediate'],
        ['On the Old Testament Apocrypha, Protestants generally:', ['Do not treat those books as canonical Scripture', 'Add more books than Trent', 'Deny the OT entirely', 'Follow Marcion'], 0, 'Canon differences remain.', 'intermediate'],
        ['Understanding Trent matters because:', ['It shows the Reformation conflict was doctrinal, not merely political manners', 'It ended all disagreement', 'It abolished the papacy', 'It invented Christianity'], 0, 'Confessional clarity explains the lasting divide.', 'advanced'],
      ]),
      reflectionPrompts: [
        'Can you explain justification clearly to a Catholic friend without contempt?',
        'Where do you need Scripture to correct a “gospel plus” habit?',
      ],
      furtherStudy: ['Compare Romans 3–4 with a fair summary of Trent’s justification canons (paraphrase; do not paste copyrighted texts).'],
      reviewFromLessonIds: ['ref-luther'],
    },
    {
      id: 'ref-puritans-westminster',
      order: 5,
      title: 'Puritans, Baptists, and the Westminster Assembly',
      estimatedMinutes: 18,
      objectives: [
        'Identify Puritan aims for further reform of worship and life.',
        'Note Westminster Standards and early Baptist confessions as Protestant heirs.',
      ],
      primaryPassages: [passage('psalms', 'Psalms', 119, 1, 16), passage('ephesians', 'Ephesians', 4, 11, 16)],
      supportingPassages: [passage('1timothy', '1 Timothy', 3, 1, 13)],
      content: [
        {
          kind: 'teaching',
          body:
            'English Puritans sought a more thoroughly biblical church and personal holiness. The Westminster Assembly (1640s) produced Confession and Catechisms that still teach Reformed churches. Early Baptists shared much Protestant doctrine while practicing believers’ baptism. Abide’s TMS lineage is baptistic and Reformed-evangelical; Westminster remains a major cousin confession.',
        },
        {
          kind: 'distinction',
          biblical:
            'Delight in God’s law (Psalm 119); Christ gives teachers so the body grows in love (Ephesians 4); elders and deacons must be qualified (1 Timothy 3).',
          interpretation:
            'Confessions serve the church under Scripture — they are subordinate standards, not rivals to the Bible.',
          disagreement:
            'Presbyterian, Congregational, and Baptist polities differ; describe fairly while teaching local-church autonomy with qualified male elders per TMS.',
        },
      ],
      questions: five('ref5', [
        ['The Westminster Assembly produced:', ['A Confession and Catechisms', 'The Nicene Creed', 'The Book of Mormon', 'Trent’s canons'], 0, 'Westminster Standards remain Reformed landmarks.', 'beginner'],
        ['Puritans generally wanted:', ['Further biblical reform of church and life', 'Return to indulgences', 'Abolition of Scripture', 'Denial of the Trinity'], 0, 'Holiness and Word-shaped worship were aims.', 'beginner'],
        ['Confessions are best treated as:', ['Subordinate to Scripture', 'Equal to Scripture', 'Above Scripture', 'Useless'], 0, 'Norma normata under the Bible.', 'intermediate'],
        ['Early Baptists typically agreed with Protestants on:', ['Justification by faith and Scripture’s authority, while practicing believers’ baptism', 'Papal infallibility', 'Denial of Christ’s deity', 'Rejection of the NT'], 0, 'Baptists are Protestant heirs with baptismal distinctives.', 'intermediate'],
        ['TMS church order emphasizes:', ['Qualified male elders and local church autonomy', 'A worldwide pope', 'No leaders at all', 'Rule by the state bishop only'], 0, 'Elder-led congregational life is taught.', 'advanced'],
      ]),
      reflectionPrompts: [
        'How might a catechism question help you teach your household?',
        'Where do you need both sound doctrine and earnest holiness?',
      ],
      furtherStudy: ['Westminster Shorter Catechism Q1–Q3 (PD).'],
      reviewFromLessonIds: ['ref-trent'],
    },
  ],
}
