import CTA from "@/components/cta"
import ReportAbuse from "@/components/report-abuse"
import { env } from "@/env"
import { getSiteData } from "@/lib/fetchers"

import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"

export async function generateMetadata(props: {
  params: Promise<{ domain: string }>
}): Promise<Metadata | null> {
  const params = await props.params
  const domain = decodeURIComponent(params.domain)
  const data = await getSiteData(domain)

  if (!data) {
    return null
  }

  const {
    name: title,
    description,
    image,
    logo,
  } = data as {
    name: string
    description: string
    image: string
    logo: string
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@vercel",
    },
    icons: [logo],
    metadataBase: new URL(`https://${domain}`),
  }
}

export default async function SiteLayout(props: {
  params: Promise<{ domain: string }>
  children: ReactNode
}) {
  const params = await props.params

  const { children } = props

  const domain = decodeURIComponent(params.domain)
  const data = await getSiteData(domain)

  if (!data) {
    notFound()
  }

  return (
    <div>
      <div className="ease left-0 right-0 top-0 z-30 flex h-16 bg-white transition-all duration-150 dark:bg-black dark:text-white">
        <div className="mx-auto flex h-full max-w-screen-xl items-center justify-center space-x-5 px-10 sm:px-20">
          <Link href="/" className="flex items-center justify-center">
            <div className="inline-block h-8 w-8 overflow-hidden rounded-full align-middle">
              <Image
                alt={data.name || ""}
                height={40}
                src={data.logo || ""}
                width={40}
              />
            </div>
            <span className="ml-3 inline-block truncate font-title font-medium">
              {data.name}
            </span>
          </Link>
        </div>
      </div>

      <div className="mt-20">{children}</div>

      {domain === `demo.${env.NEXT_PUBLIC_ROOT_DOMAIN}` ||
      domain === "platformize.co" ? (
        <CTA />
      ) : (
        <ReportAbuse />
      )}
    </div>
  )
}
