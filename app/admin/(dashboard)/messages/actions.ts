"use server"

import { revalidatePath } from "next/cache"
import { setContactSubmissionRead, deleteContactSubmission } from "@/lib/data/contact"

function revalidateMessagesPaths() {
  revalidatePath("/admin/messages")
  revalidatePath("/admin")
}

export async function toggleReadAction(id: string, isRead: boolean) {
  await setContactSubmissionRead(id, isRead)
  revalidateMessagesPaths()
}

export async function deleteMessageAction(id: string) {
  await deleteContactSubmission(id)
  revalidateMessagesPaths()
}
