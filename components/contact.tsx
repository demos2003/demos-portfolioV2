"use client"

import React, { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react"
import emailjs from "@emailjs/browser"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { submitContactMessage } from "@/lib/actions/contact"
import type { ContactInfo } from "@/lib/data/about"
import { Reveal } from "@/components/motion/reveal"
import { MagneticButton } from "@/components/motion/magnetic-button"

const fieldClassName =
  "bg-transparent border-0 border-b border-paper/20 rounded-none px-0 text-paper placeholder:text-paper/40 focus-visible:ring-0 focus-visible:border-signal transition-colors"

export function Contact({ contactInfo }: { contactInfo: ContactInfo }) {
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    message: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const form = useRef<HTMLFormElement>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.current) return
    setIsLoading(true)

    const [emailResult, dbResult] = await Promise.allSettled([
      emailjs.sendForm(
        "service_a50v2vu", // Replace with your EmailJS service ID
        "template_ysj7cqg", // Replace with your EmailJS template ID
        form.current,
        "VzuWI64-DSChqLogf" // Replace with your EmailJS public key
      ),
      submitContactMessage({
        name: formData.user_name,
        email: formData.user_email,
        message: formData.message,
      }),
    ])

    setIsLoading(false)

    if (dbResult.status === "rejected") {
      console.error(dbResult.reason)
    }

    if (emailResult.status === "fulfilled" || dbResult.status === "fulfilled") {
      toast.success("Message sent successfully! 🚀")
      setFormData({
        user_name: "",
        user_email: "",
        message: "",
      })
    } else {
      toast.error("Failed to send message 😢")
      console.error(emailResult.reason)
    }
  }

  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden py-24 sm:py-32 border-t border-paper/10 text-paper"
    >
      {/* Signal stays the accent here, not the surface: a warm bloom rising
          from the bottom-left corner instead of a full-bleed orange band. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(70% 90% at 0% 100%, rgba(255,122,69,0.22), transparent 65%)",
        }}
      />
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <Reveal>
          <span className="text-sm text-signal tracking-wide">Contact</span>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mt-10">
          <div className="lg:col-span-5 space-y-8">
            <Reveal delay={100}>
              <h3 className="font-serif text-3xl sm:text-4xl text-paper">
                Let&apos;s work <span className="text-signal">together</span>
              </h3>
              <p className="text-paper/60 text-lg mt-4 max-w-md">
                I&apos;m always interested in new opportunities and exciting projects. Whether
                you have a question or just want to say hi, feel free to reach out.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <div className="space-y-5">
                <ContactDetail icon={<Mail className="h-4 w-4" />} value={contactInfo.email} />
                <ContactDetail icon={<Phone className="h-4 w-4" />} value={contactInfo.phone} />
                <ContactDetail icon={<MapPin className="h-4 w-4" />} value={contactInfo.location} />
              </div>
            </Reveal>
          </div>

          <Reveal delay={150} className="lg:col-span-7">
            <form ref={form} onSubmit={handleSubmit} className="space-y-8">
              <Input
                name="user_name"
                placeholder="Your Name"
                value={formData.user_name}
                onChange={handleChange}
                className={fieldClassName}
                required
              />
              <Input
                name="user_email"
                type="email"
                placeholder="Your Email"
                value={formData.user_email}
                onChange={handleChange}
                className={fieldClassName}
                required
              />
              <Textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className={`${fieldClassName} resize-none`}
                required
              />

              <MagneticButton>
                <Button
                  type="submit"
                  disabled={isLoading}
                  size="lg"
                  className="bg-signal text-ink hover:bg-signal-hover rounded-none px-8 group"
                >
                  {isLoading ? "Sending..." : "Send Message"}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </MagneticButton>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function ContactDetail({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-3 text-paper/80">
      <span className="text-signal">{icon}</span>
      <span>{value}</span>
    </div>
  )
}
