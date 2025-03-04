"use client";
import { SavedPostsApiRespose } from "@/app/api";
import { Button } from "@/components/ui/button";
import Post from "@/features/post/components/Post";
import useUserStore from "@/store/user";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoArrowLeft } from "react-icons/go";

export default function SavesPage() {
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  if (!user) router.push("/register");

  const { data: posts, isLoading } = useQuery({
    queryKey: ["savedPosts"],
    queryFn: async () => {
      const res = await ky.get<SavedPostsApiRespose>("/api/me/saves");
      const data = await res.json();

      if ("error" in data) throw new Error(data.error);

      return data.posts;
    },
  });

  if (isLoading) return <div>...loading</div>;

  return (
    <div className="border border-muted rounded-xl min-h-screen">
      <div className="border-b border-muted">
        <Link href="/">
          <Button variant="ghost" className="flex items-center">
            <GoArrowLeft />
            Return
          </Button>
        </Link>
      </div>
      <h1 className="p-4">Saved Posts</h1>
      <div>
        {posts && posts.map((post) => <Post key={post.id} post={post} />)}
      </div>
    </div>
  );
}
