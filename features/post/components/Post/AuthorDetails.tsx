import { use, useRef } from "react";
import { PostContext } from ".";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import formatDate from "@/utils/format-date";
import { MdVerified } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import UserClientService from "@/db/services/client/user.service";
import CommunityClientService from "@/db/services/client/community.service";
import { formatUserNameForImage } from "@/utils/format-user_name-for-image";
import { usePathname, useRouter } from "next/navigation";
import FollowButton from "@/features/user/components/FollowButton";
import RelationClientService from "@/db/services/client/relation.service";
import useUserStore from "@/store/user";

const useRelationCount = (userId: string) => {
  const user = useUserStore((state) => state.user);
  const { data: relationCount, isLoading } = useQuery({
    queryKey: ["relations", userId],
    queryFn: () => RelationClientService.getRelationsNumbers(userId),
    enabled: user?.id !== userId,
  });

  return { relationCount, isLoading };
};

const useUser = () => {
  const post = use(PostContext);

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", post?.userId],
    queryFn: () => UserClientService.getUser(post!.userId),
  });

  return { user, isLoading };
};

const useCommunity = () => {
  const post = use(PostContext);

  const { data: community, isLoading } = useQuery({
    queryKey: ["community", post?.communityId],
    queryFn: () => CommunityClientService.getCommunity(post!.communityId!),
    enabled: !!post?.communityId,
  });

  return { community, isLoading };
};

export default function AuthorDetails() {
  const { user } = useUser();
  const { community } = useCommunity();
  const { relationCount } = useRelationCount(user!.id);
  const userRef = useRef<HTMLDivElement>(null);
  const communityRef = useRef<HTMLSpanElement>(null);
  const currentUrl = usePathname();
  const router = useRouter();
  const currentUser = useUserStore((state) => state.user);

  async function handleClickUser(
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) {
    e.stopPropagation();
    router.push(`/user/${user!.id}`);
  }

  async function handleClickCommunity(
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) {
    e.stopPropagation();
    router.push(`/community/${community!.id}`);
  }

  if (!user) return;

  // render this type only if there is no community or its in the community page
  if (!community || currentUrl.includes("community"))
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative" onClick={handleClickUser}>
              <Avatar>
                <AvatarImage src={user.image_url || undefined} />
                <AvatarFallback>
                  {user.user_name?.slice(0, 2).toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              {!relationCount?.isFollowed && user.id !== currentUser?.id && (
                <FollowButton
                  className="rounded-full text-sm font-light absolute bottom-0 right-0 size-4 p-0"
                  userId={user.id}
                >
                  +
                </FollowButton>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-[400px]">
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarImage src={user.image_url || undefined} />
                  <AvatarFallback>
                    {user.user_name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex gap-1 items-center">
                    <p>{user.user_name}</p>
                    {user.premium && <MdVerified />}
                    <p className="text-muted-foreground text-xs">@{user.tag}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Joined {formatDate(user.created_at)}
                  </p>
                </div>
              </div>
              {user.bio && <p className="text-lg">{user.bio}</p>}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="relative block">
            <Avatar onClick={(e) => handleClickCommunity(e)} ref={communityRef}>
              <AvatarImage src={community.image || undefined} />
              <AvatarFallback>
                {formatUserNameForImage(community.name)}
              </AvatarFallback>
            </Avatar>
            <div ref={userRef} className="absolute bottom-0 right-0">
              <Avatar
                onClick={(e) => handleClickUser(e)}
                className="size-[1.3rem] border"
              >
                <AvatarImage src={user.image_url || undefined} />
                <AvatarFallback>
                  {formatUserNameForImage(user.user_name)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-[400px]">
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <Avatar>
                <AvatarImage src={user.image_url || undefined} />
                <AvatarFallback>
                  {formatUserNameForImage(community.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex gap-1 items-center">
                  <p>{community.name}</p>
                  {user.premium && <MdVerified />}
                  <p className="text-muted-foreground text-xs">@{user.tag}</p>
                </div>
                <time className="text-xs text-muted-foreground">
                  Joined {formatDate(user.created_at)}
                </time>
              </div>
            </div>
            {user.bio && <p className="text-lg">{user.bio}</p>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
