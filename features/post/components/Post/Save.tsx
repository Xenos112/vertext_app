import { useToast } from "@/hooks/use-toast";
import { formatNumber } from "@/utils/format-number";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import { use, useState } from "react";
import { PostContext } from ".";
import useUserStore from "@/store/user";
import saveMutationFunction from "../../api/save";
import { useMutation } from "@tanstack/react-query";
import unsaveMutationFunction from "../../api/unsave";

export default function Save() {
  const [post, setPost] = use(PostContext);
  const user = useUserStore((state) => state.user);
  const [isSaved, setIsSaved] = useState(post!.Save.length !== 0);
  const { toast } = useToast();

  if (!post) throw new Error("Post not found");

  const { mutate: savePost, isPending: isSaving } = useMutation({
    mutationFn: () => saveMutationFunction(post.id),
    mutationKey: ["savePost", post.id],
    onMutate() {
      setIsSaved(true);
      setPost((prev) => ({
        ...prev!,
        _count: { ...prev!._count, Save: prev!._count.Save + 1 },
        Save: [...prev!.Save, { userId: user!.id }],
      }));
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data,
      });
    },
    onError: (error) => {
      setIsSaved(false);
      setPost((prev) => ({
        ...prev!,
        _count: { ...prev!._count, Save: prev!._count.Save - 1 },
        Save: [...prev!.Save, { userId: user!.id }],
      }));
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const { mutate: unsavePost, isPending: isUnsaving } = useMutation({
    mutationFn: () => unsaveMutationFunction(post.id),
    mutationKey: ["unsavePost", post.id],
    onMutate() {
      setIsSaved(false);
      setPost((prev) => ({
        ...prev!,
        _count: { ...prev!._count, Save: prev!._count.Save - 1 },
        Save: [...prev!.Save, { userId: user!.id }],
      }));
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data,
      });
    },
    onError: (error) => {
      setIsSaved(true);
      setPost((prev) => ({
        ...prev!,
        _count: { ...prev!._count, Save: prev!._count.Save + 1 },
        Save: [...prev!.Save, { userId: user!.id }],
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
      onClick={() => (isSaved ? unsavePost() : savePost())}
      disabled={isSaving || isUnsaving}
    >
      {isSaved ? (
        <div className="flex gap-1 items-center text-yellow-500 cursor-pointer">
          <IoBookmark />
          <p>{formatNumber(post._count.Save)}</p>
        </div>
      ) : (
        <div className="flex gap-1 items-center cursor-pointer">
          <IoBookmarkOutline />
          <p>{formatNumber(post._count.Save)}</p>
        </div>
      )}
    </button>
  );
}
