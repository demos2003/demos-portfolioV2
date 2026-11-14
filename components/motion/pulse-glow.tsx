"use client"

import { motion, useReducedMotion } from "framer-motion"

export function PulseGlow({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      animate={
        reduceMotion
          ? undefined
          : {
              boxShadow: [
                "0 0 0 0 rgba(255,122,69,0.45)",
                "0 0 0 12px rgba(255,122,69,0)",
              ],
            }
      }
      transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
