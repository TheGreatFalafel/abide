import { BOOKS } from './books'
import { daysFromData2 } from './planParse'
import mcheyneRaw from './plans/mcheyne.json'
import chronologicalRaw from './plans/oneyearchronological.json'
import throughBibleRaw from './plans/esvthroughthebible.json'
import otNtRaw from './plans/heartlightotandnt.json'
import everyDayRaw from './plans/esveverydayinword.json'
import type { PassageRef } from './books'

type PlanDay = {
  day: number
  passages: PassageRef[]
  title: string
  kind: 'read' | 'quiz'
  sectionLabel?: string
  quizId?: string
  quizIndex?: number
}

type Data2Plan = {
  data2: string[][]
  name?: string
  info?: string
}

export type GatewayPlanMeta = {
  id: string
  name: string
  blurb: string
  days: number
  vibe: string
  generate: () => PlanDay[]
}

function fromData2(
  id: string,
  name: string,
  blurb: string,
  vibe: string,
  raw: Data2Plan,
): GatewayPlanMeta {
  return {
    id,
    name,
    blurb,
    days: raw.data2?.length ?? 0,
    vibe,
    generate: () => daysFromData2(raw.data2) as PlanDay[],
  }
}

/**
 * Popular Bible Gateway reading-plan styles.
 * Schedules are open JSON equivalents (not scraped from Bible Gateway).
 * Quiz checkpoints are not inserted into the day list (would renumber days);
 * the app offers chapter checks from recent passages instead.
 */
export function buildGatewayStylePlans(helpers: {
  chaptersFrom: (bookIds: string[]) => import('./books').PassageRef[]
  chunkPassages: (
    passages: import('./books').PassageRef[],
    days: number,
  ) => PlanDay[]
}): GatewayPlanMeta[] {
  const { chaptersFrom, chunkPassages } = helpers
  return [
    fromData2(
      'bg-ot-nt',
      'Old & New Testament Together',
      'Bible Gateway–style: a passage from the Old and New Testament each day.',
      'Bible Gateway',
      otNtRaw as Data2Plan,
    ),
    fromData2(
      'bg-chronological',
      'Chronological',
      'Bible Gateway–style: read the Bible in the order events unfolded.',
      'Bible Gateway',
      chronologicalRaw as Data2Plan,
    ),
    fromData2(
      'bg-beginning-end',
      'Beginning to End',
      'Bible Gateway–style: Genesis to Revelation, start to finish.',
      'Bible Gateway',
      throughBibleRaw as Data2Plan,
    ),
    fromData2(
      'bg-everyday-word',
      'Every Day in the Word',
      'Bible Gateway–style: OT, NT, Psalm, and Proverbs each day.',
      'Bible Gateway',
      everyDayRaw as Data2Plan,
    ),
    fromData2(
      'mcheyne',
      "M'Cheyne Bible Reading Plan",
      "Bible Gateway–style classic: OT, NT, and Psalms/Gospels streams daily.",
      'Bible Gateway',
      mcheyneRaw as Data2Plan,
    ),
    {
      id: 'bg-bible-90',
      name: 'Bible in 90 Days',
      blurb: 'Bible Gateway–style intensive: the whole Bible in about three months.',
      days: 90,
      vibe: 'Bible Gateway',
      generate: () =>
        chunkPassages(
          chaptersFrom(BOOKS.map((b) => b.id)),
          90,
        ).map((d) => ({ ...d, kind: 'read' as const })),
    },
    {
      id: 'bg-gospels-40',
      name: 'Gospels in 40 Days',
      blurb: 'Bible Gateway–style: Matthew, Mark, Luke, and John in 40 days.',
      days: 40,
      vibe: 'Bible Gateway',
      generate: () =>
        chunkPassages(
          chaptersFrom(['matthew', 'mark', 'luke', 'john']),
          40,
        ).map((d) => ({ ...d, kind: 'read' as const })),
    },
    {
      id: 'bg-nt-year',
      name: 'New Testament in a Year',
      blurb: 'Bible Gateway–style: Matthew through Revelation over 365 days.',
      days: 365,
      vibe: 'Bible Gateway',
      generate: () =>
        chunkPassages(
          chaptersFrom(BOOKS.filter((b) => b.testament === 'NT').map((b) => b.id)),
          365,
        ).map((d) => ({ ...d, kind: 'read' as const })),
    },
  ]
}
