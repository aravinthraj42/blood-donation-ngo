import { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getAllSettings as getAdminSettings } from "@/services/admin";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const session = await requireAdmin();
  const settings = await getAdminSettings();

  const isSuperAdmin = session.admin.role === "SUPER_ADMIN";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure application settings</p>
      </div>

      <SettingsForm settings={settings} isSuperAdmin={isSuperAdmin} />
    </div>
  );
}
