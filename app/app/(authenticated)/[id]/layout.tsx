import type { Session } from "@/types"
import { notFound } from "next/navigation"

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { db } from "@/db"

import { AppSidebar } from "@/app/app/(authenticated)/[id]/_components/app-sidebar"
import { getSession } from "@/lib/auth"

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const session = (await getSession()) as Session

  if (!session?.user) {
    return null
  }

  const workspaceId = (await params).id

  const [workspaces, currentWorkspace] = await Promise.all([
    db.query.workspaces.findMany({
      where: (table, { eq }) => eq(table.userId, session.user.id),
    }),
    db.query.workspaces.findFirst({
      where: (table, { eq }) => eq(table.id, workspaceId),
    }),
  ])

  if (!currentWorkspace) {
    notFound()
  }

  return (
    <SidebarProvider>
      <AppSidebar
        session={session}
        currentWorkspace={currentWorkspace}
        workspaces={workspaces}
      />
      <SidebarInset className="bg-sidebar">{children}</SidebarInset>
    </SidebarProvider>
  )
}
