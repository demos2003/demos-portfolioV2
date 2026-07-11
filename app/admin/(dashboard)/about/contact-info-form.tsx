"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { saveContactInfoAction } from "./actions"
import type { ContactInfo } from "@/lib/data/about"

export function ContactInfoForm({ contactInfo }: { contactInfo: ContactInfo }) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await saveContactInfoAction(formData)
      if (result?.error) {
        setError(result.error)
        setSuccess(false)
      } else {
        setError(null)
        setSuccess(true)
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-4" onChange={() => setSuccess(false)}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={contactInfo.email} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" defaultValue={contactInfo.phone} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" defaultValue={contactInfo.location} />
        </div>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && !error && <p className="text-sm text-emerald-500">Saved.</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save Contact Info"}
      </Button>
    </form>
  )
}
