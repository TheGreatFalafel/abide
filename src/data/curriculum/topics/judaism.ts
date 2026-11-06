import type { CurriculumTopic } from '../types'
import { SOURCE_SPROUL_EVANG } from '../evangelismSources'
import { SOURCE_MACARTHUR_SUP, mc, passage } from './_helpers'

const ans = (letter: string) => ({ A: 0, B: 1, C: 2, D: 3 }[letter]!)
const Q = (
  id: string,
  prompt: string,
  choices: string[],
  letter: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  exp?: string,
) => mc(id, prompt, choices, ans(letter), exp, difficulty)

const BEGINNER = [
  Q('ju-b1', 'What are the first five books of the Bible called?', ['The Gospels', 'The Torah', 'The Prophets', 'The Writings'], 'B', 'beginner'),
  Q('ju-b2', 'The Shema begins:', ['"Hear, O Israel: the LORD our God, the LORD is one"', '"In the beginning"', '"Blessed are the poor"', '"Our Father"'], 'A', 'beginner'),
  Q('ju-b3', 'Which day is the Jewish day of rest?', ['Sunday', 'Saturday (the Sabbath)', 'Friday only', 'Monday'], 'B', 'beginner'),
  Q('ju-b4', 'Jesus was himself:', ['A Gentile', 'Jewish', 'Roman', 'Egyptian'], 'B', 'beginner'),
  Q('ju-b5', 'The Day of Atonement is called:', ['Passover', 'Yom Kippur', 'Hanukkah', 'Purim'], 'B', 'beginner'),
  Q('ju-b6', 'The Hebrew Scriptures are called the:', ['Quran', 'Talmud only', 'Tanakh', 'Vedas'], 'C', 'beginner'),
  Q('ju-b7', 'Isaiah 53 describes:', ['A suffering servant who bears sin', "A king's victory", 'A flood', 'A law'], 'A', 'beginner'),
  Q('ju-b8', 'Romans 1:16 says the gospel is for:', ['The Jew first and also the Greek', 'Only Gentiles', 'Only Jews', 'Only priests'], 'A', 'beginner'),
]

const INTERMEDIATE = [
  Q('ju-i1', 'The Talmud is:', ['The Rabbinic commentary and law (Mishnah and Gemara)', 'The Christian New Testament', 'The Psalms', 'The Prophets'], 'A', 'intermediate'),
  Q('ju-i2', 'The three major modern branches are:', ['Orthodox, Conservative, Reform', 'Sunni, Shia, Sufi', 'Catholic, Protestant, Orthodox', 'Theravada, Mahayana, Vajrayana'], 'A', 'intermediate'),
  Q('ju-i3', 'Judaism views Jesus as:', ['Not the Messiah', 'The Messiah', 'God', 'An angel'], 'A', 'intermediate'),
  Q('ju-i4', 'After the destruction of the temple, rabbinic Judaism emphasizes atonement through:', ['Repentance, prayer, and charity', 'Animal sacrifice', 'Baptism', 'The Mass'], 'A', 'intermediate'),
  Q('ju-i5', 'Leviticus 17:11 teaches that:', ['The life of the flesh is in the blood, which makes atonement', 'Tithing atones', 'Prayer alone atones', 'Fasting atones'], 'A', 'intermediate'),
  Q('ju-i6', 'Which prophet names Bethlehem as the birthplace of the ruler?', ['Micah', 'Jonah', 'Amos', 'Joel'], 'A', 'intermediate'),
  Q('ju-i7', 'Jeremiah 31:31-34 promises:', ['A new covenant', 'The end of Israel', 'Another exile', "The temple's rebuilding only"], 'A', 'intermediate'),
  Q('ju-i8', 'Which psalm opens with "My God, my God, why have you forsaken me?"', ['Psalm 22', 'Psalm 1', 'Psalm 23', 'Psalm 100'], 'A', 'intermediate'),
  Q('ju-i9', "Maimonides' thirteen principles include:", ['The coming of the Messiah', 'The Trinity', 'Baptism', 'The pope'], 'A', 'intermediate'),
]

