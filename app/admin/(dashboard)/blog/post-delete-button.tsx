"use client"

import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button"
import { deleteBlogPostAction } from "./actions"

export function PostDeleteButton({ id, title }: { id: string; title: string }) {
  return (
    <ConfirmDeleteButton
      confirmMessage={`Delete post "${title}"? This cannot be undone.`}
      onDelete={() => deleteBlogPostAction(id)}
    />
  )
}
