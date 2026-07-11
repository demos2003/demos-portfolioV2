import { getSupabaseServerClient } from "@/lib/supabase/server"

export type ContactSubmission = {
  id: string
  name: string
  email: string
  message: string
  isRead: boolean
  createdAt: string
}

function mapRow(row: any): ContactSubmission {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    isRead: row.is_read,
    createdAt: row.created_at,
  }
}

export async function createContactSubmission(input: { name: string; email: string; message: string }) {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase.from("contact_submissions").insert({
    name: input.name,
    email: input.email,
    message: input.message,
  })
  if (error) throw error
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) throw error
  return (data ?? []).map(mapRow)
}

export async function getUnreadContactCount(): Promise<number> {
  const supabase = getSupabaseServerClient()
  const { count, error } = await supabase
    .from("contact_submissions")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false)
  if (error) throw error
  return count ?? 0
}

export async function setContactSubmissionRead(id: string, isRead: boolean) {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase
    .from("contact_submissions")
    .update({ is_read: isRead })
    .eq("id", id)
  if (error) throw error
}

export async function deleteContactSubmission(id: string) {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase.from("contact_submissions").delete().eq("id", id)
  if (error) throw error
}
