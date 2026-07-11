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
import { saveCategoryAction } from "./actions"
import type { SkillCategory } from "@/lib/data/skills"

export function CategoryFormDialog({
  category,
  trigger,
}: {
  category?: SkillCategory
  trigger: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await saveCategoryAction(formData)
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
          <DialogTitle>{category ? "Edit Category" : "Add Category"}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <input type="hidden" name="id" defaultValue={category?.id ?? ""} />

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={category?.title} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Gradient (Tailwind classes)</Label>
            <Input
              id="color"
              name="color"
              placeholder="from-blue-600 to-purple-600"
              defaultValue={category?.color ?? "from-purple-600 to-pink-600"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayOrder">Display Order</Label>
            <Input id="displayOrder" name="displayOrder" type="number" defaultValue={category?.displayOrder ?? 0} />
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
