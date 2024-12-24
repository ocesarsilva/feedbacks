import { env } from "@/env"
import { getPostsForSite } from "@/lib/fetchers"
import { headers } from "next/headers"

export default async function Sitemap() {
  const headersList = await headers()
  const domain =
    (await headersList)
      .get("host")
      ?.replace(".localhost:3000", `.${env.NEXT_PUBLIC_ROOT_DOMAIN}`) ??
    "vercel.pub"

  const posts = await getPostsForSite(domain)

  return [
    {
      url: `https://${domain}`,
      lastModified: new Date(),
    },
    ...posts.map(({ slug }) => ({
      url: `https://${domain}/${slug}`,
      lastModified: new Date(),
    })),
  ]
}
