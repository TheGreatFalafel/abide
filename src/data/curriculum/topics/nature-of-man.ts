import type { PassageRef } from '../../books'
import type { McQuestion, OpenQuestion, QuizQuestion } from '../../planQuizzes'
import type { CurriculumTopic } from '../types'

function passage(
  bookId: string,
  bookName: string,
  chapter: number,
  verseStart?: number,
  verseEnd?: number,
): PassageRef {
  return { bookId, bookName, chapter, verseStart, verseEnd }
}

function mc(
  id: string,
  prompt: string,
  choices: string[],
  answer: number,
): McQuestion {
  return { id, type: 'mc', prompt, choices, answer }
}

function open(id: string, prompt: string, reflection?: string): OpenQuestion {
  return { id, type: 'open', prompt, reflection }
}

const L1_QUESTIONS: QuizQuestion[] = [
  mc(
    'nom-1-id',
    'According to Genesis 1:26–27, humans are uniquely described as made…',
    ['From the dust alone, with no special status', "In God's image", 'As lesser gods', 'Identical to the animals'],
    1,
  ),
  mc(
    'nom-1-purpose',
    'Which best states a Reformed reading of the image of God in this lesson?',
    [
      'A physical resemblance to God',
      'Humanity’s royal-priestly calling to represent God and relate to Him',
      'Proof that humans never need grace',
      'A temporary status lost forever at the Fall with no remaining dignity',
    ],
    1,
  ),
  mc(
    'nom-1-james',
    'James 3:9 connects the image of God to how we treat other people by warning against…',
    ['Blessing people with our tongue', 'Cursing people made in God’s likeness', 'Farming on the Sabbath', 'Building towers'],
    1,
  ),
  open(
    'nom-1-open',
    'In your own words, how does “image of God” change the way you see someone you find hard to love?',
  ),
]

const L2_QUESTIONS: QuizQuestion[] = [
  mc(
    'nom-2-gen2',
    'Genesis 2:7 describes the LORD forming the man from dust and…',
    ['Leaving him lifeless forever', 'Breathing into him the breath of life so he becomes a living being', 'Turning him into an angel', 'Giving him a written law first'],
    1,
  ),
  mc(
    'nom-2-matt',
    'Matthew 10:28 teaches that people should fear God who can destroy…',
    ['Only the body', 'Only the soul', 'Both soul and body in hell', 'Neither soul nor body'],
    2,
  ),
  mc(
    'nom-2-unity',
    'This lesson’s Reformed emphasis on body and soul is that humans are…',
    [
      'Pure spirits temporarily using bodies',
      'Bodies only, with “soul” as a metaphor for personality',
      'Unified persons with material and immaterial aspects',
      'Three unrelated substances with no connection',
    ],
    2,
  ),
  open(
    'nom-2-open',
    'Where do you tend to treat either your body or your spiritual life as less important to God? Why?',
  ),
]

const L3_QUESTIONS: QuizQuestion[] = [
  mc(
    'nom-3-di',
    '“Dichotomy” in this topic means humanity consists of…',
    ['Body and soul/spirit as two aspects of one person', 'Body, soul, and spirit as three separable parts', 'Mind only', 'Community only'],
    0,
  ),
  mc(
    'nom-3-tri',
    'Trichotomy typically teaches that…',
    [
      'Humans have only a body',
      'Body, soul, and spirit are three distinct components',
      'Animals share the image of God equally',
      'The soul ceases at death with no intermediate state',
    ],
    1,
  ),
  mc(
    'nom-3-ref',
    'A common Reformed preference stated in this lesson is…',
    [
      'Trichotomy as the only biblical option',
      'Dichotomy, while still reading “spirit” language carefully in context',
      'That body and soul never interact',
      'That theology should ignore anthropology',
    ],
    1,
  ),
  open(
    'nom-3-open',
    'Why might it matter pastorally whether we treat “soul” and “spirit” as synonyms or as separate parts?',
  ),
]

