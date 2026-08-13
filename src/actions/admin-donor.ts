"use server";

import { db } from "@/db";
import { donors, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

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
    fullName?: string;
    phone?: string;
    email?: string | null;
    bloodGroupId?: string;
    dateOfBirth?: string | null;
    lastDonationDate?: string | null;
    address?: string;
    city?: string;
    district?: string;
    state?: string;
    pincode?: string;
    occupation?: string | null;
    preferredContactMethod?: "PHONE" | "WHATSAPP" | "EMAIL";
    consentToContact?: boolean;
    additionalNotes?: string | null;
  }
) {
  try {
    const session = await requireAdmin();

    await db
      .update(donors)
      .set({
        ...data,
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
