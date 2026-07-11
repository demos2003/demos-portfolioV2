"use client"

import { LogOut } from "lucide-react"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { logout } from "@/app/admin/actions"

export function LogoutButton() {
  return (
    <form action={logout}>
      <SidebarMenuButton type="submit">
        <LogOut />
        <span>Log out</span>
      </SidebarMenuButton>
    </form>
  )
}
