"use server"

import { revalidatePath } from "next/cache"
import {
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
  createSkill,
  deleteSkill,
  getSkillCategories,
} from "@/lib/data/skills"

export type CategoryFormResult = { error?: string }

function revalidateSkillsPaths() {
  revalidatePath("/")
  revalidatePath("/admin/skills")
}

export async function saveCategoryAction(formData: FormData): Promise<CategoryFormResult> {
  const id = String(formData.get("id") ?? "")
  const title = String(formData.get("title") ?? "").trim()
  const color = String(formData.get("color") ?? "").trim() || "from-purple-600 to-pink-600"
  const displayOrder = Number(formData.get("displayOrder") ?? 0) || 0

  if (!title) {
    return { error: "Title is required" }
  }

  try {
    if (id) {
      await updateSkillCategory(id, { title, color, displayOrder })
    } else {
      await createSkillCategory({ title, color, displayOrder })
    }
  } catch (error: any) {
    return { error: error?.message ?? "Something went wrong" }
  }

  revalidateSkillsPaths()
  return {}
}

export async function deleteCategoryAction(id: string) {
  await deleteSkillCategory(id)
  revalidateSkillsPaths()
}

export async function addSkillAction(categoryId: string, name: string) {
  const trimmed = name.trim()
  if (!trimmed) return

  const categories = await getSkillCategories()
  const category = categories.find((c) => c.id === categoryId)
  const nextOrder = category ? category.skills.length : 0

  await createSkill(categoryId, { name: trimmed, displayOrder: nextOrder })
  revalidateSkillsPaths()
}

export async function deleteSkillAction(id: string) {
  await deleteSkill(id)
  revalidateSkillsPaths()
}
