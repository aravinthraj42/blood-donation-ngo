import { db } from "@/db";
import {
  donors,
  bloodRequests,
  bloodGroups,
  content,
  notifications,
  adminUsers,
  auditLogs,
  settings,
} from "@/db/schema";
import { eq, and, sql, desc, ilike, or, lte, gte, count } from "drizzle-orm";
import type {
  PaginationParams,
  PaginatedResult,
  DonorFilters,
  RequestFilters,
  ContentFilters,
} from "@/types";

export async function getDashboardStats() {
  const today = new Date().toISOString().split("T")[0];

  const [donorStats, requestStats] = await Promise.all([
    db
      .select({
        total: sql<number>`count(*)::int`,
        active: sql<number>`count(*) filter (where ${donors.donorStatus} = 'ACTIVE')::int`,
        pending: sql<number>`count(*) filter (where ${donors.donorStatus} = 'PENDING')::int`,
        verified: sql<number>`count(*) filter (where ${donors.verificationStatus} = 'VERIFIED')::int`,
        eligible: sql<number>`count(*) filter (where ${donors.donorStatus} = 'ACTIVE' and ${donors.consentToContact} = true and ${donors.nextEligibleDate} <= ${today})::int`,
      })
      .from(donors),
    db
      .select({
        total: sql<number>`count(*)::int`,
        pending: sql<number>`count(*) filter (where ${bloodRequests.status} = 'PENDING')::int`,
        urgent: sql<number>`count(*) filter (where (${bloodRequests.urgency} = 'URGENT' or ${bloodRequests.urgency} = 'EMERGENCY') and ${bloodRequests.status} = 'PENDING')::int`,
        fulfilled: sql<number>`count(*) filter (where ${bloodRequests.status} = 'FULFILLED')::int`,
      })
      .from(bloodRequests),
  ]);

  return {
    totalDonors: donorStats[0].total,
    activeDonors: donorStats[0].active,
    pendingDonors: donorStats[0].pending,
    verifiedDonors: donorStats[0].verified,
    eligibleDonors: donorStats[0].eligible,
    totalRequests: requestStats[0].total,
    pendingRequests: requestStats[0].pending,
    urgentRequests: requestStats[0].urgent,
    fulfilledRequests: requestStats[0].fulfilled,
  };
}

export async function getBloodGroupStats() {
  const stats = await db
    .select({
      displayName: bloodGroups.displayName,
      totalDonors: sql<number>`count(${donors.id})::int`,
    })
    .from(bloodGroups)
    .leftJoin(donors, eq(donors.bloodGroupId, bloodGroups.id))
    .groupBy(bloodGroups.id, bloodGroups.displayName, bloodGroups.sortOrder)
    .orderBy(bloodGroups.sortOrder);

  return stats;
}

export async function getMonthlyDonorRegistrations(months: number = 6) {
  const data = await db
    .select({
      month: sql<string>`to_char(${donors.createdAt}, 'Mon')`,
      count: sql<number>`count(*)::int`,
    })
    .from(donors)
    .where(
      gte(
        donors.createdAt,
        sql`date_trunc('month', now()) - interval '${sql.raw(String(months - 1))} months'`
      )
    )
    .groupBy(sql`date_trunc('month', ${donors.createdAt})`, sql`to_char(${donors.createdAt}, 'Mon')`)
    .orderBy(sql`date_trunc('month', ${donors.createdAt})`);

  return data;
}

export async function getRequestsByStatus() {
  const data = await db
    .select({
      status: bloodRequests.status,
      count: sql<number>`count(*)::int`,
    })
    .from(bloodRequests)
    .groupBy(bloodRequests.status);

  return data;
}

