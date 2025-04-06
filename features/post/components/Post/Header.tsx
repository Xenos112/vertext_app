import { use } from "react";
import { PostContext } from "./index";
import Link from "next/link";
import formatDate from "@/utils/format-date";
import { MdVerified } from "react-icons/md";
import PostActions from "./PostActions";
import AuthorDetails from "./AuthorDetails";
import UserClientService from "@/db/services/client/user.service";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const useUser = () => {
  const post = use(PostContext);

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", post?.userId],
    queryFn: () => UserClientService.getUser(post!.userId),
  });

  return { user, isLoading };
};
export default function Header() {
  const postState = use(PostContext);
  const { user, isLoading } = useUser();

  if (isLoading || !user)
    return (
      <div className="flex gap-2 items-center">
        <div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-2 w-20" />
          </div>
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    );

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-3">
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <AuthorDetails />
            <div className="flex flex-col">
              <div className="flex gap-1 items-center">
                <Link href={`/user/${user?.id}`}>{user?.user_name}</Link>
                {user.premium && (
                  <Link href="/pricing">
                    <MdVerified />
                  </Link>
                )}
                <Link
                  href={`/user/${user?.id}`}
                  className="text-muted-foreground text-xs"
                >
                  @{user?.tag}
                </Link>
              </div>
              <div className="flex gap-2 items-center">
                <time className="text-muted-foreground text-xs">
                  {formatDate(postState!.created_at.toString())}
                </time>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PostActions />
    </div>
  );
}
