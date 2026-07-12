import { Button } from "@/components/ui/button"
import { Github, Linkedin, Twitter, Download, ArrowRight } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { MagneticButton } from "@/components/motion/magnetic-button"
import { SectionGlow } from "@/components/motion/active-section"
import { TerminalCard } from "@/components/motion/terminal-card"

const SOCIALS = [
  { icon: Github, href: "https://github.com/demos2003", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/iyidemilade-nasiru-halim-9b9a15269/", label: "LinkedIn" },
  { icon: Twitter, href: "https://x.com/NasiruDev", label: "Twitter" },
]

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 overflow-hidden">
      <SectionGlow id="home" />
      <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-10">
            <Reveal>
              <div className="flex items-center gap-2 text-sm text-paper/50">
                <span className="w-1.5 h-1.5 rounded-full bg-clay" />
                Available for new projects
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-paper">
                Software
                <br />
                <span className="text-clay">Engineer</span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="text-paper/60 text-lg max-w-lg leading-relaxed">
                I&apos;m Nasiru Iyidemilade. I craft full-stack applications with modern
                technologies, focusing on performance, user experience, and scalable
                architecture.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="flex flex-col sm:flex-row gap-4">
                <MagneticButton>
                  <a href="#projects">
                    <Button
                      size="lg"
                      className="bg-paper text-ink hover:bg-paper/90 rounded-none px-8 group"
                    >
                      View My Work
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                </MagneticButton>
                <a href="/Nasiru_Iyidemilade_Resume.pdf" download>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-paper/20 text-paper bg-transparent hover:bg-paper/10 rounded-none px-8"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download CV
                  </Button>
                </a>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div className="flex gap-6">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-paper/40 hover:text-paper transition-colors"
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={200} className="lg:col-span-5 flex justify-center lg:justify-end">
            <TerminalCard />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
