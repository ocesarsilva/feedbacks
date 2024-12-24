"use server"

import {
  unstable_noStore as noStore,
  revalidatePath,
  revalidateTag,
} from "next/cache"

import { db } from "@/db"
import { sites } from "@/db/schema"
import { env } from "@/env"
import { getSession } from "../auth"

import { eq } from "drizzle-orm"
import type { z } from "zod"
import { getErrorMessage } from "../handle-error"
import type { createSiteSchema, updateSiteSchema } from "../validations/site"

export async function createSite(inputs: z.infer<typeof createSiteSchema>) {
  noStore()
  const session = await getSession()

  if (!session?.user.id) {
    return {
      data: null,
      error: "Not authenticated",
    }
  }

  const { name, description, subdomain } = inputs

  const siteSubdomainWithSameSlug = await db.query.sites.findFirst({
    where: (table, { eq }) => eq(table.subdomain, subdomain!),
    columns: {
      id: true,
    },
  })

  if (siteSubdomainWithSameSlug) {
    throw new Error("Este sub domínio já está sendo usado.")
  }

  try {
    const [response] = await db
      .insert(sites)
      .values({
        name,
        description,
        subdomain,
        userId: session.user.id,
      })
      .returning()

    revalidateTag(`${subdomain}.${env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`)

    return {
      data: response,
      error: null,
    }
  } catch (error: any) {
    return {
      data: null,
      error: getErrorMessage(error),
    }
  }
}

export async function updateSite(
  inputs: z.infer<typeof updateSiteSchema> & {
    siteId: string
  }
) {
  noStore()
  try {
    const { name, description, siteId } = inputs

    await db
      .update(sites)
      .set({
        name: name,
        description: description,
      })
      .where(eq(sites.id, siteId))

    revalidatePath(`/${siteId}/settings`)

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}
