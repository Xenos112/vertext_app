import { use, useRef } from "react";
import { CreatePostContext } from ".";
import { Button } from "@/components/ui/button";
import FileUploader from "./FileUploader";
import { useMutation } from "@tanstack/react-query";
import createPost from "../../api/createPost";
import { FiLoader } from "react-icons/fi";
import EmojiPicker from "./EmojiPicker";
import { DialogClose } from "@/components/ui/dialog";

export default function Footer() {
  const [post] = use(CreatePostContext);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: () => createPost(post.content, post.urls, post.communityId),
    onSuccess: (data) => {
      closeButtonRef.current?.click();
      document.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            title: "Post created successfully",
            description: data.message,
          },
        }),
      );
    },
    onError: (error) => {
      console.log(error);
      document.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            description: error.message,
            title: "Error creating post",
            variant: "destructive",
          },
        }),
      );
    },
  });

  return (
    <div className="flex justify-between mt-4">
      <div className="flex gap-2">
        <FileUploader />
        <EmojiPicker />
      </div>
      <Button disabled={isPending} onClick={() => mutate()}>
        {isPending ? <FiLoader /> : "Post"}
      </Button>
      <DialogClose className="sr-only" ref={closeButtonRef} />
    </div>
  );
}