const L4_QUESTIONS: QuizQuestion[] = [
  mc(
    'nom-4-mandate',
    'Genesis 1:28’s creation mandate includes…',
    ['Abandoning the earth', 'Fruitfulness, filling, and stewarding the earth under God', 'Building a tower to heaven', 'Avoiding all work'],
    1,
  ),
  mc(
    'nom-4-chief',
    'Which best captures the Reformed sense of humanity’s chief purpose taught here?',
    [
      'Accumulate maximum comfort',
      'Glorify God and enjoy Him forever',
      'Escape the material world permanently',
      'Prove moral superiority over others',
    ],
    1,
  ),
  mc(
    'nom-4-cor',
    '1 Corinthians 10:31 applies human purpose to…',
    ['Temple rituals only', 'Ordinary eating and drinking done to God’s glory', 'Political campaigns only', 'Silent meditation only'],
    1,
  ),
  open(
    'nom-4-open',
    'Name one ordinary task this week you can consciously do “to the glory of God.”',
  ),
]

const L5_QUESTIONS: QuizQuestion[] = [
  mc(
    'nom-5-fall',
    'Genesis 3 narrates that after disobeying God, Adam and Eve…',
    ['Became more divine', 'Experienced shame, hiding, and broken relationships', 'Lost all memory of God', 'Were immediately annihilated'],
    1,
  ),
  mc(
    'nom-5-rom',
    'Romans 3:9–12 teaches that…',
    [
      'Only Gentiles are under sin',
      'Jews and Gentiles alike are under sin; none is righteous',
      'Sin affects actions but never the heart',
      'The law makes people sinless',
    ],
    1,
  ),
  mc(
    'nom-5-dep',
    'In Reformed teaching here, “total depravity” means…',
    [
      'Every person is as evil as possible in every act',
      'Sin corrupts every faculty so that we cannot save ourselves apart from grace',
      'Christians never struggle with sin',
      'The image of God is entirely erased with no remaining dignity',
    ],
    1,
  ),
  mc(
    'nom-5-eph',
    'Ephesians 2:1–3 describes people apart from Christ as…',
    ['Slightly imperfect but spiritually alive', 'Dead in trespasses and by nature children of wrath', 'Already glorified', 'Free from any desire problem'],
    1,
  ),
  open(
    'nom-5-open',
    'How does a sober view of sin deepen—not shrink—your gratitude for the gospel?',
  ),
]

