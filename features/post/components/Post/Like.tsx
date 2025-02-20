import { formatNumber } from "@/utils/format-number";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { PostContext } from ".";
import { use, useState } from "react";
import useUserStore from "@/store/user";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import likeMutationFunction from "@/features/post/api/like";
import dislikeMutationFunction from "../../api/dislike";

export default function Like() {
  const [post, setPost] = use(PostContext);
  const user = useUserStore((state) => state.user);
  const [isLiked, setIsLiked] = useState(post!.Like.length !== 0);
  const { toast } = useToast();

  if (!post) throw new Error("Post not Found");

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: () => likeMutationFunction(post.id),
    mutationKey: ["likePost", post.id],
    onMutate() {
      setIsLiked(true);
      setPost((prev) => ({
        ...prev!,
        _count: { ...prev!._count, Like: prev!._count.Like + 1 },
        Like: [...prev!.Like, { userId: user!.id }],
      }));
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data,
      });
    },
    onError: (error) => {
      setIsLiked(false);
      setPost((prev) => ({
        ...prev!,
        _count: { ...prev!._count, Like: prev!._count.Like - 1 },
        Like: [...prev!.Like, { userId: user!.id }],
      }));
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const { mutate: dislikePost, isPending: isDisliking } = useMutation({
    mutationFn: () => dislikeMutationFunction(post.id),
    mutationKey: ["dislikePost", post.id],
    onMutate() {
      setIsLiked(false);
      setPost((prev) => ({
        ...prev!,
        _count: { ...prev!._count, Like: prev!._count.Like - 1 },
        Like: [...prev!.Like, { userId: user!.id }],
      }));
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data,
      });
    },
    onError: (error) => {
      setIsLiked(true);
      setPost((prev) => ({
        ...prev!,
        _count: { ...prev!._count, Like: prev!._count.Like + 1 },
        Like: [...prev!.Like, { userId: user!.id }],
      }));
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  return (
    <button
      onClick={() => (isLiked ? dislikePost() : likePost())}
      disabled={isLiking || isDisliking}
    >
      {isLiked ? (
        <div className="flex gap-1 items-center cursor-pointer text-pink-500">
          <FaHeart className="text-pink-500" />
          <p>{formatNumber(post._count.Like)}</p>
        </div>
      ) : (
        <div className="flex gap-1 items-center cursor-pointer">
          <FaRegHeart />
          <p>{formatNumber(post._count.Like)}</p>
        </div>
      )}
    </button>
  );
}
