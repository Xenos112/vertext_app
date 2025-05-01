"use client";
import { getRecommendedCommunities } from "@/actions/user.actions";
import React, { Suspense } from "react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatUserNameForImage } from "@/utils/format-user_name-for-image";
import JoinCommunity from "@/features/community/components/JoinButton";
import sendToastEvent from "@/utils/sendToastEvent";
import UsersSuggestions from "./UsersSuggestions";
import UsersSuggestionsSkeleton from "./UsersSuggestionsSkeleton";

type SuggestedCommunitiesType = Awaited<
  ReturnType<typeof getRecommendedCommunities>
>["communities"];

export default function RightFloatMenu() {
  const [communities, setCommunities] = useState<SuggestedCommunitiesType>([]);

  useEffect(() => {
    getRecommendedCommunities().then((data) => {
      if (data.error) {
        sendToastEvent({
          variant: "destructive",
          title: "Error",
          description: data.error as string,
        });
      } else {
        setCommunities(data.communities);
      }
    });
  }, []);

  return (
    <div className="absolute top-12 right-12 space-y-6">
      <Suspense fallback={<UsersSuggestionsSkeleton />}>
        <UsersSuggestions />
      </Suspense>
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
