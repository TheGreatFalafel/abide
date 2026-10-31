import { describe, expect, it } from 'vitest'
import { parseEsvPassage } from './bibleApi'

describe('parseEsvPassage', () => {
  it('keeps every poetry line in Isaiah 53:5', () => {
    const result = parseEsvPassage(
      `Isaiah 53:5

[5] But he was pierced for our transgressions;
he was crushed for our iniquities;
upon him was the chastisement that brought us peace,
and with his wounds we are healed. (ESV)`,
      'Isaiah 53:5',
    )

    expect(result.verses).toEqual([
      {
        number: 5,
        text:
          'But he was pierced for our transgressions; he was crushed for our iniquities; upon him was the chastisement that brought us peace, and with his wounds we are healed.',
        heading: undefined,
      },
    ])
  })

  it('appends wrapped text to the most recent verse', () => {
    const result = parseEsvPassage(
      `Psalm 1:1–2
[1] Blessed is the man [2] but his delight is in the law of the LORD,
and on his law he meditates day and night.

(ESV)`,
      'Psalm 1:1-2',
    )

    expect(result.verses.map((verse) => verse.text)).toEqual([
      'Blessed is the man',
      'but his delight is in the law of the LORD, and on his law he meditates day and night.',
    ])
  })
})
