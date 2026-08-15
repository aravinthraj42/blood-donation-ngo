"use server";

import { db } from "@/db";
import { donors, notifications, settings } from "@/db/schema";
import { donorRegistrationSchema, type DonorRegistrationInput } from "@/lib/validations/donor";
import { addDays, parseISO } from "date-fns";
import { eq } from "drizzle-orm";

export interface DonorRegistrationResult {
  success: boolean;
  error?: string;
}

export async function registerDonor(data: DonorRegistrationInput): Promise<DonorRegistrationResult> {
  const validation = donorRegistrationSchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0].message,
    };
  }

  try {
    const eligibilityIntervalSetting = await db
      .select({ value: settings.value })
      .from(settings)
      .where(eq(settings.key, "DONATION_ELIGIBILITY_INTERVAL_DAYS"))
      .limit(1);

    const intervalDays = eligibilityIntervalSetting[0]?.value
      ? parseInt(eligibilityIntervalSetting[0].value, 10)
      : 90;

    const lastDonationDate = parseISO(data.lastDonationDate);
    const nextEligibleDate = addDays(lastDonationDate, intervalDays);
    const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`;

    const [donor] = await db
      .insert(donors)
      .values({
        fullName,
        phone: data.phone,
        email: null,
        bloodGroupId: data.bloodGroupId,
        age: data.age,
        isItEmployee: data.isItEmployee,
        lastDonationDate: data.lastDonationDate,
        nextEligibleDate: nextEligibleDate.toISOString().split("T")[0],
        occupation: data.companyName,
        consentToContact: data.consentToContact,
        donorStatus: "PENDING",
        verificationStatus: "UNVERIFIED",
      })
      .returning({ id: donors.id });

    await db.insert(notifications).values({
      type: "NEW_DONOR",
      title: "New Donor Registration",
      message: `${fullName} has registered as a new donor and is pending verification.`,
      entityType: "donor",
      entityId: donor.id,
    });

    return { success: true };
  } catch (error) {
    console.error("Error registering donor:", error);
    return {
      success: false,
      error: "Failed to register. Please try again later.",
    };
  }
}
