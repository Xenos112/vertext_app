"use client";
import { GET } from "@/app/api/feed/route";
import { useEffect, useState } from "react";
import ky from "ky";
import Post from "@/components/shared/Post";
import { APIResponse } from "@/types/api";

type FeedResponse = APIResponse<ReturnType<typeof GET>>;

export default function Home() {
  const [posts, setPosts] = useState<FeedResponse>([]);

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
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </div>
  );
}
