import fs from 'fs'

function patch(path, map, unverified) {
  let s = fs.readFileSync(path, 'utf8')
  if (s.includes('strongs:')) {
    console.log(path, 'already has strongs, skip')
    return
  }
  s = s.replace(/lemma: '([^']+)',\r?\n(\s+)transliteration:/g, (m, lemma, indent) => {
    const strongs = map[lemma]
    if (!strongs) return m
    const verified = !unverified.has(strongs)
    return `lemma: '${lemma}',\n${indent}strongs: '${strongs}',\n${indent}strongsVerified: ${verified},\n${indent}transliteration:`
  })
  fs.writeFileSync(path, s)
  console.log(path, (s.match(/strongs:/g) || []).length)
}

patch(
  'src/data/languages/greek/vocabulary.ts',
  {
    θεός: 'G2316',
    λόγος: 'G3056',
    καί: 'G2532',
    ἐν: 'G1722',
    εἰμί: 'G1510',
    ἔχω: 'G2192',
    λέγω: 'G3004',
    γινώσκω: 'G1097',
    πιστεύω: 'G4100',
    ἀγαπάω: 'G25',
    ἔρχομαι: 'G2064',
    ἀκούω: 'G191',
    γράφω: 'G1125',
    σῴζω: 'G4982',
    ἁμαρτία: 'G266',
    χάρις: 'G5485',
    ζωή: 'G2222',
    φῶς: 'G5457',
    κόσμος: 'G2889',
    ἄνθρωπος: 'G444',
    ἀρχή: 'G746',
    πρός: 'G4314',
    αὐτός: 'G846',
    Ἰησοῦς: 'G2424',
    Χριστός: 'G5547',
    κύριος: 'G2962',
    πνεῦμα: 'G4151',
    ἀγάπη: 'G26',
    πίστις: 'G4102',
  },
  new Set(['G26', 'G4102']),
)

patch(
  'src/data/languages/hebrew/vocabulary.ts',
  {
    אֱלֹהִים: 'H430',
    יְהוָה: 'H3068',
    אֶרֶץ: 'H776',
    שָׁמַיִם: 'H8064',
    רֵאשִׁית: 'H7225',
    בָּרָא: 'H1254',
    אָמַר: 'H559',
    הָיָה: 'H1961',
    עָשָׂה: 'H6213',
    אוֹר: 'H216',
    יוֹם: 'H3117',
    מֶלֶךְ: 'H4428',
    אִישׁ: 'H376',
    אִשָּׁה: 'H802',
    בֵּן: 'H1121',
    בַּיִת: 'H1004',
    דָּבָר: 'H1697',
    תּוֹרָה: 'H8451',
    חֶסֶד: 'H2617',
    לֵב: 'H3820',
    נֶפֶשׁ: 'H5315',
    רוּחַ: 'H7307',
    שֵׁם: 'H8034',
    עָם: 'H5971',
    טוֹב: 'H2896',
    שָׁמַע: 'H8085',
    רָאָה: 'H7200',
    יָדַע: 'H3045',
    אָהַב: 'H157',
    שָׁמַר: 'H8104',
  },
  new Set(['H802', 'H2617']),
)
