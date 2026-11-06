import type { QuizQuestion } from '../../planQuizzes'
import { mc } from '../topics/_helpers'

export const PART16_GOSPEL_BY_LESSON: Record<string, QuizQuestion[]> = {
  'gospel-god-creation-fall': [
    mc('gf-p16-1b1', 'Who created everything?', ['Nature', 'God', 'Chance', 'Man'], 1, 'Genesis 1:1; Acts 17.', 'beginner'),
    mc('gf-p16-1b2', 'In Isaiah 6, the seraphim call God:', ['Holy, holy, holy', 'Love, love, love', 'Mighty, mighty, mighty', 'Eternal, eternal, eternal'], 0, 'Holiness emphasized.', 'beginner'),
    mc('gf-p16-1i1', 'What does "holy" mean?', ['Set apart from sin and absolutely pure', 'Kind only', 'Old', 'Religious'], 0, 'Moral purity.', 'intermediate'),
    mc('gf-p16-2b1', 'What does Romans 3:23 say?', ['All have sinned and fall short of God’s glory', 'Some have sinned', 'No one has sinned', 'Only the wicked sin'], 0, 'Universal sin.', 'beginner'),
    mc('gf-p16-2b2', 'What is the "wages of sin" (Romans 6:23)?', ['Death', 'Shame', 'Poverty', 'Sickness'], 0, 'Death as wage.', 'beginner'),
    mc('gf-p16-2i1', 'What does the law do?', ['Shows our sin and need of a Savior', 'Saves us', 'Is irrelevant', 'Gives power'], 0, 'Galatians 3:24 function.', 'intermediate'),
    mc('gf-p16-add1', 'Which sequence matches this course’s gospel outline?', ['God, Man, Christ, Response', 'Christ, God, Man, Response', 'Man, God, Response, Christ', 'Response first'], 0, 'God-man-Christ-response.', 'intermediate'),
  ],
  'gospel-christ-cross-resurrection': [
    mc('gf-p16-3b1', 'According to 1 Corinthians 15:3–4, what is of first importance?', ['Christ died for our sins and was raised on the third day', 'We should be good', 'Churches should be big', 'We should give money'], 0, 'Core gospel facts.', 'beginner'),
    mc('gf-p16-3b2', 'Who is Jesus?', ['God and man', 'A prophet only', 'An angel', 'A myth'], 0, 'Incarnation and deity.', 'beginner'),
    mc('gf-p16-3i1', 'What does "substitution" mean?', ['Christ died in the place of sinners', 'Christ set an example only', 'Christ was a martyr only', 'Christ replaced the law'], 0, 'Penal substitution.', 'intermediate'),
    mc('gf-p16-3i2', 'A "propitiation" is:', ['A sacrifice that satisfies God’s wrath against sin', 'A prayer', 'A gift', 'A command'], 0, 'Romans 3:25.', 'intermediate'),
    mc('gf-p16-3a1', 'Which is part of the historical case for the resurrection?', ['Empty tomb and appearances to many witnesses', 'A modern miracle report', 'A legend centuries later', 'A moral lesson only'], 0, '1 Corinthians 15 evidence.', 'advanced'),
    mc('gf-p16-3a2', 'Why is 1 Corinthians 15:17 important?', ['If Christ is not raised, faith is futile and we remain in sin', 'Resurrection is optional', 'It is about baptism', 'It is about tithing'], 0, 'Resurrection necessity.', 'advanced'),
    mc('gf-p16-add2', 'John 3:16 promises eternal life to those who:', ['Believe in Christ', 'Are wealthy', 'Attend church only', 'Keep the law perfectly'], 0, 'Faith in the Son.', 'beginner'),
  ],
  'gospel-repentance-faith-justification': [
    mc('gf-p16-4b1', 'What did Jesus say in Mark 1:15?', ['Repent and believe in the gospel', 'Pray three times daily', 'Build a temple', 'Fast forty days'], 0, 'Kingdom call.', 'beginner'),
    mc('gf-p16-4b2', 'Salvation is by grace through faith according to:', ['Ephesians 2:8–9', 'John 1:1', 'Psalm 23', 'Genesis 3:15'], 0, 'Not by works.', 'beginner'),
    mc('gf-p16-4i1', 'Repentance means:', ['Turning from sin toward God with a changed mind', 'Feeling sorry only', 'Joining a church', 'Doing penance'], 0, 'True repentance.', 'intermediate'),
    mc('gf-p16-4i2', 'Saving faith includes:', ['Knowing, agreeing, and trusting', 'Knowing only', 'Feeling only', 'Works only'], 0, 'Faith components.', 'intermediate'),
    mc('gf-p16-4a1', 'Why does Luke 14:25–33 matter?', ['It calls disciples to count the cost of following Christ', 'It teaches works save', 'It is about money only', 'It condemns the church'], 0, 'Lordship/cost.', 'advanced'),
    mc('gf-p16-4a2', 'Which is a counterfeit gospel?', ['Believe and God will make you rich and healthy', 'Repent and believe', 'Christ died for sinners', 'Salvation is by grace'], 0, 'Prosperity distortion.', 'advanced'),
    mc('gf-p16-add3', 'What is the gospel?', ['Good news about what Christ has done for sinners', 'A list of rules', 'Self-help', 'Church history'], 0, 'Euangelion definition.', 'beginner'),
  ],
  'gospel-grace-exclusivity': [
    mc('gf-p16-add4', 'Romans 10:9 ties confession and belief in the resurrection to:', ['Salvation', 'Baptism only', 'Membership', 'Wealth'], 0, 'Romans 10:9–10.', 'intermediate'),
    mc('gf-p16-add5', 'Justification in the gospel means:', ['God declares a believing sinner righteous in Christ', 'God makes someone perfect instantly', 'A person earns acceptance', 'God ignores sin'], 0, 'Forensic justification.', 'advanced'),
    mc('gf-p16-add6', 'Assurance (1 John 5:13) differs from presumption because:', ['Assurance rests on Christ’s work confirmed by fruit; presumption claims salvation without change', 'They are the same', 'Assurance requires perfection', 'Assurance is impossible'], 0, 'True vs false assurance.', 'advanced'),
    mc('gf-p16-2i2', 'Ephesians 2:1 says unbelievers are:', ['Dead in trespasses and sins', 'Slightly lost', 'Basically good', 'Asleep'], 0, 'Spiritual death.', 'intermediate'),
    mc('gf-p16-1a1', 'The Creator-creature distinction means:', ['God is infinite Creator; we are dependent creatures who owe him obedience', 'God and creation are one', 'Creation is divine', 'God needs us'], 0, 'Acts 17; Isaiah 46.', 'advanced'),
    mc('gf-p16-1i2', 'Romans 1:18 says God’s wrath is against:', ['All ungodliness and unrighteousness', 'Only murderers', 'Only unbelievers who never heard', 'Only Israel'], 0, 'Universal guilt.', 'intermediate'),
    mc('gf-p16-3i3', 'Why must the Savior be both God and man?', ['Only a man could represent us; only God could bear infinite wrath', 'Tradition', 'Appearance', 'Man could save himself'], 0, 'Hypostatic necessity.', 'intermediate'),
  ],
}

