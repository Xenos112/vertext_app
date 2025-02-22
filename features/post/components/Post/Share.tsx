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
import { useToast } from "@/hooks/use-toast";
import copyText from "@/utils/copy-text";
import { formatNumber } from "@/utils/format-number";
import { useMutation } from "@tanstack/react-query";
import shareMutationFunction from "../../api/share";
import { FiLoader } from "react-icons/fi";

export default function Share() {
  const [post, setPost] = use(PostContext);
  const { toast } = useToast();

  if (!post) throw new Error("Post not found");

  const { mutate: share, isPending } = useMutation({
    mutationFn: () => shareMutationFunction(post.id),
    mutationKey: ["share", post.id],
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    },
    onSuccess() {
      copyText(`${window.location.href}post/${post.id}`);
      setPost((prev) => ({ ...prev!, share_number: prev!.share_number + 1 }));
      toast({
        title: "Success",
        description: "Post shared successfully",
      });
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
              value={`${window.location.href}post/${post.id}`}
              className="flex-1 px-3 py-2 select-none text-sm rounded-md"
            />
            <Button onClick={() => share()}>
              {isPending ? <FiLoader className="animate-spin" /> : "Share"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
