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

export default function Share() {
  const [postState] = use(PostContext);
  const { toast } = useToast();

  const handleCopyText = (text: string) => {
    const data = copyText(text);
    if ("error" in data) {
      toast({
        title: "Error",
        description: "Error while copying the text",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Text have Been Coppied to the ClipBoard",
      });
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild className="text-base">
          <Button variant="ghost" size="sm" onClick={() => {}}>
            <ShareIcon />
            {postState!.share_number}
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
              readOnly
              value={`${window.location.href}post/${postState!.id}`}
              className="flex-1 px-3 py-2 text-sm border rounded-md"
            />
            <Button
              onClick={() => {
                handleCopyText(`${window.location.href}/post/${postState!.id}`);
              }}
            >
              Copy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
