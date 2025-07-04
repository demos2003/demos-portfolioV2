"use client"

import React, { useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import emailjs from "@emailjs/browser"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export function Contact() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.current) return
    setIsLoading(true)

    emailjs
      .sendForm(
        "service_a50v2vu",         // Replace with your EmailJS service ID
        "template_ysj7cqg",        // Replace with your EmailJS template ID
        form.current,
        "VzuWI64-DSChqLogf"        // Replace with your EmailJS public key
      )
      .then(
        (result) => {
          toast.success("Message sent successfully! 🚀")
          setFormData({
            user_name: "",
            user_email: "",
            message: "",
          })
          setIsLoading(false)
        },
        (error) => {
          toast.error("Failed to send message 😢")
          console.error(error.text)
          setIsLoading(false)
        }
      )
  }

  return (
    <section id="contact" className="py-20 bg-gray-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get In <span className="text-purple-400">Touch</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Let's work together</h3>
              <p className="text-gray-300 text-lg">
                I'm always interested in new opportunities and exciting projects. Whether you have a question or just want to say hi, feel free to reach out!
              </p>
            </div>

            <div className="space-y-6">
              <ContactDetail icon={<Mail />} label="Email" value="ladenas202@gmail.com" />
              <ContactDetail icon={<Phone />} label="Phone" value="09027795800" />
              <ContactDetail icon={<MapPin />} label="Location" value="Lagos, Nigeria" />
            </div>
          </div>

          {/* Contact Form */}
          <Card className="bg-gray-900/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Send me a message</CardTitle>
            </CardHeader>
            <CardContent>
              <form ref={form} onSubmit={handleSubmit} className="space-y-6">
                <Input
                  name="user_name"
                  placeholder="Your Name"
                  value={formData.user_name}
                  onChange={handleChange}
                  className="bg-gray-800/50 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-500"
                  required
                />
                <Input
                  name="user_email"
                  type="email"
                  placeholder="Your Email"
                  value={formData.user_email}
                  onChange={handleChange}
                  className="bg-gray-800/50 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-500"
                  required
                />
                <Textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="bg-gray-800/50 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-500 resize-none"
                  required
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

function ContactDetail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h4 className="text-white font-semibold">{label}</h4>
        <p className="text-gray-300">{value}</p>
      </div>
    </div>
  )
}
