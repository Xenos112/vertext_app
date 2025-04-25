import { use } from "react";
import { CreatePostContext } from ".";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { X } from "lucide-react";

export default function Body() {
  const [post, setPost] = use(CreatePostContext);

  const removeMedia = (url: string) => {
    const newMedia = post.medias!.filter((media) => media !== url);
    setPost({ ...post, medias: newMedia });
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <Textarea
        placeholder="What's on your mind?"
        value={post.content}
        rows={4}
        onChange={(e) => setPost({ ...post, content: e.target.value })}
        className="w-full border-none focus-visible:ring-0"
      />
      {post.medias && post.medias.length > 0 && (
        <div className="grid max-h-[50vh] overflow-scroll grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
          {post.medias.map((media) => (
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
    </div>
  );
}
