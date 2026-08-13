import { Card, CardContent } from "@/components/ui/card";

function SkeletonBox({ className }: { className?: string }) {
  return <div className={`bg-gray-200 rounded animate-pulse ${className ?? ""}`} />;
}

export default function DonorsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SkeletonBox className="h-8 w-24" />
        <SkeletonBox className="h-9 w-36 rounded-lg" />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBox key={i} className="h-9 w-36 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {/* Header row */}
            <div className="flex items-center gap-4 px-4 py-3">
              {[40, 28, 20, 16, 20, 16].map((w, i) => (
                <SkeletonBox key={i} className={`h-4 w-${w} flex-shrink-0`} />
              ))}
            </div>
            {/* Data rows */}
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-4">
                <SkeletonBox className="h-4 w-40" />
                <SkeletonBox className="h-4 w-28" />
                <SkeletonBox className="h-4 w-20" />
                <SkeletonBox className="h-5 w-16 rounded-full" />
                <SkeletonBox className="h-5 w-20 rounded-full" />
                <SkeletonBox className="h-8 w-16 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
