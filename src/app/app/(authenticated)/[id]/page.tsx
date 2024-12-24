import { db } from "@/db"
import { notFound } from "next/navigation"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const siteId = (await params).id

  const site = await db.query.sites.findFirst({
    where: (table, { eq }) => eq(table.id, siteId),
  })

  if (!site) {
    notFound()
  }

  return <div>{site.name}</div>
}
