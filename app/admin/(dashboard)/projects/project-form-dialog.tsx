"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { saveProjectAction } from "./actions"
import type { Project } from "@/lib/data/projects"

export function ProjectFormDialog({
  project,
  trigger,
}: {
  project?: Project
  trigger: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await saveProjectAction(formData)
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
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Add Project"}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <input type="hidden" name="id" defaultValue={project?.id ?? ""} />

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={project?.title} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={4} defaultValue={project?.description} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" name="imageUrl" placeholder="/images/example.png" defaultValue={project?.imageUrl ?? ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="technologies">Technologies (comma-separated)</Label>
            <Input
              id="technologies"
              name="technologies"
              placeholder="Next.js, TypeScript, Tailwind"
              defaultValue={project?.technologies.join(", ") ?? ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="liveUrl">Live URL</Label>
            <Input id="liveUrl" name="liveUrl" placeholder="https://..." defaultValue={project?.liveUrl ?? ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayOrder">Display Order</Label>
            <Input id="displayOrder" name="displayOrder" type="number" defaultValue={project?.displayOrder ?? 0} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              placeholder="auto-generated from title if left blank"
              defaultValue={project?.slug ?? ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeline">Timeline</Label>
            <Input id="timeline" name="timeline" placeholder="e.g. 6 weeks, Jan–Mar 2025" defaultValue={project?.timeline ?? ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="problemStatement">Problem</Label>
            <Textarea
              id="problemStatement"
              name="problemStatement"
              rows={4}
              placeholder="What problem was this project solving?"
              defaultValue={project?.problemStatement ?? ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="process">Process</Label>
            <Textarea
              id="process"
              name="process"
              rows={4}
              placeholder="How did you approach it?"
              defaultValue={project?.process ?? ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="solution">Solution</Label>
            <Textarea
              id="solution"
              name="solution"
              rows={4}
              placeholder="What did you build?"
              defaultValue={project?.solution ?? ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="results">Results</Label>
            <Textarea
              id="results"
              name="results"
              rows={4}
              placeholder="What was the outcome/impact?"
              defaultValue={project?.results ?? ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="galleryImages">Gallery Image URLs (comma-separated)</Label>
            <Input
              id="galleryImages"
              name="galleryImages"
              placeholder="/images/one.png, /images/two.png"
              defaultValue={project?.galleryImages.join(", ") ?? ""}
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
