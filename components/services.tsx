import { Code2, Smartphone, Palette, LayoutDashboard, Server, Lightbulb } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { SectionGlow } from "@/components/motion/active-section"

const SERVICES = [
  {
    icon: Code2,
    title: "Web Applications",
    description:
      "Full-stack web apps built for speed, scale, and real users — from marketing sites to complex internal tools.",
  },
  {
    icon: Smartphone,
    title: "Mobile Applications",
    description:
      "Cross-platform mobile apps that feel native — built once, shipped everywhere your users are.",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description:
      "Interfaces designed around real user behavior — clean, intuitive, and built to convert, not just look good.",
  },
  {
    icon: LayoutDashboard,
    title: "Admin Dashboards & CMS",
    description:
      "Give your team control. Custom admin panels and content systems so you're never waiting on a developer to change a page.",
  },
  {
    icon: Server,
    title: "API & Backend Systems",
    description:
      "Reliable APIs and backend architecture that scale with your product, not against it.",
  },
  {
    icon: Lightbulb,
    title: "Technical Consulting & Audits",
    description:
      "A second pair of senior eyes on your codebase, architecture, or team's technical decisions before you commit.",
  },
]

export function Services() {
  return (
    <section id="services" className="relative py-28 sm:py-36 border-t border-paper/10">
      <SectionGlow id="services" />
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <Reveal>
          <span className="text-sm text-clay tracking-wide">Services</span>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="font-serif text-3xl sm:text-4xl text-paper mt-6 max-w-2xl">
            What I can do for you.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-14 mt-16">
          {SERVICES.map((service, index) => (
            <Reveal key={service.title} delay={index * 100}>
              <div className="space-y-4">
                <service.icon className="h-5 w-5 text-clay" strokeWidth={1.5} />
                <h3 className="font-serif text-2xl text-paper">{service.title}</h3>
                <p className="text-paper/60 leading-relaxed max-w-md">{service.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
