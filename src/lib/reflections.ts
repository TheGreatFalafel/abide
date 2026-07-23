export const REFLECTIONS = [
  {
    prompt: 'What word or phrase stood out to you?',
    options: [
      'A promise from God',
      'A challenge to obey',
      'Comfort in hard times',
      'Something I want to remember',
    ],
  },
  {
    prompt: 'How might this shape your day?',
    options: [
      'Speak kindly to someone',
      'Pray about what I read',
      'Trust God with a worry',
      'Give thanks for a gift',
    ],
  },
  {
    prompt: 'Who is God revealing Himself to be here?',
    options: [
      'Faithful & near',
      'Holy & just',
      'Merciful & patient',
      'Wise & sovereign',
    ],
  },
  {
    prompt: 'What will you carry from this passage?',
    options: [
      'A verse to memorize',
      'A prayer to pray',
      'A truth to believe',
      'An action to take',
    ],
  },
]

export function reflectionForDay(day: number) {
  return REFLECTIONS[(day - 1) % REFLECTIONS.length]
}
