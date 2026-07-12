"use client"

import { useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion"
import { SPRING_SNAPPY } from "@/lib/motion"

// How close the cursor needs to be before the button starts reacting -- lets
// it feel "attracted" before the cursor is directly over it. Mouse-only: on
// touch devices, touchmove fires during scrolling and made the button jump
// around while scrolling past it, which felt broken rather than alive.
const ACTIVATION_RADIUS = 260
// The "boundary": max displacement regardless of how close the pointer gets.
const MAX_PULL = 34

export function MagneticButton({
  children,
  strength = 0.6,
}: {
  children: React.ReactNode
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, SPRING_SNAPPY)
  const springY = useSpring(y, SPRING_SNAPPY)

  useEffect(() => {
    if (reduceMotion) return

    function updatePull(clientX: number, clientY: number) {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const dx = clientX - (rect.left + rect.width / 2)
      const dy = clientY - (rect.top + rect.height / 2)
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < ACTIVATION_RADIUS) {
        const proximity = 1 - distance / ACTIVATION_RADIUS
        x.set(Math.max(-MAX_PULL, Math.min(MAX_PULL, dx * strength * proximity)))
        y.set(Math.max(-MAX_PULL, Math.min(MAX_PULL, dy * strength * proximity)))
      } else {
        x.set(0)
        y.set(0)
      }
    }

    function onMouseMove(e: MouseEvent) {
      updatePull(e.clientX, e.clientY)
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true })
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
    }
  }, [reduceMotion, strength, x, y])

  if (reduceMotion) {
    return <>{children}</>
  }

  return (
    <motion.div ref={ref} style={{ x: springX, y: springY }} className="inline-block">
      {children}
    </motion.div>
  )
}