export async function getDonors(
  filters: DonorFilters,
  pagination: PaginationParams
): Promise<PaginatedResult<typeof donors.$inferSelect & { bloodGroup: typeof bloodGroups.$inferSelect }>> {
  const conditions = [];

  if (filters.search) {
    conditions.push(
      or(
        ilike(donors.fullName, `%${filters.search}%`),
        ilike(donors.phone, `%${filters.search}%`),
        ilike(donors.email, `%${filters.search}%`)
      )
    );
  }

  if (filters.bloodGroupId) {
    conditions.push(eq(donors.bloodGroupId, filters.bloodGroupId));
  }

  if (filters.city) {
    conditions.push(ilike(donors.city, `%${filters.city}%`));
  }

  if (filters.district) {
    conditions.push(ilike(donors.district, `%${filters.district}%`));
  }

  if (filters.donorStatus) {
    conditions.push(eq(donors.donorStatus, filters.donorStatus));
  }

  if (filters.verificationStatus) {
    conditions.push(eq(donors.verificationStatus, filters.verificationStatus));
  }

  if (filters.isEligible) {
    const today = new Date().toISOString().split("T")[0];
    conditions.push(lte(donors.nextEligibleDate, today));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [totalResult, data] = await Promise.all([
    db.select({ count: count() }).from(donors).where(whereClause),
    db
      .select()
      .from(donors)
      .leftJoin(bloodGroups, eq(donors.bloodGroupId, bloodGroups.id))
      .where(whereClause)
      .orderBy(desc(donors.createdAt))
      .limit(pagination.pageSize)
      .offset((pagination.page - 1) * pagination.pageSize),
  ]);

  const total = totalResult[0].count;

  return {
    data: data.map((row) => ({
      ...row.donors,
      bloodGroup: row.blood_groups!,
    })),
    total,
    page: pagination.page,
    pageSize: pagination.pageSize,
    totalPages: Math.ceil(total / pagination.pageSize),
  };
}

export async function getDonorById(id: string) {
  const [donor] = await db
    .select()
    .from(donors)
    .leftJoin(bloodGroups, eq(donors.bloodGroupId, bloodGroups.id))
    .where(eq(donors.id, id))
    .limit(1);

  if (!donor) return null;

  return {
    ...donor.donors,
    bloodGroup: donor.blood_groups,
  };
}

export async function getBloodRequests(
  filters: RequestFilters,
  pagination: PaginationParams
): Promise<PaginatedResult<typeof bloodRequests.$inferSelect & { bloodGroup: typeof bloodGroups.$inferSelect }>> {
  const conditions = [];

  if (filters.search) {
    conditions.push(
      or(
        ilike(bloodRequests.requesterName, `%${filters.search}%`),
        ilike(bloodRequests.patientName, `%${filters.search}%`),
        ilike(bloodRequests.contactPhone, `%${filters.search}%`),
        ilike(bloodRequests.referenceNumber, `%${filters.search}%`)
      )
    );
  }

  if (filters.bloodGroupId) {
    conditions.push(eq(bloodRequests.bloodGroupId, filters.bloodGroupId));
  }

  if (filters.urgency) {
    conditions.push(eq(bloodRequests.urgency, filters.urgency));
  }

  if (filters.status) {
    conditions.push(eq(bloodRequests.status, filters.status));
  }

  if (filters.dateFrom) {
    conditions.push(gte(bloodRequests.requiredDate, filters.dateFrom.toISOString().split("T")[0]));
  }

  if (filters.dateTo) {
    conditions.push(lte(bloodRequests.requiredDate, filters.dateTo.toISOString().split("T")[0]));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [totalResult, data] = await Promise.all([
    db.select({ count: count() }).from(bloodRequests).where(whereClause),
    db
      .select()
      .from(bloodRequests)
      .leftJoin(bloodGroups, eq(bloodRequests.bloodGroupId, bloodGroups.id))
      .where(whereClause)
      .orderBy(desc(bloodRequests.createdAt))
      .limit(pagination.pageSize)
      .offset((pagination.page - 1) * pagination.pageSize),
  ]);

  const total = totalResult[0].count;

  return {
    data: data.map((row) => ({
      ...row.blood_requests,
      bloodGroup: row.blood_groups!,
    })),
    total,
    page: pagination.page,
    pageSize: pagination.pageSize,
    totalPages: Math.ceil(total / pagination.pageSize),
  };
}

export async function getBloodRequestById(id: string) {
  const [request] = await db
    .select()
    .from(bloodRequests)
    .leftJoin(bloodGroups, eq(bloodRequests.bloodGroupId, bloodGroups.id))
    .where(eq(bloodRequests.id, id))
    .limit(1);

  if (!request) return null;

  return {
    ...request.blood_requests,
    bloodGroup: request.blood_groups,
  };
}

export async function getContent(
  filters: ContentFilters,
  pagination: PaginationParams
): Promise<PaginatedResult<typeof content.$inferSelect>> {
  const conditions = [];

  if (filters.search) {
    conditions.push(
      or(
        ilike(content.title, `%${filters.search}%`),
        ilike(content.description, `%${filters.search}%`)
      )
    );
  }

  if (filters.category) {
    conditions.push(eq(content.category, filters.category));
  }

  if (filters.status) {
    conditions.push(eq(content.status, filters.status));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [totalResult, data] = await Promise.all([
    db.select({ count: count() }).from(content).where(whereClause),
    db
      .select()
      .from(content)
      .where(whereClause)
      .orderBy(desc(content.createdAt))
      .limit(pagination.pageSize)
      .offset((pagination.page - 1) * pagination.pageSize),
  ]);

  const total = totalResult[0].count;

  return {
    data,
    total,
    page: pagination.page,
    pageSize: pagination.pageSize,
    totalPages: Math.ceil(total / pagination.pageSize),
  };
}

export async function getContentById(id: string) {
  const [item] = await db.select().from(content).where(eq(content.id, id)).limit(1);
  return item || null;
}

export async function getNotifications(adminId?: string, pagination?: PaginationParams) {
  const conditions = adminId
    ? or(eq(notifications.adminId, adminId), sql`${notifications.adminId} IS NULL`)
    : undefined;

  if (pagination) {
    const [totalResult, data] = await Promise.all([
      db.select({ count: count() }).from(notifications).where(conditions),
      db
        .select()
        .from(notifications)
        .where(conditions)
        .orderBy(desc(notifications.createdAt))
        .limit(pagination.pageSize)
        .offset((pagination.page - 1) * pagination.pageSize),
    ]);

    return {
      data,
      total: totalResult[0].count,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(totalResult[0].count / pagination.pageSize),
    };
  }

  return db.select().from(notifications).where(conditions).orderBy(desc(notifications.createdAt));
}

export async function getUnreadNotificationCount(adminId?: string) {
  const conditions = and(
    eq(notifications.isRead, false),
    adminId
      ? or(eq(notifications.adminId, adminId), sql`${notifications.adminId} IS NULL`)
      : undefined
  );

  const [result] = await db.select({ count: count() }).from(notifications).where(conditions);
  return result.count;
}

export async function getAdminUsers() {
  return db.select().from(adminUsers).orderBy(desc(adminUsers.createdAt));
}

export async function getAdminUserById(id: string) {
  const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
  return admin || null;
}

export async function getAuditLogs(pagination: PaginationParams) {
  const [totalResult, data] = await Promise.all([
    db.select({ count: count() }).from(auditLogs),
    db
      .select({
        log: auditLogs,
        admin: adminUsers,
      })
      .from(auditLogs)
      .leftJoin(adminUsers, eq(auditLogs.adminId, adminUsers.id))
      .orderBy(desc(auditLogs.createdAt))
      .limit(pagination.pageSize)
      .offset((pagination.page - 1) * pagination.pageSize),
  ]);

  const total = totalResult[0].count;

  return {
    data: data.map((row) => ({
      ...row.log,
      admin: row.admin,
    })),
    total,
    page: pagination.page,
    pageSize: pagination.pageSize,
    totalPages: Math.ceil(total / pagination.pageSize),
  };
}

export async function getAllSettings() {
  const allSettings = await db.select().from(settings);
  const settingsMap: Record<string, string> = {};
  allSettings.forEach((s) => {
    settingsMap[s.key] = s.value;
  });
  return settingsMap;
}

export async function getAllBloodGroups() {
  return db.select().from(bloodGroups).orderBy(bloodGroups.sortOrder);
}
