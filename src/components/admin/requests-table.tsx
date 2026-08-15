"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTablePagination } from "@/components/admin/data-table-pagination";
import { MoreHorizontal, Eye, Edit, AlertTriangle } from "lucide-react";
import { updateRequestStatus } from "@/actions/admin-request";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BloodGroup {
  id: string;
  name: string;
  displayName: string;
}

interface BloodRequest {
  id: string;
  referenceNumber: string;
  requesterName: string;
  patientName: string | null;
  unitsRequired: number;
  hospitalName: string | null;
  requiredDate: string | null;
  contactPhone: string;
  urgency: string;
  status: string;
  createdAt: Date;
  bloodGroup: BloodGroup;
}

interface RequestsTableProps {
  requests: BloodRequest[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONTACTED: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-purple-100 text-purple-700",
  FULFILLED: "bg-green-100 text-green-700",
  CANCELLED: "bg-gray-100 text-gray-700",
};

const urgencyColors: Record<string, string> = {
  NORMAL: "bg-gray-100 text-gray-700",
  URGENT: "bg-orange-100 text-orange-700",
  EMERGENCY: "bg-red-100 text-red-700",
};

export function RequestsTable({ requests, pagination }: RequestsTableProps) {
  const router = useRouter();

  const handleStatusChange = async (
    id: string,
    status: "PENDING" | "CONTACTED" | "IN_PROGRESS" | "FULFILLED" | "CANCELLED"
  ) => {
    const result = await updateRequestStatus(id, status);
    if (result.success) {
      toast.success("Status updated successfully");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update status");
    }
  };

  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-8 text-center">
        <p className="text-gray-500">No blood requests found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Blood Group</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow
                  key={request.id}
                  className={cn(
                    request.urgency === "EMERGENCY" && request.status === "PENDING"
                      ? "bg-red-50"
                      : request.urgency === "URGENT" && request.status === "PENDING"
                      ? "bg-orange-50"
                      : ""
                  )}
                >
                  <TableCell className="font-mono text-sm">
                    {request.referenceNumber}
                  </TableCell>
                  <TableCell className="font-medium">{request.requesterName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-semibold">
                      {request.bloodGroup?.displayName || "-"}
                    </Badge>
                  </TableCell>
                  <TableCell>{request.contactPhone}</TableCell>
                  <TableCell>
                    <Badge className={urgencyColors[request.urgency]}>
                      {request.urgency === "EMERGENCY" && (
                        <AlertTriangle className="w-3 h-3 mr-1" />
                      )}
                      {request.urgency}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[request.status]}>
                      {request.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/admin/requests/${request.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/admin/requests/${request.id}/edit`)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(request.id, "CONTACTED")}
                          disabled={request.status === "CONTACTED"}
                        >
                          Mark as Contacted
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(request.id, "IN_PROGRESS")}
                          disabled={request.status === "IN_PROGRESS"}
                        >
                          Mark In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(request.id, "FULFILLED")}
                          disabled={request.status === "FULFILLED"}
                          className="text-green-600"
                        >
                          Mark as Fulfilled
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(request.id, "CANCELLED")}
                          disabled={request.status === "CANCELLED"}
                          className="text-red-600"
                        >
                          Cancel Request
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <DataTablePagination
        page={pagination.page}
        pageSize={pagination.pageSize}
        total={pagination.total}
        totalPages={pagination.totalPages}
      />
    </div>
  );
}
