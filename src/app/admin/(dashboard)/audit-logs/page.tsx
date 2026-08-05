import { Metadata } from "next";
import { format } from "date-fns";
import { requireSuperAdmin } from "@/lib/auth";
import { getAuditLogs } from "@/services/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/admin/data-table-pagination";
import { PAGINATION } from "@/config/constants";

export const metadata: Metadata = {
  title: "Audit Logs",
};

interface AuditLogsPageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
  }>;
}

const actionColors: Record<string, string> = {
  ADMIN_LOGIN: "bg-blue-100 text-blue-700",
  DONOR_CREATED: "bg-green-100 text-green-700",
  DONOR_UPDATED: "bg-yellow-100 text-yellow-700",
  DONOR_VERIFIED: "bg-purple-100 text-purple-700",
  DONOR_DEACTIVATED: "bg-red-100 text-red-700",
  DONOR_ACTIVATED: "bg-green-100 text-green-700",
  REQUEST_CREATED: "bg-blue-100 text-blue-700",
  REQUEST_UPDATED: "bg-yellow-100 text-yellow-700",
  REQUEST_STATUS_CHANGED: "bg-orange-100 text-orange-700",
  CONTENT_CREATED: "bg-green-100 text-green-700",
  CONTENT_UPDATED: "bg-yellow-100 text-yellow-700",
  CONTENT_PUBLISHED: "bg-purple-100 text-purple-700",
  CONTENT_DELETED: "bg-red-100 text-red-700",
  ADMIN_CREATED: "bg-blue-100 text-blue-700",
  ADMIN_ROLE_CHANGED: "bg-orange-100 text-orange-700",
  ADMIN_DEACTIVATED: "bg-red-100 text-red-700",
  SETTINGS_UPDATED: "bg-gray-100 text-gray-700",
};

export default async function AuditLogsPage({ searchParams }: AuditLogsPageProps) {
  await requireSuperAdmin();
  const params = await searchParams;

  const page = parseInt(params.page || "1", 10);
  const pageSize = parseInt(params.pageSize || String(PAGINATION.DEFAULT_PAGE_SIZE), 10);

  const logs = await getAuditLogs({ page, pageSize });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-gray-600">Track all administrative actions</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {logs.data.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No audit logs found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity Type</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.data.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(log.createdAt), "dd MMM yyyy, HH:mm:ss")}
                      </TableCell>
                      <TableCell>
                        {log.admin?.fullName || "System"}
                      </TableCell>
                      <TableCell>
                        <Badge className={actionColors[log.action] || "bg-gray-100 text-gray-700"}>
                          {log.action.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">
                        {log.entityType?.replace(/_/g, " ") || "-"}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {log.ipAddress || "-"}
                      </TableCell>
                      <TableCell>
                        {log.metadata ? (
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {JSON.stringify(log.metadata).slice(0, 50)}
                            {JSON.stringify(log.metadata).length > 50 && "..."}
                          </code>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <DataTablePagination
        page={logs.page}
        pageSize={logs.pageSize}
        total={logs.total}
        totalPages={logs.totalPages}
      />
    </div>
  );
}
