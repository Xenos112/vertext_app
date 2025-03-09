import { Button, ButtonProps } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getRelationQuery from "../api/getRelationQuery";
import followUserMutation from "../api/followUserMutation";
import { FiLoader } from "react-icons/fi";
import unfollowUserMutation from "../api/unFollowUserMutation";

type FollowButtonProps = ButtonProps & { userId: string };

export default function FollowButton({ userId, ...props }: FollowButtonProps) {
  const queryClient = useQueryClient();
  const { data: queryData, isPending: isQuering } = useQuery({
    queryKey: ["userRelation", userId],
    queryFn: () => getRelationQuery(userId),
  });

  const { mutate: follow, isPending: isFollowing } = useMutation({
    mutationKey: ["follow", userId],
    mutationFn: () => followUserMutation(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userRelation", userId] });
    },
    onError: (error: Error) => {
      console.log("ERROR_FOLLOW_USER " + error);
      document.dispatchEvent(
        new CustomEvent("toast-message", {
          detail: { description: error.message, variant: "destructive" },
        }),
      );
    },
  });

  const { mutate: unfollow, isPending: isUnFollowing } = useMutation({
    mutationKey: ["follow", userId],
    mutationFn: () => unfollowUserMutation(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userRelation", userId] });
    },
    onError: (error: Error) => {
      console.log("ERROR_FOLLOW_USER " + error);
      document.dispatchEvent(
        new CustomEvent("toast-message", {
          detail: { description: error.message, variant: "destructive" },
        }),
      );
    },
  });

  return (
    <Button
      onClick={() => (queryData?.followerId ? unfollow() : follow())}
      {...props}
      disabled={isQuering || isFollowing || isUnFollowing}
    >
      {isFollowing && <FiLoader />}
      {isUnFollowing && <FiLoader />}
      {queryData?.followerId ? "UnFollow" : "Follow"}
    </Button>
  );
}
