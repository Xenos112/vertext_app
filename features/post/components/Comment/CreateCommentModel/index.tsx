import { useEffect, useRef, useState } from "react";
import { type CreateCommentValidatorType } from "@/db/services/validators/comment.validator";
import {
  DialogPortal,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import CommentClientService from "@/db/services/client/comment.service";
import { Button } from "@/components/ui/button";
import sendToastEvent from "@/utils/sendToastEvent";
import Author from "./Author";
import { Textarea } from "@/components/ui/textarea";
import { FaUpload } from "react-icons/fa6";
import { useUpload } from "@/hooks/useUpload";

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
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const { upload } = useUpload();
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
        setComment({ content: "", medias: [] });
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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let medias: string[] = [];
    if (e.target.files && e.target.files?.length === 0) return;
    for (let i = 0; i < e.target.files!.length!; i++) {
      const newUrl = await upload(e.target.files![i]);
      medias = [...medias, newUrl];
    }
    medias = medias.filter((url) => url !== "");
    setComment({ ...comment, medias });
    console.log(medias);
  };

  return (
    <DialogPortal>
      <DialogTitle>Add Comment</DialogTitle>
      <DialogContent>
        <div className="flex gap-2">
          <Author />
          <Textarea
            value={comment.content}
            onChange={(e) =>
              setComment({ ...comment, content: e.target.value })
            }
            className="w-full border-none focus-visible:ring-0"
          />
        </div>
        <DialogFooter className="mt-3 flex items-center gap-3">
          <FaUpload
            onClick={() => uploadInputRef.current?.click()}
            className="mr-auto"
            title="upload images or videos"
          />
          <DialogClose ref={closeButtonRef}>Cancel</DialogClose>
          <Button
            disabled={isPending}
            onClick={() => createComment()}
          >
            Add
          </Button>
          <input
            ref={uploadInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  );
}
