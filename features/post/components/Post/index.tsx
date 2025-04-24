"use client";
import { createContext } from "react";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";
import Like from "./Like";
import Comment from "./Comment";
import Share from "./Share";
import Save from "./Save";
import { useQueries } from "@tanstack/react-query";
import PostClientService from "@/db/services/client/post.service";
import { type Post } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import LikePostClientService from "@/db/services/client/like.service";
import SavePostClientService from "@/db/services/client/save.service";

const usePost = (id: string) => {
  const [{ data: post, isLoading }] = useQueries({
    queries: [
      {
        queryKey: ["post", id],
        queryFn: () => PostClientService.getPostById(id),
      },
      {
        queryKey: ["likes", id],
        queryFn: () => LikePostClientService.getPostLikes(id),
      },
      {
        queryKey: ["saves", id],
        queryFn: () => SavePostClientService.getPostSaves(id),
      },
    ],
  });
  return { post, isLoading };
};

export const PostContext = createContext<Post | null>(null);

export default function Post({ id }: { id: string }) {
  const { post, isLoading } = usePost(id);

  if (isLoading)
    return (
      <div className="p-4">
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
        <div className="mt-3 ml-[50px]">
          <Skeleton className="w-full h-56 rounded-md" />
        </div>
        <div className="flex items-center justify-between gap-4 my-4 ml-[50px]">
          <div className="flex gap-4">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-6" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    );

  if (!post)
    return (
      <div className="text-center p-4 my-4">
        <h1 className="space-y-2 font-semibold text-2xl">Post Not Found</h1>
        <p className="text-muted-foreground">
          The post you are looking for does not exist
        </p>
      </div>
    );

  return (
    <PostContext value={post}>
      <div className="flex flex-col p-4 border-b border-muted">
        <Header />
        <Body />
        <Footer className="flex items-center justify-between gap-4 my-4 ml-[50px]">
          <div className="flex gap-4">
            <Like />
            <Save />
            <Comment />
          </div>
          <Share />
        </Footer>
      </div>
    </PostContext>
  );
}
