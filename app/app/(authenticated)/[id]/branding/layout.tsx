import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { BrandingTabs } from "./_components/branding-tabs"

export default async function Page({
  params,
  children,
}: {
  params: Promise<{ id: string }>
  children: React.ReactNode
}) {
  const workspaceId = (await params).id

  return (
    <div className="mx-auto w-full max-w-screen-md px-3 lg:px-10 grid gap-5 pb-10 pt-6">
      <PageHeader>
        <PageHeaderHeading size="sm">Marca</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Personalize a marca do seu projeto.
        </PageHeaderDescription>

        <BrandingTabs workspaceId={workspaceId} />
      </PageHeader>
      {children}
    </div>
  )
}
