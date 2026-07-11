import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Services } from "@/components/services"
import { Process } from "@/components/process"
import { Skills } from "@/components/skills"
import { Projects } from "@/components/projects"
import { Blog } from "@/components/blog"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { ActiveSectionProvider } from "@/components/motion/active-section"
import { getProjects } from "@/lib/data/projects"
import { getBlogPosts } from "@/lib/data/blog"
import { getSkillCategories } from "@/lib/data/skills"
import { getAboutStats, getAboutBio, getContactInfo } from "@/lib/data/about"

export default async function Portfolio() {
  const [projects, posts, skillCategories, aboutStats, aboutBio, contactInfo] = await Promise.all([
    getProjects(),
    getBlogPosts(),
    getSkillCategories(),
    getAboutStats(),
    getAboutBio(),
    getContactInfo(),
  ])

  return (
    <div className="min-h-screen bg-ink text-paper">
      <Navigation />
      <ActiveSectionProvider>
        <main>
          <Hero />
          <About stats={aboutStats} bio={aboutBio} />
          <Services />
          <Process />
          <Skills categories={skillCategories} />
          <Projects projects={projects} />
          <Blog posts={posts} />
          <Contact contactInfo={contactInfo} />
        </main>
      </ActiveSectionProvider>
      <Footer />
    </div>
  )
}
