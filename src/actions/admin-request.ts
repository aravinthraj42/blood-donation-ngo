"use server";

import { db } from "@/db";
import { bloodRequests, auditLogs, notifications } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateRequestStatus(
  requestId: string,
  status: "PENDING" | "CONTACTED" | "IN_PROGRESS" | "FULFILLED" | "CANCELLED"
) {
  try {
    const session = await requireAdmin();

    await db
      .update(bloodRequests)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(bloodRequests.id, requestId));

    await db.insert(auditLogs).values({
      adminId: session.admin.id,
      action: "REQUEST_STATUS_CHANGED",
      entityType: "blood_request",
      entityId: requestId,
      metadata: { newStatus: status },
    });

    if (status === "FULFILLED" || status === "CANCELLED") {
      await db.insert(notifications).values({
        type: "REQUEST_STATUS_CHANGED",
        title: `Request ${status === "FULFILLED" ? "Fulfilled" : "Cancelled"}`,
        message: `Blood request has been marked as ${status.toLowerCase()}.`,
        entityType: "blood_request",
        entityId: requestId,
      });
    }

    revalidatePath("/admin/requests");
    return { success: true };
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error) throw error;
    console.error("Error updating request status:", error);
    return { success: false, error: "Failed to update request status" };
  }
}

export async function addRequestNote(requestId: string, note: string) {
  try {
    const session = await requireAdmin();

    const [request] = await db
      .select({ internalNotes: bloodRequests.internalNotes })
      .from(bloodRequests)
      .where(eq(bloodRequests.id, requestId))
      .limit(1);

    const existingNotes = request?.internalNotes || "";
    const timestamp = new Date().toISOString();
    const newNote = `[${timestamp}] ${session.admin.fullName}: ${note}`;
    const updatedNotes = existingNotes
      ? `${existingNotes}\n\n${newNote}`
      : newNote;

    await db
      .update(bloodRequests)
      .set({
        internalNotes: updatedNotes,
        updatedAt: new Date(),
      })
      .where(eq(bloodRequests.id, requestId));

    await db.insert(auditLogs).values({
      adminId: session.admin.id,
      action: "REQUEST_UPDATED",
      entityType: "blood_request",
      entityId: requestId,
      metadata: { action: "note_added" },
    });

    revalidatePath(`/admin/requests/${requestId}`);
    return { success: true };
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error) throw error;
    console.error("Error adding request note:", error);
    return { success: false, error: "Failed to add note" };
  }
}
