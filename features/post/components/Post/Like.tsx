import { formatNumber } from "@/utils/format-number";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { PostContext } from ".";
import { use } from "react";
import useUserStore from "@/store/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LikePostClientService from "@/db/services/client/like.service";

type Like = {
  likes: number;
  userLike: boolean | never[];
};

const useLikesCount = () => {
  const post = use(PostContext);
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<Like>(["likes", post!.id]);

  return { data };
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
  const { data } = useLikesCount();
  const { likePost, isLiking } = useLike();
  const { disLike, isDisliking } = useDislike();
  const validateOrRedirect = useUserStore((state) => state.validateOrRedirect);

  const handleButtonClick = () => {
    validateOrRedirect();
    if (data?.userLike) return disLike();
    return likePost();
  };

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
