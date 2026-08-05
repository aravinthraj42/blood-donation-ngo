import { relations } from "drizzle-orm";
import { bloodGroups } from "./blood-groups";
import { donors } from "./donors";
import { bloodRequests } from "./blood-requests";
import { adminUsers } from "./admin-users";
import { content } from "./content";
import { notifications } from "./notifications";
import { settings } from "./settings";
import { auditLogs } from "./audit-logs";

export const bloodGroupsRelations = relations(bloodGroups, ({ many }) => ({
  donors: many(donors),
  bloodRequests: many(bloodRequests),
}));

export const donorsRelations = relations(donors, ({ one }) => ({
  bloodGroup: one(bloodGroups, {
    fields: [donors.bloodGroupId],
    references: [bloodGroups.id],
  }),
  createdByAdmin: one(adminUsers, {
    fields: [donors.createdBy],
    references: [adminUsers.id],
    relationName: "donorCreatedBy",
  }),
  updatedByAdmin: one(adminUsers, {
    fields: [donors.updatedBy],
    references: [adminUsers.id],
    relationName: "donorUpdatedBy",
  }),
}));

export const bloodRequestsRelations = relations(bloodRequests, ({ one }) => ({
  bloodGroup: one(bloodGroups, {
    fields: [bloodRequests.bloodGroupId],
    references: [bloodGroups.id],
  }),
}));

export const contentRelations = relations(content, ({ one }) => ({
  createdByAdmin: one(adminUsers, {
    fields: [content.createdBy],
    references: [adminUsers.id],
    relationName: "contentCreatedBy",
  }),
  updatedByAdmin: one(adminUsers, {
    fields: [content.updatedBy],
    references: [adminUsers.id],
    relationName: "contentUpdatedBy",
  }),
}));

export const adminUsersRelations = relations(adminUsers, ({ many }) => ({
  notifications: many(notifications),
  auditLogs: many(auditLogs),
  createdDonors: many(donors, { relationName: "donorCreatedBy" }),
  updatedDonors: many(donors, { relationName: "donorUpdatedBy" }),
  createdContent: many(content, { relationName: "contentCreatedBy" }),
  updatedContent: many(content, { relationName: "contentUpdatedBy" }),
  updatedSettings: many(settings),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  admin: one(adminUsers, {
    fields: [notifications.adminId],
    references: [adminUsers.id],
  }),
}));

export const settingsRelations = relations(settings, ({ one }) => ({
  updatedByAdmin: one(adminUsers, {
    fields: [settings.updatedBy],
    references: [adminUsers.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  admin: one(adminUsers, {
    fields: [auditLogs.adminId],
    references: [adminUsers.id],
  }),
}));
