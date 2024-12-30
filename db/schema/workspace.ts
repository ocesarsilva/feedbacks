import { relations } from "drizzle-orm"
import { pgTable, text } from "drizzle-orm/pg-core"

import { lifecycleDates } from "../utils"
import { users } from "./auth"

export const workspaces = pgTable("workspaces", {
  id: text("id").primaryKey(),
  name: text("name"),
  description: text("description"),
  slug: text("slug").unique(),
  userId: text("userId").references(() => users.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  ...lifecycleDates,
})

export const wokspaceRelations = relations(workspaces, ({ one }) => ({
  user: one(users, { references: [users.id], fields: [workspaces.userId] }),
}))

export type Workspace = typeof workspaces.$inferSelect
export type NewWorkspace = typeof workspaces.$inferInsert
