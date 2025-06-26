import { Card, CardContent } from "@/components/ui/card"

export function About() {
  return (
    <section id="about" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            About <span className="text-purple-400">Me</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-gray-300 text-lg leading-relaxed">
              I'm a passionate Full Stack Developer with expertise in modern web technologies. I love creating
              efficient, scalable, and user-friendly applications that solve real-world problems.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              My journey in software development started with curiosity about how things work behind the scenes. Today,
              I specialize in React, Node.js, Python, and cloud technologies, always staying updated with the latest
              industry trends.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or
              sharing knowledge with the developer community.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-purple-500/20 hover:border-purple-500/40 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">30+</div>
                <div className="text-gray-300">Projects Completed</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-purple-500/20 hover:border-purple-500/40 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">4+</div>
                <div className="text-gray-300">Years Experience</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-purple-500/20 hover:border-purple-500/40 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">10+</div>
                <div className="text-gray-300">Technologies</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-purple-500/20 hover:border-purple-500/40 transition-colors">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">100%</div>
                <div className="text-gray-300">Client Satisfaction</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
