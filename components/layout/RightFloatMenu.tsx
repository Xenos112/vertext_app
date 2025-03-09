"use client";
import {
  getRecommendedCommunities,
  getRecommendedUsers,
} from "@/actions/user.actions";
import React from "react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatUserNameForImage } from "@/utils/format-user_name-for-image";
import FollowButton from "@/features/user/components/FollowButton";
import JoinCommunity from "@/features/community/components/JoinButton";

type SuggestedUsersType = Awaited<
  ReturnType<typeof getRecommendedUsers>
>["users"];
type SuggestedCommunitiesType = Awaited<
  ReturnType<typeof getRecommendedCommunities>
>["communities"];

// TODO: make the follow button work
export default function RightFloatMenu() {
  const [users, setUsers] = useState<SuggestedUsersType>();
  const [communities, setCommunities] = useState<SuggestedCommunitiesType>([]);

  useEffect(() => {
    getRecommendedUsers().then((data) => {
      if (data.error) {
        document.dispatchEvent(
          new CustomEvent("toast", {
            detail: {
              variant: "destructive",
              title: "Error",
              description: data.error as string,
            },
          }),
        );
      } else {
        setUsers(data.users);
      }
    });
  }, []);

  useEffect(() => {
    getRecommendedCommunities().then((data) => {
      if (data.error) {
        document.dispatchEvent(
          new CustomEvent("toast", {
            detail: {
              variant: "destructive",
              title: "Error",
              description: data.error as string,
            },
          }),
        );
      } else {
        setCommunities(data.communities);
      }
    });
  }, []);

  return (
    <div className="absolute top-12 right-12 space-y-6">
      {users && users?.length > 0 && (
        <div className="space-y-5">
          <h1 className="text-xl font-semibold">Who To Follow</h1>
          <div className="w-72 space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="size-[30px]">
                    <AvatarImage src={user.image_url!} />
                    <AvatarFallback className="text-xs">
                      {formatUserNameForImage(user.user_name)}
                    </AvatarFallback>
                  </Avatar>
                  <p>{user.user_name}</p>
                </div>
                <FollowButton userId={user.id}>Follow</FollowButton>
              </div>
            ))}
          </div>
        </div>
      )}
      {communities && communities.length > 0 && (
        <div className="space-y-5">
          <h1 className="text-xl font-semibold">Communities to Join</h1>
          <div className="w-72 space-y-4">
            {communities.map((community) => (
              <div
                key={community.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="size-[30px]">
                    <AvatarImage src={community.image!} />
                    <AvatarFallback className="text-xs">
                      {formatUserNameForImage(community.name)}
                    </AvatarFallback>
                  </Avatar>
                  <p>{community.name}</p>
                </div>
                <JoinCommunity communityId={community.id} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
