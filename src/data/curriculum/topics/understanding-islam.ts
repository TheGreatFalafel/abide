import type { CurriculumTopic } from '../types'
import {
  PRIMARY_HADITH,
  PRIMARY_QURAN,
  SOURCE_SPROUL_EVANG,
} from '../evangelismSources'
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
  Q('is-b1', 'Who is the founder of Islam?', ['Muhammad', 'Abraham', 'Moses', 'Gabriel'], 'A', 'beginner'),
  Q('is-b2', 'What is the Muslim holy book?', ['The Torah', 'The Quran', 'The Talmud', 'The Book of Mormon'], 'B', 'beginner'),
  Q('is-b3', 'How many Pillars of Islam are there?', ['3', '7', '5', '10'], 'C', 'beginner'),
  Q('is-b4', 'What is a Muslim place of worship called?', ['A mosque', 'A synagogue', 'A temple', 'A cathedral'], 'A', 'beginner'),
  Q('is-b5', 'Which month do Muslims fast?', ['Ramadan', 'Hajj', 'Advent', 'Passover'], 'A', 'beginner'),
  Q('is-b6', 'The word "Islam" means:', ['Submission', 'Peace only', 'War', 'Pilgrimage'], 'A', 'beginner'),
  Q('is-b7', 'Muslims believe Jesus is:', ['The Son of God', 'A prophet but not the Son of God', 'A myth', 'Divine'], 'B', 'beginner'),
  Q('is-b8', 'Which verse says Jesus is the way, the truth, and the life?', ['John 14:6', 'John 1:1', 'Genesis 1:1', 'Psalm 1:1'], 'A', 'beginner'),
]

const INTERMEDIATE = [
  Q('is-i1', 'The *Hijra* (622) marks:', ["Muhammad's birth", 'His migration to Medina and the start of the Islamic calendar', 'The conquest of Mecca', 'The first revelation'], 'B', 'intermediate'),
  Q('is-i2', 'The *shahada* is:', ["A creed that there is no god but God and that Muhammad is God's messenger", 'A fast', 'A pilgrimage', 'A tax'], 'A', 'intermediate'),
  Q('is-i3', 'The Sunni-Shia division arose over:', ['The date of Ramadan', 'The succession of leadership after Muhammad', 'The Bible', 'Prayer direction'], 'B', 'intermediate'),
  Q('is-i4', '*Tawhid* refers to:', ['The oneness of God', 'Prayer times', 'Pilgrimage', 'Charity'], 'A', 'intermediate'),
  Q('is-i5', '*Shirk* is:', ['Associating partners with God, considered the unforgivable sin (Quran 4:48)', 'Fasting', 'Almsgiving', 'The call to prayer'], 'A', 'intermediate'),
  Q('is-i6', 'The *Hadith* are:', ["Reports of Muhammad's words and actions", 'Poems', 'The Torah', 'Commentary on the Bible'], 'A', 'intermediate'),
  Q('is-i7', 'Muslims commonly say the Bible has been:', ['Preserved perfectly', 'Corrupted (*tahrif*)', 'Burned', 'Never written'], 'B', 'intermediate'),
  Q('is-i8', 'In Islam, salvation depends on:', ["Grace only", 'Faith and deeds weighed on the Day of Judgment, with hope in God\'s mercy', 'Baptism', 'Birth'], 'B', 'intermediate'),
  Q('is-i9', 'Quran 4:157 says about Jesus:', ['He was crucified', 'He was not crucified, though it appeared so', 'He never lived', 'He rose from the dead'], 'B', 'intermediate'),
]

