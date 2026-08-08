"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, ArrowRight } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { EASE_PREMIUM } from "@/lib/motion"
import type { Project } from "@/lib/data/projects"

export function ProjectsList({ projects, limit }: { projects: Project[]; limit?: number }) {
  const imageRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const ticking = useRef(false)
  const reduceMotion = useReducedMotion()

  const hasMore = limit !== undefined && projects.length > limit
  const visibleProjects = limit !== undefined && !expanded ? projects.slice(0, limit) : projects

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
  }, [visibleProjects.length])

  return (
    <div>
      <div className="mt-14 space-y-24 sm:space-y-32">
        {visibleProjects.map((project, index) => (
          <Reveal key={project.id}>
            <div
              className={`flex flex-col lg:flex-row gap-10 lg:gap-16 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="lg:w-1/2 w-full">
                <Link
                  href={`/projects/${project.slug}`}
                  ref={(el) => {
                    imageRefs.current[index] = el
                  }}
                  className="relative aspect-video overflow-hidden border border-paper/10 block"
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
                </Link>
              </div>

              <div className="lg:w-1/2 w-full space-y-5">
                <span className="font-serif text-lg text-paper/30">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Link href={`/projects/${project.slug}`}>
                  <h3 className="font-serif text-3xl sm:text-4xl text-paper hover:text-clay transition-colors">
                    {project.title}
                  </h3>
                </Link>
                <p className="text-paper/60 leading-relaxed max-w-lg">{project.description}</p>
                <p className="text-xs uppercase tracking-widest text-paper/40">
                  {project.technologies.join(" / ")}
                </p>
                <div className="flex items-center gap-6">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-1 text-paper hover:text-clay transition-colors group"
                  >
                    Case Study
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
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
            </div>
          </Reveal>
        ))}
      </div>

      {limit !== undefined && (
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6">
          {hasMore && !expanded && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="inline-flex items-center gap-1 text-paper border border-paper/20 px-6 py-3 hover:bg-paper hover:text-ink transition-colors"
            >
              Show more
            </button>
          )}
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-paper hover:text-clay transition-colors group"
          >
            View all projects
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  )
}