const ADVANCED = [
  Q('ju-a1', 'What event in AD 70 reshaped Judaism?', ['The destruction of the temple', 'The Exodus', 'The exile', 'The Reformation'], 'A', 'advanced'),
  Q('ju-a2', 'Which ancient source identifies the Servant in Isaiah 52:13 as the Messiah?', ['Targum Jonathan', 'The Septuagint only', 'The Quran', 'The Didache'], 'A', 'advanced', 'Many later rabbis read the Servant as Israel.'),
  Q('ju-a3', 'Daniel 9:26 says the Messiah will be "cut off" and then:', ['The city and sanctuary will be destroyed', 'The temple will be rebuilt', 'Israel will be saved', 'Babylon will fall'], 'A', 'advanced'),
  Q('ju-a4', 'Romans 9-11 teaches that:', ['God has not rejected Israel, and a future for Israel remains', 'The church replaced Israel', 'Israel is abolished', 'The law is eternal for Gentiles'], 'A', 'advanced'),
  Q('ju-a5', '"Messianic Judaism" refers to:', ['Jewish believers in Jesus who keep Jewish identity and customs', 'Gentile converts', 'Orthodox Jews', 'Reform Jews'], 'A', 'advanced'),
  Q('ju-a6', 'Which fact should Christians acknowledge honestly?', ['That Christian antisemitism has a shameful history', 'That Jews are condemned as a people', 'That Jews never read Scripture', 'That Jews reject Moses'], 'A', 'advanced'),
  Q('ju-a7', 'Hebrews 10:1-4 teaches that the Old Testament sacrifices:', ['Were shadows that could not take away sins', 'Could save permanently', 'Were never commanded', 'Were pagan'], 'A', 'advanced'),
  Q('ju-a8', 'Zechariah 12:10 says Israel will look on:', ['The one they have pierced', 'The temple', 'The city', 'The law'], 'A', 'advanced'),
]

