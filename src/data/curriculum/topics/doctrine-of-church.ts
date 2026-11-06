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
import { PART17_CHURCH_BY_LESSON } from '../banks/part17-doctrine-christ-salvation-church'
import { appendOutlineBank } from '../banks/outlineBankHelper'

const L1_QUESTIONS: QuizQuestion[] = [
  mc(
    'coc-1-marks',
    'Acts 2:42 describes the earliest church as devoted to the apostles’ teaching, fellowship, the breaking of bread, and…',
    ['Political organizing', 'Prayer', 'Building a temple', 'Avoiding one another'],
    1,
    'Acts 2:42 names four devotions together: teaching, fellowship, breaking of bread, and prayer—an original pattern for ongoing church life, not a one-time event.',
  ),
  mc(
    'coc-1-body',
    '1 Corinthians 12 pictures the church as a body in order to teach that believers…',
    [
      'Are interchangeable and identical in function',
      'Are diverse members who need one another, united under one Head',
      'Should each pursue ministry alone',
      'Have no real connection to one another',
    ],
    1,
    'Paul’s body metaphor stresses both diversity of function and genuine interdependence—no member can say it has no need of the others (1 Cor 12:21).',
  ),
  mc(
    'coc-1-invisible',
    'In this lesson’s Reformed framing, the “invisible church” refers to…',
    [
      'A single hidden denomination',
      'The true, elect people of God known fully only to Him, across all times and places',
      'Churches that meet online',
      'A church with no leadership',
    ],
    1,
    'The visible/invisible distinction separates the mixed, organized congregation we can see from the true company of the redeemed, which only God perfectly discerns (cf. Matt 13:24–30).',
  ),
  open(
    'coc-1-open',
    'Reflect on one way your local congregation visibly lives out Acts 2:42’s pattern of teaching, fellowship, the Table, and prayer. Where could it grow?',
  ),
]

const L2_QUESTIONS: QuizQuestion[] = [
  mc(
    'coc-2-qualify',
    '1 Timothy 3 and Titus 1 ground elder qualifications chiefly in…',
    [
      'Public charisma and speaking skill alone',
      'Tested character, household management, and soundness in doctrine',
      'Wealth and social status',
      'Age alone, regardless of character',
    ],
    1,
    'Paul’s lists (1 Tim 3:1–7; Titus 1:5–9) are overwhelmingly about character, self-control, household faithfulness, and the ability to teach sound doctrine—not mere gifting.',
  ),
  mc(
    'coc-2-terms',
    'Acts 20:17, 28 and Titus 1:5, 7 use which overlapping terms for the same office?',
    ['Apostle and prophet', 'Elder, overseer, and shepherd', 'Deacon and widow', 'Priest and Levite'],
    1,
    'The same leaders are called “elders” (presbyteros), told to serve as “overseers” (episkopos), and charged to “shepherd” (poimainein)—three angles on one office, not three offices.',
  ),
  mc(
    'coc-2-deacons',
    'Acts 6:1–6 shows the apostles appointing the first deacon-like servants chiefly so that…',
    [
      'The apostles could avoid all practical ministry forever',
      'Practical needs (like the daily distribution) would be served well, freeing elders for prayer and the word',
      'The church could grow its budget',
      'Widows would be excluded from care',
    ],
    1,
    'The appointment in Acts 6 addresses a concrete need (fair distribution to widows) while protecting the apostles’ devotion to prayer and the ministry of the word—an early pattern for diaconal service.',
  ),
  open(
    'coc-2-open',
    'Given the weight of 1 Timothy 3’s qualifications, how can you pray for or encourage your own church’s elders and deacons this week?',
  ),
]

