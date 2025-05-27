"use client";
import Post from "@/features/post/components/Post";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import UserClientService from "@/db/services/client/user.service";
import CommunityMembershipPreview from "./_components/CommunityMembershipPreview";
import { Suspense } from "react";
import CommunityMembershipPreviewSkeleton from "./_components/CommunityMembershipPreviewSkeleton";
import PostClientService from "@/db/services/client/post.service";

const useUserPosts = (userId: string) => {
  const {
    data: posts,
    isLoading,
    refetch: postsRefetch,
  } = useQuery({
    queryKey: ["posts", userId],
    queryFn: () => PostClientService.getPosts(userId),
    enabled: false,
  });

  return { posts, isLoading, postsRefetch };
};

const useUserMemberships = (userId: string) => {
  const {
    data: memberships,
    isLoading,
    refetch: membershipsRefetch,
  } = useQuery({
    queryKey: ["memberships", userId],
    queryFn: () => UserClientService.getUserMemberships(userId),
    enabled: false,
  });

  return { memberships, isLoading, membershipsRefetch };
};

// HACK: accpeted values of the activeTabs are "posts" | "communities" | "likes"
export default function UserPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useQueryState("t", {
    defaultValue: "posts",
  });

  const { memberships, membershipsRefetch } = useUserMemberships(id);
  const { posts, postsRefetch } = useUserPosts(id);

  const updateSearchParams = (type: string, fetcher: () => void) => {
    setActiveTab(type);
    fetcher();
  };

  return (
    <div className="p-3">
      <div className="flex justify-evenly items-center border-y border-muted p-3">
        <Button
          onClick={() => updateSearchParams("posts", postsRefetch)}
          variant={"ghost"}
          className="text-md w-full font-semibold"
        >
          Posts
        </Button>
        <Button
          onClick={() => updateSearchParams("communities", membershipsRefetch)}
          variant={"ghost"}
          className="text-md font-semibold w-full"
        >
          Communities
        </Button>
      </div>
      {activeTab === "posts" ? posts?.map((id) => <Post key={id} id={id} />) : null}
      {activeTab === "communities" ?
        memberships?.map((membership) => (
          <Suspense
            key={membership.communityId}
            fallback={<CommunityMembershipPreviewSkeleton />}
          >
            <CommunityMembershipPreview
              communityId={membership.communityId}
              createdAt={membership.createdAt}
              role={membership.role}
            />
          </Suspense>
        )) : null}
      {activeTab === "likes" && (
        <div>
          <h1>likes</h1>
        </div>
      )}
    </div>
  );
}
