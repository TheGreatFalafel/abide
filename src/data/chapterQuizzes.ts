import type { PassageRef } from './books'
import type { McQuestion, OpenQuestion, QuizQuestion } from './planQuizzes'

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

/** Chapter-keyed bank: bookId:chapter → specific questions */
export const CHAPTER_QUIZ_BANK: Record<string, QuizQuestion[]> = {
  'genesis:1': [
    mc('g1-a', 'In Genesis 1, what does God call His creation repeatedly?', ['Useful', 'Good', 'Finished', 'Mysterious'], 1),
    mc('g1-b', 'On which day did God create humankind?', ['Day 1', 'Day 3', 'Day 6', 'Day 7'], 2),
    open('g1-c', 'What does “in the image of God” mean for how you treat people today?'),
  ],
  'genesis:2': [
    mc('g2-a', 'God forms Adam from the…', ['Dust of the ground', 'Water of the sea', 'Stars', 'Trees of Eden'], 0),
    mc('g2-b', 'What does God say is “not good” in Genesis 2?', ['That the man should be alone', 'That animals exist', 'That the garden has rivers', 'That work exists'], 0),
    open('g2-c', 'How does Genesis 2 shape your view of work or rest?'),
  ],
  'genesis:3': [
    mc('g3-a', 'What does the serpent tempt Eve to doubt?', ["God's word and goodness", 'Noah’s flood', 'Abraham’s promise', 'Joseph’s dreams'], 0),
    mc('g3-b', 'After they sin, Adam and Eve…', ['Hide from God', 'Build a city', 'Offer a census', 'Leave for Egypt'], 0),
    open('g3-c', 'Where do you see both judgment and mercy in Genesis 3?'),
  ],
  'genesis:4': [
    mc('g4-a', 'Cain kills his brother…', ['Abel', 'Seth', 'Noah', 'Enoch'], 0),
    mc('g4-b', 'God warns Cain that sin is…', ['Crouching at the door', 'Already forgotten', 'Impossible', 'Only for others'], 0),
    open('g4-c', 'Where do you need to master anger or jealousy before it masters you?'),
  ],
  'genesis:5': [
    mc('g5-a', 'Genesis 5 repeatedly notes that each patriarch…', ['Died', 'Became king', 'Built Babel', 'Went to Egypt'], 0),
    mc('g5-b', 'Enoch is set apart because he…', ['Walked with God', 'Built an ark', 'Fought Cain', 'Named the animals'], 0),
    open('g5-c', 'What would “walking with God” look like in your ordinary week?'),
  ],
  'genesis:6': [
    mc('g6-a', 'Why does God decide to send the flood?', ['Human wickedness filled the earth', 'Noah asked for rain', 'Egypt attacked', 'Babel was finished'], 0),
    mc('g6-b', 'Who finds favor with God?', ['Noah', 'Cain', 'Lamech only', 'The Nephilim'], 0),
    open('g6-c', 'What does Noah’s obedience teach you about walking with God?'),
  ],
  'genesis:7': [
    mc('g7-a', 'Who enters the ark with Noah?', ['His family and the animals God appointed', 'Only priests', 'Pharaoh’s army', 'The whole city of Babel'], 0),
    mc('g7-b', 'The flood waters…', ['Cover the earth as God said', 'Stop at the hills', 'Never come', 'Only hit Egypt'], 0),
    open('g7-c', 'How does God’s judgment and rescue in the flood stir your trust?'),
  ],
  'genesis:8': [
    mc('g8-a', 'Noah learns the waters have receded when…', ['A dove returns with an olive leaf', 'He sees Pharaoh', 'Stars fall', 'Babel is built'], 0),
    mc('g8-b', 'After leaving the ark, Noah…', ['Builds an altar and worships', 'Returns to Eden', 'Crowns himself king', 'Hides from God'], 0),
    open('g8-c', 'What “altar” of gratitude could you offer God after a hard season?'),
  ],
  'genesis:9': [
    mc('g9-a', 'God’s covenant sign with Noah is…', ['A rainbow', 'A temple veil', 'Roman citizenship', 'A census'], 0),
    mc('g9-b', 'God promises never again to…', ['Destroy all flesh by a flood', 'Judge sin', 'Bless families', 'Speak to people'], 0),
    open('g9-c', 'How does God’s covenant faithfulness steady you today?'),
  ],
  'genesis:11': [
    mc('g11-a', 'At Babel, people try to…', ['Make a name for themselves by building a tower', 'Worship God alone', 'Follow Abraham', 'Enter the ark'], 0),
    mc('g11-b', 'God confuses their…', ['Language', 'Food supply', 'Temple map', 'Roman roads'], 0),
    open('g11-c', 'Where are you tempted to build your own “name” apart from God?'),
  ],
  'genesis:12': [
    mc('g12-a', 'God calls Abram to…', ['Leave his country for a land God will show him', 'Build Babel', 'Stay in Ur forever', 'Become Pharaoh'], 0),
    mc('g12-b', 'God promises Abram that…', ['All families of the earth will be blessed through him', 'He will never have children', 'He must stay childless', 'Egypt will rule forever'], 0),
    open('g12-c', 'Where is God asking you to trust Him with an unknown next step?'),
  ],
  'genesis:22': [
    mc('g22-a', 'God tests Abraham by asking him to…', ['Offer Isaac', 'Leave Canaan forever', 'Fight Pharaoh', 'Build an ark'], 0),
    mc('g22-b', 'Abraham names the place…', ['The Lord will provide', 'Babel', 'Bethel only', 'Egypt'], 0),
    open('g22-c', 'How does this chapter point you toward God’s provision?'),
  ],
  'exodus:3': [
    mc('e3-a', 'God appears to Moses in…', ['A burning bush', 'A dream of sheaves', 'A pillar of salt', 'A census list'], 0),
    mc('e3-b', 'God reveals His name as…', ['I AM WHO I AM', 'Baal', 'Pharaoh', 'Elohim of Egypt only'], 0),
    open('e3-c', 'What “burning bush” calling might God be putting before you?'),
  ],
  'exodus:12': [
    mc('e12-a', 'Israel is protected by…', ['The blood of the Passover lamb', 'Egyptian gold', 'A Roman guard', 'Silence'], 0),
    mc('e12-b', 'Passover remembers God’s…', ['Rescue from Egypt', 'Building of Babel', 'Fall of Jericho only', 'Exile to Babylon'], 0),
    open('e12-c', 'How does Passover deepen your gratitude for rescue?'),
  ],
  'exodus:20': [
    mc('e20-a', 'The Ten Commandments begin with…', ['Who God is and what He has done', 'A tax code', 'A map of Canaan', 'Temple measurements'], 0),
    open('e20-b', 'Which commandment most challenges you right now, and why?'),
    mc('e20-c', 'The law reveals God’s…', ['Holy character and good design for life', 'Indifference', 'Need for our help', 'Preference for chaos'], 0),
  ],
  'matthew:1': [
    mc('m1-a', 'Matthew opens by presenting Jesus as…', ['Son of David and Abraham — the Messiah', 'A Roman citizen', 'Only a prophet from Nazareth', 'A Pharisee'], 0),
    mc('m1-b', 'An angel tells Joseph that Jesus will…', ['Save His people from their sins', 'Rule Rome', 'Avoid Bethlehem', 'Become a scribe only'], 0),
    open('m1-c', 'What does Jesus’ family line teach you about God’s faithfulness?'),
  ],
  'matthew:2': [
    mc('m2-a', 'Why do Mary and Joseph take Jesus to Egypt?', ['Herod is trying to kill Him', 'They prefer Egyptian food', 'Caesar ordered a vacation', 'The Magi lived there'], 0),
    mc('m2-b', 'Who visits Jesus bringing gifts?', ['Magi / wise men from the east', 'Roman soldiers', 'Pharaoh', 'John the Baptist'], 0),
    mc('m2-c', 'Herod’s rage leads to…', ['The killing of boys in Bethlehem', 'Building the temple', 'Baptizing Jesus', 'Writing a gospel'], 0),
    open('m2-d', 'Where do you see God protecting His purposes even in danger?'),
  ],
  'matthew:3': [
    mc('m3-a', 'Who baptizes Jesus in the Jordan?', ['John the Baptist', 'Peter', 'Herod', 'Nicodemus'], 0),
    mc('m3-b', 'At Jesus’ baptism, the Father says…', ['This is my beloved Son', 'Build a temple now', 'Avoid the cross', 'Rule Rome first'], 0),
    open('m3-c', 'How does Jesus’ baptism encourage your own obedience?'),
  ],
  'matthew:4': [
    mc('m4-a', 'Jesus is tempted in the wilderness by…', ['The devil', 'Herod', 'Pilate', 'A Pharisee only'], 0),
    mc('m4-b', 'Jesus answers temptation by…', ['Quoting Scripture', 'Using Roman power', 'Ignoring God', 'Calling Magi'], 0),
    open('m4-c', 'Which temptation do you most need Scripture to answer right now?'),
  ],
  'matthew:5': [
    mc('m5-a', 'The Sermon on the Mount begins with the…', ['Beatitudes', 'Ten Commandments', 'Great Commission', 'Lord’s Prayer only'], 0),
    mc('m5-b', 'Jesus says His disciples are…', ['Salt of the earth and light of the world', 'Tax collectors for Rome', 'Temple guards', 'Silent forever'], 0),
    open('m5-c', 'Which Beatitude do you most need to live out this week?'),
  ],
  'matthew:6': [
    mc('m6-a', 'Jesus teaches us to pray…', ['Our Father in heaven…', 'Only in public for praise', 'To idols', 'Without forgiveness'], 0),
    mc('m6-b', 'Jesus says to seek first…', ['The kingdom of God', 'Wealth', 'Worry', 'Roman approval'], 0),
    open('m6-c', 'What worry do you need to entrust to your Father today?'),
  ],
  'matthew:7': [
    mc('m7-a', 'Jesus says to enter through the…', ['Narrow gate', 'Temple treasury', 'Roman forum', 'Wide gate only'], 0),
    mc('m7-b', 'A wise person builds their house on…', ['The rock — hearing and doing Jesus’ words', 'Sand of popularity', 'Gold', 'Silence'], 0),
    open('m7-c', 'What word of Jesus do you need to put into practice this week?'),
  ],
  'matthew:8': [
    mc('m8-a', 'Jesus shows authority by…', ['Healing and calming storms', 'Collecting taxes', 'Avoiding lepers', 'Building Babel'], 0),
    mc('m8-b', 'A centurion amazes Jesus with his…', ['Faith', 'Wealth', 'Anger', 'Silence'], 0),
    open('m8-c', 'Where do you need to trust Jesus’ authority like the centurion?'),
  ],
  'matthew:9': [
    mc('m9-a', 'Jesus forgives and heals a…', ['Paralytic', 'Pharaoh', 'Magi', 'Temple veil'], 0),
    mc('m9-b', 'Jesus says He came to call…', ['Sinners', 'Only the righteous', 'Romans alone', 'Silent monks'], 0),
    open('m9-c', 'How does Jesus’ welcome of sinners reshape your view of grace?'),
  ],
  'matthew:10': [
    mc('m10-a', 'Jesus sends the Twelve to…', ['Proclaim the kingdom and heal', 'Collect temple tax only', 'Build an ark', 'Rule Judea'], 0),
    mc('m10-b', 'Disciples are told not to fear those who…', ['Kill the body but cannot kill the soul', 'Offer food', 'Pray', 'Read Scripture'], 0),
    open('m10-c', 'Where is Jesus sending you to speak or serve with courage?'),
  ],
  'matthew:28': [
    mc('m28-a', 'After the resurrection, Jesus commissions disciples to…', ['Make disciples of all nations', 'Stay only in Galilee forever', 'Hide the news', 'Build Babel'], 0),
    mc('m28-b', 'Jesus promises…', ['I am with you always', 'You will never suffer', 'Rome will convert first', 'The temple will never fall'], 0),
    open('m28-c', 'How will you take one step of the Great Commission this week?'),
  ],
  'mark:1': [
    mc('mk1-a', 'Mark’s Gospel opens with…', ['The beginning of the gospel of Jesus Christ', 'A long genealogy', 'Paul’s letters', 'The fall of Jerusalem'], 0),
    mc('mk1-b', 'Jesus’ early ministry is marked by…', ['Authority in teaching and healing', 'Avoiding people', 'Temple taxes', 'Roman politics'], 0),
    open('mk1-c', 'Where do you need Jesus’ authority in your life right now?'),
  ],
  'mark:8': [
    mc('mk8-a', 'Peter confesses Jesus as the…', ['Christ', 'Baptist', 'Pharisee', 'Tax collector'], 0),
    mc('mk8-b', 'Jesus says anyone who would follow Him must…', ['Deny himself, take up his cross, and follow', 'Seek wealth first', 'Avoid suffering', 'Rule Rome'], 0),
    open('mk8-c', 'What would “taking up your cross” look like for you today?'),
  ],
  'luke:2': [
    mc('lk2-a', 'Jesus is born in…', ['Bethlehem', 'Rome', 'Nazareth palace', 'Egypt’s capital'], 0),
    mc('lk2-b', 'Angels announce good news to…', ['Shepherds', 'Herod only', 'Caesar', 'Temple traders'], 0),
    open('lk2-c', 'How does the humility of Jesus’ birth shape your worship?'),
  ],
  'luke:15': [
    mc('lk15-a', 'Luke 15 includes the lost sheep, coin, and…', ['Lost son', 'Lost temple', 'Lost scroll', 'Lost city'], 0),
    mc('lk15-b', 'Heaven rejoices when…', ['A sinner repents', 'A census is finished', 'Rome expands', 'Wealth increases'], 0),
    open('lk15-c', 'Who is God inviting you to welcome or pursue in love?'),
  ],
  'john:1': [
    mc('jn1-a', 'John says the Word…', ['Became flesh and dwelt among us', 'Remained only in heaven', 'Was created on day 1', 'Is a lesser angel'], 0),
    mc('jn1-b', 'John the Baptist’s role is to…', ['Bear witness to the light', 'Become the Messiah', 'Rule Judea', 'Write Romans'], 0),
    open('jn1-c', 'What does “the Word became flesh” mean for your relationship with Jesus?'),
  ],
  'john:3': [
    mc('jn3-a', 'Jesus tells Nicodemus he must be…', ['Born again / from above', 'A Sanhedrin leader first', 'Silent forever', 'A temple guard'], 0),
    mc('jn3-b', 'John 3:16 says God gave His Son so that…', ['Whoever believes may have eternal life', 'Rome would convert', 'The law would end all mercy', 'Only Israel could be saved'], 0),
    open('jn3-c', 'How is Jesus inviting you to believe and live in the light?'),
  ],
  'john:14': [
    mc('jn14-a', 'Jesus says He is…', ['The way, the truth, and the life', 'One of many equal ways', 'Only a teacher', 'A temporary prophet'], 0),
    mc('jn14-b', 'Jesus promises another Helper, the…', ['Holy Spirit', 'Roman army', 'Temple veil', 'Census taker'], 0),
    open('jn14-c', 'Where do you need Jesus’ peace that the world cannot give?'),
  ],
  'acts:1': [
    mc('a1-a', 'Before ascending, Jesus promises the disciples will receive…', ['Power when the Holy Spirit comes', 'Roman citizenship', 'Temple gold', 'A new census'], 0),
    mc('a1-b', 'The disciples are to be witnesses…', ['In Jerusalem, Judea, Samaria, and to the end of the earth', 'Only in Galilee', 'Only to Rome’s elite', 'Never outside Judea'], 0),
    open('a1-c', 'Where is your “Jerusalem” to begin witnessing this week?'),
  ],
  'acts:2': [
    mc('a2-a', 'At Pentecost, the Spirit enables…', ['Speaking in other tongues / languages', 'Building Babel', 'Avoiding prayer', 'Tax collection'], 0),
    mc('a2-b', 'Peter’s sermon centers on…', ['Jesus crucified and raised', 'Roman law', 'Temple architecture', 'Abraham’s only'], 0),
    open('a2-c', 'How is the Spirit empowering your boldness for Jesus?'),
  ],
  'acts:3': [
    mc('a3-a', 'Peter heals a lame man…', ['In Jesus’ name', 'With Roman medicine', 'By temple gold', 'By silence'], 0),
    mc('a3-b', 'Peter points the crowd to…', ['Jesus, whom God raised', 'Herod’s power', 'Babel', 'Their own works'], 0),
    open('a3-c', 'Where can you point someone to Jesus’ power this week?'),
  ],
  'acts:4': [
    mc('a4-a', 'Peter and John are arrested for…', ['Proclaiming Jesus’ resurrection', 'Paying taxes', 'Building walls', 'Leaving Jerusalem'], 0),
    mc('a4-b', 'The believers pray for…', ['Boldness to keep speaking', 'Quiet retirement', 'Roman favor only', 'Less Scripture'], 0),
    open('a4-c', 'What boldness are you asking the Spirit for today?'),
  ],
  'acts:5': [
    mc('a5-a', 'Ananias and Sapphira lie about…', ['Their gift / money', 'Noah’s flood', 'Herod’s decree', 'Temple size'], 0),
    mc('a5-b', 'The apostles say they must…', ['Obey God rather than men', 'Obey the Sanhedrin first', 'Stop teaching', 'Hide forever'], 0),
    open('a5-c', 'Where do you need integrity before God more than people’s approval?'),
  ],
  'acts:6': [
    mc('a6-a', 'Seven are chosen to…', ['Serve widows and free the apostles for the word', 'Collect Roman taxes', 'Build Babel', 'Guard Herod'], 0),
    mc('a6-b', 'Stephen is described as…', ['Full of faith and the Holy Spirit', 'A temple trader', 'A Roman spy', 'Silent forever'], 0),
    open('a6-c', 'How might serving others free the gospel to advance around you?'),
  ],
  'acts:7': [
    mc('a7-a', 'Stephen’s speech retells…', ['Israel’s story and points to Jesus', 'Roman history only', 'Noah’s animals', 'Temple measurements'], 0),
    mc('a7-b', 'Stephen becomes the church’s…', ['First martyr', 'First emperor', 'Temple high priest', 'Census taker'], 0),
    open('a7-c', 'What from Stephen’s courage encourages your witness?'),
  ],
  'acts:8': [
    mc('a8-a', 'Philip explains Isaiah to…', ['The Ethiopian eunuch', 'Herod', 'Pilate', 'Nicodemus only'], 0),
    mc('a8-b', 'Persecution leads the church to…', ['Scatter and preach the word', 'Stop meeting', 'Build Babel', 'Hide the gospel'], 0),
    open('a8-c', 'Where might God use disruption to spread the good news through you?'),
  ],
  'acts:9': [
    mc('a9-a', 'On the road to Damascus, Jesus confronts…', ['Saul / Paul', 'Peter only', 'Herod', 'Nicodemus'], 0),
    mc('a9-b', 'Saul is converted from persecutor to…', ['Apostle and witness', 'Temple guard', 'Roman governor', 'Silent monk forever'], 0),
    open('a9-c', 'Where might God be rewriting someone’s story — including yours?'),
  ],
  'romans:3': [
    mc('r3-a', 'Paul teaches that all have…', ['Sinned and fall short of God’s glory', 'Earned salvation by works', 'No need of grace', 'Perfect righteousness'], 0),
    mc('r3-b', 'Justification is by…', ['Grace through faith', 'Law-keeping alone', 'Family heritage', 'Temple gifts'], 0),
    open('r3-c', 'How does justification by faith free you from pride or despair?'),
  ],
  'romans:8': [
    mc('r8-a', 'There is now no condemnation for…', ['Those in Christ Jesus', 'Those who never fail', 'Roman citizens only', 'Temple priests alone'], 0),
    mc('r8-b', 'Nothing can separate us from…', ['The love of God in Christ Jesus', 'Earthly comfort', 'Political power', 'Human approval'], 0),
    open('r8-c', 'What fear does Romans 8 invite you to release?'),
  ],
  'psalms:1': [
    mc('ps1-a', 'Psalm 1 contrasts the righteous with…', ['The wicked / scoffers', 'The wealthy only', 'The priests', 'The kings'], 0),
    mc('ps1-b', 'The blessed person delights in…', ['The law of the Lord', 'Avoiding Scripture', 'Mockery', 'Idle talk'], 0),
    open('ps1-c', 'What habit would help you delight in God’s Word this week?'),
  ],
  'psalms:23': [
    mc('ps23-a', 'The Lord is described as…', ['My shepherd', 'A distant star', 'A merchant', 'A census taker'], 0),
    mc('ps23-b', 'Even in the valley of the shadow of death, the psalmist…', ['Fears no evil, for God is with him', 'Gives up hope', 'Trusts idols', 'Runs from God'], 0),
    open('ps23-c', 'Where do you need the Shepherd’s presence today?'),
  ],
  'psalms:51': [
    mc('ps51-a', 'David asks God to…', ['Create in him a clean heart', 'Ignore his sin', 'Destroy the temple', 'Make him king of Egypt'], 0),
    open('ps51-b', 'What confession or renewal do you need to bring to God?'),
    mc('ps51-c', 'True sacrifice in this psalm includes…', ['A broken and contrite heart', 'Only animals', 'Silence forever', 'Public image'], 0),
  ],
  'ezra:1': [
    mc('ez1-a', 'Who decrees that the exiles may return and rebuild?', ['Cyrus king of Persia', 'Pharaoh', 'Herod', 'Caesar'], 0),
    mc('ez1-b', 'The return centers on rebuilding…', ['The house of the Lord in Jerusalem', 'Babel', 'Rome', 'Egypt’s pyramids'], 0),
    open('ez1-c', 'Where is God opening a door for renewal in your life?'),
  ],
  'ezra:2': [
    mc('ez2-a', 'Ezra 2 lists people who…', ['Returned from exile to Judah', 'Built Babel', 'Followed Herod', 'Left on the ark'], 0),
    mc('ez2-b', 'The returnees gather to…', ['Jerusalem and their towns', 'Rome only', 'Egypt’s palace', 'Mount Sinai alone'], 0),
    open('ez2-c', 'How does God restoring a people encourage your hope for restoration?'),
  ],
  'ezra:3': [
    mc('ez3-a', 'The people rebuild the…', ['Altar and lay the temple foundation', 'Tower of Babel', 'Roman forum', 'Ark of Noah'], 0),
    mc('ez3-b', 'When the foundation is laid, there is…', ['Shouting of joy and weeping mixed', 'Only silence', 'A census fight', 'Herod’s parade'], 0),
    open('ez3-c', 'Where is God inviting you to rebuild worship at the center?'),
  ],
  'ezra:4': [
    mc('ez4-a', 'Opponents try to…', ['Stop the temple rebuilding', 'Help finish faster', 'Crown Cyrus in Judah', 'Hide Scripture'], 0),
    mc('ez4-b', 'The work is hindered by…', ['Accusation and royal decree', 'Lack of stone only', 'Noah’s flood', 'Magi gifts'], 0),
    open('ez4-c', 'How do you respond when obedience meets opposition?'),
  ],
  'ezra:5': [
    mc('ez5-a', 'Prophets encourage the people to…', ['Resume building the house of God', 'Flee to Egypt', 'Stop praying', 'Serve Herod'], 0),
    mc('ez5-b', 'Officials investigate but the builders…', ['Keep working while answering', 'Destroy the altar', 'Leave forever', 'Hide the scrolls'], 0),
    open('ez5-c', 'What unfinished work of faith do you need courage to resume?'),
  ],
  'ezra:6': [
    mc('ez6-a', 'The temple is finally…', ['Completed and dedicated', 'Moved to Babylon', 'Given to Rome', 'Abandoned'], 0),
    mc('ez6-b', 'The people celebrate with…', ['Passover joy', 'Babel building', 'Silent exile', 'Roman games'], 0),
    open('ez6-c', 'What completed mercy of God do you want to celebrate today?'),
  ],
  'ezra:7': [
    mc('ez7-a', 'Ezra is described as…', ['A scribe skilled in the Law of Moses', 'A Roman governor', 'Herod’s advisor', 'A Magi king'], 0),
    mc('ez7-b', 'Ezra’s mission includes…', ['Teaching God’s law in Israel', 'Building Babel', 'Stopping prayer', 'Hiding the temple'], 0),
    open('ez7-c', 'How is God calling you to know and share His Word more carefully?'),
  ],
  'ezra:8': [
    mc('ez8-a', 'Before the journey, Ezra proclaims a…', ['Fast to seek God', 'War on Persia', 'Census for Rome', 'Feast for Herod'], 0),
    mc('ez8-b', 'They carry temple treasures and…', ['Arrive safely by God’s hand', 'Lose everything', 'Stay in Babylon', 'Give them to Pharaoh'], 0),
    open('ez8-c', 'Where do you need to seek God before a risky next step?'),
  ],
  'ezra:9': [
    mc('ez9-a', 'Ezra is horrified by…', ['Intermarriage that compromises holiness', 'Too much prayer', 'Temple singing', 'Returning from exile'], 0),
    mc('ez9-b', 'Ezra responds with…', ['Confession and mourning', 'Pride', 'Silence forever', 'Building Babel'], 0),
    open('ez9-c', 'What compromise do you need to bring to God in honest confession?'),
  ],
  'ezra:10': [
    mc('ez10-a', 'The people agree to…', ['Put away unfaithfulness and obey', 'Abandon the temple', 'Serve Herod', 'Stop reading the Law'], 0),
    mc('ez10-b', 'Reform includes…', ['Public confession and concrete change', 'Ignoring sin', 'Hiding truth', 'Leaving Jerusalem forever'], 0),
    open('ez10-c', 'What concrete step of repentance is God inviting from you?'),
  ],
  'nehemiah:1': [
    mc('ne1-a', 'Nehemiah weeps over…', ['Jerusalem’s broken walls', 'A lost sheep', 'Roman taxes', 'Noah’s flood'], 0),
    mc('ne1-b', 'Nehemiah’s first response is to…', ['Pray and fast', 'Ignore the news', 'Attack Persia', 'Build Babel'], 0),
    open('ne1-c', 'What broken place are you bringing to God in prayer?'),
  ],
  'proverbs:1': [
    mc('pr1-a', 'The fear of the Lord is the beginning of…', ['Knowledge', 'Wealth', 'Silence', 'War'], 0),
    open('pr1-b', 'Where do you need to choose wisdom over folly this week?'),
    mc('pr1-c', 'Fools in Proverbs…', ['Despise wisdom and instruction', 'Love correction', 'Fear the Lord', 'Seek counsel'], 0),
  ],
  'revelation:21': [
    mc('rv21-a', 'John sees…', ['A new heaven and a new earth', 'Babel rebuilt', 'Rome forever', 'Eden erased'], 0),
    mc('rv21-b', 'God will wipe away…', ['Every tear', 'All memory of Jesus', 'The church', 'Prayer'], 0),
    open('rv21-c', 'How does the hope of the new creation steady you now?'),
  ],
}

