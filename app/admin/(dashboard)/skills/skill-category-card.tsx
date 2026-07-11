"use client"

import { useRef, useTransition } from "react"
import { X, Pencil } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button"
import { CategoryFormDialog } from "./category-form-dialog"
import { addSkillAction, deleteSkillAction, deleteCategoryAction } from "./actions"
import type { SkillCategory } from "@/lib/data/skills"

export function SkillCategoryCard({ category }: { category: SkillCategory }) {
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleAddSkill(formData: FormData) {
    const name = String(formData.get("name") ?? "")
    if (!name.trim()) return
    startTransition(async () => {
      await addSkillAction(category.id, name)
      formRef.current?.reset()
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">{category.title}</CardTitle>
        <div className="flex gap-1">
          <CategoryFormDialog
            category={category}
            trigger={
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit category</span>
              </Button>
            }
          />
          <ConfirmDeleteButton
            confirmMessage={`Delete category "${category.title}" and all its skills?`}
            onDelete={() => deleteCategoryAction(category.id)}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {category.skills.map((skill) => (
            <Badge key={skill.id} variant="secondary" className="gap-1 pr-1">
              {skill.name}
              <button
                type="button"
                onClick={() => startTransition(() => deleteSkillAction(skill.id))}
                className="rounded-full hover:bg-foreground/10 p-0.5"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {skill.name}</span>
              </button>
            </Badge>
          ))}
          {category.skills.length === 0 && (
            <p className="text-sm text-muted-foreground">No skills yet.</p>
          )}
        </div>

        <form ref={formRef} action={handleAddSkill} className="flex gap-2">
          <Input name="name" placeholder="Add a skill..." disabled={isPending} />
          <Button type="submit" size="sm" disabled={isPending}>
            Add
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
