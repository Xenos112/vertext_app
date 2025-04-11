import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CommunityClientService from "@/db/services/client/community.service";
import JoinButton from "@/features/community/components/JoinButton";
import formatDate from "@/utils/format-date";
import { type Role } from "@prisma/client";
import { useSuspenseQuery } from "@tanstack/react-query";

const useUserMemberships = (communityId: string) => {
  const { data: community, isLoading } = useSuspenseQuery({
    queryKey: ["community", communityId],
    queryFn: () => CommunityClientService.getCommunity(communityId),
  });

  return { community, isLoading };
};

export default function CommunityMembershipPreview({
  communityId,
  role = "USER",
  createdAt,
}: {
  communityId: string;
  role: Role;
  createdAt: Date;
}) {
  const { community } = useUserMemberships(communityId);

  return (
    <div className="flex items-center gap-3 p-4">
      <Avatar className=" size-16 rounded-xl">
        <AvatarImage
          className="rounded-xl size-16"
          src={community.image || undefined}
          alt={community.name}
        />
        <AvatarFallback className="rounded-xl size-16">N</AvatarFallback>
      </Avatar>
      <div className="w-full flex flex-col gap-1">
        <h1>{community.name}</h1>
        <div>
          <p className="text-muted-foreground text-xs">{role}</p>
          <time className="text-xs text-muted-foreground">
            {formatDate(createdAt)}
          </time>
        </div>
      </div>
      <div>
        <JoinButton communityId={communityId} />
      </div>
    </div>
  );
}
