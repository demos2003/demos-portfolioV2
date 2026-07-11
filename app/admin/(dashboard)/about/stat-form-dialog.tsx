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
import { saveStatAction } from "./actions"
import type { AboutStat } from "@/lib/data/about"

export function StatFormDialog({ stat, trigger }: { stat?: AboutStat; trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await saveStatAction(formData)
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
          <DialogTitle>{stat ? "Edit Stat" : "Add Stat"}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <input type="hidden" name="id" defaultValue={stat?.id ?? ""} />

          <div className="space-y-2">
            <Label htmlFor="value">Value</Label>
            <Input id="value" name="value" placeholder="30+" defaultValue={stat?.value} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="label">Label</Label>
            <Input id="label" name="label" placeholder="Projects Completed" defaultValue={stat?.label} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayOrder">Display Order</Label>
            <Input id="displayOrder" name="displayOrder" type="number" defaultValue={stat?.displayOrder ?? 0} />
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
