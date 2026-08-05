import { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { ContentForm } from "@/components/admin/content-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Create Content",
};

export default async function NewContentPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/content">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Content</h1>
          <p className="text-gray-600">Add new healthcare content or announcement</p>
        </div>
      </div>

      <ContentForm />
    </div>
  );
}
