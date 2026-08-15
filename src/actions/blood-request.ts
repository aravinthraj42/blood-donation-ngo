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
    const requesterName = `${data.firstName.trim()} ${data.lastName.trim()}`;

    const [bloodGroup] = await db
      .select({ displayName: bloodGroups.displayName })
      .from(bloodGroups)
      .where(eq(bloodGroups.id, data.bloodGroupId))
      .limit(1);

    const [request] = await db
      .insert(bloodRequests)
      .values({
        referenceNumber,
        requesterName,
        patientName: null,
        bloodGroupId: data.bloodGroupId,
        unitsRequired: 1,
        reason: data.reason,
        hospitalName: null,
        hospitalLocation: null,
        requiredDate: null,
        contactPhone: data.phone,
        urgency: data.isUrgent ? "EMERGENCY" : "NORMAL",
        status: "PENDING",
        requesterAge: data.age,
        requesterLastDonationDate: null,
        requesterWillDonate: data.willToDonate,
        requesterIsItEmployee: data.isItEmployee,
        requesterCompany: data.companyName,
      })
      .returning({ id: bloodRequests.id });

    const isUrgent = data.isUrgent === true;
    await db.insert(notifications).values({
      type: isUrgent ? "URGENT_BLOOD_REQUEST" : "NEW_BLOOD_REQUEST",
      title: isUrgent ? "Urgent Blood Request" : "New Blood Request",
      message: `${isUrgent ? "URGENT: " : ""}Blood request for ${bloodGroup?.displayName || "blood"} submitted by ${requesterName}. Reference: ${referenceNumber}`,
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
