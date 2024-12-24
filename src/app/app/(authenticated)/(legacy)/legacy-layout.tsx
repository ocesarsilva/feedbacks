import Nav from "@/components/nav"
import Profile from "@/components/profile"
import { db } from "@/db"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { type ReactNode, Suspense } from "react"

export default async function DashboardLayout({
  children,
}: { children: ReactNode }) {
  const session = await getSession()

  if (!session?.user) {
    throw redirect("/login")
  }

  const sites = await db.query.sites.findMany({
    where: (table, { eq }) => eq(table.userId, session.user.id),
  })

  if (!sites) {
    throw redirect("/onboarding")
  }

  if (!sites) {
    throw redirect("/onboarding")
  }

  return (
    <div>
      <Nav>
        <Suspense fallback={<div>Loading...</div>}>
          <Profile />
        </Suspense>
      </Nav>
      <div className="min-h-screen sm:pl-60 dark:bg-black">{children}</div>
    </div>
  )
}
