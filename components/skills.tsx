import { Reveal } from "@/components/motion/reveal"
import { SectionGlow } from "@/components/motion/active-section"
import type { SkillCategory } from "@/lib/data/skills"

export function Skills({ categories: skillCategories }: { categories: SkillCategory[] }) {
  return (
    <section id="skills" className="relative py-28 sm:py-36 border-t border-paper/10">
      <SectionGlow id="skills" />
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <Reveal>
          <span className="text-sm text-clay tracking-wide">Skills</span>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mt-10">
          {skillCategories.map((category, index) => (
            <Reveal key={category.id} delay={index * 100}>
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
      </div>
    </section>
  )
}
