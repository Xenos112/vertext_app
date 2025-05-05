"use client";
import React, { Suspense } from "react";
import UsersSuggestions from "./UsersFeed";
import CommunitiesFeed from "./CommunitiesFeed";
import UsersSuggestionsSkeleton from "./UsersFeedSkeleton";
import CommunitiesFeedSkeleton from "./CommunitiesFeedSkeleton";

export default function RightFloatMenu() {
  return (
    <div className="absolute top-12 right-12 space-y-6">
      <Suspense fallback={<UsersSuggestionsSkeleton />}>
        <UsersSuggestions />
      </Suspense>
      <Suspense fallback={<CommunitiesFeedSkeleton />}>
        <CommunitiesFeed />
      </Suspense>
    </div>
  );
}
