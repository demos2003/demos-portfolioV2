"use client"

import { useTransition } from "react"
import { Mail, MailOpen } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button"
import { toggleReadAction, deleteMessageAction } from "./actions"
import type { ContactSubmission } from "@/lib/data/contact"

export function MessageCard({ submission }: { submission: ContactSubmission }) {
  const [isPending, startTransition] = useTransition()

  return (
    <Card className={submission.isRead ? "" : "border-primary/50"}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{submission.name}</span>
            {!submission.isRead && <Badge>New</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">{submission.email}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(submission.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-1 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={isPending}
            onClick={() => startTransition(() => toggleReadAction(submission.id, !submission.isRead))}
          >
            {submission.isRead ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
            <span className="sr-only">{submission.isRead ? "Mark unread" : "Mark read"}</span>
          </Button>
          <ConfirmDeleteButton
            confirmMessage={`Delete message from "${submission.name}"?`}
            onDelete={() => deleteMessageAction(submission.id)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm whitespace-pre-wrap">{submission.message}</p>
      </CardContent>
    </Card>
  )
}
