import { Reveal } from "@/components/motion/reveal"
import { SectionGlow } from "@/components/motion/active-section"
import { ProjectsList } from "@/components/projects-list"
import type { Project } from "@/lib/data/projects"

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="relative isolate py-28 sm:py-36">
      <SectionGlow id="projects" />
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <Reveal>
          <span className="text-sm text-signal tracking-wide">Selected Work</span>
        </Reveal>

        <ProjectsList projects={projects} limit={3} />
      </div>
    </section>
  )
}
