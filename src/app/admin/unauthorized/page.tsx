import { Metadata } from "next";
import { Shield } from "lucide-react";
import { SignOutButton } from "@/components/admin/sign-out-button";

export const metadata: Metadata = {
  title: "Access Denied | Admin - Blood Connect",
  robots: { index: false, follow: false },
};

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 mb-6">
          <Shield className="w-10 h-10 text-orange-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          You don&apos;t have permission to access the admin panel. Please
          contact your administrator if you believe this is an error.
        </p>
        <SignOutButton />
      </div>
    </div>
  );
}
