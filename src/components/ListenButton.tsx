'use client'

import { useEffect, useRef, useState } from 'react'
import { speakPassage, stopSpeech } from '../lib/speech'

type Props = {
  /** Plain scripture text to read aloud */
  text: string
  label?: string
  disabled?: boolean
}

export function ListenButton({ text, label = 'Listen', disabled }: Props) {
  const [speaking, setSpeaking] = useState(false)
  const [voiceNote, setVoiceNote] = useState<string | null>(null)
  const handleRef = useRef<{ stop: () => void } | null>(null)

  useEffect(() => {
    return () => {
      handleRef.current?.stop()
      stopSpeech()
    }
  }, [])

  // Stop if the passage text changes mid-read
  useEffect(() => {
    handleRef.current?.stop()
    stopSpeech()
    setSpeaking(false)
  }, [text])

  async function toggle() {
    if (speaking) {
      handleRef.current?.stop()
      stopSpeech()
      handleRef.current = null
      setSpeaking(false)
      return
    }
    if (!text.trim()) return
    setVoiceNote(null)
    setSpeaking(true)
    const handle = await speakPassage(text, {
      onEnd: () => {
        setSpeaking(false)
        handleRef.current = null
      },
      onError: (msg) => {
        setVoiceNote(msg)
        setSpeaking(false)
        handleRef.current = null
      },
    })
    handleRef.current = handle
  }

  return (
    <div className="listen-wrap">
      <button
        type="button"
        className={`btn ${speaking ? 'ghost-outline' : 'ghost-outline'} listen-btn`}
        onClick={toggle}
        disabled={disabled || !text.trim()}
        aria-pressed={speaking}
      >
        {speaking ? 'Stop' : label}
      </button>
      {voiceNote && <p className="nudge risk">{voiceNote}</p>}
    </div>
  )
}
