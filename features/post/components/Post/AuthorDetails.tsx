import { use } from "react";
import { PostContext } from ".";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import formatDate from "@/utils/format-date";
import { MdVerified } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export default function AuthorDetails() {
  const [postState] = use(PostContext);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Link href={`/user/${postState!.Author.id}`}>
            <Avatar>
              <AvatarImage src={postState!.Author.image_url!} />
              <AvatarFallback>
                {postState!.Author.user_name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
        </TooltipTrigger>
        <TooltipContent className="max-w-[400px]">
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <Avatar>
                <AvatarImage src={postState!.Author.image_url!} />
                <AvatarFallback>
                  {postState!.Author.user_name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex gap-1 items-center">
                  <p>{postState!.Author.user_name}</p>
                  {postState!.Author.premium && <MdVerified />}
                  <p className="text-muted-foreground text-xs">
                    @{postState!.Author.tag}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDate(postState!.Author.created_at)}
                </p>
              </div>
            </div>
            {postState!.Author.bio && (
              <p className="text-lg">{postState!.Author.bio}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