export const PART16_SHARING_BY_LESSON: Record<string, QuizQuestion[]> = {
  'share-why-evangelize': [
    mc('sy-p16-1b1', 'The Great Commission commands disciples of:', ['All nations', 'Israel only', 'Rome only', 'Leaders only'], 0, 'Matthew 28:19–20.', 'beginner'),
    mc('sy-p16-1b2', 'Believers are Christ’s witnesses according to:', ['Acts 1:8', 'Psalm 1', 'Genesis 1', 'Revelation 22'], 0, 'Witness mandate.', 'beginner'),
    mc('sy-p16-1i1', 'Romans 10:14 asks how people can believe without:', ['Hearing', 'Wealth', 'Education', 'Miracles'], 0, 'Need for proclamation.', 'intermediate'),
    mc('sy-p16-1i2', 'A motive for evangelism is:', ['The glory of God and love for the lost', 'Fear of people', 'Winning arguments', 'Popularity'], 0, '2 Corinthians 4:15; Romans 9:1–3.', 'intermediate'),
    mc('sy-p16-1a1', 'God’s sovereignty and human responsibility in evangelism:', ['Both are true: God saves, and we must preach', 'Only sovereignty matters', 'Only human effort saves', 'They contradict'], 0, 'Packer balance.', 'advanced'),
    mc('sy-p16-1a2', 'Acts 18:9–10 encourages evangelism because:', ['God has many people in the city', 'Paul was perfect', 'Opposition ended', 'Miracles guaranteed success'], 0, 'Election encourages mission.', 'advanced'),
    mc('sy-p16-1b3', '2 Corinthians 5:20 calls believers:', ['Ambassadors for Christ', 'Judges of the world', 'Kings', 'Angels'], 0, 'Ambassadorship.', 'beginner'),
  ],
  'share-gospel-and-testimony': [
    mc('sy-p16-2b1', 'A personal testimony should chiefly:', ['Point to Christ and the gospel, not self', 'Impress with achievements', 'Hide the cross', 'Mock other religions'], 0, 'Christ-centered witness.', 'beginner'),
    mc('sy-p16-2b2', 'The gospel message centers on:', ['Christ’s death and resurrection for sinners', 'Moral improvement alone', 'Political change', 'Prosperity'], 0, '1 Corinthians 15 core.', 'beginner'),
    mc('sy-p16-2i1', '1 Peter 3:15 calls believers to give a reason with:', ['Gentleness and respect', 'Anger', 'Silence', 'Mockery'], 0, 'Apologetic demeanor.', 'intermediate'),
    mc('sy-p16-2i2', 'Colossians 4:6 says speech should be:', ['Gracious, seasoned with salt', 'Harsh', 'Endless', 'Secret'], 0, 'Wise speech.', 'intermediate'),
    mc('sy-p16-2a1', 'Why avoid a testimony that never mentions sin or the cross?', ['It is not the biblical gospel', 'It is too long', 'It is old-fashioned', 'It offends no one'], 0, 'Gospel clarity.', 'advanced'),
    mc('sy-p16-2a2', 'Using Scripture in evangelism is important because:', ['Faith comes by hearing God’s word (Romans 10:17)', 'Stories replace the Bible', 'Feelings are enough', 'Culture replaces truth'], 0, 'Word-centered faith.', 'advanced'),
    mc('sy-p16-2b3', 'Philip explained Scripture to the Ethiopian (Acts 8) showing:', ['Jesus from the Scriptures', 'Politics', 'Philosophy only', 'Temple rituals only'], 0, 'Christ in OT.', 'beginner'),
  ],
  'share-listening-and-conversations': [
    mc('sy-p16-3b1', 'Good evangelistic listening includes:', ['Understanding the person’s questions before answering', 'Interrupting constantly', 'Mockery', 'Avoiding Scripture'], 0, 'Proverbs 18:13 spirit.', 'beginner'),
    mc('sy-p16-3b2', 'Asking clarifying questions helps:', ['Avoid attacking straw men', 'Win debates only', 'Change the subject', 'End conversations'], 0, 'Fair engagement.', 'beginner'),
    mc('sy-p16-3i1', 'When someone says "I’m a good person," a wise response is:', ['Ask what standard they use and point to God’s law', 'Agree immediately', 'Change to politics', 'Leave'], 0, 'Law and gospel.', 'intermediate'),
    mc('sy-p16-3i2', 'Paul at Athens (Acts 17) modeled:', ['Starting with creation and pointing to resurrection', 'Ignoring culture entirely', 'Only quoting poets', 'Avoiding the resurrection'], 0, 'Contextual engagement.', 'intermediate'),
    mc('sy-p16-3a1', 'Why is it wrong to manipulate emotionally in evangelism?', ['It bypasses truth and genuine repentance/faith', 'It is too effective', 'It is biblical', 'It is required'], 0, 'Integrity in witness.', 'advanced'),
    mc('sy-p16-3a2', 'Handling objections fairly means:', ['Representing the other view accurately before responding', 'Caricaturing', 'Silence', 'Agreement'], 0, 'Part 0.5 distinctions.', 'advanced'),
    mc('sy-p16-3b3', 'James 1:19 urges believers to be:', ['Quick to hear, slow to speak', 'Quick to anger', 'Slow to listen', 'Silent always'], 0, 'Listening virtue.', 'beginner'),
  ],
  'share-follow-up-patience': [
    mc('sy-p16-4b1', 'Evangelism often requires:', ['Patience and follow-up', 'One conversation only', 'Giving up after refusal', 'Manipulation'], 0, 'Long-term love.', 'beginner'),
    mc('sy-p16-4b2', 'Planting and watering (1 Corinthians 3:6) teaches:', ['God gives growth; we serve faithfully', 'We save people', 'Results are guaranteed quickly', 'Only apostles evangelize'], 0, 'God-centered results.', 'beginner'),
    mc('sy-p16-4i1', 'When someone is not ready to believe, we should:', ['Keep loving, praying, and speaking truth when appropriate', 'Mock them', 'Cut off all contact angrily', 'Hide our faith'], 0, 'Persistent love.', 'intermediate'),
    mc('sy-p16-4i2', 'Inviting someone to church or Bible study can:', ['Continue the conversation in community', 'Replace the gospel', 'Guarantee conversion', 'Avoid Scripture'], 0, 'Follow-up tools.', 'intermediate'),
    mc('sy-p16-4a1', 'Why trust God with results in evangelism?', ['Salvation is his work; we are faithful messengers', 'We control hearts', 'Numbers prove success', 'Failure means God failed'], 0, 'Monergism in witness.', 'advanced'),
    mc('sy-p16-4a2', 'Discouragement in evangelism is answered by:', ['God’s sovereignty and promise to build his church', 'Quitting', 'Changing the gospel', 'Silence'], 0, 'Matthew 16:18 hope.', 'advanced'),
    mc('sy-p16-4b3', 'Galatians 6:9 encourages us not to grow weary in:', ['Doing good', 'Debate', 'Sleep', 'Wealth'], 0, 'Perseverance in good.', 'beginner'),
  ],
}
