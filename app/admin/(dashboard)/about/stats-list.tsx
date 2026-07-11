"use client"

import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button"
import { StatFormDialog } from "./stat-form-dialog"
import { deleteStatAction } from "./actions"
import type { AboutStat } from "@/lib/data/about"

export function StatsList({ stats }: { stats: AboutStat[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Value</TableHead>
          <TableHead>Label</TableHead>
          <TableHead>Order</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stats.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground">
              No stats yet.
            </TableCell>
          </TableRow>
        )}
        {stats.map((stat) => (
          <TableRow key={stat.id}>
            <TableCell className="font-medium">{stat.value}</TableCell>
            <TableCell>{stat.label}</TableCell>
            <TableCell>{stat.displayOrder}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <StatFormDialog
                  stat={stat}
                  trigger={
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  }
                />
                <ConfirmDeleteButton
                  confirmMessage={`Delete stat "${stat.label}"?`}
                  onDelete={() => deleteStatAction(stat.id)}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
