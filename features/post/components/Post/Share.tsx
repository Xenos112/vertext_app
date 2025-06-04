import { use } from "react";
import { PostContext } from ".";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share as ShareIcon } from "lucide-react";
import copyText from "@/utils/copy-text";
import { formatNumber } from "@/utils/format-number";
import { useMutation } from "@tanstack/react-query";
import shareMutationFunction from "../../api/share";
import sendToastEvent from "@/utils/sendToastEvent";
import useUserStore from "@/store/user";
import { Skeleton } from "@/components/ui/skeleton";

// TODO: make it in the v2 of the API
export default function Share() {
  const post = use(PostContext);
  const user = useUserStore((state) => state.user);
  const postUrl = new URL(window.location.href);
  postUrl.pathname = `/post/${post!.id}`;
  if (user) postUrl.searchParams.set("u", user.id);

  if (!post) throw new Error("Post not found");

  const { mutate: share, isPending } = useMutation({
    mutationFn: () => shareMutationFunction(post.id),
    mutationKey: ["share", post.id],
    onError: (err) => {
      sendToastEvent({
        title: "Error",
        description: err.message,
      });
    },
    onSuccess() {
      sendToastEvent({
        title: "Success",
        description: "Post shared successfully",
      });
      // HACK: maybe we could add a user for the post url so that we can track the share
      // and suggest the user to follow the one who shared it
      copyText(postUrl.toString());
    },
  });

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild className="text-base">
          <Button variant="ghost" size="sm">
            <ShareIcon />
            {formatNumber(post.share_number)}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share this post</DialogTitle>
            <DialogDescription>
              Copy the link below to share this post with others.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              disabled
              value={postUrl.toString()}
              className="flex-1 px-3 py-2 select-none text-sm rounded-md"
            />
            {isPending ? (
              <Skeleton className="w-16 h-9" />
            ) : (
              <Button onClick={() => share()}>Share</Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
