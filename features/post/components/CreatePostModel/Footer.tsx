import { use } from "react";
import { CreatePostContext } from ".";
import { Button } from "@/components/ui/button";
import FileUploader from "./FileUploader";
import { useMutation } from "@tanstack/react-query";
import createPost from "../../api/createPost";
import { useToast } from "@/hooks/use-toast";
import { FiLoader } from "react-icons/fi";
import EmojiPicker from "./EmojiPicker";

export default function Footer() {
  const [post] = use(CreatePostContext);
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: () => createPost(post.content, post.urls, post.communityId),
    onSuccess: (data) => {
      toast({
        title: "Post created successfully",
        description: data.message,
      });
    },
    onError: (error) => {
      console.log(error);
      toast({
        title: "Error creating post",
        description: error.message,
        variant: "destructive",
      });
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
    </div>
  );
}
