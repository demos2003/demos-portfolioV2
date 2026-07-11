import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil } from "lucide-react"
import { getBlogPosts } from "@/lib/data/blog"
import { PostFormDialog } from "./post-form-dialog"
import { PostDeleteButton } from "./post-delete-button"

export default async function AdminBlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif">Blog Posts</h1>
        <PostFormDialog
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Post
            </Button>
          }
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Order</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No blog posts yet.
              </TableCell>
            </TableRow>
          )}
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium max-w-[300px] truncate">{post.title}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>{post.postDate}</TableCell>
              <TableCell>{post.displayOrder}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <PostFormDialog
                    post={post}
                    trigger={
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    }
                  />
                  <PostDeleteButton id={post.id} title={post.title} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
