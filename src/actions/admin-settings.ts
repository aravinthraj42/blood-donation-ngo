"use server";

import { db } from "@/db";
import { settings, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateSettings(data: Record<string, string>) {
  try {
    const session = await requireAdmin();

    for (const [key, value] of Object.entries(data)) {
      await db
        .update(settings)
        .set({
          value,
          updatedAt: new Date(),
          updatedBy: session.admin.id,
        })
        .where(eq(settings.key, key));
    }

    await db.insert(auditLogs).values({
      adminId: session.admin.id,
      action: "SETTINGS_UPDATED",
      entityType: "settings",
      metadata: { updatedKeys: Object.keys(data) },
    });

    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error) throw error;
    console.error("Error updating settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}
