import { Metadata } from "next";
import { format } from "date-fns";
import { requireSuperAdmin } from "@/lib/auth";
import { getAdminUsers } from "@/services/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shield, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Users",
};

export default async function AdminUsersPage() {
  await requireSuperAdmin();
  const admins = await getAdminUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Users</h1>
        <p className="text-gray-600">Manage administrator accounts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Administrators</CardTitle>
        </CardHeader>
        <CardContent>
          {admins.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No admin users found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => {
                  const initials = admin.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <TableRow key={admin.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{admin.fullName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            admin.role === "SUPER_ADMIN" ? "default" : "secondary"
                          }
                          className="gap-1"
                        >
                          {admin.role === "SUPER_ADMIN" ? (
                            <ShieldCheck className="w-3 h-3" />
                          ) : (
                            <Shield className="w-3 h-3" />
                          )}
                          {admin.role.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            admin.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }
                        >
                          {admin.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(admin.createdAt), "dd MMM yyyy")}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create New Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            To create a new admin user:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>Create a user in Supabase Authentication dashboard</li>
            <li>Note the user&apos;s UUID from the Auth Users table</li>
            <li>
              Insert a record into the <code className="bg-gray-100 px-1 rounded">admin_users</code> table with the auth_user_id
            </li>
            <li>Set the appropriate role (SUPER_ADMIN or ADMIN)</li>
          </ol>
          <p className="text-xs text-gray-500 mt-4">
            Direct admin creation UI is planned for a future update. For now,
            please use the Supabase dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
