import { ESV_COPYRIGHT, ESV_SITE } from '../data/esvCopyright'

type Props = {
  compact?: boolean
}

export function EsvAttribution({ compact = false }: Props) {
  if (compact) {
    return (
      <p className="esv-attr compact">
        Scripture quotations marked “ESV” are from the{' '}
        <a href={ESV_SITE} target="_blank" rel="noreferrer">
          ESV® Bible
        </a>{' '}
        (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of
        Good News Publishers. Used by permission. All rights reserved.
      </p>
    )
  }

  return (
    <aside className="esv-attr" aria-label="ESV copyright notice">
      <p>{ESV_COPYRIGHT}</p>
      <p>
        Learn more at{' '}
        <a href={ESV_SITE} target="_blank" rel="noreferrer">
          www.esv.org
        </a>
        .
      </p>
    </aside>
  )
}
