import type { QuizQuestion } from '../../planQuizzes'
import { mc } from '../topics/_helpers'

export const PART17_CHRIST_BY_LESSON: Record<string, QuizQuestion[]> = {
  'christ-person-natures': [
    mc('chr-p17-3b1', 'Jesus is:', ['Fully God and fully man', 'Half God, half man', 'Only man', 'Only God'], 0, 'Chalcedonian orthodoxy.', 'beginner'),
    mc('chr-p17-3b2', 'Which council defined the two natures of Christ in 451?', ['Chalcedon', 'Nicaea', 'Trent', 'Carthage'], 0, 'Chalcedon 451.', 'beginner'),
    mc('chr-p17-3i1', '"Hypostatic union" means:', ['Two natures united in one person', 'Two persons in one nature', 'Three persons in one God', 'Two wills in conflict'], 0, 'One person, two natures.', 'intermediate'),
    mc('chr-p17-3i2', 'Nestorianism teaches that Christ is:', ['Two persons', 'One blended nature', 'A creature only', 'A spirit only'], 0, 'Nestorius split persons.', 'intermediate'),
    mc('chr-p17-3a1', 'Eutychianism taught that Christ’s natures:', ['Blended into one', 'Were separate persons', 'Never existed', 'Were not real'], 0, 'Monophysite error.', 'advanced'),
  ],
  'christ-incarnation-life': [
    mc('chr-p17-2b1', "Who was Jesus' mother?", ['Elizabeth', 'Mary', 'Martha', 'Ruth'], 1, 'Virgin birth narratives.', 'beginner'),
    mc('chr-p17-2b2', 'Which verse says "the Word became flesh"?', ['John 1:14', 'Genesis 1:1', 'Psalm 1:1', 'Romans 3:23'], 0, 'Incarnation in John 1:14.', 'beginner'),
    mc('chr-p17-2i1', 'Why did Christ become man?', ['To represent us and die in our place (Hebrews 2:14–17)', 'To prove he was a teacher', 'To give up being God', 'It was unnecessary'], 0, 'Incarnation for substitution.', 'intermediate'),
    mc('chr-p17-2i2', 'The virgin birth means Jesus was conceived:', ['By the Holy Spirit without a human father', 'By Joseph', 'In a dream only', 'By an angel’s body'], 0, 'Matthew/Luke teaching.', 'intermediate'),
    mc('chr-p17-2a1', 'Philippians 2:7 ("emptied himself") teaches Christ:', ['Took a servant’s form without giving up deity', 'Stopped being God', 'Was only a man', 'Became an angel'], 0, 'Kenosis as addition, not subtraction of deity.', 'advanced'),
  ],
  'christ-atonement': [
    mc('chr-p17-4b1', 'Why did Jesus die?', ['To save sinners from sin’s penalty', 'To set an example only', 'To start a religion', 'To avoid trouble'], 0, 'Penal substitution framework.', 'beginner'),
    mc('chr-p17-4b2', 'Which verse says Christ was "pierced for our transgressions"?', ['Isaiah 53:5', 'John 1:1', 'Psalm 23', 'Genesis 3:15'], 0, 'Isaiah 53 prophecy.', 'beginner'),
    mc('chr-p17-4i1', '"Propitiation" means:', ['A sacrifice that turns away God’s wrath', 'A prayer', 'A feast', 'A promise'], 0, 'Romans 3:25 sense.', 'intermediate'),
    mc('chr-p17-4i2', '"Redemption" pictures salvation as:', ['Buying back a slave', 'A trial', 'A harvest', 'A building'], 0, 'Marketplace metaphor.', 'intermediate'),
    mc('chr-p17-4a1', 'Penal substitution holds that:', ['Christ bore the penalty for sin in the place of sinners', 'Christ’s death shows love only', 'Christ paid Satan', 'Christ restored order only'], 0, 'Reformed atonement view.', 'advanced'),
  ],
  'christ-resurrection-ascension': [
    mc('chr-p17-5b1', 'On which day did Jesus rise?', ['The third day', 'The first day', 'The seventh day', 'The fortieth day'], 0, '1 Corinthians 15 tradition.', 'beginner'),
    mc('chr-p17-5b2', "What are Christ's three offices?", ['Prophet, Priest, King', 'Teacher, Healer, Judge', 'Shepherd, Lamb, Lion', 'Creator, Sustainer, Judge'], 0, 'Threefold office.', 'beginner'),
    mc('chr-p17-5i1', 'Romans 4:25 says Christ was raised for our:', ['Justification', 'Wealth', 'Comfort only', 'Glory only'], 0, 'Resurrection secures justification.', 'intermediate'),
    mc('chr-p17-5i2', 'Hebrews 7:25 says Christ always lives to:', ['Make intercession for those who draw near through him', 'Judge the world only', 'Rest', 'Build a temple'], 0, 'Ongoing priestly intercession.', 'intermediate'),
    mc('chr-p17-5a1', '1 Corinthians 15:20 calls Christ the "firstfruits," meaning:', ['His resurrection guarantees ours', 'He was first to die', 'He was a farmer', 'He rose alone forever'], 0, 'Eschatological harvest image.', 'advanced'),
  ],
  'christ-present-ministry': [
    mc('chr-p17-1b1', 'Which verse says "the Word was God"?', ['John 1:1', 'John 3:16', 'Romans 8:1', 'Psalm 23:1'], 0, 'Deity of Christ in prologue.', 'beginner'),
    mc('chr-p17-1b2', 'What did Thomas say to Jesus?', ['"My Lord and my God"', '"You are a prophet"', '"Teacher only"', '"I do not believe"'], 0, 'John 20:28 confession.', 'beginner'),
    mc('chr-p17-1i1', '"Before Abraham was, I am" echoes:', ['Exodus 3:14', 'Genesis 1:1', 'Psalm 23', 'Isaiah 53'], 0, 'Divine name claim.', 'intermediate'),
    mc('chr-p17-1i2', '"Firstborn of all creation" in Colossians 1:15 means:', ['He holds rank and created all things', 'He was created first', 'He is an angel', 'He is not God'], 0, 'Firstborn = preeminent, not first-made.', 'intermediate'),
    mc('chr-p17-1a1', 'Why did Jews try to stone Jesus in John 10:33?', ['They understood he made himself God', 'He broke Sabbath only', 'He healed', 'He prayed'], 0, 'Claim to deity provoked reaction.', 'advanced'),
  ],
}

