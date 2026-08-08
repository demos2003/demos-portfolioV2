import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import type { Project } from "@/lib/data/projects"

function CaseStudySection({ label, content }: { label: string; content: string | null }) {
  if (!content) return null

  return (
    <Reveal className="border-t border-paper/10 py-14 sm:py-20">
      <div className="grid lg:grid-cols-[200px_1fr] gap-6 lg:gap-16">
        <span className="text-sm text-clay tracking-wide">{label}</span>
        <p className="text-paper/70 leading-relaxed whitespace-pre-line max-w-2xl">{content}</p>
      </div>
    </Reveal>
  )
}

export function ProjectCaseStudy({ project }: { project: Project }) {
  return (
    <article>
      <section className="pt-40 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <Reveal>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1 text-sm text-paper/60 hover:text-paper transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              All Projects
            </Link>

            <h1 className="mt-8 font-serif text-4xl sm:text-6xl text-paper">{project.title}</h1>
            <p className="mt-6 text-paper/60 leading-relaxed max-w-2xl">{project.description}</p>

            <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-4">
              {project.timeline && (
                <div>
                  <span className="block text-xs uppercase tracking-widest text-paper/40">Timeline</span>
                  <span className="text-paper/80">{project.timeline}</span>
                </div>
              )}
              {project.technologies.length > 0 && (
                <div>
                  <span className="block text-xs uppercase tracking-widest text-paper/40">Technologies</span>
                  <span className="text-paper/80">{project.technologies.join(" / ")}</span>
                </div>
              )}
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
          </Reveal>
        </div>
      </section>

      <Reveal className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="relative aspect-video overflow-hidden border border-paper/10">
          <Image
            src={project.imageUrl || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </Reveal>

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <CaseStudySection label="Problem" content={project.problemStatement} />
        <CaseStudySection label="Process" content={project.process} />
        <CaseStudySection label="Solution" content={project.solution} />
        <CaseStudySection label="Results" content={project.results} />

        {project.galleryImages.length > 0 && (
          <Reveal className="border-t border-paper/10 py-14 sm:py-20">
            <span className="text-sm text-clay tracking-wide">Gallery</span>
            <div className="mt-6 grid sm:grid-cols-2 gap-6">
              {project.galleryImages.map((src) => (
                <div key={src} className="relative aspect-video overflow-hidden border border-paper/10">
                  <Image src={src} alt={project.title} fill className="object-cover" />
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </article>
  )
}
