import { Button, ButtonProps } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FiLoader } from "react-icons/fi";
import RelationClientService from "@/db/services/client/relation.service";
import useUserStore from "@/store/user";
import { useRouter } from "next/navigation";
import sendToastEvent from "@/utils/sendToastEvent";
import { Skeleton } from "@/components/ui/skeleton";

type FollowButtonProps = ButtonProps & { userId: string };
type RelationCount = {
  isFollowed: boolean;
  followers: number;
  following: number;
};

const useRelationCount = (userId: string) => {
  const { data: relationCount, isLoading } = useQuery({
    queryKey: ["relations", userId],
    queryFn: () => RelationClientService.getRelationsNumbers(userId),
  });

  return { relationCount, isLoading };
};

const useFollow = (userId: string) => {
  const queryClient = useQueryClient();
  const { mutate: follow, isPending: isFollowing } = useMutation({
    mutationKey: ["follow", userId],
    mutationFn: () => RelationClientService.createRelation(userId),
    onMutate() {
      queryClient.setQueryData<RelationCount>(
        ["relations", userId],
        (oldData) => ({
          ...oldData!,
          isFollowed: true,
          followers: oldData!.followers + 1,
        }),
      );
    },
    onError() {
      queryClient.setQueryData<RelationCount>(
        ["relations", userId],
        (oldData) => ({
          ...oldData!,
          isFollowed: false,
          followers: oldData!.followers - 1,
        }),
      );
    },
  });

  return { follow, isFollowing };
};

const useUnfollow = (userId: string) => {
  const queryClient = useQueryClient();
  const { mutate: unfollow, isPending: isUnfollowing } = useMutation({
    mutationKey: ["follow", userId],
    mutationFn: () => RelationClientService.removeRelation(userId),
    onMutate() {
      queryClient.setQueryData<RelationCount>(
        ["relations", userId],
        (oldData) => ({
          ...oldData!,
          isFollowed: true,
          followers: oldData!.followers - 1,
        }),
      );
    },
    onError() {
      queryClient.setQueryData<RelationCount>(
        ["relations", userId],
        (oldData) => ({
          ...oldData!,
          isFollowed: false,
          followers: oldData!.followers + 1,
        }),
      );
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["relations", userId] });
    },
  });

  return { unfollow, isUnfollowing };
};

export default function FollowButton({ userId, ...props }: FollowButtonProps) {
  const { relationCount, isLoading } = useRelationCount(userId);
  const { follow, isFollowing } = useFollow(userId);
  const { unfollow, isUnfollowing } = useUnfollow(userId);
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  const handleButtonClick = () => {
    if (!user) {
      sendToastEvent({
        title: "Error",
        description: "You need to login to follow someone",
        variant: "destructive",
      });
      router.push("/login");
    }
    if (relationCount?.isFollowed) return unfollow();
    return follow();
  };

  if (isLoading)
    return (
      <div>
        <Skeleton className="h-8 w-20" />
      </div>
    );

  return (
    <Button
      onClick={handleButtonClick}
      {...props}
      disabled={isLoading || isFollowing || isUnfollowing}
    >
      {(isFollowing || isUnfollowing) && <FiLoader />}
      {relationCount?.isFollowed ? "UnFollow" : "Follow"}
    </Button>
  );
}
