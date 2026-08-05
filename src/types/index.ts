import {
  DONOR_STATUS,
  VERIFICATION_STATUS,
  REQUEST_STATUS,
  URGENCY_LEVEL,
  CONTENT_CATEGORY,
  CONTENT_STATUS,
  CONTACT_METHOD,
  ADMIN_ROLE,
  NOTIFICATION_TYPE,
  AUDIT_ACTION,
} from "@/config/constants";

export type DonorStatus = (typeof DONOR_STATUS)[keyof typeof DONOR_STATUS];
export type VerificationStatus = (typeof VERIFICATION_STATUS)[keyof typeof VERIFICATION_STATUS];
export type RequestStatus = (typeof REQUEST_STATUS)[keyof typeof REQUEST_STATUS];
export type UrgencyLevel = (typeof URGENCY_LEVEL)[keyof typeof URGENCY_LEVEL];
export type ContentCategory = (typeof CONTENT_CATEGORY)[keyof typeof CONTENT_CATEGORY];
export type ContentStatus = (typeof CONTENT_STATUS)[keyof typeof CONTENT_STATUS];
export type ContactMethod = (typeof CONTACT_METHOD)[keyof typeof CONTACT_METHOD];
export type AdminRole = (typeof ADMIN_ROLE)[keyof typeof ADMIN_ROLE];
export type NotificationType = (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];
export type AuditAction = (typeof AUDIT_ACTION)[keyof typeof AUDIT_ACTION];

export interface BloodGroup {
  id: string;
  name: string;
  displayName: string;
  sortOrder: number;
}

export interface Donor {
  id: string;
  fullName: string;
  email: string | null;
  phone: string;
  bloodGroupId: string;
  bloodGroup?: BloodGroup;
  dateOfBirth: Date | null;
  lastDonationDate: Date | null;
  nextEligibleDate: Date | null;
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  occupation: string | null;
  preferredContactMethod: ContactMethod;
  consentToContact: boolean;
  additionalNotes: string | null;
  donorStatus: DonorStatus;
  verificationStatus: VerificationStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string | null;
  updatedBy: string | null;
  deactivatedAt: Date | null;
}

export interface BloodRequest {
  id: string;
  referenceNumber: string;
  requesterName: string;
  patientName: string;
  bloodGroupId: string;
  bloodGroup?: BloodGroup;
  unitsRequired: number;
  reason: string | null;
  hospitalName: string;
  hospitalLocation: string;
  requiredDate: Date;
  requiredTime: string | null;
  contactPhone: string;
  alternativeContact: string | null;
  pocName: string | null;
  pocPhone: string | null;
  urgency: UrgencyLevel;
  status: RequestStatus;
  internalNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Content {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  storagePath: string | null;
  category: ContentCategory;
  status: ContentStatus;
  publishAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface AdminUser {
  id: string;
  authUserId: string;
  email: string;
  fullName: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  adminId: string | null;
  type: NotificationType;
  title: string;
  message: string;
  entityType: string | null;
  entityId: string | null;
  isRead: boolean;
  createdAt: Date;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
  valueType: string;
  updatedAt: Date;
  updatedBy: string | null;
}

export interface AuditLog {
  id: string;
  adminId: string | null;
  action: AuditAction;
  entityType: string | null;
  entityId: string | null;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: Date;
}

export interface BloodAvailability {
  [bloodGroup: string]: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DonorFilters {
  search?: string;
  bloodGroupId?: string;
  city?: string;
  district?: string;
  donorStatus?: DonorStatus;
  verificationStatus?: VerificationStatus;
  isEligible?: boolean;
}

export interface RequestFilters {
  search?: string;
  bloodGroupId?: string;
  urgency?: UrgencyLevel;
  status?: RequestStatus;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface ContentFilters {
  search?: string;
  category?: ContentCategory;
  status?: ContentStatus;
}
