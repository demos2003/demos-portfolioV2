import { Button } from "@/components/ui/button"
import { Github, Linkedin, Twitter, Mail, Download, ArrowRight } from "lucide-react"
import Image from "next/image"

export function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full animate-pulse-slow">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-ping"></div>
                <span className="text-purple-400 text-sm font-medium">Available for new projects</span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight animate-slide-in-left">
                  Software
                  <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent animate-gradient">
                    Engineer
                  </span>
                </h1>
                <h2 className="text-xl md:text-2xl text-gray-300 animate-slide-in-left animation-delay-200">
                  Building digital experiences that matter
                </h2>
              </div>
            </div>

            <p className="text-gray-400 text-lg max-w-lg leading-relaxed animate-fade-in animation-delay-400">
              I am Nasiru Iyidemilade, i craft full-stack applications with modern technologies, focusing on performance, user experience, and
              scalable architecture. Let's build something amazing together.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animation-delay-600">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 group"
              >
                View My Work
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <a href="/Nasiru_Iyidemilade_Resume.pdf" download>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-purple-500 text-purple-400 hover:bg-purple-500/10 transform hover:scale-105 transition-all duration-300 group"
                >
                  <Download className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                  Download CV
                </Button>
              </a>

            </div>

            <div className="flex space-x-4 animate-fade-in animation-delay-800">
              {[
                { icon: Github, href: "https://github.com/demos2003", label: "GitHub" },
                { icon: Linkedin, href: "https://www.linkedin.com/in/iyidemilade-nasiru-halim-9b9a15269/", label: "LinkedIn" },
                { icon: Twitter, href: "https://x.com/NasiruDev", label: "Twitter" },
              ].map((social, index) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ animationDelay: `${800 + index * 100}ms` }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-purple-400 hover:text-white hover:bg-purple-500/20 transform hover:scale-110 hover:-translate-y-1 transition-all duration-300"
                  >
                    <social.icon className="h-5 w-5" />
                  </Button>
                </a>
              ))}
            </div>

          </div>

          <div className="flex justify-center lg:justify-end animate-fade-in-right">
            <div className="relative group">
              <div className="relative">
                <div className="w-80 h-96 border-2 border-purple-500/50 rounded-2xl overflow-hidden transform group-hover:scale-105 transition-all duration-500 shadow-2xl">
                  <Image
                    src="/images/ME2.jpeg"
                    alt="Profile"
                    width={320}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center animate-spin-slow">
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">DEV</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
