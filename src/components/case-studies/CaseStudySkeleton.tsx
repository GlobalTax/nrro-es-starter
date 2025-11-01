import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const CaseStudySkeleton = ({ variant = 'grid' }: { variant?: 'grid' | 'list' }) => {
  if (variant === 'list') {
    return (
      <Card className="overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <Skeleton className="md:w-1/3 h-64 md:h-auto" />
          <div className="flex-1 p-6 md:p-8 space-y-4">
            <Skeleton className="h-8 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-12 w-24" />
              <Skeleton className="h-12 w-24" />
              <Skeleton className="h-12 w-24" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[16/9] w-full" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="grid grid-cols-3 gap-3 pt-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </Card>
  );
};
