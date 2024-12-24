import { env } from "@/env"

import { headers } from "next/headers"

export default async function Sitemap() {
  const headersList = await headers()
  const domain =
    headersList
      .get("host")
      ?.replace(".localhost:3000", `.${env.NEXT_PUBLIC_ROOT_DOMAIN}`) ??
    "vercel.pub"

  return [
    {
      url: `https://${domain}`,
      lastModified: new Date(),
    },
  ]
}
