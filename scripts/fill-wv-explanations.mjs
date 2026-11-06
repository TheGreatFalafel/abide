/**
 * For worldview topic MCs missing explanations, set a short explanation
 * from the correct choice text (Update Pack Part 12 enrichment baseline).
 */
import fs from 'fs'
import path from 'path'

const files = [
  'atheism-naturalism.ts',
  'mormonism.ts',
  'roman-catholicism.ts',
  'eastern-orthodoxy.ts',
  'understanding-islam.ts',
  'jehovahs-witnesses.ts',
  'eastern-religions-new-age.ts',
  'judaism.ts',
  'other-groups.ts',
]

const dir = 'src/data/curriculum/topics'

for (const file of files) {
  const p = path.join(dir, file)
  let s = fs.readFileSync(p, 'utf8')
  // mc(id, prompt, choices, answer, undefined, difficulty) → use correct choice
  s = s.replace(
    /mc\(\s*'([^']+)'\s*,\s*((?:`[^`]*`|'[^']*'|"[^"]*"))\s*,\s*(\[[\s\S]*?\])\s*,\s*(\d+)\s*,\s*undefined\s*,\s*'(\w+)'\s*\)/g,
    (full, id, prompt, choicesSrc, answerStr, difficulty) => {
      let choices
      try {
        choices = Function(`return (${choicesSrc})`)()
      } catch {
        return full
      }
      const answer = Number(answerStr)
      const text = choices[answer]
      if (typeof text !== 'string') return full
      const expl = text.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
      return `mc('${id}', ${prompt}, ${choicesSrc}, ${answer}, '${expl}', '${difficulty}')`
    },
  )
  fs.writeFileSync(p, s)
  console.log('patched', file)
}
