"use client";
import React from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatUserNameForImage } from "@/utils/format-user_name-for-image";
import formatDate from "@/utils/format-date";
import JoinButton from "@/features/community/components/JoinButton";
import { useQuery } from "@tanstack/react-query";
import CommunityClientService from "@/db/services/client/community.service";
import Image from "next/image";
import PostClientService from "@/db/services/client/post.service";
import Post from "@/features/post/components/Post";
import CommunityFallback from "./_components/CommunityFallback";
import { Skeleton } from "@/components/ui/skeleton";
import ReturnButton from "@/components/shared/ReturnButton";

const useCommunityPosts = (id: string) => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts", id],
    queryFn: () => PostClientService.getPosts("", id),
  });
  return { posts, isLoading };
};

const useCommunity = (id: string) => {
  const { data: community, isLoading } = useQuery({
    queryKey: ["community", id],
    queryFn: () => CommunityClientService.getCommunity(id),
  });

  return {
    community,
    isLoading,
  };
};

function CommunityPage() {
  const { id } = useParams() as { id: string };
  const { community, isLoading } = useCommunity(id);
  const { posts, isLoading: isLoadingPosts } = useCommunityPosts(id);

  if (isLoading)
    return (
      <div>
        <CommunityFallback />
      </div>
    );

  return (
    <div className="border border-muted rounded-xl min-h-screen">
      <div className="m-2">
        <ReturnButton label="Return" description="Back To Previous Page" />
      </div>
      {community && (
        <div>
          <div className="relative">
            <div className="relative bg-muted h-56 w-full">
              {community.banner && (
                <Image
                  src={community.banner}
                  alt={community.name}
                  className="object-cover"
                  fill
                />
              )}
            </div>
            <Avatar className="size-[130px] absolute rounded-xl -translate-y-1/2 mx-4 ring-background ring-offset-transparent ring-4">
              <AvatarImage src={community.image || ""} className="rounded-xl" />
              <AvatarFallback className="rounded-xl">
                {formatUserNameForImage(community.name)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex justify-end m-3">
            <JoinButton communityId={community.id} />
          </div>
          <div className="my-8 m-3">
            <h1 className="text-xl font-semibold">{community.name}</h1>
            <p>{community.bio}</p>
            <time className="text-muted-foreground text-xs">
              Created {formatDate(community.created_at)}
            </time>
          </div>
          <div>
            {isLoadingPosts ? (
              <div className="flex justify-center items-center h-full">
                <Skeleton className="w-full h-full" />
              </div>
            ) : (
              posts && (
                <div>{posts?.map((id) => <Post key={id} id={id} />)}</div>
              )
            )}
            {posts && posts.length === 0 && (
              <div>
                <h1 className="text-center text-3xl font-semibold">No Posts</h1>
                <h1 className="text-muted-foreground text-sm text-center">
                  This Community has no posts yet
                </h1>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CommunityPage;
