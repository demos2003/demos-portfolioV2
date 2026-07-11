import { Reveal } from "@/components/motion/reveal"
import { SectionGlow } from "@/components/motion/active-section"

const STEPS = [
  {
    title: "Discovery",
    description:
      "I start by listening — understanding the problem, the users, and the constraints before writing a single line of code.",
  },
  {
    title: "Design & Architecture",
    description:
      "Requirements become a clear technical plan and interface design, so there are no surprises once building starts.",
  },
  {
    title: "Build",
    description:
      "Clean, well-tested code shipped in focused increments, with steady visibility into progress along the way.",
  },
  {
    title: "Launch & Support",
    description:
      "A careful rollout followed by real support — monitoring, fixes, and refinements as the product meets real users.",
  },
]

export function Process() {
  return (
    <section id="process" className="relative py-28 sm:py-36 border-t border-paper/10">
      <SectionGlow id="process" />
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <Reveal>
          <span className="text-sm text-clay tracking-wide">Process</span>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="font-serif text-3xl sm:text-4xl text-paper mt-6 max-w-2xl">
            From discussion to execution.
          </h2>
        </Reveal>

        <div className="mt-14 divide-y divide-paper/10 border-t border-paper/10">
          {STEPS.map((step, index) => (
            <Reveal key={step.title} delay={index * 80}>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-12 py-8">
                <div className="sm:w-1/3 flex items-baseline gap-4">
                  <span className="font-serif text-2xl text-paper/30">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-serif text-2xl text-paper">{step.title}</h3>
                </div>
                <p className="sm:w-2/3 text-paper/60 leading-relaxed max-w-xl">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
