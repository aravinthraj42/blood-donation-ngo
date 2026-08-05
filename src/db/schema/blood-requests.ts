import { pgTable, uuid, varchar, text, date, time, integer, timestamp, index } from "drizzle-orm/pg-core";
import { requestStatusEnum, urgencyEnum } from "./enums";
import { bloodGroups } from "./blood-groups";

export const bloodRequests = pgTable(
  "blood_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    referenceNumber: varchar("reference_number", { length: 20 }).notNull().unique(),
    requesterName: varchar("requester_name", { length: 255 }).notNull(),
    patientName: varchar("patient_name", { length: 255 }).notNull(),
    bloodGroupId: uuid("blood_group_id")
      .notNull()
      .references(() => bloodGroups.id),
    unitsRequired: integer("units_required").notNull().default(1),
    reason: text("reason"),
    hospitalName: varchar("hospital_name", { length: 255 }).notNull(),
    hospitalLocation: text("hospital_location").notNull(),
    requiredDate: date("required_date").notNull(),
    requiredTime: time("required_time"),
    contactPhone: varchar("contact_phone", { length: 20 }).notNull(),
    alternativeContact: varchar("alternative_contact", { length: 20 }),
    pocName: varchar("poc_name", { length: 255 }),
    pocPhone: varchar("poc_phone", { length: 20 }),
    urgency: urgencyEnum("urgency").notNull().default("NORMAL"),
    status: requestStatusEnum("status").notNull().default("PENDING"),
    internalNotes: text("internal_notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("blood_requests_reference_number_idx").on(table.referenceNumber),
    index("blood_requests_blood_group_id_idx").on(table.bloodGroupId),
    index("blood_requests_status_idx").on(table.status),
    index("blood_requests_urgency_idx").on(table.urgency),
    index("blood_requests_created_at_idx").on(table.createdAt),
    index("blood_requests_required_date_idx").on(table.requiredDate),
  ]
);
