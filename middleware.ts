import { betterFetch } from "@better-fetch/fetch"
import type { Session } from "better-auth/types"
import { type NextRequest, NextResponse } from "next/server"

import { env } from "@/env"

const authRoutes = ["/login", "/register", "/forgot-password"]

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl
  const hostname = req.headers
    .get("host")!
    .replace(".localhost:3000", `.${env.NEXT_PUBLIC_ROOT_DOMAIN}`)
  const searchParams = req.nextUrl.searchParams.toString()
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`

  if (hostname === `app.${env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    const { data: session } = await betterFetch<Session>(
      "/api/auth/get-session",
      {
        baseURL: req.nextUrl.origin,
        headers: {
          cookie: req.headers.get("cookie") || "",
        },
      },
    )

    if (!session && !authRoutes.includes(path)) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    if (session && authRoutes.includes(path)) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    return NextResponse.rewrite(
      new URL(`/app${path === "/" ? "" : path}`, req.url),
    )
  }

  if (
    hostname === "localhost:3000" ||
    hostname === env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    return NextResponse.rewrite(
      new URL(`/marketing${path === "/" ? "" : path}`, req.url),
    )
  }

  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url))
}

export const config = {
  matcher: ["/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)"],
}