const ADVANCED = [
  Q('is-a1', "Which sources outside the New Testament mention Jesus' crucifixion?", ['Tacitus and Josephus', 'Plato', 'Homer', 'Aristotle'], 'A', 'advanced'),
  Q('is-a2', 'Quran 112 says God "begets not nor is begotten." A Christian response is that:', ["The Son's eternal generation is not physical begetting; the Bible does not teach that God had a wife (John 1:14, 18)", 'The verse is false', 'Mary is divine', 'The Trinity is three gods'], 'A', 'advanced'),
  Q('is-a3', 'The standard text of the Quran was compiled under the caliph:', ['Uthman (c. 650)', 'Constantine', 'Ali', 'Muhammad himself'], 'A', 'advanced'),
  Q('is-a4', 'Why does Galatians 1:8-9 matter for evaluating a revelation claimed through an angel?', ['It says any "other gospel," even from an angel, is accursed', 'It confirms new revelation', 'It is about circumcision only', 'It is about Gabriel'], 'A', 'advanced'),
  Q('is-a5', 'Hebrews 1:1-2 teaches:', ['God has spoken finally and fully in His Son', 'God has stopped speaking', 'New prophets will replace Christ', 'The Law is final'], 'A', 'advanced'),
  Q('is-a6', 'Which Christian doctrine answers the question "Was God loving before creation?"', ['The Trinity (John 17:24)', 'Modalism', 'Deism', 'Polytheism'], 'A', 'advanced'),
  Q('is-a7', '"Seal of the prophets" (Quran 33:40) refers to:', ['Muhammad as the last prophet', 'Moses', 'Jesus', 'Abraham'], 'A', 'advanced'),
  Q('is-a8', 'Why is friendship important in Muslim evangelism?', ['Muslims often come from honor-and-shame, community-oriented cultures where trust matters (Colossians 4:5-6)', 'Muslims do not read', 'It replaces the gospel', 'It is a tactic only'], 'A', 'advanced'),
]

