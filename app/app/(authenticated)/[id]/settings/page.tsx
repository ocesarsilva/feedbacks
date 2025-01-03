import { PageHeader, PageHeaderHeading } from "@/components/page-header"
import { SettingsTabs } from "./_components/settings-tabs"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const workspaceId = (await params).id

  return (
    <div className="mx-auto w-full max-w-screen-md px-3 lg:px-10 grid gap-5 pb-10 pt-3">
      {workspaceId}
    </div>
  )
}
