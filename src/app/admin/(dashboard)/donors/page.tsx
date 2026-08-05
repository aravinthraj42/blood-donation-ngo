import { Metadata } from "next";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { getDonors, getAllBloodGroups } from "@/services/admin";
import { DonorsTable } from "@/components/admin/donors-table";
import { DonorsFilters } from "@/components/admin/donors-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { PAGINATION } from "@/config/constants";
import type { DonorFilters } from "@/types";

export const metadata: Metadata = {
  title: "Donors",
};

interface DonorsPageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    bloodGroupId?: string;
    city?: string;
    district?: string;
    donorStatus?: string;
    verificationStatus?: string;
    isEligible?: string;
  }>;
}

export default async function DonorsPage({ searchParams }: DonorsPageProps) {
  await requireAdmin();
  const params = await searchParams;

  const page = parseInt(params.page || "1", 10);
  const pageSize = parseInt(params.pageSize || String(PAGINATION.DEFAULT_PAGE_SIZE), 10);

  const filters: DonorFilters = {
    search: params.search,
    bloodGroupId: params.bloodGroupId,
    city: params.city,
    district: params.district,
    donorStatus: params.donorStatus as DonorFilters["donorStatus"],
    verificationStatus: params.verificationStatus as DonorFilters["verificationStatus"],
    isEligible: params.isEligible === "true",
  };

  const [donors, bloodGroups] = await Promise.all([
    getDonors(filters, { page, pageSize }),
    getAllBloodGroups(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Donors</h1>
        <p className="text-gray-600">
          Manage registered blood donors
        </p>
      </div>

      <DonorsFilters bloodGroups={bloodGroups} currentFilters={filters} />

      <Suspense fallback={<TableSkeleton />}>
        <DonorsTable
          donors={donors.data}
          pagination={{
            page: donors.page,
            pageSize: donors.pageSize,
            total: donors.total,
            totalPages: donors.totalPages,
          }}
          bloodGroups={bloodGroups}
        />
      </Suspense>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}
