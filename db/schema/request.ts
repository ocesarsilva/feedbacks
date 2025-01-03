import { relations } from "drizzle-orm"
import { pgEnum, pgTable, text } from "drizzle-orm/pg-core"

import { lifecycleDates } from "../utils"
import { users } from "./auth"
import { workspaces } from "./workspace"

export const requestStatusEnum = pgEnum("request_status", [
  "pending",
  "reviewing",
  "planned",
  "progress",
  "completed",
  "closed",
])

export const requests = pgTable("requests", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: requestStatusEnum("status").notNull().default("pending"),
  workspaceId: text("workspaceId").references(() => workspaces.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  authorId: text("authorId").references(() => users.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  ...lifecycleDates,
})

export const requestRelations = relations(requests, ({ one }) => ({
  workspace: one(workspaces, {
    references: [workspaces.id],
    fields: [requests.workspaceId],
  }),
  author: one(users, {
    references: [users.id],
    fields: [requests.authorId],
  }),
}))

export type Request = typeof requests.$inferSelect
export type NewRequest = typeof requests.$inferInsert
