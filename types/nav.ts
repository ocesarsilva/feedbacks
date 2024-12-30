import type { LucideIcon } from "lucide-react"

import type { Icons } from "@/components/icons"

export type NavItemMain = {
  title: string
  action: () => void
  icon: keyof typeof Icons
  isActive?: boolean
}

export type NavItemSecondary = {
  title: string
  url: string
  icon: LucideIcon
}

export type NavItemWorkspace = {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
}
