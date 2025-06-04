import { useSuspenseQuery } from "@tanstack/react-query";
import UserClientService from "@/db/services/client/user.service";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { formatUserNameForImage } from "@/utils/format-user_name-for-image";
import formatDate from "@/utils/format-date";
import Link from "next/link";
import { CommentContext } from ".";
import { use } from "react";

const useUser = (userId: string) => {
  const { data: user } = useSuspenseQuery({
    queryKey: ["user", userId],
    queryFn: () => UserClientService.getUser(userId),
  });
  return { user };
};

export default function Author({ userId }: { userId: string }) {
  const comment = use(CommentContext);
  const { user } = useUser(userId);
  return (
    <Link className="flex items-center gap-2" href={`/user/${user.id}`}>
      <Avatar>
        <AvatarImage src={user?.image_url || undefined} />
        <AvatarFallback>
          {formatUserNameForImage(user.user_name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <div className="flex gap-1 items-center">
          <p>{user.user_name}</p>
          <p className="text-muted-foreground text-xs">@{user.user_name}</p>
        </div>
        <time className="text-muted-foreground text-xs">
          {formatDate(comment!.created_at)}
        </time>
      </div>
    </Link>
  );
}
