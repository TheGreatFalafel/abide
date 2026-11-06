import type { GameDifficulty } from '../../games/types'

export type GeographyItem = {
  id: string
  place: string
  /** Approximate; to be verified against a mapping source before map-tap scoring */
  lat: number
  lng: number
  reference: string
  explanation: string
  difficulty: GameDifficulty
  debated?: boolean
  choices: string[]
  answer: number
}

/** Update Pack Part 7.2 — MC place ID until a licensed map tileset is wired. */
export const GEOGRAPHY_BANK: GeographyItem[] = [
  { id: 'geo-1', place: 'Jerusalem', lat: 31.77, lng: 35.21, reference: '2 Samuel 5:6-7', explanation: 'David captured the stronghold of Zion.', difficulty: 'beginner', choices: ['Jerusalem', 'Nineveh', 'Rome', 'Athens'], answer: 0 },
  { id: 'geo-2', place: 'Bethlehem', lat: 31.7, lng: 35.2, reference: 'Matthew 2:1', explanation: 'Jesus was born in Bethlehem of Judea.', difficulty: 'beginner', choices: ['Nazareth', 'Bethlehem', 'Jericho', 'Capernaum'], answer: 1 },
  { id: 'geo-3', place: 'Nazareth', lat: 32.7, lng: 35.3, reference: 'Luke 1:26', explanation: 'Gabriel was sent to Mary in Nazareth.', difficulty: 'beginner', choices: ['Bethlehem', 'Jerusalem', 'Nazareth', 'Damascus'], answer: 2 },
  { id: 'geo-4', place: 'Sea of Galilee', lat: 32.82, lng: 35.59, reference: 'Matthew 4:18', explanation: 'Jesus called fishermen by the Sea of Galilee.', difficulty: 'beginner', choices: ['Dead Sea', 'Red Sea', 'Sea of Galilee', 'Mediterranean only'], answer: 2 },
  { id: 'geo-5', place: 'Jericho', lat: 31.87, lng: 35.44, reference: 'Joshua 6', explanation: 'Israel circled Jericho before its walls fell.', difficulty: 'beginner', choices: ['Jericho', 'Hebron', 'Beersheba', 'Haran'], answer: 0 },
  { id: 'geo-6', place: 'Rome', lat: 41.9, lng: 12.5, reference: 'Acts 28:16', explanation: 'Paul arrived in Rome under guard.', difficulty: 'beginner', choices: ['Athens', 'Corinth', 'Rome', 'Ephesus'], answer: 2 },
  { id: 'geo-7', place: 'Damascus', lat: 33.51, lng: 36.28, reference: 'Acts 9:3', explanation: 'Saul met the risen Lord on the road to Damascus.', difficulty: 'beginner', choices: ['Damascus', 'Tarsus', 'Philippi', 'Patmos'], answer: 0 },
  { id: 'geo-8', place: 'Nineveh', lat: 36.36, lng: 43.15, reference: 'Jonah 1:2', explanation: 'Jonah was sent to Nineveh.', difficulty: 'beginner', choices: ['Babylon', 'Nineveh', 'Ur', 'Bethel'], answer: 1 },
  { id: 'geo-9', place: 'Capernaum', lat: 32.88, lng: 35.58, reference: 'Mark 2:1', explanation: 'Jesus taught and healed in Capernaum.', difficulty: 'intermediate', choices: ['Capernaum', 'Bethlehem', 'Rome', 'Babylon'], answer: 0 },
  { id: 'geo-10', place: 'Bethel', lat: 31.93, lng: 35.22, reference: 'Genesis 28:19', explanation: 'Jacob named the place Bethel.', difficulty: 'intermediate', choices: ['Beersheba', 'Bethel', 'Hebron', 'Jericho'], answer: 1 },
  { id: 'geo-11', place: 'Beersheba', lat: 31.25, lng: 34.79, reference: 'Genesis 21:31', explanation: 'Abraham named Beersheba after the oath.', difficulty: 'intermediate', choices: ['Bethel', 'Beersheba', 'Nazareth', 'Ephesus'], answer: 1 },
  { id: 'geo-12', place: 'Hebron', lat: 31.53, lng: 35.1, reference: 'Genesis 23:2', explanation: 'Sarah died in Hebron; Abraham bought a burial place.', difficulty: 'intermediate', choices: ['Hebron', 'Athens', 'Corinth', 'Patmos'], answer: 0 },
  { id: 'geo-13', place: 'Mount Carmel', lat: 32.73, lng: 35.05, reference: '1 Kings 18:19', explanation: 'Elijah confronted Baal’s prophets on Carmel.', difficulty: 'intermediate', choices: ['Mount Sinai', 'Mount Carmel', 'Mount Ararat', 'Zion only'], answer: 1 },
  { id: 'geo-14', place: 'Babylon', lat: 32.54, lng: 44.42, reference: 'Daniel 1:1', explanation: 'Judah’s exiles were taken to Babylon.', difficulty: 'intermediate', choices: ['Nineveh', 'Rome', 'Babylon', 'Philippi'], answer: 2 },
  { id: 'geo-15', place: 'Antioch of Syria', lat: 36.2, lng: 36.16, reference: 'Acts 11:26', explanation: 'Disciples were first called Christians in Antioch.', difficulty: 'intermediate', choices: ['Antioch of Syria', 'Athens', 'Tarsus', 'Ur'], answer: 0 },
  { id: 'geo-16', place: 'Athens', lat: 37.98, lng: 23.73, reference: 'Acts 17:22', explanation: 'Paul addressed the Areopagus in Athens.', difficulty: 'intermediate', choices: ['Corinth', 'Athens', 'Rome', 'Damascus'], answer: 1 },
  { id: 'geo-17', place: 'Corinth', lat: 37.91, lng: 22.88, reference: 'Acts 18:1', explanation: 'Paul ministered in Corinth.', difficulty: 'intermediate', choices: ['Ephesus', 'Philippi', 'Corinth', 'Patmos'], answer: 2 },
  { id: 'geo-18', place: 'Ur of the Chaldeans', lat: 30.96, lng: 46.1, reference: 'Genesis 11:31', explanation: 'Abram’s family left Ur; scholars debate the exact site.', difficulty: 'advanced', debated: true, choices: ['Ur of the Chaldeans', 'Haran', 'Hebron', 'Jericho'], answer: 0 },
  { id: 'geo-19', place: 'Haran', lat: 36.87, lng: 39.03, reference: 'Genesis 11:31', explanation: 'Terah’s family settled in Haran.', difficulty: 'advanced', choices: ['Ur', 'Haran', 'Bethel', 'Nineveh'], answer: 1 },
  { id: 'geo-20', place: 'Mount Sinai', lat: 28.54, lng: 33.97, reference: 'Exodus 19', explanation: 'Israel received the law at Sinai; the traditional site is debated.', difficulty: 'advanced', debated: true, choices: ['Mount Carmel', 'Mount Sinai', 'Mount of Olives', 'Zion'], answer: 1 },
  { id: 'geo-21', place: 'Mount Ararat region', lat: 39.7, lng: 44.3, reference: 'Genesis 8:4', explanation: 'The ark rested on the mountains of Ararat; exact peak is debated.', difficulty: 'advanced', debated: true, choices: ['Carmel', 'Sinai', 'Ararat region', 'Olivet'], answer: 2 },
  { id: 'geo-22', place: 'Ephesus', lat: 37.94, lng: 27.34, reference: 'Acts 19', explanation: 'Paul’s long ministry faced Artemis worship in Ephesus.', difficulty: 'advanced', choices: ['Philippi', 'Ephesus', 'Tarsus', 'Beersheba'], answer: 1 },
  { id: 'geo-23', place: 'Philippi', lat: 41.01, lng: 24.29, reference: 'Acts 16:12', explanation: 'Philippi was a leading city of Macedonia.', difficulty: 'advanced', choices: ['Philippi', 'Corinth', 'Babylon', 'Jericho'], answer: 0 },
  { id: 'geo-24', place: 'Tarsus', lat: 36.92, lng: 34.89, reference: 'Acts 21:39', explanation: 'Paul identified himself as a citizen of Tarsus.', difficulty: 'advanced', choices: ['Damascus', 'Tarsus', 'Rome', 'Bethlehem'], answer: 1 },
  { id: 'geo-25', place: 'Patmos', lat: 37.32, lng: 26.55, reference: 'Revelation 1:9', explanation: 'John received the Revelation on Patmos.', difficulty: 'advanced', choices: ['Patmos', 'Capernaum', 'Hebron', 'Ur'], answer: 0 },
]

export function geographyForDifficulty(difficulty: GameDifficulty, count = 5): GeographyItem[] {
  const pool = GEOGRAPHY_BANK.filter((q) => q.difficulty === difficulty)
  const copy = [...pool]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, Math.min(count, copy.length))
}
