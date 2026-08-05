"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { adminUsers, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { headers } from "next/headers";

export interface AuthResult {
  success: boolean;
  error?: string;
}

export async function signIn(data: LoginInput): Promise<AuthResult> {
  const validation = loginSchema.safeParse(data);
  
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0].message,
    };
  }

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (authError) {
    return {
      success: false,
      error: "Invalid email or password",
    };
  }

  if (!authData.user) {
    return {
      success: false,
      error: "Authentication failed",
    };
  }

  // Verify user is an admin
  const [admin] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.authUserId, authData.user.id))
    .limit(1);

  if (!admin) {
    await supabase.auth.signOut();
    return {
      success: false,
      error: "You are not authorized to access the admin panel",
    };
  }

  if (!admin.isActive) {
    await supabase.auth.signOut();
    return {
      success: false,
      error: "Your admin account has been deactivated",
    };
  }

  // Log the login action
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

  return { success: true };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
