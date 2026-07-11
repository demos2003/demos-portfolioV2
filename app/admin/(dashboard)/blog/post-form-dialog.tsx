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
import { saveBlogPostAction } from "./actions"
import type { BlogPost } from "@/lib/data/blog"

export function PostFormDialog({ post, trigger }: { post?: BlogPost; trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await saveBlogPostAction(formData)
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
          <DialogTitle>{post ? "Edit Post" : "Add Post"}</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <input type="hidden" name="id" defaultValue={post?.id ?? ""} />

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={post?.title} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea id="excerpt" name="excerpt" rows={3} defaultValue={post?.excerpt} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" name="imageUrl" placeholder="/images/example.png" defaultValue={post?.imageUrl ?? ""} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postDate">Date</Label>
              <Input id="postDate" name="postDate" placeholder="Jul 21, 2024" defaultValue={post?.postDate ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="readTime">Read Time</Label>
              <Input id="readTime" name="readTime" placeholder="5 min read" defaultValue={post?.readTime ?? ""} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" name="tags" placeholder="React, Hooks" defaultValue={post?.tags.join(", ") ?? ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Article URL</Label>
            <Input id="url" name="url" placeholder="https://..." defaultValue={post?.url ?? ""} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayOrder">Display Order</Label>
            <Input id="displayOrder" name="displayOrder" type="number" defaultValue={post?.displayOrder ?? 0} />
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
