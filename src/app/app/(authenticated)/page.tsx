import { db } from "@/db"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Page() {
  const session = await getSession()

  if (!session?.user) {
    throw redirect("/login")
  }

  const sites = await db.query.sites.findMany({
    where: (table, { eq }) => eq(table.userId, session.user.id),
  })

  if (!sites.length) {
    throw redirect("/onboarding")
  }

  if (!sites) {
    throw redirect("/onboarding")
  }

  return redirect(`/${sites[0].id}`)
}
