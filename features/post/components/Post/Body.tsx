import Link from "next/link";
import Image from "next/image";
import { PostContext } from ".";
import { use } from "react";
import parsePostContent from "@/utils/parse-post-content";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { isImage } from "@/constants";

export default function Body() {
  const [post] = use(PostContext);
  if (!post) throw new Error("Post not found");

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
    <Link href={`post/${post.id}`} className="mt-3 block ml-[50px]">
      {post.content && (
        <p
          className="text-[15px]"
          dangerouslySetInnerHTML={{
            __html: parsePostContent(post.content)!,
          }}
        />
      )}

      {post.medias.length !== 0 && (
        <div className={`rounded-md overflow-hidden grid gap-1 mt-3`}>
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
                  <video src={media} controls />
                )}
              </AspectRatio>
            ))}
          </div>
        </div>
      )}
    </Link>
  );
}
