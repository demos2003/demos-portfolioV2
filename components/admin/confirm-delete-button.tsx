"use client"

import { useTransition } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ConfirmDeleteButton({
  onDelete,
  confirmMessage = "Are you sure you want to delete this?",
}: {
  onDelete: () => Promise<void>
  confirmMessage?: string
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={isPending}
      onClick={() => {
        if (!window.confirm(confirmMessage)) return
        startTransition(onDelete)
      }}
    >
      <Trash2 className="h-4 w-4" />
      <span className="sr-only">Delete</span>
    </Button>
  )
}
