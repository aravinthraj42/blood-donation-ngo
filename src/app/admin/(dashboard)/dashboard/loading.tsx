import { Card, CardContent, CardHeader } from "@/components/ui/card";

function SkeletonBox({ className }: { className?: string }) {
  return (
    <div className={`bg-gray-200 rounded animate-pulse ${className ?? ""}`} />
  );
}

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonBox className="h-8 w-36" />
          <SkeletonBox className="h-4 w-52" />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <SkeletonBox className="w-9 h-9 rounded-lg flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <SkeletonBox className="h-3 w-24" />
                  <SkeletonBox className="h-7 w-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Blood group distribution */}
      <Card>
        <CardHeader>
          <SkeletonBox className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="text-center p-3 bg-gray-50 rounded-lg space-y-2">
                <SkeletonBox className="h-5 w-8 mx-auto" />
                <SkeletonBox className="h-8 w-10 mx-auto" />
                <SkeletonBox className="h-3 w-12 mx-auto" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <SkeletonBox className="h-5 w-40" />
            </CardHeader>
            <CardContent>
              <SkeletonBox className="h-64 w-full rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
