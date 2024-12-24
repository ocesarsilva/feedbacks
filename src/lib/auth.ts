import { db } from "@/db"
import type { Session } from "@/types"
import { betterAuth } from "better-auth"

import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { headers } from "next/headers"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      console.log(
        "Sending reset password email to",
        user.email,
        "with url",
        url
      )
    },
  },
  plugins: [nextCookies()],
  trustedOrigins: ["http://app.localhost:3000"],
})

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return session as Session
}

export function withSiteAuth(action: any) {
  return async (
    formData: FormData | null,
    siteId: string,
    key: string | null
  ) => {
    const session = await getSession()
    if (!session) {
      return {
        error: "Not authenticated",
      }
    }

    const site = await db.query.sites.findFirst({
      where: (sites, { eq }) => eq(sites.id, siteId),
    })

    if (!site || site.userId !== session.user.id) {
      return {
        error: "Not authorized",
      }
    }

    return action(formData, site, key)
  }
}
