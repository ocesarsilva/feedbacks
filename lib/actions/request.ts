"use server"

import { unstable_noStore as noStore, revalidateTag } from "next/cache"
import type { z } from "zod"

import { env } from "@/env"

import { db } from "@/db"
import { requests, workspaces } from "@/db/schema"
import { getSession } from "@/lib/auth"
import { getErrorMessage } from "@/lib/handle-error"
import { generateId } from "@/lib/id"
import type { createRequestSchema } from "@/lib/validations/request"

export async function createRequest(
  inputs: z.infer<typeof createRequestSchema> & { workspaceId: string },
) {
  noStore()
  const session = await getSession()

  if (!session?.user.id) {
    return {
      data: null,
      error: "Not authenticated",
    }
  }

  const { title, description, workspaceId } = inputs

  try {
    const [response] = await db
      .insert(requests)
      .values({
        id: generateId("request"),
        title,
        description,
        authorId: session.user.id,
        workspaceId,
      })
      .returning()

    console.log(session.user.id)

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
