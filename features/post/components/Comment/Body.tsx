import Image from "next/image";
import { CommentContext } from ".";
import { use } from "react";
import parsePostContent from "@/utils/parse-post-content";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { isImage } from "@/constants";
import Video from "@/components/shared/Video";

export default function Body() {
  const comment = use(CommentContext);
  if (!comment) throw new Error("Post not found");

  const className =
    comment.medias.length === 1
      ? "grid-cols-1 grid-rows-1"
      : comment.medias.length === 2
        ? "grid-cols-2 grid-rows-1"
        : comment.medias.length === 3
          ? "grid-cols-1 grid-rows-3"
          : comment.medias.length === 4
            ? "grid-cols-2 grid-rows-2"
            : "grid-cols-3 grid-rows-2";

  return (
    <div className="block ml-[50px]">
      {comment.content && (
        <p
          className="text-[15px]"
          dangerouslySetInnerHTML={{
            __html: parsePostContent(comment.content)!,
          }}
        />
      )}

      {comment.medias.length !== 0 && (
        <div className={`rounded-md overflow-hidden grid gap-1 mt-1`}>
          <div className={`${className} gap-1 grid`}>
            {comment.medias.map((media, index) => (
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
    </div>
  );
}
