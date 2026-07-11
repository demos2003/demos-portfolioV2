"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

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

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const targetId = e.currentTarget.getAttribute("href")?.substring(1)
    if (targetId) {
      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    }
    if (isOpen) {
      setIsOpen(false)
    }
  }

  const navItems = [
    { name: "About", href: "#about" },
    { name: "Services", href: "#services" },
    { name: "Work", href: "#projects" },
    { name: "Blog", href: "#blog" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-ink/90 backdrop-blur-sm border-b border-paper/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-20">
          <a
            href="#home"
            onClick={handleLinkClick}
            className="font-serif text-xl text-paper tracking-tight"
          >
            Daymos Studio
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={handleLinkClick}
                className="text-sm text-paper/60 hover:text-paper transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-clay transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="hidden md:block">
            <a href="#contact" onClick={handleLinkClick}>
              <Button
                variant="outline"
                className="border-paper/20 text-paper bg-transparent hover:bg-paper hover:text-ink transition-colors rounded-none"
              >
                Let&apos;s Talk
              </Button>
            </a>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              className="text-paper hover:bg-paper/10"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-ink border-t border-paper/10">
          <div className="px-6 py-6 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={handleLinkClick}
                className="block text-paper/70 hover:text-paper py-1 transition-colors"
              >
                {item.name}
              </a>
            ))}
            <a href="#contact" onClick={handleLinkClick}>
              <Button className="w-full mt-2 bg-paper text-ink hover:bg-paper/90 rounded-none">
                Let&apos;s Talk
              </Button>
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