const L3_QUESTIONS: QuizQuestion[] = [
  mc(
    'coc-3-baptize',
    'Matthew 28:19 commands that baptism be done in the name of…',
    ['Moses alone', 'The Father, the Son, and the Holy Spirit', 'The local congregation', 'The apostles only'],
    1,
    'The Great Commission ties baptism to the triune name, marking it as an entrance rite into discipleship under the one God in three persons.',
  ),
  mc(
    'coc-3-examine',
    '1 Corinthians 11 instructs believers to examine themselves before the Lord’s Supper mainly because…',
    [
      'The meal is merely social',
      'Failing to discern the body shows contempt for what Christ’s death accomplished',
      'Only church officers may ever eat',
      'Self-examination earns forgiveness',
    ],
    1,
    'Paul warns that eating and drinking “without discerning the body” treats Christ’s sacrifice carelessly (1 Cor 11:27–29); the remedy is honest self-examination, not self-exclusion from grace.',
  ),
  mc(
    'coc-3-disagree',
    'This lesson notes that confessionally Reformed Christians who equally affirm Scripture’s authority still disagree, in good conscience, about…',
    [
      'Whether Jesus instituted the Lord’s Supper',
      'The proper subjects of baptism—infants of believers, or professing believers only',
      'Whether the church should ever gather',
      'Whether Christ truly died and rose',
    ],
    1,
    'Paedobaptist and credobaptist Reformed traditions both honor Scripture; they differ on how texts like Colossians 2:11–12 and Acts 2:38–39 relate baptism to covenant children versus professing faith.',
  ),
  open(
    'coc-3-open',
    'How does remembering Christ’s broken body and shed blood shape the way you approach the Lord’s Table?',
  ),
]

const L4_QUESTIONS: QuizQuestion[] = [
  mc(
    'coc-4-worship',
    'John 4:23–24 teaches that the Father seeks worshipers who worship Him…',
    ['In a specific building only', 'In spirit and truth', 'Through silence alone', 'By ritual without sincerity'],
    1,
    'Jesus relocates true worship away from a single geographic site (Jerusalem or Gerizim) to Spirit-enabled, truth-shaped worship of the Father.',
  ),
  mc(
    'coc-4-unity',
    'Ephesians 4:4–6 grounds Christian unity in…',
    [
      'Agreement on every secondary issue',
      'One body, one Spirit, one hope, one Lord, one faith, one baptism, one God and Father of all',
      'Shared nationality',
      'Identical worship styles',
    ],
    1,
    'Paul roots unity in shared realities believers already possess in Christ, not in uniformity of preference or culture.',
  ),
  mc(
    'coc-4-discipline',
    'Matthew 18:15–17’s process of confronting sin ultimately aims at…',
    [
      'Public humiliation',
      'Repentance and restoration of the sinning brother or sister',
      'Permanent exclusion with no path back',
      'Avoiding the conversation altogether',
    ],
    1,
    'Each step (private, then with witnesses, then before the church) is designed to win back a brother—2 Corinthians 2:5–8 shows the same heart in welcoming a repentant believer back.',
  ),
  open(
    'coc-4-open',
    'Where might God be calling you to pursue unity or loving honesty with a fellow believer this week?',
  ),
]

const L5_QUESTIONS: QuizQuestion[] = [
  mc(
    'coc-5-commission',
    'Matthew 28:19–20 commands the church to make disciples by…',
    [
      'Winning arguments only',
      'Baptizing them and teaching them to obey everything Christ commanded',
      'Avoiding other nations',
      'Waiting passively for people to arrive',
    ],
    1,
    'The Great Commission pairs baptism (initiation) with ongoing teaching toward obedience (formation)—mission is both proclamation and discipleship.',
  ),
  mc(
    'coc-5-gifts',
    '1 Corinthians 12 teaches that spiritual gifts are given…',
    [
      'For self-promotion',
      'By one Spirit, for the common good of the body',
      'Only to church officers',
      'Equally and identically to every believer',
    ],
    1,
    'Paul stresses variety of gifts from one Spirit, distributed “for the common good” (1 Cor 12:7)—gifts serve the body, not personal status.',
  ),
  mc(
    'coc-5-agree',
    'According to this lesson, cessationists and continuationists within Reformed evangelicalism commonly agree that…',
    [
      'Scripture’s canon is closed and no revelation today carries Scripture-level authority',
      'New apostles are still being appointed',
      'Tongues must always be practiced in every service',
      'Spiritual gifts are unnecessary',
    ],
    0,
    'Both camps affirm the sufficiency and closure of the biblical canon; they differ chiefly on whether certain revelatory/sign gifts continue in the same form as the apostolic era.',
  ),
  open(
    'coc-5-open',
    'What gift or practical ability has God given you, and how might you use it to serve your church’s mission this month?',
  ),
]

