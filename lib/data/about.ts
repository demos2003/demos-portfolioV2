import { getSupabaseServerClient } from "@/lib/supabase/server"

export type AboutStat = {
  id: string
  label: string
  value: string
  displayOrder: number
}

export type ContactInfo = {
  email: string
  phone: string
  location: string
}

export async function getAboutStats(): Promise<AboutStat[]> {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("about_stats")
    .select("*")
    .order("display_order", { ascending: true })
  if (error) throw error
  return (data ?? []).map((row: any) => ({
    id: row.id,
    label: row.label,
    value: row.value,
    displayOrder: row.display_order,
  }))
}

export async function createAboutStat(input: { label: string; value: string; displayOrder: number }) {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase
    .from("about_stats")
    .insert({ label: input.label, value: input.value, display_order: input.displayOrder })
  if (error) throw error
}

export async function updateAboutStat(
  id: string,
  input: { label: string; value: string; displayOrder: number }
) {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase
    .from("about_stats")
    .update({ label: input.label, value: input.value, display_order: input.displayOrder })
    .eq("id", id)
  if (error) throw error
}

export async function deleteAboutStat(id: string) {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase.from("about_stats").delete().eq("id", id)
  if (error) throw error
}

async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle()
  if (error) throw error
  return (data?.value as T) ?? fallback
}

async function setSetting(key: string, value: unknown) {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase.from("site_settings").upsert({ key, value })
  if (error) throw error
}

export async function getAboutBio(): Promise<string[]> {
  return getSetting<string[]>("about_bio", [])
}

export async function updateAboutBio(paragraphs: string[]) {
  await setSetting("about_bio", paragraphs)
}

export async function getContactInfo(): Promise<ContactInfo> {
  return getSetting<ContactInfo>("contact_info", { email: "", phone: "", location: "" })
}

export async function updateContactInfo(info: ContactInfo) {
  await setSetting("contact_info", info)
}
