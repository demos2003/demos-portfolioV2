"use server"

import { revalidatePath } from "next/cache"
import { createContactSubmission } from "@/lib/data/contact"

export async function submitContactMessage(input: { name: string; email: string; message: string }) {
  await createContactSubmission(input)
  revalidatePath("/admin/messages")
  revalidatePath("/admin")
}
