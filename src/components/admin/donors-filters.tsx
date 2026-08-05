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
import type { DonorFilters } from "@/types";

interface BloodGroup {
  id: string;
  name: string;
  displayName: string;
}

interface DonorsFiltersProps {
  bloodGroups: BloodGroup[];
  currentFilters: DonorFilters;
}

export function DonorsFilters({ bloodGroups, currentFilters }: DonorsFiltersProps) {
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
    router.push("/admin/donors");
  };

  const hasFilters =
    currentFilters.search ||
    currentFilters.bloodGroupId ||
    currentFilters.city ||
    currentFilters.donorStatus ||
    currentFilters.verificationStatus ||
    currentFilters.isEligible;

  return (
    <div className="bg-white p-4 rounded-lg border space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search name, phone, email..."
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

        {/* Blood Group */}
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

        {/* Donor Status */}
        <Select<string>
          value={currentFilters.donorStatus || "all"}
          onValueChange={(value) =>
            updateFilter("donorStatus", value === "all" || !value ? undefined : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Donor Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
            <SelectItem value="DEACTIVATED">Deactivated</SelectItem>
          </SelectContent>
        </Select>

        {/* Verification Status */}
        <Select<string>
          value={currentFilters.verificationStatus || "all"}
          onValueChange={(value) =>
            updateFilter("verificationStatus", value === "all" || !value ? undefined : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Verification" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="VERIFIED">Verified</SelectItem>
            <SelectItem value="UNVERIFIED">Unverified</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4">
        {/* City */}
        <Input
          placeholder="Filter by city"
          className="max-w-xs"
          defaultValue={currentFilters.city}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length === 0 || value.length >= 2) {
              updateFilter("city", value || undefined);
            }
          }}
        />

        {/* Eligible Only */}
        <Button
          variant={currentFilters.isEligible ? "default" : "outline"}
          size="sm"
          onClick={() =>
            updateFilter("isEligible", currentFilters.isEligible ? undefined : "true")
          }
        >
          Eligible Only
        </Button>

        {/* Clear Filters */}
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
