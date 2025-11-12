import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const NewsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Featured Article Skeleton */}
      <Card className="lg:col-span-3 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          <Skeleton className="h-[400px] w-full" />
          <div className="p-8 flex flex-col justify-center">
            <Skeleton className="h-6 w-24 mb-4" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-20 w-full mb-6" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Grid Articles Skeleton */}
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <div className="p-6">
            <Skeleton className="h-5 w-20 mb-3" />
            <Skeleton className="h-8 w-full mb-3" />
            <Skeleton className="h-16 w-full mb-4" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-3 w-24 mb-2" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
