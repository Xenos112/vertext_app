"use client";
import { GET } from "@/app/api/feed/route";
import { useEffect, useState } from "react";
import ky from "ky";
import Post from "@/components/shared/Post";
import { APIResponse } from "@/types/api";
import useUserStore from "@/store/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type FeedResponse = APIResponse<ReturnType<typeof GET>>;

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
    <div className="min-h-screen p-4 border border-slate-500 dark:border-slate-200 rounded-lg">
      {user?.id && (
        <button>
          <Avatar>
            <AvatarImage src={user?.image_url!} />
            <AvatarFallback>
              {user?.user_name?.slice(0, 2).toLocaleUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
      )}
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </div>
  );
}
