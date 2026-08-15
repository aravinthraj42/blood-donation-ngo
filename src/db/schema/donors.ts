import { pgTable, uuid, varchar, text, date, boolean, integer, timestamp, index } from "drizzle-orm/pg-core";
import { donorStatusEnum, verificationStatusEnum, contactMethodEnum } from "./enums";
import { bloodGroups } from "./blood-groups";
import { adminUsers } from "./admin-users";

export const donors = pgTable(
  "donors",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 20 }).notNull(),
    bloodGroupId: uuid("blood_group_id")
      .notNull()
      .references(() => bloodGroups.id),
    age: integer("age"),
    isItEmployee: boolean("is_it_employee").notNull().default(false),
    dateOfBirth: date("date_of_birth"),
    lastDonationDate: date("last_donation_date"),
    nextEligibleDate: date("next_eligible_date"),
    address: text("address"),
    city: varchar("city", { length: 100 }),
    district: varchar("district", { length: 100 }),
    state: varchar("state", { length: 100 }),
    pincode: varchar("pincode", { length: 10 }),
    occupation: varchar("occupation", { length: 255 }),
    preferredContactMethod: contactMethodEnum("preferred_contact_method").notNull().default("PHONE"),
    consentToContact: boolean("consent_to_contact").notNull().default(false),
    additionalNotes: text("additional_notes"),
    donorStatus: donorStatusEnum("donor_status").notNull().default("PENDING"),
    verificationStatus: verificationStatusEnum("verification_status").notNull().default("UNVERIFIED"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    createdBy: uuid("created_by").references(() => adminUsers.id),
    updatedBy: uuid("updated_by").references(() => adminUsers.id),
    deactivatedAt: timestamp("deactivated_at", { withTimezone: true }),
  },
  (table) => [
    index("donors_blood_group_id_idx").on(table.bloodGroupId),
    index("donors_phone_idx").on(table.phone),
    index("donors_email_idx").on(table.email),
    index("donors_city_idx").on(table.city),
    index("donors_district_idx").on(table.district),
    index("donors_donor_status_idx").on(table.donorStatus),
    index("donors_verification_status_idx").on(table.verificationStatus),
    index("donors_next_eligible_date_idx").on(table.nextEligibleDate),
    index("donors_created_at_idx").on(table.createdAt),
    index("donors_consent_to_contact_idx").on(table.consentToContact),
  ]
);
