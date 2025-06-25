import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Skills } from "@/components/skills"
import { Projects } from "@/components/projects"
import { Blog } from "@/components/blog"
import { Contact } from "@/components/contact"
import { GeometricBackground } from "@/components/geometric-background"

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <GeometricBackground />
      <Navigation />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Blog />
        <Contact />
      </main>
    </div>
  )
}
