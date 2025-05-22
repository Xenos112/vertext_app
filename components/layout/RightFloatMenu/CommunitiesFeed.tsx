import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import CommunityClientService from "@/db/services/client/community.service";
import JoinButton from "@/features/community/components/JoinButton";
import { formatUserNameForImage } from "@/utils/format-user_name-for-image";
import { useQuery, useSuspenseQueries } from "@tanstack/react-query";
import { Suspense } from "react";

const useCommunitiesFeed = () => {
  const { data: communitiesFeedIds } = useQuery({
    queryKey: ["communitiesFeed"],
    queryFn: () =>
      CommunityClientService.communitiesFeed().then(
        (data) => data.communityFeed,
      ),
  });

  const haveCommunitiesFeed =
    communitiesFeedIds && communitiesFeedIds.length > 0;
  const [...communitiesFeed] = useSuspenseQueries({
    queries: haveCommunitiesFeed
      ? communitiesFeedIds!.map((communityId) => ({
          queryKey: ["community", communityId!],
          queryFn: () => CommunityClientService.getCommunity(communityId),
        }))
      : [],
  });

  return {
    communitiesFeed: communitiesFeed.map((community) => community.data),
  };
};
export default function CommunitiesFeed() {
  const { communitiesFeed } = useCommunitiesFeed();
  return (
    <div>
      <h1 className="font-semibold text-xl mb-3">Communities To Join</h1>
      <div className="flex flex-col gap-3">
        {communitiesFeed.map((community) => (
          <div
            key={community!.id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Avatar className="size-[30px]">
                <AvatarImage src={community!.image as string | undefined} />
                <AvatarFallback className="text-xs">
                  {formatUserNameForImage(community!.name)}
                </AvatarFallback>
              </Avatar>
              <p>{community!.name}</p>
            </div>
            <Suspense fallback={<Skeleton className="h-8 w-20" />}>
              <JoinButton communityId={community!.id} />
            </Suspense>
          </div>
        ))}
      </div>
    </div>
  );
}
