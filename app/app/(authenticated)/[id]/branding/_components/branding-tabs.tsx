"use client"

import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import Link from "next/link"
import { useRouter, useSelectedLayoutSegment } from "next/navigation"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface BrandingTabsProps {
  workspaceId: string
}

export function BrandingTabs({ workspaceId }: BrandingTabsProps) {
  const router = useRouter()
  const segment = useSelectedLayoutSegment()

  const tabs = [
    {
      title: "Geral",
      href: `/${workspaceId}/branding`,
      isActive: segment === null,
    },
    {
      title: "Domínio",
      href: `/${workspaceId}/branding/domain`,
      isActive: segment === "domain",
    },
  ]

  return (
    <Tabs
      defaultValue={tabs.find((tab) => tab.isActive)?.href ?? tabs[0]?.href}
      className="sticky top-0 z-30 size-full overflow-auto px-1 mt-6"
      onValueChange={(value) => router.push(value)}
    >
      <ScrollArea
        orientation="horizontal"
        className="pb-2"
        scrollBarClassName="h-2"
      >
        <TabsList className="inline-flex items-center justify-center space-x-1.5 text-muted-foreground">
          {tabs.map((tab) => (
            <div
              key={tab.href}
              className={cn(
                "border-b-2 border-transparent py-1.5",
                tab.isActive && "border-foreground",
              )}
            >
              <TabsTrigger
                value={tab.href}
                className={cn(
                  "inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium text-muted-foreground ring-offset-background transition-all hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  tab.isActive && "text-foreground",
                )}
                asChild
              >
                <Link href={tab.href}>{tab.title}</Link>
              </TabsTrigger>
            </div>
          ))}
        </TabsList>
        <Separator />
      </ScrollArea>
    </Tabs>
  )
}
