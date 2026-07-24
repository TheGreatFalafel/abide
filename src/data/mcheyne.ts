import { daysFromData2, parsePassageLabel } from './planParse'
import mcheyneRaw from './plans/mcheyne.json'

export { parsePassageLabel }

export function mcheynePlanDays() {
  return daysFromData2((mcheyneRaw as { data2: string[][] }).data2)
}
