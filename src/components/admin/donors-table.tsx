"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
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
import { MoreHorizontal, Eye, Edit, CheckCircle, XCircle, UserCheck } from "lucide-react";
import { updateDonorStatus, verifyDonor } from "@/actions/admin-donor";
import { toast } from "sonner";

interface BloodGroup {
  id: string;
  name: string;
  displayName: string;
}

interface Donor {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  city: string | null;
  district: string | null;
  lastDonationDate: string | null;
  nextEligibleDate: string | null;
  donorStatus: string;
  verificationStatus: string;
  createdAt: Date;
  bloodGroup: BloodGroup;
}

interface DonorsTableProps {
  donors: Donor[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  bloodGroups: BloodGroup[];
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  ACTIVE: "bg-green-100 text-green-700",
  INACTIVE: "bg-gray-100 text-gray-700",
  DEACTIVATED: "bg-red-100 text-red-700",
};

const verificationColors: Record<string, string> = {
  VERIFIED: "bg-blue-100 text-blue-700",
  UNVERIFIED: "bg-orange-100 text-orange-700",
};

export function DonorsTable({ donors, pagination }: DonorsTableProps) {
  const router = useRouter();

  const handleStatusChange = async (
    id: string,
    status: "ACTIVE" | "INACTIVE" | "DEACTIVATED"
  ) => {
    const result = await updateDonorStatus(id, status);
    if (result.success) {
      toast.success(`Donor ${status.toLowerCase()} successfully`);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update status");
    }
  };

  const handleVerify = async (id: string) => {
    const result = await verifyDonor(id);
    if (result.success) {
      toast.success("Donor verified successfully");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to verify donor");
    }
  };

  if (donors.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-8 text-center">
        <p className="text-gray-500">No donors found matching your criteria.</p>
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
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Blood Group</TableHead>
                <TableHead>Last Donation</TableHead>
                <TableHead>Next Eligible</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donors.map((donor) => {
                const isEligible =
                  donor.nextEligibleDate &&
                  new Date(donor.nextEligibleDate) <= new Date();

                return (
                  <TableRow key={donor.id}>
                    <TableCell className="font-medium">{donor.fullName}</TableCell>
                    <TableCell className="text-sm">{donor.phone}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-semibold">
                        {donor.bloodGroup?.displayName || "-"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {donor.lastDonationDate
                        ? format(new Date(donor.lastDonationDate), "dd MMM yyyy")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {donor.nextEligibleDate ? (
                        <span className={isEligible ? "text-green-600" : "text-orange-600"}>
                          {format(new Date(donor.nextEligibleDate), "dd MMM yyyy")}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[donor.donorStatus]}>
                        {donor.donorStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={verificationColors[donor.verificationStatus]}>
                        {donor.verificationStatus}
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
                            onClick={() => router.push(`/admin/donors/${donor.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/admin/donors/${donor.id}/edit`)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {donor.verificationStatus === "UNVERIFIED" && (
                            <DropdownMenuItem onClick={() => handleVerify(donor.id)}>
                              <UserCheck className="w-4 h-4 mr-2" />
                              Verify Donor
                            </DropdownMenuItem>
                          )}
                          {donor.donorStatus !== "ACTIVE" && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(donor.id, "ACTIVE")}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Activate
                            </DropdownMenuItem>
                          )}
                          {donor.donorStatus === "ACTIVE" && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(donor.id, "INACTIVE")}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Set Inactive
                            </DropdownMenuItem>
                          )}
                          {donor.donorStatus !== "DEACTIVATED" && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(donor.id, "DEACTIVATED")}
                              className="text-red-600"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Deactivate
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
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
