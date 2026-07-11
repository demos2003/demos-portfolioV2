import { Reveal } from "@/components/motion/reveal"
import { SectionGlow } from "@/components/motion/active-section"
import { ProjectsList } from "@/components/projects-list"
import type { Project } from "@/lib/data/projects"

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="relative py-28 sm:py-36 border-t border-paper/10">
      <SectionGlow id="projects" />
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <Reveal>
          <span className="text-sm text-clay tracking-wide">Projects</span>
        </Reveal>

        <ProjectsList projects={projects} />
      </div>
    </section>
  )
}
