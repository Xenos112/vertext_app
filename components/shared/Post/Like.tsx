import { formatNumber } from "@/utils/format-number";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { PostContext } from ".";
import { use } from "react";
import useUserStore from "@/store/user";
import { dislike, like } from "@/actions/post.actions";
import { useToast } from "@/hooks/use-toast";

export default function Like() {
  const [postState, setPostState] = use(PostContext);
  const user = useUserStore((state) => state.user);
  const { toast } = useToast();

  const likeHandler = async () => {
    if (postState!.Like.length === 0) {
      setPostState((prev) => ({
        ...prev!,
        _count: { ...prev!._count, Like: prev!._count.Like + 1 },
        Like: [...prev!.Like, { userId: user!.id }],
      }));

      const data = await like(postState!.id);
      if ("error" in data) {
        toast({
          title: "Error",
          variant: "destructive",
          description: `${data.error}`,
        });
      } else {
        toast({
          title: "Success",
          description: `You Have ${data.message} the Post`,
        });
      }
    } else {
      setPostState((prev) => ({
        ...prev!,
        _count: { ...prev!._count, Like: prev!._count.Like - 1 },
        Like: [],
      }));
      const data = await dislike(postState!.id);
      if ("error" in data)
        toast({
          title: "Error",
          variant: "destructive",
          description: data.error,
        });
      else
        toast({
          title: "Success",
          description: `You Have ${data.message} the Post`,
        });
    }
  };
  return (
    <button onClick={likeHandler}>
      {postState!.Like.length !== 0 ? (
        <div className="flex gap-1 items-center cursor-pointer text-pink-500">
          <FaHeart />
          <p>{formatNumber(postState!._count.Like)}</p>
        </div>
      ) : (
        <div className="flex gap-1 items-center cursor-pointer">
          <FaRegHeart />
          <p>{formatNumber(postState!._count.Like)}</p>
        </div>
      )}
    </button>
  );
}
