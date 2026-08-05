"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AdminData {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
}

interface UseAdminReturn {
  user: User | null;
  admin: AdminData | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export function useAdmin(): UseAdminReturn {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialized = useRef(false);

  const supabase = createClient();

  const fetchAdminData = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/me");
      if (response.ok) {
        const data = await response.json();
        setAdmin(data.admin);
        setError(null);
      } else {
        setAdmin(null);
        setError("Not authorized as admin");
      }
    } catch {
      setAdmin(null);
      setError("Failed to fetch admin data");
    }
  }, []);

  const refreshSession = useCallback(async () => {
    setLoading(true);
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    
    if (authUser) {
      setUser(authUser);
      await fetchAdminData();
    } else {
      setUser(null);
      setAdmin(null);
    }
    setLoading(false);
  }, [supabase.auth, fetchAdminData]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    refreshSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);
        await fetchAdminData();
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setAdmin(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth, fetchAdminData, refreshSession]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAdmin(null);
  }, [supabase.auth]);

  return {
    user,
    admin,
    loading,
    error,
    signOut,
    refreshSession,
  };
}
