"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import type { RequestFilters } from "@/types";

interface BloodGroup {
  id: string;
  name: string;
  displayName: string;
}

interface RequestsFiltersProps {
  bloodGroups: BloodGroup[];
  currentFilters: RequestFilters;
}

export function RequestsFilters({ bloodGroups, currentFilters }: RequestsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/admin/requests");
  };

  const hasFilters =
    currentFilters.search ||
    currentFilters.bloodGroupId ||
    currentFilters.urgency ||
    currentFilters.status;

  return (
    <div className="bg-white p-4 rounded-lg border space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search requester, patient, phone, reference..."
            className="pl-9"
            defaultValue={currentFilters.search}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length === 0 || value.length >= 2) {
                updateFilter("search", value || undefined);
              }
            }}
          />
        </div>

        <Select<string>
          value={currentFilters.bloodGroupId || "all"}
          onValueChange={(value) =>
            updateFilter("bloodGroupId", value === "all" || !value ? undefined : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Blood Group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Blood Groups</SelectItem>
            {bloodGroups.map((bg) => (
              <SelectItem key={bg.id} value={bg.id}>
                {bg.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select<string>
          value={currentFilters.urgency || "all"}
          onValueChange={(value) =>
            updateFilter("urgency", value === "all" || !value ? undefined : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Urgency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Urgency</SelectItem>
            <SelectItem value="NORMAL">Normal</SelectItem>
            <SelectItem value="URGENT">Urgent</SelectItem>
            <SelectItem value="EMERGENCY">Emergency</SelectItem>
          </SelectContent>
        </Select>

        <Select<string>
          value={currentFilters.status || "all"}
          onValueChange={(value) =>
            updateFilter("status", value === "all" || !value ? undefined : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="CONTACTED">Contacted</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="FULFILLED">Fulfilled</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="w-4 h-4 mr-1" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}
