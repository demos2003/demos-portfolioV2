"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { saveEducationAction } from "./actions"
import type { EducationEntry } from "@/lib/data/about"

export function EducationFormDialog({ entry, trigger }: { entry?: EducationEntry; trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await saveEducationAction(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        setError(null)
        setOpen(false)
      }
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) setError(null)
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{entry ? "Edit Education" : "Add Education"}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <input type="hidden" name="id" defaultValue={entry?.id ?? ""} />

          <div className="space-y-2">
            <Label htmlFor="degree">Degree</Label>
            <Input
              id="degree"
              name="degree"
              placeholder="MSc Artificial Intelligence"
              defaultValue={entry?.degree}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="school">School</Label>
            <Input
              id="school"
              name="school"
              placeholder="Birmingham City University"
              defaultValue={entry?.school}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="years">Years</Label>
            <Input id="years" name="years" placeholder="2026 — Present" defaultValue={entry?.years} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayOrder">Display Order (lowest first)</Label>
            <Input
              id="displayOrder"
              name="displayOrder"
              type="number"
              defaultValue={entry?.displayOrder ?? 0}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
