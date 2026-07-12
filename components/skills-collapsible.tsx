"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { EASE_PREMIUM } from "@/lib/motion"
import type { SkillCategory } from "@/lib/data/skills"

export function SkillsCollapsible({ categories }: { categories: SkillCategory[] }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div>
      <Reveal>
        <div className="flex items-center gap-8">
          <span className="text-sm text-clay tracking-wide">Skills</span>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-paper/20 text-sm text-paper/60 hover:text-paper hover:border-paper/40 transition-colors"
          >
            For the nerds — view tech stack
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </Reveal>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE_PREMIUM }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pt-10">
              {categories.map((category, index) => (
                <Reveal key={category.id} delay={index * 80}>
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-paper/40 mb-4">
                      {category.title}
                    </h3>
                    <ul className="space-y-2">
                      {category.skills.map((skill) => (
                        <li key={skill.id} className="text-paper/70 text-lg font-serif">
                          {skill.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
