import type { CurriculumTopic } from '../types'
import {
  PRIMARY_HADITH,
  PRIMARY_QURAN,
  SOURCE_FRAME_SUP,
  SOURCE_PACKER_ORG,
  SOURCE_SPROUL_EVANG,
} from '../evangelismSources'
import { mc, open, passage } from './_helpers'

/**
 * Phase 7 — comparative worldview: Understanding Islam.
 * Represent Islamic teaching accurately (Quran/Hadith categories, diversity)
 * before Reformed evangelical comparison and gospel witness practice.
 */
export const UNDERSTANDING_ISLAM: CurriculumTopic = {
  id: 'understanding-islam',
  title: 'Understanding Islam',
  description:
    'A fair introduction to Islam: origins and sources, Allah and Jesus in Islamic teaching, salvation and the Five Pillars, Sunni–Shia diversity, major differences with historic Christianity, common questions, and respectful gospel conversation — Scripture final, no caricatures.',
  objectives: [
    'Describe Islam’s origins and major sources of authority without caricature.',
    'Explain Islamic teaching on God, Jesus, salvation, and practice in Islamic categories first.',
    'Recognize Sunni, Shia, and wider diversity within the Muslim world.',
    'State major differences with historic Reformed Christianity accurately.',
    'Practice listening, clear gospel speech, and humble replies to common Muslim questions.',
  ],
  estimatedMinutes: 210,
  prerequisites: ['gospel-foundations'],
  framework: 'reformed',
  domain: 'evangelism-apologetics',
  version: 1,
  sources: [
    {
      ...SOURCE_FRAME_SUP,
      note:
        'Supplementary method: listen to the alternative worldview carefully, then bring Christ’s lordship and the gospel — themes only.',
    },
    {
      ...SOURCE_PACKER_ORG,
      note:
        'Organizational reminder that witness serves God’s Word with humility, not debate sport — themes only.',
    },
    {
      ...SOURCE_SPROUL_EVANG,
      note:
        'Supplementary clarity on Trinity, incarnation, and justification when comparing with Islamic monotheism — paraphrase themes only.',
    },
  ],
  lessons: [
    {
      id: 'islam-introduction-origins',
      order: 1,
      title: 'Introduction to Islam',
      estimatedMinutes: 20,
      objectives: [
        'Locate Muhammad and early Islam in seventh-century Arabia.',
        'Distinguish Islamic self-understanding from later polemical cartoons.',
        'State why accurate listening precedes Christian response.',
      ],
      primaryPassages: [passage('acts', 'Acts', 17, 22, 28)],
      supportingPassages: [passage('1peter', '1 Peter', 3, 15, 16)],
      content: [
        {
          kind: 'teaching',
          title: 'Start with accuracy',
          body:
            'Islam (from a root associated with “submission/peace”) is the religion that confesses there is no god but Allah and that Muhammad is his messenger. Muslims understand Islam as the restoration of pure monotheism, continuous with earlier prophets. Christians must describe that claim fairly before evaluating it from Scripture.',
        },
        {
          kind: 'teaching',
          title: 'Seventh-century setting',
          body:
            'Traditional Islamic narrative places Muhammad (c. 570–632 CE) in Mecca and Medina amid tribal polytheism, trade routes, and contact with Jews and Christians. After the Hijra to Medina (622 CE), a community formed with worship, law, and expanding influence. Academic historians debate details of sources and chronology; state what is widely agreed, what is traditional, and what is disputed.',
        },
        {
          kind: 'concept',
          term: 'Muslim',
          explanation:
            'One who submits to Allah. Over a billion people identify as Muslim; culture, language, and practice vary widely. Never treat one friend’s habits as “official Islam for everyone.”',
        },
        {
          kind: 'concept',
          term: 'Ummah',
          explanation:
            'The worldwide community of Muslims. Ideal unity coexists with deep historical and theological diversity.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('acts', 'Acts', 17, 22, 23),
          note:
            'Interpretation: Paul begins with careful observation of Athens before proclamation — a model for learning a neighbor’s worldview before speaking.',
        },
        {
          kind: 'distinction',
          biblical:
            'Scripture commands truthful speech and neighbor-love; Acts models informed engagement with other religions’ claims.',
          interpretation:
            'Reformed evangelicals can say Islam’s gospel claim is false while still describing Muslim history and belief accurately and treating persons with dignity.',
          disagreement:
            'Some polemics invent Muhammad as only a warlord cartoon; some relativism forbids any critique. Refuse both. Represent Islamic origins as Muslims tell them, then note historical debates honestly.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'true_false',
          prompt:
            'A wise first goal in studying Islam for witness is to learn how Muslims themselves describe their faith before offering Christian critique.',
          answer: true,
          explanation:
            'Accuracy and love require understanding before answering.',
        },
      ],
      questions: [
        mc(
          'islam-intro-q1',
          'In Islamic self-understanding, Muhammad is primarily:',
          [
            'The incarnate Son of God',
            'The final prophet/messenger of Allah',
            'One among many equal Greek philosophers',
            'A figure Muslims deny existed',
          ],
          1,
          'Islam confesses Muhammad as Allah’s messenger, not as deity.',
        ),
        mc(
          'islam-intro-q2',
          'When history of early Islam is debated among scholars, this course urges you to:',
          [
            'Pretend every detail is equally certain',
            'Distinguish tradition, widely granted facts, and disputed reconstructions',
            'Refuse to learn any Islamic history',
            'Replace all study with insults',
          ],
          1,
          'Honesty about uncertainty is part of academic responsibility.',
        ),
      ],
      reflectionPrompts: [
        'Ask God for love for Muslim neighbors and a hunger for truthful understanding.',
      ],
      furtherStudy: [
        'Write three questions you would ask a Muslim friend about how they came to their faith — listen without rebutting first.',
      ],
    },
    {
      id: 'islam-quran-sources',
      order: 2,
      title: 'The Quran and Islamic Sources',
      estimatedMinutes: 22,
      objectives: [
        'Explain the place of Quran, Hadith, Sunnah, and Sharia in Islamic authority.',
        'Distinguish revelation claims from Christian bibliology without mockery.',
        'Note that translation and interpretation involve human scholarship.',
      ],
      primaryPassages: [passage('2timothy', '2 Timothy', 3, 14, 17)],
      supportingPassages: [passage('hebrews', 'Hebrews', 1, 1, 3)],
      content: [
        {
          kind: 'teaching',
          title: 'Layers of authority',
          body:
            'For most Muslims, the Quran is Allah’s speech revealed to Muhammad in Arabic — recited, memorized, and supremely authoritative. Hadith are reports of Muhammad’s words and deeds; the Sunnah is his exemplary practice. Sharia refers to the divine law/path as understood through Quran, Sunnah, and jurisprudential reasoning (fiqh). Schools of law differ. Always ask which layer someone is citing.',
        },
        {
          kind: 'concept',
          term: 'Quran',
          explanation:
            'Islam’s scripture. Surahs (chapters) and ayahs (verses). Muslims typically hold the Arabic text as the revealed word; translations are helps, not replacements.',
        },
        {
          kind: 'concept',
          term: 'Hadith / Sunnah',
          explanation:
            'Hadith: transmitted reports. Sunnah: prophetic example. Classical scholarship developed chains of transmission (isnad) and grading. Sunni and Shia canons differ in emphasis and collections.',
        },
        {
          kind: 'primary_source',
          ...PRIMARY_QURAN,
          context:
            'Islamic scripture recited in worship and treated as Allah’s direct speech in Arabic.',
          significance:
            'Shows that Islamic authority is text-centered in a way Christians must understand before comparing “Bible vs Quran” slogans.',
          excerpt:
            'Summary only (no copyrighted translation paste): Muslims recite the Quran as revelation; Abide cites passages by surah:ayah and paraphrases themes (e.g., tawhid, prophethood, judgment).',
        },
        {
          kind: 'primary_source',
          ...PRIMARY_HADITH,
          context:
            'Reports that shape prayer, ethics, and law alongside the Quran for most traditional Muslims.',
          significance:
            'Explains why “the Quran alone” is not how classical Islam usually works in practice — Hadith and fiqh matter.',
          excerpt:
            'Summary only: Hadith collections organize reports by topic or companion; authenticity grades matter in Islamic sciences. Do not invent quotations.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('hebrews', 'Hebrews', 1, 1, 2),
          note:
            'Interpretation: Christians confess God spoke by the prophets and definitively by the Son — a different climax of revelation than a final Arabian prophet.',
        },
        {
          kind: 'distinction',
          biblical:
            'Christians confess Scripture as God-breathed; the Son is the final Word (Hebrews 1).',
          interpretation:
            'Reformed evangelicals respectfully disagree that the Quran is God’s final revelation, while still describing Islamic sources accurately.',
          disagreement:
            'Muslims may view the Bible as corrupted; Christians may caricature the Quran. Represent each tradition’s claim before critique.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'match',
          prompt: 'Match the Islamic term to a careful description.',
          target: 'Hadith',
          choices: [
            'Reports of Muhammad’s words and deeds',
            'The Christian New Testament',
            'A denial that Allah exists',
            'The name of the Kaaba only',
          ],
          answer: 0,
          explanation:
            'Hadith are prophetic reports; they are not identical to the Quran itself.',
        },
      ],
      questions: [
        mc(
          'islam-sources-q1',
          'In mainstream Islamic practice, Sharia is best described as:',
          [
            'Only a modern political slogan with no classical roots',
            'The divine path/law as understood through Quran, Sunnah, and jurisprudence',
            'Identical to the Westminster Confession',
            'A Christian monastic rule',
          ],
          1,
          'Sharia is a classical Islamic legal-ethical concept with diverse applications.',
        ),
        mc(
          'islam-sources-q2',
          'When citing the Quran in Abide lessons, the preferred method is to:',
          [
            'Paste long modern copyrighted translations',
            'Paraphrase themes and cite surah:ayah references',
            'Invent ayah numbers',
            'Claim the Quran never mentions Jesus',
          ],
          1,
          'Respect copyright and accuracy: paraphrase + references.',
        ),
      ],
      reflectionPrompts: [
        'Thank God for Scripture, and ask for humility when comparing revelation claims.',
      ],
      furtherStudy: [
        'Look up how a Muslim study site explains “Quran and Sunnah” in their own words; note vocabulary before evaluating.',
      ],
      reviewFromLessonIds: ['islam-introduction-origins'],
    },
    {
      id: 'islam-allah-monotheism',
      order: 3,
      title: 'Who Is Allah?',
      estimatedMinutes: 20,
      objectives: [
        'Explain tawhid (Islamic monotheism) in Islamic terms.',
        'Compare carefully with Christian confession of the Triune God.',
        'Avoid both “same God trivially” slogans and needless insult.',
      ],
      primaryPassages: [passage('deuteronomy', 'Deuteronomy', 6, 4, 5)],
      supportingPassages: [
        passage('isaiah', 'Isaiah', 45, 5, 7),
        passage('matthew', 'Matthew', 28, 18, 20),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Tawhid',
          body:
            'Islamic theology centers on tawhid: the absolute oneness of Allah. Associating partners with Allah (shirk) is the gravest sin in classical teaching. Allah’s names and attributes are confessed; debates (e.g., how to speak of attributes) exist within Islamic theology. “Allah” is the Arabic word for God used by Arabic-speaking Christians too — the dispute is who God is, not merely a vocabulary fight.',
        },
        {
          kind: 'concept',
          term: 'Tawhid',
          explanation:
            'Absolute monotheism: one God, without partners, offspring, or division of deity as Islam understands it.',
        },
        {
          kind: 'concept',
          term: 'Shirk',
          explanation:
            'Associating partners with Allah. Classical Islam regards Christian claims about the Son and Spirit as shirk — a disagreement that must be faced honestly, not smoothed away.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('deuteronomy', 'Deuteronomy', 6, 4, 5),
          note:
            'Interpretation: Biblical monotheism is non-negotiable; the New Testament identifies the one God as Father, Son, and Spirit without three gods.',
        },
        {
          kind: 'distinction',
          biblical:
            'Scripture teaches one God and reveals Father, Son, and Spirit (baptismal name; apostolic blessing).',
          interpretation:
            'Reformed evangelicals confess the Trinity as biblical monotheism, not tritheism — and recognize that Muslims sincerely reject that confession as compromising oneness.',
          disagreement:
            'Some say Christians and Muslims “worship the same God” in a thin philosophical sense; others deny any overlap. This course: discuss Creator claims carefully, then the decisive revelation in Christ, without pretending the doctrines are identical.',
        },
        {
          kind: 'attribution',
          teacherId: 'sproul',
          work: 'Published Ligonier teaching on the gospel & apologetics (themes)',
          note:
            'Supplementary cue: classical theism and Trinity discussions require precision — paraphrase themes only.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'true_false',
          prompt:
            'Islamic tawhid and the Christian doctrine of the Trinity are identical once you ignore the words.',
          answer: false,
          explanation:
            'Both confess one God, but Christianity’s confession of Father, Son, and Spirit is precisely what classical Islam rejects as compromising oneness.',
        },
      ],
      questions: [
        mc(
          'islam-allah-q1',
          'Shirk, in Islamic teaching, most nearly means:',
          [
            'Giving generously to the poor',
            'Associating partners with Allah',
            'Reciting the Quran',
            'Making pilgrimage',
          ],
          1,
          'Shirk is the association of partners with God.',
        ),
        mc(
          'islam-allah-q2',
          'A careful Christian reply when asked “Do you worship three gods?” is to:',
          [
            'Agree that Christians are polytheists',
            'Explain biblical monotheism and the Trinity without contempt',
            'Refuse to answer ever',
            'Claim Muslims worship three gods',
          ],
          1,
          'Clarify; do not caricature either side.',
        ),
      ],
      reflectionPrompts: [
        'Worship the one Triune God, and ask for clarity without arrogance when speaking of him.',
      ],
      furtherStudy: ['Read Deuteronomy 6:4–5 and Matthew 28:18–20 side by side; note one God and Triune name.'],
      reviewFromLessonIds: ['islam-quran-sources'],
    },
    {
      id: 'islam-jesus',
      order: 4,
      title: 'Who Is Jesus in Islam?',
      estimatedMinutes: 22,
      objectives: [
        'State Islamic teaching on Jesus’ birth, miracles, and prophethood.',
        'Explain the Islamic denial of crucifixion/deity carefully.',
        'Contrast with New Testament claims without scorn.',
      ],
      primaryPassages: [passage('john', 'John', 1, 1, 14)],
      supportingPassages: [
        passage('1corinthians', '1 Corinthians', 15, 1, 8),
        passage('philippians', 'Philippians', 2, 5, 11),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Isa in the Quran',
          body:
            'The Quran speaks of Jesus (Isa) with honor: virgin birth, miracles by Allah’s permission, messiah title in some passages, and a major prophetic role. Islam denies that Jesus is the divine Son and typically denies that he was crucified (a substitute / appearance motif is often taught; interpretations vary). Jesus is not the final prophet; Muhammad is. Represent this with care — many Muslims revere Jesus while rejecting Christian gospel claims.',
        },
        {
          kind: 'concept',
          term: 'Isa',
          explanation:
            'The Quranic/Islamic name for Jesus. Honored prophet; not God incarnate in Islamic teaching.',
        },
        {
          kind: 'teaching',
          title: 'Where the paths diverge',
          body:
            'Christians confess Jesus as eternal Son, crucified and risen for sinners. Islam honors Jesus as prophet and rejects incarnation, atoning cross, and (usually) crucifixion. The disagreement is not a small scheduling conflict — it is the center of the gospel. Speak firmly and gently.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('1corinthians', '1 Corinthians', 15, 3, 4),
          note:
            'Interpretation: Paul summarizes the gospel as Christ died for sins, was buried, and was raised — historical and salvific claims Islam does not accept.',
        },
        {
          kind: 'distinction',
          biblical:
            'The NT proclaims Jesus’ deity, death, and bodily resurrection as the heart of salvation.',
          interpretation:
            'Reformed evangelicals insist on these truths while acknowledging Islamic honor for Jesus as prophet — honor that is real, yet not the gospel.',
          disagreement:
            'Muslim interpreters differ on details of Quran 4:157 and related texts. Ask what your friend believes rather than assuming one YouTube clip.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'conversation',
          prompt: 'Conversation practice',
          scenario:
            'A Muslim coworker asks why Christians say Jesus is God when Islam teaches he is a prophet. Practice clarity and respect.',
          partnerName: 'Amir',
          steps: [
            {
              partnerLine:
                'We honor Jesus as a prophet. Why do you call him God? That sounds like shirk.',
              choices: [
                {
                  text: 'Your whole religion is demonic nonsense.',
                  quality: 'hostile',
                  explanation:
                    'Insulting Islam and Muslims closes ears and violates 1 Peter 3:15.',
                },
                {
                  text: 'I respect that you honor Jesus. Christians believe the New Testament reveals him as the eternal Son who became man — one God, not three gods. Can I show you why that matters for forgiveness?',
                  quality: 'helpful',
                  explanation:
                    'You honor their reverence, clarify Trinity/incarnation carefully, and open toward the gospel.',
                },
                {
                  text: 'Yeah, maybe he was just a good teacher for us too.',
                  quality: 'incomplete',
                  explanation:
                    'That abandons the NT claim without answering the question.',
                },
                {
                  text: 'Actually the Quran proves the Trinity if you squint.',
                  quality: 'inaccurate',
                  explanation:
                    'Do not force Islamic texts to teach Christian doctrine; argue from Scripture’s claims honestly.',
                },
              ],
            },
          ],
        },
      ],
      questions: [
        mc(
          'islam-jesus-q1',
          'Islamic teaching typically affirms that Jesus:',
          [
            'Is the second person of the Trinity',
            'Was born of a virgin and worked miracles, yet is not God incarnate',
            'Never existed',
            'Wrote the Gospel of John',
          ],
          1,
          'Honor + prophethood without incarnation is the usual Islamic pattern.',
        ),
        mc(
          'islam-jesus-q2',
          'The Christian gospel’s non-negotiable center that Islam does not accept is especially:',
          [
            'That Jesus was a moral teacher only for Jews',
            'That Jesus is divine Son, crucified and risen for sinners',
            'That pilgrimage to Mecca is required',
            'That Hadith are Christian scripture',
          ],
          1,
          'Deity, cross, and resurrection are the gospel’s heart.',
        ),
      ],
      reflectionPrompts: [
        'Confess Jesus as Lord, and ask for patience when explaining him to those who honor him differently.',
      ],
      furtherStudy: [
        'Read John 1:1–18 and note every claim about the Word that exceeds “prophet only.”',
      ],
      reviewFromLessonIds: ['islam-allah-monotheism'],
    },
    {
      id: 'islam-salvation-afterlife',
      order: 5,
      title: 'Salvation and the Afterlife',
      estimatedMinutes: 20,
      objectives: [
        'Describe Islamic themes of sin, repentance, deeds, mercy, and judgment.',
        'Contrast with justification by grace through faith in Christ.',
        'Avoid claiming every Muslim holds identical soteriology.',
      ],
      primaryPassages: [passage('romans', 'Romans', 3, 21, 26)],
      supportingPassages: [
        passage('ephesians', 'Ephesians', 2, 8, 10),
        passage('john', 'John', 3, 16, 18),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Mercy, deeds, and the scale',
          body:
            'Islamic teaching emphasizes Allah’s mercy and justice, human accountability, repentance, and the weighing of deeds. Paradise and hell are vivid realities. There is no Christian doctrine of substitutionary atonement by a crucified Son. Assurance language differs across Muslim communities — some stress hope in mercy; some emphasize fear of judgment. Ask individuals what they trust.',
        },
        {
          kind: 'concept',
          term: 'Tawba (repentance)',
          explanation:
            'Turning back to Allah in repentance. Important in Islamic piety; not identical to Christian repentance-and-faith united to Christ’s finished work.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('romans', 'Romans', 3, 23, 26),
          note:
            'Interpretation: All sinned; justification is by God’s grace through the propitiation in Christ’s blood — a different structure from a deeds-scale hope.',
        },
        {
          kind: 'distinction',
          biblical:
            'The NT teaches justification by grace through faith, grounded in Christ’s cross and resurrection, producing good works as fruit.',
          interpretation:
            'Reformed evangelicals commend free grace in Christ while acknowledging Muslim seriousness about obedience and judgment.',
          disagreement:
            'Popular Christian slogans that “Muslims earn salvation by works alone” can oversimplify Islamic appeals to mercy. Represent both mercy and deeds themes.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'match',
          prompt: 'Match the tradition to its characteristic salvation center (careful summary).',
          target: 'Historic Reformed Christianity',
          choices: [
            'Justification by grace through faith in the crucified and risen Christ',
            'Final prophet’s example as the only atonement',
            'Reincarnation until moksha',
            'Denial of any afterlife',
          ],
          answer: 0,
          explanation:
            'Christian gospel centers on Christ’s atoning work received by faith.',
        },
      ],
      questions: [
        mc(
          'islam-salv-q1',
          'A fair description of Islamic afterlife teaching includes:',
          [
            'No judgment and no paradise language',
            'Accountability, mercy, and destinies of paradise/hell',
            'Identical Westminster soteriology',
            'Automatic universalism for all religions',
          ],
          1,
          'Judgment and mercy are both major themes.',
        ),
        mc(
          'islam-salv-q2',
          'When explaining the gospel to a Muslim friend, a central Christian gift to clarify is:',
          [
            'A new dietary law code as the way of salvation',
            'Forgiveness and righteousness grounded in Christ’s finished work',
            'That good deeds never matter for Christians',
            'That Muhammad is also Lord',
          ],
          1,
          'Point to Christ’s cross and resurrection as the ground of acceptance with God.',
        ),
      ],
      reflectionPrompts: [
        'Rest in justification by faith, and ask for words that make grace clear without belittling a friend’s moral seriousness.',
      ],
      furtherStudy: ['Memorize Ephesians 2:8–9 and note verse 10’s place for good works.'],
      reviewFromLessonIds: ['islam-jesus'],
    },
    {
      id: 'islam-five-pillars',
      order: 6,
      title: 'The Five Pillars',
      estimatedMinutes: 18,
      objectives: [
        'Name and briefly explain the Five Pillars.',
        'Relate practice to Islamic devotion without mockery.',
        'Distinguish pillars from Christian means of grace.',
      ],
      primaryPassages: [passage('romans', 'Romans', 12, 1, 2)],
      supportingPassages: [passage('acts', 'Acts', 2, 42, 47)],
      content: [
        {
          kind: 'teaching',
          title: 'Embodied devotion',
          body:
            'The Five Pillars (Shahada, salah/prayer, zakat/almsgiving, sawm/fasting in Ramadan, hajj/pilgrimage) structure much Sunni practice. Details and emphasis vary; Shia practice overlaps with distinctive elements (e.g., additional practices emphasized in some traditions). Pillars express submission; they are not a Christian “works-righteousness” cartoon — they are worship and obedience in Islamic terms.',
        },
        {
          kind: 'concept',
          term: 'Shahada',
          explanation:
            'The confession: there is no god but Allah, and Muhammad is his messenger. Entrance marker into Islam for many communities.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('romans', 'Romans', 12, 1, 1),
          note:
            'Interpretation: Christian worship is living sacrifice in response to mercy — different structure from the Five Pillars, yet both traditions care about embodied devotion.',
        },
        {
          kind: 'distinction',
          biblical:
            'Christians gather around Word, prayer, baptism, and the Lord’s Supper as Christ’s gifts.',
          interpretation:
            'Reformed worship is gospel-shaped response, not a parallel “five Christian pillars” checklist to win acceptance.',
          disagreement:
            'Do not mock prayer postures or fasting; ask what they mean to your friend.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'order',
          prompt: 'Order the Five Pillars in the common teaching sequence.',
          items: [
            'Shahada (confession)',
            'Salah (prayer)',
            'Zakat (almsgiving)',
            'Sawm (fasting)',
            'Hajj (pilgrimage)',
          ],
          answerOrder: [0, 1, 2, 3, 4],
          explanation:
            'Common pedagogical order: confession, prayer, charity, fasting, pilgrimage.',
        },
      ],
      questions: [
        mc(
          'islam-pillars-q1',
          'The Shahada primarily confesses:',
          [
            'The Trinity and incarnation',
            'Allah’s oneness and Muhammad’s messengership',
            'That Jesus is the final prophet',
            'That the Bible alone is infallible',
          ],
          1,
          'Tawhid + Muhammad’s prophethood.',
        ),
        mc(
          'islam-pillars-q2',
          'A respectful Christian posture toward Ramadan fasting is to:',
          [
            'Mock hunger publicly',
            'Recognize devotion while still holding the gospel’s distinct claims',
            'Pretend Christians must keep Ramadan to be saved',
            'Deny that Muslims pray',
          ],
          1,
          'Respect persons; keep theological clarity.',
        ),
      ],
      reflectionPrompts: [
        'Examine your own habits of prayer and generosity; ask whether your life adorns the gospel you confess.',
      ],
      furtherStudy: [
        'Ask a Muslim friend (if appropriate) what Ramadan means to them personally — listen for five minutes before any reply.',
      ],
      reviewFromLessonIds: ['islam-salvation-afterlife'],
    },
    {
      id: 'islam-differences-christianity',
      order: 7,
      title: 'Major Differences with Christianity',
      estimatedMinutes: 22,
      objectives: [
        'Summarize differences on Trinity, incarnation, atonement, and Scripture.',
        'Keep the gospel clear without contempt.',
        'Practice a Trinity / three-gods conversation.',
      ],
      primaryPassages: [passage('john', 'John', 14, 1, 11)],
      supportingPassages: [
        passage('romans', 'Romans', 5, 6, 11),
        passage('2timothy', '2 Timothy', 3, 14, 17),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Name the differences without hatred',
          body:
            'Key divergences: Trinity vs absolute unitarian tawhid; incarnation vs prophet-only Christology; cross and resurrection vs typical denial of crucifixion and different salvation structure; Bible as God-breathed Christian Scripture vs Islamic claims of corruption/supersession by the Quran. Common grace goods (family, justice, prayerfulness) do not erase these differences.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('romans', 'Romans', 5, 8, 9),
          note:
            'Interpretation: God shows love in Christ’s death for sinners — atonement at the center.',
        },
        {
          kind: 'distinction',
          biblical:
            'NT: Triune name, incarnate Son, cross, empty tomb, apostolic gospel.',
          interpretation:
            'Reformed evangelicals hold these as non-negotiable while seeking peaceable life with Muslim neighbors.',
          disagreement:
            'Interfaith projects sometimes blur doctrine for social harmony. Social peace is good; syncretism is not faithfulness.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'conversation',
          prompt: 'Conversation practice',
          scenario:
            'A Muslim classmate says Christians worship three gods and that the Trinity is illogical. Practice a clear, patient reply.',
          partnerName: 'Layla',
          steps: [
            {
              partnerLine:
                'How can you say God is one and also Father, Son, and Spirit? That is three gods.',
              choices: [
                {
                  text: 'You’re too stupid to understand mystery.',
                  quality: 'hostile',
                  explanation: 'Insult is not explanation.',
                },
                {
                  text: 'Christians confess one God in three persons — not three gods. It’s hard language, and I won’t pretend it’s a math puzzle. Can I show how Jesus’ words and the apostles lead us there, and why the cross needs a divine Savior?',
                  quality: 'helpful',
                  explanation:
                    'You deny tritheism, admit difficulty honestly, and steer toward Scripture and the gospel.',
                },
                {
                  text: 'Fine — we worship three gods.',
                  quality: 'inaccurate',
                  explanation:
                    'That concedes a misunderstanding of Christian teaching.',
                },
                {
                  text: 'Whatever; doctrine doesn’t matter.',
                  quality: 'incomplete',
                  explanation:
                    'Doctrine about God matters for worship and salvation.',
                },
              ],
            },
          ],
        },
      ],
      questions: [
        mc(
          'islam-diff-q1',
          'Which pair correctly names a major Islam–Christianity divergence?',
          [
            'Both affirm the crucifixion of Jesus as atoning',
            'Trinity/incarnation vs unitarian tawhid and prophet-only Christology',
            'Both deny any final judgment',
            'Both require hajj for salvation',
          ],
          1,
          'God and Christology sit at the center of the divide.',
        ),
        open(
          'islam-diff-open',
          'In two sentences, state one Islamic claim and the Christian counter-claim about Jesus without using insulting language.',
        ),
      ],
      reflectionPrompts: [
        'Pray for clarity on the gospel’s uniqueness and for kindness in speech.',
      ],
      furtherStudy: ['Outline John 14:1–11; note Jesus’ claims about the Father and himself.'],
      reviewFromLessonIds: ['islam-five-pillars', 'islam-jesus'],
    },
    {
      id: 'islam-diversity-sunni-shia',
      order: 8,
      title: 'Muslim Perspectives and Diversity',
      estimatedMinutes: 20,
      objectives: [
        'Sketch Sunni and Shia divergence historically and theologically.',
        'Note cultural and contemporary variation.',
        'Refuse monolithic stereotypes.',
      ],
      primaryPassages: [passage('colossians', 'Colossians', 4, 5, 6)],
      supportingPassages: [passage('james', 'James', 1, 19, 20)],
      content: [
        {
          kind: 'teaching',
          title: 'Not one block',
          body:
            'After Muhammad’s death, disputes over leadership shaped lasting communities. Broadly, Sunni Islam emphasizes the caliphate/companions’ consensus path; Shia Islam emphasizes the rightful leadership of Ali and the Imams (with internal Shia diversity). Sufism describes mystical/devotional currents across communities. Law schools, cultures, languages, and modern politics multiply difference. A Muslim from Indonesia, Iran, Senegal, and Detroit may share Shahada and differ in almost everything else of daily feel.',
        },
        {
          kind: 'concept',
          term: 'Sunni / Shia',
          explanation:
            'Major historic branches with distinct leadership narratives and some ritual/theological emphases. Neither is a tiny sect; both contain further schools.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('colossians', 'Colossians', 4, 5, 6),
          note:
            'Interpretation: Walk wisely toward outsiders; let speech be gracious and seasoned — including when difference is complex.',
        },
        {
          kind: 'distinction',
          biblical:
            'Scripture requires truthful speech about neighbors and forbids false witness.',
          interpretation:
            'Reformed witness asks which Islam your friend practices before answering a stereotype.',
          disagreement:
            'Media often flattens Islam to one political image. Correct that habit.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'true_false',
          prompt:
            'All Muslims worldwide share identical politics, law-school rulings, and views of every theological dispute.',
          answer: false,
          explanation:
            'Islam is internally diverse historically and today.',
        },
      ],
      questions: [
        mc(
          'islam-div-q1',
          'A wise question when meeting a Muslim friend is:',
          [
            'Why are all of you identical?',
            'How would you describe your own tradition and practice?',
            'Why won’t you admit you secretly hate everyone?',
            'Why don’t you read only Christian blogs about Islam?',
          ],
          1,
          'Let them self-describe.',
        ),
        mc(
          'islam-div-q2',
          'Sunni–Shia divergence historically centers especially on:',
          [
            'Whether Allah exists',
            'Questions of rightful leadership after Muhammad and related theology/practice',
            'Whether the Quran has Arabic text',
            'Whether prayer exists',
          ],
          1,
          'Leadership/Imamate disputes shaped communities; more differences followed.',
        ),
      ],
      reflectionPrompts: [
        'Confess any habit of treating Muslims as a single political cartoon; ask for better questions.',
      ],
      furtherStudy: [
        'Read a short academic overview of Sunni and Shia from a university or reference source — not a polemical clip.',
      ],
      reviewFromLessonIds: ['islam-differences-christianity'],
    },
    {
      id: 'islam-common-questions',
      order: 9,
      title: 'Common Questions and Objections',
      estimatedMinutes: 22,
      objectives: [
        'Address Bible reliability, Trinity, deity of Christ, and crucifixion objections.',
        'Practice a crucifixion / resurrection conversation.',
        'Admit limits; avoid fabricated manuscript claims.',
      ],
      primaryPassages: [passage('luke', 'Luke', 24, 36, 47)],
      supportingPassages: [
        passage('1peter', '1 Peter', 3, 15, 16),
        passage('john', 'John', 19, 16, 30),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Frequent pressure points',
          body:
            'Muslim interlocutors often ask: Hasn’t the Bible been corrupted? How can God have a Son? How can one God be Trinity? Didn’t Jesus escape the cross? Why trust Paul? Answer with manuscript honesty, biblical theology, and historical claims about Jesus’ death — without inventing “proofs” you have not studied. Quranic critique of Christian claims should be stated as Muslims understand it, then answered from Scripture.',
        },
        {
          kind: 'teaching',
          title: 'On “corruption” of the Bible',
          body:
            'Christians can acknowledge textual variants while explaining that the NT’s central claims are early and multiply attested. Overclaiming (“zero variants”) backfires. Underclaiming (“we have no idea what Jesus said”) also fails the evidence and the faith.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('luke', 'Luke', 24, 46, 47),
          note:
            'Interpretation: The risen Christ interprets Scripture toward his suffering, resurrection, and worldwide repentance proclamation.',
        },
        {
          kind: 'distinction',
          biblical:
            'The Gospels and Paul proclaim crucifixion and resurrection as public events.',
          interpretation:
            'Reformed apologetics holds the cross historically and theologically central, engaging Islamic denial with evidence and gospel meaning.',
          disagreement:
            'Some Muslim polemicists treat any variant as total corruption; some Christians deny any hard question. Be precise.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'conversation',
          prompt: 'Conversation practice',
          scenario:
            'A Muslim friend says Jesus was not crucified and that the Bible’s text is corrupted. Practice truthful, non-hostile replies.',
          partnerName: 'Yusuf',
          steps: [
            {
              partnerLine:
                'Jesus was not crucified — that would be unworthy of a prophet. And your Bible has been changed.',
              choices: [
                {
                  text: 'You’re brainwashed; stop talking.',
                  quality: 'hostile',
                  explanation: 'Contempt ends conversation.',
                },
                {
                  text: 'I hear how important prophetic honor is for you. Christians believe the crucifixion is historical and essential — God saving through the cross, not failing. On the text: there are variants, but the core message of Jesus’ death and resurrection is early and strong. Can we look at one Gospel passage together?',
                  quality: 'helpful',
                  explanation:
                    'You honor the concern, state the Christian claim, avoid overclaim on manuscripts, and invite Scripture.',
                },
                {
                  text: 'Maybe the cross is optional.',
                  quality: 'inaccurate',
                  explanation:
                    'The cross is not optional to the apostolic gospel.',
                },
                {
                  text: 'Yeah, texts are messy…',
                  quality: 'incomplete',
                  explanation:
                    'Partial honesty that never returns to Christ leaves the gospel unsaid.',
                },
              ],
            },
          ],
        },
      ],
      questions: [
        mc(
          'islam-q-q1',
          'When someone claims “the Bible is totally corrupted,” a careful Christian response often:',
          [
            'Denies that any manuscript variants exist',
            'Acknowledges variants while explaining the early, central gospel claims',
            'Agrees that Jesus never died',
            'Burns a Quran in reply',
          ],
          1,
          'Honesty + gospel center beats bluff and rage.',
        ),
        mc(
          'islam-q-q2',
          'Islamic denial of the crucifixion conflicts especially with:',
          [
            'The NT’s repeated historical and theological claim that Jesus died and rose',
            'The Five Pillars’ requirement to deny Moses',
            'The claim that Muhammad never existed',
            'Christian dietary law',
          ],
          0,
          'Cross and resurrection are NT bedrock.',
        ),
      ],
      reflectionPrompts: [
        'Ask God for courage to speak of the cross without shame and without harshness.',
      ],
      furtherStudy: [
        'Read 1 Corinthians 15:1–8 aloud; note how early and how concrete Paul’s list is.',
      ],
      reviewFromLessonIds: ['islam-jesus', 'islam-differences-christianity'],
    },
    {
      id: 'islam-sharing-gospel',
      order: 10,
      title: 'Sharing the Gospel with Muslims',
      estimatedMinutes: 24,
      objectives: [
        'Practice listening and asking before answering.',
        'Explain the gospel clearly in conversation.',
        'Know when to pause and continue later.',
      ],
      primaryPassages: [passage('acts', 'Acts', 17, 30, 34)],
      supportingPassages: [
        passage('romans', 'Romans', 10, 9, 17),
        passage('colossians', 'Colossians', 4, 5, 6),
      ],
      content: [
        {
          kind: 'teaching',
          title: 'Presence before performance',
          body:
            'Love your Muslim neighbor as a person: hospitality, honesty, and patience. Ask what they believe about God, Jesus, sin, and forgiveness. Share Scripture’s story: Creator, our rebellion, Christ’s incarnation, cross, resurrection, and the call to repent and believe. Avoid attacking Muhammad as your opening move. Avoid watering down Jesus to keep peace. Pray — God opens hearts.',
        },
        {
          kind: 'concept',
          term: 'Bridge without blur',
          explanation:
            'Shared affirmation of one Creator and reverence for Jesus can open conversation; they must not erase the gospel’s unique claims.',
        },
        {
          kind: 'scripture_focus',
          passage: passage('romans', 'Romans', 10, 13, 15),
          note:
            'Interpretation: Salvation is for all who call on the Lord; someone must be sent to speak good news.',
        },
        {
          kind: 'distinction',
          biblical:
            'The apostles proclaim Christ crucified and risen to Jews and Gentiles with both courage and tears.',
          interpretation:
            'Reformed evangelicals combine confidence in the gospel with gentleness, rejecting both cowardice and crusading contempt.',
          disagreement:
            'Some methods chase argument wins; some refuse all theological clarity. Scripture models both truth and love.',
        },
        {
          kind: 'attribution',
          teacherId: 'packer',
          work: 'Evangelism and the Sovereignty of God (selected themes)',
          note:
            'Organizational reminder: God’s sovereignty fuels prayerful witness, not anxious manipulation — themes only.',
        },
      ],
      interactiveExercises: [
        {
          kind: 'conversation',
          prompt: 'Conversation practice',
          scenario:
            'A Muslim friend asks how anyone can be sure of forgiveness. Practice listening and gospel clarity.',
          partnerName: 'Fatima',
          steps: [
            {
              partnerLine:
                'I try to live rightly, but how can anyone be sure Allah will accept them?',
              choices: [
                {
                  text: 'Just be good enough; stop worrying.',
                  quality: 'incomplete',
                  explanation:
                    'That neither hears Islam’s seriousness nor offers Christ’s finished work.',
                },
                {
                  text: 'That’s a deep question. May I ask what you rely on most — mercy, deeds, or both — and then share why Christians find assurance in Jesus’ death and resurrection for sinners?',
                  quality: 'helpful',
                  explanation:
                    'You listen first, honor the question, and open the gospel of assurance in Christ.',
                },
                {
                  text: 'Islam is a works prison and you’re all lost forever, idiot.',
                  quality: 'hostile',
                  explanation:
                    'Caricature plus insult is not evangelism.',
                },
                {
                  text: 'All religions give equal assurance.',
                  quality: 'inaccurate',
                  explanation:
                    'That blurs incompatible claims about Jesus and salvation.',
                },
              ],
            },
            {
              partnerLine: 'But why would God let his prophet be crucified?',
              choices: [
                {
                  text: 'Because God so loved the world that he gave his Son — the cross is not defeat but the way sinners are forgiven. I’d love to read Isaiah 53 or Mark 15 with you sometime.',
                  quality: 'helpful',
                  explanation:
                    'You reframe the cross as love and atonement and invite Scripture.',
                },
                {
                  text: 'Don’t ask hard questions.',
                  quality: 'hostile',
                  explanation: 'Shutting down questions is unfaithful.',
                },
                {
                  text: 'Yeah, it’s confusing…',
                  quality: 'incomplete',
                  explanation:
                    'Empathy alone never explains the gospel’s meaning of the cross.',
                },
              ],
            },
          ],
        },
      ],
      questions: [
        mc(
          'islam-share-q1',
          'A wise early move in gospel conversation with a Muslim friend is often to:',
          [
            'Attack Muhammad immediately',
            'Ask what they believe about God, Jesus, and forgiveness — then share Christ',
            'Deny that they care about God',
            'Force a decision in sixty seconds',
          ],
          1,
          'Listen, then speak the gospel.',
        ),
        mc(
          'islam-share-q2',
          'When a conversation grows heated, a faithful option can be to:',
          [
            'Match insult for insult',
            'Pause graciously and offer to continue another day',
            'Fake agreement on the Trinity',
            'Delete their number forever as a spiritual rule',
          ],
          1,
          'Patience and presence matter.',
        ),
        open(
          'islam-share-open',
          'Write a 2–3 sentence gospel summary you could share with a Muslim friend that names Jesus’ cross and resurrection clearly.',
        ),
      ],
      reflectionPrompts: [
        'Pray by name for one Muslim acquaintance; ask for an open door and a gentle tongue.',
      ],
      furtherStudy: [
        'Role-play with a Christian friend: one plays a sincere Muslim questioner; practice listening two minutes before any apologetic answer.',
      ],
      reviewFromLessonIds: [
        'islam-common-questions',
        'islam-salvation-afterlife',
      ],
    },
  ],
}
