import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import type { AdminRole } from "@/types";

export interface AdminSession {
  user: {
    id: string;
    email: string;
  };
  admin: {
    id: string;
    email: string;
    fullName: string;
    role: AdminRole;
    isActive: boolean;
  };
}

export async function getSession(): Promise<AdminSession | null> {
  const supabase = await createClient();
  
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // Get admin user from database
  const [admin] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.authUserId, user.id))
    .limit(1);

  if (!admin || !admin.isActive) {
    return null;
  }

  return {
    user: {
      id: user.id,
      email: user.email!,
    },
    admin: {
      id: admin.id,
      email: admin.email,
      fullName: admin.fullName,
      role: admin.role as AdminRole,
      isActive: admin.isActive,
    },
  };
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export async function requireSuperAdmin(): Promise<AdminSession> {
  const session = await requireAdmin();

  if (session.admin.role !== "SUPER_ADMIN") {
    redirect("/admin?error=unauthorized");
  }

  return session;
}

export function hasPermission(
  session: AdminSession,
  requiredRole: AdminRole
): boolean {
  if (requiredRole === "ADMIN") {
    return session.admin.role === "ADMIN" || session.admin.role === "SUPER_ADMIN";
  }
  return session.admin.role === requiredRole;
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
