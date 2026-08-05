import { pgTable, uuid, varchar, text, timestamp, index } from "drizzle-orm/pg-core";
import { adminUsers } from "./admin-users";

export const settings = pgTable(
  "settings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    key: varchar("key", { length: 100 }).notNull().unique(),
    value: text("value").notNull(),
    valueType: varchar("value_type", { length: 20 }).notNull().default("string"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    updatedBy: uuid("updated_by").references(() => adminUsers.id),
  },
  (table) => [
    index("settings_key_idx").on(table.key),
  ]
);
