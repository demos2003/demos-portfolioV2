"use client"

import { motion, useReducedMotion } from "framer-motion"
import { EASE_PREMIUM, REVEAL_DISTANCE } from "@/lib/motion"

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? undefined : { opacity: 0, y: REVEAL_DISTANCE }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: delay / 1000, ease: EASE_PREMIUM }}
    >
      {children}
    </motion.div>
  )
}
