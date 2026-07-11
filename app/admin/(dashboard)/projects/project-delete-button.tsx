"use client"

import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button"
import { deleteProjectAction } from "./actions"

export function ProjectDeleteButton({ id, title }: { id: string; title: string }) {
  return (
    <ConfirmDeleteButton
      confirmMessage={`Delete project "${title}"? This cannot be undone.`}
      onDelete={() => deleteProjectAction(id)}
    />
  )
}