export const PART17_SALVATION_BY_LESSON: Record<string, QuizQuestion[]> = {
  'salvation-election-calling': [
    mc('sal-p17-1b1', 'Ephesians 1:4 says God chose us:', ['Before the foundation of the world', 'After we believed', 'At baptism', 'At death'], 0, 'Election before creation.', 'beginner'),
    mc('sal-p17-1b2', 'Who begins salvation?', ['God', 'Man', 'The church', 'Luck'], 0, 'Monergistic start.', 'beginner'),
    mc('sal-p17-1i1', '"Unconditional election" means God chose:', ['Based on nothing in the person, according to his purpose', 'Based on foreseen works', 'Everyone equally', 'Only Israel'], 0, 'TMS emphasis.', 'intermediate'),
    mc('sal-p17-1i2', 'The "effectual call" is:', ['The Spirit’s inward call that brings the elect to Christ', 'A sermon only', 'A church invitation', 'A dream'], 0, 'Internal call of the Spirit.', 'intermediate'),
    mc('sal-p17-1a1', 'Why does election not undermine evangelism?', ['God’s elect come to faith through the preached gospel', 'It cancels responsibility', 'It makes the gospel false', 'Election is unknown'], 0, 'Acts 13:48; 18:10.', 'advanced'),
  ],
  'salvation-regeneration-conversion': [
    mc('sal-p17-2b1', 'What does John 3:3 say we must be?', ['Born again', 'Baptized', 'Wealthy', 'Educated'], 0, 'New birth required.', 'beginner'),
    mc('sal-p17-2b2', 'Ephesians 2:1 says unbelievers are:', ['Dead in trespasses and sins', 'Slightly sick', 'Basically good', 'Asleep only'], 0, 'Spiritual death.', 'beginner'),
    mc('sal-p17-2i1', '"Regeneration" refers to:', ['God giving new spiritual life', 'Learning doctrine', 'Joining a church', 'A decision only'], 0, 'New birth by Spirit.', 'intermediate'),
    mc('sal-p17-2i2', 'Ezekiel 36:26 promises:', ['A new heart and a new spirit', 'A new temple', 'A new law', 'Wealth'], 0, 'Covenant new-heart language.', 'intermediate'),
    mc('sal-p17-2a1', 'Monergism holds that:', ['God alone regenerates', 'Man and God cooperate in regeneration', 'Man regenerates himself', 'The church regenerates'], 0, 'God’s sole work in new birth.', 'advanced'),
  ],
  'salvation-justification': [
    mc('sal-p17-3b1', 'What does "repent" mean?', ['Turn from sin', 'Be baptized only', 'Pray only', 'Give money'], 0, 'Repentance = turning.', 'beginner'),
    mc('sal-p17-3b2', 'Which verse says we are saved by grace through faith?', ['Ephesians 2:8', 'Genesis 1:1', 'Psalm 23', 'Jude 1'], 0, 'Grace-faith formula.', 'beginner'),
    mc('sal-p17-3i1', 'Saving faith includes:', ['Knowledge, assent, and trust', 'Knowledge only', 'Feelings only', 'Works only'], 0, 'Notitia, assensus, fiducia.', 'intermediate'),
    mc('sal-p17-3i2', 'Acts 11:18 says repentance is:', ['Granted by God', 'Earned', 'Optional', 'Unnecessary'], 0, 'Repentance as divine gift.', 'intermediate'),
    mc('sal-p17-3a1', 'Why does the Master’s Seminary emphasize "Lordship"?', ['Genuine faith submits to Christ and bears fruit', 'It earns salvation', 'It denies grace', 'It is mere tradition'], 0, 'MacArthur emphasis.', 'advanced'),
  ],
  'salvation-adoption': [
    mc('sal-p17-4b1', 'What is justification?', ['God declaring a sinner righteous because of Christ', 'Becoming sinless instantly', 'Joining a church', 'Being baptized'], 0, 'Forensic declaration.', 'beginner'),
    mc('sal-p17-4b2', 'Romans 5:1 says we have peace with God through:', ['Faith', 'Works', 'Church', 'Tradition'], 0, 'Justified by faith.', 'beginner'),
    mc('sal-p17-4i1', 'Imputation means:', ['Christ’s righteousness is credited to the believer', 'Righteousness is poured in only', 'Faith is earned', 'Sins are ignored'], 0, 'Forensic credit.', 'intermediate'),
    mc('sal-p17-4i2', 'Justification differs from sanctification because:', ['It is a once-for-all declaration; sanctification is ongoing', 'They are identical', 'Sanctification comes first', 'Justification is earned'], 0, 'Order and nature differ.', 'intermediate'),
    mc('sal-p17-4a1', 'The Council of Trent (1547) on justification:', ['Condemned justification by faith alone', 'Affirmed sola fide', 'Ignored justification', 'Defined original sin only'], 0, 'Roman Catholic contrast.', 'advanced'),
  ],
  'salvation-sanctification': [
    mc('sal-p17-5b1', 'Romans 8:15 says believers receive the Spirit of:', ['Adoption', 'Fear', 'Slavery', 'Law'], 0, 'Adoption motif.', 'beginner'),
    mc('sal-p17-5b2', 'What does "sanctification" mean?', ['Being made holy and set apart', 'Being declared righteous', 'Being baptized', 'Being elected'], 0, 'Progressive holiness.', 'beginner'),
    mc('sal-p17-5i1', 'Progressive sanctification is:', ['Growth in holiness throughout life', 'A one-time event', 'Perfection now', 'Not needed'], 0, 'Ongoing transformation.', 'intermediate'),
    mc('sal-p17-5i2', 'Which verse links God’s work and our work in sanctification?', ['Philippians 2:12–13', 'Genesis 1:1', 'John 3:16', 'Psalm 1'], 0, 'Work out what God works in.', 'intermediate'),
    mc('sal-p17-5a1', 'Why is sinless perfection in this life rejected?', ['1 John 1:8 warns against claiming we have no sin', 'It is too hard', 'It is tradition', 'Because of Rome'], 0, 'Remaining sin in believers.', 'advanced'),
  ],
  'salvation-perseverance-glorification': [
    mc('sal-p17-6b1', 'Philippians 1:6 says God will:', ['Complete the good work he began', 'Leave us', 'Test us only', 'Forget us'], 0, 'Perseverance of saints.', 'beginner'),
    mc('sal-p17-6b2', 'John 10:28 says no one can:', ['Snatch believers from Christ’s hand', 'Believe', 'Forgive', 'Escape trials'], 0, 'Security in Christ.', 'beginner'),
    mc('sal-p17-6i1', '"Perseverance of the saints" means:', ['True believers continue because God keeps them', 'Believers never sin', 'Believers earn salvation', 'Salvation is not secure'], 0, 'Preservation doctrine.', 'intermediate'),
    mc('sal-p17-6i2', '1 John 5:13 was written so that:', ['Believers may know they have eternal life', 'They would doubt', 'They would work for salvation', 'They would give money'], 0, 'Assurance purpose.', 'intermediate'),
    mc('sal-p17-6a1', '1 John 2:19 says those who left the church:', ['Never truly belonged to it', 'Were saved and lost', 'Were persecuted', 'Were elders'], 0, 'Apostasy as false profession.', 'advanced'),
  ],
}

