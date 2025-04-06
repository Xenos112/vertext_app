import { formatNumber } from "@/utils/format-number";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { PostContext } from ".";
import { use } from "react";
import useUserStore from "@/store/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LikePostClientService from "@/db/services/client/like.service";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

type Like = {
  likes: number;
  userLike: boolean | never[];
};

const useLikesCount = () => {
  const post = use(PostContext);

  const { data, isLoading } = useQuery({
    queryKey: ["likes", post!.id],
    queryFn: () => LikePostClientService.getPostLikes(post!.id),
  });

  return { data, isLoading };
};

const useLike = () => {
  const post = use(PostContext);
  const queryClient = useQueryClient();

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: () => LikePostClientService.likePost(post!.id),
    mutationKey: ["likePost", post!.id],
    onMutate: () => {
      queryClient.setQueryData<Like>(["likes", post!.id], (oldData) => ({
        ...oldData,
        likes: oldData!.likes + 1,
        userLike: true,
      }));
    },
    onError: () => {
      queryClient.setQueryData<Like>(["likes", post!.id], (oldData) => ({
        ...oldData,
        likes: oldData!.likes - 1,
        userLike: false,
      }));
    },
  });
  return { likePost, isLiking };
};

const useDislike = () => {
  const post = use(PostContext);
  const queryClient = useQueryClient();

  const { mutate: disLike, isPending: isDisliking } = useMutation({
    mutationFn: () => LikePostClientService.DislikePost(post!.id),
    mutationKey: ["dislikePost", post!.id],
    onMutate: () => {
      queryClient.setQueryData<Like>(["likes", post!.id], (oldData) => ({
        ...oldData,
        likes: oldData!.likes - 1,
        userLike: false,
      }));
    },
    onError: () => {
      queryClient.setQueryData<Like>(["likes", post!.id], (oldData) => ({
        ...oldData,
        likes: oldData!.likes + 1,
        userLike: true,
      }));
    },
  });
  return { disLike, isDisliking };
};

export default function Like() {
  const { data, isLoading } = useLikesCount();
  const { likePost, isLiking } = useLike();
  const { disLike, isDisliking } = useDislike();
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const handleButtonClick = () => {
    if (!user) return router.push("/login");
    if (data?.userLike) return disLike();
    return likePost();
  };

  if (isLoading)
    return (
      <div>
        <Skeleton className="h-6 w-6" />
      </div>
    );

  return (
    <button
      onClick={() => handleButtonClick()}
      disabled={isLiking || isDisliking}
    >
      {data?.userLike ? (
        <div className="flex gap-1 items-center cursor-pointer text-pink-500">
          <FaHeart className="text-pink-500" />
          <p>{formatNumber(data?.likes || 0)}</p>
        </div>
      ) : (
        <div className="flex gap-1 items-center cursor-pointer">
          <FaRegHeart />
          <p>{formatNumber(data?.likes || 0)}</p>
        </div>
      )}
    </button>
  );
}
