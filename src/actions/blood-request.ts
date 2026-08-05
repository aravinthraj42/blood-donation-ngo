"use server";

import { db } from "@/db";
import { bloodRequests, notifications, bloodGroups } from "@/db/schema";
import { bloodRequestSchema, type BloodRequestInput } from "@/lib/validations/blood-request";
import { eq, sql } from "drizzle-orm";

export interface BloodRequestResult {
  success: boolean;
  referenceNumber?: string;
  error?: string;
}

async function generateReferenceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `BD-${year}-`;

  const [result] = await db
    .select({
      maxRef: sql<string>`MAX(${bloodRequests.referenceNumber})`,
    })
    .from(bloodRequests)
    .where(sql`${bloodRequests.referenceNumber} LIKE ${prefix + "%"}`);

  let nextNumber = 1;
  if (result?.maxRef) {
    const lastNumber = parseInt(result.maxRef.split("-")[2], 10);
    nextNumber = lastNumber + 1;
  }

  return `${prefix}${nextNumber.toString().padStart(6, "0")}`;
}

export async function submitBloodRequest(data: BloodRequestInput): Promise<BloodRequestResult> {
  const validation = bloodRequestSchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0].message,
    };
  }

  try {
    const referenceNumber = await generateReferenceNumber();

    const [bloodGroup] = await db
      .select({ displayName: bloodGroups.displayName })
      .from(bloodGroups)
      .where(eq(bloodGroups.id, data.bloodGroupId))
      .limit(1);

    const [request] = await db
      .insert(bloodRequests)
      .values({
        referenceNumber,
        requesterName: data.requesterName,
        patientName: data.patientName,
        bloodGroupId: data.bloodGroupId,
        unitsRequired: data.unitsRequired,
        reason: data.reason || null,
        hospitalName: data.hospitalName,
        hospitalLocation: data.hospitalLocation,
        requiredDate: data.requiredDate,
        requiredTime: data.requiredTime || null,
        contactPhone: data.contactPhone,
        alternativeContact: data.alternativeContact || null,
        pocName: data.pocName || null,
        pocPhone: data.pocPhone || null,
        urgency: data.urgency,
        status: "PENDING",
      })
      .returning({ id: bloodRequests.id });

    const notificationType =
      data.urgency === "EMERGENCY" || data.urgency === "URGENT"
        ? "URGENT_BLOOD_REQUEST"
        : "NEW_BLOOD_REQUEST";

    const urgencyLabel =
      data.urgency === "EMERGENCY"
        ? "EMERGENCY"
        : data.urgency === "URGENT"
        ? "Urgent"
        : "New";

    await db.insert(notifications).values({
      type: notificationType as "NEW_BLOOD_REQUEST" | "URGENT_BLOOD_REQUEST",
      title: `${urgencyLabel} Blood Request`,
      message: `${urgencyLabel} blood request for ${bloodGroup?.displayName || "blood"} at ${data.hospitalName}. Reference: ${referenceNumber}`,
      entityType: "blood_request",
      entityId: request.id,
    });

    return {
      success: true,
      referenceNumber,
    };
  } catch (error) {
    console.error("Error submitting blood request:", error);
    return {
      success: false,
      error: "Failed to submit request. Please try again later.",
    };
  }
}
