import { db } from "@/db"
import { env } from "@/env"
import { eq } from "drizzle-orm"
import { unstable_cache } from "next/cache"
import { sites } from "../db/schema"

export async function getSiteData(domain: string) {
  const subdomain = domain.endsWith(`.${env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null

  return await unstable_cache(
    async () => {
      return await db.query.sites.findFirst({
        where: subdomain
          ? eq(sites.subdomain, subdomain)
          : eq(sites.customDomain, domain),
        with: {
          user: true,
        },
      })
    },
    [`${domain}-metadata`],
    {
      revalidate: 900,
      tags: [`${domain}-metadata`],
    }
  )()
}
