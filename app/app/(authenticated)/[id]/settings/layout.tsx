import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { SettingsTabs } from "./_components/settings-tabs"

export default async function Page({
  params,
  children,
}: {
  params: Promise<{ id: string }>
  children: React.ReactNode
}) {
  const workspaceId = (await params).id
  console.log(workspaceId)

  return (
    <div className="mx-auto w-full max-w-screen-md px-3 lg:px-10 grid gap-5 pb-10 pt-6">
      <PageHeader>
        <PageHeaderHeading size="sm">Configurações</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Visualize e gerencie as configurações do seu espaço de trabalho.
        </PageHeaderDescription>
        <SettingsTabs workspaceId={workspaceId} />
      </PageHeader>
      {children}
    </div>
  )
}
