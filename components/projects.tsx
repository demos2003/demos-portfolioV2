import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github } from "lucide-react"
import Image from "next/image"
import { ScrollAnimation } from "./scroll-animation"

export function Projects() {
  const projects = [
    {
      title: "Royal Gate Group Website",
      description:
        "A premium website for Royal Gate a revolutionary food distibution company",
      image: "/images/RG.png",
      technologies: ["Next JS", "Tailwind", "Vite"],

    },
    {
      title: "LSTML",
      description: "Redesigned and developed the official website for the Lagos State Material Testing Laboratory (LSTML) using Next.js. Integrated a headless CMS for seamless content management by non-technical staff, and added social media integration to improve public engagement. Focused on accessibility, performance, and responsiveness across all devices.",
      image: "/images/LSTML.png",
      technologies: ["Next.js", "TypeScript", "Tailwind"],
      liveUrl: "https://lsmtl.lg.gov.ng/",

      
    },
    {
      title: "Ticket Dash",
      description:
        "An intelligent event booking platform that enables users to seamlessly book, purchase, and redeem event tickets",
      image: "/images/TD.png",
      technologies: ["React", "Spring boot", "React Native", "Postgres"],
      liveUrl: "https://ticket-pro-web.onrender.com/",
   
    },
  ]

  return (
    <section id="projects" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollAnimation className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Featured <span className="text-purple-400">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto"></div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ScrollAnimation key={index} delay={index * 200}>
              <Card className="bg-gray-900/50 border-purple-500/20 hover:border-purple-500/40 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden group h-full flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-2"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardHeader>
                  <CardTitle className="text-white group-hover:text-purple-300 transition-colors">
                    {project.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex-1 flex flex-col">
                  <p className="text-gray-300 text-sm flex-1">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <Badge
                        key={techIndex}
                        variant="secondary"
                        className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transform hover:scale-110 transition-all duration-200"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 group/btn"
                    >
                      <ExternalLink className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform" />
                      Live Demo
                    </Button>
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
