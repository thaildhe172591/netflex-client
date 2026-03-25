"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function SerieCardSkeleton() {
  return (
    <div className="space-y-3">
      <div className="aspect-[2/3] relative overflow-hidden rounded-2xl border border-white/10">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Skeleton className="h-5 w-10 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

export function SerieGridSkeleton({ count = 24 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-0">
      {Array.from({ length: count }).map((_, index) => (
        <SerieCardSkeleton key={index} />
      ))}
    </div>
  );
}
