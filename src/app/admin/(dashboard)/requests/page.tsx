import { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getBloodRequests, getAllBloodGroups } from "@/services/admin";
import { RequestsTable } from "@/components/admin/requests-table";
import { RequestsFilters } from "@/components/admin/requests-filters";
import { PAGINATION } from "@/config/constants";
import type { RequestFilters } from "@/types";

export const metadata: Metadata = {
  title: "Blood Requests",
};

interface RequestsPageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    bloodGroupId?: string;
    urgency?: string;
    status?: string;
  }>;
}

export default async function RequestsPage({ searchParams }: RequestsPageProps) {
  await requireAdmin();
  const params = await searchParams;

  const page = parseInt(params.page || "1", 10);
  const pageSize = parseInt(params.pageSize || String(PAGINATION.DEFAULT_PAGE_SIZE), 10);

  const filters: RequestFilters = {
    search: params.search,
    bloodGroupId: params.bloodGroupId,
    urgency: params.urgency as RequestFilters["urgency"],
    status: params.status as RequestFilters["status"],
  };

  const [requests, bloodGroups] = await Promise.all([
    getBloodRequests(filters, { page, pageSize }),
    getAllBloodGroups(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Blood Requests</h1>
        <p className="text-gray-600">Manage blood donation requests</p>
      </div>

      <RequestsFilters bloodGroups={bloodGroups} currentFilters={filters} />

      <RequestsTable
        requests={requests.data}
        pagination={{
          page: requests.page,
          pageSize: requests.pageSize,
          total: requests.total,
          totalPages: requests.totalPages,
        }}
      />
    </div>
  );
}
