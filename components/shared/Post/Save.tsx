import { useToast } from "@/hooks/use-toast";
import { formatNumber } from "@/utils/format-number";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import { use } from "react";
import { PostContext } from ".";
import useUserStore from "@/store/user";
import { unsave, save } from "@/actions/post.actions";

export default function Save() {
  const [postState, setPostState] = use(PostContext);
  const user = useUserStore((state) => state.user);
  const { toast } = useToast();

  const saveHandler = async () => {
    if (postState!.Save.length === 0) {
      setPostState((prev) => ({
        ...prev!,
        _count: { ...prev!._count, Save: prev!._count.Save + 1 },
        Save: [...prev!.Save, { userId: user!.id }],
      }));

      const data = await save(postState!.id);
      if ("error" in data)
        toast({
          title: "Error",
          variant: "destructive",
        });
      else
        toast({
          title: "Success",
          description: `The Post is ${data.message}`,
        });
    } else {
      setPostState((prev) => ({
        ...prev!,
        _count: { ...prev!._count, Save: prev!._count.Save - 1 },
        Save: [],
      }));
      const data = await unsave(postState!.id);

      if ("error" in data)
        toast({
          title: "Error",
          variant: "destructive",
        });
      else
        toast({
          title: "Success",
          description: `The Post is ${data.message}`,
        });
    }
  };

  return (
    <button onClick={saveHandler}>
      {postState!.Save.length !== 0 ? (
        <div className="flex gap-1 items-center text-yellow-500 cursor-pointer">
          <IoBookmark />
          <p>{formatNumber(postState!._count.Save)}</p>
        </div>
      ) : (
        <div className="flex gap-1 items-center cursor-pointer">
          <IoBookmarkOutline />
          <p>{formatNumber(postState!._count.Save)}</p>
        </div>
      )}
    </button>
  );
}
