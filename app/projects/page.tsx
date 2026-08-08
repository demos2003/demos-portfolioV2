import type { Metadata } from "next"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Reveal } from "@/components/motion/reveal"
import { ProjectsList } from "@/components/projects-list"
import { getProjects } from "@/lib/data/projects"

export const metadata: Metadata = {
  title: "Work — Demos",
  description: "Case studies and selected projects by Nasiru Iyidemilade.",
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="min-h-screen bg-ink text-paper">
      <Navigation />
      <main>
        <section className="relative pt-40 pb-28 sm:pb-36">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <Reveal>
              <span className="text-sm text-clay tracking-wide">Work</span>
              <h1 className="mt-4 font-serif text-4xl sm:text-6xl text-paper">All Projects</h1>
            </Reveal>

            <ProjectsList projects={projects} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
