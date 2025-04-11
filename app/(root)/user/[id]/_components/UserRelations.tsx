import RelationClientService from "@/db/services/client/relation.service";
import { formatNumber } from "@/utils/format-number";
import { useSuspenseQuery } from "@tanstack/react-query";

const useUserRelations = (userId: string) => {
  const { data: relations, isLoading } = useSuspenseQuery({
    queryKey: ["relations", userId],
    queryFn: () => RelationClientService.getRelationsNumbers(userId),
  });

  return { relations, isLoading };
};

export default function UserRelations({ id }: { id: string }) {
  const { relations } = useUserRelations(id);

  return (
    <div className="flex gap-3 mt-4">
      <p className="space-x-1">
        <span className="underline text-muted-foreground">Followers</span>
        <span>{formatNumber(relations?.followers || 0)}</span>
      </p>
      <p>
        <span className="underline text-muted-foreground">Following</span>{" "}
        <span>{formatNumber(relations?.following || 0)}</span>
      </p>
    </div>
  );
}
