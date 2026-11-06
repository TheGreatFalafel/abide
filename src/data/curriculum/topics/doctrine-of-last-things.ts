import type { QuizQuestion } from '../../planQuizzes'
import type { CurriculumTopic } from '../types'
import { passage, mc, open, SOURCE_MACARTHUR_SUP, SOURCE_SPROUL_SUP } from './_helpers'

const L1: QuizQuestion[] = [
  mc('lot-1-b1', 'What does Paul say about being “away from the body”?', ['We cease to exist', 'We are at home with the Lord', 'We return as spirits to earth', 'We sleep unconsciously'], 1, '2 Corinthians 5:8.', 'beginner'),
  mc('lot-1-b2', 'What did Jesus promise the repentant thief?', ['Paradise that day', 'Purgatory first', 'Rest until the resurrection', 'Nothing'], 0, 'Luke 23:43.', 'beginner'),
  mc('lot-1-i1', 'What is the “intermediate state”?', ['The time between a person’s death and the resurrection', 'The time between conversion and baptism', 'The Tribulation', 'The Millennium'], 0, undefined, 'intermediate'),
  mc('lot-1-i2', 'Which passage shows the unsaved conscious after death?', ['Luke 16:19-31', 'John 3:16', 'Genesis 1', 'Psalm 23'], 0, undefined, 'intermediate'),
  mc('lot-1-a1', 'Which verse most directly refutes reincarnation?', ['Hebrews 9:27', 'Romans 8:28', 'John 1:1', 'Isaiah 53:5'], 0, 'Appointed for man to die once.', 'advanced'),
  mc('lot-1-a2', 'Why do evangelicals reject purgatory?', ['No Scripture teaches it, and Christ’s sacrifice fully cleanses (Heb 10:14), and believers are immediately with Him (Phil 1:23)', 'Because it is too old', 'Because the apostles condemned it by name', 'Because it contradicts the Septuagint'], 0, undefined, 'advanced'),
  open('lot-1-open', 'How does the hope of being “at home with the Lord” shape how you think about death?'),
]

const L2: QuizQuestion[] = [
  mc('lot-2-b1', 'What does Acts 1:11 promise?', ['Jesus will return the same way He ascended', 'Jesus will not return', 'Jesus will return as an angel', 'Jesus will return secretly'], 0, undefined, 'beginner'),
  mc('lot-2-b2', 'What will happen to believers at the rapture?', ['They will be caught up to meet the Lord', 'They will go through the Tribulation', 'They will die', 'They will be judged for salvation'], 0, undefined, 'beginner'),
  mc('lot-2-i1', 'The Latin word from which “rapture” comes translates which Greek word?', ['harpazo (caught up)', 'agape', 'parousia', 'ekklesia'], 0, undefined, 'intermediate'),
  mc('lot-2-i2', 'Which is true of the rapture in the pretribulational view?', ['It is imminent, with no preceding signs', 'It follows the Tribulation', 'It happens at Armageddon', 'It is the same event as the Second Coming'], 0, undefined, 'intermediate'),
  mc('lot-2-a1', 'Which verse promises the church deliverance from wrath?', ['1 Thessalonians 5:9', 'Genesis 3:15', 'Psalm 1:1', 'Jude 3'], 0, undefined, 'advanced'),
  mc('lot-2-a2', 'Which view holds that the church will be raptured at the end of the Tribulation?', ['Posttribulationism', 'Pretribulationism', 'Pre-wrath', 'Preterism'], 0, undefined, 'advanced'),
  open('lot-2-open', 'How does the “blessed hope” (Titus 2:13) shape watchfulness in your ordinary week?'),
]

