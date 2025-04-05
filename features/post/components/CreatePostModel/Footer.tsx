import { use, useRef } from "react";
import { CreatePostContext } from ".";
import { Button } from "@/components/ui/button";
import FileUploader from "./FileUploader";
import { useMutation } from "@tanstack/react-query";
import { FiLoader } from "react-icons/fi";
import EmojiPicker from "./EmojiPicker";
import { DialogClose } from "@/components/ui/dialog";
import { type PostCreateData } from "@/db/services/validators/post.validator";
import PostClientService from "@/db/services/client/post.service";
import sendToastEvent from "@/utils/sendToastEvent";

const useCreatePost = (postData: PostCreateData) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const { mutate: createPost, isPending } = useMutation({
    mutationFn: () => PostClientService.createPost(postData),
    onSuccess: (data) => {
      closeButtonRef.current?.click();
      sendToastEvent({
        title: "Post created successfully",
        description: data.message,
      });
    },
    onError: (error) => {
      sendToastEvent({
        description: error.message,
        title: "Error creating post",
        variant: "destructive",
      });
    },
  });

  return { createPost, isPending, closeButtonRef };
};

export default function Footer() {
  const [post] = use(CreatePostContext);
  const { closeButtonRef, createPost, isPending } = useCreatePost(post);

  return (
    <div className="flex justify-between mt-4">
      <div className="flex gap-2">
        <FileUploader />
        <EmojiPicker />
      </div>
      <Button disabled={isPending} onClick={() => createPost()}>
        {isPending ? <FiLoader /> : "Post"}
      </Button>
      <DialogClose className="sr-only" ref={closeButtonRef} />
    </div>
  );
}
