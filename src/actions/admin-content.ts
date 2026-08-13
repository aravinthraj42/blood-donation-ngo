"use server";

import { db } from "@/db";
import { content, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

interface ContentData {
  title: string;
  description?: string;
  imageUrl?: string;
  category: "DOCTOR_MESSAGE" | "BLOOD_DONATION" | "HEALTHCARE" | "AWARENESS" | "QUOTE" | "ANNOUNCEMENT";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishAt?: string;
}

export async function createContent(data: ContentData) {
  try {
    const session = await requireAdmin();

    const [newContent] = await db
      .insert(content)
      .values({
        title: data.title,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        category: data.category,
        status: data.status,
        publishAt: data.publishAt ? new Date(data.publishAt) : new Date(),
        createdBy: session.admin.id,
        updatedBy: session.admin.id,
      })
      .returning({ id: content.id });

    await db.insert(auditLogs).values({
      adminId: session.admin.id,
      action: "CONTENT_CREATED",
      entityType: "content",
      entityId: newContent.id,
      metadata: { title: data.title, category: data.category },
    });

    revalidatePath("/admin/content");
    revalidatePath("/");
    revalidatePath("/health-awareness");
    return { success: true };
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error) throw error;
    console.error("Error creating content:", error);
    return { success: false, error: "Failed to create content" };
  }
}

export async function updateContent(id: string, data: ContentData) {
  try {
    const session = await requireAdmin();

    await db
      .update(content)
      .set({
        title: data.title,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        category: data.category,
        status: data.status,
        publishAt: data.publishAt ? new Date(data.publishAt) : null,
        updatedBy: session.admin.id,
        updatedAt: new Date(),
      })
      .where(eq(content.id, id));

    await db.insert(auditLogs).values({
      adminId: session.admin.id,
      action: "CONTENT_UPDATED",
      entityType: "content",
      entityId: id,
      metadata: { title: data.title, status: data.status },
    });

    revalidatePath("/admin/content");
    revalidatePath(`/admin/content/${id}`);
    revalidatePath("/");
    revalidatePath("/health-awareness");
    return { success: true };
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error) throw error;
    console.error("Error updating content:", error);
    return { success: false, error: "Failed to update content" };
  }
}

export async function deleteContent(id: string) {
  try {
    const session = await requireAdmin();

    await db.delete(content).where(eq(content.id, id));

    await db.insert(auditLogs).values({
      adminId: session.admin.id,
      action: "CONTENT_DELETED",
      entityType: "content",
      entityId: id,
    });

    revalidatePath("/admin/content");
    revalidatePath("/");
    revalidatePath("/health-awareness");
    return { success: true };
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error) throw error;
    console.error("Error deleting content:", error);
    return { success: false, error: "Failed to delete content" };
  }
}
