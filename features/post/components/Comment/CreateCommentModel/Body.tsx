import {
  DialogPortal,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Author from "./Author";
import { Textarea } from "@/components/ui/textarea";
import UploadButton from "./UploadButton";
import { NewCommentContext } from ".";
import { use, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CommentClientService from "@/db/services/client/comment.service";
import sendToastEvent from "@/utils/sendToastEvent";
import Image from "next/image";
import { X } from "lucide-react";

const useCommentCreate = () => {
  const queryClient = useQueryClient();
  const { comment, setComment, postId } = use(NewCommentContext);

  const { mutate: createComment, isPending } = useMutation({
    mutationKey: ["createPost"],
    mutationFn: () =>
      CommentClientService.createComment(postId, comment).then(
        (data) => data.comment,
      ),
    onError(error) {
      sendToastEvent({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess(data) {
      setComment({ content: "", medias: [] });
      queryClient.setQueryData<string[]>(
        ["post-comments", postId],
        (oldData) => (oldData ? [data.id, ...oldData] : [data.id]),
      );
      document.dispatchEvent(new CustomEvent("close-comment-create-model"));
      sendToastEvent({
        title: "Success",
        description: "Comment created successfully",
      });
    },
  });

  return { createComment, isPending };
};

export default function Body() {
  const { comment, setComment } = use(NewCommentContext);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { createComment, isPending } = useCommentCreate();

  useEffect(() => {
    const keyPressHandler = (e: KeyboardEvent) => {
      if (
        closeButtonRef.current?.contains(document.activeElement) &&
        e.key === "Enter" &&
        e.shiftKey
      ) {
        e.preventDefault();
        textAreaRef.current?.blur();
        createComment();
        setComment({ content: "", medias: [] });
      }
    };

    const closeButtonClickHandler = () => {
      closeButtonRef.current?.click();
    };

    document.addEventListener("keydown", keyPressHandler);
    document.addEventListener(
      "close-comment-create-model",
      closeButtonClickHandler,
    );

    return () => {
      document.removeEventListener("keydown", keyPressHandler);
      document.removeEventListener(
        "close-comment-create-model",
        closeButtonClickHandler,
      );
    };
  }, []);

  const removeMedia = (url: string) => {
    const newMedia = comment.medias!.filter((media) => media !== url);
    setComment({ ...comment, medias: newMedia });
  };

  return (
    <DialogPortal>
      <DialogTitle>Add Comment</DialogTitle>
      <DialogContent>
        <div className="flex gap-2">
          <Author />
          <Textarea
            value={comment.content}
            ref={textAreaRef}
            onChange={(e) =>
              setComment({ ...comment, content: e.target.value })
            }
            className="w-full border-none focus-visible:ring-0"
          />
        </div>
        {comment.medias && comment.medias.length > 0 && (
          <div className="grid max-h-[50vh] overflow-scroll grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
            {comment.medias.map((media) => (
              <div
                key={media}
                className="h-24 rounded-md overflow-hidden relative"
              >
                <button
                  onClick={() => removeMedia(media)}
                  className="absolute rounded-full p-1 bg-muted/40 text-white top-1 right-1 z-10"
                >
                  <X size={14} />
                </button>
                <Image src={media} fill alt="Post" className="object-cover" />
              </div>
            ))}
          </div>
        )}
        <DialogFooter className="mt-3 flex items-center gap-3">
          <UploadButton />
          <DialogClose ref={closeButtonRef}>Cancel</DialogClose>
          <Button disabled={isPending} onClick={() => createComment()}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  );
}
