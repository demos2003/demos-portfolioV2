"use server"

import { revalidatePath } from "next/cache"
import {
  updateAboutBio,
  updateContactInfo,
  createAboutStat,
  updateAboutStat,
  deleteAboutStat,
  createEducationEntry,
  updateEducationEntry,
  deleteEducationEntry,
} from "@/lib/data/about"

export type FormResult = { error?: string }

function revalidateAboutPaths() {
  revalidatePath("/")
  revalidatePath("/admin/about")
}

export async function saveBioAction(formData: FormData): Promise<FormResult> {
  const raw = String(formData.get("bio") ?? "")
  const paragraphs = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

  try {
    await updateAboutBio(paragraphs)
  } catch (error: any) {
    return { error: error?.message ?? "Something went wrong" }
  }

  revalidateAboutPaths()
  return {}
}

export async function saveContactInfoAction(formData: FormData): Promise<FormResult> {
  const email = String(formData.get("email") ?? "").trim()
  const phone = String(formData.get("phone") ?? "").trim()
  const location = String(formData.get("location") ?? "").trim()

  if (!email) {
    return { error: "Email is required" }
  }

  try {
    await updateContactInfo({ email, phone, location })
  } catch (error: any) {
    return { error: error?.message ?? "Something went wrong" }
  }

  revalidateAboutPaths()
  return {}
}

export async function saveStatAction(formData: FormData): Promise<FormResult> {
  const id = String(formData.get("id") ?? "")
  const label = String(formData.get("label") ?? "").trim()
  const value = String(formData.get("value") ?? "").trim()
  const displayOrder = Number(formData.get("displayOrder") ?? 0) || 0

  if (!label || !value) {
    return { error: "Label and value are required" }
  }

  try {
    if (id) {
      await updateAboutStat(id, { label, value, displayOrder })
    } else {
      await createAboutStat({ label, value, displayOrder })
    }
  } catch (error: any) {
    return { error: error?.message ?? "Something went wrong" }
  }

  revalidateAboutPaths()
  return {}
}

export async function deleteStatAction(id: string) {
  await deleteAboutStat(id)
  revalidateAboutPaths()
}

export async function saveEducationAction(formData: FormData): Promise<FormResult> {
  const id = String(formData.get("id") ?? "")
  const degree = String(formData.get("degree") ?? "").trim()
  const school = String(formData.get("school") ?? "").trim()
  const years = String(formData.get("years") ?? "").trim()
  const displayOrder = Number(formData.get("displayOrder") ?? 0) || 0

  if (!degree || !school || !years) {
    return { error: "Degree, school and years are required" }
  }

  try {
    if (id) {
      await updateEducationEntry(id, { degree, school, years, displayOrder })
    } else {
      await createEducationEntry({ degree, school, years, displayOrder })
    }
  } catch (error: any) {
    return { error: error?.message ?? "Something went wrong" }
  }

  revalidateAboutPaths()
  return {}
}

export async function deleteEducationAction(id: string) {
  await deleteEducationEntry(id)
  revalidateAboutPaths()
}
