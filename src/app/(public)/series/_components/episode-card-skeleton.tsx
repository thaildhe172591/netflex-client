import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function EpisodeCardSkeleton() {
  return (
    <div className="w-[280px] flex-shrink-0">
      <Card className="overflow-hidden p-0 gap-2 rounded-lg">
        <Skeleton className="aspect-video w-full  rounded-b-none" />
        <div className="p-3 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      </Card>
    </div>
  );
}
