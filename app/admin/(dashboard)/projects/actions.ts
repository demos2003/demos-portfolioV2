"use server"

import { revalidatePath } from "next/cache"
import { createProject, updateProject, deleteProject, type ProjectInput } from "@/lib/data/projects"

export type ProjectFormResult = { error?: string }

function parseProjectForm(formData: FormData): ProjectInput {
  const title = String(formData.get("title") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null
  const technologies = String(formData.get("technologies") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
  const liveUrl = String(formData.get("liveUrl") ?? "").trim() || null
  const displayOrder = Number(formData.get("displayOrder") ?? 0) || 0
  const slug = String(formData.get("slug") ?? "").trim()
  const timeline = String(formData.get("timeline") ?? "").trim() || null
  const problemStatement = String(formData.get("problemStatement") ?? "").trim() || null
  const process = String(formData.get("process") ?? "").trim() || null
  const solution = String(formData.get("solution") ?? "").trim() || null
  const results = String(formData.get("results") ?? "").trim() || null
  const galleryImages = String(formData.get("galleryImages") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)

  return {
    title,
    description,
    imageUrl,
    technologies,
    liveUrl,
    displayOrder,
    slug,
    timeline,
    problemStatement,
    process,
    solution,
    results,
    galleryImages,
  }
}

function revalidateProjectPaths() {
  revalidatePath("/")
  revalidatePath("/projects", "layout")
  revalidatePath("/admin/projects")
  revalidatePath("/admin")
}

export async function saveProjectAction(formData: FormData): Promise<ProjectFormResult> {
  const id = String(formData.get("id") ?? "")
  const input = parseProjectForm(formData)

  if (!input.title || !input.description) {
    return { error: "Title and description are required" }
  }

  try {
    if (id) {
      await updateProject(id, input)
    } else {
      await createProject(input)
    }
  } catch (error: any) {
    return { error: error?.message ?? "Something went wrong" }
  }

  revalidateProjectPaths()
  return {}
}

export async function deleteProjectAction(id: string) {
  await deleteProject(id)
  revalidateProjectPaths()
}
