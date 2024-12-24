import Editor from "@/components/editor"
import { db } from "@/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"

export default async function PostPage(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params

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
