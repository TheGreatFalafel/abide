import type { GameDifficulty } from '../../games/types'

export type MatchItem = {
  id: string
  reference: string
  summary: string
  explanation: string
  difficulty: GameDifficulty
  /** Optional doctrinal/theological category, useful for grouping or filtering. */
  theologyTopic?: string
}

/** Match reference ↔ summary. Summaries are factual, not speculative theology. */
export const MATCH_BANK: MatchItem[] = [
  {
    id: 'm-1',
    reference: 'Genesis 1:1',
    summary: 'God creates the heavens and the earth.',
    explanation: 'The Bible opens with God’s creative act.',
    difficulty: 'beginner',
  },
  {
    id: 'm-2',
    reference: 'Exodus 20:1–17',
    summary: 'God gives the Ten Commandments at Sinai.',
    explanation: 'The Decalogue summarizes covenant obligations for Israel.',
    difficulty: 'beginner',
  },
  {
    id: 'm-3',
    reference: 'Psalm 23',
    summary: 'The Lord is described as a shepherd who cares for His people.',
    explanation: 'A psalm of trust in God’s guidance and provision.',
    difficulty: 'beginner',
  },
  {
    id: 'm-4',
    reference: 'Luke 15:11–32',
    summary: 'Jesus tells the parable of the prodigal son.',
    explanation: 'A father welcomes a repentant son home with joy.',
    difficulty: 'beginner',
  },
  {
    id: 'm-5',
    reference: 'John 3:16',
    summary: 'God gives His Son so that believers may have eternal life.',
    explanation: 'Jesus explains God’s love to Nicodemus in this well-known verse.',
    difficulty: 'beginner',
  },
  {
    id: 'm-6',
    reference: 'Acts 2',
    summary: 'The Holy Spirit is poured out and Peter preaches at Pentecost.',
    explanation: 'The church’s public witness begins in Jerusalem.',
    difficulty: 'intermediate',
  },
  {
    id: 'm-7',
    reference: 'Romans 3:21–26',
    summary: 'Paul teaches justification by God’s grace through faith in Christ.',
    explanation: 'A central New Testament explanation of the gospel.',
    difficulty: 'intermediate',
  },
  {
    id: 'm-8',
    reference: 'Isaiah 53',
    summary: 'The suffering servant bears the sins of many.',
    explanation: 'A prophetic poem Christians read in light of Christ’s atonement.',
    difficulty: 'intermediate',
  },
  {
    id: 'm-9',
    reference: 'Revelation 21:1–4',
    summary: 'God dwells with His people in a new heaven and new earth; death is no more.',
    explanation: 'The Bible’s closing vision of renewed creation.',
    difficulty: 'advanced',
  },
  {
    id: 'm-10',
    reference: 'Ephesians 2:1–10',
    summary: 'Believers were dead in sin but made alive by grace through faith—not by works.',
    explanation: 'Paul contrasts spiritual death with salvation as God’s gift.',
    difficulty: 'advanced',
  },
  {
    id: 'm-11',
    reference: 'Jonah 1–3',
    summary: 'A prophet flees God’s call, is swallowed by a great fish, then preaches in Nineveh.',
    explanation: 'Jonah’s story shows God’s mercy to repentant Gentiles.',
    difficulty: 'intermediate',
  },
  {
    id: 'm-12',
    reference: 'Matthew 5–7',
    summary: 'Jesus teaches the Sermon on the Mount, including the Beatitudes.',
    explanation: 'A major block of Jesus’ ethical and kingdom teaching.',
    difficulty: 'advanced',
  },

  // --- Beginner additions (m-13–m-23) ---
  {
    id: 'm-13',
    reference: 'Genesis 2:18–25',
    summary: 'God forms Eve from Adam’s side and institutes marriage.',
    explanation: 'This passage grounds marriage as a good gift from creation, before the Fall.',
    difficulty: 'beginner',
    theologyTopic: 'creation and marriage',
  },
  {
    id: 'm-14',
    reference: 'Genesis 37',
    summary: 'Joseph’s jealous brothers sell him into slavery in Egypt.',
    explanation: 'This begins the Joseph narrative that leads to Israel’s time in Egypt.',
    difficulty: 'beginner',
  },
  {
    id: 'm-15',
    reference: 'Exodus 3',
    summary: 'God calls Moses to deliver Israel, speaking from a burning bush.',
    explanation: 'Moses’ call shows God initiating redemption and revealing His name.',
    difficulty: 'beginner',
  },
  {
    id: 'm-16',
    reference: '1 Samuel 17',
    summary: 'The young David defeats the giant Philistine Goliath.',
    explanation: 'David’s victory, trusting God rather than armor, foreshadows his kingship.',
    difficulty: 'beginner',
  },
  {
    id: 'm-17',
    reference: 'Daniel 6',
    summary: 'Daniel is thrown into a den of lions for praying to God, and is kept safe.',
    explanation: 'Daniel’s faithfulness under threat shows God’s protection of His own.',
    difficulty: 'beginner',
  },
  {
    id: 'm-18',
    reference: 'Luke 2:1–20',
    summary: 'Jesus is born in Bethlehem and shepherds are told the good news by angels.',
    explanation: 'Luke’s nativity account centers on humble witnesses receiving the announcement of the Savior’s birth.',
    difficulty: 'beginner',
  },
  {
    id: 'm-19',
    reference: 'Mark 4:35–41',
    summary: 'Jesus calms a violent storm on the Sea of Galilee with a word.',
    explanation: 'The miracle displays Jesus’ authority over creation, amazing His disciples.',
    difficulty: 'beginner',
  },
  {
    id: 'm-20',
    reference: 'John 11:1–44',
    summary: 'Jesus raises His friend Lazarus from the dead after four days in the tomb.',
    explanation: 'This sign points to Jesus as “the resurrection and the life” shortly before His own death.',
    difficulty: 'beginner',
  },
  {
    id: 'm-21',
    reference: 'Luke 19:1–10',
    summary: 'Jesus calls the tax collector Zacchaeus down from a tree and dines with him.',
    explanation: 'The story shows Jesus seeking and saving the outcast, leading to Zacchaeus’ repentance.',
    difficulty: 'beginner',
  },
  {
    id: 'm-22',
    reference: 'Matthew 28:1–10',
    summary: 'Jesus rises from the dead, and women find the tomb empty on the third day.',
    explanation: 'The resurrection is the central historical claim of the Christian faith.',
    difficulty: 'beginner',
  },
  {
    id: 'm-23',
    reference: 'Acts 9:1–19',
    summary: 'Saul, a persecutor of the church, meets the risen Christ on the road to Damascus and is converted.',
    explanation: 'Saul’s dramatic conversion turns him into Paul, a leading apostle to the Gentiles.',
    difficulty: 'beginner',
  },

  // --- Intermediate additions (m-24–m-35) ---
  {
    id: 'm-24',
    reference: 'Genesis 15',
    summary: 'God makes a covenant with Abram, promising descendants as numerous as the stars.',
    explanation: 'God confirms His promise with a formal covenant ceremony, credited to Abram as righteousness through faith.',
    difficulty: 'intermediate',
    theologyTopic: 'covenant',
  },
  {
    id: 'm-25',
    reference: 'Genesis 22:1–19',
    summary: 'God tests Abraham by calling him to offer Isaac, then provides a ram in his place.',
    explanation: 'Abraham’s faith and God’s provision of a substitute foreshadow later substitutionary themes.',
    difficulty: 'intermediate',
  },
  {
    id: 'm-26',
    reference: '1 Kings 18:16–40',
    summary: 'Elijah confronts the prophets of Baal on Mount Carmel, and God sends fire to prove He alone is God.',
    explanation: 'The contest exposes Baal’s powerlessness and calls Israel back to exclusive worship of the LORD.',
    difficulty: 'intermediate',
  },
  {
    id: 'm-27',
    reference: 'Psalm 51',
    summary: 'David prays for mercy and a clean heart after his sin with Bathsheba.',
    explanation: 'This penitential psalm models honest confession and trust in God’s steadfast love.',
    difficulty: 'intermediate',
  },
  {
    id: 'm-28',
    reference: 'Isaiah 6:1–8',
    summary: 'Isaiah sees a vision of the LORD’s holiness and is commissioned as a prophet.',
    explanation: 'The vision shows God’s overwhelming holiness and grace in cleansing and calling a sinful man.',
    difficulty: 'intermediate',
  },
  {
    id: 'm-29',
    reference: 'Luke 10:25–37',
    summary: 'Jesus tells the parable of the Good Samaritan to answer “Who is my neighbor?”',
    explanation: 'The parable redefines neighbor-love across social and ethnic boundaries.',
    difficulty: 'intermediate',
  },
  {
    id: 'm-30',
    reference: 'John 1:1–14',
    summary: 'John introduces Jesus as the eternal Word who was with God, is God, and became flesh.',
    explanation: 'This prologue grounds Jesus’ deity and incarnation at the opening of John’s Gospel.',
    difficulty: 'intermediate',
    theologyTopic: 'incarnation',
  },
  {
    id: 'm-31',
    reference: 'Acts 15:1–21',
    summary: 'The Jerusalem council decides that Gentile believers are saved by grace, not by keeping the Mosaic law.',
    explanation: 'This pivotal meeting settles a major early controversy over the gospel and Gentile inclusion.',
    difficulty: 'intermediate',
  },
  {
    id: 'm-32',
    reference: 'Romans 8:28–39',
    summary: 'Paul affirms that God works all things for the good of those who love Him, and nothing can separate believers from His love.',
    explanation: 'This passage offers assurance grounded in God’s sovereign purposes and Christ’s finished work.',
    difficulty: 'intermediate',
  },
  {
    id: 'm-33',
    reference: 'Galatians 2:11–21',
    summary: 'Paul confronts Peter in Antioch and insists that justification comes through faith, not works of the law.',
    explanation: 'The episode defends the gospel’s core claim against pressure to add law-keeping to faith.',
    difficulty: 'intermediate',
  },
  {
    id: 'm-34',
    reference: 'James 2:14–26',
    summary: 'James teaches that genuine faith produces works, and faith without works is dead.',
    explanation: 'James addresses the fruit of real faith, complementing Paul’s teaching on justification rather than contradicting it.',
    difficulty: 'intermediate',
  },
  {
    id: 'm-35',
    reference: 'Jeremiah 31:31–34',
    summary: 'God promises a new covenant written on the heart, with forgiveness of sins and true knowledge of the Lord.',
    explanation: 'This new-covenant promise is later applied to Christ’s mediatorial work (cf. Hebrews 8). The text states the promise; its Christological fulfillment is New Testament interpretation.',
    difficulty: 'intermediate',
    theologyTopic: 'covenant',
  },

  // --- Advanced additions (m-36–m-48) ---
  {
    id: 'm-36',
    reference: 'Leviticus 16',
    summary: 'On the Day of Atonement, the high priest offers sacrifices for Israel’s sins and sends a goat into the wilderness.',
    explanation: 'This ritual pictures substitutionary atonement that the New Testament sees fulfilled in Christ.',
    difficulty: 'advanced',
    theologyTopic: 'atonement',
  },
  {
    id: 'm-37',
    reference: 'Deuteronomy 6:4–9',
    summary: 'Moses calls Israel to love the LORD their God with undivided devotion and teach it to their children.',
    explanation: 'The Shema roots Israel’s whole life in exclusive loyalty to the one true God.',
    difficulty: 'advanced',
  },
  {
    id: 'm-38',
    reference: 'Job 38–42',
    summary: 'God answers Job out of a whirlwind, questioning him about creation rather than directly explaining his suffering.',
    explanation: 'God’s speeches assert His wisdom and sovereignty over a world Job cannot fully grasp.',
    difficulty: 'advanced',
  },
  {
    id: 'm-39',
    reference: 'Psalm 110',
    summary: 'David calls someone “my Lord,” who is both a priest and a king seated at God’s right hand.',
    explanation: 'The New Testament repeatedly applies this royal psalm to Christ as the promised Davidic king-priest.',
    difficulty: 'advanced',
  },
  {
    id: 'm-40',
    reference: 'Daniel 7:1–14',
    summary: 'Daniel sees four beasts and then “one like a son of man” receiving an everlasting kingdom from the Ancient of Days.',
    explanation: 'This vision of a coming kingdom becomes a key background to Jesus’ self-designation as the Son of Man.',
    difficulty: 'advanced',
  },
  {
    id: 'm-41',
    reference: 'Romans 9–11',
    summary: 'Paul wrestles with Israel’s unbelief, God’s sovereign purposes in election, and His ongoing faithfulness to Israel.',
    explanation: 'This dense section has long been read in differing ways across traditions; Paul’s conclusion is praise at God’s wisdom rather than a tidy resolution.',
    difficulty: 'advanced',
    theologyTopic: 'election',
  },
  {
    id: 'm-42',
    reference: 'Ephesians 1:3–14',
    summary: 'Paul blesses God for choosing and adopting believers in Christ “before the foundation of the world.”',
    explanation: 'Paul grounds salvation in God’s eternal plan; Christians have long debated the precise mechanics of election while affirming the text’s praise of grace.',
    difficulty: 'advanced',
  },
  {
    id: 'm-43',
    reference: 'Hebrews 9:11–28',
    summary: 'Christ enters the heavenly sanctuary once for all as the great high priest, His blood surpassing the old sacrifices.',
    explanation: 'Hebrews presents Christ’s single sacrifice as fulfilling and ending the old covenant’s repeated offerings.',
    difficulty: 'advanced',
  },
  {
    id: 'm-44',
    reference: '1 Corinthians 15:1–23',
    summary: 'Paul defends the bodily resurrection of Christ as the “firstfruits” guaranteeing believers’ future resurrection.',
    explanation: 'Paul argues the whole Christian hope stands or falls with Christ’s historical resurrection.',
    difficulty: 'advanced',
  },
  {
    id: 'm-45',
    reference: 'Colossians 1:15–20',
    summary: 'Paul describes Christ as the image of the invisible God, creator and sustainer of all things, and head of the church.',
    explanation: 'This “Christ hymn” affirms Christ’s full deity and supremacy over creation and redemption.',
    difficulty: 'advanced',
  },
  {
    id: 'm-46',
    reference: '2 Timothy 3:16–17',
    summary: 'Paul teaches that all Scripture is God-breathed and useful for teaching, correction, and equipping believers.',
    explanation: 'This verse is a foundational statement for the doctrine of Scripture’s inspiration and sufficiency.',
    difficulty: 'advanced',
    theologyTopic: 'Scripture',
  },
  {
    id: 'm-47',
    reference: 'Revelation 5',
    summary: 'A Lamb who was slain is found worthy to open the scroll, and all creation worships Him.',
    explanation: 'This throne-room vision presents Christ’s sacrificial death as the basis of His worthiness to reign, without specifying an end-times timeline.',
    difficulty: 'advanced',
  },
  {
    id: 'm-48',
    reference: 'Hebrews 11',
    summary: 'The author surveys Old Testament figures who lived by faith, from Abel and Noah to Abraham, Moses, and beyond.',
    explanation: 'This “hall of faith” chapter defines faith as confident trust in God’s promises, commending it through examples across redemptive history.',
    difficulty: 'advanced',
  },
]

export function matchItemsForDifficulty(difficulty: GameDifficulty, count = 4): MatchItem[] {
  const pool =
    difficulty === 'beginner'
      ? MATCH_BANK.filter((q) => q.difficulty === 'beginner')
      : difficulty === 'intermediate'
        ? MATCH_BANK.filter((q) => q.difficulty !== 'advanced')
        : MATCH_BANK
  return [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(count, pool.length))
}
