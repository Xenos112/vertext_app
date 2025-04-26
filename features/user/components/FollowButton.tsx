import { Button, ButtonProps } from "@/components/ui/button";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { FiLoader } from "react-icons/fi";
import RelationClientService from "@/db/services/client/relation.service";
import useUserStore from "@/store/user";
import { useRouter } from "next/navigation";
import sendToastEvent from "@/utils/sendToastEvent";

type FollowButtonProps = ButtonProps & { userId: string };
type RelationCount = {
  isFollowed: boolean;
  followers: number;
  following: number;
};

const useRelationCount = (userId: string) => {
  const { data: relationCount, isLoading } = useSuspenseQuery({
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
  const { relationCount } = useRelationCount(userId);
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

  return (
    <Button
      onClick={handleButtonClick}
      {...props}
      disabled={isFollowing || isUnfollowing}
    >
      {(isFollowing || isUnfollowing) && <FiLoader />}
      {relationCount?.isFollowed ? "UnFollow" : "Follow"}
    </Button>
  );
}
