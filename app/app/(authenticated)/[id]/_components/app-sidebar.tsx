"use client"

import type { Session } from "@/types"
import { LifeBuoy, Paintbrush2, Send, Settings } from "lucide-react"
import { useSelectedLayoutSegments } from "next/navigation"
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
  const segments = useSelectedLayoutSegments()
  const [request, setRequest] = useQueryState("requests")

  const data = {
    navMain: [
      {
        title: "Pendentes",
        action: () => setRequest("pending"),
        icon: "pending",
        isActive: request === "pending",
      },
      {
        title: "Revisando",
        action: () => setRequest("reviewing"),
        icon: "reviewing",
        isActive: request === "reviewing",
      },
      {
        title: "Planejado",
        action: () => setRequest("planned"),
        icon: "planned",
        isActive: request === "planned",
      },
      {
        title: "Em andamento",
        action: () => setRequest("progress"),
        icon: "progress",
        isActive: request === "progress",
      },
      {
        title: "Completo",
        action: () => setRequest("completed"),
        icon: "completed",
        isActive: request === "completed",
      },
      {
        title: "Fechado",
        action: () => setRequest("closed"),
        icon: "closed",
        isActive: request === "closed",
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
    <Sidebar collapsible="none" className="min-h-svh" {...props}>
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
