import { pgEnum } from "drizzle-orm/pg-core";

export const donorStatusEnum = pgEnum("donor_status", [
  "PENDING",
  "ACTIVE",
  "INACTIVE",
  "DEACTIVATED",
]);

export const verificationStatusEnum = pgEnum("verification_status", [
  "UNVERIFIED",
  "VERIFIED",
]);

export const requestStatusEnum = pgEnum("request_status", [
  "PENDING",
  "CONTACTED",
  "IN_PROGRESS",
  "FULFILLED",
  "CANCELLED",
]);

export const urgencyEnum = pgEnum("urgency", [
  "NORMAL",
  "URGENT",
  "EMERGENCY",
]);

export const contentCategoryEnum = pgEnum("content_category", [
  "DOCTOR_MESSAGE",
  "BLOOD_DONATION",
  "HEALTHCARE",
  "AWARENESS",
  "QUOTE",
  "ANNOUNCEMENT",
]);

export const contentStatusEnum = pgEnum("content_status", [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
]);

export const contactMethodEnum = pgEnum("contact_method", [
  "PHONE",
  "WHATSAPP",
  "EMAIL",
]);

export const adminRoleEnum = pgEnum("admin_role", [
  "SUPER_ADMIN",
  "ADMIN",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "NEW_DONOR",
  "NEW_BLOOD_REQUEST",
  "URGENT_BLOOD_REQUEST",
  "DONOR_UPDATED",
  "REQUEST_STATUS_CHANGED",
  "CONTENT_PUBLISHED",
]);

export const auditActionEnum = pgEnum("audit_action", [
  "ADMIN_LOGIN",
  "DONOR_CREATED",
  "DONOR_UPDATED",
  "DONOR_VERIFIED",
  "DONOR_DEACTIVATED",
  "DONOR_ACTIVATED",
  "REQUEST_CREATED",
  "REQUEST_UPDATED",
  "REQUEST_STATUS_CHANGED",
  "CONTENT_CREATED",
  "CONTENT_UPDATED",
  "CONTENT_PUBLISHED",
  "CONTENT_DELETED",
  "ADMIN_CREATED",
  "ADMIN_ROLE_CHANGED",
  "ADMIN_DEACTIVATED",
  "SETTINGS_UPDATED",
]);
