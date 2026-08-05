import { pgTable, uuid, varchar, text, timestamp, index } from "drizzle-orm/pg-core";
import { contentCategoryEnum, contentStatusEnum } from "./enums";
import { adminUsers } from "./admin-users";

export const content = pgTable(
  "content",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    imageUrl: text("image_url"),
    storagePath: text("storage_path"),
    category: contentCategoryEnum("category").notNull(),
    status: contentStatusEnum("status").notNull().default("DRAFT"),
    publishAt: timestamp("publish_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    createdBy: uuid("created_by").references(() => adminUsers.id),
    updatedBy: uuid("updated_by").references(() => adminUsers.id),
  },
  (table) => [
    index("content_category_idx").on(table.category),
    index("content_status_idx").on(table.status),
    index("content_publish_at_idx").on(table.publishAt),
    index("content_created_at_idx").on(table.createdAt),
  ]
);
