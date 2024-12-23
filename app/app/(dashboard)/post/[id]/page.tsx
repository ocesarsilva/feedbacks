import Editor from "@/components/editor"
import { auth } from "@/lib/auth"
import db from "@/lib/db"
import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"

export default async function PostPage({ params }: { params: { id: string } }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  const data = await db.query.posts.findFirst({
    where: (posts, { eq }) => eq(posts.id, decodeURIComponent(params.id)),
    with: {
      site: {
        columns: {
          subdomain: true,
        },
      },
    },
  })
  if (!data || data.userId !== session.user.id) {
    notFound()
  }

  return <Editor post={data} />
}
