import { z } from "zod"
import { slugify } from "../utils"

export const createSiteSchema = z
  .object({
    name: z
      .string()
      .min(3, "O nome deve conter pelo menos 3 caracteres")
      .max(50),
    description: z.string().optional(),
    subdomain: z
      .string()
      .min(3, "O Sub domínio deve conter pelo menos 3 caracteres")
      .optional(),
  })
  .refine((data) => {
    if (!data.subdomain) {
      data.subdomain = slugify(data.name)
    }
    return true
  })

export const updateSiteSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().optional(),
})
