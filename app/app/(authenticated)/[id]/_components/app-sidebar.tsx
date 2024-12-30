"use client"

import type { Session } from "@/types"
import { LifeBuoy, Paintbrush2, Send, Settings } from "lucide-react"
import { useRouter, useSelectedLayoutSegments } from "next/navigation"
import { useQueryState } from "nuqs"
import type * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { NavMain } from "@/app/app/(authenticated)/[id]/_components/nav-main"

import type { Workspace } from "@/db/schema"
import type {
  NavItemMain,
  NavItemSecondary,
  NavItemWorkspace,
} from "@/types/nav"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import { NavWorkspace } from "./nav-workspace"
import { WorkspaceSwitcher } from "./site-switcher"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  session: Session
  currentWorkspace: Workspace
  workspaces: Workspace[]
}

export function AppSidebar({
  session,
  currentWorkspace,
  workspaces,
  ...props
}: AppSidebarProps) {
  const router = useRouter()
  const segments = useSelectedLayoutSegments()
  const [status, setStatus] = useQueryState("status", {
    defaultValue: "all",
  })

  function mainNavAction(requestStatus: string) {
    if (segments.length === 0) {
      setStatus(requestStatus)
    } else {
      router.push(`/${currentWorkspace.id}/requests?status=${requestStatus}`)
    }
  }

  const requestStatus = {
    pending: "pending",
    reviewing: "reviewing",
    planned: "planned",
    progress: "progress",
    completed: "completed",
    closed: "closed",
  }

  const data = {
    navMain: [
      {
        title: "Pendentes",
        action: () => mainNavAction(requestStatus.pending),
        icon: "pending",
        isActive: status === requestStatus.pending,
      },
      {
        title: "Revisando",
        action: () => mainNavAction(requestStatus.reviewing),
        icon: "reviewing",
        isActive: status === requestStatus.reviewing,
      },
      {
        title: "Planejado",
        action: () => mainNavAction(requestStatus.planned),
        icon: "planned",
        isActive: status === requestStatus.planned,
      },
      {
        title: "Em andamento",
        action: () => mainNavAction(requestStatus.progress),
        icon: "progress",
        isActive: status === requestStatus.progress,
      },
      {
        title: "Completo",
        action: () => mainNavAction(requestStatus.completed),
        icon: "completed",
        isActive: status === requestStatus.completed,
      },
      {
        title: "Fechado",
        action: () => mainNavAction(requestStatus.closed),
        icon: "closed",
        isActive: status === requestStatus.closed,
      },
    ] satisfies NavItemMain[],
    navWorkspace: [
      {
        title: "Marca",
        url: `/${currentWorkspace.id}/branding`,
        icon: Paintbrush2,
        isActive: segments.includes("branding"),
      },
      {
        title: "Configurações",
        url: `/${currentWorkspace.id}/settings`,
        icon: Settings,
        isActive: segments.includes("settings"),
      },
    ] satisfies NavItemWorkspace[],
    navSecondary: [
      {
        title: "Suporte",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ] satisfies NavItemSecondary[],
  }

  return (
    <Sidebar collapsible="none" className="min-h-svh border-r" {...props}>
      <SidebarHeader>
        <WorkspaceSwitcher
          workspaces={workspaces}
          currentWorkspace={currentWorkspace}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavWorkspace items={data.navWorkspace} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser session={session} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
