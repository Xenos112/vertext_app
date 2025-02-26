import { use } from "react";
import { PostContext } from "./index";
import Link from "next/link";
import formatDate from "@/utils/format-date";
import { MdVerified } from "react-icons/md";
import PostActions from "./PostActions";
import AuthorDetails from "./AuthorDetails";

export default function Header() {
  const [postState] = use(PostContext);

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-3">
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <AuthorDetails />
            <div className="flex flex-col">
              <div className="flex gap-1 items-center">
                <Link href={`/user/${postState!.Author.id}`}>
                  {postState!.Author.user_name}
                </Link>
                {postState!.Author.premium && (
                  <Link href="/pricing">
                    <MdVerified />
                  </Link>
                )}
                <Link
                  href={`/user/${postState!.Author.id}`}
                  className="text-muted-foreground text-xs"
                >
                  @{postState!.Author.tag}
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
