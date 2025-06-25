"use client"

import { useState, useEffect } from "react"
import { Code, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Blog", href: "#blog" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-black/80 backdrop-blur-md border-b border-purple-500/20" : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Animated Logo */}
          <div className="flex items-center group cursor-pointer">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-500 to-purple-700 rounded-xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse">
                <Zap className="h-3 w-3 text-white p-0.5" />
              </div>
            </div>
            <div className="ml-3">
              <div className="text-white font-bold text-xl tracking-tight">Demos</div>
              <div className="text-purple-400 text-xs font-medium -mt-1">Full Stack Dev</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                className="relative px-4 py-2 text-gray-300 hover:text-white transition-all duration-300 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="relative z-10">{item.name}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/20 to-pink-600/0 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a href="#contact">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
                Let's Talk
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:bg-purple-500/20 transition-all duration-300"
            >
              <div className="relative w-6 h-6">
                <span
                  className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${isOpen ? "rotate-45 translate-y-0" : "-translate-y-2"
                    }`}
                />
                <span
                  className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${isOpen ? "opacity-0" : "opacity-100"
                    }`}
                />
                <span
                  className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${isOpen ? "-rotate-45 translate-y-0" : "translate-y-2"
                    }`}
                />
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-500 overflow-hidden ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="bg-black/95 backdrop-blur-md border-t border-purple-500/20">
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                className="block text-gray-300 hover:text-white py-2 transition-all duration-300 transform hover:translate-x-2"
                onClick={() => setIsOpen(false)}
                style={{
                  animation: isOpen ? `slideInLeft 0.3s ease-out ${index * 100}ms both` : "none",
                }}
              >
                {item.name}
              </a>
            ))}
            <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
              Let's Talk
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
