import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdShareAlt } from "react-icons/io";
import { IoCopy } from "react-icons/io5";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { PostContext } from ".";
import { use } from "react";
import useUserStore from "@/store/user";
import copyText from "@/utils/copy-text";
import { deletePost } from "@/actions/post.actions";

export default function PostActions() {
  const [postState] = use(PostContext);
  const user = useUserStore((state) => state.user);

  const handleCopyText = (text: string) => {
    const data = copyText(text);
    if ("error" in data) {
      document.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            title: "Error",
            description: data.error,
            variant: "destructive",
          },
        }),
      );
    } else {
      document.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            title: "Success",
            description: "Text has been copied",
          },
        }),
      );
    }
  };

  const deleteHandler = async () => {
    const res = await deletePost(postState!.id);
    if (res.message === "deleted") {
      document.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            title: "Success",
            description: "Post has been deleted",
          },
        }),
      );
    } else {
      document.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            title: "Error",
            description: "Error while deleting the post",
            variant: "destructive",
          },
        }),
      );
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <BsThreeDotsVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs">
        <DropdownMenuItem
          onClick={() =>
            handleCopyText(`${window.location.href}/post/${postState!.id}`)
          }
        >
          Copy URL
          <DropdownMenuShortcut>
            <IoMdShareAlt size={20} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        {postState!.content && (
          <DropdownMenuItem onClick={() => handleCopyText(postState!.content!)}>
            Copy Text
            <DropdownMenuShortcut>
              <IoCopy size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
        {postState!.Author.id === user?.id && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={deleteHandler}>
              Delete
              <DropdownMenuShortcut>
                <MdOutlineDeleteOutline size={20} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
