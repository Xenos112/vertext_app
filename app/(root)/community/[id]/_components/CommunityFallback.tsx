import { Skeleton } from "@/components/ui/skeleton";

export default function CommunityFallback() {
  return (
    <div className="flex flex-col">
      <Skeleton className="w-full h-80" />
      <div className="flex ml-auto m-3">
        <Skeleton className="w-16 h-8" />
      </div>
      <Skeleton className="size-[130px] rounded-xl -translate-y-full mx-3" />
      <div className="flex flex-col -translate-y-full gap-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3 w-52" />
        <Skeleton className="h-3 w-52" />
      </div>
    </div>
  );
}
