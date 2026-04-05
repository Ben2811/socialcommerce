import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/features/shared/utils/cn";

export function ProductCardSkeleton() {
  return (
    <div
      className={cn(
        "w-full rounded-lg overflow-hidden",
        "bg-card border border-border",
        "flex flex-col"
      )}
    >
      <Skeleton className="h-[200px] w-full rounded-none" />

      <div className="flex-1 flex flex-col p-4 gap-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>

        <div className="pt-3 border-t border-border space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />
            <Skeleton className="h-3 w-1/2 flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
}