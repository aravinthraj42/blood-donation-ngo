import { Card, CardContent } from "@/components/ui/card";

function SkeletonBox({ className }: { className?: string }) {
  return <div className={`bg-gray-200 rounded animate-pulse ${className ?? ""}`} />;
}

export default function RequestsLoading() {
  return (
    <div className="space-y-6">
      <SkeletonBox className="h-8 w-40" />

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBox key={i} className="h-9 w-36 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            <div className="flex items-center gap-4 px-4 py-3">
              {[32, 24, 20, 20, 16, 16].map((w, i) => (
                <SkeletonBox key={i} className={`h-4 w-${w}`} />
              ))}
            </div>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-4">
                <SkeletonBox className="h-4 w-32" />
                <SkeletonBox className="h-4 w-24" />
                <SkeletonBox className="h-4 w-20" />
                <SkeletonBox className="h-5 w-20 rounded-full" />
                <SkeletonBox className="h-5 w-16 rounded-full" />
                <SkeletonBox className="h-8 w-16 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
