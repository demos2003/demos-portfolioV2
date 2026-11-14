import { SectionGlow } from "@/components/motion/active-section"
import { SkillsCollapsible } from "@/components/skills-collapsible"
import type { SkillCategory } from "@/lib/data/skills"

export function Skills({ categories: skillCategories }: { categories: SkillCategory[] }) {
  return (
    <section id="skills" className="relative isolate py-20 sm:py-24 bg-surface">
      <SectionGlow id="skills" />
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <SkillsCollapsible categories={skillCategories} />
      </div>
    </section>
  )
}
