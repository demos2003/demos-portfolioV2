import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ProjectCaseStudy } from "@/components/project-case-study"
import { getProjectBySlug, getProjects } from "@/lib/data/projects"

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.filter((project) => project.slug).map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    return { title: "Project not found — Demos" }
  }

  return {
    title: `${project.title} — Demos`,
    description: project.description,
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-ink text-paper">
      <Navigation />
      <main>
        <ProjectCaseStudy project={project} />
      </main>
      <Footer />
    </div>
  )
}
