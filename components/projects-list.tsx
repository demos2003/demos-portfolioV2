"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { EASE_PREMIUM } from "@/lib/motion"
import type { Project } from "@/lib/data/projects"

export function ProjectsList({ projects }: { projects: Project[] }) {
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const ticking = useRef(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    function updateActive() {
      const viewportCenter = window.innerHeight / 2
      let closestIndex = 0
      let closestDistance = Infinity

      imageRefs.current.forEach((el, index) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        const center = rect.top + rect.height / 2
        const distance = Math.abs(center - viewportCenter)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      setActiveIndex(closestIndex)
      ticking.current = false
    }

    function onScrollOrResize() {
      if (!ticking.current) {
        ticking.current = true
        requestAnimationFrame(updateActive)
      }
    }

    updateActive()
    window.addEventListener("scroll", onScrollOrResize, { passive: true })
    window.addEventListener("resize", onScrollOrResize)
    return () => {
      window.removeEventListener("scroll", onScrollOrResize)
      window.removeEventListener("resize", onScrollOrResize)
    }
  }, [])

  return (
    <div className="mt-14 space-y-24 sm:space-y-32">
      {projects.map((project, index) => (
        <Reveal key={project.id}>
          <div
            className={`flex flex-col lg:flex-row gap-10 lg:gap-16 items-center ${
              index % 2 === 1 ? "lg:flex-row-reverse" : ""
            }`}
          >
            <div className="lg:w-1/2 w-full">
              <div
                ref={(el) => {
                  imageRefs.current[index] = el
                }}
                className="relative aspect-video overflow-hidden border border-paper/10"
              >
                <motion.div
                  className="w-full h-full"
                  animate={
                    reduceMotion
                      ? undefined
                      : index === activeIndex
                        ? { filter: "grayscale(0) brightness(1)", opacity: 1 }
                        : { filter: "grayscale(1) brightness(0.55)", opacity: 0.75 }
                  }
                  transition={{ duration: 0.9, ease: EASE_PREMIUM }}
                >
                  <Image
                    src={project.imageUrl || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </div>
            </div>

            <div className="lg:w-1/2 w-full space-y-5">
              <span className="font-serif text-lg text-paper/30">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-paper">{project.title}</h3>
              <p className="text-paper/60 leading-relaxed max-w-lg">{project.description}</p>
              <p className="text-xs uppercase tracking-widest text-paper/40">
                {project.technologies.join(" / ")}
              </p>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-paper hover:text-clay transition-colors group"
                >
                  View Live
                  <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              )}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  )
}
