import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { db } from "@/db"
import { getSession } from "@/lib/auth"
import type { Session } from "@/types"
import { notFound } from "next/navigation"
import { AppSidebar } from "./_components/app-sidebar"

export default async function Layout({
  children,
  params,
}: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  const session = (await getSession()) as Session

  if (!session?.user) {
    return null
  }

  const siteId = (await params).id

  const site = await db.query.sites.findFirst({
    where: (table, { eq }) => eq(table.id, siteId),
  })

  if (!site) {
    notFound()
  }

  return (
    <SidebarProvider>
      <AppSidebar session={session} site={site} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
