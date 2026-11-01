/**
 * Structured theological source attribution for game explanations.
 * External entries must use researched, real resources — never invented URLs.
 */

export type SourceOrg =
  | 'scripture'
  | 'gotquestions'
  | 'biblethinker'
  | 'macarthur'
  | 'sproul'

export type TheologicalSource = {
  org: SourceOrg
  /** Display name for organization or author */
  author: string
  /** Article, sermon, teaching, or Scripture reference label */
  title: string
  /** HTTPS URL for external resources; omit for Scripture-only basis */
  url?: string
  /** Topic or theological issue */
  topic: string
}

/** Hosts we allow for external source links (validated in tests). */
export const ALLOWED_SOURCE_HOST_PREFIXES = [
  'https://www.gotquestions.org/',
  'https://biblethinker.org/',
  'https://www.gty.org/',
  'https://learn.ligonier.org/',
  'https://www.ligonier.org/',
] as const

export const SOURCE_ORG_LABELS: Record<SourceOrg, string> = {
  scripture: 'Scripture',
  gotquestions: 'GotQuestions.org',
  biblethinker: 'BibleThinker (Mike Winger)',
  macarthur: 'John MacArthur / Grace to You',
  sproul: 'R.C. Sproul / Ligonier',
}

/** Researched catalog — only entries verified against live public pages. */
export const SOURCE_CATALOG = {
  scripture_basis: (title: string, topic: string): TheologicalSource => ({
    org: 'scripture',
    author: 'Holy Scripture',
    title,
    topic,
  }),

  gq_gospel: {
    org: 'gotquestions',
    author: 'GotQuestions.org',
    title: 'What is the gospel?',
    url: 'https://www.gotquestions.org/what-is-the-gospel.html',
    topic: 'Gospel',
  },
  gq_salvation: {
    org: 'gotquestions',
    author: 'GotQuestions.org',
    title: 'What is salvation?',
    url: 'https://www.gotquestions.org/Christian-doctrine-salvation.html',
    topic: 'Salvation',
  },
  gq_grace_faith: {
    org: 'gotquestions',
    author: 'GotQuestions.org',
    title: 'What does it mean that salvation is by grace through faith?',
    url: 'https://www.gotquestions.org/by-grace-through-faith.html',
    topic: 'Grace and faith',
  },
  gq_ephesians_2: {
    org: 'gotquestions',
    author: 'GotQuestions.org',
    title: 'What is the meaning of Ephesians 2:8–9?',
    url: 'https://www.gotquestions.org/Ephesians-2-8-9.html',
    topic: 'Grace and faith',
  },
  gq_sola_scriptura: {
    org: 'gotquestions',
    author: 'GotQuestions.org',
    title: 'What is sola scriptura?',
    url: 'https://www.gotquestions.org/sola-scriptura.html',
    topic: 'Doctrine of Scripture',
  },
  gq_hypostatic: {
    org: 'gotquestions',
    author: 'GotQuestions.org',
    title: 'What is the hypostatic union?',
    url: 'https://www.gotquestions.org/hypostatic-union.html',
    topic: 'Christology',
  },
  gq_propitiation: {
    org: 'gotquestions',
    author: 'GotQuestions.org',
    title: 'What does it mean that Jesus is the propitiation for our sins?',
    url: 'https://www.gotquestions.org/Jesus-is-the-propitiation-for-our-sins.html',
    topic: 'Atonement',
  },
  gq_original_sin: {
    org: 'gotquestions',
    author: 'GotQuestions.org',
    title: 'What is original sin?',
    url: 'https://www.gotquestions.org/original-sin.html',
    topic: 'Anthropology / sin',
  },
  gq_election: {
    org: 'gotquestions',
    author: 'GotQuestions.org',
    title: 'Unconditional election — is it biblical?',
    url: 'https://www.gotquestions.org/unconditional-election.html',
    topic: 'Election',
  },
  gq_millennium: {
    org: 'gotquestions',
    author: 'GotQuestions.org',
    title: 'What is millennialism?',
    url: 'https://www.gotquestions.org/millennialism.html',
    topic: 'Eschatology',
  },
  gq_trinity: {
    org: 'gotquestions',
    author: 'GotQuestions.org',
    title: 'What does the Bible teach about the Trinity?',
    url: 'https://www.gotquestions.org/Trinity-Bible.html',
    topic: 'Trinity',
  },
  gq_jerusalem_council: {
    org: 'gotquestions',
    author: 'GotQuestions.org',
    title: 'What was the meaning and importance of the Jerusalem Council (Acts 15)?',
    url: 'https://www.gotquestions.org/Jerusalem-Council.html',
    topic: 'Gospel and the law',
  },

  bt_sola_scriptura: {
    org: 'biblethinker',
    author: 'Mike Winger / BibleThinker',
    title: 'Sola Scriptura: why I believe it and how it works',
    url: 'https://biblethinker.org/sola-scriptura-why-i-believe-it-and-how-it-works/',
    topic: 'Doctrine of Scripture',
  },
  bt_election: {
    org: 'biblethinker',
    author: 'Mike Winger / BibleThinker',
    title: 'Calvinism, Arminianism, Election & Predestination (Romans 8:29–30, 33)',
    url: 'https://biblethinker.org/calvinism-arminianism-election-predestination-romans-829-30-33/',
    topic: 'Election',
  },
  bt_trinity: {
    org: 'biblethinker',
    author: 'Mike Winger / BibleThinker',
    title: 'The Trinity: Can We Defend it Biblically?',
    url: 'https://biblethinker.org/the-trinity-can-we-defend-it-biblically/',
    topic: 'Trinity',
  },

  gty_propitiation: {
    org: 'macarthur',
    author: 'John MacArthur / Grace to You',
    title: 'God’s Gift of Righteousness (Romans 3; propitiation)',
    url: 'https://www.gty.org/sermons/80-344/gods-gift-of-righteousness',
    topic: 'Atonement / justification',
  },
  gty_original_sin: {
    org: 'macarthur',
    author: 'John MacArthur / Grace to You',
    title: 'Who Decides What Sin Is? (original sin)',
    url: 'https://www.gty.org/blogs/B150603/who-decides-what-sin-is',
    topic: 'Anthropology / sin',
  },
  gty_scripture: {
    org: 'macarthur',
    author: 'John MacArthur / Grace to You',
    title: 'Answering Contemporary Challenges to Scripture',
    url: 'https://www.gty.org/sermons/GTY168/answering-contemporary-challenges-to-scripture-john-macarthur-with-phil-johnson',
    topic: 'Doctrine of Scripture',
  },

  lig_propitiation: {
    org: 'sproul',
    author: 'R.C. Sproul / Ligonier',
    title: 'What Do Expiation and Propitiation Mean?',
    url: 'https://learn.ligonier.org/articles/two-important-words-good-friday-expiation-and-propitiation',
    topic: 'Atonement',
  },
  lig_original_sin: {
    org: 'sproul',
    author: 'R.C. Sproul / Ligonier',
    title: 'Original Sin (Foundations)',
    url: 'https://learn.ligonier.org/series/foundations/original-sin',
    topic: 'Anthropology / sin',
  },
  lig_election: {
    org: 'sproul',
    author: 'R.C. Sproul / Ligonier',
    title: 'Election & Reprobation (Foundations)',
    url: 'https://learn.ligonier.org/series/foundations/election-and-reprobation',
    topic: 'Election',
  },
  lig_trinity: {
    org: 'sproul',
    author: 'R.C. Sproul / Ligonier',
    title: 'One in Essence, Three in Person',
    url: 'https://learn.ligonier.org/series/mystery-of-the-trinity/one-in-essence-three-in-person',
    topic: 'Trinity',
  },
} as const

