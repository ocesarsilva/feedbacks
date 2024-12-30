import { PageHeader, PageHeaderHeading } from "@/components/page-header"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const workspaceId = (await params).id
  console.log(workspaceId)

  return (
    <div className="mx-auto w-full max-w-screen-xl px-3 lg:px-10 grid gap-5 pb-10 pt-3">
      {workspaceId}
    </div>
  )
}
