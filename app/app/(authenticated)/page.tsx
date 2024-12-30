import { redirect } from "next/navigation"

import { db } from "@/db"

import { getSession } from "@/lib/auth"
import { redirects } from "@/lib/constants"

export default async function Redirects() {
  const session = await getSession()

  if (!session?.user) {
    throw redirect(redirects.toLogin)
  }

  const sites = await db.query.workspaces.findMany({
    where: (table, { eq }) => eq(table.userId, session.user.id),
  })

  if (!sites.length) {
    throw redirect(redirects.toOnboarding)
  }

  return redirect(`/${sites[0]!.id}`)
}
