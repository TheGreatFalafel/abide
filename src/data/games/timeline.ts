import type { GameDifficulty } from '../../games/types'

export type TimelineEvent = {
  id: string
  label: string
  /** Lower = earlier in biblical narrative order used for this quiz */
  order: number
  reference: string
  explanation: string
}

export type TimelineSet = {
  id: string
  title: string
  difficulty: GameDifficulty
  events: TimelineEvent[]
}

/**
 * Curated sets of biblical events in RELATIVE narrative order.
 * These orderings reflect the sequence Scripture itself presents (Genesis → Revelation,
 * or within a book/section), not invented absolute (BC/AD) dates. Where biblical
 * chronology is genuinely disputed among careful readers (e.g. the date of the Exodus,
 * the overlap of judges, or the timing of end-times events), sets either avoid the
 * dispute entirely or use only the order Scripture itself makes explicit.
 */
export const TIMELINE_SETS: TimelineSet[] = [
  {
    id: 'tl-beginnings',
    title: 'Beginnings',
    difficulty: 'beginner',
    events: [
      {
        id: 'e-creation',
        label: 'God creates the heavens and the earth',
        order: 1,
        reference: 'Genesis 1',
        explanation: 'Creation opens the biblical story.',
      },
      {
        id: 'e-fall',
        label: 'Adam and Eve disobey in Eden',
        order: 2,
        reference: 'Genesis 3',
        explanation: 'The Fall follows creation in Genesis.',
      },
      {
        id: 'e-flood',
        label: 'Noah and the Flood',
        order: 3,
        reference: 'Genesis 6–9',
        explanation: 'The Flood narrative comes after the early genealogies.',
      },
      {
        id: 'e-abraham',
        label: 'God calls Abraham',
        order: 4,
        reference: 'Genesis 12',
        explanation: 'Abraham’s call begins the patriarchal narrative after Babel.',
      },
    ],
  },
  {
    id: 'tl-patriarchs',
    title: 'The Patriarchs',
    difficulty: 'beginner',
    events: [
      {
        id: 'e-pat-call',
        label: 'God calls Abram to leave Haran',
        order: 1,
        reference: 'Genesis 12:1–9',
        explanation: 'Abram’s journey to Canaan begins the patriarchal story.',
      },
      {
        id: 'e-pat-isaac',
        label: 'Isaac is born to Abraham and Sarah',
        order: 2,
        reference: 'Genesis 21:1–7',
        explanation: 'Isaac is the promised son, born after Abraham’s call.',
      },
      {
        id: 'e-pat-jacob',
        label: 'Jacob receives Isaac’s blessing',
        order: 3,
        reference: 'Genesis 27',
        explanation: 'Jacob succeeds Isaac in the next generation of the promise.',
      },
      {
        id: 'e-pat-joseph-sold',
        label: 'Joseph is sold into slavery by his brothers',
        order: 4,
        reference: 'Genesis 37',
        explanation: 'Joseph, Jacob’s son, is sold into Egypt in the next generation.',
      },
      {
        id: 'e-pat-joseph-ruler',
        label: 'Joseph rises to rule in Egypt and saves his family',
        order: 5,
        reference: 'Genesis 41–45',
        explanation: 'Joseph’s rise follows his years of slavery and imprisonment.',
      },
    ],
  },
  {
    id: 'tl-jesus-birth',
    title: 'Jesus’ Birth and Childhood',
    difficulty: 'beginner',
    events: [
      {
        id: 'e-birth-announce',
        label: 'Gabriel announces Jesus’ birth to Mary',
        order: 1,
        reference: 'Luke 1:26–38',
        explanation: 'The angel’s announcement to Mary precedes Jesus’ birth.',
      },
      {
        id: 'e-birth-bethlehem',
        label: 'Jesus is born in Bethlehem',
        order: 2,
        reference: 'Luke 2:1–7',
        explanation: 'The birth follows the announcement to Mary.',
      },
      {
        id: 'e-birth-visitors',
        label: 'Shepherds and wise men visit the newborn Jesus',
        order: 3,
        reference: 'Luke 2:8–20; Matthew 2:1–12',
        explanation: 'Visitors come to worship the child after His birth.',
      },
      {
        id: 'e-birth-egypt',
        label: 'Joseph takes the family to Egypt to escape Herod',
        order: 4,
        reference: 'Matthew 2:13–15',
        explanation: 'The flight to Egypt follows the visit of the wise men.',
      },
      {
        id: 'e-birth-temple',
        label: 'The boy Jesus is found teaching in the temple',
        order: 5,
        reference: 'Luke 2:41–52',
        explanation: 'This episode is set when Jesus is twelve, after the family’s return from Egypt.',
      },
    ],
  },
  {
    id: 'tl-passion-week',
    title: 'Jesus’ Final Week',
    difficulty: 'beginner',
    events: [
      {
        id: 'e-pw-entry',
        label: 'Jesus enters Jerusalem on a donkey',
        order: 1,
        reference: 'Matthew 21:1–11',
        explanation: 'The triumphal entry opens the final week before the cross.',
      },
      {
        id: 'e-pw-supper',
        label: 'Jesus shares the Last Supper with His disciples',
        order: 2,
        reference: 'Matthew 26:17–30',
        explanation: 'The Last Supper takes place the night before Jesus’ arrest.',
      },
      {
        id: 'e-pw-arrest',
        label: 'Jesus is arrested and put on trial',
        order: 3,
        reference: 'Matthew 26:47–27:26',
        explanation: 'The arrest and trials follow the Last Supper.',
      },
      {
        id: 'e-pw-cross',
        label: 'Jesus is crucified at Golgotha',
        order: 4,
        reference: 'Matthew 27:32–56',
        explanation: 'The crucifixion follows the trial before Pilate.',
      },
      {
        id: 'e-pw-resurrection',
        label: 'Jesus rises from the dead on the third day',
        order: 5,
        reference: 'Matthew 28:1–10',
        explanation: 'The resurrection follows the crucifixion and burial.',
      },
      {
        id: 'e-pw-ascension',
        label: 'Jesus ascends to heaven',
        order: 6,
        reference: 'Acts 1:9–11',
        explanation: 'The ascension follows Jesus’ post-resurrection appearances.',
      },
    ],
  },
  {
    id: 'tl-judges-kings',
    title: 'Judges and Early Kings',
    difficulty: 'beginner',
    events: [
      {
        id: 'e-jk-joshua',
        label: 'Joshua leads Israel into the Promised Land',
        order: 1,
        reference: 'Joshua 1; 3',
        explanation: 'Joshua’s leadership begins after Moses’ death, entering Canaan.',
      },
      {
        id: 'e-jk-judges',
        label: 'Judges like Deborah and Gideon deliver Israel',
        order: 2,
        reference: 'Judges 4–7',
        explanation: 'The judges arise in the period after the conquest of the land.',
      },
      {
        id: 'e-jk-saul',
        label: 'Saul is anointed Israel’s first king',
        order: 3,
        reference: '1 Samuel 10',
        explanation: 'Saul’s anointing comes at the end of the era of the judges.',
      },
      {
        id: 'e-jk-david',
        label: 'David is anointed king after Saul',
        order: 4,
        reference: '1 Samuel 16; 2 Samuel 5',
        explanation: 'David’s kingship follows Saul’s reign and death.',
      },
      {
        id: 'e-jk-solomon',
        label: 'Solomon builds the temple in Jerusalem',
        order: 5,
        reference: '1 Kings 6',
        explanation: 'Solomon, David’s son, builds the temple after succeeding his father.',
      },
    ],
  },
  {
    id: 'tl-exodus',
    title: 'Exodus path',
    difficulty: 'intermediate',
    events: [
      {
        id: 'e-egypt',
        label: 'Israel enslaved in Egypt',
        order: 1,
        reference: 'Exodus 1',
        explanation: 'Bondage in Egypt precedes the Exodus.',
      },
      {
        id: 'e-exodus',
        label: 'The Exodus from Egypt',
        order: 2,
        reference: 'Exodus 12–14',
        explanation: 'God delivers Israel through the sea.',
      },
      {
        id: 'e-sinai',
        label: 'Covenant at Sinai / Ten Commandments',
        order: 3,
        reference: 'Exodus 19–20',
        explanation: 'Sinai follows the departure from Egypt.',
      },
      {
        id: 'e-jordan',
        label: 'Israel enters the land under Joshua',
        order: 4,
        reference: 'Joshua 3–4',
        explanation: 'Crossing the Jordan comes after the wilderness period.',
      },
    ],
  },
  {
    id: 'tl-wilderness',
    title: 'Wilderness Wanderings',
    difficulty: 'intermediate',
    events: [
      {
        id: 'e-wild-manna',
        label: 'Israel complains and God provides manna and quail',
        order: 1,
        reference: 'Exodus 16',
        explanation: 'This provision comes early in the wilderness journey, after Sinai is reached.',
      },
      {
        id: 'e-wild-calf',
        label: 'Israel worships the golden calf at Sinai',
        order: 2,
        reference: 'Exodus 32',
        explanation: 'The golden calf incident happens while Moses is receiving the law on the mountain.',
      },
      {
        id: 'e-wild-spies',
        label: 'Twelve spies scout Canaan and most give a fearful report',
        order: 3,
        reference: 'Numbers 13–14',
        explanation: 'The spies are sent after Israel leaves Sinai, heading toward the land.',
      },
      {
        id: 'e-wild-wander',
        label: 'Israel wanders for a generation because of unbelief',
        order: 4,
        reference: 'Numbers 14:26–35',
        explanation: 'The prolonged wandering is God’s response to the people’s unbelief at the spies’ report.',
      },
      {
        id: 'e-wild-moses-dies',
        label: 'Moses views the promised land and dies on Mount Nebo',
        order: 5,
        reference: 'Deuteronomy 34',
        explanation: 'Moses’ death comes at the end of the wilderness period, just before entry into the land.',
      },
    ],
  },
  {
    id: 'tl-kingdom-divided',
    title: 'United and Divided Kingdom',
    difficulty: 'intermediate',
    events: [
      {
        id: 'e-kd-david',
        label: 'David becomes king over all Israel',
        order: 1,
        reference: '2 Samuel 5',
        explanation: 'David’s reign over the united kingdom follows Saul’s death.',
      },
      {
        id: 'e-kd-solomon',
        label: 'Solomon succeeds David and builds the temple',
        order: 2,
        reference: '1 Kings 1–6',
        explanation: 'Solomon’s reign and temple-building follow David’s.',
      },
      {
        id: 'e-kd-split',
        label: 'The kingdom splits into Israel and Judah',
        order: 3,
        reference: '1 Kings 12',
        explanation: 'The division happens after Solomon’s death, under Rehoboam.',
      },
      {
        id: 'e-kd-elijah',
        label: 'Elijah confronts idolatry in the northern kingdom',
        order: 4,
        reference: '1 Kings 17–18',
        explanation: 'Elijah’s ministry takes place during the divided kingdom period.',
      },
      {
        id: 'e-kd-fall-israel',
        label: 'The northern kingdom of Israel falls to Assyria',
        order: 5,
        reference: '2 Kings 17',
        explanation: 'Israel’s fall comes after generations of the divided kingdom’s decline.',
      },
    ],
  },
  {
    id: 'tl-exile-return',
    title: 'Exile and Return',
    difficulty: 'intermediate',
    events: [
      {
        id: 'e-er-fall-judah',
        label: 'Jerusalem falls and Judah is exiled to Babylon',
        order: 1,
        reference: '2 Kings 25',
        explanation: 'Judah’s exile follows the earlier fall of the northern kingdom.',
      },
      {
        id: 'e-er-daniel',
        label: 'Daniel and his friends serve faithfully in Babylon',
        order: 2,
        reference: 'Daniel 1',
        explanation: 'Daniel’s service in Babylon takes place during the exile.',
      },
      {
        id: 'e-er-cyrus',
        label: 'Cyrus decrees that the exiles may return home',
        order: 3,
        reference: 'Ezra 1',
        explanation: 'The decree comes near the end of the Babylonian captivity.',
      },
      {
        id: 'e-er-temple',
        label: 'The returned exiles rebuild the temple in Jerusalem',
        order: 4,
        reference: 'Ezra 3–6',
        explanation: 'Temple rebuilding follows the return made possible by Cyrus’ decree.',
      },
      {
        id: 'e-er-walls',
        label: 'Nehemiah leads the rebuilding of Jerusalem’s walls',
        order: 5,
        reference: 'Nehemiah 2–6',
        explanation: 'Nehemiah’s mission to rebuild the walls comes after the temple is restored.',
      },
    ],
  },
  {
    id: 'tl-galilean-ministry',
    title: 'Jesus’ Galilean Ministry',
    difficulty: 'intermediate',
    events: [
      {
        id: 'e-gm-call',
        label: 'Jesus calls His first disciples by the Sea of Galilee',
        order: 1,
        reference: 'Mark 1:16–20',
        explanation: 'Calling disciples marks the early expansion of Jesus’ ministry.',
      },
      {
        id: 'e-gm-parables',
        label: 'Jesus teaches the crowds in parables of the kingdom',
        order: 2,
        reference: 'Mark 4',
        explanation: 'Parable teaching develops as Jesus’ public ministry grows.',
      },
      {
        id: 'e-gm-feeding',
        label: 'Jesus feeds the five thousand',
        order: 3,
        reference: 'Mark 6:30–44',
        explanation: 'This miracle comes after the disciples return from an early mission.',
      },
      {
        id: 'e-gm-confession',
        label: 'Peter confesses Jesus as the Christ at Caesarea Philippi',
        order: 4,
        reference: 'Mark 8:27–30',
        explanation: 'This turning-point confession follows the miracles of the Galilean ministry.',
      },
      {
        id: 'e-gm-transfiguration',
        label: 'Jesus is transfigured before Peter, James, and John',
        order: 5,
        reference: 'Mark 9:2–8',
        explanation: 'The transfiguration follows shortly after Peter’s confession.',
      },
    ],
  },
  {
    id: 'tl-christ',
    title: 'Christ’s ministry',
    difficulty: 'advanced',
    events: [
      {
        id: 'e-birth',
        label: 'Jesus is born in Bethlehem',
        order: 1,
        reference: 'Matthew 2:1; Luke 2',
        explanation: 'The incarnation begins the Gospel narrative of Jesus’ life.',
      },
      {
        id: 'e-baptism',
        label: 'Jesus is baptized by John',
        order: 2,
        reference: 'Matthew 3',
        explanation: 'Baptism marks the start of Jesus’ public ministry.',
      },
      {
        id: 'e-cross',
        label: 'Jesus is crucified',
        order: 3,
        reference: 'Matthew 27',
        explanation: 'The crucifixion follows Jesus’ ministry and trial.',
      },
      {
        id: 'e-resurrection',
        label: 'Jesus rises from the dead',
        order: 4,
        reference: 'Matthew 28',
        explanation: 'The resurrection follows the crucifixion on the third day.',
      },
      {
        id: 'e-pentecost',
        label: 'The Spirit is poured out at Pentecost',
        order: 5,
        reference: 'Acts 2',
        explanation: 'Pentecost follows the ascension in Luke–Acts.',
      },
    ],
  },
  {
    id: 'tl-paul-missions',
    title: 'Paul and the Early Church',
    difficulty: 'advanced',
    events: [
      {
        id: 'e-pm-conversion',
        label: 'Saul is converted on the road to Damascus',
        order: 1,
        reference: 'Acts 9',
        explanation: 'Saul’s conversion precedes his career as the apostle Paul.',
      },
      {
        id: 'e-pm-council',
        label: 'The Jerusalem council affirms that Gentiles are saved by grace',
        order: 2,
        reference: 'Acts 15',
        explanation: 'The council meets after Gentile conversions raise questions in the early church.',
      },
      {
        id: 'e-pm-journeys',
        label: 'Paul undertakes missionary journeys across Asia Minor and Greece',
        order: 3,
        reference: 'Acts 13–20',
        explanation: 'Paul’s journeys follow his commissioning and the Jerusalem council.',
      },
      {
        id: 'e-pm-arrest',
        label: 'Paul is arrested in Jerusalem and appeals to Rome',
        order: 4,
        reference: 'Acts 21–28',
        explanation: 'Paul’s arrest comes near the end of his recorded missionary work in Acts.',
      },
      {
        id: 'e-pm-letters',
        label: 'Paul writes letters to churches, including from custody',
        order: 5,
        reference: 'e.g. Ephesians, Philippians, Colossians, the Pastoral Epistles',
        explanation: 'Many of Paul’s letters, including several “prison epistles,” come from this later period of his ministry.',
      },
    ],
  },
  {
    id: 'tl-covenants',
    title: 'God’s Covenants Through Scripture',
    difficulty: 'advanced',
    events: [
      {
        id: 'e-cov-noah',
        label: 'God covenants with Noah after the flood',
        order: 1,
        reference: 'Genesis 9',
        explanation: 'The Noahic covenant is the first covenant explicitly named after the flood.',
      },
      {
        id: 'e-cov-abraham',
        label: 'God covenants with Abraham, promising descendants, land, and blessing',
        order: 2,
        reference: 'Genesis 12; 15; 17',
        explanation: 'The Abrahamic covenant follows the Noahic covenant in the Genesis narrative.',
      },
      {
        id: 'e-cov-sinai',
        label: 'God gives Israel His law in covenant at Sinai through Moses',
        order: 3,
        reference: 'Exodus 19–24',
        explanation: 'The Mosaic covenant comes generations after Abraham, at the Exodus.',
      },
      {
        id: 'e-cov-david',
        label: 'God promises David an everlasting throne and kingdom',
        order: 4,
        reference: '2 Samuel 7',
        explanation: 'The Davidic covenant is given centuries after Sinai, during David’s reign.',
      },
      {
        id: 'e-cov-new-promised',
        label: 'God promises a new covenant written on the heart',
        order: 5,
        reference: 'Jeremiah 31:31–34',
        explanation: 'Jeremiah prophesies the new covenant during the later prophetic period, before the exile.',
      },
      {
        id: 'e-cov-new-inaugurated',
        label: 'Jesus inaugurates the new covenant in His blood',
        order: 6,
        reference: 'Luke 22:20; Hebrews 9',
        explanation: 'The new covenant promised through Jeremiah is inaugurated at the Last Supper and the cross.',
      },
    ],
  },
  {
    id: 'tl-resurrection-ascension',
    title: 'Resurrection to Pentecost',
    difficulty: 'advanced',
    events: [
      {
        id: 'e-ra-cross',
        label: 'Jesus is crucified and buried',
        order: 1,
        reference: 'Luke 23',
        explanation: 'The burial follows the crucifixion, setting up the empty-tomb narrative.',
      },
      {
        id: 'e-ra-empty-tomb',
        label: 'Jesus is raised; the tomb is found empty on the third day',
        order: 2,
        reference: 'Luke 24:1–12',
        explanation: 'The resurrection is discovered on the third day after the burial.',
      },
      {
        id: 'e-ra-appearances',
        label: 'The risen Jesus appears to His disciples over forty days',
        order: 3,
        reference: 'Acts 1:3; Luke 24:13–49',
        explanation: 'Luke–Acts records a forty-day period of appearances following the resurrection.',
      },
      {
        id: 'e-ra-ascension',
        label: 'Jesus commissions His disciples and ascends to heaven',
        order: 4,
        reference: 'Luke 24:50–51; Acts 1:6–11',
        explanation: 'The ascension closes the forty days of post-resurrection appearances.',
      },
      {
        id: 'e-ra-waiting',
        label: 'The disciples wait and pray in Jerusalem for the promised Spirit',
        order: 5,
        reference: 'Acts 1:12–14',
        explanation: 'The disciples obey Jesus’ instruction to wait in Jerusalem after the ascension.',
      },
      {
        id: 'e-ra-pentecost',
        label: 'The Holy Spirit is poured out at Pentecost',
        order: 6,
        reference: 'Acts 2',
        explanation: 'Pentecost arrives as the next named feast day after the ascension, fulfilling Jesus’ promise.',
      },
    ],
  },
  // Part 13.5 timeline expansions
  {
    id: 'tl-p13-creation-babel',
    title: 'Beginnings: Creation to Babel',
    difficulty: 'beginner',
    events: [
      {
        id: 'e-p13-creation',
        label: 'Creation',
        order: 1,
        reference: 'Genesis 1–2',
        explanation: 'God creates the heavens and the earth and makes humanity in His image.',
      },
      {
        id: 'e-p13-fall',
        label: 'The Fall',
        order: 2,
        reference: 'Genesis 3',
        explanation: 'Adam and Eve rebel; sin and death enter the story.',
      },
      {
        id: 'e-p13-flood',
        label: 'The Flood',
        order: 3,
        reference: 'Genesis 6–9',
        explanation: 'God judges the world by flood and preserves Noah’s family.',
      },
      {
        id: 'e-p13-babel',
        label: 'The Tower of Babel',
        order: 4,
        reference: 'Genesis 11',
        explanation: 'Humanity’s prideful tower is judged; languages are confused.',
      },
    ],
  },
  {
    id: 'tl-p13-gospel-arc',
    title: 'Jesus: Birth to Resurrection',
    difficulty: 'beginner',
    events: [
      {
        id: 'e-p13-birth',
        label: 'Jesus is born',
        order: 1,
        reference: 'Luke 2',
        explanation: 'Jesus is born in Bethlehem.',
      },
      {
        id: 'e-p13-baptism',
        label: 'Jesus is baptized',
        order: 2,
        reference: 'Matthew 3',
        explanation: 'Jesus is baptized by John in the Jordan.',
      },
      {
        id: 'e-p13-feed',
        label: 'The feeding of the 5,000',
        order: 3,
        reference: 'Mark 6:30–44',
        explanation: 'Jesus feeds the multitude with five loaves and two fish.',
      },
      {
        id: 'e-p13-supper',
        label: 'The Last Supper',
        order: 4,
        reference: 'Luke 22',
        explanation: 'Jesus institutes the Lord’s Supper with His disciples.',
      },
      {
        id: 'e-p13-res',
        label: 'The resurrection',
        order: 5,
        reference: 'Luke 24',
        explanation: 'Jesus rises from the dead on the third day.',
      },
    ],
  },
  {
    id: 'tl-p13-acts-arc',
    title: 'Acts: Resurrection to Paul’s Conversion',
    difficulty: 'beginner',
    events: [
      {
        id: 'e-p13a-res',
        label: 'The resurrection',
        order: 1,
        reference: 'Luke 24',
        explanation: 'Jesus rises; the church’s hope begins in an empty tomb.',
      },
      {
        id: 'e-p13a-asc',
        label: 'The ascension',
        order: 2,
        reference: 'Acts 1',
        explanation: 'Jesus ascends and promises the Spirit.',
      },
      {
        id: 'e-p13a-pent',
        label: 'Pentecost',
        order: 3,
        reference: 'Acts 2',
        explanation: 'The Spirit is poured out; the gospel is preached.',
      },
      {
        id: 'e-p13a-stephen',
        label: 'Stephen is martyred',
        order: 4,
        reference: 'Acts 7',
        explanation: 'Stephen becomes the first Christian martyr named in Acts.',
      },
      {
        id: 'e-p13a-paul',
        label: 'Paul is converted',
        order: 5,
        reference: 'Acts 9',
        explanation: 'Saul meets the risen Christ on the Damascus road.',
      },
    ],
  },
  {
    id: 'tl-p13-nicaea-chalcedon',
    title: 'Early Councils',
    difficulty: 'advanced',
    events: [
      {
        id: 'e-p13c-nicaea',
        label: 'Council of Nicaea (325)',
        order: 1,
        reference: 'Historical — Nicaea',
        explanation: 'Nicaea confessed the Son as homoousios with the Father against Arianism.',
      },
      {
        id: 'e-p13c-const',
        label: 'Council of Constantinople (381)',
        order: 2,
        reference: 'Historical — Constantinople I',
        explanation: 'Reaffirmed Nicaea and expanded teaching on the Holy Spirit.',
      },
      {
        id: 'e-p13c-eph',
        label: 'Council of Ephesus (431)',
        order: 3,
        reference: 'Historical — Ephesus',
        explanation: 'Addressed Nestorian controversy concerning Christ’s person.',
      },
      {
        id: 'e-p13c-chal',
        label: 'Council of Chalcedon (451)',
        order: 4,
        reference: 'Historical — Chalcedon',
        explanation: 'Confessed one person of Christ in two natures.',
      },
    ],
  },
  // Note: Christians hold differing views on the millennium and the precise relationship
  // between these events (e.g. premillennial, amillennial, postmillennial). This set only
  // orders themes that Scripture itself presents in this sequence; it does not adjudicate
  // those debates.
  {
    id: 'tl-last-things',
    title: 'Last Things: Great Themes of Hope',
    difficulty: 'advanced',
    events: [
      {
        id: 'e-lt-return',
        label: 'Christ promises He will return visibly in glory',
        order: 1,
        reference: 'Matthew 24:30; Acts 1:11',
        explanation:
          'Scripture consistently presents Christ’s promised return as the next great event for which the church watches.',
      },
      {
        id: 'e-lt-resurrection-dead',
        label: 'Scripture describes the dead in Christ being raised at His coming',
        order: 2,
        reference: '1 Thessalonians 4:13–18; 1 Corinthians 15:51–52',
        explanation:
          'Paul links the resurrection of believers to the moment of Christ’s return.',
      },
      {
        id: 'e-lt-judgment',
        label: 'Scripture describes all people facing final judgment before God',
        order: 3,
        reference: 'Revelation 20:11–15; Matthew 25:31–46',
        explanation:
          'Final judgment is presented as following the resurrection in both Gospel and Revelation imagery.',
      },
      {
        id: 'e-lt-new-creation',
        label: 'Scripture closes with the promise of a new heaven and new earth',
        order: 4,
        reference: 'Revelation 21–22',
        explanation:
          'The new creation is the Bible’s final, climactic hope, where God dwells fully with His people.',
      },
    ],
  },
]

export function timelineSetsForDifficulty(difficulty: GameDifficulty): TimelineSet[] {
  if (difficulty === 'beginner') return TIMELINE_SETS.filter((s) => s.difficulty === 'beginner')
  if (difficulty === 'intermediate')
    return TIMELINE_SETS.filter((s) => s.difficulty !== 'advanced')
  return TIMELINE_SETS
}
