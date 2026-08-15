"use server";

import { db } from "@/db";
import { donors, auditLogs, settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { addDays, parseISO } from "date-fns";

export async function updateDonorStatus(
  donorId: string,
  status: "ACTIVE" | "INACTIVE" | "DEACTIVATED"
) {
  try {
    const session = await requireAdmin();

    await db
      .update(donors)
      .set({
        donorStatus: status,
        updatedBy: session.admin.id,
        updatedAt: new Date(),
        deactivatedAt: status === "DEACTIVATED" ? new Date() : null,
      })
      .where(eq(donors.id, donorId));

    const actionMap = {
      ACTIVE: "DONOR_ACTIVATED",
      INACTIVE: "DONOR_UPDATED",
      DEACTIVATED: "DONOR_DEACTIVATED",
    } as const;

    await db.insert(auditLogs).values({
      adminId: session.admin.id,
      action: actionMap[status],
      entityType: "donor",
      entityId: donorId,
      metadata: { newStatus: status },
    });

    revalidatePath("/admin/donors");
    return { success: true };
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error) throw error;
    console.error("Error updating donor status:", error);
    return { success: false, error: "Failed to update donor status" };
  }
}

export async function verifyDonor(donorId: string) {
  try {
    const session = await requireAdmin();

    await db
      .update(donors)
      .set({
        verificationStatus: "VERIFIED",
        donorStatus: "ACTIVE",
        updatedBy: session.admin.id,
        updatedAt: new Date(),
      })
      .where(eq(donors.id, donorId));

    await db.insert(auditLogs).values({
      adminId: session.admin.id,
      action: "DONOR_VERIFIED",
      entityType: "donor",
      entityId: donorId,
    });

    revalidatePath("/admin/donors");
    return { success: true };
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error) throw error;
    console.error("Error verifying donor:", error);
    return { success: false, error: "Failed to verify donor" };
  }
}

export async function updateDonor(
  donorId: string,
  data: {
    firstName: string;
    lastName: string;
    age: number;
    phone: string;
    bloodGroupId: string;
    lastDonationDate: string;
    isItEmployee: boolean;
    companyName: string;
    consentToContact: boolean;
  }
) {
  try {
    const session = await requireAdmin();

    const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`;

    const eligibilitySetting = await db
      .select({ value: settings.value })
      .from(settings)
      .where(eq(settings.key, "DONATION_ELIGIBILITY_INTERVAL_DAYS"))
      .limit(1);

    const intervalDays = eligibilitySetting[0]?.value
      ? parseInt(eligibilitySetting[0].value, 10)
      : 90;

    const nextEligibleDate = addDays(parseISO(data.lastDonationDate), intervalDays)
      .toISOString()
      .split("T")[0];

    await db
      .update(donors)
      .set({
        fullName,
        phone: data.phone,
        bloodGroupId: data.bloodGroupId,
        age: data.age,
        isItEmployee: data.isItEmployee,
        lastDonationDate: data.lastDonationDate,
        nextEligibleDate,
        occupation: data.companyName,
        consentToContact: data.consentToContact,
        updatedBy: session.admin.id,
        updatedAt: new Date(),
      })
      .where(eq(donors.id, donorId));

    await db.insert(auditLogs).values({
      adminId: session.admin.id,
      action: "DONOR_UPDATED",
      entityType: "donor",
      entityId: donorId,
      metadata: { updatedFields: Object.keys(data) },
    });

    revalidatePath("/admin/donors");
    revalidatePath(`/admin/donors/${donorId}`);
    return { success: true };
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error) throw error;
    console.error("Error updating donor:", error);
    return { success: false, error: "Failed to update donor" };
  }
}
