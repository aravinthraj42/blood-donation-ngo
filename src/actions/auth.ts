"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { adminUsers, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { headers } from "next/headers";

export interface AuthResult {
  success: boolean;
  error?: string;
}

export async function signIn(data: LoginInput): Promise<AuthResult> {
  try {
    console.log("[signIn] step: validation");
    const validation = loginSchema.safeParse(data);

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors[0].message,
      };
    }

    console.log("[signIn] step: createClient");
    const supabase = await createClient();

    console.log("[signIn] step: signInWithPassword");
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      console.error("[signIn] Supabase auth error:", authError.message, authError.status);
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    if (!authData.user) {
      console.error("[signIn] No user returned from Supabase");
      return {
        success: false,
        error: "Authentication failed",
      };
    }

    console.log("[signIn] step: query admin_users for id", authData.user.id);

    // Verify user is an admin
    let admin;
    try {
      const result = await db
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.authUserId, authData.user.id))
        .limit(1);
      admin = result[0];
    } catch (dbErr) {
      console.error("[signIn] DB error querying admin_users:", dbErr instanceof Error ? dbErr.message : dbErr);
      try { await supabase.auth.signOut(); } catch { /* ignore */ }
      return {
        success: false,
        error: "Unable to verify admin access. Please try again.",
      };
    }

    if (!admin) {
      console.error("[signIn] No admin_users record found for auth id", authData.user.id);
      try { await supabase.auth.signOut(); } catch { /* ignore */ }
      return {
        success: false,
        error: "You are not authorized to access the admin panel",
      };
    }

    if (!admin.isActive) {
      try { await supabase.auth.signOut(); } catch { /* ignore */ }
      return {
        success: false,
        error: "Your admin account has been deactivated",
      };
    }

    // Log the login action — non-blocking, never fail the login if audit log fails
    try {
      const headersList = await headers();
      const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
      await db.insert(auditLogs).values({
        adminId: admin.id,
        action: "ADMIN_LOGIN",
        entityType: "admin_user",
        entityId: admin.id,
        ipAddress: ip.split(",")[0].trim(),
        metadata: {
          email: admin.email,
          userAgent: headersList.get("user-agent"),
        },
      });
    } catch {
      // Audit log failure should never block a successful login
    }

    console.log("[signIn] success for admin", admin.email);
    // Revalidate the entire layout so Next.js router cache reflects the new session
    revalidatePath("/", "layout");
    return { success: true };
  } catch (err) {
    // redirect() and notFound() throw special Next.js errors — re-throw them so they work correctly
    if (
      err instanceof Error &&
      (err.message === "NEXT_REDIRECT" || err.message.includes("NEXT_NOT_FOUND"))
    ) {
      throw err;
    }
    console.error("[signIn] Unexpected outer error:", err instanceof Error ? err.message : err);
    return {
      success: false,
      error: "An error occurred during sign in. Please try again.",
    };
  }
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
