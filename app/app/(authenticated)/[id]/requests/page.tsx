import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { db } from "@/db"
import { CreateRequestButton } from "./_components/create-request-button"

import { Icons } from "@/components/icons"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AvatarFallback } from "@radix-ui/react-avatar"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const workspaceId = (await params).id

  const requests = await db.query.requests.findMany({
    where: (table, { eq }) => eq(table.workspaceId, workspaceId),
    with: {
      author: true,
      workspace: true,
    },
  })

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 mx-auto max-w-3xl w-full">
      <PageHeader>
        <PageHeaderHeading size="sm">Solicitações</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Visualize, crie e gerencie suas solicitações.
        </PageHeaderDescription>
      </PageHeader>
      <div className="w-full flex flex-row justify-between items-center">
        <div className="flex flex-row items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-full rounded border border-dashed"
          >
            Status
          </Button>
        </div>
        <CreateRequestButton workspaceId={workspaceId} />
      </div>
      <Separator />
      <div className="flex flex-col gap-4">
        {requests.map((request) => {
          console.log(request)
          const Icon = Icons[request.status]
          return (
            <Card
              key={request.id}
              className="h-full rounded-lg transition-colors hover:bg-muted/25 flex flex-row justify-between items-center p-3 px-4"
            >
              <CardHeader className="flex flex-row items-center gap-4 p-0">
                <Icon className="size-4" />
                <div className="flex flex-col gap-1">
                  <CardTitle className="capitalize">{request.title}</CardTitle>
                  <CardDescription className="line-clamp-3 text-balance">
                    {request.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-2 p-0">
                <Avatar className="size-7 rounded-full ">
                  <AvatarImage
                    src={request.author?.image ?? ""}
                    alt={`${request.author?.name} avatar`}
                  />
                  <AvatarFallback className="rounded-full">CN</AvatarFallback>
                </Avatar>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
