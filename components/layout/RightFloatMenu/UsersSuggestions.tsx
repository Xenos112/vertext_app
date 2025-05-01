import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import RelationClientService from "@/db/services/client/relation.service";
import UserClientService from "@/db/services/client/user.service";
import FollowButton from "@/features/user/components/FollowButton";
import { formatUserNameForImage } from "@/utils/format-user_name-for-image";
import { useQueries, useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";

const useUserFeed = () => {
  const { data: userFeed } = useSuspenseQuery({
    queryKey: ["userFeed"],
    queryFn: UserClientService.getUserFeed,
    staleTime: Infinity,
  });

  const usersData = useQueries({
    queries: userFeed
      ? userFeed.map((id) => ({
          queryKey: ["user", id],
          queryFn: () => UserClientService.getUser(id),
          enabled: !!id,
        }))
      : [],
  });

  // only to fetch relations using Promise.all to make it more efficient
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _usersRelations = useQueries({
    queries: userFeed
      ? userFeed.map((id) => ({
          queryKey: ["relations", id],
          queryFn: () => RelationClientService.getRelationsNumbers(id),
          enabled: !!id,
        }))
      : [],
  });

  const users = usersData.map((user) => user.data);
  const existingUsers = users.filter((user) => user?.id);
  return { users: existingUsers };
};

export default function UsersSuggestions() {
  const { users } = useUserFeed();

  if (users.length === 0) return <div></div>;
  return (
    <div>
      <h1 className="font-semibold text-xl mb-3">Who to follow</h1>
      <div className="flex flex-col gap-3">
        {users.map((user) => (
          <div key={user!.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="size-[30px]">
                <AvatarImage src={user!.image_url as string | undefined} />
                <AvatarFallback className="text-xs">
                  {formatUserNameForImage(user!.user_name)}
                </AvatarFallback>
              </Avatar>
              <p>{user!.user_name}</p>
            </div>
            <Suspense fallback={<Skeleton className="h-8 w-20" />}>
              <FollowButton userId={user!.id} />
            </Suspense>
          </div>
        ))}
      </div>
    </div>
  );
}
