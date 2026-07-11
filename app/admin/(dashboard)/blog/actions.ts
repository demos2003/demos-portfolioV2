"use server"

import { revalidatePath } from "next/cache"
import { createBlogPost, updateBlogPost, deleteBlogPost, type BlogPostInput } from "@/lib/data/blog"

export type BlogPostFormResult = { error?: string }

function parseBlogPostForm(formData: FormData): BlogPostInput {
  const title = String(formData.get("title") ?? "").trim()
  const excerpt = String(formData.get("excerpt") ?? "").trim()
  const imageUrl = String(formData.get("imageUrl") ?? "").trim() || null
  const postDate = String(formData.get("postDate") ?? "").trim()
  const readTime = String(formData.get("readTime") ?? "").trim()
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
  const url = String(formData.get("url") ?? "").trim()
  const displayOrder = Number(formData.get("displayOrder") ?? 0) || 0

  return { title, excerpt, imageUrl, postDate, readTime, tags, url, displayOrder }
}

function revalidateBlogPaths() {
  revalidatePath("/")
  revalidatePath("/admin/blog")
  revalidatePath("/admin")
}

export async function saveBlogPostAction(formData: FormData): Promise<BlogPostFormResult> {
  const id = String(formData.get("id") ?? "")
  const input = parseBlogPostForm(formData)

  if (!input.title || !input.excerpt || !input.url) {
    return { error: "Title, excerpt, and URL are required" }
  }

  try {
    if (id) {
      await updateBlogPost(id, input)
    } else {
      await createBlogPost(input)
    }
  } catch (error: any) {
    return { error: error?.message ?? "Something went wrong" }
  }

  revalidateBlogPaths()
  return {}
}

export async function deleteBlogPostAction(id: string) {
  await deleteBlogPost(id)
  revalidateBlogPaths()
}
