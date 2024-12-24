"use server"

import { unstable_noStore as noStore, revalidateTag } from "next/cache"

import { db } from "@/db"
import { sites } from "@/db/schema"
import { env } from "@/env"
import { getSession } from "../auth"

import type { z } from "zod"
import { getErrorMessage } from "../handle-error"
import type { createSiteSchema } from "../validations/site"

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
