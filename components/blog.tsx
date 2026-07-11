import { ArrowUpRight } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { SectionGlow } from "@/components/motion/active-section"
import type { BlogPost } from "@/lib/data/blog"

export function Blog({ posts: blogPosts }: { posts: BlogPost[] }) {
  return (
    <section id="blog" className="relative py-28 sm:py-36 border-t border-paper/10">
      <SectionGlow id="blog" />
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <Reveal>
          <span className="text-sm text-clay tracking-wide">Writing</span>
        </Reveal>

        <div className="mt-10 divide-y divide-paper/10 border-t border-paper/10">
          {blogPosts.map((post, index) => (
            <Reveal key={post.id} delay={index * 60}>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-8 py-7"
              >
                <span className="text-sm text-paper/40 sm:w-32 shrink-0">{post.postDate}</span>

                <div className="flex-1 space-y-2">
                  <h3 className="font-serif text-2xl text-paper group-hover:text-clay transition-colors flex items-center gap-2">
                    {post.title}
                    <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-paper/60 max-w-2xl">{post.excerpt}</p>
                  <p className="text-xs uppercase tracking-widest text-paper/30">
                    {post.readTime} &middot; {post.tags.join(" / ")}
                  </p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