const L3: QuizQuestion[] = [
  mc('lot-3-b1', 'How long is the Tribulation in the pretribulational view?', ['7 years', '40 years', '1,000 years', '3 days'], 0, undefined, 'beginner'),
  mc('lot-3-b2', 'Which book describes the seals, trumpets, and bowls?', ['Revelation', 'Romans', 'Genesis', 'Hebrews'], 0, undefined, 'beginner'),
  mc('lot-3-i1', 'Who is the “man of lawlessness”?', ['The Antichrist (2 Thess 2)', 'Judas', 'Nero only', 'Pontius Pilate'], 0, undefined, 'intermediate'),
  mc('lot-3-i2', 'What are the 144,000 in Revelation 7 (futurist reading)?', ['Sealed servants from the tribes of Israel', 'All Christians', 'The angels', 'Martyrs only'], 0, undefined, 'intermediate'),
  mc('lot-3-a1', 'In Daniel 9, how many years are in the seventy weeks?', ['490', '70', '1,000', '144'], 0, 'Seventy sevens of years.', 'advanced'),
  mc('lot-3-a2', 'Which view says most of Revelation 6–19 was fulfilled in the first century?', ['Preterism', 'Futurism', 'Premillennialism', 'Dispensationalism'], 0, undefined, 'advanced'),
  open('lot-3-open', 'How should God’s coming judgment move you toward holiness and witness without fear-mongering?'),
]

const L4: QuizQuestion[] = [
  mc('lot-4-b1', 'How long will Christ reign on the earth in Revelation 20?', ['1,000 years', '7 years', '40 years', '12 years'], 0, undefined, 'beginner'),
  mc('lot-4-b2', 'Who is bound for the 1,000 years?', ['Satan', 'The Antichrist', 'Death', 'The false prophet'], 0, 'Revelation 20:2.', 'beginner'),
  mc('lot-4-i1', 'Which view says Christ returns before the Millennium?', ['Premillennialism', 'Amillennialism', 'Postmillennialism', 'Preterism'], 0, undefined, 'intermediate'),
  mc('lot-4-i2', 'Amillennialism teaches that the “thousand years” is:', ['The present church age, symbolically', 'A literal future reign', 'The Tribulation', 'The eternal state'], 0, undefined, 'intermediate'),
  mc('lot-4-a1', 'Which Old Testament covenants support a future literal kingdom for Israel?', ['Abrahamic, Davidic, and New covenants', 'Only the Mosaic', 'Only the Noahic', 'None'], 0, undefined, 'advanced'),
  mc('lot-4-a2', 'What does Revelation 20:7-10 show?', ['Even in a perfect environment, unregenerate hearts rebel when Satan is released', 'The Millennium never happens', 'The church is destroyed', 'The Tribulation ends'], 0, undefined, 'advanced'),
  open('lot-4-open', 'How does a future kingdom for Israel and the nations enlarge your view of God’s faithfulness?'),
]

const L5: QuizQuestion[] = [
  mc('lot-5-b1', 'What does Revelation 21 describe?', ['A new heaven and new earth', 'The end of time with nothing after', 'A temple built by man', 'The Millennium'], 0, undefined, 'beginner'),
  mc('lot-5-b2', 'Where is the final judgment of unbelievers?', ['The Great White Throne', 'Mount Sinai', 'The Mount of Olives', 'The Areopagus'], 0, 'Revelation 20:11.', 'beginner'),
  mc('lot-5-i1', 'What is the judgment seat of Christ for?', ['Evaluating believers’ works for reward', 'Deciding whether believers are saved', 'Judging nations', 'Judging angels'], 0, undefined, 'intermediate'),
  mc('lot-5-i2', 'Which verse speaks of the “resurrection of life” and the “resurrection of judgment”?', ['John 5:28-29', 'Romans 8:1', 'Psalm 23', 'Genesis 2:7'], 0, undefined, 'intermediate'),
  mc('lot-5-a1', 'Why does Matthew 25:46 count against annihilationism?', ['“Eternal” modifies both life and punishment, in parallel', 'It says nothing about punishment', 'It was added later', 'It is poetry'], 0, undefined, 'advanced'),
  mc('lot-5-a2', 'Which statement best fits universalism’s problem with Scripture?', ['It contradicts passages like Revelation 20:15 and John 3:36 that speak of final separation', 'It agrees with Matthew 25:46', 'It is taught by the apostles', 'It is taught by the creeds'], 0, undefined, 'advanced'),
  open('lot-5-open', 'How should the reality of judgment and the hope of the new creation shape your evangelism and endurance?'),
]

