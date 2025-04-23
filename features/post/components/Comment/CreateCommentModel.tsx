import { useEffect, useRef, useState } from "react";
import { type CreateCommentValidatorType } from "@/db/services/validators/comment.validator";
import {
  DialogPortal,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import CommentClientService from "@/db/services/client/comment.service";
import { Button } from "@/components/ui/button";
import sendToastEvent from "@/utils/sendToastEvent";

const useCommentCreate = (
  postId: string,
  comment: CreateCommentValidatorType,
) => {
  const { mutate: createComment, isPending } = useMutation({
    mutationKey: ["createPost"],
    mutationFn: () => CommentClientService.createComment(postId, comment),
    onError(error) {
      sendToastEvent({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess() {
      // TODO: update the cache to display the new comment
      document.dispatchEvent(new CustomEvent("close-comment-create-model"));
      sendToastEvent({
        title: "Success",
        description: "Comment created successfully",
      });
    },
  });

  return { createComment, isPending };
};

export default function CreateCommentModel({ postId }: { postId: string }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [comment, setComment] = useState<CreateCommentValidatorType>({
    content: "",
    medias: [],
  });

  const { createComment, isPending } = useCommentCreate(postId, comment);

  useEffect(() => {
    const keyPressHandler = (e: KeyboardEvent) => {
      if (
        closeButtonRef.current?.contains(document.activeElement) &&
        e.key === "Enter"
      ) {
        createComment();
      }
    };

    const closeButtonClickHandler = () => {
      closeButtonRef.current?.click();
    };

    document.addEventListener("keypress", keyPressHandler);
    document.addEventListener(
      "close-comment-create-model",
      closeButtonClickHandler,
    );

    return () => {
      document.removeEventListener("keypress", keyPressHandler);
      document.removeEventListener(
        "close-comment-create-model",
        closeButtonClickHandler,
      );
    };
  }, [createComment]);

  return (
    <DialogPortal>
      <DialogTitle>Add Comment</DialogTitle>
      <DialogContent>
        <Input
          value={comment.content}
          onChange={(e) => setComment({ ...comment, content: e.target.value })}
        />

        <DialogFooter>
          <DialogClose ref={closeButtonRef}>Cancel</DialogClose>
          <Button disabled={isPending} onClick={() => createComment()}>
            Add Comment
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  );
}
