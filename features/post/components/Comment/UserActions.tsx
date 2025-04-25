import CommentClientService from "@/db/services/client/comment.service";
import { useMutation } from "@tanstack/react-query";
import { CommentContext } from ".";
import { use } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { IoCopy } from "react-icons/io5";
import useUserStore from "@/store/user";
import copyText from "@/utils/copy-text";
import sendToastEvent from "@/utils/sendToastEvent";

const useDeleteComment = (postId: string, commentId: string) => {
  const { mutate: deleteComment, isPending: isDeleting } = useMutation({
    mutationKey: ["deleteComment", commentId],
    mutationFn: () => CommentClientService.deleteComment(postId, commentId),
  });
  return { deleteComment, isDeleting };
};

export default function UserActions() {
  const comment = use(CommentContext);
  const user = useUserStore((state) => state.user);
  const { deleteComment } = useDeleteComment(comment!.postId, comment!.id);

  if (!comment) return null;

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <BsThreeDotsVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs">
        {comment.content && (
          <DropdownMenuItem onClick={() => handleCopyText(comment.content!)}>
            Copy Text
            <DropdownMenuShortcut>
              <IoCopy size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
        {comment.userId === user?.id && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => deleteComment()}
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
