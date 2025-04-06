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
import { useQuery } from "@tanstack/react-query";
import UserClientService from "@/db/services/client/user.service";

const useUser = () => {
  const post = use(PostContext);

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", post?.userId],
    queryFn: () => UserClientService.getUser(post!.userId),
  });

  return { user, isLoading };
};

export default function AuthorDetails() {
  const { user } = useUser();
  if (!user) return;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Link href={`/user/${user.id}`}>
            <Avatar>
              <AvatarImage src={user.image_url || undefined} />
              <AvatarFallback>
                {user.user_name?.slice(0, 2).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
          </Link>
        </TooltipTrigger>
        <TooltipContent className="max-w-[400px]">
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <Avatar>
                <AvatarImage src={user.image_url || undefined} />
                <AvatarFallback>
                  {user.user_name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex gap-1 items-center">
                  <p>{user.user_name}</p>
                  {user.premium && <MdVerified />}
                  <p className="text-muted-foreground text-xs">@{user.tag}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDate(user.created_at || new Date())}
                </p>
              </div>
            </div>
            {user.bio && <p className="text-lg">{user.bio}</p>}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
