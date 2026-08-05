"use server";

import { db } from "@/db";
import { notifications } from "@/db/schema";
import { eq, and, or, sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function markNotificationRead(notificationId: string) {
  try {
    await requireAdmin();

    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, notificationId));

    revalidatePath("/admin/notifications");
    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { success: false, error: "Failed to mark notification as read" };
  }
}

export async function markAllNotificationsRead(adminId: string) {
  try {
    await requireAdmin();

    await db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.isRead, false),
          or(eq(notifications.adminId, adminId), sql`${notifications.adminId} IS NULL`)
        )
      );

    revalidatePath("/admin/notifications");
    return { success: true };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return { success: false, error: "Failed to mark notifications as read" };
  }
}
