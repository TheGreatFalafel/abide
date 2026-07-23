export type TranslationId = 'esv' | 'web' | 'kjv'

export type Translation = {
  id: TranslationId
  name: string
  short: string
  needsKey: boolean
  note: string
}

export const TRANSLATIONS: Translation[] = [
  {
    id: 'esv',
    name: 'English Standard Version',
    short: 'ESV',
    needsKey: true,
    note: 'Free personal use via Crossway’s API — paste your key in Settings.',
  },
  {
    id: 'web',
    name: 'World English Bible',
    short: 'WEB',
    needsKey: false,
    note: 'Public domain — works offline-free with no key.',
  },
  {
    id: 'kjv',
    name: 'King James Version',
    short: 'KJV',
    needsKey: false,
    note: 'Public domain — works with no key.',
  },
]

export function getTranslation(id: TranslationId): Translation {
  return TRANSLATIONS.find((t) => t.id === id) ?? TRANSLATIONS[1]
}
