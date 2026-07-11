"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion"

function Word({
  children,
  range,
  progress,
}: {
  children: string
  range: [number, number]
  progress: MotionValue<number>
}) {
  const opacity = useTransform(progress, range, [0.25, 1])
  const blur = useTransform(progress, range, [8, 0])
  const filter = useTransform(blur, (v) => `blur(${v}px)`)

  return (
    <motion.span style={{ opacity, filter }} className="inline-block mr-[0.25em]">
      {children}
    </motion.span>
  )
}

export function TextReveal({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.35"],
  })
  const words = text.split(" ")

  if (reduceMotion) {
    return <p className={className}>{text}</p>
  }

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Word key={i} range={[i / words.length, (i + 1) / words.length]} progress={scrollYProgress}>
          {word}
        </Word>
      ))}
    </p>
  )
}
