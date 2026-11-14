import { Reveal } from "@/components/motion/reveal"
import type { EducationEntry } from "@/lib/data/about"

// Sits directly under About on the same surface, as a continuation of it. It
// is deliberately not registered as its own nav section, so "About" stays
// highlighted in the menu while this is on screen. Entries are managed in the
// admin under About & Contact.
export function Education({ entries }: { entries: EducationEntry[] }) {
  if (entries.length === 0) return null

  return (
    <section id="education" className="relative py-20 sm:py-24 bg-surface border-t border-paper/10">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <Reveal>
          <span className="text-sm text-signal tracking-wide">Education</span>
        </Reveal>

        <div className="mt-10 divide-y divide-paper/10 border-t border-paper/10">
          {entries.map((entry, index) => (
            <Reveal key={entry.id} delay={index * 80}>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-12 py-8">
                <span className="sm:w-1/3 font-serif text-2xl text-signal">{entry.years}</span>
                <div className="sm:w-2/3">
                  <h3 className="font-serif text-2xl text-paper">{entry.degree}</h3>
                  <p className="mt-1 text-paper/60">{entry.school}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
