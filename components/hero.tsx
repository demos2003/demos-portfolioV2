import { Button } from "@/components/ui/button"
import { Github, Linkedin, Twitter, Download, ArrowRight } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { MagneticButton } from "@/components/motion/magnetic-button"
import { PulseGlow } from "@/components/motion/pulse-glow"
import { SectionGlow } from "@/components/motion/active-section"
import { TerminalCard } from "@/components/motion/terminal-card"

const SOCIALS = [
  { icon: Github, href: "https://github.com/demos2003", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/iyidemilade-nasiru-halim-9b9a15269/", label: "LinkedIn" },
  { icon: Twitter, href: "https://x.com/NasiruDev", label: "Twitter" },
]

// Film grain: fractal noise tinted to `paper`, thresholded so only the brighter
// specks survive. Tiled as a data URI so it costs no request and no JS.
const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'>
    <filter id='n'>
      <feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/>
      <feColorMatrix values='0 0 0 0 0.96  0 0 0 0 0.94  0 0 0 0 0.92  0 0 0 1.7 -0.75'/>
    </filter>
    <rect width='100%' height='100%' filter='url(#n)'/>
  </svg>`
)}")`

// Static backdrop texture: a drafting grid that fades out from the top-right,
// with grain over the whole section. Both dissolve before the bottom edge so
// the hero blends into the next section without a seam.
function HeroTexture() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(244,240,234,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(244,240,234,0.1) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(90% 80% at 85% 15%, #000 0%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(90% 80% at 85% 15%, #000 0%, transparent 75%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage: GRAIN,
          maskImage: "linear-gradient(to bottom, #000 70%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 70%, transparent)",
        }}
      />
    </div>
  )
}

export function Hero() {
  return (
    <section id="home" className="relative isolate min-h-screen flex items-center pt-24 overflow-hidden">
      <HeroTexture />
      <SectionGlow id="home" />
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-10">
            <Reveal>
              <div className="flex items-center gap-2 text-sm text-paper/50">
                <span className="w-1.5 h-1.5 rounded-full bg-signal" />
                Available for new projects
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-paper">
                Software
                <br />
                <span className="text-signal">Engineer</span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="text-paper/60 text-lg max-w-lg leading-relaxed">
                I&apos;m Nasiru Iyidemilade. I build full-stack applications, AI agents,
                and automated workflows — with a focus on performance, user experience,
                and scalable architecture.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <PulseGlow>
                  <MagneticButton>
                    <a href="#projects">
                      <Button
                        size="lg"
                        className="bg-signal text-ink hover:bg-signal-hover rounded-none px-8 group"
                      >
                        View My Work
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </a>
                  </MagneticButton>
                </PulseGlow>
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
