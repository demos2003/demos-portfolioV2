import { getSupabaseServerClient } from "@/lib/supabase/server"
import { slugify } from "@/lib/utils"

export type Project = {
  id: string
  title: string
  description: string
  imageUrl: string | null
  technologies: string[]
  liveUrl: string | null
  displayOrder: number
  slug: string
  timeline: string | null
  problemStatement: string | null
  process: string | null
  solution: string | null
  results: string | null
  galleryImages: string[]
}

export type ProjectInput = {
  title: string
  description: string
  imageUrl: string | null
  technologies: string[]
  liveUrl: string | null
  displayOrder: number
  slug: string
  timeline: string | null
  problemStatement: string | null
  process: string | null
  solution: string | null
  results: string | null
  galleryImages: string[]
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
    slug: row.slug,
    timeline: row.timeline,
    problemStatement: row.problem_statement,
    process: row.process,
    solution: row.solution,
    results: row.results,
    galleryImages: row.gallery_images ?? [],
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

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle()

  if (error) throw error
  return data ? mapRow(data) : null
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
    slug: input.slug || slugify(input.title),
    timeline: input.timeline,
    problem_statement: input.problemStatement,
    process: input.process,
    solution: input.solution,
    results: input.results,
    gallery_images: input.galleryImages,
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
      slug: input.slug || slugify(input.title),
      timeline: input.timeline,
      problem_statement: input.problemStatement,
      process: input.process,
      solution: input.solution,
      results: input.results,
      gallery_images: input.galleryImages,
    })
    .eq("id", id)
  if (error) throw error
}

export async function deleteProject(id: string) {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase.from("projects").delete().eq("id", id)
  if (error) throw error
}
