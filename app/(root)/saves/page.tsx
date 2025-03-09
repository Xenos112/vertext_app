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

      {posts && posts.length > 0 && (
        <div className="p-4">
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      )}
      <div>
        {posts && posts.map((post) => <Post key={post.id} post={post} />)}
      </div>
      {posts?.length === 0 && (
        <div className="flex flex-col items-center pt-10 justify-center ">
          <h1 className="text-3xl font-semibold">No Posts Saved</h1>
          <p className="text-muted-foreground">
            You haven&apos;t saved any posts yet
          </p>
          <Button variant="ghost" className="mt-4">
            <Link href="/">Return</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