export type SourceValidationIssue = {
  path: string
  message: string
}

export function isAllowedSourceUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:') return false
    return ALLOWED_SOURCE_HOST_PREFIXES.some((prefix) => url.startsWith(prefix))
  } catch {
    return false
  }
}

/** Loose but useful check that a reference looks like a Bible citation. */
export function looksLikeScriptureReference(ref: string): boolean {
  const t = ref.trim()
  if (t.length < 3) return false
  // Accept ranges like "Genesis 1–3", "e.g. Romans 1:1", "John 1:1, 14"
  return /[A-Za-z]/.test(t) && /\d/.test(t)
}

export function validateTheologicalSource(
  source: TheologicalSource,
  path = 'source',
): SourceValidationIssue[] {
  const issues: SourceValidationIssue[] = []
  const orgs: SourceOrg[] = ['scripture', 'gotquestions', 'biblethinker', 'macarthur', 'sproul']
  if (!orgs.includes(source.org)) {
    issues.push({ path, message: `Unknown org: ${String(source.org)}` })
  }
  if (!source.author?.trim()) issues.push({ path, message: 'Missing author' })
  if (!source.title?.trim()) issues.push({ path, message: 'Missing title' })
  if (!source.topic?.trim()) issues.push({ path, message: 'Missing topic' })

  if (source.org === 'scripture') {
    if (source.url) {
      issues.push({ path, message: 'Scripture-basis entries must not invent external URLs' })
    }
  } else {
    if (!source.url?.trim()) {
      issues.push({ path, message: 'External sources require a URL' })
    } else if (!isAllowedSourceUrl(source.url)) {
      issues.push({ path, message: `URL not on allowlist or invalid: ${source.url}` })
    }
  }
  return issues
}

export function validateSourceList(
  sources: TheologicalSource[] | undefined,
  path: string,
): SourceValidationIssue[] {
  if (!sources) return []
  if (!Array.isArray(sources)) {
    return [{ path, message: 'sources must be an array' }]
  }
  return sources.flatMap((s, i) => validateTheologicalSource(s, `${path}[${i}]`))
}

/** Flatten catalog object values that are TheologicalSource records (skip helpers). */
export function catalogExternalSources(): TheologicalSource[] {
  const out: TheologicalSource[] = []
  for (const value of Object.values(SOURCE_CATALOG)) {
    if (typeof value === 'function') continue
    out.push({
      org: value.org,
      author: value.author,
      title: value.title,
      url: 'url' in value ? value.url : undefined,
      topic: value.topic,
    })
  }
  return out
}
