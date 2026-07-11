import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { getSkillCategories } from "@/lib/data/skills"
import { CategoryFormDialog } from "./category-form-dialog"
import { SkillCategoryCard } from "./skill-category-card"

export default async function AdminSkillsPage() {
  const categories = await getSkillCategories()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif">Skills</h1>
        <CategoryFormDialog
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <SkillCategoryCard key={category.id} category={category} />
        ))}
        {categories.length === 0 && (
          <p className="text-muted-foreground">No skill categories yet.</p>
        )}
      </div>
    </div>
  )
}
