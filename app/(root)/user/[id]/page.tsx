"use client";
import getUserPosts from "@/features/user/api/getUserPosts";
import Community from "@/components/shared/Community";
import Post from "@/features/post/components/Post";
import { Button } from "@/components/ui/button";
import { redirect, useParams } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import getUserJoinedCommunities from "@/features/community/api/getUserCommunities";

type ActiveTabs = "posts" | "communities" | "likes";

// TODO: the tabs should be in the searchParams to be dynamic
export default function UserPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<ActiveTabs>("communities");

  if (!id) {
    return redirect("/");
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: userPosts } = useQuery({
    queryKey: ["user-posts", id],
    queryFn: () => getUserPosts(id!),
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: userJoinedCommunities } = useQuery({
    queryKey: ["user-joined-communities", id],
    queryFn: () => getUserJoinedCommunities(id!),
  });

  return (
    <div className="p-3">
      <div className="flex justify-evenly items-center border-y border-muted p-3">
        <Button
          onClick={() => setActiveTab("posts")}
          variant={"ghost"}
          className="text-md w-full font-semibold"
        >
          Posts
        </Button>
        <Button
          onClick={() => setActiveTab("communities")}
          variant={"ghost"}
          className="text-md font-semibold w-full"
        >
          Communities
        </Button>
        <Button
          onClick={() => setActiveTab("likes")}
          variant={"ghost"}
          className="text-md w-full font-semibold"
        >
          Likes
        </Button>
      </div>
      {activeTab === "posts" &&
        userPosts?.map((post) => <Post key={post.id} post={post} />)}
      {activeTab === "communities" && (
        <div className="my-3">
          {userJoinedCommunities?.map((community) => (
            <Community community={community} key={community.id} />
          ))}
        </div>
      )}
      {activeTab === "likes" && (
        <div>
          <h1>likes</h1>
        </div>
      )}
    </div>
  );
}
