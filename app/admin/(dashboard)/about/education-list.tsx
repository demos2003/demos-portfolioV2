"use client"

import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button"
import { EducationFormDialog } from "./education-form-dialog"
import { deleteEducationAction } from "./actions"
import type { EducationEntry } from "@/lib/data/about"

export function EducationList({ entries }: { entries: EducationEntry[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Degree</TableHead>
          <TableHead>School</TableHead>
          <TableHead>Years</TableHead>
          <TableHead>Order</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">
              No education entries yet. The section is hidden on the site until you add one.
            </TableCell>
          </TableRow>
        )}
        {entries.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell className="font-medium">{entry.degree}</TableCell>
            <TableCell>{entry.school}</TableCell>
            <TableCell>{entry.years}</TableCell>
            <TableCell>{entry.displayOrder}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <EducationFormDialog
                  entry={entry}
                  trigger={
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  }
                />
                <ConfirmDeleteButton
                  confirmMessage={`Delete "${entry.degree}"?`}
                  onDelete={() => deleteEducationAction(entry.id)}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
