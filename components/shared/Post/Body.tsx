import Link from "next/link";
import { PostContext } from ".";
import { use } from "react";
import parsePostContent from "@/utils/parse-post-content";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { isImage } from "@/constants";

export default function Body() {
  const [postState] = use(PostContext);

  const className =
    postState!.medias.length === 1
      ? "grid-cols-1 grid-rows-1"
      : postState!.medias.length === 2
        ? "grid-cols-2 grid-rows-1"
        : postState!.medias.length === 3
          ? "grid-cols-3 grid-rows-1"
          : postState!.medias.length === 4
            ? "grid-cols-4 grid-rows-1"
            : "grid-cols-5 grid-rows-1";

  return (
    <Link href={`post/${postState!.id}`} className="mt-3 block ml-[50px]">
      {postState!.content && (
        <p
          className="text-[15px]"
          dangerouslySetInnerHTML={{
            __html: parsePostContent(postState!.content)!,
          }}
        />
      )}
      {postState!.medias.length !== 0 && (
        <div
          className={`${className} rounded-md overflow-hidden grid gap-1 mt-3`}
        >
          <Link href={`/post/${postState!.id}`}>
            {postState!.medias.map((media, index) => (
              <AspectRatio key={index} ratio={16 / 9}>
                {isImage.test(media) ? (
                  <img
                    src={media}
                    alt="Post"
                    className="object-cover size-full"
                  />
                ) : (
                  <video src={media} />
                )}
              </AspectRatio>
            ))}
          </Link>
        </div>
      )}
    </Link>
  );
}