export const UNDERSTANDING_ISLAM: CurriculumTopic = {
  id: 'understanding-islam',
  title: 'Understanding Islam',
  description:
    'Muhammad, the Quran, pillars, and Muslim belief — described respectfully from Islamic sources, with biblical responses on God, Christ, Scripture, and salvation, and guidance for friendship and witness.',
  objectives: [
    'Summarize Islamic origins, pillars, and sources of authority.',
    'Compare Islam and Christianity on God, Jesus, Scripture, and salvation.',
    'Respond to objections about the Trinity, crucifixion, and Bible reliability.',
    'Engage Muslim neighbors with respect, patience, and the gospel.',
  ],
  estimatedMinutes: 75,
  prerequisites: ['gospel-foundations'],
  framework: 'reformed',
  domain: 'evangelism-apologetics',
  contentStatus: 'full',
  version: 1,
  sources: [
    { ...SOURCE_SPROUL_EVANG, note: 'Supplementary clarity on gospel exclusivity — paraphrase only.' },
    { ...SOURCE_MACARTHUR_SUP, note: 'Christological exclusivity and witness under Scripture — paraphrase only.' },
  ],
  lessons: [
    {
      id: 'is-origins-pillars',
      order: 1,
      title: 'Origins, Quran, and Five Pillars',
      estimatedMinutes: 25,
      objectives: [
        'Outline Muhammad, Hijra, and Sunni-Shia division.',
        'Name the Five Pillars and basic Muslim beliefs.',
        'Treat Muslim neighbors with respect and love.',
      ],
      primaryPassages: [passage('colossians', 'Colossians', 4, 5, 6)],
      supportingPassages: [passage('john', 'John', 14, 6, 6)],
      content: [
        {
          kind: 'teaching',
          title: 'Origins',
          body:
            'Islam began in seventh-century Arabia with Muhammad (c. 570–632). Muslims believe he received the Quran from Gabriel from c. 610. The Hijra (622) to Medina starts the Islamic calendar. After his death, Sunni and Shia communities divided over leadership. Islam means submission. The Quran has 114 surahs; Hadith reports supplement authority. Beliefs include God, angels, books, prophets, the last day, and divine decree.',
        },
        {
          kind: 'teaching',
          title: 'Five Pillars',
          body:
            'The shahada (creed), salat (prayer), zakat (almsgiving), sawm (fasting in Ramadan), and hajj (pilgrimage) structure Muslim practice. Muslims worship in mosques. Diversity exists among Sunni, Shia, Sufi, and cultural Muslims — do not assume uniform practice.',
        },
        {
          kind: 'primary_source',
          ...PRIMARY_QURAN,
          context: 'Islamic scripture cited by surah and ayah in lessons — paraphrase only in app text.',
          significance: 'Primary source for what Muslims affirm; describe fairly from reputable translations in study, not pasted here.',
        },
        {
          kind: 'distinction',
          biblical: 'Colossians 4:5–6 calls for gracious speech; John 14:6 confesses Christ as the way.',
          interpretation: 'Witness begins with friendship and truth, not insults toward Muhammad or the Quran.',
          disagreement: 'Muslims reject Trinity and crucifixion as taught in the Quran — know official teaching while honoring individuals.',
        },
        { kind: 'attribution', teacherId: 'sproul', work: 'Published Ligonier teaching (themes)', note: 'Supplementary cue: exclusivity of Christ — paraphrase only.' },
      ],
      questions: BEGINNER,
      reflectionPrompts: ['Pray for a Muslim neighbor by name.', 'What would it look like to listen first this week?'],
      furtherStudy: ['Learn the meaning of the shahada from an Islamic introduction (paraphrase in your notes).'],
    },
    {
      id: 'is-beliefs-response',
      order: 2,
      title: 'Beliefs and Scripture’s Response',
      estimatedMinutes: 25,
      objectives: [
        'Contrast tawhid and Trinity fairly.',
        'Explain Christian teaching on Christ’s death and resurrection.',
        'Address tahrif claims and final revelation in the Son.',
      ],
      primaryPassages: [passage('1corinthians', '1 Corinthians', 15, 3, 4)],
      supportingPassages: [passage('hebrews', 'Hebrews', 1, 1, 2)],
      content: [
        {
          kind: 'teaching',
          title: 'God and Christ',
          body:
            'Islam teaches absolute divine oneness (*tawhid*); Trinity is rejected as shirk (Quran 4:171; 5:73). Jesus (Isa) is honored as virgin-born prophet, not Son of God, and crucifixion is denied (Quran 4:157). Christianity teaches one God in three persons (Matthew 28:19; John 1:1; 20:28) and Christ’s death and resurrection (1 Corinthians 15:3–4).',
        },
        {
          kind: 'teaching',
          title: 'Scripture and salvation',
          body:
            'Muslims often claim Bible corruption (*tahrif*); Christians point to manuscript evidence and Isaiah 40:8. Muhammad is seal of the prophets (Quran 33:40); Galatians 1:8–9 and Deuteronomy 18:20–22 test prophetic claims. Salvation in Islam involves faith and deeds weighed with hope in mercy; Scripture teaches grace through faith with assurance possible (Ephesians 2:8–9; 1 John 5:13). All are sinners needing a Savior (Romans 3:23; 5:12).',
        },
        {
          kind: 'primary_source',
          ...PRIMARY_HADITH,
          context: 'Second-tier authority in Sunni Islam after Quran.',
          significance: 'Use named collections when describing practice; note Sunni/Shia differences in corpora.',
        },
        {
          kind: 'distinction',
          biblical: 'Hebrews 1:1–2 teaches God’s final word in the Son; 1 Corinthians 15 centers the cross.',
          interpretation: 'Explain Trinity as one God in three persons, not three gods.',
          disagreement: 'Historical sources (Tacitus, Josephus) mention crucifixion outside the Gospels — use carefully, not as replacing Scripture.',
        },
        { kind: 'attribution', teacherId: 'macarthur', work: 'Published biblical teaching (themes)', note: 'Christ-centered response — paraphrase only.' },
      ],
      questions: INTERMEDIATE,
      reflectionPrompts: ['Ask God for humility when explaining doctrines Muslims find offensive.'],
      furtherStudy: ['Read 1 Corinthians 15:3–8 and list eyewitness themes.'],
    },
    {
      id: 'is-engage-objections',
      order: 3,
      title: 'Objections, Engagement, and Witness',
      estimatedMinutes: 25,
      objectives: [
        'Answer Quran 112 and eternal generation without ridicule.',
        'Present cross as mercy and justice (Romans 3:25–26).',
        'Avoid stereotypes; persevere in friendship and prayer.',
      ],
      primaryPassages: [passage('romans', 'Romans', 3, 25, 26)],
      supportingPassages: [passage('galatians', 'Galatians', 1, 8, 9)],
      content: [
        {
          kind: 'teaching',
          title: 'How to engage',
          body:
            'Befriend; ask about family and faith; listen; read Gospel of John together when appropriate; avoid insulting Muhammad or the Quran; explain Trinity humbly; present the cross as God’s mercy and justice together; pray and persevere. Converts may face family pressure — be patient.',
        },
        {
          kind: 'teaching',
          title: 'Common objections',
          body:
            'Quran 112 rejects begetting; Christians respond that eternal generation is not physical. Trinity answers how God was love before creation (John 17:24). Galatians 1:8–9 applies to angelic revelations. Uthman’s compilation (c. 650) is standard Islamic history on the Quran text.',
          level: 'advanced',
        },
        {
          kind: 'distinction',
          biblical: 'Romans 3:25–26 displays propitiation and justice; Galatians 1 guards the gospel.',
          interpretation: 'Do not treat all Muslims as violent or identical — honor-and-shame cultures value trust.',
          disagreement: 'Polemic without love fails 1 Peter 3:15; friendship without gospel fails the Great Commission.',
        },
        { kind: 'attribution', teacherId: 'packer', work: 'Evangelism and the Sovereignty of God (themes)', note: 'Prayer and perseverance in witness — paraphrase only.' },
      ],
      questions: ADVANCED,
      interactiveExercises: [
        {
          kind: 'conversation',
          prompt: 'Conversation practice',
          scenario:
            'A Muslim coworker, Amir, asks how Christians can believe God has a Son. Your aim is clarity and gentleness — not winning an argument.',
          partnerName: 'Amir',
          steps: [
            {
              partnerLine:
                'If God has a Son, that means He took a wife. That is shirk. How can you say God is one?',
              choices: [
                {
                  text: 'Your religion is stupid and Muhammad was a fake.',
                  quality: 'hostile',
                  explanation:
                    'Insults close ears and violate 1 Peter 3:15. Never attack Muhammad as your opening move.',
                },
                {
                  text: 'Thank you for asking — that is a serious question. Christians do not mean a physical son. We mean the eternal Son who shares the one God’s nature, revealed in Jesus (John 1:1, 14). May I show you a short passage?',
                  quality: 'helpful',
                  explanation:
                    'You honor the concern about shirk, clarify terms, and invite Scripture without mockery.',
                },
                {
                  text: 'All religions are basically the same, so it does not matter.',
                  quality: 'incomplete',
                  explanation:
                    'That dodges the question and denies the gospel’s exclusive claim (John 14:6).',
                },
                {
                  text: 'The Trinity means three gods who share power.',
                  quality: 'inaccurate',
                  explanation:
                    'That confirms the misunderstanding. Historic Christianity confesses one God in three persons.',
                },
              ],
            },
            {
              partnerLine: 'But the Quran says Jesus was not crucified. Why trust your book?',
              choices: [
                {
                  text: 'Because Western culture says so.',
                  quality: 'incomplete',
                  explanation: 'Culture is not the Christian ground of confidence.',
                },
                {
                  text: 'The apostles preached a crucified and risen Christ as eyewitnesses (1 Corinthians 15:3–8). The manuscript evidence for the New Testament is vast. May we read that chapter together?',
                  quality: 'helpful',
                  explanation:
                    'You point to apostolic testimony and invite shared reading without insulting the Quran.',
                },
                {
                  text: 'You are just brainwashed by your imam.',
                  quality: 'hostile',
                  explanation: 'Ad hominem attack; reverse it and you would reject the gospel too.',
                },
                {
                  text: 'Actually Jesus never died — the apostles were wrong.',
                  quality: 'inaccurate',
                  explanation: 'That abandons the gospel rather than explaining it.',
                },
              ],
            },
          ],
        },
      ],
      reflectionPrompts: ['Who is one Muslim you can encourage this week, regardless of debate outcomes?'],
      furtherStudy: ['Read Romans 3:21–26 slowly, noting mercy and justice together.'],
    },
  ],
}
