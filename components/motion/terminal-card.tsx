"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useReducedMotion } from "framer-motion"

const LINES = [
  { prompt: "$ ", text: "whoami" },
  { prompt: "> ", text: "nasiru — full-stack engineer" },
  { prompt: "$ ", text: "status --available" },
  { prompt: "> ", text: "true" },
]

export function TerminalCard() {
  const reduceMotion = useReducedMotion()
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [currentText, setCurrentText] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (reduceMotion) {
      setDisplayedLines(LINES.map((l) => l.prompt + l.text))
      setDone(true)
      return
    }

    let lineIndex = 0
    let charIndex = 0
    let cancelled = false
    const timeouts: ReturnType<typeof setTimeout>[] = []

    function typeChar() {
      if (cancelled || lineIndex >= LINES.length) {
        setDone(true)
        return
      }
      const line = LINES[lineIndex]
      const full = line.prompt + line.text
      charIndex++
      setCurrentText(full.slice(0, charIndex))

      if (charIndex >= full.length) {
        setDisplayedLines((prev) => [...prev, full])
        setCurrentText("")
        lineIndex++
        charIndex = 0
        timeouts.push(setTimeout(typeChar, 400))
      } else {
        timeouts.push(setTimeout(typeChar, 35))
      }
    }

    timeouts.push(setTimeout(typeChar, 700))
    return () => {
      cancelled = true
      timeouts.forEach(clearTimeout)
    }
  }, [reduceMotion])

  return (
    <div className="w-72 sm:w-96 bg-ink border border-paper/20 shadow-2xl shadow-black/50">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-paper/10">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-xs text-paper/40 font-mono">profile.png</span>
      </div>

      <div className="relative w-full aspect-[4/3]">
        <Image
          src="/images/ME2.jpeg"
          alt="Profile"
          fill
          className="object-cover grayscale"
          priority
        />
      </div>

      <div className="p-4 font-mono text-[13px] leading-relaxed border-t border-paper/10 min-h-[110px]">
        {displayedLines.map((line, i) => (
          <div key={i} className="text-paper/70">
            <span className="text-clay">{line.slice(0, 2)}</span>
            {line.slice(2)}
          </div>
        ))}
        {!done && currentText && (
          <div className="text-paper/70">
            <span className="text-clay">{currentText.slice(0, 2)}</span>
            {currentText.slice(2)}
            <span className="inline-block w-1.5 h-3.5 bg-clay/70 ml-0.5 animate-pulse" />
          </div>
        )}
        {done && <span className="inline-block w-1.5 h-3.5 bg-clay/70 animate-pulse" />}
      </div>
    </div>
  )
}
