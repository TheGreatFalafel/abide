/** Pick the most natural English voice available on this device. */
export function pickBestVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices.length) return null
  const english = voices.filter((v) => /^en(-|_|$)/i.test(v.lang))
  const pool = english.length ? english : voices

  const rank = (v: SpeechSynthesisVoice): number => {
    const n = `${v.name} ${v.voiceURI}`.toLowerCase()
    let score = 0
    if (/natural|neural|online|premium|enhanced|wavenet|studio/.test(n)) score += 50
    if (/google/.test(n)) score += 40
    if (/microsoft.*(aria|jenny|guy|ryan|sonia|sara)/.test(n)) score += 38
    if (/microsoft/.test(n)) score += 20
    if (/samantha|karen|moira|daniel|alex|fred|victoria|serena/.test(n)) score += 25
    if (/en-us/.test(v.lang.toLowerCase())) score += 8
    if (/en-gb/.test(v.lang.toLowerCase())) score += 6
    if (v.localService === false) score += 10 // cloud voices often sound better
    if (/compact|robot|whisper|zarvox|trinoids|bad news|good news/.test(n)) score -= 40
    return score
  }

  return [...pool].sort((a, b) => rank(b) - rank(a))[0] ?? null
}

export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return Promise.resolve([])
  }
  const synth = window.speechSynthesis
  const existing = synth.getVoices()
  if (existing.length) return Promise.resolve(existing)

  return new Promise((resolve) => {
    const done = () => {
      synth.removeEventListener('voiceschanged', done)
      resolve(synth.getVoices())
    }
    synth.addEventListener('voiceschanged', done)
    // Fallback if event never fires
    window.setTimeout(() => {
      synth.removeEventListener('voiceschanged', done)
      resolve(synth.getVoices())
    }, 800)
  })
}

/** Split text into speakable chunks with natural pauses. */
export function chunkForSpeech(text: string): string[] {
  const cleaned = text
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .trim()
  if (!cleaned) return []

  const parts = cleaned.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [cleaned]
  const chunks: string[] = []
  let buf = ''
  for (const part of parts) {
    const next = `${buf} ${part}`.trim()
    if (next.length > 220 && buf) {
      chunks.push(buf)
      buf = part.trim()
    } else {
      buf = next
    }
  }
  if (buf) chunks.push(buf)
  return chunks
}

export type SpeakHandle = {
  stop: () => void
}

export async function speakPassage(
  text: string,
  opts?: { onEnd?: () => void; onError?: (msg: string) => void },
): Promise<SpeakHandle> {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    opts?.onError?.('Speech is not supported in this browser.')
    return { stop: () => {} }
  }

  const synth = window.speechSynthesis
  synth.cancel()

  const voices = await loadVoices()
  const voice = pickBestVoice(voices)
  const chunks = chunkForSpeech(text)
  if (!chunks.length) {
    opts?.onEnd?.()
    return { stop: () => {} }
  }

  let stopped = false
  let i = 0

  const speakNext = () => {
    if (stopped || i >= chunks.length) {
      if (!stopped) opts?.onEnd?.()
      return
    }
    const u = new SpeechSynthesisUtterance(chunks[i])
    i += 1
    if (voice) u.voice = voice
    u.lang = voice?.lang || 'en-US'
    // Slightly slower + neutral pitch reads more naturally for Scripture
    u.rate = 0.92
    u.pitch = 1
    u.volume = 1
    u.onend = () => speakNext()
    u.onerror = () => {
      if (!stopped) opts?.onError?.('Could not finish reading aloud.')
    }
    synth.speak(u)
  }

  speakNext()

  return {
    stop: () => {
      stopped = true
      synth.cancel()
    },
  }
}

export function stopSpeech() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}
