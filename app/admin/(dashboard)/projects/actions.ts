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

  return { title, description, imageUrl, technologies, liveUrl, displayOrder }
}

function revalidateProjectPaths() {
  revalidatePath("/")
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
