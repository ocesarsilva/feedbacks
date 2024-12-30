import { notFound } from "next/navigation"

import { db } from "@/db"
import { env } from "@/env"

export default async function Page({
  params,
}: {
  params: Promise<{ domain: string }>
}) {
  const domain = decodeURIComponent((await params).domain)

  const subdomain = domain.endsWith(`.${env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null

  if (!subdomain) {
    throw notFound()
  }

  const data = await db.query.workspaces.findFirst({
    where: (table, { eq }) => eq(table.slug, subdomain),
    with: {
      user: true,
    },
  })

  if (!data) {
    throw notFound()
  }

  return <div>{data.slug}</div>
}
