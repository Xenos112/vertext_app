import { Skeleton } from "@/components/ui/skeleton";

export default function AuthorSkeleton() {
  return (
    <div className="flex gap-2 items-center">
      <div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex gap-2 items-center">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-2 w-20" />
        </div>
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}
