import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil } from "lucide-react"
import { getProjects } from "@/lib/data/projects"
import { ProjectFormDialog } from "./project-form-dialog"
import { ProjectDeleteButton } from "./project-delete-button"

export default async function AdminProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif">Projects</h1>
        <ProjectFormDialog
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Project
            </Button>
          }
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Technologies</TableHead>
            <TableHead>Live URL</TableHead>
            <TableHead>Order</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No projects yet.
              </TableCell>
            </TableRow>
          )}
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.title}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="max-w-[200px] truncate">{project.liveUrl}</TableCell>
              <TableCell>{project.displayOrder}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <ProjectFormDialog
                    project={project}
                    trigger={
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    }
                  />
                  <ProjectDeleteButton id={project.id} title={project.title} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
