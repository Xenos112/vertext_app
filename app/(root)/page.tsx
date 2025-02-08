"use client";
import { GET } from "@/app/api/feed/route";
import { useEffect, useState } from "react";
import ky from "ky";
import Post from "@/components/shared/Post";
import { APIResponse } from "@/types/api";
import useUserStore from "@/store/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatUserNameForImage } from "@/utils/format-user_name-for-image";
import CreatePostModal from "@/features/post/components/CreatePostModal";

type FeedResponse = APIResponse<ReturnType<typeof GET>>;

export const dynamic = "force-dynamic";

export default function Home() {
  const [posts, setPosts] = useState<FeedResponse>([]);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await ky.get<FeedResponse>("/api/feed");
      const res = await data.json();
      setPosts(res as []);
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen border border-muted rounded-lg">
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
              <input className="outline-none border-none w-full bg-transparent px-3" placeholder='I Guess this is...' />
              <Button size='sm'>Post</Button>
            </div>
          </DialogTrigger>
          <CreatePostModal />
        </Dialog>
      )}
      {posts.map((post) => (
        <div key={post.id} className="">
          <Post {...post} />
        </div>
      ))}
    </div>
  );
}