/** First complete theology topic: the nature of man (Grudem-organized anthropology). */
export const NATURE_OF_MAN: CurriculumTopic = {
  id: 'nature-of-man',
  title: 'The Nature of Man',
  description:
    'A Reformed introduction to biblical anthropology: who we are as God’s image-bearers, how body and soul relate, why we exist, and how sin has damaged—but not erased—human nature.',
  objectives: [
    'Explain what Scripture means by the image of God and why it still matters after the Fall.',
    'Describe humanity as a unity of body and soul without collapsing either aspect.',
    'Distinguish dichotomy and trichotomy and state the Reformed preference carefully.',
    'Articulate human purpose and responsibility under God’s rule.',
    'Summarize the effects of sin on human nature in Reformed terms without denying remaining dignity.',
  ],
  estimatedMinutes: 90,
  prerequisites: [],
  framework: 'reformed',
  version: 1,
  sources: [
    {
      teacherId: 'grudem',
      teacher: 'Wayne Grudem',
      work: 'Systematic Theology',
      role: 'organizational',
      note:
        'Topic order and major headings follow Grudem’s anthropology chapters (image of God; composition of man; sin) as a map for original lesson writing—not as reproduced textbook text.',
    },
    {
      teacherId: 'sproul',
      teacher: 'R.C. Sproul',
      work: 'Published teaching on the holiness of God and human fallenness (e.g. Ligonier resources)',
      role: 'supplementary',
      note:
        'Sproul’s emphasis on God’s holiness and the seriousness of sin supplements the lessons on purpose and the Fall. Claims here are paraphrased from well-known public themes, not quoted sermons.',
    },
    {
      teacherId: 'macarthur',
      teacher: 'John MacArthur',
      work: 'Published biblical teaching on creation, the Fall, and sanctification',
      role: 'supplementary',
      note:
        'MacArthur’s Scripture-centered pastoral stress on creation design and human responsibility supplements application sections. No sermon transcripts are reproduced.',
    },
  ],
  lessons: [
    {
      id: 'nature-of-man-image',
      order: 1,
      title: 'Created in the Image of God',
      estimatedMinutes: 18,
      objectives: [
        'Identify key biblical texts that teach the image of God.',
        'Explain a Reformed understanding of what the image involves.',
        'Connect image-bearing to how we treat other people.',
      ],
      primaryPassages: [
        passage('genesis', 'Genesis', 1, 26, 28),
        passage('genesis', 'Genesis', 9, 5, 6),
        passage('james', 'James', 3, 7, 10),
      ],
      supportingPassages: [
        passage('genesis', 'Genesis', 5, 1, 3),
        passage('colossians', 'Colossians', 3, 9, 10),
        passage('ephesians', 'Ephesians', 4, 22, 24),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Why this lesson matters',
          body:
            'Before asking what went wrong with humanity, Scripture tells us what went right at the start. Genesis does not introduce people as accidents or as rivals to God, but as creatures who somehow reflect their Maker. That claim shapes dignity, ethics, worship, and the gospel itself.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('genesis', 'Genesis', 1, 26, 27),
          note:
            'Interpretation: “Image” and “likeness” mark a unique status among creatures. The text ties that status to ruling as stewards under God—not to becoming divine.',
        },
        {
          kind: 'distinction',
          biblical:
            'Genesis states that God created mankind in His image, male and female, and gave them a mandate over the earth.',
          interpretation:
            'Reformed teaching typically treats the image as involving knowledge, righteousness, and holiness in relationship to God, plus a royal-priestly vocation to represent Him in creation. The image is personal and relational, not a physical look-alike of God.',
          disagreement:
            'Christians debate whether the image is primarily structural (capacities), functional (ruling), or relational (covenant fellowship)—or a combination. This curriculum teaches a combined Reformed view rather than claiming only one school owns Genesis 1.',
        },
        {
          kind: 'concept',
          term: 'Imago Dei',
          explanation:
            'Latin shorthand for “image of God.” In Abide’s Reformed framing, it names the human calling to know God, reflect His character, and steward creation under His authority.',
        },
        {
          kind: 'attribution',
          teacherId: 'grudem',
          work: 'Systematic Theology',
          note:
            'Grudem organizes anthropology by beginning with the image of God before composition of man and sin. These lessons follow that organizational sequence with original explanations.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('genesis', 'Genesis', 9, 6),
          note:
            'Interpretation: After the Flood, God still grounds the seriousness of murder in the image of God. That implies the image was not annihilated by the Fall, even though it is deeply affected by sin (Lesson 5).',
        },
        {
          kind: 'teaching',
          title: 'Image and neighbor-love',
          body:
            'James warns against blessing God while cursing people “made in the likeness of God.” Theology that affirms the image must show up in speech and conduct. Dignity is not earned by usefulness, tribe, or performance.',
        },
        {
          kind: 'attribution',
          teacherId: 'macarthur',
          work: 'Biblical teaching on creation and human dignity',
          note:
            'Supplementary emphasis: Scripture’s creation account is treated as the foundation for human worth and moral accountability, not as optional poetry that leaves anthropology undefined.',
        },
      ],
      questions: L1_QUESTIONS,
      reflectionPrompts: [
        'Thank God for one person whose dignity you often overlook, and ask for help to treat them as an image-bearer this week.',
      ],
      furtherStudy: [
        'Read Genesis 1–2 slowly and list every verb describing what humans are to do.',
        'Compare Colossians 3:9–10 and Ephesians 4:22–24 on the “new self” renewed in God’s image.',
      ],
    },
    {
      id: 'nature-of-man-body-soul',
      order: 2,
      title: 'Body and Soul',
      estimatedMinutes: 18,
      objectives: [
        'Show from Scripture that humans have both material and immaterial aspects.',
        'Avoid both materialist reduction and body-denying dualism.',
        'Relate body-soul unity to hope beyond death without skipping the resurrection.',
      ],
      primaryPassages: [
        passage('genesis', 'Genesis', 2, 7, 7),
        passage('matthew', 'Matthew', 10, 28, 28),
        passage('2corinthians', '2 Corinthians', 5, 1, 10),
      ],
      supportingPassages: [
        passage('ecclesiastes', 'Ecclesiastes', 12, 7, 7),
        passage('psalms', 'Psalms', 31, 5, 5),
        passage('1thessalonians', '1 Thessalonians', 5, 23, 23),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Whole people before God',
          body:
            'Biblical anthropology refuses two popular errors: that we are only chemistry, and that we are spirits trapped in worthless bodies. Genesis presents an embodied creature who lives by God’s breath. The New Testament speaks of soul and body without treating either as disposable.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('genesis', 'Genesis', 2, 7),
          note:
            'Interpretation: Dust plus divine breath yields a “living being.” The text presents unified life, not a detachable ghost casually parked in flesh.',
        },
        {
          kind: 'distinction',
          biblical:
            'Jesus distinguishes body and soul and teaches that God has authority over both; Paul speaks of being away from the body and at home with the Lord, while also hoping for a future resurrection body.',
          interpretation:
            'Reformed teaching affirms an intermediate state for believers with Christ after death and a future bodily resurrection. Body and soul belong together in God’s design; death is a temporary disruption healed in glory.',
          disagreement:
            'Some Christians emphasize “soul sleep”; others speak almost only of the intermediate state and underplay resurrection. This lesson keeps both: presence with Christ and the hope of raised bodies.',
        },
        {
          kind: 'concept',
          term: 'Body–soul unity',
          explanation:
            'Humans are one person with physical and spiritual aspects that normally function together. Caring for the body and seeking God with heart and mind are both spiritual responsibilities.',
        },
        {
          kind: 'teaching',
          title: 'Pastoral implications',
          body:
            'If bodies matter, then food, rest, sexuality, and suffering matter to discipleship. If souls matter, then prayer, truth, and worship are not optional add-ons. Christ redeems whole people.',
        },
      ],
      questions: L2_QUESTIONS,
      reflectionPrompts: [
        'Where is God inviting you to honor Him more fully—with your body, your inner life, or both?',
      ],
      furtherStudy: [
        'Trace “soul,” “spirit,” and “body” in one Gospel chapter and one Pauline letter.',
      ],
      reviewFromLessonIds: ['nature-of-man-image'],
    },
    {
      id: 'nature-of-man-composition',
      order: 3,
      title: 'How Body and Soul Relate',
      estimatedMinutes: 16,
      objectives: [
        'Define dichotomy and trichotomy in plain language.',
        'State why many Reformed teachers prefer dichotomy.',
        'Handle disputed texts without misrepresenting other views.',
      ],
      primaryPassages: [
        passage('genesis', 'Genesis', 2, 7, 7),
        passage('matthew', 'Matthew', 10, 28, 28),
        passage('hebrews', 'Hebrews', 4, 12, 12),
        passage('1thessalonians', '1 Thessalonians', 5, 23, 23),
      ],
      supportingPassages: [passage('luke', 'Luke', 1, 46, 47)],
      content: [
        {
          kind: 'teaching',
          title: 'A careful debate',
          body:
            'Christians agree that people are more than bodies. They disagree on whether Scripture divides the immaterial side into two parts (soul and spirit) or usually speaks of one immaterial aspect with overlapping vocabulary.',
        },
        {
          kind: 'concept',
          term: 'Dichotomy',
          explanation:
            'The view that humans are composed of two aspects: material (body) and immaterial (soul/spirit). “Soul” and “spirit” often function as near-synonyms for the inner person.',
        },
        {
          kind: 'concept',
          term: 'Trichotomy',
          explanation:
            'The view that humans are body, soul, and spirit as three distinct components, sometimes assigning different spiritual functions to soul vs. spirit.',
        },
        {
          kind: 'distinction',
          biblical:
            'Some texts mention body and soul; others mention spirit; a few list spirit, soul, and body together (e.g. 1 Thessalonians 5:23). Hebrews 4:12 speaks of dividing soul and spirit.',
          interpretation:
            'Many Reformed theologians prefer dichotomy: Scripture’s varied terms often highlight facets of one inner life rather than three separable “parts.” Lists can be emphatic completeness language, similar to loving God with heart, soul, mind, and strength.',
          disagreement:
            'Trichotomists argue that distinct terms imply distinct parts and sometimes use that map for counseling or sanctification models. Dichotomists reply that poetry and parallelism do not always equal ontology. Abide teaches the Reformed dichotomist preference while acknowledging the debate is intramural, not a gospel boundary.',
        },
        {
          kind: 'attribution',
          teacherId: 'grudem',
          work: 'Systematic Theology',
          note:
            'Organizational cue: Grudem’s discussion of the composition of man frames the dichotomy/trichotomy question as a standard systematic locus. Lesson content here is original summary for learners.',
        },
        {
          kind: 'teaching',
          title: 'Why the preference matters',
          body:
            'A dichotomist reading still takes “spirit” language seriously—especially the Holy Spirit’s work—and still affirms body-soul unity. It resists maps that treat the “spirit” as a third organ that clever techniques can unlock apart from Word and Spirit.',
        },
      ],
      questions: [
        ...L3_QUESTIONS,
        mc(
          'nom-3-review-image',
          'Review: Genesis 1 teaches that humans are made…',
          ["In God's image", 'Without purpose', 'As angels', 'As accidents'],
          0,
        ),
      ],
      reflectionPrompts: [
        'How does holding body and soul together help you pray for someone who is suffering physically or spiritually?',
      ],
      furtherStudy: [
        'Compare how “soul” and “spirit” are used in Luke 1:46–47 and Hebrews 4:12.',
      ],
      reviewFromLessonIds: ['nature-of-man-image', 'nature-of-man-body-soul'],
    },
    {
      id: 'nature-of-man-purpose',
      order: 4,
      title: 'Human Purpose and Responsibility',
      estimatedMinutes: 18,
      objectives: [
        'Connect creation mandate to everyday vocation.',
        'State humanity’s chief end in classic Reformed language.',
        'Apply glory-of-God purpose to ordinary choices.',
      ],
      primaryPassages: [
        passage('genesis', 'Genesis', 1, 26, 28),
        passage('ecclesiastes', 'Ecclesiastes', 12, 13, 14),
        passage('1corinthians', '1 Corinthians', 10, 31, 31),
        passage('matthew', 'Matthew', 22, 36, 40),
      ],
      supportingPassages: [
        passage('psalms', 'Psalms', 8, 3, 8),
        passage('micah', 'Micah', 6, 8, 8),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Made for more than survival',
          body:
            'If God made us in His image, then our purpose is not self-invention. Genesis gives a mandate: be fruitful, fill the earth, and exercise responsible dominion. Wisdom literature and Jesus summarize life under God as fear, obedience, and love.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('genesis', 'Genesis', 1, 28),
          note:
            'Interpretation: Dominion is stewardship under God, not exploitation. Human culture-making—family, work, art, justice—belongs inside worshipful responsibility.',
        },
        {
          kind: 'distinction',
          biblical:
            'Ecclesiastes concludes that people should fear God and keep His commandments; Paul says eating and drinking should be done to God’s glory; Jesus names love of God and neighbor as the great commandments.',
          interpretation:
            'Reformed catechetical tradition summarizes this as glorifying God and enjoying Him forever. Purpose is God-centered joy and obedience, not grim duty alone or empty self-expression.',
          disagreement:
            'Some modern spiritualities treat purpose as purely inward authenticity. Others reduce faith to social activism without worship. Scripture holds doxology and neighbor-love together.',
        },
        {
          kind: 'attribution',
          teacherId: 'sproul',
          work: 'Teaching on the holiness of God and the purpose of life',
          note:
            'Supplementary theme: a right view of God’s holiness reorders human purpose away from trivial ends. Paraphrased emphasis only—no sermon text reproduced.',
        },
        {
          kind: 'concept',
          term: 'Creation mandate',
          explanation:
            'God’s commissioning of humanity to fill and steward the earth as His representatives. It remains a framework for vocation even in a fallen world, now pursued under Christ’s lordship.',
        },
        {
          kind: 'teaching',
          title: 'Responsibility',
          body:
            'Purpose implies accountability. We answer to God for how we use influence, speech, sexuality, money, and time. Grace does not erase responsibility; it restores people to serve freely.',
        },
      ],
      questions: L4_QUESTIONS,
      reflectionPrompts: [
        'Write one sentence that names how you want to glorify God in a concrete role you hold (family, work, school, or church).',
      ],
      furtherStudy: [
        'Pray through Psalm 8 and ask where God is calling you to faithful “dominion” this month.',
      ],
      reviewFromLessonIds: ['nature-of-man-image'],
    },
    {
      id: 'nature-of-man-sin',
      order: 5,
      title: 'Sin’s Effects on Human Nature',
      estimatedMinutes: 20,
      objectives: [
        'Describe the Fall’s relational and moral fallout from Genesis 3.',
        'Explain total depravity without the caricature that “everyone is equally evil in every act.”',
        'Hold together remaining image-bearing dignity and radical need for grace.',
      ],
      primaryPassages: [
        passage('genesis', 'Genesis', 3, 1, 24),
        passage('romans', 'Romans', 3, 9, 20),
        passage('ephesians', 'Ephesians', 2, 1, 5),
        passage('romans', 'Romans', 5, 12, 19),
      ],
      supportingPassages: [
        passage('jeremiah', 'Jeremiah', 17, 9, 9),
        passage('john', 'John', 3, 5, 7),
        passage('romans', 'Romans', 8, 7, 8),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'What went wrong',
          body:
            'Genesis 3 shows distrust of God’s word, desire to seize wisdom on human terms, shame, blame-shifting, pain in vocation and relationships, and exile from Eden’s fellowship. Sin is not a small mistake; it is rebellion that fractures love of God and neighbor.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('romans', 'Romans', 3, 10, 12),
          note:
            'Interpretation: Paul gathers Scripture to show universal sinfulness. “None is righteous” confronts both religious pride and secular optimism about unaided human goodness.',
        },
        {
          kind: 'concept',
          term: 'Total depravity',
          explanation:
            'Not “as bad as possible in every deed,” but “sin reaches every part of us.” Mind, will, affections, and body are affected so that we cannot climb to God by moral effort. We need new birth and justifying grace in Christ.',
        },
        {
          kind: 'distinction',
          biblical:
            'Ephesians describes people as dead in trespasses, walking according to the world and flesh, yet also speaks of God’s rich mercy making them alive with Christ. Genesis 9 still grounds justice in the image of God after the Fall.',
          interpretation:
            'Reformed theology holds that the image is defaced but not erased. Humans remain responsible image-bearers who do relative civic good, yet lack spiritual ability to please God savingly apart from regenerating grace.',
          disagreement:
            'Pelagian and some semi-Pelagian approaches treat the will as essentially free to choose God without prior regenerating grace. Other traditions may describe depravity with different emphasis. This lesson teaches the classic Reformed view while noting the disagreement rather than mocking opponents.',
        },
        {
          kind: 'attribution',
          teacherId: 'sproul',
          work: 'Teaching on human fallenness and grace',
          note:
            'Supplementary emphasis: taking sin seriously magnifies grace. Original paraphrase of a widely known Sproul theme—not a citation of a specific sermon manuscript.',
        },
        {
          kind: 'attribution',
          teacherId: 'macarthur',
          work: 'Biblical teaching on the Fall and repentance',
          note:
            'Supplementary pastoral stress: Scripture’s diagnosis of the heart drives repentance and faith in Christ rather than self-esteem religion.',
        },
        {
          kind: 'teaching',
          title: 'Hope without denial',
          body:
            'A true anthropology is severe and hopeful. Severe, because we cannot save ourselves. Hopeful, because the last Adam—Jesus—obeys, dies, and rises for sinners, and the Spirit renews the image in those united to Him (see Colossians 3:10).',
        },
      ],
      questions: [
        ...L5_QUESTIONS,
        mc(
          'nom-5-review-purpose',
          'Review: Humanity’s chief purpose in this topic is best summarized as…',
          [
            'Glorifying God and enjoying Him forever',
            'Escaping all responsibility',
            'Becoming divine',
            'Ignoring Scripture',
          ],
          0,
        ),
      ],
      reflectionPrompts: [
        'Confess a specific pattern of sin to God, then thank Him for one concrete mercy of Christ that meets that need.',
      ],
      furtherStudy: [
        'Read Romans 5:12–21 and list contrasts between Adam and Christ.',
        'Journal how Ephesians 2:1–10 moves from death to grace to good works prepared by God.',
      ],
      reviewFromLessonIds: [
        'nature-of-man-image',
        'nature-of-man-purpose',
      ],
    },
  ],
}