export const DOCTRINE_OF_LAST_THINGS: CurriculumTopic = {
  id: 'doctrine-of-last-things',
  title: 'The Doctrine of Last Things',
  description:
    'Personal and general eschatology from a pretribulational, premillennial reading aligned with The Master’s Seminary: death and the intermediate state, the rapture and Second Coming, the Tribulation, the Millennium, and the eternal state — with other views described fairly.',
  objectives: [
    'Explain death and the intermediate state for believers and unbelievers.',
    'Distinguish the rapture from the Second Coming and state why this curriculum teaches pretribulationism.',
    'Outline Daniel’s seventieth week and major Tribulation figures.',
    'Compare millennial views and teach a literal future Millennium with a future for national Israel.',
    'Distinguish the judgment seat of Christ from the Great White Throne and affirm eternal conscious punishment and the new creation.',
  ],
  estimatedMinutes: 90,
  prerequisites: ['doctrine-of-salvation'],
  framework: 'reformed',
  contentStatus: 'full',
  version: 3,
  sources: [
    {
      ...SOURCE_MACARTHUR_SUP,
      teacher: 'John MacArthur / The Master’s Seminary',
      work: 'Biblical Doctrine; Because the Time Is Near; The Second Coming (themes)',
      role: 'organizational',
      note:
        'Organizational baseline for pretribulational premillennial eschatology taught in this topic. Paraphrase only.',
    },
    {
      teacherId: 'macarthur',
      teacher: 'J. Dwight Pentecost / John Walvoord (TMS-aligned tradition)',
      work: 'Things to Come; The Millennial Kingdom; The Rapture Question (themes)',
      role: 'supplementary',
      note:
        'Classic dispensational frameworks for Tribulation, Millennium, and rapture distinctions — paraphrased organizationally, not quoted.',
    },
    {
      ...SOURCE_SPROUL_SUP,
      work: 'The Last Days According to Jesus (other-view description)',
      note:
        'Used only to describe partial-preterist / other readings fairly — not taught as the app’s position.',
    },
  ],
  lessons: [
    {
      id: 'last-death-intermediate',
      order: 1,
      title: 'Death and the Intermediate State',
      estimatedMinutes: 18,
      objectives: {
        beginner: ['Explain what the Bible says happens to a believer and an unbeliever at death.'],
        intermediate: ['Distinguish the intermediate state from the final resurrection.'],
        advanced: ['Respond to soul sleep, purgatory, and reincarnation from Scripture.'],
      },
      primaryPassages: [
        passage('2corinthians', '2 Corinthians', 5, 1, 10),
        passage('philippians', 'Philippians', 1, 21, 24),
        passage('luke', 'Luke', 16, 19, 31),
      ],
      supportingPassages: [
        passage('romans', 'Romans', 5, 12, 12),
        passage('hebrews', 'Hebrews', 9, 27, 27),
        passage('luke', 'Luke', 23, 43, 43),
        passage('revelation', 'Revelation', 6, 9, 11),
      ],
      content: [
        {
          kind: 'teaching',
          level: 'all',
          title: 'Death and hope',
          body:
            'Death entered through sin (Romans 5:12; 6:23), and every person dies once and then faces judgment (Hebrews 9:27). For the believer, death is not loss but gain: to be absent from the body is to be at home with the Lord (2 Corinthians 5:8; Philippians 1:21-23). Jesus told the repentant thief, “today you will be with me in Paradise” (Luke 23:43). For the unbeliever, Luke 16:19-31 shows conscious torment after death while awaiting final judgment (Revelation 20:13-15). The believer’s body waits until the resurrection (1 Thessalonians 4:13-18).',
        },
        {
          kind: 'teaching',
          level: 'intermediate',
          title: 'Go deeper: soul sleep and purgatory',
          body:
            'Soul sleep claims the dead are unconscious; Luke 16, Luke 23:43, Philippians 1:23, and Revelation 6:9-11 teach conscious existence. Purgatory (formalized in medieval Roman Catholic teaching) is rejected: no biblical passage teaches it, and Christ’s one sacrifice fully cleanses (Hebrews 10:14). Reincarnation is refuted by Hebrews 9:27.',
        },
        {
          kind: 'teaching',
          level: 'advanced',
          title: 'Go deeper: Paradise and Hades',
          body:
            'Before the cross, believers’ souls are pictured in comfort (“Abraham’s side,” Luke 16:22). Christ’s work brings believers into God’s presence. 2 Corinthians 12:2-4 uses “Paradise” for the third heaven. Intermediate state is real but not final — resurrection completes hope.',
        },
        {
          kind: 'distinction',
          biblical:
            'Scripture teaches death as judgment entering through sin, immediate presence with Christ for believers, conscious existence after death, and future bodily resurrection.',
          interpretation:
            'The seminary teaches that the souls of the redeemed are with Christ in the intermediate heaven, that the souls of the unsaved are under punishment in the intermediate hell until the second resurrection, and that the first resurrection of believers begins at the rapture (Luke 16:19-26; 2 Corinthians 5:8; 1 Thessalonians 4:13-17; Revelation 20:4-6, 13-15). This curriculum rejects soul sleep, purgatory, reincarnation, and annihilation of the intermediate person.',
          disagreement:
            'Some Christians teach soul sleep; Roman Catholicism teaches purgatory. Those views are described and answered from Scripture.',
        },
      ],
      questions: L1,
      reflectionPrompts: [
        'How does the hope of being “at home with the Lord” shape how you think about your own death or that of a believing loved one?',
      ],
      furtherStudy: ['2 Corinthians 5; Philippians 1; Luke 16; Hebrews 9:27.'],
    },
    {
      id: 'last-rapture-return',
      order: 2,
      title: 'The Rapture and the Second Coming',
      estimatedMinutes: 18,
      objectives: {
        beginner: ['Know that Jesus will come again and that believers will be taken to be with Him.'],
        intermediate: ['Distinguish the rapture from the Second Coming.'],
        advanced: ['Defend the pretribulational view from Scripture and describe alternatives fairly.'],
      },
      primaryPassages: [
        passage('1thessalonians', '1 Thessalonians', 4, 13, 18),
        passage('john', 'John', 14, 1, 3),
        passage('acts', 'Acts', 1, 9, 11),
      ],
      supportingPassages: [
        passage('1corinthians', '1 Corinthians', 15, 51, 58),
        passage('titus', 'Titus', 2, 13, 13),
        passage('revelation', 'Revelation', 3, 10, 10),
        passage('revelation', 'Revelation', 19, 11, 16),
        passage('zechariah', 'Zechariah', 14, 3, 4),
      ],
      content: [
        {
          kind: 'teaching',
          level: 'all',
          title: 'Caught up and coming again',
          body:
            'Jesus promised to come and take His own to the Father’s house (John 14:1-3). Paul describes the Lord descending, the dead in Christ rising first, and living believers “caught up” (Greek harpazo) to meet the Lord in the air (1 Thessalonians 4:13-18; 1 Corinthians 15:51-52). This is the blessed hope (Titus 2:13). The Second Coming is distinct: Christ returns visibly to the earth with His saints to judge enemies, rescue Israel, and establish His kingdom (Matthew 24:29-31; Zechariah 14; Revelation 19; Acts 1:11).',
        },
        {
          kind: 'teaching',
          level: 'intermediate',
          title: 'Why pretribulational (app position)',
          body:
            'The church is promised deliverance from coming wrath (1 Thessalonians 1:10; 5:9; Revelation 3:10). The Tribulation is “the time of Jacob’s trouble” (Jeremiah 30:7) and concerns Israel (Daniel 9:24). The rapture is imminent — no sign must precede it. Rapture: Christ comes for His saints, in the air, unseen by the world as a public spectacle of judgment. Second Coming: Christ comes with His saints to the earth, every eye sees, preceded by signs.',
        },
        {
          kind: 'teaching',
          level: 'advanced',
          title: 'Go deeper: other timing views',
          body:
            'Posttribulationism (church through the Tribulation; e.g. Ladd), midtribulationism, and pre-wrath are described as other views. Amillennialists and many postmillennialists hold one general return. Pretribulationism became widespread in the modern era through teachers such as Darby and Scofield; the doctrine is taught here from the text’s distinctions and promises, not from novelty claims.',
        },
        {
          kind: 'distinction',
          biblical:
            'Scripture promises Christ will receive His people, the dead in Christ will rise, living believers will be caught up, and Christ will return visibly to the earth as He ascended.',
          interpretation:
            'This curriculum teaches a pretribulational rapture distinct from the Second Coming to earth, with imminence and deliverance from wrath for the church.',
          disagreement:
            'Posttrib, midtrib, pre-wrath, and single-return schemes are described fairly as other evangelical views.',
        },
      ],
      questions: L2,
      reflectionPrompts: [
        'How does the blessed hope shape watchfulness without date-setting?',
      ],
      furtherStudy: ['1 Thessalonians 4–5; John 14:1-3; Titus 2:13; Revelation 19.'],
      reviewFromLessonIds: ['last-death-intermediate'],
    },
    {
      id: 'last-tribulation',
      order: 3,
      title: 'The Tribulation and Daniel’s Seventieth Week',
      estimatedMinutes: 18,
      objectives: {
        beginner: ['Explain that a period of great judgment is coming on the earth.'],
        intermediate: ['Outline the seven-year Tribulation and major figures.'],
        advanced: ['Interpret Daniel 9:24-27 in a futurist reading and respond to preterism.'],
      },
      primaryPassages: [
        passage('daniel', 'Daniel', 9, 24, 27),
        passage('matthew', 'Matthew', 24, 4, 31),
        passage('2thessalonians', '2 Thessalonians', 2, 1, 12),
      ],
      supportingPassages: [
        passage('revelation', 'Revelation', 6, 1, 17),
        passage('revelation', 'Revelation', 13, 1, 18),
        passage('jeremiah', 'Jeremiah', 30, 7, 7),
        passage('romans', 'Romans', 11, 25, 27),
      ],
      content: [
        {
          kind: 'teaching',
          level: 'all',
          title: 'Daniel’s seventieth week',
          body:
            'Daniel 9:24-27 gives God’s timeline for Israel: seventy “weeks” (sevens) of years — 490 years. Sixty-nine weeks lead to Messiah the Prince; Messiah is “cut off.” The seventieth week is yet future: seven years beginning when the coming prince confirms a covenant with Israel. Midway comes the abomination of desolation (Matthew 24:15; 2 Thessalonians 2). Revelation 6–19 describes seals, trumpets, and bowls. Key figures include the Antichrist, the false prophet, two witnesses, and 144,000 sealed Jewish servants. The period ends with Armageddon and Christ’s return.',
        },
        {
          kind: 'teaching',
          level: 'intermediate',
          title: 'Go deeper: hermeneutics',
          body:
            'Literal (grammatical-historical) interpretation applies to prophecy. First-coming prophecies were fulfilled literally, which supports literal fulfillment of those yet future. Pretribulationists place a gap (the church age) between the sixty-ninth and seventieth weeks because Daniel 9 concerns Israel and the church was a mystery (Ephesians 3:1-6).',
        },
        {
          kind: 'teaching',
          level: 'advanced',
          title: 'Go deeper: other schools',
          body:
            'Preterism reads most of Revelation and Matthew 24 as fulfilled in AD 70 or the fall of Rome (Sproul held a partial form — described, not taught). Historicism traces church history; idealism sees timeless conflict. This curriculum teaches futurism.',
        },
        {
          kind: 'distinction',
          biblical:
            'Daniel’s seventy weeks, Jesus’ Olivet Discourse, Paul’s man of lawlessness, and Revelation’s judgments describe future tribulation and Antichrist figures in a futurist reading.',
          interpretation:
            'The app teaches a future seven-year Tribulation as Daniel’s seventieth week, centered on Israel, after the church’s rapture.',
          disagreement:
            'Preterist, historicist, and idealist readings are named so learners can recognize them.',
        },
      ],
      questions: L3,
      reflectionPrompts: [
        'How should coming judgment move you toward holiness and witness without fear-mongering?',
      ],
      furtherStudy: ['Daniel 9; Matthew 24; 2 Thessalonians 2; Revelation 6–19.'],
      reviewFromLessonIds: ['last-rapture-return'],
    },
    {
      id: 'last-millennium',
      order: 4,
      title: 'The Millennial Kingdom',
      estimatedMinutes: 18,
      objectives: {
        beginner: ['Know that Christ will reign on earth for a thousand years.'],
        intermediate: ['Compare premillennialism, amillennialism, and postmillennialism.'],
        advanced: ['Explain why a literal Millennium is tied to the covenants and answer other views.'],
      },
      primaryPassages: [
        passage('revelation', 'Revelation', 20, 1, 10),
        passage('isaiah', 'Isaiah', 11, 1, 10),
        passage('romans', 'Romans', 11, 25, 29),
      ],
      supportingPassages: [
        passage('isaiah', 'Isaiah', 2, 2, 4),
        passage('jeremiah', 'Jeremiah', 31, 31, 37),
        passage('luke', 'Luke', 1, 32, 33),
        passage('zechariah', 'Zechariah', 14, 9, 9),
      ],
      content: [
        {
          kind: 'teaching',
          level: 'all',
          title: 'A thousand years',
          body:
            'After the Tribulation Christ returns, binds Satan, and reigns over the earth for 1,000 years (Revelation 20:1-6). The Old Testament describes peace among nations, renewed creation, and the Son of David on David’s throne. The seminary teaches that Israel has been temporarily set aside and will be awakened through repentance to enter the land of blessing (Matthew 21:43; Romans 11:25-29), and that the kingdom fulfills God’s promise to Israel (Isaiah 65:17-25; Ezekiel 37:21-28; Zechariah 8:1-17). Paul affirms that “all Israel will be saved” (Romans 11:25-27). At the end Satan is released and many still rebel — showing sin is not merely environmental.',
        },
        {
          kind: 'teaching',
          level: 'intermediate',
          title: 'Go deeper: three millennial views',
          body:
            'Premillennialism: Christ returns before the Millennium. Dispensational premillennialism (this curriculum) distinguishes Israel and the church and is typically pretribulational. Historic premillennialism is often posttribulational. Amillennialism treats the thousand years as the present age symbolically. Postmillennialism expects gospel triumph before Christ returns. Alternatives are described; premillennial futurism is taught.',
        },
        {
          kind: 'teaching',
          level: 'advanced',
          title: 'Go deeper: Israel and the church',
          body:
            'Replacement theology (supersessionism) holds that the church permanently replaces Israel. This curriculum rejects that on the basis of Romans 9–11 and the unconditional covenants. Amillennial readings of Revelation 20 are answered by noting Satan’s present activity (1 Peter 5:8) and the sequential flow of Revelation 19–20 in a futurist reading.',
        },
        {
          kind: 'distinction',
          biblical:
            'Revelation 20 speaks of a thousand-year reign with Satan bound; the prophets promise a Davidic kingdom and restoration; Romans 11 speaks of Israel’s future salvation.',
          interpretation:
            'The app teaches a literal future Millennium after Christ’s return, with a future for national Israel distinct from the church.',
          disagreement:
            'Amillennial and postmillennial Christians read Revelation 20 differently; those views are described fairly.',
        },
      ],
      questions: L4,
      reflectionPrompts: [
        'How does a future kingdom enlarge your confidence in God’s faithfulness to His promises?',
      ],
      furtherStudy: ['Revelation 20; Isaiah 11; Romans 11; Jeremiah 31.'],
      reviewFromLessonIds: ['last-tribulation'],
    },
    {
      id: 'last-resurrection-judgment',
      order: 5,
      title: 'Resurrection, Judgment, and the Eternal State',
      estimatedMinutes: 18,
      objectives: {
        beginner: ['Know that all people will be raised and judged, and that believers will live with God forever.'],
        intermediate: ['Distinguish the judgment seat of Christ from the Great White Throne.'],
        advanced: ['Defend eternal conscious punishment against annihilationism and universalism.'],
      },
      primaryPassages: [
        passage('revelation', 'Revelation', 20, 11, 15),
        passage('revelation', 'Revelation', 21, 1, 8),
        passage('john', 'John', 5, 28, 29),
      ],
      supportingPassages: [
        passage('2corinthians', '2 Corinthians', 5, 10, 10),
        passage('1corinthians', '1 Corinthians', 3, 11, 15),
        passage('matthew', 'Matthew', 25, 31, 46),
        passage('2peter', '2 Peter', 3, 10, 13),
      ],
      content: [
        {
          kind: 'teaching',
          level: 'all',
          title: 'Two resurrections and two judgments',
          body:
            'Scripture teaches resurrection of life and of judgment (John 5:28-29; Daniel 12:2; Revelation 20). For believers, the judgment seat of Christ evaluates works for reward, not salvation (Romans 14:10; 2 Corinthians 5:10; 1 Corinthians 3:11-15). For unbelievers, the Great White Throne judges according to works, and those not in the book of life are cast into the lake of fire. Jesus taught eternal conscious punishment (Matthew 25:46; Revelation 14:11; 20:10). The final state is a new heaven and new earth (Revelation 21–22).',
        },
        {
          kind: 'teaching',
          level: 'intermediate',
          title: 'Go deeper: Millennium vs eternal state',
          body:
            'The Millennium is a mediatorial kingdom on this earth. The eternal state begins after the Great White Throne with the new heaven and earth (Revelation 21:1). Degrees of reward and punishment appear in Matthew 11:22-24 and Luke 12:47-48.',
        },
        {
          kind: 'teaching',
          level: 'advanced',
          title: 'Go deeper: annihilationism and universalism',
          body:
            'Annihilationism claims the wicked are destroyed; Matthew 25:46 uses the same word “eternal” for life and punishment, and Revelation speaks of torment “forever.” Universalism (all finally saved) contradicts Revelation 20:15 and John 3:36. This curriculum teaches eternal conscious punishment. Knowing the fear of the Lord, we persuade others (2 Corinthians 5:11).',
        },
        {
          kind: 'distinction',
          biblical:
            'Scripture teaches resurrection, reward for believers, final judgment for the lost, eternal punishment, and a new creation where God dwells with His people.',
          interpretation:
            'The app teaches the bema for believers, the Great White Throne for unbelievers, eternal conscious punishment, and the new heaven and earth as the final hope.',
          disagreement:
            'Annihilationism and universalism are described and rejected from the texts above.',
        },
      ],
      questions: L5,
      reflectionPrompts: [
        'How should judgment and the new creation shape your evangelism and endurance?',
      ],
      furtherStudy: ['Revelation 20–22; 1 Corinthians 15; 2 Corinthians 5; Matthew 25.'],
      reviewFromLessonIds: ['last-death-intermediate', 'last-millennium'],
    },
  ],
}
