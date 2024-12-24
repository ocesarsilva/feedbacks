import { db } from "@/db"
import { env } from "@/env"
import { getSiteData } from "@/lib/fetchers"

import Image from "next/image"

import { notFound } from "next/navigation"

export async function generateStaticParams() {
  const allSites = await db.query.sites.findMany({
    // feel free to remove this filter if you want to generate paths for all sites
    where: (sites, { eq }) => eq(sites.subdomain, "demo"),
    columns: {
      subdomain: true,
      customDomain: true,
    },
  })

  const allPaths = allSites
    .flatMap(({ subdomain, customDomain }) => [
      subdomain && {
        domain: `${subdomain}.${env.NEXT_PUBLIC_ROOT_DOMAIN}`,
      },
      customDomain && {
        domain: customDomain,
      },
    ])
    .filter(Boolean)

  return allPaths
}

export default async function SiteHomePage(props: {
  params: Promise<{ domain: string }>
}) {
  const params = await props.params
  const domain = decodeURIComponent(params.domain)
  const [data] = await Promise.all([getSiteData(domain)])

  if (!data) {
    notFound()
  }

  return (
    <>
      <div className="mb-20 w-full">
        <div className="flex flex-col items-center justify-center py-20">
          <Image
            alt="missing post"
            src="https://illustrations.popsy.co/gray/success.svg"
            width={400}
            height={400}
            className="dark:hidden"
          />
          <Image
            alt="missing post"
            src="https://illustrations.popsy.co/white/success.svg"
            width={400}
            height={400}
            className="hidden dark:block"
          />
          <p className="font-title text-2xl text-stone-600 dark:text-stone-400">
            {data.name}
          </p>
        </div>
      </div>
    </>
  )
}