export const PART17_CHURCH_BY_LESSON: Record<string, QuizQuestion[]> = {
  'church-nature-purpose': [
    mc('ch-p17-1b1', 'The word "church" (ekklesia) means:', ['A building', 'An assembly of called-out people', 'A priest', 'A sacrifice'], 1, 'Ekklesia = called-out assembly.', 'beginner'),
    mc('ch-p17-1b2', 'Who builds the church?', ['Christ', 'Peter', 'The pope', 'Elders alone'], 0, 'Matthew 16:18.', 'beginner'),
    mc('ch-p17-1i1', 'The universal church is:', ['All believers of this age in Christ', 'One denomination', 'A building', 'The clergy only'], 0, 'Invisible/catholic church.', 'intermediate'),
    mc('ch-p17-1i2', 'A local church has:', ['Leaders, ordinances, and gathered members', 'No leaders', 'Only a building', 'Only a website'], 0, 'Visible local assembly.', 'intermediate'),
    mc('ch-p17-1a1', 'Ephesians 3:1–6 calls Gentiles with Jews in one body a:', ['Mystery now revealed', 'Secret to hide', 'Replacement of Israel', 'Temporary plan only'], 0, 'One new man in Christ.', 'advanced'),
  ],
  'church-leadership': [
    mc('ch-p17-2b1', 'According to Acts 2:42, the early church devoted itself to:', ['Apostles’ teaching, fellowship, breaking bread, and prayer', 'Entertainment', 'Politics', 'Business'], 0, 'Fourfold devotion.', 'beginner'),
    mc('ch-p17-2b2', 'Hebrews 10:25 tells believers not to neglect:', ['Meeting together', 'Wealth', 'Travel', 'Games'], 0, 'Corporate worship.', 'beginner'),
    mc('ch-p17-2i1', 'Reformation marks of a true church include:', ['Right preaching and right use of ordinances', 'Size and wealth', 'Miracles only', 'Tradition only'], 0, 'Word and sacraments/ordinances.', 'intermediate'),
    mc('ch-p17-2i2', 'Ephesians 4:11–16 says pastors equip saints for:', ['The work of ministry and building up the body', 'Entertainment', 'Politics', 'Wealth'], 0, 'Equipping ministry.', 'intermediate'),
    mc('ch-p17-2a1', 'Why is expositional preaching central?', ['It explains and applies God’s word so the word governs the church', 'It is traditional', 'It is easier', 'It is shorter'], 0, 'Text-driven ministry.', 'advanced'),
  ],
  'church-ordinances': [
    mc('ch-p17-3b1', 'Who leads the local church in the NT?', ['Elders', 'Kings', 'A pope', 'Judges'], 0, 'Plurality of elders.', 'beginner'),
    mc('ch-p17-3b2', 'Who is the Head of the church?', ['Christ', 'The pastor', 'Peter', 'The congregation alone'], 0, 'Colossians 1:18.', 'beginner'),
    mc('ch-p17-3i1', 'Which verse lists qualifications of an elder?', ['1 Timothy 3:1–7', 'John 3:16', 'Genesis 1:1', 'Psalm 1'], 0, 'Elder qualifications.', 'intermediate'),
    mc('ch-p17-3i2', 'Deacons were first appointed in:', ['Acts 6', 'Genesis 6', 'Exodus 6', 'Romans 6'], 0, 'Acts 6 diaconate.', 'intermediate'),
    mc('ch-p17-3a1', 'Which form of government has bishops over many churches?', ['Episcopal', 'Presbyterian', 'Congregational', 'Independent only'], 0, 'Episcopal polity.', 'advanced'),
  ],
  'church-worship-unity-discipline': [
    mc('ch-p17-4b1', 'Which two ordinances did Christ give the church?', ['Baptism and the Lord’s Supper', 'Confession and fasting', 'Marriage and ordination', 'Prayer and tithing only'], 0, 'Two ordinances.', 'beginner'),
    mc('ch-p17-4b2', 'Baptism follows:', ['Faith in Christ', 'Birth', 'Marriage', 'Education'], 0, 'Believer’s baptism.', 'beginner'),
    mc('ch-p17-4i1', 'The Lord’s Supper is, in this view, a:', ['Remembrance and proclamation of Christ’s death', 'New sacrifice', 'Infant rite', 'Optional meal only'], 0, 'Memorial view.', 'intermediate'),
    mc('ch-p17-4i2', '1 Corinthians 11:28 tells believers to:', ['Examine themselves before the Supper', 'Skip it', 'Give money', 'Fast always'], 0, 'Self-examination.', 'intermediate'),
    mc('ch-p17-4a1', 'Paedobaptists argue infant baptism from:', ['Covenant continuity with circumcision', 'The Apocrypha only', 'The Didache only', 'The thief on the cross'], 0, 'Covenant argument (described).', 'advanced'),
  ],
  'church-mission': [
    mc('ch-p17-5b1', 'According to 1 Corinthians 12, the church is like:', ['A body with many members', 'A building only', 'A school only', 'An army only'], 0, 'Body metaphor.', 'beginner'),
    mc('ch-p17-5b2', 'What is the Great Commission?', ['Jesus’ command to make disciples of all nations', 'A Jewish law', 'A feast', 'A prophecy only'], 0, 'Matthew 28:18–20.', 'beginner'),
    mc('ch-p17-5i1', 'Church discipline in Matthew 18 aims at:', ['Repentance and restoration', 'Revenge', 'Shame only', 'Division'], 0, 'Restorative discipline.', 'intermediate'),
    mc('ch-p17-5i2', 'Spiritual gifts are given for:', ['The common good', 'Personal glory', 'Wealth', 'Entertainment'], 0, '1 Corinthians 12:7.', 'intermediate'),
    mc('ch-p17-5a1', 'Cessationism holds that:', ['Sign gifts ceased with the apostolic age', 'All gifts ceased', 'No gifts exist', 'All sign gifts continue'], 0, 'TMS/MacArthur view taught.', 'advanced'),
  ],
}
