import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ExternalLink, ArrowRight } from "lucide-react"
import Image from "next/image"
import { ScrollAnimation } from "./scroll-animation"

export function Blog() {
const blogPosts = [
  {
    title:    "Navigating the Maze of React Hooks: Understanding, Implementing, and Avoiding Pitfalls",
    excerpt:  "A deep dive into React Hooks — how they work, best practices for usage, and common mistakes to avoid when managing state and side effects.",
    image:    "/images/RH.png",
    date:     "Jun 26, 2024",
    readTime: "6 min read",
    tags:     ["React", "Hooks", "JavaScript"],
    url:      "https://medium.com/@ladenas202/navigating-the-maze-of-react-hooks-understanding-implementing-and-avoiding-pitfalls-82ba52d7b98d",
  },
  {
    title:    "Navigating the Maze of React Hooks: Understanding, Implementing, and Avoiding Pitfalls pt.2",
    excerpt:  "Explore advanced React Hook patterns, custom hooks, and integrating them with state management tools like Redux and Zustand.",
    image:    "/images/RH.png",
    date:     "Jul 2, 2024",
    readTime: "12 min read",
    tags:     ["React", "Custom Hooks", "State Management"],
    url:      "https://medium.com/@ladenas202/navigating-the-maze-of-react-hooks-understanding-implementing-and-avoiding-pitfalls-pt-2-023b716c7724",
    
  },
  {
    title:    "The Developer Mindset",
    excerpt:  "Insights on cultivating a problem-solving mindset, writing maintainable code, and continuously improving as a software developer.",
    image:    "/images/Mindset.png",
    date:     "Jul 30, 2024",
    readTime: "10 min read",
    tags:     ["Mindset", "Career", "Best Practices"],
    url:      "https://medium.com/@ladenas202/the-developer-mindset-fb9f60fb4d86",
  },
  {
    title:    "Mastering Basic Git Operations and Leveraging GitHub for Seamless Code Collaboration",
    excerpt:  "Learn the fundamentals of Git — cloning, branching, committing, pushing — and how to use GitHub effectively for team collaboration.",
    image:    "/images/Git.png",
    date:     "Jul 21, 2024",
    readTime: "5 min read",
    tags:     ["Git", "GitHub", "Version Control"],
    url:      "https://medium.com/@ladenas202/mastering-basic-git-operations-and-leveraging-github-for-seamless-code-collaboration-9d6b2225aa88",
  },
{
  title:    "A Beginner’s Guide to Essential Data Structures",
  excerpt:  "An easy-to-follow introduction to fundamental data structures like arrays, linked lists, stacks, queues, trees, and hash maps — and when to use each.",
  image:    "/images/DSA.png", // Optional: you may want to rename the image to match content
  date:     "Jul 21, 2024",
  readTime: "4 min read",
  tags:     ["Data Structures", "Algorithms", "Computer Science"],
  url:      "https://medium.com/@ladenas202/a-beginners-guide-to-essential-data-structures-82fffd7180b8",
},

];


  return (
    <section id="blog" className="py-20 bg-gray-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Latest <span className="text-purple-400">Articles</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Sharing insights, tutorials, and experiences from my journey as a full-stack developer
          </p>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <ScrollAnimation key={index} delay={index * 100}>
              <Card className="bg-gray-900/50 border-purple-500/20 hover:border-purple-500/40 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden group h-full flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </div>
                  </div>
                  <CardTitle className="text-white group-hover:text-purple-300 transition-colors text-lg leading-tight">
                    {post.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  <p className="text-gray-300 text-sm mb-4 flex-1 leading-relaxed">{post.excerpt}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant="secondary"
                        className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button
                    variant="ghost"
                    className="text-purple-400 hover:text-white hover:bg-purple-500/10 p-0 h-auto justify-start group/btn"
                    asChild
                  >
                    <a href={post.url} target="_blank" rel="noopener noreferrer">
                      Read Article
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </ScrollAnimation>
          ))}
        </div>

        <ScrollAnimation className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="border-purple-500 text-purple-400 hover:bg-purple-500/10 transform hover:scale-105 transition-all duration-300 group"
          >
            View All Articles
            <ExternalLink className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
          </Button>
        </ScrollAnimation>
      </div>
    </section>
  )
}
