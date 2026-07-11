import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getProjects } from "@/lib/data/projects"
import { getBlogPosts } from "@/lib/data/blog"
import { getUnreadContactCount } from "@/lib/data/contact"

export default async function AdminOverviewPage() {
  const [projects, posts, unreadCount] = await Promise.all([
    getProjects(),
    getBlogPosts(),
    getUnreadContactCount(),
  ])

  const stats = [
    { label: "Projects", value: projects.length },
    { label: "Blog Posts", value: posts.length },
    { label: "Unread Messages", value: unreadCount },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif">Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
