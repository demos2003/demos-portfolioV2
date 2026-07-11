import type { AboutStat } from "@/lib/data/about"
import { Reveal } from "@/components/motion/reveal"
import { TextReveal } from "@/components/motion/text-reveal"
import { SectionGlow } from "@/components/motion/active-section"

export function About({ stats, bio }: { stats: AboutStat[]; bio: string[] }) {
  const [firstParagraph, ...restParagraphs] = bio

  return (
    <section id="about" className="relative py-28 sm:py-36">
      <SectionGlow id="about" />
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 space-y-8">
            <Reveal>
              <span className="text-sm text-clay tracking-wide">About</span>
            </Reveal>

            {firstParagraph && (
              <TextReveal
                text={firstParagraph}
                className="font-serif text-3xl sm:text-4xl leading-snug text-paper"
              />
            )}

            {restParagraphs.map((paragraph, index) => (
              <Reveal key={index} delay={index * 100}>
                <p className="text-paper/60 text-lg leading-relaxed max-w-xl">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center divide-y divide-paper/10 border-y border-paper/10 lg:border-y-0">
            {stats.map((stat, index) => (
              <Reveal key={stat.id} delay={index * 80}>
                <div className="flex items-baseline justify-between py-6">
                  <span className="font-serif text-4xl text-paper">{stat.value}</span>
                  <span className="text-paper/50 text-sm text-right">{stat.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
