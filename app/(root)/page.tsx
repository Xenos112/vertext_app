"use client";
import Post from "@/features/post/components/Post";
import useUserStore from "@/store/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatUserNameForImage } from "@/utils/format-user_name-for-image";
import CreatePostModal from "@/features/post/components/CreatePostModel/index";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import getFeed from "@/features/post/api/getFeed";

export const dynamic = "force-dynamic";

export default function Home() {
  const user = useUserStore((state) => state.user);
  // TODO: make use of the type
  const { data: posts } = useQuery({
    queryKey: ["feed"],
    queryFn: () => getFeed("feed"),
  });

  return (
    <div className="min-h-screen border border-muted rounded-lg">
      {user?.id && (
        <div className="flex items-center justify-center *:p-3 border-b border-muted divide-x-[1px] divide-muted">
          <Link className="flex-1 text-center" href={`/?t=feed`}>
            Feed
          </Link>
          <Link className="flex-1 text-center" href={`/?t=communities`}>
            Communities
          </Link>
        </div>
      )}
      {user?.id && (
        <Dialog>
          <DialogTrigger asChild>
            <div className="flex gap-3 items-center border-b border-muted px-4 p-8">
              <Avatar>
                <AvatarImage src={user.image_url!} />
                <AvatarFallback>
                  {formatUserNameForImage(user?.user_name)}
                </AvatarFallback>
              </Avatar>
              <input
                className="outline-none border-none w-full bg-transparent px-3"
                placeholder="I Guess this is..."
              />
              <Button size="sm">Post</Button>
            </div>
          </DialogTrigger>
          <CreatePostModal />
        </Dialog>
      )}
      {posts &&
        posts.map((post) => (
          <div key={post.id} className="">
            <Post id={post.id} />
          </div>
        ))}
    </div>
  );
}
