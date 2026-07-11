"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export const SECTIONS = [
  "home",
  "about",
  "services",
  "process",
  "skills",
  "projects",
  "blog",
  "contact",
]

const ActiveSectionContext = createContext<string>(SECTIONS[0])

export function ActiveSectionProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(SECTIONS[0])
  const ticking = useRef(false)

  useEffect(() => {
    const els = SECTIONS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => !!el
    )

    function update() {
      let current = SECTIONS[0]
      els.forEach((el, i) => {
        if (el.getBoundingClientRect().top <= window.innerHeight * 0.5) {
          current = SECTIONS[i]
        }
      })
      setActive(current)
      ticking.current = false
    }

    function onScrollOrResize() {
      if (!ticking.current) {
        ticking.current = true
        requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener("scroll", onScrollOrResize, { passive: true })
    window.addEventListener("resize", onScrollOrResize)
    return () => {
      window.removeEventListener("scroll", onScrollOrResize)
      window.removeEventListener("resize", onScrollOrResize)
    }
  }, [])

  return (
    <ActiveSectionContext.Provider value={active}>{children}</ActiveSectionContext.Provider>
  )
}

export function useActiveSection() {
  return useContext(ActiveSectionContext)
}

// A soft ambient glow that fades in behind a section while it's active,
// giving the roadmap rail's "connection" a visible effect on the content itself.
export function SectionGlow({ id }: { id: string }) {
  const active = useActiveSection()
  const isActive = active === id

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.8 }}
      style={{
        background:
          "radial-gradient(60% 50% at 20% 50%, rgba(181,113,75,0.10), transparent 70%)",
      }}
    />
  )
}
