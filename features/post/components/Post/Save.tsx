import { formatNumber } from "@/utils/format-number";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import { use } from "react";
import { PostContext } from ".";
import useUserStore from "@/store/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SavePostClientService from "@/db/services/client/save.service";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

type Save = {
  saves: number;
  userSave: boolean;
};

const useSaveCount = () => {
  const post = use(PostContext);

  const { data, isLoading } = useQuery({
    queryKey: ["saves", post!.id],
    queryFn: () => SavePostClientService.getPostSaves(post!.id),
  });

  return { data, isLoading };
};

const useSave = () => {
  const post = use(PostContext);
  const queryClient = useQueryClient();

  const { mutate: savePost, isPending: isSaving } = useMutation({
    mutationFn: () => SavePostClientService.savePost(post!.id),
    mutationKey: ["savePost", post!.id],
    onMutate: () => {
      queryClient.setQueryData<Save>(["saves", post!.id], (oldData) => ({
        ...oldData,
        saves: oldData!.saves + 1,
        userSave: true,
      }));
    },
    onError: () => {
      queryClient.setQueryData<Save>(["saves", post!.id], (oldData) => ({
        ...oldData,
        saves: oldData!.saves - 1,
        userSave: false,
      }));
    },
  });
  return { savePost, isSaving };
};

const useUnsave = () => {
  const post = use(PostContext);
  const queryClient = useQueryClient();

  const { mutate: unsave, isPending: isUnsaving } = useMutation({
    mutationFn: () => SavePostClientService.unsavePost(post!.id),
    mutationKey: ["unsavePost", post!.id],
    onMutate: () => {
      queryClient.setQueryData<Save>(["saves", post!.id], (oldData) => ({
        ...oldData,
        saves: oldData!.saves - 1,
        userSave: false,
      }));
    },
    onError: () => {
      queryClient.setQueryData<Save>(["saves", post!.id], (oldData) => ({
        ...oldData,
        saves: oldData!.saves + 1,
        userSave: true,
      }));
    },
  });
  return { unsave, isUnsaving };
};

export default function Save() {
  const { data, isLoading } = useSaveCount();
  const { savePost, isSaving } = useSave();
  const { unsave, isUnsaving } = useUnsave();
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  if (isLoading)
    return (
      <div>
        <Skeleton className="h-6 w-6" />
      </div>
    );

  const handleButtonClick = () => {
    if (!user) return router.push("/login");
    if (data?.userSave) return unsave();
    return savePost();
  };

  return (
    <button onClick={handleButtonClick} disabled={isSaving || isUnsaving}>
      {data?.userSave ? (
        <div className="flex gap-1 items-center text-yellow-500 cursor-pointer">
          <IoBookmark />
          <p>{formatNumber(data?.saves || 0)}</p>
        </div>
      ) : (
        <div className="flex gap-1 items-center cursor-pointer">
          <IoBookmarkOutline />
          <p>{formatNumber(data?.saves || 0)}</p>
        </div>
      )}
    </button>
  );
}
