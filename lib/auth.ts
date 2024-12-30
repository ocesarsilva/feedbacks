import type { Session } from "@/types"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { headers } from "next/headers"

import { db } from "@/db"
import { env } from "@/env"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      console.log(
        "Sending reset password email to",
        user.email,
        "with url",
        url,
      )
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  plugins: [nextCookies()],
  trustedOrigins: [env.NEXT_PUBLIC_APP_URL],
})

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return session as Session
}
