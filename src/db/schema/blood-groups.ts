import { pgTable, uuid, varchar, integer, timestamp } from "drizzle-orm/pg-core";

export const bloodGroups = pgTable("blood_groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 20 }).notNull().unique(),
  displayName: varchar("display_name", { length: 10 }).notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