export const JUDAISM: CurriculumTopic = {
  id: 'judaism',
  title: 'Judaism',
  description:
    'Tanakh, rabbinic Judaism, and messianic hope — honoring shared Scripture, rejecting antisemitism, and presenting Jesus as Messiah with Romans 9–11 sensitivity.',
  objectives: [
    'Affirm Christianity’s Jewish roots and Jesus’ Jewish identity.',
    'Compare Jewish and Christian views of Messiah, atonement, and covenant.',
    'Interpret Isaiah 53, Daniel 9, and Hebrews in witness.',
    'Explain church relationship to Israel without replacement arrogance.',
  ],
  estimatedMinutes: 75,
  prerequisites: ['gospel-foundations'],
  framework: 'reformed',
  domain: 'evangelism-apologetics',
  contentStatus: 'full',
  version: 1,
  sources: [
    { ...SOURCE_SPROUL_EVANG, note: 'Gospel to the Jew first — paraphrase only.' },
    { ...SOURCE_MACARTHUR_SUP, note: 'Romans 9–11 themes — paraphrase only.' },
  ],
  lessons: [
    {
      id: 'ju-origins-tanakh',
      order: 1,
      title: 'Origins, Tanakh, and Practice',
      estimatedMinutes: 25,
      objectives: [
        'Describe Tanakh and post-AD 70 rabbinic Judaism.',
        'Name Orthodox, Conservative, and Reform branches.',
        'Honor Scripture shared with Judaism.',
      ],
      primaryPassages: [passage('deuteronomy', 'Deuteronomy', 6, 4, 4)],
      supportingPassages: [passage('romans', 'Romans', 1, 16, 16)],
      content: [
        {
          kind: 'teaching',
          title: 'Origins',
          body:
            'Judaism traces itself to Abraham and Moses. The Tanakh (Law, Prophets, Writings) is the Christian Old Testament. After the temple’s destruction in AD 70, rabbinic Judaism centered on synagogue and Talmud (Mishnah c. AD 200; Babylonian Gemara c. AD 500). Modern branches include Orthodox, Conservative, and Reform. Practices include Shema, Sabbath, kosher laws, Yom Kippur, and Passover. Maimonides summarized thirteen principles including Messiah’s coming.',
        },
        {
          kind: 'teaching',
          title: 'Shared roots',
          body:
            'Christianity grew from Judaism; Jesus and the apostles were Jewish. Romans 1:16 says the gospel is for the Jew first. Do not assume Jewish people know the New Testament.',
        },
        {
          kind: 'distinction',
          biblical: 'Deuteronomy 6:4 affirms God’s oneness — Christians affirm the Shema while confessing Trinity as compatible with monotheism.',
          interpretation: 'Reject Christian antisemitism historically and today (e.g., shameful sermons of the past).',
          disagreement: 'Judaism denies Jesus as Messiah — witness with respect, not contempt for a people.',
        },
        { kind: 'attribution', teacherId: 'macarthur', work: 'Published biblical teaching (themes)', note: 'Romans 9–11 burden — paraphrase only.' },
      ],
      questions: BEGINNER,
      reflectionPrompts: ['Repent of any antisemitic attitudes; pray for Israel’s peace without political sloganeering.'],
      furtherStudy: ['Read Romans 1:16–17 and Romans 9:1–5.'],
    },
    {
      id: 'ju-messiah-atonement',
      order: 2,
      title: 'Messiah, Atonement, and Covenant',
      estimatedMinutes: 25,
      objectives: [
        'Present Jesus as fulfillment of messianic prophecy.',
        'Contrast blood atonement with post-temple repentance emphasis.',
        'Explain new covenant in Jeremiah 31.',
      ],
      primaryPassages: [passage('isaiah', 'Isaiah', 53, 4, 6)],
      supportingPassages: [passage('jeremiah', 'Jeremiah', 31, 31, 34)],
      content: [
        {
          kind: 'teaching',
          title: 'Messiah and Servant',
          body:
            'Judaism generally holds Jesus is not Messiah. Christians cite Micah 5:2, Isaiah 7:14; 9:6–7, Psalm 22, Zechariah 12:10, Daniel 9:24–26. Isaiah 53 describes a suffering servant bearing sin — many Jewish readers identify Israel; Targum Jonathan on Isaiah 52:13 names Messiah; the New Testament applies the passage to Jesus (Acts 8:32–35; 1 Peter 2:24).',
        },
        {
          kind: 'teaching',
          title: 'Atonement and covenant',
          body:
            'Rabbinic Judaism often emphasizes repentance, prayer, and charity after the temple ended. Scripture teaches blood atonement (Leviticus 17:11; Hebrews 9:22) and the new covenant fulfilled in Christ (Jeremiah 31:31–34; Luke 22:20; Hebrews 8:6–13). Hebrews 10:1–4 says Old Testament sacrifices were shadows that could not permanently take away sins.',
        },
        {
          kind: 'distinction',
          biblical: 'Leviticus 17:11 and Jeremiah 31 anchor atonement and covenant hope.',
          interpretation: 'Paul’s burden for Israel (Romans 9:1–3; 10:1) shapes tone.',
          disagreement: 'Messianic Judaism maintains Jewish identity while trusting Jesus — describe without forcing categories.',
        },
        { kind: 'attribution', teacherId: 'sproul', work: 'Published Ligonier teaching (themes)', note: 'Justification and covenant — paraphrase only.' },
      ],
      questions: INTERMEDIATE,
      reflectionPrompts: ['Read Isaiah 53 aloud and note verbs about bearing sin.'],
      furtherStudy: ['Compare Daniel 9:26 with Gospel passion chronology in a study Bible.'],
    },
    {
      id: 'ju-engage-israel',
      order: 3,
      title: 'Engagement and Romans 9–11',
      estimatedMinutes: 25,
      objectives: [
        'Avoid replacement theology caricatures.',
        'Acknowledge history of Christian antisemitism.',
        'Share gospel with “to the Jew first” priority in spirit.',
      ],
      primaryPassages: [passage('romans', 'Romans', 11, 1, 2)],
      supportingPassages: [passage('zechariah', 'Zechariah', 12, 10, 10)],
      content: [
        {
          kind: 'teaching',
          title: 'How to engage',
          body:
            'Honor shared Scriptures; reject antisemitism; do not assume familiarity with the New Testament; explain Trinity as one God, not three gods; present Jesus from Tanakh. Friendship and integrity matter in honor-shame contexts.',
        },
        {
          kind: 'teaching',
          title: 'Israel and the church',
          body:
            'Romans 9–11 teaches God has not rejected his people; a future for Israel remains (11:1–2, 25–29). Avoid boastful replacement theology. Zechariah 12:10 points to the pierced one — read with care in conversation.',
          level: 'advanced',
        },
        {
          kind: 'distinction',
          biblical: 'Romans 11 warns Gentile believers against arrogance toward Jewish branches.',
          interpretation: 'Evangelism and theological hope for Israel belong together in Paul — not political triumphalism.',
          disagreement: 'Diverse Christian views on Israel’s future exist — this curriculum follows Romans 11’s “not rejected” line without detailed eschatological maps.',
        },
        { kind: 'attribution', teacherId: 'hoekema', work: 'Created in God\'s Image (themes)', note: 'Human dignity and image — paraphrase only in engagement tone.' },
      ],
      questions: ADVANCED,
      reflectionPrompts: ['Pray Romans 10:1 for Jewish friends and for the church’s integrity.'],
      furtherStudy: ['Read Romans 11:17–24 on the olive tree illustration.'],
    },
  ],
}
