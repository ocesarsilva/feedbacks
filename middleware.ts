import { betterFetch } from "@better-fetch/fetch"
import type { Session } from "better-auth/types"
import { type NextRequest, NextResponse } from "next/server"

const authRoutes = ["/login", "/register", "/forgot-password"]

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  let hostname = req.headers
    .get("host")!
    .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)

  // special case for Vercel preview deployment URLs
  if (
    hostname.includes("---") &&
    hostname.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
  ) {
    hostname = `${hostname.split("---")[0]}.${
      process.env.NEXT_PUBLIC_ROOT_DOMAIN
    }`
  }

  const searchParams = req.nextUrl.searchParams.toString()
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`

  if (hostname === `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    const { data: session } = await betterFetch<Session>(
      "/api/auth/get-session",
      {
        baseURL: req.nextUrl.origin,
        headers: {
          // Pega o cookie do request
          cookie: req.headers.get("cookie") || "",
        },
      }
    )

    // Redireciona para /login caso não haja sessão e o path não esteja nos loginPaths
    if (!session && !authRoutes.includes(path)) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Redireciona para a home se já estiver autenticado e o path estiver nos loginPaths
    if (session && authRoutes.includes(path)) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    // Faz o rewrite para as páginas do app
    return NextResponse.rewrite(
      new URL(`/app${path === "/" ? "" : path}`, req.url)
    )
  }

  // special case for `vercel.pub` domain
  if (hostname === "vercel.pub") {
    return NextResponse.redirect(
      "https://vercel.com/blog/platforms-starter-kit"
    )
  }

  // rewrite root application to `/home` folder
  if (
    hostname === "localhost:3000" ||
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    return NextResponse.rewrite(
      new URL(`/home${path === "/" ? "" : path}`, req.url)
    )
  }

  // rewrite everything else to `/[domain]/[slug] dynamic route
  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url))
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
}
