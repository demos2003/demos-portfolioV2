import { Github, Linkedin, Twitter } from "lucide-react"
import { Logo } from "@/components/logo"

const SOCIALS = [
  { icon: Github, href: "https://github.com/demos2003", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/iyidemilade-nasiru-halim-9b9a15269/", label: "LinkedIn" },
  { icon: Twitter, href: "https://x.com/NasiruDev", label: "Twitter" },
]

export function Footer() {
  return (
    <footer className="border-t border-paper/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <Logo className="h-10 w-10" />

        <div className="flex items-center gap-6">
          {SOCIALS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="text-paper/50 hover:text-paper transition-colors"
            >
              <social.icon className="h-4 w-4" />
            </a>
          ))}
        </div>

        <span className="text-sm text-paper/40">
          &copy; {new Date().getFullYear()} Nasiru Iyidemilade
        </span>
      </div>
    </footer>
  )
}
