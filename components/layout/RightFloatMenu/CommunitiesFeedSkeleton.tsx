import { Skeleton } from "@/components/ui/skeleton";

export default function CommunitiesFeedSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="w-28 h-4 mb-3" />
      <div className="flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="w-12 h-6" />
        </div>
        <Skeleton className="h-8 w-16" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="w-12 h-6" />
        </div>
        <Skeleton className="h-8 w-16" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="w-12 h-6" />
        </div>
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}