function genericForChapter(ref: PassageRef): QuizQuestion[] {
  const label = `${ref.bookName} ${ref.chapter}`
  return [
    mc(
      `${ref.bookId}-${ref.chapter}-g1`,
      `You just read ${label}. Which is true?`,
      [
        `This passage is from ${ref.bookName}`,
        'This passage is from Revelation only',
        'This passage is not in the Bible',
        'This passage is a modern letter only',
      ],
      0,
    ),
    open(
      `${ref.bookId}-${ref.chapter}-g2`,
      `In ${label}, what stood out most about God or people?`,
    ),
    open(
      `${ref.bookId}-${ref.chapter}-g3`,
      `What is one concrete response ${label} invites from you?`,
    ),
    mc(
      `${ref.bookId}-${ref.chapter}-g4`,
      `When reading ${label}, the best next step is to…`,
      [
        'Ask what God is showing you and respond',
        'Ignore the passage',
        'Only skim for trivia',
        'Avoid applying it',
      ],
      0,
    ),
  ]
}

export function questionsForChapter(ref: PassageRef): QuizQuestion[] {
  const key = `${ref.bookId}:${ref.chapter}`
  const specific = CHAPTER_QUIZ_BANK[key]
  if (specific?.length) return specific
  return genericForChapter(ref)
}

function mulberry32(seed: number) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Build a quiz from specific chapters recently read.
 * Prefers one-chapter questions; cycles which chapters/questions appear.
 */
export function buildChapterQuiz(
  passages: PassageRef[],
  seed: number,
  askCount = 4,
): { title: string; blurb: string; questions: QuizQuestion[] } {
  const unique = new Map<string, PassageRef>()
  for (const p of passages) {
    unique.set(`${p.bookId}:${p.chapter}`, p)
  }
  const chapters = [...unique.values()]
  const rand = mulberry32(seed)

  if (!chapters.length) {
    return {
      title: 'Section quiz',
      blurb: 'Review what you have been reading.',
      questions: [
        open('fallback-1', 'What is one truth you want to remember from your recent reading?'),
        open('fallback-2', 'How will you respond to God today?'),
      ],
    }
  }

  // One chapter per visit so multi-stream days stay focused; seed cycles which chapter
  const focus = shuffle(chapters, rand)[0]
  const pool = questionsForChapter(focus)
  const picked = shuffle(pool, rand).slice(0, Math.min(askCount, pool.length))
  const label = `${focus.bookName} ${focus.chapter}`

  return {
    title: `${label} check`,
    blurb: `Questions about ${label}`,
    questions: picked,
  }
}
