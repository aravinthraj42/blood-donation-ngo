import { pgTable, uuid, varchar, text, date, time, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { requestStatusEnum, urgencyEnum } from "./enums";
import { bloodGroups } from "./blood-groups";

export const bloodRequests = pgTable(
  "blood_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    referenceNumber: varchar("reference_number", { length: 20 }).notNull().unique(),
    requesterName: varchar("requester_name", { length: 255 }).notNull(),
    patientName: varchar("patient_name", { length: 255 }),
    bloodGroupId: uuid("blood_group_id")
      .notNull()
      .references(() => bloodGroups.id),
    unitsRequired: integer("units_required").notNull().default(1),
    reason: text("reason"),
    hospitalName: varchar("hospital_name", { length: 255 }),
    hospitalLocation: text("hospital_location"),
    requiredDate: date("required_date"),
    requiredTime: time("required_time"),
    contactPhone: varchar("contact_phone", { length: 20 }).notNull(),
    alternativeContact: varchar("alternative_contact", { length: 20 }),
    pocName: varchar("poc_name", { length: 255 }),
    pocPhone: varchar("poc_phone", { length: 20 }),
    urgency: urgencyEnum("urgency").notNull().default("NORMAL"),
    status: requestStatusEnum("status").notNull().default("PENDING"),
    internalNotes: text("internal_notes"),
    requesterAge: integer("requester_age"),
    requesterLastDonationDate: date("requester_last_donation_date"),
    requesterWillDonate: boolean("requester_will_donate"),
    requesterIsItEmployee: boolean("requester_is_it_employee"),
    requesterCompany: varchar("requester_company", { length: 255 }),
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
