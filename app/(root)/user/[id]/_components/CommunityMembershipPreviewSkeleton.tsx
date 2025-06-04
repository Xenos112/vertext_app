import { Skeleton } from "@/components/ui/skeleton";

export default function CommunityMembershipPreviewSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 w-full">
      <div>
        <Skeleton className="rounded-xl size-16" />
      </div>
      <div className="w-full flex flex-col gap-1">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-20 h-3" />
        <Skeleton className="w-16 h-3" />
      </div>
      <div>
        <Skeleton className="w-16 h-8" />
      </div>
    </div>
  );
}
