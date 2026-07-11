import { getSupabaseServerClient } from "@/lib/supabase/server"

export type Project = {
  id: string
  title: string
  description: string
  imageUrl: string | null
  technologies: string[]
  liveUrl: string | null
  displayOrder: number
}

export type ProjectInput = {
  title: string
  description: string
  imageUrl: string | null
  technologies: string[]
  liveUrl: string | null
  displayOrder: number
}

function mapRow(row: any): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    imageUrl: row.image_url,
    technologies: row.technologies ?? [],
    liveUrl: row.live_url,
    displayOrder: row.display_order,
  }
}

export async function getProjects(): Promise<Project[]> {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true })

  if (error) throw error
  return (data ?? []).map(mapRow)
}

export async function createProject(input: ProjectInput) {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase.from("projects").insert({
    title: input.title,
    description: input.description,
    image_url: input.imageUrl,
    technologies: input.technologies,
    live_url: input.liveUrl,
    display_order: input.displayOrder,
  })
  if (error) throw error
}

export async function updateProject(id: string, input: ProjectInput) {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase
    .from("projects")
    .update({
      title: input.title,
      description: input.description,
      image_url: input.imageUrl,
      technologies: input.technologies,
      live_url: input.liveUrl,
      display_order: input.displayOrder,
    })
    .eq("id", id)
  if (error) throw error
}

export async function deleteProject(id: string) {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase.from("projects").delete().eq("id", id)
  if (error) throw error
}
