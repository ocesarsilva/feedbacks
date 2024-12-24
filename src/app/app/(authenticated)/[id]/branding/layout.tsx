import type { Metadata } from "next"

import { Separator } from "@/components/ui/separator"
import { BrandingNav } from "./_components/branding-nav"

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
}

interface SettingsLayoutProps {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

export default async function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  const siteId = (await params).id

  const items = [
    {
      title: "Geral",
      href: `/${siteId}/branding`,
    },
    {
      title: "Domínio",
      href: `/${siteId}/branding/domain`,
    },
  ]

  return (
    <div className=" space-y-6 p-10 pt-7 pb-16 max-w-3xl mx-auto w-full">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Branding</h2>
        <p className="text-muted-foreground">
          Personalize a marca do seu projeto.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <BrandingNav items={items} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  )
}
