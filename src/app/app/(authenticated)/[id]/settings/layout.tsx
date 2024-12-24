import type { Metadata } from "next"

import { Separator } from "@/components/ui/separator"
import { SettingsNav } from "./_components/settings-nav"

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
      href: `/${siteId}/settings`,
    },
    {
      title: "Api",
      href: `/${siteId}/settings/api`,
    },
  ]

  return (
    <div className="space-y-6 p-10 pt-7 pb-16 mx-auto w-full">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Visualize e gerencie as configurações do seu espaço de trabalho.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SettingsNav items={items} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  )
}
