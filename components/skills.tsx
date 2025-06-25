import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollAnimation } from "./scroll-animation"

export function Skills() {
  const skillCategories = [
    {
      title: "Frontend",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "React Native", "Angular"],
      color: "from-blue-600 to-purple-600",
    },
    {
      title: "Backend",
      skills: ["Node.js", "Next Js", "Express.js", "Spring boot", "FastAPI", "GraphQL"],
      color: "from-green-600 to-blue-600",
    },
    {
      title: "Database",
      skills: ["PostgreSQL", "MongoDB", "Redis", "MySQL", "Supabase", "Firebase"],
      color: "from-purple-600 to-pink-600",
    },
    {
      title: "DevOps & Tools",
      skills: ["Docker", "AWS", "Vercel", "Git", "GitHub Actions", "Linux"],
      color: "from-orange-600 to-red-600",
    },
  ]

  return (
    <section id="skills" className="py-20 bg-gray-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            My <span className="text-purple-400">Skills</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto"></div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillCategories.map((category, index) => (
            <ScrollAnimation key={index} delay={index * 200}>
              <Card className="bg-gray-900/50 border-purple-500/20 hover:border-purple-500/40 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 group h-full">
                <CardContent className="p-6">
                  <div
                    className={`w-full h-1 bg-gradient-to-r ${category.color} mb-4 rounded transform group-hover:scale-x-110 transition-transform duration-300`}
                  ></div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                    {category.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <Badge
                        key={skillIndex}
                        variant="secondary"
                        className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transform hover:scale-110 transition-all duration-200"
                        style={{ animationDelay: `${skillIndex * 100}ms` }}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  )
}