/** Second complete theology topic: the doctrine of the church (ecclesiology). */
export const DOCTRINE_OF_CHURCH: CurriculumTopic = {
  id: 'doctrine-of-church',
  title: 'The Doctrine of the Church',
  description:
    'A Reformed introduction to ecclesiology: what the church is, how it is led, what its ordinances mean, how it worships and maintains loving accountability, and why it exists on mission in the world.',
  objectives: [
    'Define the church biblically as the body and people of God, distinguishing the visible and invisible church.',
    'Describe biblical qualifications and roles for elders and deacons, and compare major polity models fairly.',
    'Explain the meaning of baptism and the Lord’s Supper, presenting credobaptist/paedobaptist and memorial/spiritual-presence convictions fairly.',
    'Articulate biblical principles for worship, unity, and restorative church discipline.',
    'Connect the church’s mission and spiritual gifts to the Great Commission, noting the cessationist/continuationist debate fairly.',
  ],
  estimatedMinutes: 95,
  prerequisites: ['doctrine-of-salvation'],
  framework: 'reformed',
  contentStatus: 'full',
  version: 2,
  sources: [
    {
      ...SOURCE_GRUDEM_ORG,
      note:
        'Topic order and major headings (nature/purpose, government, ordinances, worship and discipline, mission) follow the standard systematic-theology sequence for ecclesiology as an organizing map for original lesson writing—not reproduced textbook text.',
    },
    {
      ...SOURCE_SPROUL_SUP,
      note:
        'Sproul’s widely known emphasis on the holiness and seriousness of corporate worship and the sacraments supplements the lessons on ordinances and worship. Claims here are original paraphrase of public themes, not quoted sermons.',
    },
    {
      ...SOURCE_MACARTHUR_SUP,
      note:
        'MacArthur’s published pastoral emphasis on qualified leadership, the seriousness of church discipline, and gospel urgency in mission supplements the leadership, discipline, and mission lessons. No sermon transcripts are reproduced.',
    },
  ],
  lessons: [
    {
      id: 'church-nature-purpose',
      order: 1,
      title: 'Nature and Purpose of the Church',
      estimatedMinutes: 18,
      objectives: [
        'Identify key biblical pictures of the church (body, bride, temple, people of God).',
        'Explain the Reformed distinction between the visible and invisible church.',
        'Summarize the church’s purpose: worship, edification, and witness.',
        'Connect the earliest church’s pattern in Acts 2:42 to ongoing church life today.',
      ],
      primaryPassages: [
        passage('matthew', 'Matthew', 16, 16, 18),
        passage('acts', 'Acts', 2, 42, 47),
        passage('1corinthians', '1 Corinthians', 12, 12, 27),
      ],
      supportingPassages: [
        passage('ephesians', 'Ephesians', 1, 22, 23),
        passage('1peter', '1 Peter', 2, 9, 10),
        passage('hebrews', 'Hebrews', 10, 24, 25),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Why this lesson matters',
          body:
            'Before discussing how the church should be led or what it should do, Scripture first tells us what the church is. The church is not a human club or a building; it is a people called out by God through the gospel, united to Christ and to one another. Getting this foundation right shapes everything that follows in this topic.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('matthew', 'Matthew', 16, 18, 18),
          note:
            'Interpretation: Jesus declares that He Himself will build His church, and that even the gates of death cannot prevail against it. The church’s existence and preservation rest on Christ’s own promise, not on human strategy.',
        },
        {
          kind: 'distinction',
          biblical:
            'Scripture describes the church with many pictures: a body with Christ as head (1 Cor 12; Eph 1:22–23), a holy people and royal priesthood (1 Pet 2:9–10), and a gathered community devoted to teaching, fellowship, the Table, and prayer (Acts 2:42–47).',
          interpretation:
            'Reformed theology distinguishes the visible church (the organized, gathered congregation of professing believers and their children, which includes some who are not truly regenerate) from the invisible church (the true elect people of God in every age, known fully only to Him). The church’s purpose flows from this: gathered worship, mutual edification, and witness to the world.',
          disagreement:
            'Christian traditions differ on how tightly to identify the visible institution with the true church—some (e.g., certain high-church traditions) stress institutional and sacramental continuity more strongly, while many low-church evangelical traditions stress the gathered, voluntary nature of local congregations. This curriculum teaches the Reformed visible/invisible framework while recognizing other traditions value institutional continuity differently.',
        },
        {
          kind: 'concept',
          term: 'Visible and invisible church',
          explanation:
            'The visible church is the organized congregation we can see and join; the invisible church is the true company of the redeemed, known with certainty only to God. Every member of the invisible church belongs to some expression of the visible church, but not everyone in the visible church is necessarily regenerate (cf. the wheat and tares, Matt 13:24–30).',
        },
        {
          kind: 'attribution',
          teacherId: 'grudem',
          work: 'Systematic Theology',
          note:
            'Grudem’s ecclesiology begins by defining the church and its purposes before moving to government and ordinances. This lesson follows that organizational sequence with original explanations.',
        },
        {
          kind: 'teaching',
          title: 'Purpose: worship, edification, witness',
          body:
            'Acts 2:42–47 shows a community devoted to apostolic teaching, fellowship, the breaking of bread, and prayer—and the result was both inward growth and outward favor with the watching world. The church exists to glorify God in worship, build up its members toward maturity, and bear witness to the gospel. These purposes belong together; neglecting any one distorts the whole.',
        },
      ],
      questions: appendOutlineBank('church-nature-purpose', L1_QUESTIONS, PART17_CHURCH_BY_LESSON),
      reflectionPrompts: [
        'Name one concrete way you can more fully participate in your church’s teaching, fellowship, Table, or prayer life this month.',
      ],
      furtherStudy: [
        'Read Ephesians 1:15–23 and list everything Paul says about Christ’s relationship to the church.',
        'Compare the pictures of the church in 1 Peter 2:9–10 and 1 Corinthians 12:12–27.',
      ],
    },
    {
      id: 'church-leadership',
      order: 2,
      title: 'Biblical Leadership: Elders and Deacons',
      estimatedMinutes: 18,
      objectives: [
        'Summarize the qualifications for elders/overseers and deacons from 1 Timothy 3 and Titus 1.',
        'Show that “elder,” “overseer,” and “shepherd” describe one office in the New Testament.',
        'Compare congregational, presbyterian, and episcopal polity fairly.',
        'Apply biblical teaching on honoring and praying for church leaders.',
      ],
      primaryPassages: [
        passage('1timothy', '1 Timothy', 3, 1, 13),
        passage('titus', 'Titus', 1, 5, 9),
        passage('acts', 'Acts', 20, 17, 28),
      ],
      supportingPassages: [
        passage('acts', 'Acts', 6, 1, 6),
        passage('1peter', '1 Peter', 5, 1, 4),
        passage('hebrews', 'Hebrews', 13, 17, 17),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Leadership for the church’s good',
          body:
            'The New Testament does not leave church leadership to chance or raw ambition. It gives specific, character-centered qualifications for those who will teach, shepherd, and serve. Healthy leadership protects the flock and models the gospel it proclaims.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('1timothy', '1 Timothy', 3, 1, 7),
          note:
            'Interpretation: Paul’s list for overseers is overwhelmingly about tested character—self-control, hospitality, a well-managed household, and soundness in teaching—rather than charisma, wealth, or ambition alone.',
        },
        {
          kind: 'concept',
          term: 'Elder / overseer / shepherd (pastor)',
          explanation:
            'These three New Testament terms describe the same office from different angles: “elder” (presbyteros) stresses maturity and dignity, “overseer” (episkopos) stresses oversight and care, and “shepherd” (poimen, the root of “pastor”) stresses feeding and protecting. Acts 20:17, 28 and Titus 1:5, 7 use these terms interchangeably for the same leaders.',
        },
        {
          kind: 'distinction',
          biblical:
            'The New Testament commends a plurality of qualified elders/overseers/shepherds who teach and lead (1 Tim 3:1–7; Titus 1:5–9; Acts 20:17, 28; 1 Pet 5:1–4), alongside deacons who serve practical and mercy needs (Acts 6:1–6; 1 Tim 3:8–13).',
          interpretation:
            'Reformed/Presbyterian polity typically holds to plural local eldership—often distinguishing teaching elders (pastors) and ruling elders—connected through regional assemblies (presbyteries or synods) for mutual accountability, with deacons devoted to mercy and practical ministry.',
          disagreement:
            'Congregationalist traditions affirm local-church autonomy under elder leadership but reject binding authority above the local congregation. Episcopal/Anglican traditions maintain a distinct office of bishop with oversight over multiple congregations and their presbyters. Other traditions structure leadership differently still. Scripture establishes the qualifications and core functions clearly; the precise structure connecting congregations to one another is argued from broader principles, and this curriculum presents the Reformed/Presbyterian preference for plural eldership without declaring other polities illegitimate.',
        },
        {
          kind: 'attribution',
          teacherId: 'grudem',
          work: 'Systematic Theology',
          note:
            'Grudem’s treatment of church government surveys congregational, presbyterian, and episcopal systems before stating a preference. This lesson follows that same fair-survey approach in original wording.',
        },
        {
          kind: 'teaching',
          title: 'Deacons: practical service',
          body:
            'Acts 6 shows the apostles appointing servants to address a real need—fair daily distribution to widows—so that the apostles could remain devoted to prayer and the ministry of the word. Deacons model Christ-like service, freeing elders to focus on teaching and shepherding, though both offices serve the same body under the same Lord.',
        },
        {
          kind: 'attribution',
          teacherId: 'macarthur',
          work: 'Published biblical teaching on pastoral ministry',
          note:
            'Supplementary pastoral emphasis: the seriousness of the qualifications in 1 Timothy 3 and Titus 1 underscores that church leadership is a weighty trust, not a reward for ambition. Paraphrased theme only—no sermon text reproduced.',
        },
      ],
      questions: appendOutlineBank('church-leadership', L2_QUESTIONS, PART17_CHURCH_BY_LESSON),
      reflectionPrompts: [
        'Write a short prayer for your church’s elders and deacons, naming a specific quality from 1 Timothy 3 you want God to strengthen in them.',
      ],
      furtherStudy: [
        'Read Titus 1:5–9 and 1 Timothy 3:1–13 side by side and note which qualifications overlap.',
        'Study Hebrews 13:17 and consider what it asks of both leaders and congregation members.',
      ],
      reviewFromLessonIds: ['church-nature-purpose'],
    },
    {
      id: 'church-ordinances',
      order: 3,
      title: 'Baptism and the Lord’s Supper',
      estimatedMinutes: 20,
      objectives: [
        'Explain the biblical institution and meaning of baptism and the Lord’s Supper.',
        'Compare credobaptist and paedobaptist convictions fairly, with their key texts.',
        'Compare memorial and spiritual-presence views of the Lord’s Supper fairly.',
        'Apply the ordinances’ call to remember Christ and renew covenant commitment.',
      ],
      primaryPassages: [
        passage('matthew', 'Matthew', 28, 18, 20),
        passage('1corinthians', '1 Corinthians', 11, 23, 26),
        passage('romans', 'Romans', 6, 3, 4),
      ],
      supportingPassages: [
        passage('colossians', 'Colossians', 2, 11, 12),
        passage('acts', 'Acts', 16, 31, 33),
        passage('1corinthians', '1 Corinthians', 10, 16, 17),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Visible words of the gospel',
          body:
            'Baptism and the Lord’s Supper are not bare symbols invented by church tradition, nor are they means of earning salvation by ritual. Reformed theology calls them ordinances (or sacraments): visible signs that God uses to proclaim and confirm the gospel to faith, instituted directly by Christ.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('matthew', 'Matthew', 28, 19, 19),
          note:
            'Interpretation: Christ commands baptism in the one name of the Father, Son, and Holy Spirit, tying the rite to entrance into triune covenant relationship and ongoing discipleship (v. 20).',
        },
        {
          kind: 'concept',
          term: 'Ordinance / sacrament',
          explanation:
            'A rite instituted by Christ Himself that visibly signifies and, by the Spirit, confirms gospel realities to those who receive it in faith. Reformed Christians use “ordinance” and “sacrament” in overlapping ways; both baptism and the Lord’s Supper fit this description.',
        },
        {
          kind: 'distinction',
          biblical:
            'The New Testament records believers being baptized upon professing faith (Acts 2:38; 16:31–33) and also records household baptisms without detailing every member’s profession. Colossians 2:11–12 connects baptism typologically to circumcision as a covenant sign.',
          interpretation:
            'Reformed paedobaptists, working from covenant theology, baptize believers and their children as the New Covenant counterpart to circumcision, seeing continuity between Old and New Covenant signs of inclusion in the covenant community. Reformed Baptists (credobaptists) baptize only professing believers, emphasizing the New Testament pattern of faith preceding baptism and the regenerate character of New Covenant church membership.',
          disagreement:
            'This is a long-standing, respectful intramural debate among confessionally Reformed Christians—paedobaptist traditions (e.g., those following the Westminster Standards) and credobaptist traditions (e.g., those following the Second London Baptist Confession) both affirm Scripture’s authority and the gospel. Abide does not require one view and presents both with their supporting texts.',
        },
        {
          kind: 'attribution',
          teacherId: 'grudem',
          work: 'Systematic Theology',
          note:
            'Grudem’s chapters on baptism survey both paedobaptist and credobaptist arguments before stating a position. This lesson follows that same fair-survey structure in original wording.',
        },
        {
          kind: 'distinction',
          biblical:
            'At the Last Supper, Jesus said, “This is my body… do this in remembrance of me” (Luke 22:19–20; 1 Cor 11:23–26), and Paul warns against eating and drinking “without discerning the body” (1 Cor 11:27–29). 1 Corinthians 10:16 speaks of a participation (communion) in Christ’s body and blood.',
          interpretation:
            'The Lord’s Supper is the commemoration and proclamation of Christ’s death until He comes, always preceded by solemn self-examination (1 Corinthians 11:28-32). The elements are only representative of Christ’s body and blood, yet participating is an actual communion with the risen Christ, who indwells every believer and is present with His people (1 Corinthians 10:16). The app teaches both remembrance/proclamation and real communion — not a new sacrifice, not a regenerating rite, and not a bare symbol with no spiritual significance.',
          disagreement:
            'Reformed, Lutheran, Roman Catholic, and memorialist (often Baptist and free-church) traditions differ on how Christ is present at the Table. This curriculum teaches the Reformed spiritual-presence emphasis as its organizing framework while fairly describing the memorial view many sincere believers also hold.',
        },
        {
          kind: 'attribution',
          teacherId: 'sproul',
          work: 'Published Ligonier teaching on worship and the sacraments',
          note:
            'Supplementary theme: approaching the Lord’s Table with reverence and self-examination reflects the holiness of the God who gives it. Original paraphrase of a widely known theme, not a quoted sermon.',
        },
      ],
      questions: appendOutlineBank('church-ordinances', L3_QUESTIONS, PART17_CHURCH_BY_LESSON),
      reflectionPrompts: [
        'Before your next observance of the Lord’s Supper, spend a few minutes examining your heart using 1 Corinthians 11:27–29 as a guide.',
      ],
      furtherStudy: [
        'Read Acts 2:38–41 and 16:31–33 and note what each passage emphasizes about baptism.',
        'Compare 1 Corinthians 10:16–17 and 11:23–26 on the meaning of the Lord’s Supper.',
      ],
      reviewFromLessonIds: ['church-nature-purpose', 'church-leadership'],
    },
    {
      id: 'church-worship-unity-discipline',
      order: 4,
      title: 'Worship, Unity, and Discipline',
      estimatedMinutes: 20,
      objectives: [
        'Describe biblical principles for worship that is Spirit-enabled and truth-shaped.',
        'Explain the Reformed “regulative principle” and the “normative principle” of worship fairly.',
        'Walk through the steps and restorative goal of church discipline in Matthew 18.',
        'Apply the unity believers share in Christ to practical relationships in the church.',
      ],
      primaryPassages: [
        passage('john', 'John', 4, 23, 24),
        passage('ephesians', 'Ephesians', 4, 1, 6),
        passage('matthew', 'Matthew', 18, 15, 17),
      ],
      supportingPassages: [
        passage('colossians', 'Colossians', 3, 16, 16),
        passage('1corinthians', '1 Corinthians', 5, 1, 13),
        passage('2corinthians', '2 Corinthians', 2, 5, 8),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Worship that pleases God',
          body:
            'Jesus tells the Samaritan woman that true worship is no longer tied to one location, but is worship “in spirit and truth”—enabled by the Holy Spirit and shaped by God’s revealed truth. Corporate worship is not primarily about personal preference; it is a response to who God is and what He has revealed.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('john', 'John', 4, 23, 24),
          note:
            'Interpretation: Worship “in spirit” points to Spirit-enabled sincerity of heart; worship “in truth” points to worship shaped by God’s revealed Word rather than human invention or mere ritual.',
        },
        {
          kind: 'distinction',
          biblical:
            'Scripture describes elements of corporate worship such as the public reading and preaching of Scripture, prayer, singing (Col 3:16), giving, and the ordinances (Acts 2:42; 1 Cor 14), while commanding that worship be done “decently and in order” (1 Cor 14:40).',
          interpretation:
            'Many Reformed churches historically hold the “regulative principle of worship”: corporate worship should include only what Scripture commands or clearly warrants. Other Reformed and evangelical churches hold a “normative principle”: worship may include what Scripture does not forbid, provided it is edifying and orderly.',
          disagreement:
            'This is a respected intramural debate within Reformed and broader Protestant worship practice—covering questions like musical instruments, exclusive psalm-singing versus hymns, and the use of liturgical forms. Abide teaches this as a matter of Christian freedom and conviction, not a test of orthodoxy.',
        },
        {
          kind: 'teaching',
          title: 'Unity in the body',
          body:
            'Ephesians 4 grounds unity not in uniformity of personality or preference, but in shared realities every believer possesses: one body, one Spirit, one hope, one Lord, one faith, one baptism, one God and Father of all. Diversity of gifts (Eph 4:11–13) serves this unity rather than threatening it.',
        },
        {
          kind: 'concept',
          term: 'Church discipline',
          explanation:
            'The process by which a church lovingly confronts persistent, unrepentant sin among its members, aiming always at repentance and restoration rather than punishment for its own sake. Matthew 18:15–17 outlines graduated steps: private conversation, then with one or two witnesses, then before the church.',
        },
        {
          kind: 'distinction',
          biblical:
            'Matthew 18:15–17 presents graduated steps for confronting sin, aiming at winning back a brother or sister; 1 Corinthians 5 commands removing an unrepentant, unrepentant sinner from fellowship for the church’s purity and his ultimate good; 2 Corinthians 2:5–8 celebrates restoring a repentant believer with reaffirmed love.',
          interpretation:
            'Reformed teaching treats faithful discipline as a mark of a healthy church, exercised humbly and always aiming at repentance, restoration, and the protection of the flock’s witness and purity—never at humiliation for its own sake.',
          disagreement:
            'Traditions differ on how formally discipline is structured and enforced—some use presbyterian church courts, others a congregational process, and some low-structure churches practice little formal discipline at all today. This lesson names that gap honestly without condemning individual believers caught in imperfect systems.',
        },
        {
          kind: 'attribution',
          teacherId: 'macarthur',
          work: 'Published biblical teaching on church purity and restoration',
          note:
            'Supplementary pastoral emphasis: taking sin seriously within the church protects both the sinning believer and the church’s witness, while restoration—not exposure—remains the goal. Paraphrased theme only.',
        },
      ],
      questions: appendOutlineBank('church-worship-unity-discipline', L4_QUESTIONS, PART17_CHURCH_BY_LESSON),
      reflectionPrompts: [
        'Where might God be calling you to pursue unity or loving honesty with a fellow believer this week?',
      ],
      furtherStudy: [
        'Read Ephesians 4:1–16 in full and list every “one” Paul uses to describe the church’s unity.',
        'Study 1 Corinthians 5 and 2 Corinthians 2:5–8 together as a single discipline-and-restoration case.',
      ],
      reviewFromLessonIds: ['church-nature-purpose', 'church-ordinances'],
    },
    {
      id: 'church-mission',
      order: 5,
      title: 'Mission and Witness',
      estimatedMinutes: 19,
      objectives: [
        'Explain the church’s mandate to make disciples locally and globally.',
        'Connect spiritual gifts to the mission and edification of the church.',
        'Describe the cessationist and continuationist positions on sign gifts fairly.',
        'Apply personal gifting and witness to everyday participation in mission.',
      ],
      primaryPassages: [
        passage('matthew', 'Matthew', 28, 18, 20),
        passage('acts', 'Acts', 1, 8, 8),
        passage('1corinthians', '1 Corinthians', 12, 4, 11),
      ],
      supportingPassages: [
        passage('romans', 'Romans', 12, 3, 8),
        passage('ephesians', 'Ephesians', 4, 11, 13),
        passage('1peter', '1 Peter', 4, 10, 11),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'A sent people',
          body:
            'The church does not exist for itself alone. Christ’s final instruction before His ascension was a commission: go, make disciples, baptize, and teach obedience to everything He commanded. The Spirit’s coming in Acts 1:8 empowers this mission outward, from Jerusalem to the ends of the earth.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('matthew', 'Matthew', 28, 19, 20),
          note:
            'Interpretation: The commission pairs initiation (baptizing) with ongoing formation (teaching obedience), showing that mission includes both evangelism and discipleship, not evangelism alone.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('acts', 'Acts', 1, 8, 8),
          note:
            'Interpretation: The Spirit’s power equips ordinary believers to be witnesses, moving outward in concentric circles from their immediate context to the wider world.',
        },
        {
          kind: 'teaching',
          title: 'Gifts for the mission',
          body:
            '1 Corinthians 12 and Romans 12 describe a variety of gifts distributed by the Spirit for the common good, not for self-promotion. Ephesians 4:11–13 shows gifted leaders equipping the saints for works of ministry, so the whole body—not merely a few specialists—carries out the church’s mission.',
        },
        {
          kind: 'distinction',
          biblical:
            '1 Corinthians 12 lists varied gifts—wisdom, knowledge, faith, healing, miracles, prophecy, tongues, and interpretation—given by one Spirit for the common good; Ephesians 4:11–13 lists apostles, prophets, evangelists, and pastor-teachers given “to equip the saints for the work of ministry.”',
          interpretation:
            'The TMS statement distinguishes miraculous gifts of revelation and healing, given temporarily to confirm the apostles’ message, from ministering gifts that equip believers to edify one another. No one possesses the gift of healing today, though God hears and answers the prayer of faith (James 5:13-16). The app teaches cessationism as the seminary’s position. Continuationists hold that some sign gifts may continue in some form, always subordinate to the completed canon.',
          disagreement:
            'Faithful evangelicals disagree on whether certain sign gifts continue. Both camps affirm the closed canon and that no new revelation carries Scripture’s authority. Abide teaches cessationism and describes continuationism fairly without caricature.',
        },
        {
          kind: 'attribution',
          teacherId: 'grudem',
          work: 'Systematic Theology',
          note:
            'Grudem’s chapters on spiritual gifts survey cessationist and continuationist arguments as a dedicated systematic locus. This lesson follows that same fair-survey structure in original wording.',
        },
        {
          kind: 'attribution',
          teacherId: 'macarthur',
          work: 'Published biblical teaching on the church’s mission',
          note:
            'Supplementary pastoral emphasis: urgency in evangelism and careful discernment about claimed spiritual experiences both flow from a high view of Scripture’s sufficiency. Paraphrased theme only.',
        },
        {
          kind: 'teaching',
          title: 'Mission in ordinary life',
          body:
            'For most believers, mission looks like faithful witness at work, mercy to neighbors, hospitality, prayer, financial support of gospel work, and using whatever gift God has given to build up the church and reach the lost. Every member has a part to play; none is a spectator.',
        },
      ],
      questions: appendOutlineBank('church-mission', L5_QUESTIONS, PART17_CHURCH_BY_LESSON),
      reflectionPrompts: [
        'Name one practical way you will use your gifts or witness for the sake of the church’s mission this month.',
      ],
      furtherStudy: [
        'Read Romans 12:3–8 and 1 Peter 4:10–11 and compare their tone toward using spiritual gifts.',
        'Study Acts 13:1–3 as an example of a local church sending out gifted workers for mission.',
      ],
      reviewFromLessonIds: ['church-nature-purpose', 'church-worship-unity-discipline'],
    },
  ],
}
