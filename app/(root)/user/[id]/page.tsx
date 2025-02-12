"use client";
import {
  fetchUserJoinedCommunities,
  getUserPosts,
} from "@/actions/user.actions";
import Community from "@/components/shared/Community";
import Post from "@/components/shared/Post";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

type UserPosts = Awaited<ReturnType<typeof getUserPosts>>["posts"];
type ActiveTabs = "posts" | "communities" | "likes";
type UserJoinedCommunities = Awaited<
  ReturnType<typeof fetchUserJoinedCommunities>
>["communities"];

export default function UserPage() {
  const { id } = useParams<{ id: string }>();
  const [userPosts, setUserPosts] = useState<UserPosts>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTabs>("communities");
  const [userJoinedCommunities, setUserJoinedCommunities] =
    useState<UserJoinedCommunities>([]);

  // fetching all the user posts
  useEffect(() => {
    getUserPosts(id)
      .then((data) => {
        if (data.error) {
          setError("Failed To fetch posts");
        } else {
          setUserPosts(data.posts);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchUserJoinedCommunities(id)
      .then((data) => {
        if (data.error) {
          setError("Failed To fetch Communities");
        } else {
          setUserJoinedCommunities(data.communities);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
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
        userPosts?.map((post) => <Post key={post.id} {...post} />)}
      {activeTab === "communities" && (
        <div className="my-3">
          {userJoinedCommunities?.map((community) => (
            <Community community={community.Community} key={community.communityId} />
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
