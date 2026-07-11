import { getSupabaseServerClient } from "@/lib/supabase/server"

export type Skill = {
  id: string
  name: string
  displayOrder: number
}

export type SkillCategory = {
  id: string
  title: string
  color: string
  displayOrder: number
  skills: Skill[]
}

export async function getSkillCategories(): Promise<SkillCategory[]> {
  const supabase = getSupabaseServerClient()

  const [{ data: categories, error: categoriesError }, { data: skills, error: skillsError }] =
    await Promise.all([
      supabase.from("skill_categories").select("*").order("display_order", { ascending: true }),
      supabase.from("skills").select("*").order("display_order", { ascending: true }),
    ])

  if (categoriesError) throw categoriesError
  if (skillsError) throw skillsError

  return (categories ?? []).map((category: any) => ({
    id: category.id,
    title: category.title,
    color: category.color,
    displayOrder: category.display_order,
    skills: (skills ?? [])
      .filter((skill: any) => skill.category_id === category.id)
      .map((skill: any) => ({
        id: skill.id,
        name: skill.name,
        displayOrder: skill.display_order,
      })),
  }))
}

export async function createSkillCategory(input: { title: string; color: string; displayOrder: number }) {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("skill_categories")
    .insert({ title: input.title, color: input.color, display_order: input.displayOrder })
    .select("id")
    .single()
  if (error) throw error
  return data.id as string
}

export async function updateSkillCategory(
  id: string,
  input: { title: string; color: string; displayOrder: number }
) {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase
    .from("skill_categories")
    .update({ title: input.title, color: input.color, display_order: input.displayOrder })
    .eq("id", id)
  if (error) throw error
}

export async function deleteSkillCategory(id: string) {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase.from("skill_categories").delete().eq("id", id)
  if (error) throw error
}

export async function createSkill(categoryId: string, input: { name: string; displayOrder: number }) {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase
    .from("skills")
    .insert({ category_id: categoryId, name: input.name, display_order: input.displayOrder })
  if (error) throw error
}

export async function updateSkill(id: string, input: { name: string; displayOrder: number }) {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase
    .from("skills")
    .update({ name: input.name, display_order: input.displayOrder })
    .eq("id", id)
  if (error) throw error
}

export async function deleteSkill(id: string) {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase.from("skills").delete().eq("id", id)
  if (error) throw error
}
