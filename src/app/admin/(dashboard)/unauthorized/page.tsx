import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft, LogOut } from "lucide-react";

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
          You don&apos;t have permission to access this resource. Please contact
          your administrator if you believe this is an error.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild>
            <Link href="/admin">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/login">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
