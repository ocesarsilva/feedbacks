"use server"

import { env } from "@/env"
import { getSession } from "@/lib/auth"
import {
  addDomainToVercel,
  removeDomainFromVercelProject,
  validDomainRegex,
} from "@/lib/domains"

import { eq } from "drizzle-orm"

import { revalidateTag } from "next/cache"
import { withSiteAuth } from "./auth"

import { db } from "@/db"
import { type Site, sites, users } from "../db/schema"

export const createSite = async (formData: FormData) => {
  const session = await getSession()
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    }
  }

  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const subdomain = formData.get("subdomain") as string

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

    return response
  } catch (error: any) {
    if (error.code === "P2002") {
      return {
        error: "This subdomain is already taken",
      }
    }
    return {
      error: error.message,
    }
  }
}

export const updateSite = withSiteAuth(
  async (formData: FormData, site: Site, key: string) => {
    const value = formData.get(key) as string

    try {
      // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
      let response

      if (key === "customDomain") {
        if (value.includes("vercel.pub")) {
          return {
            error: "Cannot use vercel.pub subdomain as your custom domain",
          }

          // if the custom domain is valid, we need to add it to Vercel
        }
        if (validDomainRegex.test(value)) {
          response = await db
            .update(sites)
            .set({
              customDomain: value,
            })
            .where(eq(sites.id, site.id))
            .returning()
            .then((res) => res[0])

          await Promise.all([
            addDomainToVercel(value),
            // Optional: add www subdomain as well and redirect to apex domain
            // addDomainToVercel(`www.${value}`),
          ])

          // empty value means the user wants to remove the custom domain
        } else if (value === "") {
          response = await db
            .update(sites)
            .set({
              customDomain: null,
            })
            .where(eq(sites.id, site.id))
            .returning()
            .then((res) => res[0])
        }

        // if the site had a different customDomain before, we need to remove it from Vercel
        if (site.customDomain && site.customDomain !== value) {
          response = await removeDomainFromVercelProject(site.customDomain)

          /* Optional: remove domain from Vercel team 

          // first, we need to check if the apex domain is being used by other sites
          const apexDomain = getApexDomain(`https://${site.customDomain}`);
          const domainCount = await db.select({ count: count() }).from(sites).where(or(eq(sites.customDomain, apexDomain), ilike(sites.customDomain, `%.${apexDomain}`))).then((res) => res[0].count);


          // if the apex domain is being used by other sites
          // we should only remove it from our Vercel project
          if (domainCount >= 1) {
            await removeDomainFromVercelProject(site.customDomain);
          } else {
            // this is the only site using this apex domain
            // so we can remove it entirely from our Vercel team
            await removeDomainFromVercelTeam(
              site.customDomain
            );
          }
          
          */
        }
      } else if (key === "image" || key === "logo") {
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
          return {
            error:
              "Missing BLOB_READ_WRITE_TOKEN token. Note: Vercel Blob is currently in beta – please fill out this form for access: https://tally.so/r/nPDMNd",
          }
        }
      } else {
        response = await db
          .update(sites)
          .set({
            [key]: value,
          })
          .where(eq(sites.id, site.id))
          .returning()
          .then((res) => res[0])
      }

      console.log(
        "Updated site data! Revalidating tags: ",
        `${site.subdomain}.${env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`,
        `${site.customDomain}-metadata`
      )
      revalidateTag(`${site.subdomain}.${env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`)
      site.customDomain && revalidateTag(`${site.customDomain}-metadata`)

      return response
    } catch (error: any) {
      if (error.code === "P2002") {
        return {
          error: `This ${key} is already taken`,
        }
      }
      return {
        error: error.message,
      }
    }
  }
)

export const deleteSite = withSiteAuth(async (_: FormData, site: Site) => {
  try {
    const [response] = await db
      .delete(sites)
      .where(eq(sites.id, site.id))
      .returning()

    revalidateTag(`${site.subdomain}.${env.NEXT_PUBLIC_ROOT_DOMAIN}-metadata`)
    response.customDomain && revalidateTag(`${site.customDomain}-metadata`)
    return response
  } catch (error: any) {
    return {
      error: error.message,
    }
  }
})

export const editUser = async (
  formData: FormData,
  _id: unknown,
  key: string
) => {
  const session = await getSession()
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    }
  }
  const value = formData.get(key) as string

  try {
    const [response] = await db
      .update(users)
      .set({
        [key]: value,
      })
      .where(eq(users.id, session.user.id))
      .returning()

    return response
  } catch (error: any) {
    if (error.code === "P2002") {
      return {
        error: `This ${key} is already in use`,
      }
    }
    return {
      error: error.message,
    }
  }
}
