import Link from "next/link";
import Image from "next/image";
import { PostContext } from ".";
import { use } from "react";
import parsePostContent from "@/utils/parse-post-content";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { isImage } from "@/constants";
import Video from "@/components/shared/Video";
import { usePathname } from "next/navigation";

export default function Body() {
  const post = use(PostContext);
  const route = usePathname();
  if (!post) throw new Error("Post not found");
  const RootTag = route.includes("post") ? "div" : Link;

  const className =
    post.medias.length === 1
      ? "grid-cols-1 grid-rows-1"
      : post.medias.length === 2
        ? "grid-cols-2 grid-rows-1"
        : post.medias.length === 3
          ? "grid-cols-1 grid-rows-3"
          : post.medias.length === 4
            ? "grid-cols-2 grid-rows-2"
            : "grid-cols-3 grid-rows-2";

  return (
    <RootTag href={`post/${post.id}`} className="mt-2 block ml-[50px]">
      {post.content && (
        <p
          className="text-[15px]"
          dangerouslySetInnerHTML={{
            __html: parsePostContent(post.content)!,
          }}
        />
      )}

      {post.medias.length !== 0 && (
        <div className={`rounded-md overflow-hidden grid gap-1 mt-1`}>
          <div className={`${className} gap-1 grid`}>
            {post.medias.map((media, index) => (
              <AspectRatio key={index} ratio={16 / 9}>
                {isImage.test(media) ? (
                  <Image
                    src={media}
                    alt="Post"
                    fill
                    className="object-cover size-full"
                  />
                ) : (
                  <Video src={media} type="mp4" autoPlay controls />
                )}
              </AspectRatio>
            ))}
          </div>
        </div>
      )}
    </RootTag>
  );
}
