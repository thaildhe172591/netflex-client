"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SerieCardSkeleton() {
  return (
    <Card className="overflow-hidden p-0 rounded-md gap-2">
      <div className="aspect-[4/5] relative overflow-hidden rounded-t-md">
        <Skeleton className="w-full h-full" />
        <div className="absolute bottom-1 right-1">
          <Skeleton className="h-5 w-16 rounded-sm" />
        </div>
      </div>
      <div className="p-2 pt-0 space-y-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-20" />
      </div>
    </Card>
  );
}

export function SerieGridSkeleton({ count = 24 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-0">
      {Array.from({ length: count }).map((_, index) => (
        <SerieCardSkeleton key={index} />
      ))}
    </div>
  );
}
