import { Suspense } from "react";
import { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";
import { Heart, Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Login | Blood Connect",
  description: "Sign in to the admin dashboard",
};

function LoginFormFallback() {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Heart className="w-8 h-8 text-primary" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-gray-600 mt-2">
            Sign in to access the dashboard
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <Suspense fallback={<LoginFormFallback />}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          This area is restricted to authorized administrators only.
        </p>
      </div>
    </div>
  );
}
