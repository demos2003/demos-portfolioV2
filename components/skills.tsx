import { SectionGlow } from "@/components/motion/active-section"
import { SkillsCollapsible } from "@/components/skills-collapsible"
import type { SkillCategory } from "@/lib/data/skills"

export function Skills({ categories: skillCategories }: { categories: SkillCategory[] }) {
  return (
    <section id="skills" className="relative py-28 sm:py-36 border-t border-paper/10">
      <SectionGlow id="skills" />
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <SkillsCollapsible categories={skillCategories} />
      </div>
    </section>
  )
}
