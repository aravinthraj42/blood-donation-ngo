import { pgTable, uuid, varchar, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { auditActionEnum } from "./enums";
import { adminUsers } from "./admin-users";

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    adminId: uuid("admin_id").references(() => adminUsers.id),
    action: auditActionEnum("action").notNull(),
    entityType: varchar("entity_type", { length: 50 }),
    entityId: uuid("entity_id"),
    metadata: jsonb("metadata"),
    ipAddress: varchar("ip_address", { length: 45 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("audit_logs_admin_id_idx").on(table.adminId),
    index("audit_logs_action_idx").on(table.action),
    index("audit_logs_entity_type_idx").on(table.entityType),
    index("audit_logs_created_at_idx").on(table.createdAt),
  ]
);
