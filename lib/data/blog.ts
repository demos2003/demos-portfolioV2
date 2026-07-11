import { getSupabaseServerClient } from "@/lib/supabase/server"

export type BlogPost = {
  id: string
  title: string
  excerpt: string
  imageUrl: string | null
  postDate: string
  readTime: string
  tags: string[]
  url: string
  displayOrder: number
}

export type BlogPostInput = {
  title: string
  excerpt: string
  imageUrl: string | null
  postDate: string
  readTime: string
  tags: string[]
  url: string
  displayOrder: number
}

function mapRow(row: any): BlogPost {
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    imageUrl: row.image_url,
    postDate: row.post_date,
    readTime: row.read_time,
    tags: row.tags ?? [],
    url: row.url,
    displayOrder: row.display_order,
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("display_order", { ascending: true })

  if (error) throw error
  return (data ?? []).map(mapRow)
}

export async function createBlogPost(input: BlogPostInput) {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase.from("blog_posts").insert({
    title: input.title,
    excerpt: input.excerpt,
    image_url: input.imageUrl,
    post_date: input.postDate,
    read_time: input.readTime,
    tags: input.tags,
    url: input.url,
    display_order: input.displayOrder,
  })
  if (error) throw error
}

export async function updateBlogPost(id: string, input: BlogPostInput) {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase
    .from("blog_posts")
    .update({
      title: input.title,
      excerpt: input.excerpt,
      image_url: input.imageUrl,
      post_date: input.postDate,
      read_time: input.readTime,
      tags: input.tags,
      url: input.url,
      display_order: input.displayOrder,
    })
    .eq("id", id)
  if (error) throw error
}

export async function deleteBlogPost(id: string) {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase.from("blog_posts").delete().eq("id", id)
  if (error) throw error
}
