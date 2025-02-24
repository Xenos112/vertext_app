import { use } from "react";
import { CreatePostContext } from ".";
import { Textarea } from "@/components/ui/textarea";

export default function Body() {
  const [post, setPost] = use(CreatePostContext);

  return (
    <div className="flex flex-col w-full gap-2">
      <Textarea
        placeholder="What's on your mind?"
        value={post.content}
        rows={4}
        onChange={(e) => setPost({ ...post, content: e.target.value })}
        className="w-full border-none focus-visible:ring-0"
      />
    </div>
  );
}
