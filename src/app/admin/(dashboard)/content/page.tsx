import { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { requireAdmin } from "@/lib/auth";
import { getContent } from "@/services/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTablePagination } from "@/components/admin/data-table-pagination";
import { Plus, Edit, Eye } from "lucide-react";
import { PAGINATION } from "@/config/constants";
import type { ContentFilters } from "@/types";

export const metadata: Metadata = {
  title: "Content Management",
};

interface ContentPageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    category?: string;
    status?: string;
  }>;
}

const categoryColors: Record<string, string> = {
  DOCTOR_MESSAGE: "bg-blue-100 text-blue-700",
  BLOOD_DONATION: "bg-red-100 text-red-700",
  HEALTHCARE: "bg-green-100 text-green-700",
  AWARENESS: "bg-yellow-100 text-yellow-700",
  QUOTE: "bg-purple-100 text-purple-700",
  ANNOUNCEMENT: "bg-orange-100 text-orange-700",
};

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  PUBLISHED: "bg-green-100 text-green-700",
  ARCHIVED: "bg-yellow-100 text-yellow-700",
};

export default async function ContentPage({ searchParams }: ContentPageProps) {
  await requireAdmin();
  const params = await searchParams;

  const page = parseInt(params.page || "1", 10);
  const pageSize = parseInt(params.pageSize || String(PAGINATION.DEFAULT_PAGE_SIZE), 10);

  const filters: ContentFilters = {
    search: params.search,
    category: params.category as ContentFilters["category"],
    status: params.status as ContentFilters["status"],
  };

  const content = await getContent(filters, { page, pageSize });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-600">Manage healthcare content and announcements</p>
        </div>
        <Button asChild>
          <Link href="/admin/content/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Content
          </Link>
        </Button>
      </div>

      {content.data.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 mb-4">No content found.</p>
            <Button asChild>
              <Link href="/admin/content/new">
                <Plus className="w-4 h-4 mr-2" />
                Create First Content
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {content.data.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={categoryColors[item.category]}>
                          {item.category.replace("_", " ")}
                        </Badge>
                        <Badge className={statusColors[item.status]}>
                          {item.status}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {item.publishAt
                          ? `Publish: ${format(new Date(item.publishAt), "dd MMM yyyy")}`
                          : "No publish date"}
                        {" • "}
                        Created: {format(new Date(item.createdAt), "dd MMM yyyy")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/content/${item.id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/content/${item.id}?edit=true`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <DataTablePagination
            page={content.page}
            pageSize={content.pageSize}
            total={content.total}
            totalPages={content.totalPages}
          />
        </>
      )}
    </div>
  );
}
