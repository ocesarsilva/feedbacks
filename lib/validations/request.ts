import { z } from "zod"

export const createRequestSchema = z.object({
  title: z
    .string()
    .min(3, "O titulo deve conter pelo menos 3 caracteres")
    .max(50),
  description: z.string(),
})
