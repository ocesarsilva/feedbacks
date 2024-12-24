import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
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
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
