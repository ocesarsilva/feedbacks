"use client"

import {
  Command,
  Home,
  LifeBuoy,
  Paintbrush2,
  Send,
  Settings,
} from "lucide-react"
import type * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { Session } from "@/types"
import { useSelectedLayoutSegments } from "next/navigation"

import type { Site } from "@/db/schema"
import { env } from "@/env"
import { NavMain } from "./nav-main"
import { NavMarketing } from "./nav-marketing"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  session: Session
  site: Site
}

export function AppSidebar({ session, site, ...props }: AppSidebarProps) {
  const segments = useSelectedLayoutSegments()

  //   Pending
  //   Reviewing
  //   Planned
  //   In Progress
  //   Completed
  //   Closed

  const data = {
    navMain: [
      {
        title: "Início",
        url: "#",
        icon: Home,
        isActive: segments.length === 0,
      },
    ],
    navMarketing: [
      {
        title: "Marca",
        url: `/${site.id}/branding`,
        icon: Paintbrush2,
        isActive: segments.includes("branding"),
      },
      {
        title: "Configurações",
        url: `/${site.id}/settings`,
        icon: Settings,
        isActive: segments.includes("settings"),
      },
    ],
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
    ],
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a
                href={`http://${site.subdomain}.${env.NEXT_PUBLIC_ROOT_DOMAIN}`}
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{site.name}</span>
                  <span className="truncate text-xs">{site.subdomain}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavMarketing items={data.navMarketing} />

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser session={session} />
      </SidebarFooter>
    </Sidebar>
  )
}
