'use client'

import {
  SOURCE_ORG_LABELS,
  type TheologicalSource,
} from '../../data/games/sources'

type Props = {
  sources?: TheologicalSource[]
}

/**
 * Optional, collapsed source list — keeps quiz UI clean while allowing
 * further reading when connectivity is available.
 */
export function SourceDetails({ sources }: Props) {
  if (!sources?.length) return null

  return (
    <details className="source-details">
      <summary>Explore sources</summary>
      <ul className="source-list">
        {sources.map((s, i) => (
          <li key={`${s.org}-${s.title}-${i}`}>
            <span className="source-org">{SOURCE_ORG_LABELS[s.org]}</span>
            {s.url ? (
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="source-link"
              >
                {s.title}
              </a>
            ) : (
              <span className="source-title">{s.title}</span>
            )}
            <span className="muted tiny source-topic">{s.topic}</span>
          </li>
        ))}
      </ul>
      <p className="muted tiny source-note">
        Links open externally and need a connection. Scripture citations work offline in your Bible.
      </p>
    </details>
  )
}
