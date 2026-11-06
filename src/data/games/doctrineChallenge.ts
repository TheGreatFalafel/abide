import type { GameDifficulty } from '../../games/types'

export type DoctrineBin = 'orthodox' | 'heresy' | 'debated'

export type DoctrineChallengeItem = {
  id: string
  statement: string
  answer: DoctrineBin
  name: string
  explanation: string
  difficulty: GameDifficulty
  reference?: string
}

/** Update Pack Part 7.1 — bins: Orthodox / Heresy / Debated */
export const DOCTRINE_CHALLENGE_BANK: DoctrineChallengeItem[] = [
  { id: 'dc-1', statement: 'Jesus is both fully God and fully man', answer: 'orthodox', name: 'Chalcedonian Christology', explanation: 'Historic Christianity confesses two natures in one person.', difficulty: 'beginner' },
  { id: 'dc-2', statement: 'Jesus was only a man', answer: 'heresy', name: 'Denial of deity', explanation: 'Ebionism/adoptionism deny His full deity.', difficulty: 'beginner' },
  { id: 'dc-3', statement: 'There are three persons in one God', answer: 'orthodox', name: 'The Trinity', explanation: 'One essence, three persons.', difficulty: 'beginner' },
  { id: 'dc-4', statement: 'Jesus only seemed to have a body', answer: 'heresy', name: 'Docetism', explanation: 'Docetism denies true incarnation.', difficulty: 'beginner' },
  { id: 'dc-5', statement: 'We are saved by grace through faith', answer: 'orthodox', name: 'Ephesians 2:8-9', explanation: 'Salvation is God’s gift, not our wage.', difficulty: 'beginner', reference: 'Ephesians 2:8-9' },
  { id: 'dc-6', statement: "The Bible is God's Word", answer: 'orthodox', name: 'Inspiration', explanation: 'Scripture is God-breathed.', difficulty: 'beginner', reference: '2 Timothy 3:16' },
  { id: 'dc-7', statement: 'Jesus did not rise bodily', answer: 'heresy', name: 'Denial of bodily resurrection', explanation: '1 Corinthians 15 makes bodily resurrection essential.', difficulty: 'beginner', reference: '1 Corinthians 15' },
  { id: 'dc-8', statement: 'God is love', answer: 'orthodox', name: '1 John 4:8', explanation: 'Love is essential to God’s character.', difficulty: 'beginner', reference: '1 John 4:8' },
  { id: 'dc-9', statement: 'One God appears as Father, then Son, then Spirit', answer: 'heresy', name: 'Modalism', explanation: 'Sabellian modalism denies simultaneous personal distinction.', difficulty: 'intermediate' },
  { id: 'dc-10', statement: 'The Son was created by the Father', answer: 'heresy', name: 'Arianism', explanation: 'Arius denied the Son’s eternal deity.', difficulty: 'intermediate' },
  { id: 'dc-11', statement: 'Man can save himself without grace', answer: 'heresy', name: 'Pelagianism', explanation: 'Pelagius denied the necessity of regenerating grace.', difficulty: 'intermediate' },
  { id: 'dc-12', statement: "Fallen man can begin to believe without God's prior work in his heart", answer: 'heresy', name: 'Semi-Pelagianism', explanation: 'Rejected at Orange (529); grace must enable faith.', difficulty: 'intermediate' },
  { id: 'dc-13', statement: 'Christ has two natures in one person', answer: 'orthodox', name: 'Chalcedon (451)', explanation: 'Without confusion, change, division, or separation.', difficulty: 'intermediate' },
  { id: 'dc-14', statement: "Christ's divine and human natures merged into one", answer: 'heresy', name: 'Eutychianism', explanation: 'Monophysitism confuses the natures.', difficulty: 'intermediate' },
  { id: 'dc-15', statement: 'Christ is two persons', answer: 'heresy', name: 'Nestorianism', explanation: 'Nestorianism divides the person.', difficulty: 'intermediate' },
  { id: 'dc-16', statement: 'Matter is evil, and secret knowledge saves', answer: 'heresy', name: 'Gnosticism', explanation: 'Gnosticism denies good creation and public gospel.', difficulty: 'intermediate' },
  { id: 'dc-17', statement: "Christ's righteousness is credited to believers", answer: 'orthodox', name: 'Imputation', explanation: 'Romans 4 teaches righteousness counted to faith.', difficulty: 'intermediate', reference: 'Romans 4:5' },
  { id: 'dc-18', statement: "The divine Word took the place of Christ's human mind", answer: 'heresy', name: 'Apollinarianism', explanation: 'Condemned in 381; Christ took a full human nature.', difficulty: 'advanced' },
  { id: 'dc-19', statement: 'The Son is of a similar, but not the same, substance as the Father', answer: 'heresy', name: 'Semi-Arianism', explanation: 'Homoiousios falls short of homoousios.', difficulty: 'advanced' },
  { id: 'dc-20', statement: 'The Holy Spirit proceeds from the Father and the Son', answer: 'orthodox', name: 'Filioque', explanation: 'TMS affirms the filioque; Orthodoxy disagrees — taught as app position.', difficulty: 'advanced' },
  { id: 'dc-21', statement: 'The miraculous sign gifts ceased with the apostolic age', answer: 'debated', name: 'Cessationism', explanation: 'Debated among believers; the app teaches TMS cessationism.', difficulty: 'advanced' },
  { id: 'dc-22', statement: "Christ's atonement was designed to secure the salvation of those the Father gave Him", answer: 'debated', name: 'Definite atonement', explanation: 'Debated among evangelicals; TMS / app teach definite atonement.', difficulty: 'advanced' },
  { id: 'dc-23', statement: 'Justification is a process in which righteousness is infused', answer: 'heresy', name: 'Infused justification', explanation: 'Reformers rejected infused justification; TMS says it is not infused.', difficulty: 'advanced' },
  { id: 'dc-24', statement: 'Mary is a co-redeemer with Christ', answer: 'heresy', name: 'Co-redemptrix error', explanation: 'Contradicts the one mediator (1 Timothy 2:5).', difficulty: 'advanced', reference: '1 Timothy 2:5' },
  { id: 'dc-25', statement: 'God is three separate gods', answer: 'heresy', name: 'Tritheism', explanation: 'Tritheism denies monotheism.', difficulty: 'advanced' },
]

export function doctrineChallengeForDifficulty(
  difficulty: GameDifficulty,
  count = 5,
): DoctrineChallengeItem[] {
  const pool = DOCTRINE_CHALLENGE_BANK.filter((q) => q.difficulty === difficulty)
  const copy = [...pool]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, Math.min(count, copy.length))
}
