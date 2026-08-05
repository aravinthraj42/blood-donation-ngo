import { db } from "@/db";
import { donors, bloodGroups, content, settings } from "@/db/schema";
import { eq, and, sql, lte } from "drizzle-orm";
import type { BloodAvailability } from "@/types";

export async function getPublicBloodAvailability(): Promise<BloodAvailability> {
  const today = new Date().toISOString().split("T")[0];

  const counts = await db
    .select({
      displayName: bloodGroups.displayName,
      count: sql<number>`count(${donors.id})::int`,
    })
    .from(bloodGroups)
    .leftJoin(
      donors,
      and(
        eq(donors.bloodGroupId, bloodGroups.id),
        eq(donors.donorStatus, "ACTIVE"),
        eq(donors.consentToContact, true),
        lte(donors.nextEligibleDate, today)
      )
    )
    .groupBy(bloodGroups.id, bloodGroups.displayName, bloodGroups.sortOrder)
    .orderBy(bloodGroups.sortOrder);

  const availability: BloodAvailability = {};
  counts.forEach((row) => {
    availability[row.displayName] = row.count || 0;
  });

  return availability;
}

export async function getPublishedContent(category?: string, limit?: number) {
  const now = new Date();

  let query = db
    .select({
      id: content.id,
      title: content.title,
      description: content.description,
      imageUrl: content.imageUrl,
      category: content.category,
      publishAt: content.publishAt,
    })
    .from(content)
    .where(
      and(
        eq(content.status, "PUBLISHED"),
        lte(content.publishAt, now)
      )
    )
    .orderBy(sql`${content.publishAt} DESC`);

  if (category) {
    query = db
      .select({
        id: content.id,
        title: content.title,
        description: content.description,
        imageUrl: content.imageUrl,
        category: content.category,
        publishAt: content.publishAt,
      })
      .from(content)
      .where(
        and(
          eq(content.status, "PUBLISHED"),
          eq(content.category, category as "DOCTOR_MESSAGE" | "BLOOD_DONATION" | "HEALTHCARE" | "AWARENESS" | "QUOTE" | "ANNOUNCEMENT"),
          lte(content.publishAt, now)
        )
      )
      .orderBy(sql`${content.publishAt} DESC`);
  }

  if (limit) {
    return query.limit(limit);
  }

  return query;
}

export async function getSetting(key: string): Promise<string | null> {
  const [setting] = await db
    .select({ value: settings.value })
    .from(settings)
    .where(eq(settings.key, key))
    .limit(1);

  return setting?.value ?? null;
}

export async function getAllSettings(): Promise<Record<string, string>> {
  const allSettings = await db.select().from(settings);
  
  const settingsMap: Record<string, string> = {};
  allSettings.forEach((s) => {
    settingsMap[s.key] = s.value;
  });

  return settingsMap;
}

export async function getBloodGroups() {
  return db
    .select({
      id: bloodGroups.id,
      name: bloodGroups.name,
      displayName: bloodGroups.displayName,
    })
    .from(bloodGroups)
    .orderBy(bloodGroups.sortOrder);
}
