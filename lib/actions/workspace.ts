"use server"

import { unstable_noStore as noStore, revalidateTag } from "next/cache"
import type { z } from "zod"

import { env } from "@/env"

import { db } from "@/db"
import { workspaces } from "@/db/schema"
import { getSession } from "@/lib/auth"
import { getErrorMessage } from "@/lib/handle-error"
import { generateId } from "@/lib/id"
import type { createWorkspaceSchema } from "@/lib/validations/workspace"

export async function createWorkspace(
  inputs: z.infer<typeof createWorkspaceSchema>,
) {
  noStore()
  const session = await getSession()

  if (!session?.user.id) {
    return {
      data: null,
      error: "Not authenticated",
    }
  }

  const { name, description, slug } = inputs

  const workspaceSubdomainWithSameSlug = await db.query.workspaces.findFirst({
    where: (table, { eq }) => eq(table.slug, slug!),
    columns: {
      id: true,
    },
  })

  if (workspaceSubdomainWithSameSlug) {
    throw new Error("Este slug já está sendo usado.")
  }

  try {
    const [response] = await db
      .insert(workspaces)
      .values({
        id: generateId("workspace"),
        name,
        description,
        slug,
        userId: session.user.id,
      })
      .returning()

    revalidateTag(`${slug}.${env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`)

    return {
      data: response,
      error: null,
    }
  } catch (error: unknown) {
    return {
      data: null,
      error: getErrorMessage(error),
    }
  }
}
