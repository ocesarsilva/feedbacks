import { customAlphabet } from "nanoid"

const prefixes = {
  site: "site",
}

interface GenerateIdOptions {
  length?: number
  separator?: string
}

export function generateId(
  prefix?: keyof typeof prefixes,
  { length = 12, separator = "_" }: GenerateIdOptions = {}
) {
  const id = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    length
  )()
  return prefix ? `${prefixes[prefix]}${separator}${id}` : id
}
