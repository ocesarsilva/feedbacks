import { headers } from "next/headers"
import { redirect } from "next/navigation"
import React from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { db } from "@/db"

import { auth } from "@/lib/auth"

import { Onboarding } from "./_components/onboarding"

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    throw redirect("/login")
  }

  const workspace = await db.query.workspaces.findFirst({
    where: (table, { eq }) => eq(table.userId, session.user.id),
  })

  if (workspace) {
    throw redirect(`/${workspace.id}`)
  }

  return (
    <React.Suspense fallback={<Skeleton className="size-full" />}>
      <Onboarding />
    </React.Suspense>
  )
}
