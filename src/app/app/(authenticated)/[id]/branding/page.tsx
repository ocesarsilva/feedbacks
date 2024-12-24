import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { db } from "@/db"

import { UpdateSiteForm } from "../branding/_components/update-site-form"

import { notFound } from "next/navigation"

export default async function Page({
  params,
}: { params: Promise<{ id: string }> }) {
  const siteId = (await params).id

  const site = await db.query.sites.findFirst({
    where: (table, { eq }) => eq(table.id, siteId),
  })

  if (!site) {
    notFound()
  }

  return (
    <div className="p-5">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Atualize seu site</CardTitle>
          <CardDescription>
            Atualize o nome e a descrição do seu site ou exclua-o
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UpdateSiteForm site={site} />
        </CardContent>
      </Card>
    </div>
  )
}
