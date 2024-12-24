import { betterAuth } from "better-auth"

import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { headers } from "next/headers"
import db from "./db"

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
  plugins: [nextCookies()],
  trustedOrigins: ["http://app.localhost:3000"],
})

export async function getSession() {
  const session = await auth.api.getSession({
    headers: headers(),
  })

  return session
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

export function withPostAuth(action: any) {
  return async (
    formData: FormData | null,
    postId: string,
    key: string | null
  ) => {
    const session = await getSession()
    if (!session?.user.id) {
      return {
        error: "Not authenticated",
      }
    }

    const post = await db.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, postId),
      with: {
        site: true,
      },
    })

    if (!post || post.userId !== session.user.id) {
      return {
        error: "Post not found",
      }
    }

    return action(formData, post, key)
  }
}
