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
import { useMutation, useQuery } from "@tanstack/react-query";
import deletePostAPI from "../../api/delete";
import sendToastEvent from "@/utils/sendToastEvent";
import UserClientService from "@/db/services/client/user.service";

const useUser = () => {
  const post = use(PostContext);

  const { data: user, isLoading } = useQuery({
    queryKey: ["author", post?.id],
    queryFn: () => UserClientService.getUser(post!.userId),
  });

  return { user, isLoading };
};

export default function PostActions() {
  const postState = use(PostContext);
  const user = useUserStore((state) => state.user);
  const { user: author } = useUser();

  const handleCopyText = (text: string) => {
    const data = copyText(text);
    if ("error" in data) {
      sendToastEvent({
        title: "Error",
        description: data.error as string,
        variant: "destructive",
      });
    } else {
      sendToastEvent({
        title: "Success",
        description: "Text has been copied",
      });
    }
  };

  const { mutate: deletePost } = useMutation({
    mutationFn: () => deletePostAPI(postState!.id),
    mutationKey: ["deletePost", postState!.id],
    onError(error) {
      sendToastEvent({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },

    onSuccess() {
      sendToastEvent({
        title: "Success",
        description: "Post has been deleted",
      });
    },
  });

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
        {author?.id === user?.id && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => deletePost()}
            >
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
