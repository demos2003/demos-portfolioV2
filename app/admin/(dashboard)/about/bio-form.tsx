"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { saveBioAction } from "./actions"

export function BioForm({ paragraphs }: { paragraphs: string[] }) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await saveBioAction(formData)
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
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bio">Bio (one paragraph per line)</Label>
        <Textarea
          id="bio"
          name="bio"
          rows={8}
          defaultValue={paragraphs.join("\n")}
          onChange={() => setSuccess(false)}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && !error && <p className="text-sm text-emerald-500">Saved.</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save Bio"}
      </Button>
    </form>
  )
}
