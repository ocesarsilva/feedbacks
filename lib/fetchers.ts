import { and, desc, eq } from "drizzle-orm"
import { unstable_cache } from "next/cache"
import db from "./db"
import { posts, sites } from "./schema"

export async function getSiteData(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
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

export async function getPostsForSite(domain: string) {
  const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null

  return await unstable_cache(
    async () => {
      return await db
        .select({
          title: posts.title,
          description: posts.description,
          slug: posts.slug,
          image: posts.image,
          imageBlurhash: posts.imageBlurhash,
          createdAt: posts.createdAt,
        })
        .from(posts)
        .leftJoin(sites, eq(posts.siteId, sites.id))
        .where(
          and(
            eq(posts.published, true),
            subdomain
              ? eq(sites.subdomain, subdomain)
              : eq(sites.customDomain, domain)
          )
        )
        .orderBy(desc(posts.createdAt))
    },
    [`${domain}-posts`],
    {
      revalidate: 900,
      tags: [`${domain}-posts`],
    }
  )()
}
